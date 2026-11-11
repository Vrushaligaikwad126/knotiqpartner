import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface ScheduledTripCardProps {
  sectionBadge?: string;
  hasDashedBorder?: boolean;
  startsLabel?: string;
  startTime: string;
  dayOfWeek?: string;
  dateStr?: string;
  tripTitle: string;
  timeRange: string;
  vesselName: string;
  location?: string;
  duration?: string;
  guestsCount?: number;
  statusText?: 'Booked' | 'Completed' | 'Preparing' | string;
  preparationStatusText?: string;
  buttonLabel?: string;
  onPressAction?: () => void;
  onPressCard?: () => void;
}

export const ScheduledTripCard: React.FC<ScheduledTripCardProps> = ({
  sectionBadge,
  hasDashedBorder = false,
  startsLabel = 'Starts Today at',
  startTime,
  dayOfWeek = 'Tuesday',
  dateStr = '06 Oct 2026',
  tripTitle,
  timeRange,
  vesselName,
  location = 'Clearwater',
  duration = '4 hrs',
  guestsCount = 12,
  statusText = 'Booked',
  preparationStatusText = 'Preparation not started',
  buttonLabel = 'Start Preparation',
  onPressAction,
  onPressCard,
}) => {
  // Dynamic status badge styling
  const isCompleted = statusText.toLowerCase() === 'completed';
  const isPreparing = statusText.toLowerCase() === 'preparing';

  const badgeBg = isCompleted
    ? 'bg-[#D1F7E8]'
    : isPreparing
    ? 'bg-[#FFF4DC]'
    : 'bg-[#E4F0FE]';

  const badgeText = isCompleted
    ? 'text-[#0D9468]'
    : isPreparing
    ? 'text-amber-800'
    : 'text-blue-700';

  const dotBg = isCompleted
    ? 'bg-[#0D9468]'
    : isPreparing
    ? 'bg-amber-500'
    : 'bg-blue-600';

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPressCard}
      style={{
        borderWidth: hasDashedBorder ? 1.5 : 1,
        borderColor: hasDashedBorder ? '#0284C7' : '#F1F5F9',
        borderStyle: hasDashedBorder ? 'dashed' : 'solid',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
      }}
      className="bg-white rounded-3xl p-5 mb-5"
    >
      {/* Optional Top Section Badge inside the card (e.g. TOMORROW) */}
      {sectionBadge ? (
        <View className="mb-2.5 pb-2 border-b border-dashed border-sky-300">
          <Text className="text-[10px] font-extrabold tracking-widest text-[#0284C7] uppercase">
            {sectionBadge}
          </Text>
        </View>
      ) : null}

      {/* Header: Start time & Date */}
      <View className="flex-row items-start justify-between mb-3">
        <View>
          <Text className="text-[10px] text-slate-400 font-medium">
            {startsLabel}
          </Text>
          <Text className="text-2xl font-extrabold text-slate-900 mt-0.5">
            {startTime}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-[10px] text-slate-400 font-medium">
            {dayOfWeek}
          </Text>
          <Text className="text-xs font-semibold text-slate-800 mt-0.5">
            {dateStr}
          </Text>
        </View>
      </View>

      {/* Cruise Title & Time Range Pill */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-extrabold text-[#1592A6] flex-1 pr-2">
          {tripTitle}
        </Text>
        <View className="bg-cyan-50/80 border border-cyan-100 rounded-full px-2.5 py-1">
          <Text className="text-[#1592A6] text-[11px] font-semibold">
            {timeRange}
          </Text>
        </View>
      </View>

      {/* Vessel Name & Status Badge */}
      <View className="flex-row items-center justify-between mb-2.5">
        <View>
          <Text className="text-base font-bold text-slate-900">
            {vesselName}
          </Text>
          <Text className="text-xs text-slate-400 mt-0.5">
            {location} | {duration} | {guestsCount} Guests
          </Text>
        </View>

        <View className={`${badgeBg} rounded-full px-3 py-1 flex-row items-center`}>
          <View className={`w-2 h-2 rounded-full ${dotBg} mr-1.5`} />
          <Text className={`${badgeText} text-xs font-bold`}>{statusText}</Text>
        </View>
      </View>

      {/* Preparation Status */}
      <Text className="text-xs text-slate-500 font-medium mb-3.5">
        {preparationStatusText}
      </Text>

      {/* CTA Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressAction}
        className="w-full bg-[#D1F0F3] py-3 rounded-2xl items-center justify-center border border-cyan-200/60"
      >
        <Text className="text-[#0E6C7C] font-extrabold text-sm tracking-wide">
          {buttonLabel}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
