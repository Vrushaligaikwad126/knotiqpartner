import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'https://ioweb3.io/knotiqapi/';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = () => authToken;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Auth Token if available (from memory or AsyncStorage)
apiClient.interceptors.request.use(
  async (config) => {
    if (!authToken) {
      try {
        const savedToken = await AsyncStorage.getItem('@knotiq_auth_token');
        if (savedToken) {
          authToken = savedToken;
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
      } catch (e) {
        // Fallback silently if storage read fails
      }
    }

    if (authToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format errors consistently
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Network request failed. Please check your connection.';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
