import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface OverviewAlertProps {
  type: 'warning' | 'issue';
  title: string;
  description: string;
  actionText: string;
  onPress?: () => void;
}

export const OverviewAlertCard: React.FC<OverviewAlertProps> = ({
  type,
  title,
  description,
  actionText,
  onPress,
}) => {
  const isWarning = type === 'warning';

  return (
    <View
      className={`rounded-2xl p-4 mb-3 border ${
        isWarning
          ? 'bg-[#FFF8E8] border-[#FEE6AF]'
          : 'bg-[#FFF2EB] border-[#FDCFBF]'
      }`}
    >
      <View className="flex-row items-center mb-1">
        <Text className="text-sm mr-2">{isWarning ? '⚠️' : '⚠️'}</Text>
        <Text
          className={`font-extrabold text-xs tracking-wide ${
            isWarning ? 'text-[#875902]' : 'text-[#963710]'
          }`}
        >
          {title}
        </Text>
      </View>

      <Text
        className={`text-xs mt-0.5 leading-4 ${
          isWarning ? 'text-[#875902]/80' : 'text-[#963710]/80'
        }`}
      >
        {description}
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className="flex-row items-center justify-end mt-2"
      >
        <Text
          className={`text-xs font-bold ${
            isWarning ? 'text-[#A26D07]' : 'text-[#B8481A]'
          }`}
        >
          {actionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

