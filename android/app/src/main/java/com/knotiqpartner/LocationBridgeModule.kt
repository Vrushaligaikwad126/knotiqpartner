package com.knotiqpartner

import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.location.Address
import android.location.Geocoder
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import java.util.Locale

class LocationBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "LocationBridge"

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun getCurrentCoordinates(promise: Promise) {
        val context = reactApplicationContext

        val hasFine = ContextCompat.checkSelfPermission(
            context,
            android.Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        val hasCoarse = ContextCompat.checkSelfPermission(
            context,
            android.Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        if (!hasFine && !hasCoarse) {
            promise.reject("PERMISSION_DENIED", "Location permission is not granted on device")
            return
        }

        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager
        if (locationManager == null) {
            promise.reject("UNAVAILABLE", "Location service is unavailable on this device")
            return
        }

        // 1. Immediately inspect all providers for best last known location
        var bestLocation: Location? = null
        try {
            val allProviders = locationManager.allProviders
            for (provider in allProviders) {
                try {
                    val loc = locationManager.getLastKnownLocation(provider)
                    if (loc != null) {
                        if (bestLocation == null || loc.accuracy < bestLocation.accuracy) {
                            bestLocation = loc
                        }
                    }
                } catch (e: Exception) {}
            }
        } catch (e: Exception) {}

        // If we have any last known location on the device, return it immediately!
        // This gives instant response and works indoors without waiting for satellite fix
        if (bestLocation != null) {
            sendLocationResult(bestLocation, promise)
            return
        }

        // 2. If no cached location exists, request a live single update
        val mainHandler = Handler(Looper.getMainLooper())
        var resolved = false

        val locationListener = object : LocationListener {
            override fun onLocationChanged(location: Location) {
                if (!resolved) {
                    resolved = true
                    try {
                        locationManager.removeUpdates(this)
                    } catch (e: Exception) {}
                    sendLocationResult(location, promise)
                }
            }

            override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
            override fun onProviderEnabled(provider: String) {}
            override fun onProviderDisabled(provider: String) {}
        }

        // Set timeout to 10 seconds
        val timeoutRunnable = Runnable {
            if (!resolved) {
                resolved = true
                try {
                    locationManager.removeUpdates(locationListener)
                } catch (e: Exception) {}

                if (bestLocation != null) {
                    sendLocationResult(bestLocation, promise)
                } else {
                    promise.reject("TIMEOUT", "Location request timed out. Please ensure GPS/Location is enabled.")
                }
            }
        }

        mainHandler.postDelayed(timeoutRunnable, 10000)

        mainHandler.post {
            var listenerRegistered = false
            for (provider in listOf(LocationManager.NETWORK_PROVIDER, LocationManager.GPS_PROVIDER)) {
                try {
                    if (locationManager.isProviderEnabled(provider)) {
                        locationManager.requestLocationUpdates(
                            provider,
                            500L,
                            0f,
                            locationListener,
                            Looper.getMainLooper()
                        )
                        listenerRegistered = true
                    }
                } catch (e: Exception) {}
            }

            if (!listenerRegistered && !resolved) {
                mainHandler.removeCallbacks(timeoutRunnable)
                resolved = true
                if (bestLocation != null) {
                    sendLocationResult(bestLocation, promise)
                } else {
                    promise.reject("NO_PROVIDER", "Location services/GPS are disabled in Android settings.")
                }
            }
        }
    }

    private fun sendLocationResult(location: Location, promise: Promise) {
        val map = Arguments.createMap()
        map.putDouble("latitude", location.latitude)
        map.putDouble("longitude", location.longitude)
        map.putDouble("accuracy", location.accuracy.toDouble())

        // Reverse geocode to resolve exact city and locality
        try {
            val geocoder = Geocoder(reactApplicationContext, Locale.getDefault())
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                geocoder.getFromLocation(location.latitude, location.longitude, 1) { addresses ->
                    handleAddresses(addresses, map, promise)
                }
            } else {
                @Suppress("DEPRECATION")
                val addresses = geocoder.getFromLocation(location.latitude, location.longitude, 1)
                handleAddresses(addresses, map, promise)
            }
        } catch (e: Exception) {
            map.putString("cityName", "Current Location")
            promise.resolve(map)
        }
    }

    private fun handleAddresses(addresses: List<Address>?, map: WritableMap, promise: Promise) {
        if (!addresses.isNullOrEmpty()) {
            val addr = addresses[0]
            val city = addr.locality ?: addr.subAdminArea ?: addr.adminArea ?: "Current Location"
            map.putString("cityName", city)
            map.putString("region", addr.adminArea ?: "")
            map.putString("country", addr.countryName ?: "")
        } else {
            map.putString("cityName", "Current Location")
        }
        promise.resolve(map)
    }
}
