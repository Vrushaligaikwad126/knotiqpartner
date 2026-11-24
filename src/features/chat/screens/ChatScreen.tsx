import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Image,
  Keyboard,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getBookingConversation,
  sendChatMessage,
  getConversationMessages,
  ChatMessage,
  Conversation,
  chatSocketService,
  getAuthSession,
} from '../../../services';

export interface ChatScreenProps {
  bookingId?: string | number;
  initialConversationId?: string | number;
  recipientName?: string;
  recipientRole?: string;
  onBack?: () => void;
  onCallRecipient?: () => void;
}

const QUICK_CHIPS = [
  'Vessel Ready ⚓',
  'Guests Boarded ✅',
  'Engine Tested ⚙️',
  'Running on Schedule ⏱️',
];

export const ChatScreen: React.FC<ChatScreenProps> = ({
  bookingId = '1',
  initialConversationId,
  recipientName: propRecipientName,
  recipientRole = 'Owner',
  onBack,
  onCallRecipient,
}) => {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [isRecipientOnline, setIsRecipientOnline] = useState(false);
  const [currentCaptainId, setCurrentCaptainId] = useState<string>('3');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const typingTimeoutRef = useRef<any>(null);
  const isSendingRef = useRef(false);
  const currentCaptainIdRef = useRef(currentCaptainId);

  useEffect(() => {
    currentCaptainIdRef.current = currentCaptainId;
  }, [currentCaptainId]);

  // Keyboard show/hide listener to manage view adjustment and auto-scrolling
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => {
      setIsKeyboardOpen(true);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // 1. Initialize conversation and socket connection
  useEffect(() => {
    let isMounted = true;

    const setupChat = async () => {
      try {
        setLoading(true);

        // Resolve current captain identity
        const session = await getAuthSession();
        const captainId = String(session.captain?.crewId || '3');
        if (isMounted) setCurrentCaptainId(captainId);

        // Connect user socket
        const participantKey = `Captain_${captainId}`;
        chatSocketService.connect(participantKey);

        // Fetch or create OWNER_CAPTAIN conversation for this booking
        const res = await getBookingConversation(bookingId);
        if (isMounted && res?.data) {
          const conv = res.data;
          setConversation(conv);

          const convId = conv.conversationId;
          chatSocketService.joinConversation(convId);

          // Check online status of Owner
          const ownerKey = `Owner_${conv.ownerId || '12'}`;
          chatSocketService.checkOnlineStatus(ownerKey);

          // Fetch message history
          const msgRes = await getConversationMessages(convId);
          if (isMounted && msgRes?.data && Array.isArray(msgRes.data)) {
            setMessages(msgRes.data);
          } else {
            // Seed a welcome operational message if fresh conversation
            setMessages([
              {
                messageId: 'welcome-1',
                conversationId: convId,
                senderType: 'Owner',
                senderId: conv.ownerId || '12',
                message: `Hello Captain! Operational channel opened for booking #${conv.bookingId || bookingId}. Please keep us updated on vessel preparation and guest boarding.`,
                messageType: 'TEXT',
                isRead: true,
                createdAt: new Date().toISOString(),
              },
            ]);
          }
        }
      } catch (err: any) {
        console.log('Error initializing chat conversation:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setupChat();

    // 2. Set up real-time socket subscriptions
    const unsubMessage = chatSocketService.onNewMessage((newMsg: ChatMessage) => {
      setMessages((prev) => {
        const newMsgIdStr = String(newMsg.messageId);

        // 1. Prevent duplicate appending if ID already exists
        if (prev.some((m) => String(m.messageId) === newMsgIdStr)) {
          return prev;
        }

        // 2. If this message was sent by the current captain, reconcile with any optimistic temp placeholder
        const isCaptain =
          newMsg.senderType === 'Captain' ||
          String(newMsg.senderId) === String(currentCaptainIdRef.current);

        if (isCaptain) {
          const tempIdx = prev.findIndex(
            (m) =>
              String(m.messageId).startsWith('temp-') &&
              m.message?.trim() === newMsg.message?.trim()
          );

          if (tempIdx !== -1) {
            const next = [...prev];
            next[tempIdx] = newMsg;
            return next;
          }
        }

        return [...prev, newMsg];
      });

      // Mark message as read if received from others
      if (
        conversation?.conversationId &&
        newMsg.senderType !== 'Captain' &&
        String(newMsg.senderId) !== String(currentCaptainIdRef.current)
      ) {
        chatSocketService.emitMessageRead(
          conversation.conversationId,
          newMsg.messageId
        );
      }

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 80);
    });

    const unsubTyping = chatSocketService.onTyping(() => {
      setIsOtherTyping(true);
    });

    const unsubStopTyping = chatSocketService.onStopTyping(() => {
      setIsOtherTyping(false);
    });

    const unsubOnline = chatSocketService.onOnlineStatus((data) => {
      setIsRecipientOnline(data.isOnline);
    });

    const unsubRead = chatSocketService.onMessageRead((data) => {
      setMessages((prev) =>
        prev.map((m) =>
          String(m.messageId) === String(data.messageId)
            ? { ...m, isRead: true, readAt: new Date().toISOString() }
            : m
        )
      );
    });

    return () => {
      isMounted = false;
      if (conversation?.conversationId) {
        chatSocketService.leaveConversation(conversation.conversationId);
      }
      unsubMessage();
      unsubTyping();
      unsubStopTyping();
      unsubOnline();
      unsubRead();
    };
  }, [bookingId]);

  // Handle typing input emit
  const handleTextChange = (text: string) => {
    setInputText(text);

    if (conversation?.conversationId) {
      chatSocketService.emitTyping(conversation.conversationId);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (conversation?.conversationId) {
          chatSocketService.emitStopTyping(conversation.conversationId);
        }
      }, 1500);
    }
  };

  // Send a message via REST & Socket
  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend !== undefined ? textToSend : inputText;
    const trimmed = rawText.trim();
    if (!trimmed || isSendingRef.current || sending) return;

    isSendingRef.current = true;
    setSending(true);

    const convId = conversation?.conversationId || initialConversationId || '1';

    // Optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      messageId: tempId,
      conversationId: convId,
      senderType: 'Captain',
      senderId: currentCaptainIdRef.current || currentCaptainId,
      message: trimmed,
      messageType: 'TEXT',
      bookingId: typeof bookingId === 'number' ? bookingId : Number(bookingId) || null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    if (textToSend === undefined) {
      setInputText('');
    }

    if (conversation?.conversationId) {
      chatSocketService.emitStopTyping(conversation.conversationId);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);

    try {
      const res = await sendChatMessage({
        conversationId: convId,
        message: trimmed,
        messageType: 'TEXT',
        bookingId: String(bookingId),
      });

      if (res?.data) {
        const realMsg = res.data;
        setMessages((prev) => {
          // If socket already delivered and added or replaced the message
          const alreadyExists = prev.some(
            (m) => String(m.messageId) === String(realMsg.messageId)
          );

          if (alreadyExists) {
            // Remove the temporary optimistic placeholder if still lingering
            return prev.filter((m) => m.messageId !== tempId);
          }

          // Otherwise replace the temp placeholder with the real message
          return prev.map((m) => (m.messageId === tempId ? realMsg : m));
        });
      }
    } catch (err: any) {
      console.log('Error sending message:', err);
    } finally {
      isSendingRef.current = false;
      setSending(false);
    }
  };

  const recipientDisplayName =
    propRecipientName ||
    conversation?.owner?.name ||
    'Yacht Owner';

  const vesselName = conversation?.yacht?.name || '100’ NEDSHIP';
  const bookingSequence = conversation?.bookingId || String(bookingId);

  // Format message time
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7F9]" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* 1. Header with Recipient & Vessel Reference */}
      <View className="px-4 py-2.5 bg-white border-b border-slate-200/80 flex-row items-center justify-between shadow-xs">
        <View className="flex-row items-center flex-1 mr-2">
          {/* Back button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            className="w-9 h-9 items-center justify-center mr-2 rounded-full active:bg-slate-100"
          >
            <Text className="text-xl font-bold text-slate-800">←</Text>
          </TouchableOpacity>

          {/* Avatar with live status dot */}
          <View className="relative mr-2.5">
            {conversation?.owner?.profilePicture ? (
              <Image
                source={{ uri: conversation.owner.profilePicture }}
                className="w-10 h-10 rounded-full border border-slate-200"
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-[#E0F5F8] items-center justify-center border border-cyan-200">
                <Text className="text-sm font-extrabold text-[#0E6C7C]">
                  {recipientDisplayName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </Text>
              </View>
            )}

            {/* Online Indicator */}
            <View
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                isRecipientOnline ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            />
          </View>

          {/* Recipient Details & Vessel Tag */}
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text
                numberOfLines={1}
                className="text-base font-extrabold text-slate-900 mr-1.5"
              >
                {recipientDisplayName}
              </Text>
              <View className="bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100">
                <Text className="text-[9px] font-black text-cyan-800 uppercase">
                  {recipientRole}
                </Text>
              </View>
            </View>

            <Text numberOfLines={1} className="text-[11px] text-slate-400 font-medium">
              🛥️ {vesselName} · #{bookingSequence}
            </Text>
          </View>
        </View>

        {/* Action icons */}
        {onCallRecipient && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onCallRecipient}
            className="w-9 h-9 rounded-full bg-cyan-50 items-center justify-center border border-cyan-100"
          >
            <Text className="text-sm">📞</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 2. Chat Conversation View with Keyboard Avoidance */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={{ flex: 1 }}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#1592A6" size="large" />
            <Text className="text-xs text-slate-400 font-medium mt-2">
              Connecting to secure charter channel...
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            style={{ flex: 1 }}
            keyExtractor={(item, index) =>
              String(item.messageId || `msg-${index}`)
            }
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 16,
            }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            renderItem={({ item }) => {
              const isMine =
                item.senderType === 'Captain' ||
                String(item.senderId) === String(currentCaptainId);

              return (
                <View
                  className={`mb-3.5 flex-row ${
                    isMine ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <View
                    style={{
                      maxWidth: '78%',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: isMine ? 0.08 : 0.04,
                      shadowRadius: 4,
                      elevation: 1,
                    }}
                    className={`rounded-2xl p-3.5 ${
                      isMine
                        ? 'bg-[#1592A6] rounded-br-sm'
                        : 'bg-white border border-slate-100 rounded-bl-sm'
                    }`}
                  >
                    {/* Header for non-user messages */}
                    {!isMine && (
                      <Text className="text-[10px] font-extrabold text-cyan-800 mb-1">
                        {item.senderType}
                      </Text>
                    )}

                    {/* Special Message Types */}
                    {item.messageType === 'BOOKING' && (
                      <View className="bg-white/10 rounded-xl p-2 mb-1.5 border border-white/20">
                        <Text
                          className={`text-xs font-bold ${
                            isMine ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          📋 Booking Update
                        </Text>
                      </View>
                    )}

                    {/* Text Message Content */}
                    <Text
                      className={`text-sm leading-5 font-medium ${
                        isMine ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {item.message}
                    </Text>

                    {/* Footer: Time & Read Ticks */}
                    <View className="flex-row items-center justify-end mt-1 space-x-1">
                      <Text
                        className={`text-[9.5px] font-medium mr-1 ${
                          isMine ? 'text-white/70' : 'text-slate-400'
                        }`}
                      >
                        {formatTime(item.createdAt)}
                      </Text>
                      {isMine && (
                        <Text
                          className={`text-[9.5px] font-black ${
                            item.isRead ? 'text-cyan-200' : 'text-white/60'
                          }`}
                        >
                          {item.isRead ? '✓✓' : '✓'}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}

        {/* Typing indicator */}
        {isOtherTyping && (
          <View className="px-5 py-1.5 flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse mr-1.5" />
            <Text className="text-xs text-slate-400 italic">
              {recipientDisplayName} is typing...
            </Text>
          </View>
        )}

        {/* Quick Operational Chips */}
        <View className="bg-white/95 border-t border-slate-100 py-1.5 px-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            {QUICK_CHIPS.map((chip, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                disabled={sending}
                onPress={() => handleSendMessage(chip)}
                className={`border px-3 py-1 rounded-full mr-2 ${
                  sending
                    ? 'bg-slate-100 border-slate-200 opacity-60'
                    : 'bg-[#EAF5F8] border-[#D5EBF0]'
                }`}
              >
                <Text
                  className={`text-[11px] font-bold ${
                    sending ? 'text-slate-400' : 'text-[#0E6C7C]'
                  }`}
                >
                  {chip}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 3. Input Bar */}
        <View
          style={{
            paddingBottom: isKeyboardOpen
              ? Platform.OS === 'ios'
                ? 8
                : 10
              : Math.max(insets.bottom, 12),
          }}
          className="px-4 pt-2.5 bg-white border-t border-slate-200/80 flex-row items-center"
        >
          {/* Quick Pre-fill / Attachment Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-2 border border-slate-200"
          >
            <Text className="text-base">📎</Text>
          </TouchableOpacity>

          {/* Text Input */}
          <View className="flex-1 bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2 mr-2">
            <TextInput
              value={inputText}
              onChangeText={handleTextChange}
              placeholder={`Message ${recipientDisplayName}...`}
              placeholderTextColor="#94A3B8"
              multiline
              maxLength={500}
              style={{
                fontSize: 14,
                color: '#0F172A',
                maxHeight: 96,
                paddingVertical: Platform.OS === 'android' ? 2 : 0,
              }}
            />
          </View>

          {/* Send Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!inputText.trim() || sending}
            onPress={() => handleSendMessage()}
            className={`w-10 h-10 rounded-full items-center justify-center shadow-xs ${
              inputText.trim() && !sending
                ? 'bg-[#1592A6]'
                : 'bg-slate-200'
            }`}
          >
            {sending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-white text-base font-black">↑</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
