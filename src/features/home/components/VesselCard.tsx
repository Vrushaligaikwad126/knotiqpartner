import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BoatIcon, FuelIcon, EngineIcon } from '../../../components/common/Icons';

export interface VesselCardProps {
  name?: string;
  model?: string;
  registrationNumber?: string;
  fuelPercentage?: number;
  engineHours?: string | number;
  statusText?: string;
  maintenanceMessage?: string;
  onPressDetails?: () => void;
  onPressMaintenance?: () => void;
}

export const VesselCard: React.FC<VesselCardProps> = ({
  name = 'Bellie Laugh',
  model = '38ft Twin V-Drive',
  registrationNumber = 'FL-9921-BL',
  fuelPercentage = 82,
  engineHours = '1,248h',
  statusText = 'Ready',
  maintenanceMessage = 'No maintenance issues',
  onPressDetails,
  onPressMaintenance,
}) => {
  return (
    <View className="mb-5">
      {/* Section Header outside the card */}
      <View className="flex-row items-center justify-between mb-2 px-1">
        <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Vessel
        </Text>
        <Text className="text-[11px] font-semibold text-slate-500">
          Reg #{registrationNumber}
        </Text>
      </View>

      {/* Main Card Container */}
      <View
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 2,
        }}
        className="bg-white rounded-3xl p-4 border border-slate-100"
      >
        {/* Main Boat Info & Ready Pill */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressDetails}
          className="flex-row items-center justify-between mb-3"
        >
          <View className="flex-row items-center flex-1 pr-2">
            <View className="w-10 h-10 rounded-full bg-cyan-50 items-center justify-center mr-3 border border-cyan-100">
              <BoatIcon size={20} color="#1592A6" />
            </View>
            <View>
              <Text className="text-base font-extrabold text-slate-900">{name}</Text>
              <Text className="text-xs font-medium text-slate-400 mt-0.5">{model}</Text>
            </View>
          </View>

          {/* Ready Badge */}
          <View className="bg-brand-primary rounded-full px-3 py-1 flex-row items-center">
            <Text className="text-white text-xs font-bold">✓ {statusText}</Text>
          </View>
        </TouchableOpacity>

        {/* 2 Metric Boxes (Fuel & Engine) */}
        <View className="flex-row items-center justify-between space-x-2 mb-2.5">
          {/* Fuel Box */}
          <View className="flex-1 bg-slate-50 rounded-2xl py-2 px-3 flex-row items-center mr-2 border border-slate-100">
            <View className="w-8 h-8 rounded-full bg-white items-center justify-center mr-2 border border-slate-100 shadow-xs">
              <FuelIcon size={14} color="#1592A6" />
            </View>
            <View className="flex-1">
              <Text
                numberOfLines={1}
                className="text-[9px] font-bold tracking-wide text-slate-400 uppercase"
              >
                Fuel
              </Text>
              <Text
                numberOfLines={1}
                className="text-base font-extrabold text-slate-900"
              >
                {fuelPercentage}%
              </Text>
            </View>
          </View>

          {/* Engine Hours Box */}
          <View className="flex-1 bg-slate-50 rounded-2xl py-2 px-3 flex-row items-center border border-slate-100">
            <View className="w-8 h-8 rounded-full bg-white items-center justify-center mr-2 border border-slate-100 shadow-xs">
              <EngineIcon size={14} color="#1592A6" />
            </View>
            <View className="flex-1">
              <Text
                numberOfLines={1}
                className="text-[9px] font-bold tracking-wide text-slate-400 uppercase"
              >
                Engine
              </Text>
              <Text
                numberOfLines={1}
                className="text-base font-extrabold text-slate-900"
              >
                {engineHours}
              </Text>
            </View>
          </View>
        </View>

        {/* Maintenance Status Link */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressMaintenance}
          className="flex-row items-center justify-between pt-2.5 border-t border-slate-100 mt-1"
        >
          <Text className="text-xs font-medium text-slate-500">
            {maintenanceMessage}
          </Text>
          <Text className="text-slate-400 font-bold text-base leading-4">›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
