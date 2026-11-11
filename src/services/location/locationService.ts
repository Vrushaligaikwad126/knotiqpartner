import { Platform, PermissionsAndroid } from 'react-native';

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  cityName?: string;
  region?: string;
  country?: string;
}

// Default Nautical Port Coordinates (Dubai Marina, primary knotIQ charter hub)
export const DEFAULT_COORDINATES: UserCoordinates = {
  latitude: 25.0772,
  longitude: 55.1333,
  cityName: 'Dubai Marina',
  region: 'Dubai',
  country: 'UAE',
};

/**
 * Request device location permissions on Android
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'KnotIQ Location Permission',
        message: 'KnotIQ needs access to your location to fetch real-time maritime weather and passage conditions.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.log('Location permission request error:', err);
    return false;
  }
};

/**
 * Try to resolve coordinates via device geolocation (navigator.geolocation)
 */
const getDeviceCoordinates = (): Promise<UserCoordinates | null> => {
  return new Promise((resolve) => {
    const nav = typeof globalThis !== 'undefined' ? (globalThis as any).navigator : undefined;
    if (nav && nav.geolocation) {
      nav.geolocation.getCurrentPosition(
        (position: any) => {
          if (position?.coords) {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              cityName: 'Current Location',
            });
          } else {
            resolve(null);
          }
        },
        (error: any) => {
          console.log('Device geolocation error/timeout:', error?.message);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      resolve(null);
    }
  });
};

/**
 * Fallback to IP-based Geolocation when GPS is not enabled or on emulators
 */
const getIPCoordinates = async (): Promise<UserCoordinates | null> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          cityName: data.city || data.region || 'Current Location',
          region: data.region,
          country: data.country_name,
        };
      }
    }
  } catch (err) {
    console.log('IP location fallback attempt failed:', err);
  }

  try {
    // Secondary IP fallback
    const res2 = await fetch('https://ipwho.is/');
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2 && data2.success && typeof data2.latitude === 'number') {
        return {
          latitude: data2.latitude,
          longitude: data2.longitude,
          cityName: data2.city || 'Current Location',
          region: data2.region,
          country: data2.country,
        };
      }
    }
  } catch (err2) {
    console.log('Secondary IP location fallback error:', err2);
  }

  return null;
};

/**
 * Main helper to retrieve user's latitude and longitude dynamically
 */
export const getUserCoordinates = async (): Promise<UserCoordinates> => {
  // 1. Check & request permission on Android
  await requestLocationPermission();

  // 2. Try native device GPS
  const deviceLocation = await getDeviceCoordinates();
  if (deviceLocation) {
    return deviceLocation;
  }

  // 3. Fallback to IP geolocation
  const ipLocation = await getIPCoordinates();
  if (ipLocation) {
    return ipLocation;
  }

  // 4. Default to Dubai Marina hub
  return DEFAULT_COORDINATES;
};

export default getUserCoordinates;
