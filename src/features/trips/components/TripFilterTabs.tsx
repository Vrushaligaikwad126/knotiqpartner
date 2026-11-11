import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export type BookingFilterStatus = 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';

export interface TripFilterTabsProps {
  selectedTab: BookingFilterStatus;
  onSelectTab: (tab: BookingFilterStatus) => void;
  counts?: Partial<Record<BookingFilterStatus, number>>;
}

export const TripFilterTabs: React.FC<TripFilterTabsProps> = ({
  selectedTab,
  onSelectTab,
  counts,
}) => {
  const tabs: BookingFilterStatus[] = ['Pending', 'Accepted', 'Completed', 'Cancelled'];

  return (
    <View className="bg-[#EAF5F7] rounded-full p-1 flex-row items-center mb-4 border border-[#DCEDF2]">
      {tabs.map((tab) => {
        const isActive = selectedTab === tab;
        const count = counts?.[tab];

        return (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.8}
            onPress={() => onSelectTab(tab)}
            style={{
              backgroundColor: isActive ? '#FFFFFF' : 'transparent',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isActive ? 0.08 : 0,
              shadowRadius: 3,
              elevation: isActive ? 2 : 0,
            }}
            className="flex-1 py-2 rounded-full items-center justify-center flex-row"
          >
            <Text
              numberOfLines={1}
              className={`text-[11.5px] ${
                isActive
                  ? 'font-extrabold text-slate-900'
                  : 'font-semibold text-slate-500'
              }`}
            >
              {tab}
            </Text>

            {typeof count === 'number' && count > 0 && (
              <View
                className={`ml-1 px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-[#EAF5F7]' : 'bg-slate-200/60'
                }`}
              >
                <Text
                  className={`text-[9.5px] font-extrabold ${
                    isActive ? 'text-[#1592A6]' : 'text-slate-500'
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
  );
};

export default TripFilterTabs;
