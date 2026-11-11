import { apiClient } from './apiClient';
import { CaptainProfile, YachtDetails } from './authService';

export interface CrewMemberData extends CaptainProfile {
  phone?: string;
  emergencyContact?: string;
  licenseNumber?: string;
  rating?: number;
  totalTrips?: number;
  yacht?: YachtDetails;
  [key: string]: any;
}

export interface GetCrewByIdResponse {
  success?: boolean;
  message?: string;
  data?: CrewMemberData;
  [key: string]: any;
}

/**
 * Fetch Crew / Captain profile by dynamic ID
 * Endpoint: GET /knotiqapi/crews/getCrewById/:crewId
 */
export const getCrewById = async (
  crewId: string | number
): Promise<GetCrewByIdResponse> => {
  try {
    const response = await apiClient.get<GetCrewByIdResponse>(
      `/crews/getCrewById/${crewId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching crew details for ID ${crewId}:`, error);
    throw error;
  }
};

