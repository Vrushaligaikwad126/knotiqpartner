import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Images } from '../../../assets';

export interface ActiveTripCardProps {
  startTime?: string;
  timeRange?: string;
  tripTitle?: string;
  vesselName?: string;
  location?: string;
  duration?: string;
  guestsCount?: number;
  statusText?: string;
  readinessPercentage?: number;
  remainingTasksCount?: number;
  buttonLabel?: string;
  onPressAction?: () => void;
  onPressCard?: () => void;
}

export const ActiveTripCard: React.FC<ActiveTripCardProps> = ({
  startTime = '10:30 AM',
  timeRange = '10:30 AM — 2:30 PM',
  tripTitle = 'Island Explorer',
  vesselName = 'Bellie Laugh',
  location = 'Clearwater',
  duration = '4 hrs',
  guestsCount = 12,
  statusText = 'Preparing',
  readinessPercentage = 72,
  remainingTasksCount = 2,
  buttonLabel = 'Continue Preparation',
  onPressAction,
  onPressCard,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPressCard}
      className="mb-5"
    >
      <ImageBackground
        source={Images.charterCardBg}
        resizeMode="cover"
        className="rounded-3xl p-5 overflow-hidden"
        style={{
          backgroundColor: '#0E6C7C',
          shadowColor: '#084854',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        {/* Top Time & Sun Icon */}
        <View className="mb-2">
          <Text className="text-white/70 text-[10px] font-medium">Starts at</Text>
          <View className="flex-row items-center">
            <Text className="text-white text-2xl font-extrabold mr-2">
              {startTime}
            </Text>
            <Text className="text-xl">☀️</Text>
          </View>
        </View>

        {/* Title & Time Range Pill */}
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-white text-xl font-extrabold flex-1 pr-2">
            {tripTitle}
          </Text>
          <View className="bg-white/20 rounded-full px-2.5 py-1">
            <Text className="text-white text-[11px] font-semibold">{timeRange}</Text>
          </View>
        </View>

        {/* Vessel Info & Status Badge */}
        <View className="flex-row items-center justify-between mb-3.5">
          <View>
            <Text className="text-white/95 text-base font-bold">{vesselName}</Text>
            <Text className="text-white/70 text-xs mt-0.5">
              {location} | {duration} | {guestsCount} Guests
            </Text>
          </View>

          <View className="bg-[#FFF4DC] rounded-full px-3 py-1 flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
            <Text className="text-amber-800 text-xs font-bold">{statusText}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="w-full bg-slate-900/40 h-2 rounded-full mb-2 overflow-hidden">
          <View
            style={{ width: `${readinessPercentage}%` }}
            className="bg-cyan-300 h-full rounded-full"
          />
        </View>

        {/* Readiness Info */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white/85 text-[11px] font-medium">
            {readinessPercentage}% Ready
          </Text>
          <Text className="text-white/85 text-[11px] font-medium">
            {remainingTasksCount} task remaining
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressAction}
          className="w-full bg-[#1592A6] py-3 rounded-2xl items-center justify-center border border-cyan-300/30"
        >
          <Text className="text-white font-extrabold text-sm tracking-wide">
            {buttonLabel}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </TouchableOpacity>
  );
};

