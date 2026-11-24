import { Platform, PermissionsAndroid, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { LocationBridge } = NativeModules;
const SAVED_LOCATION_KEY = '@knotiq_saved_location_coords';

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  cityName?: string;
  region?: string;
  country?: string;
}

// Fallback Port Coordinates if GPS is disabled or denied
export const DEFAULT_COORDINATES: UserCoordinates = {
  latitude: 25.0772,
  longitude: 55.1333,
  cityName: 'Dubai Marina',
  region: 'Dubai',
  country: 'UAE',
};

/**
 * Persist user location to AsyncStorage
 */
export const saveUserLocation = async (coords: UserCoordinates): Promise<void> => {
  try {
    await AsyncStorage.setItem(SAVED_LOCATION_KEY, JSON.stringify(coords));
  } catch (err) {
    console.log('Error saving location coords:', err);
  }
};

/**
 * Retrieve saved location from AsyncStorage
 */
export const getSavedLocation = async (): Promise<UserCoordinates | null> => {
  try {
    const raw = await AsyncStorage.getItem(SAVED_LOCATION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.latitude === 'number' && typeof parsed?.longitude === 'number') {
        return parsed;
      }
    }
  } catch (err) {
    console.log('Error reading saved location coords:', err);
  }
  return null;
};

/**
 * Clear saved location from AsyncStorage
 */
export const clearSavedLocation = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SAVED_LOCATION_KEY);
  } catch (err) {
    console.log('Error clearing saved location coords:', err);
  }
};

/**
 * Search cities worldwide using Open-Meteo Geocoding API (Fast, Free, No Key Required)
 */
export const searchCities = async (query: string): Promise<UserCoordinates[]> => {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=6&language=en&format=json`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.results)) {
        return data.results.map((item: any) => ({
          latitude: item.latitude,
          longitude: item.longitude,
          cityName: item.name,
          region: item.admin1 || item.country || '',
          country: item.country || '',
        }));
      }
    }
  } catch (err) {
    console.log('Error searching cities:', err);
  }
  return [];
};

/**
 * Reverse geocode latitude and longitude to human-readable city/locality
 */
export const reverseGeocodeCoords = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      return (
        data.city ||
        data.locality ||
        data.principalSubdivision ||
        null
      );
    }
  } catch (err) {
    console.log('Reverse geocoding error:', err);
  }
  return null;
};

/**
 * Request device location permissions on Android (supporting Android 12+ fine & coarse)
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    const fineGranted =
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED;
    const coarseGranted =
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED;

    return fineGranted || coarseGranted;
  } catch (err) {
    console.log('Location permission request error:', err);
    return false;
  }
};

/**
 * Native GPS Hardware lookup via Android LocationManager
 */
const getNativeCoordinates = async (): Promise<UserCoordinates | null> => {
  if (!LocationBridge || typeof LocationBridge.getCurrentCoordinates !== 'function') {
    return null;
  }

  try {
    const result = await LocationBridge.getCurrentCoordinates();
    if (
      result &&
      typeof result.latitude === 'number' &&
      typeof result.longitude === 'number'
    ) {
      let city = result.cityName;
      if (!city || city === 'Current Location') {
        const resolvedCity = await reverseGeocodeCoords(
          result.latitude,
          result.longitude
        );
        if (resolvedCity) city = resolvedCity;
      }

      const coords: UserCoordinates = {
        latitude: result.latitude,
        longitude: result.longitude,
        cityName: city || 'Current Location',
        region: result.region,
        country: result.country,
      };

      await saveUserLocation(coords);
      return coords;
    }
  } catch (err: any) {
    console.log('Native LocationBridge query error:', err?.message || err);
  }
  return null;
};

/**
 * Resolve device regional location via IPv4 to bypass carrier IPv6 Delhi routing
 */
const getIPv4Coordinates = async (): Promise<UserCoordinates | null> => {
  try {
    const ipRes = await fetch('https://api4.ipify.org?format=json');
    if (ipRes.ok) {
      const { ip } = await ipRes.json();
      if (ip) {
        const geoRes = await fetch(`https://ipwho.is/${ip}`);
        if (geoRes.ok) {
          const data = await geoRes.json();
          if (data?.success && typeof data.latitude === 'number') {
            const cityName = data.city || data.region || 'Current Location';
            // Only accept if not the Delhi carrier gateway
            if (cityName.toLowerCase() !== 'delhi') {
              return {
                latitude: data.latitude,
                longitude: data.longitude,
                cityName,
                region: data.region,
                country: data.country,
              };
            }
          }
        }
      }
    }
  } catch (e) {
    console.log('IPv4 geo lookup error:', e);
  }

  // Fallback to freeipapi
  try {
    const res = await fetch('https://freeipapi.com/api/json');
    if (res.ok) {
      const data = await res.json();
      if (typeof data?.latitude === 'number' && typeof data?.longitude === 'number') {
        const cityName = data.cityName || data.regionName || 'Current Location';
        if (cityName.toLowerCase() !== 'delhi') {
          return {
            latitude: data.latitude,
            longitude: data.longitude,
            cityName,
            region: data.regionName,
            country: data.countryName,
          };
        }
      }
    }
  } catch (e) {
    console.log('Backup IP lookup error:', e);
  }

  return null;
};

/**
 * Main helper to retrieve user's latitude and longitude dynamically
 * Checks saved selection -> Native GPS Hardware -> IPv4 regional -> Fallback
 */
export const getUserCoordinates = async (
  forceLiveDetect = false
): Promise<UserCoordinates> => {
  // 1. If not forcing a fresh GPS scan, check if user previously chose or saved a location
  if (!forceLiveDetect) {
    const saved = await getSavedLocation();
    if (saved) {
      return saved;
    }
  }

  // 2. Request permission and query Native Android GPS hardware
  const hasPermission = await requestLocationPermission();
  if (hasPermission) {
    const nativeLocation = await getNativeCoordinates();
    if (nativeLocation) {
      return nativeLocation;
    }
  }

  // 3. Fallback to IPv4 regional detection
  const ipLocation = await getIPv4Coordinates();
  if (ipLocation) {
    await saveUserLocation(ipLocation);
    return ipLocation;
  }

  // 4. Fallback Port Coordinates
  return DEFAULT_COORDINATES;
};

export default getUserCoordinates;
