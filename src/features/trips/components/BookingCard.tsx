import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { BookingItem } from '../../../services';
import { BoatIcon } from '../../../components/common/Icons';

export interface BookingCardProps {
  booking: BookingItem;
  onPressCard?: () => void;
  onPressAction?: () => void;
}

export const formatTime12h = (timeStr?: string): string => {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  if (isNaN(hours)) return timeStr;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
};

export const formatBookingDate = (
  dateStr?: string
): { dayOfWeek: string; dateFormatted: string } => {
  if (!dateStr) return { dayOfWeek: 'Scheduled', dateFormatted: '' };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { dayOfWeek: 'Scheduled', dateFormatted: dateStr };
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateFormatted = d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return { dayOfWeek, dateFormatted };
  } catch {
    return { dayOfWeek: 'Scheduled', dateFormatted: dateStr };
  }
};

export const computeDuration = (startTime?: string, endTime?: string): string => {
  if (!startTime || !endTime) return '4 hrs';
  const sParts = startTime.split(':').map(Number);
  const eParts = endTime.split(':').map(Number);
  if (sParts.length >= 2 && eParts.length >= 2) {
    const sMinutes = sParts[0] * 60 + sParts[1];
    const eMinutes = eParts[0] * 60 + eParts[1];
    const diff = eMinutes - sMinutes;
    if (diff > 0) {
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      if (m === 0) return `${h} hrs`;
      return `${h}h ${m}m`;
    }
  }
  return '4 hrs';
};

