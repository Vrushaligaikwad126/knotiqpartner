import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getBookingById,
  updateBookingStatus,
  BoardingStatus,
  BookingItem,
} from '../../../services';

export interface GuestProfileScreenProps {
  bookingId?: string | number;
  tripTitle?: string;
  onBack?: () => void;
  onDismiss?: () => void;
  onCallPrimary?: () => void;
  onSendSMS?: () => void;
  onAddCrewNote?: () => void;
  onToggleArrived?: () => void;
}

export const GuestProfileScreen: React.FC<GuestProfileScreenProps> = ({
  bookingId,
  tripTitle = 'ISLAND EXPLORER',
  onBack,
  onDismiss,
  onCallPrimary,
  onSendSMS,
  onAddCrewNote,
  onToggleArrived,
}) => {
  const insets = useSafeAreaInsets();
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [boardingStatus, setBoardingStatus] = useState<BoardingStatus>('Pending');
  const [boardedAt, setBoardedAt] = useState<string | null>(null);

  // Fetch real booking info if bookingId is provided
  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      const targetId = bookingId || '1';
      try {
        setLoading(true);
        const res = await getBookingById(targetId);
        if (isMounted && res?.data) {
          setBooking(res.data);
          if (res.data.boardingStatus) {
            setBoardingStatus(res.data.boardingStatus as BoardingStatus);
          }
          if (res.data.boardedAt) {
            setBoardedAt(res.data.boardedAt);
          }
        }
      } catch (err) {
        console.log('Error loading booking in GuestProfileScreen:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  // Call the update booking status API
  const handleUpdateBoarding = async (targetBoardingStatus: BoardingStatus) => {
    try {
      setIsUpdating(true);
      const targetId = bookingId || booking?.id || '1';
      const nowIso = new Date().toISOString();

      const payload = {
        bookingStatus: 'Accepted',
        boardingStatus: targetBoardingStatus,
        boardedAt: targetBoardingStatus === 'Boarded' ? nowIso : null,
      };

      const res = await updateBookingStatus(targetId, payload);

      setBoardingStatus(targetBoardingStatus);
      if (targetBoardingStatus === 'Boarded') {
        setBoardedAt(nowIso);
      } else {
        setBoardedAt(null);
      }

      Alert.alert(
        'Status Updated',
        `Guest marked as "${targetBoardingStatus}" with booking status "Accepted".`
      );

      onToggleArrived?.();
    } catch (err: any) {
      console.log('Error calling updateBookingStatus:', err);
      Alert.alert(
        'Update Failed',
        err.message || 'Could not update booking status on server.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const guestName =
    booking?.user?.name?.trim() ||
    booking?.primaryGuest?.name ||
    'Sarah Johnson';

  const initials = guestName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const phone =
    booking?.user?.mobileNo ||
    booking?.primaryGuest?.phone ||
    '+1 305 555 0142';

  const email =
    booking?.user?.email ||
    booking?.primaryGuest?.email ||
    'sarah.j@coastalmail.com';

  const guestCount = booking?.guests || booking?.totalGuests || 12;
  const bookingRef =
    booking?.bookingId || (booking?.id ? `#${booking.id}` : '#KQ-9842');

  const formattedBoardedTime = boardedAt
    ? new Date(boardedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '10:14 AM';

  const isBoarded = boardingStatus === 'Boarded';

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7F9]" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <View className="flex-row items-center justify-between px-4 py-2.5 bg-[#F4F7F9]">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack || onDismiss}
            className="w-9 h-9 items-center justify-center mr-2 rounded-full active:bg-slate-200"
          >
            <Text className="text-xl font-bold text-slate-900">←</Text>
          </TouchableOpacity>
          <View>
            <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              {booking?.yacht?.name || tripTitle}
            </Text>
            <Text className="text-base font-extrabold text-slate-900 leading-5">
              Guest Boarding Details
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onDismiss || onBack}
          className="w-8 h-8 rounded-full bg-slate-200 items-center justify-center"
        >
          <Text className="text-xs font-bold text-slate-700">✕</Text>
        </TouchableOpacity>
      </View>

      {/* Main Elevated Profile Card / Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom + 16, 32),
        }}
      >
        <View
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 3,
          }}
          className="bg-white rounded-3xl p-5 border border-slate-100"
        >
          {loading && (
            <View className="mb-3 items-center">
              <ActivityIndicator color="#1592A6" size="small" />
              <Text className="text-[10px] text-slate-400 mt-1">
                Loading live guest records...
              </Text>
            </View>
          )}

          {/* Avatar with Initials & Checkmark Badge */}
          <View className="items-center mb-2">
            <View className="relative">
              <View className="w-20 h-20 rounded-full bg-[#E0F5F8] items-center justify-center border border-cyan-100">
                <Text className="text-2xl font-black text-[#0E6C7C]">
                  {initials}
                </Text>
              </View>
              {/* Checkmark Badge */}
              <View
                className={`absolute bottom-0 right-0 w-6 h-6 rounded-full ${
                  isBoarded ? 'bg-[#10B981]' : 'bg-amber-500'
                } border-2 border-white items-center justify-center shadow-xs`}
              >
                <Text className="text-xs text-white font-extrabold leading-3">
                  {isBoarded ? '✓' : '●'}
                </Text>
              </View>
            </View>

            {/* Name */}
            <Text className="text-2xl font-extrabold text-slate-900 mt-2">
              {guestName}
            </Text>

            {/* Primary Booker Tag */}
            <View className="bg-[#E8F6F8] rounded px-2.5 py-0.5 mt-1 border border-cyan-100">
              <Text className="text-[10px] font-extrabold tracking-wide text-[#1592A6]">
                PRIMARY BOOKER
              </Text>
            </View>

            {/* Boarding Status Pill */}
            <View
              className={`rounded-full px-3.5 py-1 flex-row items-center mt-2.5 border ${
                isBoarded
                  ? 'bg-[#E6F8F2] border-[#BCEEDB]'
                  : boardingStatus === 'No-Show'
                  ? 'bg-rose-50 border-rose-200'
                  : boardingStatus === 'Departed'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <View
                className={`w-1.5 h-1.5 rounded-full mr-2 ${
                  isBoarded
                    ? 'bg-[#0D9468]'
                    : boardingStatus === 'No-Show'
                    ? 'bg-rose-500'
                    : boardingStatus === 'Departed'
                    ? 'bg-blue-500'
                    : 'bg-amber-500'
                }`}
              />
              <Text
                className={`text-xs font-semibold ${
                  isBoarded
                    ? 'text-[#0D7A5C]'
                    : boardingStatus === 'No-Show'
                    ? 'text-rose-700'
                    : boardingStatus === 'Departed'
                    ? 'text-blue-700'
                    : 'text-amber-700'
                }`}
              >
                {isBoarded
                  ? `Arrived & Boarded (${formattedBoardedTime})`
                  : `Status: ${boardingStatus}`}
              </Text>
            </View>
          </View>

          {/* Boarding Status Selector Tabs */}
          <View className="my-3">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-center">
              Update Boarding Status
            </Text>
            <View className="flex-row bg-[#F3F9FA] rounded-2xl p-1 border border-[#DCEDF2]">
              {(['Pending', 'Boarded', 'No-Show', 'Departed'] as BoardingStatus[]).map(
                (status) => {
                  const active = boardingStatus === status;
                  return (
                    <TouchableOpacity
                      key={status}
                      disabled={isUpdating}
                      onPress={() => handleUpdateBoarding(status)}
                      className={`flex-1 py-2 items-center justify-center rounded-xl ${
                        active
                          ? 'bg-white shadow-xs'
                          : 'bg-transparent'
                      }`}
                    >
                      <Text
                        className={`text-[10px] ${
                          active
                            ? 'font-black text-[#1592A6]'
                            : 'font-semibold text-slate-500'
                        }`}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          </View>

          {/* Quick Action Buttons: Call Primary / Send SMS */}
          <View className="flex-row items-center justify-between space-x-2.5 my-2">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onCallPrimary}
              className="flex-1 bg-[#EAF6F9] py-3 rounded-2xl flex-row items-center justify-center mr-2 border border-cyan-100/60"
            >
              <Text className="text-sm mr-2">📞</Text>
              <Text className="text-xs font-extrabold text-[#0E6C7C]">
                Call Primary
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onSendSMS}
              className="flex-1 bg-[#EAF6F9] py-3 rounded-2xl flex-row items-center justify-center border border-cyan-100/60"
            >
              <Text className="text-sm mr-2">💬</Text>
              <Text className="text-xs font-extrabold text-[#0E6C7C]">
                Send SMS
              </Text>
            </TouchableOpacity>
          </View>

          {/* Card 1: Party Details */}
          <View className="bg-[#F3F9FA] rounded-2xl p-4 mb-3 border border-[#E2F0F3]">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center">
                <Text className="text-base mr-1.5">👥</Text>
                <Text className="text-sm font-extrabold text-slate-900">
                  Party of {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                </Text>
              </View>
              <View
                className={`rounded-full px-2 py-0.5 border ${
                  isBoarded
                    ? 'bg-[#E6F8F2] border-[#BCEEDB]'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <Text
                  className={`text-[10px] font-bold ${
                    isBoarded ? 'text-[#0D7A5C]' : 'text-amber-700'
                  }`}
                >
                  {isBoarded ? 'ALL ONBOARD' : 'BOARDING PENDING'}
                </Text>
              </View>
            </View>

            {/* Cyan Progress Bar */}
            <View className="w-full bg-slate-200 h-1.5 rounded-full my-2 overflow-hidden">
              <View
                className={`h-full rounded-full ${
                  isBoarded ? 'w-full bg-[#1592A6]' : 'w-1/3 bg-amber-500'
                }`}
              />
            </View>

            <View className="flex-row items-center justify-between pt-1">
              <Text className="text-xs text-slate-500 font-medium">
                Booking Ref:{' '}
                <Text className="font-bold text-slate-700">{bookingRef}</Text>
              </Text>
              <Text className="text-xs font-semibold text-[#0D7A5C]">
                🛡️ Waivers Verified
              </Text>
            </View>
          </View>

          {/* Card 2: Contact, Medical, Life Jacket & Waiver Details */}
          <View className="bg-[#F0F7F9] rounded-2xl p-4 mb-3 border border-[#E2F0F3]">
            {/* Phone */}
            <View className="flex-row items-center justify-between py-2 border-b border-cyan-100/60">
              <View className="flex-row items-center">
                <View className="w-7 h-7 rounded-lg bg-white items-center justify-center mr-2.5 shadow-xs">
                  <Text className="text-xs">📞</Text>
                </View>
                <Text className="text-xs font-semibold text-slate-500">
                  Phone Number
                </Text>
              </View>
              <Text className="text-xs font-bold text-slate-900">{phone}</Text>
            </View>

            {/* Email */}
            <View className="flex-row items-center justify-between py-2 border-b border-cyan-100/60">
              <View className="flex-row items-center">
                <View className="w-7 h-7 rounded-lg bg-white items-center justify-center mr-2.5 shadow-xs">
                  <Text className="text-xs">✉️</Text>
                </View>
                <Text className="text-xs font-semibold text-slate-500">Email</Text>
              </View>
              <Text className="text-xs font-bold text-slate-900">{email}</Text>
            </View>

            {/* Life Jacket */}
            <View className="flex-row items-center justify-between py-2 border-b border-cyan-100/60">
              <View className="flex-row items-center">
                <View className="w-7 h-7 rounded-lg bg-white items-center justify-center mr-2.5 shadow-xs">
                  <Text className="text-xs">🦺</Text>
                </View>
                <Text className="text-xs font-semibold text-slate-500">
                  Life Jacket Size
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-xs font-bold text-slate-900 mr-1.5">
                  Adult Medium
                </Text>
                <View className="bg-[#E6F8F2] rounded px-1.5 py-0.5">
                  <Text className="text-[9px] font-bold text-[#0D7A5C]">
                    Fitted
                  </Text>
                </View>
              </View>
            </View>

            {/* Emergency Contact */}
            <View className="flex-row items-center justify-between py-2 border-b border-cyan-100/60">
              <View className="flex-row items-center">
                <View className="w-7 h-7 rounded-lg bg-white items-center justify-center mr-2.5 shadow-xs">
                  <Text className="text-xs">📇</Text>
                </View>
                <Text className="text-xs font-semibold text-slate-500">
                  Emergency Contact
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xs font-bold text-slate-900">
                  Contact on file
                </Text>
                <Text className="text-[10px] text-slate-400">{phone}</Text>
              </View>
            </View>

            {/* Signed Waivers */}
            <View className="flex-row items-center justify-between pt-2">
              <View className="flex-row items-center">
                <View className="w-7 h-7 rounded-lg bg-white items-center justify-center mr-2.5 shadow-xs">
                  <Text className="text-xs">✍️</Text>
                </View>
                <Text className="text-xs font-semibold text-slate-500">
                  Signed Waivers
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-1.5 h-1.5 rounded-full bg-[#0D9468] mr-1.5" />
                <Text className="text-xs font-bold text-[#0D9468]">
                  Verified Complete
                </Text>
              </View>
            </View>
          </View>

          {/* Card 3: Add Deck / Crew Note */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onAddCrewNote}
            className="bg-[#F0F7F9] rounded-2xl p-3.5 mb-4 border border-[#E2F0F3] flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-8 h-8 rounded-lg bg-white items-center justify-center mr-2.5 shadow-xs">
                <Text className="text-sm">📝</Text>
              </View>
              <View>
                <Text className="text-xs font-extrabold text-slate-900">
                  Add Deck / Crew Note
                </Text>
                <Text className="text-[10px] text-slate-400 mt-0.5">
                  Pin dietary or hospitality notes
                </Text>
              </View>
            </View>
            <Text className="text-slate-400 font-bold text-base">›</Text>
          </TouchableOpacity>

          {/* PRIMARY ACTION BUTTON: Mark as Arrived & Board */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={isUpdating}
            onPress={() =>
              handleUpdateBoarding(isBoarded ? 'Pending' : 'Boarded')
            }
            className={`w-full py-3.5 rounded-2xl items-center justify-center border mb-3 ${
              isBoarded
                ? 'bg-[#E8F8F2] border-[#BCEEDB]'
                : 'bg-[#1592A6] border-cyan-600'
            }`}
          >
            {isUpdating ? (
              <ActivityIndicator color={isBoarded ? '#0D7A5C' : '#FFFFFF'} size="small" />
            ) : (
              <View className="flex-row items-center">
                <Text className="text-sm mr-1.5">
                  {isBoarded ? '✓' : '🛥️'}
                </Text>
                <Text
                  className={`font-extrabold text-sm tracking-wide ${
                    isBoarded ? 'text-[#0D7A5C]' : 'text-white'
                  }`}
                >
                  {isBoarded
                    ? 'Guest Boarded (Tap to Undo)'
                    : 'Mark as Arrived (Board Guest)'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Dismiss Text Action */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onDismiss || onBack}
            className="py-1 items-center justify-center"
          >
            <Text className="text-slate-800 font-extrabold text-sm">
              Dismiss
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GuestProfileScreen;
