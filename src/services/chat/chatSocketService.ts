import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '../api/chatService';

export const SOCKET_SERVER_URL = 'https://ioweb3.io';

export type MessageListener = (message: ChatMessage) => void;
export type TypingListener = (data: { conversationId: string | number }) => void;
export type MessageReadListener = (data: {
  conversationId: string | number;
  messageId: string | number;
}) => void;
export type OnlineStatusListener = (data: {
  participantKey: string;
  isOnline: boolean;
}) => void;

class ChatSocketService {
  private socket: Socket | null = null;
  private currentParticipantKey: string | null = null;
  private activeConversationId: string | number | null = null;

  private messageListeners: Set<MessageListener> = new Set();
  private typingListeners: Set<TypingListener> = new Set();
  private stopTypingListeners: Set<TypingListener> = new Set();
  private readListeners: Set<MessageReadListener> = new Set();
  private onlineStatusListeners: Set<OnlineStatusListener> = new Set();
  private processedMessageIds: Set<string> = new Set();

  /**
   * Connect to the Socket.io server
   */
  public connect(participantKey: string) {
    if (this.socket && this.socket.connected) {
      if (this.currentParticipantKey !== participantKey) {
        this.currentParticipantKey = participantKey;
        this.socket.emit('joinUser', { participantKey });
      }
      return;
    }

    this.currentParticipantKey = participantKey;

    try {
      this.socket = io(SOCKET_SERVER_URL, {
        path: '/knotiqapi/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        timeout: 10000,
      });

      this.setupSocketListeners();
    } catch (err) {
      console.log('Socket initialization error:', err);
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    // Clean up any previous listeners to prevent multiple callbacks
    this.socket.off('connect');
    this.socket.off('connected');
    this.socket.off('new_message');
    this.socket.off('message');
    this.socket.off('receive_message');
    this.socket.off('typing');
    this.socket.off('stopTyping');
    this.socket.off('message_read');
    this.socket.off('online_status');
    this.socket.off('user_online');
    this.socket.off('user_offline');
    this.socket.off('disconnect');
    this.socket.off('connect_error');

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      if (this.currentParticipantKey) {
        this.socket?.emit('joinUser', {
          participantKey: this.currentParticipantKey,
        });
      }
      if (this.activeConversationId) {
        this.socket?.emit('joinConversation', {
          conversationId: this.activeConversationId,
        });
      }
    });

    this.socket.on('connected', (data) => {
      console.log('Server confirmed socket connection:', data);
    });

    // Listen to new messages from server with deduplication
    const handleNewMessage = (msg: any) => {
      if (!msg) return;
      const msgId = msg.messageId || msg.id;
      if (msgId) {
        const idStr = String(msgId);
        if (this.processedMessageIds.has(idStr)) {
          return;
        }
        this.processedMessageIds.add(idStr);
        // Clear from cache after 30 seconds
        setTimeout(() => {
          this.processedMessageIds.delete(idStr);
        }, 30000);
      }

      console.log('📩 Socket received new message:', msg);
      this.messageListeners.forEach((listener) => listener(msg));
    };

    this.socket.on('new_message', handleNewMessage);
    this.socket.on('message', handleNewMessage);
    this.socket.on('receive_message', handleNewMessage);

    // Typing indicators
    this.socket.on('typing', (data) => {
      this.typingListeners.forEach((listener) => listener(data));
    });

    this.socket.on('stopTyping', (data) => {
      this.stopTypingListeners.forEach((listener) => listener(data));
    });

    // Message read receipts
    this.socket.on('message_read', (data) => {
      this.readListeners.forEach((listener) => listener(data));
    });

    // Online status updates
    this.socket.on('online_status', (data) => {
      this.onlineStatusListeners.forEach((listener) => listener(data));
    });

    this.socket.on('user_online', (data) => {
      this.onlineStatusListeners.forEach((listener) =>
        listener({ participantKey: data.participantKey, isOnline: true })
      );
    });

    this.socket.on('user_offline', (data) => {
      this.onlineStatusListeners.forEach((listener) =>
        listener({ participantKey: data.participantKey, isOnline: false })
      );
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.log('Socket connect error:', error.message);
    });
  }

  /**
   * Enter a specific conversation room
   */
  public joinConversation(conversationId: string | number) {
    this.activeConversationId = conversationId;
    if (this.socket && this.socket.connected) {
      this.socket.emit('joinConversation', { conversationId });
    }
  }

  /**
   * Leave a conversation room
   */
  public leaveConversation(conversationId: string | number) {
    if (this.activeConversationId === conversationId) {
      this.activeConversationId = null;
    }
    if (this.socket && this.socket.connected) {
      this.socket.emit('leaveConversation', { conversationId });
    }
  }

  /**
   * Send typing notification
   */
  public emitTyping(conversationId: string | number) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing', { conversationId });
    }
  }

  /**
   * Send stop typing notification
   */
  public emitStopTyping(conversationId: string | number) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('stopTyping', { conversationId });
    }
  }

  /**
   * Mark a message as read
   */
  public emitMessageRead(
    conversationId: string | number,
    messageId: string | number
  ) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message_read', { conversationId, messageId });
    }
  }

  /**
   * Check online status of another participant (e.g. Owner_12)
   */
  public checkOnlineStatus(participantKey: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('check_online_status', { participantKey });
    }
  }

  // Listener subscriptions
  public onNewMessage(listener: MessageListener) {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  public onTyping(listener: TypingListener) {
    this.typingListeners.add(listener);
    return () => this.typingListeners.delete(listener);
  }

  public onStopTyping(listener: TypingListener) {
    this.stopTypingListeners.add(listener);
    return () => this.stopTypingListeners.delete(listener);
  }

  public onMessageRead(listener: MessageReadListener) {
    this.readListeners.add(listener);
    return () => this.readListeners.delete(listener);
  }

  public onOnlineStatus(listener: OnlineStatusListener) {
    this.onlineStatusListeners.add(listener);
    return () => this.onlineStatusListeners.delete(listener);
  }

  /**
   * Disconnect socket completely
   */
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentParticipantKey = null;
    this.activeConversationId = null;
    this.messageListeners.clear();
    this.typingListeners.clear();
    this.stopTypingListeners.clear();
    this.readListeners.clear();
    this.onlineStatusListeners.clear();
  }
}

export const chatSocketService = new ChatSocketService();
export default chatSocketService;

