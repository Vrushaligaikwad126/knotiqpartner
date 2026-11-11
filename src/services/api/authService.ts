import { apiClient, setAuthToken } from './apiClient';
import { saveAuthSession } from '../storage/storageService';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface YachtDetails {
  yachtId: string;
  sequenceId?: string;
  ownerId?: string;
  categoryId?: string;
  locationId?: string;
  name: string;
  model?: string;
  description?: string;
  year?: number;
  yachtType?: string;
  length?: number;
  capacity?: number;
  amenities?: string[];
  thumbnail?: string[];
  images?: string[];
  perDay?: string;
  perHour?: string;
  perWeek?: string;
  isInstantBooking?: boolean;
  note?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CaptainProfile {
  crewId: string;
  yachtId: string;
  name: string;
  email: string;
  role: string;
  experience?: string;
  language?: string;
  certifications?: string[];
  about?: string;
  profilePicture?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  yacht?: YachtDetails;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  role?: string;
  token?: string;
  data?: CaptainProfile;
}

/**
 * Captain / Yacht Owner Login API
 * Endpoint: POST /knotiqapi/yachtsOwners/login
 */
export const loginService = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/yachtsOwners/login', payload);
  
  // Auto-configure the Authorization token for subsequent requests
  if (response.data?.token) {
    setAuthToken(response.data.token);
    if (response.data?.data) {
      await saveAuthSession(response.data.token, response.data.data);
    }
  }
  
  return response.data;
};
