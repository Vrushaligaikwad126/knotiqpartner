import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export type GuestFilterTab = 'All' | 'Arrived' | 'Pending';

export interface GuestFilterTabsProps {
  selectedTab: GuestFilterTab;
  onSelectTab: (tab: GuestFilterTab) => void;
}

export const GuestFilterTabs: React.FC<GuestFilterTabsProps> = ({
  selectedTab,
  onSelectTab,
}) => {
  const tabs: GuestFilterTab[] = ['All', 'Arrived', 'Pending'];

  return (
    <View className="bg-[#EAF5F7] rounded-full p-1 flex-row items-center mb-4 border border-[#DCEDF2]">
      {tabs.map((tab) => {
        const isActive = selectedTab === tab;

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
            className="flex-1 py-2 rounded-full items-center justify-center"
          >
            <Text
              className={`text-xs ${
                isActive
                  ? 'font-extrabold text-slate-900'
                  : 'font-semibold text-slate-500'
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

