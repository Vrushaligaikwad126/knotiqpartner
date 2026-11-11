import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface GuestItem {
  id: string;
  name: string;
  initials: string;
  phone: string;
  occasion: string;
  isPrimary: boolean;
  status: 'Arrived' | 'Not arrived';
}

export interface GuestCardProps {
  guest: GuestItem;
  onPress?: (guest: GuestItem) => void;
  onCall?: (guest: GuestItem) => void;
  onMessage?: (guest: GuestItem) => void;
}

export const GuestCard: React.FC<GuestCardProps> = ({
  guest,
  onPress,
  onCall,
  onMessage,
}) => {
  const isArrived = guest.status === 'Arrived';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress?.(guest)}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
      }}
      className="bg-white rounded-3xl p-3.5 mb-3 border border-slate-100 flex-row items-center justify-between"
    >
      {/* Left Avatar & Information */}
      <View className="flex-row items-center flex-1 pr-2">
        {/* Avatar Initials Circle */}
        <View className="w-11 h-11 rounded-full bg-cyan-50 items-center justify-center mr-3 border border-cyan-100">
          <Text className="text-cyan-800 text-xs font-bold">{guest.initials}</Text>
        </View>

        {/* Guest Details */}
        <View className="flex-1">
          {/* Name & Primary Badge */}
          <View className="flex-row items-center flex-wrap mb-0.5">
            <Text className="text-sm font-extrabold text-slate-900 mr-2">
              {guest.name}
            </Text>
            {guest.isPrimary && (
              <View className="bg-cyan-50 rounded px-1.5 py-0.5 border border-cyan-100">
                <Text className="text-[9px] font-bold tracking-wide text-cyan-800">
                  PRIMARY
                </Text>
              </View>
            )}
          </View>

          {/* Masked Phone */}
          <Text className="text-xs text-slate-400 font-medium">
            {guest.phone}
          </Text>

          {/* Occasion Note */}
          <Text className="text-xs text-slate-400 font-medium mt-0.5">
            {guest.occasion}
          </Text>

          {/* Arrival Status Pill */}
          <View className="flex-row items-center mt-1.5">
            <View
              className={`rounded-full px-2.5 py-0.5 flex-row items-center ${
                isArrived ? 'bg-[#E7F8F2]' : 'bg-[#FFF4DC]'
              }`}
            >
              <View
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  isArrived ? 'bg-[#0D9468]' : 'bg-amber-500'
                }`}
              />
              <Text
                className={`text-[10px] font-bold ${
                  isArrived ? 'text-[#0D9468]' : 'text-amber-800'
                }`}
              >
                {guest.status}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Right Action Buttons */}
      <View className="flex-row items-center">
        {/* Phone Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onCall?.(guest)}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 1,
          }}
          className="w-9 h-9 rounded-2xl bg-white border border-slate-200 items-center justify-center mr-2"
        >
          <Text className="text-sm">📞</Text>
        </TouchableOpacity>

        {/* Message Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onMessage?.(guest)}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 1,
          }}
          className="w-9 h-9 rounded-2xl bg-white border border-slate-200 items-center justify-center"
        >
          <Text className="text-sm">💬</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

