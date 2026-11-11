import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// -------------------------------------------------------------
// Guests Card
// -------------------------------------------------------------
export interface TripGuestsCardProps {
  guestsCount?: number;
  primaryGuestName?: string;
  occasion?: string;
  onPressView?: () => void;
}

export const TripGuestsCard: React.FC<TripGuestsCardProps> = ({
  guestsCount = 12,
  primaryGuestName = 'Sarah Johnson',
  occasion = 'Birthday celebration',
  onPressView,
}) => {
  return (
    <View
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
      }}
      className="bg-white rounded-3xl p-4 mb-4 border border-slate-100"
    >
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Guests
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onPressView}>
          <Text className="text-xs font-semibold text-cyan-700">view</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-base font-extrabold text-slate-900">
        {guestsCount} guests
      </Text>
      <Text className="text-xs text-slate-500 font-medium mt-0.5">
        Primary: {primaryGuestName} · {occasion}
      </Text>
    </View>
  );
};

// -------------------------------------------------------------
// Conditions Summary Card
// -------------------------------------------------------------
export interface TripConditionsSummaryCardProps {
  temperatureF?: number;
  windSpeedKnots?: number;
  waveHeightFt?: number;
  lastUpdated?: string;
}

export const TripConditionsSummaryCard: React.FC<TripConditionsSummaryCardProps> = ({
  temperatureF = 82,
  windSpeedKnots = 8,
  waveHeightFt = 1.2,
  lastUpdated = 'Updated 5 min ago',
}) => {
  return (
    <View
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
      }}
      className="bg-white rounded-3xl p-4 mb-4 border border-slate-100"
    >
      <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">
        Conditions
      </Text>
      <Text className="text-base font-extrabold text-slate-900">
        {temperatureF}°F · Wind {windSpeedKnots} kn
      </Text>
      <Text className="text-xs text-slate-500 font-medium mt-0.5">
        Waves {waveHeightFt} ft · {lastUpdated}
      </Text>
    </View>
  );
};

// -------------------------------------------------------------
// Trip Overview Key-Value Table Card
// -------------------------------------------------------------
export interface TripOverviewTableProps {
  date?: string;
  duration?: string;
  destination?: string;
  tripType?: string;
  vesselName?: string;
}

export const TripOverviewTableCard: React.FC<TripOverviewTableProps> = ({
  date = 'Wed, Sep 30',
  duration = '4 hrs',
  destination = 'Island Cove',
  tripType = 'Island cruise',
  vesselName = 'Bellie Laugh',
}) => {
  const rows = [
    { label: 'Date', value: date },
    { label: 'Duration', value: duration },
    { label: 'Destination', value: destination },
    { label: 'Trip type', value: tripType },
    { label: 'Vessel', value: vesselName },
  ];

  return (
    <View
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
      }}
      className="bg-white rounded-3xl p-5 mb-5 border border-slate-100"
    >
      <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3.5">
        Trip Overview
      </Text>

      <View className="space-y-3">
        {rows.map((row, index) => (
          <View
            key={row.label}
            className={`flex-row items-center justify-between py-1 ${
              index < rows.length - 1 ? 'border-b border-slate-50 pb-2.5' : ''
            }`}
          >
            <Text className="text-xs font-medium text-slate-400">
              {row.label}
            </Text>
            <Text className="text-xs font-semibold text-slate-800">
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

