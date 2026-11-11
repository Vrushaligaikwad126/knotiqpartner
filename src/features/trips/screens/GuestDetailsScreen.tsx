import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GuestFilterTabs,
  GuestFilterTab,
  GuestCheckInCard,
  GuestCard,
  GuestItem,
} from '../components';

export interface GuestDetailsScreenProps {
  tripTitle?: string;
  tripTime?: string;
  vesselName?: string;
  capacity?: number;
  onBack?: () => void;
  onSelectGuest?: (guest: GuestItem) => void;
  onCallGuest?: (guest: GuestItem) => void;
  onMessageGuest?: (guest: GuestItem) => void;
  onContactPending?: () => void;
  onMarkAllArrived?: () => void;
}

const INITIAL_GUESTS: GuestItem[] = [
  {
    id: 'g-1',
    name: 'Sarah Johnson',
    initials: 'SJ',
    phone: '+* *** *** 0142',
    occasion: 'Birthday celebration',
    isPrimary: true,
    status: 'Arrived',
  },
  {
    id: 'g-2',
    name: 'Alen walker',
    initials: 'SJ',
    phone: '+* *** *** 0142',
    occasion: 'Birthday celebration',
    isPrimary: true,
    status: 'Not arrived',
  },
  {
    id: 'g-3',
    name: 'Sarah Johnson',
    initials: 'SJ',
    phone: '+* *** *** 0142',
    occasion: 'Birthday celebration',
    isPrimary: true,
    status: 'Arrived',
  },
];

export const GuestDetailsScreen: React.FC<GuestDetailsScreenProps> = ({
  tripTitle = 'ISLAND EXPLORER',
  tripTime = '10:30 AM',
  vesselName = 'Bellie Laugh',
  capacity = 12,
  onBack,
  onSelectGuest,
  onCallGuest,
  onMessageGuest,
  onContactPending,
  onMarkAllArrived,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<GuestFilterTab>('All');
  const [guests, setGuests] = useState<GuestItem[]>(INITIAL_GUESTS);

  // Filter list based on selected tab
  const displayedGuests = guests.filter((g) => {
    if (selectedTab === 'Arrived') return g.status === 'Arrived';
    if (selectedTab === 'Pending') return g.status === 'Not arrived';
    return true; // 'All'
  });

  const arrivedCount = guests.filter((g) => g.status === 'Arrived').length;

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7F9]" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <View className="flex-row items-center justify-between px-4 py-2.5 bg-[#F4F7F9]">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            className="w-9 h-9 items-center justify-center mr-2 rounded-full active:bg-slate-200"
          >
            <Text className="text-xl font-bold text-slate-900">←</Text>
          </TouchableOpacity>
          <View>
            <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              {tripTitle}
            </Text>
            <Text className="text-base font-extrabold text-slate-900 leading-5">
              Guest Details
            </Text>
          </View>
        </View>

        <View className="flex-row items-center space-x-2">
          <TouchableOpacity
            activeOpacity={0.7}
            className="w-8 h-8 items-center justify-center mr-1 rounded-full"
          >
            <Text className="text-lg font-bold text-slate-700">⋮</Text>
          </TouchableOpacity>
          <View className="w-9 h-9 rounded-full bg-slate-200 items-center justify-center overflow-hidden border border-slate-300">
            <Text className="text-base">👨‍✈️</Text>
          </View>
        </View>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 24,
        }}
      >
        {/* Title & Trip Context */}
        <View className="mb-4">
          <Text className="text-2xl font-extrabold text-slate-900">
            Guests
          </Text>
          <Text className="text-xs font-semibold text-slate-400 mt-0.5">
            {tripTime} · {vesselName} · Capacity {capacity}
          </Text>
        </View>

        {/* Check-In Progress Card */}
        <GuestCheckInCard
          arrivedCount={arrivedCount}
          totalCount={capacity}
        />

        {/* Filter Segment Tabs: All / Arrived / Pending */}
        <GuestFilterTabs
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
        />

        {/* Guest Cards */}
        <View className="mb-5">
          {displayedGuests.map((guest) => (
            <GuestCard
              key={guest.id}
              guest={guest}
              onPress={onSelectGuest}
              onCall={onCallGuest}
              onMessage={onMessageGuest}
            />
          ))}
        </View>

        {/* Bottom Contextual CTA Buttons */}
        <View style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
          {selectedTab === 'Pending' ? (
            /* Pending Tab Button */
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onMarkAllArrived}
              style={{
                shadowColor: '#1592A6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 3,
              }}
              className="w-full bg-brand-primary py-3.5 rounded-2xl items-center justify-center"
            >
              <Text className="text-white font-extrabold text-sm tracking-wide">
                Mark all as arrived
              </Text>
            </TouchableOpacity>
          ) : (
            /* All & Arrived Tab Buttons */
            <View>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onContactPending}
                style={{
                  shadowColor: '#1592A6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 3,
                }}
                className="w-full bg-brand-primary py-3.5 rounded-2xl items-center justify-center"
              >
                <Text className="text-white font-extrabold text-sm tracking-wide">
                  Contact Pending guest
                </Text>
              </TouchableOpacity>

              {selectedTab === 'All' && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onMarkAllArrived}
                  className="py-3 items-center justify-center mt-1"
                >
                  <Text className="text-[#1592A6] font-bold text-xs">
                    Mark all as Arrived
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GuestDetailsScreen;

