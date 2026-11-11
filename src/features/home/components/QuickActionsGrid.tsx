import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CompassIcon, BoatIcon, MessageIcon, FlagIcon } from '../../../components/common/Icons';

export interface QuickActionsProps {
  onPressTrips?: () => void;
  onPressVessel?: () => void;
  onPressMessages?: () => void;
  onPressReportIssue?: () => void;
}

export const QuickActionsGrid: React.FC<QuickActionsProps> = ({
  onPressTrips,
  onPressVessel,
  onPressMessages,
  onPressReportIssue,
}) => {
  return (
    <View className="mb-6">
      {/* Section Header */}
      <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3 px-1">
        Quick Actions
      </Text>

      {/* Grid Row 1 */}
      <View className="flex-row items-center justify-between space-x-3 mb-3">
        {/* Trips Card */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressTrips}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 1,
          }}
          className="flex-1 bg-white rounded-2xl p-4 mr-2 border border-slate-100"
        >
          <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mb-2.5 border border-blue-100">
            <CompassIcon size={20} color="#2563EB" />
          </View>
          <Text className="text-base font-extrabold text-slate-900">Trips</Text>
          <Text className="text-xs font-medium text-slate-400 mt-0.5">
            Schedules & routes
          </Text>
        </TouchableOpacity>

        {/* Vessel Card */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressVessel}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 1,
          }}
          className="flex-1 bg-white rounded-2xl p-4 border border-slate-100"
        >
          <View className="w-10 h-10 rounded-full bg-cyan-50 items-center justify-center mb-2.5 border border-cyan-100">
            <BoatIcon size={20} color="#1592A6" />
          </View>
          <Text className="text-base font-extrabold text-slate-900">Vessel</Text>
          <Text className="text-xs font-medium text-slate-400 mt-0.5">
            Logs & specs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Grid Row 2 */}
      <View className="flex-row items-center justify-between space-x-3">
        {/* Messages Card */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressMessages}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 1,
          }}
          className="flex-1 bg-white rounded-2xl p-4 mr-2 border border-slate-100"
        >
          <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mb-2.5 border border-slate-200">
            <MessageIcon size={20} color="#4A5568" />
          </View>
          <Text className="text-base font-extrabold text-slate-900">Messages</Text>
          <Text className="text-xs font-medium text-slate-400 mt-0.5">
            Radio & dock team
          </Text>
        </TouchableOpacity>

        {/* Report Issue Card */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressReportIssue}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 1,
          }}
          className="flex-1 bg-white rounded-2xl p-4 border border-slate-100"
        >
          <View className="w-10 h-10 rounded-full bg-rose-50 items-center justify-center mb-2.5 border border-rose-100">
            <FlagIcon size={20} color="#E11D48" />
          </View>
          <Text className="text-base font-extrabold text-slate-900">Report Issue</Text>
          <Text className="text-xs font-medium text-slate-400 mt-0.5">
            Log maintenance
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

