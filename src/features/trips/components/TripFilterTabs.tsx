import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export type BookingFilterStatus = 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';

export interface TripFilterTabsProps {
  selectedTab: BookingFilterStatus;
  onSelectTab: (tab: BookingFilterStatus) => void;
  counts?: Partial<Record<BookingFilterStatus, number>>;
}

const TABS: { status: BookingFilterStatus; label: string }[] = [
  { status: 'Pending', label: 'Pending' },
  { status: 'Accepted', label: 'Confirmed' },
  { status: 'Completed', label: 'Completed' },
  { status: 'Cancelled', label: 'Cancelled' },
];

export const TripFilterTabs: React.FC<TripFilterTabsProps> = ({
  selectedTab,
  onSelectTab,
  counts,
}) => {
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 2,
          paddingHorizontal: 2,
        }}
      >
        <View className="bg-[#EAF3F6] p-1.5 rounded-full flex-row items-center border border-[#D5E6ED]">
          {TABS.map(({ status, label }) => {
            const isActive = selectedTab === status;
            const count = counts?.[status];
            const hasCount = typeof count === 'number';

            return (
              <TouchableOpacity
                key={status}
                activeOpacity={0.85}
                onPress={() => onSelectTab(status)}
                style={{
                  backgroundColor: isActive ? '#0E6C7C' : 'transparent',
                  shadowColor: '#0E6C7C',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isActive ? 0.25 : 0,
                  shadowRadius: 4,
                  elevation: isActive ? 3 : 0,
                }}
                className={`flex-row items-center justify-center px-4 py-2 rounded-full mx-0.5`}
              >
                <Text
                  className={`text-xs ${
                    isActive
                      ? 'font-black text-white'
                      : 'font-bold text-slate-600'
                  }`}
                >
                  {label}
                </Text>

                {hasCount && count > 0 && (
                  <View
                    className={`ml-1.5 px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20' : 'bg-slate-300/60'
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-black ${
                        isActive ? 'text-white' : 'text-slate-700'
                      }`}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default TripFilterTabs;