const getInitials = (name?: string): string => {
  if (!name) return 'VIP';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPressCard,
  onPressAction,
}) => {
  const status = (booking.bookingStatus || 'Pending').toLowerCase();
  const isPending = status === 'pending';
  const isAccepted = status === 'accepted';
  const isCompleted = status === 'completed';

  // Status Badge Configuration
  const badgeConfig = isPending
    ? {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-800',
        dot: 'bg-amber-500',
        label: 'Pending Approval',
      }
    : isAccepted
    ? {
        bg: 'bg-cyan-50',
        border: 'border-cyan-300',
        text: 'text-[#0E6C7C]',
        dot: 'bg-[#1592A6]',
        label: 'Confirmed',
      }
    : isCompleted
    ? {
        bg: 'bg-emerald-50',
        border: 'border-emerald-300',
        text: 'text-emerald-800',
        dot: 'bg-emerald-500',
        label: 'Completed',
      }
    : {
        bg: 'bg-rose-50',
        border: 'border-rose-300',
        text: 'text-rose-800',
        dot: 'bg-rose-500',
        label: 'Cancelled',
      };

  const startTimeFormatted = formatTime12h(booking.startTime) || '10:30 AM';
  const endTimeFormatted = formatTime12h(booking.endTime) || '02:30 PM';
  const duration = computeDuration(booking.startTime, booking.endTime);
  const { dayOfWeek, dateFormatted } = formatBookingDate(booking.bookingDate);

  const guestName = booking.user?.name?.trim() || 'VIP Guest';
  const guestCount = booking.guests || booking.totalGuests || 1;
  const guestInitials = getInitials(guestName);
  const profilePicture = booking.user?.profilePicture;

  const vesselName = booking.yacht?.name || '100’ NEDSHIP';
  const vesselSequence = booking.yacht?.sequenceId || 'KNY-0045';
  const vesselType = booking.yacht?.yachtType || 'Motor Superyacht';
  const totalAmount = booking.totalAmount || booking.finalAmount || '1200';
  const bookingIdDisplay = booking.bookingId || `#${booking.id || 'BOOKING'}`;

  const buttonLabel = isPending
    ? 'Review Charter Request'
    : isAccepted
    ? 'Manage Manifest & Boarding'
    : isCompleted
    ? 'View Charter Summary'
    : 'View Booking Details';

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPressCard}
      style={{
        shadowColor: '#072432',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
        elevation: 3,
      }}
      className="bg-white rounded-[26px] p-5 mb-5 border border-slate-200/80 overflow-hidden"
    >
      {/* Top Header: Vessel Identity & Status Badge */}
      <View className="flex-row items-center justify-between mb-3.5 pb-3 border-b border-slate-100">
        <View className="flex-row items-center flex-1 pr-2">
          <View className="w-10 h-10 rounded-2xl bg-[#E8F5F7] items-center justify-center border border-[#CFE8EE] mr-3">
            <BoatIcon size={20} color="#0E6C7C" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-base font-black text-slate-900 mr-2" numberOfLines={1}>
                {vesselName}
              </Text>
            </View>
            <Text className="text-[11px] font-bold text-slate-400 mt-0.5">
              {vesselSequence} • {vesselType}
            </Text>
          </View>
        </View>

        {/* Status Pill */}
        <View
          className={`flex-row items-center ${badgeConfig.bg} border ${badgeConfig.border} rounded-full px-3 py-1.5`}
        >
          <View className={`w-2 h-2 rounded-full ${badgeConfig.dot} mr-1.5`} />
          <Text className={`text-[11px] font-black ${badgeConfig.text}`}>
            {badgeConfig.label}
          </Text>
        </View>
      </View>

      {/* Itinerary / Flight-Style Boarding Pass Strip */}
      <View className="bg-[#F8FAFC] rounded-2xl p-3.5 mb-3.5 border border-slate-200/70">
        {/* Date Row */}
        <View className="flex-row items-center justify-between mb-3 pb-2 border-b border-slate-200/50">
          <View className="flex-row items-center">
            <Text className="text-xs mr-1.5">📅</Text>
            <Text className="text-xs font-black text-slate-800">
              {dayOfWeek ? `${dayOfWeek}, ` : ''}{dateFormatted}
            </Text>
          </View>
          <View className="bg-white px-2.5 py-0.5 rounded-full border border-slate-200/80">
            <Text className="text-[10px] font-extrabold text-slate-500 tracking-wider">
              {bookingIdDisplay}
            </Text>
          </View>
        </View>

        {/* Departure & Return Timeline */}
        <View className="flex-row items-center justify-between">
          {/* Departure */}
          <View className="flex-1">
            <Text className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase">
              DEPARTURE
            </Text>
            <Text className="text-xl font-black text-slate-900 mt-0.5">
              {startTimeFormatted}
            </Text>
          </View>

          {/* Nautical Cruise Connector */}
          <View className="items-center px-2 flex-1">
            <Text className="text-[10px] font-black text-[#0E6C7C] bg-[#E8F5F7] px-2.5 py-0.5 rounded-full border border-[#D0E9EE]">
              ⚓ {duration}
            </Text>
            <View className="w-full flex-row items-center justify-center mt-1">
              <View className="h-[1.5px] bg-[#CFE8EE] flex-1" />
              <Text className="text-[10px] text-[#0E6C7C] mx-1">▶</Text>
              <View className="h-[1.5px] bg-[#CFE8EE] flex-1" />
            </View>
          </View>

          {/* Return */}
          <View className="flex-1 items-end">
            <Text className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase">
              RETURN
            </Text>
            <Text className="text-xl font-black text-slate-900 mt-0.5">
              {endTimeFormatted}
            </Text>
          </View>
        </View>
      </View>

      {/* Guest Manifest Row */}
      <View className="flex-row items-center justify-between bg-slate-50/70 rounded-2xl p-3 mb-3.5 border border-slate-100">
        <View className="flex-row items-center flex-1 pr-2">
          {profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              className="w-10 h-10 rounded-full border border-slate-200 mr-2.5"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-[#E0F5F8] items-center justify-center border border-[#BCE7ED] mr-2.5">
              <Text className="text-xs font-black text-[#0E6C7C]">
                {guestInitials}
              </Text>
            </View>
          )}

          <View className="flex-1">
            <Text className="text-xs font-black text-slate-900" numberOfLines={1}>
              {guestName}
            </Text>
            <Text className="text-[10px] font-bold text-slate-400 mt-0.5">
              {booking.user?.mobileNo ? `📞 ${booking.user.mobileNo}` : 'VIP Primary Charterer'}
            </Text>
          </View>
        </View>

        <View className="bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm">
          <Text className="text-[11px] font-black text-slate-700">
            👥 {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
          </Text>
        </View>
      </View>

      {/* Financial Overview */}
      <View className="flex-row items-center justify-between mb-4 px-1">
        <View>
          <Text className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase">
            TOTAL CHARTER FARE
          </Text>
          <Text className="text-[11px] font-bold text-slate-500 mt-0.5">
            {booking.paymentStatus ? `Status: ${booking.paymentStatus}` : 'Charter Value'}
          </Text>
        </View>

        <Text className="text-xl font-black text-[#0E6C7C]">
          ${Math.round(Number(totalAmount)).toLocaleString()}
        </Text>
      </View>

      {/* Premium CTA Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPressAction || onPressCard}
        style={{
          shadowColor: isAccepted ? '#0E6C7C' : isPending ? '#D97706' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isAccepted || isPending ? 0.2 : 0.05,
          shadowRadius: 5,
          elevation: 2,
        }}
        className={`w-full py-3.5 rounded-2xl items-center justify-center flex-row ${
          isPending
            ? 'bg-[#D97706] active:bg-[#B45309]'
            : isAccepted
            ? 'bg-[#0E6C7C] active:bg-[#084854]'
            : 'bg-slate-900 active:bg-slate-800'
        }`}
      >
        <Text className="font-black text-xs tracking-wider uppercase text-white mr-1.5">
          {buttonLabel}
        </Text>
        <Text className="text-white font-black text-sm">→</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default BookingCard;
