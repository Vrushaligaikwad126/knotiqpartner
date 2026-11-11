import React from 'react';
import { View, Text } from 'react-native';

export interface GuestCheckInCardProps {
  arrivedCount?: number;
  totalCount?: number;
}

export const GuestCheckInCard: React.FC<GuestCheckInCardProps> = ({
  arrivedCount = 10,
  totalCount = 12,
}) => {
  const pendingCount = totalCount - arrivedCount;
  const progressPercent = totalCount > 0 ? (arrivedCount / totalCount) * 100 : 0;

  return (
    <View
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
      }}
      className="bg-white rounded-3xl p-5 mb-4 border border-slate-100"
    >
      {/* Top Header */}
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Check-In
        </Text>

        {pendingCount > 0 && (
          <View className="bg-[#FFF6DC] rounded-full px-2.5 py-0.5 flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            <Text className="text-amber-800 text-[10px] font-bold">
              {pendingCount} pending
            </Text>
          </View>
        )}
      </View>

      {/* Main Count */}
      <View className="flex-row items-baseline mb-3">
        <Text className="text-2xl font-extrabold text-slate-900">
          {arrivedCount} / {totalCount}
        </Text>
        <Text className="text-xs font-semibold text-slate-500 ml-2">
          guests
        </Text>
      </View>

      {/* Progress Bar Track */}
      <View className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <View
          style={{ width: `${progressPercent}%` }}
          className="bg-brand-primary h-full rounded-full"
        />
      </View>
    </View>
  );
};

