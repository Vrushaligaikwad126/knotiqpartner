import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  hasNotification?: boolean;
  onPressNotification?: () => void;
  onPressProfile?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  hasNotification = true,
  onPressNotification,
  onPressProfile,
}) => {
  return (
    <View className="flex-row items-center justify-between py-3 mb-2">
      <View className="flex-1 pr-3">
        <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-xs text-cyan-700/80 font-medium mt-0.5">
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View className="flex-row items-center space-x-2">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressNotification}
          className="w-10 h-10 rounded-full bg-cyan-50 items-center justify-center mr-2 border border-cyan-100 relative"
        >
          <Text className="text-base">🔔</Text>
          {hasNotification && (
            <View className="w-2 h-2 rounded-full bg-cyan-500 absolute top-2 right-2 border border-white" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressProfile}
          className="w-10 h-10 rounded-full bg-slate-200 items-center justify-center overflow-hidden border border-slate-300"
        >
          <Text className="text-lg">👨‍✈️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

