import { apiClient } from './apiClient';

export type ParticipantType = 'User' | 'Agent' | 'Owner' | 'Captain';
export type ConversationType = 'CUSTOMER_OWNER' | 'OWNER_CAPTAIN';
export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'OFFER' | 'BOOKING';

export interface ConversationParticipant {
  id?: number | string;
  conversationId: number | string;
  participantType: ParticipantType;
  participantId: number | string;
  participantKey: string;
}

export interface Conversation {
  conversationId: number | string;
  yachtId: number | string;
  ownerId: number | string;
  type?: ConversationType;
  bookingId?: string | null;
  captainId?: number | string | null;
  customerId?: number | string | null;
  customerType?: ParticipantType | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  status?: 'ACTIVE' | 'CLOSED';
  createdAt?: string;
  updatedAt?: string;
  owner?: {
    ownerId?: string | number;
    name?: string;
    email?: string;
    profilePicture?: string | null;
  };
  captain?: {
    crewId?: string | number;
    name?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
    profilePicture?: string | null;
  };
  yacht?: {
    yachtId?: string | number;
    name?: string;
  };
  booking?: {
    id?: number | string;
    bookingId?: string;
    bookingDate?: string;
    startTime?: string;
    endTime?: string;
    bookingStatus?: string;
    boardingStatus?: string;
  };
}

export interface ChatMessage {
  messageId: number | string;
  conversationId: number | string;
  senderType: ParticipantType;
  senderId: number | string;
  message?: string | null;
  messageType?: MessageType;
  offerId?: number | string | null;
  bookingId?: number | string | null;
  isRead?: boolean;
  readAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface StartConversationPayload {
  yachtId: number | string;
  customerId?: number | string;
  customerType?: ParticipantType;
  bookingId?: string | number;
  enquiryToken?: string;
}

export interface SendMessagePayload {
  conversationId: number | string;
  message?: string;
  messageType?: MessageType;
  offerId?: number | string | null;
  bookingId?: string | number | null;
  enquiryToken?: string;
}

export interface GetBookingConversationResponse {
  success: boolean;
  isExisting?: boolean;
  message?: string;
  data?: Conversation;
}

export interface SendMessageResponse {
  success: boolean;
  message?: string;
  data?: ChatMessage;
}

export interface GetMessagesResponse {
  success: boolean;
  data?: ChatMessage[];
  message?: string;
}

/**
 * 1. Fetch or initiate the OWNER_CAPTAIN conversation for a specific booking
 * Endpoint: POST /chat/getBookingConversation (or /conversation/getBookingConversation)
 * Used by Captain & Owner to load the shared chat channel for a booking.
 */
export const getBookingConversation = async (
  bookingId: string | number
): Promise<GetBookingConversationResponse> => {
  try {
    const response = await apiClient.post<GetBookingConversationResponse>(
      '/chat/getBookingConversation',
      { bookingId }
    );
    return response.data;
  } catch (error: any) {
    try {
      const fallbackResponse = await apiClient.post<GetBookingConversationResponse>(
        '/conversation/getBookingConversation',
        { bookingId }
      );
      return fallbackResponse.data;
    } catch {
      throw error;
    }
  }
};

/**
 * 2. Start or retrieve a conversation
 * Endpoint: POST /conversation/startConversation
 */
export const startConversation = async (
  yachtIdOrPayload: number | string | StartConversationPayload,
  bookingId?: number | string,
  enquiryToken?: string
): Promise<GetBookingConversationResponse> => {
  let payload: Record<string, any>;
  let token: string | undefined = enquiryToken;

  if (typeof yachtIdOrPayload === 'object') {
    payload = { ...yachtIdOrPayload };
    token = yachtIdOrPayload.enquiryToken || enquiryToken;
  } else {
    payload = { yachtId: Number(yachtIdOrPayload) };
    if (bookingId) payload.bookingId = bookingId;
  }

  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined;

  const response = await apiClient.post<GetBookingConversationResponse>(
    '/conversation/startConversation',
    payload,
    config
  );
  return response.data;
};

/**
 * 3. Send a message
 * Endpoint: POST /message/sendMessage
 */
export const sendMessage = async (
  conversationId: number | string,
  message: string,
  messageType: MessageType = 'TEXT',
  offerId?: number | string | null,
  enquiryToken?: string,
  bookingId?: string | number | null
): Promise<SendMessageResponse> => {
  const payload: Record<string, any> = {
    conversationId: Number(conversationId),
    message,
    messageType,
  };
  if (offerId) payload.offerId = Number(offerId);
  if (bookingId) payload.bookingId = bookingId;

  const config = enquiryToken
    ? { headers: { Authorization: `Bearer ${enquiryToken}` } }
    : undefined;

  try {
    const response = await apiClient.post<SendMessageResponse>(
      '/message/sendMessage',
      payload,
      config
    );
    return response.data;
  } catch (error: any) {
    try {
      const fallback = await apiClient.post<SendMessageResponse>(
        '/conversation/sendMessage',
        payload,
        config
      );
      return fallback.data;
    } catch {
      throw error;
    }
  }
};

/**
 * Convenience wrapper for sending chat messages via SendMessagePayload object
 */
export const sendChatMessage = async (
  payload: SendMessagePayload
): Promise<SendMessageResponse> => {
  return sendMessage(
    payload.conversationId,
    payload.message || '',
    payload.messageType || 'TEXT',
    payload.offerId,
    payload.enquiryToken,
    payload.bookingId
  );
};

/**
 * 4. Get message history for a conversation
 * Endpoint: POST /message/getMessagesByConversationId
 * Body: { conversationId, start, limit }
 */
export const getMessagesByConversationId = async (
  conversationId: number | string,
  start: number = 0,
  limit: number = 50
): Promise<GetMessagesResponse> => {
  try {
    const response = await apiClient.post<GetMessagesResponse>(
      '/message/getMessagesByConversationId',
      {
        conversationId: Number(conversationId),
        start,
        limit,
      }
    );
    return response.data;
  } catch {
    try {
      const fallback = await apiClient.post<GetMessagesResponse>(
        '/conversation/getMessages',
        {
          conversationId: Number(conversationId),
          start,
          limit,
        }
      );
      return fallback.data;
    } catch {
      return { success: true, data: [] };
    }
  }
};

/**
 * Alias for getMessagesByConversationId for backwards compatibility
 */
export const getConversationMessages = getMessagesByConversationId;

/**
 * 5. Get all conversations for a user
 * Endpoint: GET /conversation/getUserConversationsByUserId/:userId
 */
export const getUserConversations = async (userId: number | string) => {
  const response = await apiClient.get(
    `/conversation/getUserConversationsByUserId/${userId}`
  );
  return response.data;
};
