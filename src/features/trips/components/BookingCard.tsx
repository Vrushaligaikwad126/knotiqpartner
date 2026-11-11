import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'Wednesday' as any });
    const dateFormatted = d.toLocaleDateString('en-US', {
      day: '2-digit',
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

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPressCard,
  onPressAction,
}) => {
  const status = booking.bookingStatus || 'Pending';
  const isPending = status.toLowerCase() === 'pending';
  const isAccepted = status.toLowerCase() === 'accepted';
  const isCompleted = status.toLowerCase() === 'completed';
  const isCancelled = status.toLowerCase() === 'cancelled';

  // Badge appearance by status
  const badgeConfig = isPending
    ? {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        dot: 'bg-amber-500',
        label: 'Pending Approval',
      }
    : isAccepted
    ? {
        bg: 'bg-[#E0F5F8]',
        border: 'border-cyan-200',
        text: 'text-[#0E6C7C]',
        dot: 'bg-[#1592A6]',
        label: 'Confirmed',
      }
    : isCompleted
    ? {
        bg: 'bg-[#E6F8F2]',
        border: 'border-emerald-200',
        text: 'text-[#0D7A5C]',
        dot: 'bg-[#10B981]',
        label: 'Completed',
      }
    : {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-700',
        dot: 'bg-rose-500',
        label: 'Cancelled',
      };

  const startTimeFormatted = formatTime12h(booking.startTime) || '10:30 AM';
  const endTimeFormatted = formatTime12h(booking.endTime) || '02:30 PM';
  const timeRange = `${startTimeFormatted} — ${endTimeFormatted}`;
  const duration = computeDuration(booking.startTime, booking.endTime);
  const { dayOfWeek, dateFormatted } = formatBookingDate(booking.bookingDate);

  const guestName = booking.user?.name?.trim() || 'Guest';
  const guestCount = booking.guests || booking.totalGuests || 1;
  const vesselName = booking.yacht?.name || '100’ NEDSHIP';
  const vesselSequence = booking.yacht?.sequenceId || 'KNY-0045';
  const totalAmount = booking.totalAmount || booking.finalAmount || '1200';

  const buttonLabel = isPending
    ? 'Review & Manage Booking'
    : isAccepted
    ? 'View Trip & Preparation'
    : isCompleted
    ? 'View Charter Summary'
    : 'View Booking Details';

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPressCard}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
      className="bg-white rounded-3xl p-5 mb-4 border border-slate-100"
    >
      {/* Top Bar: Booking ID & Status Badge */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="bg-slate-50 border border-slate-200/80 rounded-md px-2.5 py-1">
          <Text className="text-[10px] font-extrabold text-slate-600 tracking-wider">
            {booking.bookingId || `#${booking.id || 'BOOKING'}`}
          </Text>
        </View>

        <View
          className={`flex-row items-center ${badgeConfig.bg} border ${badgeConfig.border} rounded-full px-2.5 py-1`}
        >
          <View className={`w-2 h-2 rounded-full ${badgeConfig.dot} mr-1.5`} />
          <Text className={`text-[11px] font-extrabold ${badgeConfig.text}`}>
            {badgeConfig.label}
          </Text>
        </View>
      </View>

      {/* Date & Time Highlights */}
      <View className="flex-row items-baseline justify-between mb-2">
        <View>
          <Text className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            Start Time
          </Text>
          <Text className="text-2xl font-black text-slate-900 mt-0.5">
            {startTimeFormatted}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-[11px] font-bold text-slate-500">{dayOfWeek}</Text>
          <Text className="text-xs font-black text-slate-900 mt-0.5">
            {dateFormatted}
          </Text>
        </View>
      </View>

      {/* Time Range Pill */}
      <View className="bg-cyan-50/70 border border-cyan-100 rounded-full px-3 py-1 self-start mb-3">
        <Text className="text-[#1592A6] text-xs font-bold">
          🕒 {timeRange} ({duration})
        </Text>
      </View>

      {/* Vessel & Guest Info */}
      <View className="bg-slate-50/80 rounded-2xl p-3 mb-3 border border-slate-100">
        <View className="flex-row items-center justify-between mb-1.5">
          <View className="flex-row items-center flex-1 pr-2">
            <BoatIcon size={16} color="#1592A6" />
            <Text className="text-sm font-extrabold text-slate-900 ml-1.5" numberOfLines={1}>
              {vesselName}
            </Text>
          </View>
          <Text className="text-[11px] font-bold text-slate-500">
            {vesselSequence}
          </Text>
        </View>

        <View className="flex-row items-center justify-between pt-1 border-t border-slate-200/50">
          <Text className="text-xs text-slate-600 font-semibold">
            👤 Primary Guest: <Text className="font-extrabold text-slate-900">{guestName}</Text>
          </Text>
          <Text className="text-xs font-bold text-slate-700">
            👥 {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
          </Text>
        </View>

        {booking.user?.mobileNo ? (
          <Text className="text-[11px] text-slate-400 font-medium mt-1">
            📞 {booking.user.mobileNo}
          </Text>
        ) : null}
      </View>

      {/* Price Snapshot */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text className="text-xs text-slate-500 font-semibold">
          Total Charter Fare:
        </Text>
        <Text className="text-sm font-black text-slate-900">
          ${Math.round(Number(totalAmount)).toLocaleString()}
        </Text>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressAction || onPressCard}
        className={`w-full py-3 rounded-2xl items-center justify-center border ${
          isPending
            ? 'bg-amber-100/70 border-amber-300 active:bg-amber-200'
            : isAccepted
            ? 'bg-[#E0F5F8] border-cyan-200 active:bg-cyan-100'
            : 'bg-slate-100 border-slate-200 active:bg-slate-200'
        }`}
      >
        <Text
          className={`font-black text-xs tracking-wider uppercase ${
            isPending
              ? 'text-amber-900'
              : isAccepted
              ? 'text-[#0E6C7C]'
              : 'text-slate-800'
          }`}
        >
          {buttonLabel} →
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

