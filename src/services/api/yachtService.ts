import { apiClient } from './apiClient';
import { YachtDetails } from './authService';

export interface GetYachtByIdResponse {
  success?: boolean;
  message?: string;
  data?: YachtDetails;
  [key: string]: any;
}

/**
 * Fetch yacht details by yachtId
 * Endpoint: GET /knotiqapi/yachts/getYachtById/:id
 */
export const getYachtById = async (id: string | number): Promise<GetYachtByIdResponse> => {
  const response = await apiClient.get<GetYachtByIdResponse>(`/yachts/getYachtById/${id}`);
  return response.data;
};

export default getYachtById;

