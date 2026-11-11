import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { Images } from '../../../assets';

export interface TripSummaryBannerProps {
  startTime?: string;
  timeRange?: string;
  tripTitle?: string;
  vesselName?: string;
  location?: string;
  duration?: string;
  guestsCount?: number;
  statusText?: string;
}

export const TripSummaryBanner: React.FC<TripSummaryBannerProps> = ({
  startTime = '10:30 AM',
  timeRange = '10:30 AM — 2:30 PM',
  tripTitle = 'Island Explorer',
  vesselName = 'Bellie Laugh',
  location = 'Clearwater',
  duration = '4 hrs',
  guestsCount = 12,
  statusText = 'Preparing',
}) => {
  return (
    <ImageBackground
      source={Images.charterCardBg}
      resizeMode="cover"
      className="rounded-3xl p-5 mb-5 overflow-hidden"
      style={{
        backgroundColor: '#0E6C7C',
        shadowColor: '#084854',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 3,
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
      <View className="flex-row items-center justify-between">
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
    </ImageBackground>
  );
};

