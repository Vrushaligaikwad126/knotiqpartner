import { apiClient } from './apiClient';
import { YachtDetails } from './authService';

export type BookingStatus = 'Pending' | 'Accepted' | 'Completed' | 'Cancelled' | '';

export interface GetAllBookingPayload {
  search?: string;
  start?: string | number;
  limit?: string | number;
  bookingStatus?: BookingStatus;
  yachtId?: string;
}

export interface BookingGuestInfo {
  name?: string;
  email?: string;
  phone?: string;
  occasion?: string;
  isPrimary?: boolean;
}

export interface BookingUser {
  userId?: number | string;
  name?: string;
  email?: string;
  mobileNo?: string;
  roleId?: number;
  [key: string]: any;
}

export interface BookingItem {
  bookingId?: string;
  _id?: string;
  id?: string;
  offerId?: string | null;
  conversationId?: string | null;
  yachtId?: string;
  userId?: string | number;
  bookingDate?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  duration?: string | number;
  guests?: number;
  totalGuests?: number;
  guestCount?: number;
  bookingStatus?: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled' | string;
  totalAmount?: string | number;
  paidAmount?: string | number;
  finalAmount?: string | number;
  remainingAmount?: string | number;
  discountAmount?: string | number;
  amount?: string | number;
  currency?: string;
  paymentGateway?: string;
  paymentStatus?: string;
  notes?: string;
  primaryGuest?: BookingGuestInfo;
  user?: BookingUser;
  yacht?: YachtDetails;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface GetAllBookingResponse {
  success?: boolean;
  message?: string;
  data?: BookingItem[];
  totalRecords?: number;
  total?: number;
  count?: number;
  bookingStatus?: string;
  yachtId?: string;
  start?: number;
  limit?: number;
  [key: string]: any;
}

/**
 * Fetch bookings for a yacht / captain
 * Endpoint: POST /knotiqapi/booking/getAllBooking
 */
export const getAllBooking = async (
  payload: GetAllBookingPayload
): Promise<GetAllBookingResponse> => {
  const response = await apiClient.post<GetAllBookingResponse>(
    '/booking/getAllBooking',
    {
      search: payload.search ?? '',
      start: String(payload.start ?? '0'),
      limit: String(payload.limit ?? '10'),
      bookingStatus: payload.bookingStatus ?? '',
      yachtId: payload.yachtId ?? '',
    }
  );
  return response.data;
};

/**
 * Convenience helper to fetch bookings by status (Accepted, Pending, Completed, Cancelled)
 */
export const getBookingsByStatus = async (
  yachtId: string,
  status: BookingStatus,
  limit: number = 10,
  start: number = 0,
  search: string = ''
): Promise<GetAllBookingResponse> => {
  return getAllBooking({
    yachtId,
    bookingStatus: status,
    limit,
    start,
    search,
  });
};

export interface GetBookingByIdResponse {
  success?: boolean;
  message?: string;
  data?: BookingItem;
  [key: string]: any;
}

/**
 * Fetch detailed booking information by ID
 * Endpoint: GET /knotiqapi/booking/getBookingById/:bookingId
 */
export const getBookingById = async (
  bookingId: string | number
): Promise<GetBookingByIdResponse> => {
  try {
    const response = await apiClient.get<GetBookingByIdResponse>(
      `/booking/getBookingById/${bookingId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
};

export type BoardingStatus = 'Pending' | 'Boarded' | 'No-Show' | 'Departed';

export interface UpdateBookingStatusPayload {
  bookingStatus?: string;
  boardingStatus?: BoardingStatus;
  boardedAt?: string | null;
  [key: string]: any;
}

export interface UpdateBookingStatusResponse {
  success?: boolean;
  message?: string;
  data?: any;
  [key: string]: any;
}

/**
 * Update booking status and guest boarding status
 * Endpoint: PATCH /knotiqapi/booking/updateBookingStatus/:bookingId
 */
export const updateBookingStatus = async (
  bookingId: string | number,
  payload: UpdateBookingStatusPayload
): Promise<UpdateBookingStatusResponse> => {
  try {
    const response = await apiClient.patch<UpdateBookingStatusResponse>(
      `/booking/updateBookingStatus/${bookingId}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

