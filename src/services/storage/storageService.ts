import AsyncStorage from '@react-native-async-storage/async-storage';
import { CaptainProfile } from '../api/authService';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@knotiq_auth_token',
  CAPTAIN_PROFILE: '@knotiq_captain_profile',
} as const;

/**
 * Save authentication token and captain profile to persistent storage
 */
export const saveAuthSession = async (
  token: string,
  captain: CaptainProfile
): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.CAPTAIN_PROFILE, JSON.stringify(captain));
  } catch (error) {
    console.error('Failed to save auth session to storage:', error);
  }
};

/**
 * Retrieve saved authentication session from storage
 */
export const getAuthSession = async (): Promise<{
  token: string | null;
  captain: CaptainProfile | null;
}> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const captainRaw = await AsyncStorage.getItem(STORAGE_KEYS.CAPTAIN_PROFILE);
    const captain: CaptainProfile | null = captainRaw ? JSON.parse(captainRaw) : null;

    return { token, captain };
  } catch (error) {
    console.error('Failed to read auth session from storage:', error);
    return { token: null, captain: null };
  }
};

/**
 * Clear authentication session on logout
 */
export const clearAuthSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.CAPTAIN_PROFILE);
  } catch (error) {
    console.error('Failed to clear auth session from storage:', error);
  }
};
