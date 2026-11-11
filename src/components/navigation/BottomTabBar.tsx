import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type TabKey = 'Home' | 'Trips' | 'Vessel' | 'More';

interface BottomTabBarProps {
  activeTab?: TabKey;
  onTabPress?: (tab: TabKey) => void;
}

// -------------------------------------------------------------
// Pixel-perfect Monochromatic Vector Icons (Matching Design)
// -------------------------------------------------------------

const HomeIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 16 }) => {
  const boxSize = (size - 3) / 2;
  return (
    <View style={{ width: size, height: size, justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: boxSize, height: boxSize, borderRadius: 2, borderWidth: 1.5, borderColor: color }} />
        <View style={{ width: boxSize, height: boxSize, borderRadius: 2, borderWidth: 1.5, borderColor: color }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: boxSize, height: boxSize, borderRadius: 2, borderWidth: 1.5, borderColor: color }} />
        <View style={{ width: boxSize, height: boxSize, borderRadius: 2, borderWidth: 1.5, borderColor: color }} />
      </View>
    </View>
  );
};

const TripsIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 16 }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ position: 'absolute', top: 1, width: 1, height: 2, backgroundColor: color }} />
      <View style={{ position: 'absolute', bottom: 1, width: 1, height: 2, backgroundColor: color }} />
      <View style={{ position: 'absolute', left: 1, width: 2, height: 1, backgroundColor: color }} />
      <View style={{ position: 'absolute', right: 1, width: 2, height: 1, backgroundColor: color }} />
      <View
        style={{
          width: size * 0.5,
          height: 1.8,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
          borderRadius: 1,
        }}
      />
    </View>
  );
};

const VesselIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 16 }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.44,
          height: size * 0.28,
          borderWidth: 1.4,
          borderColor: color,
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          marginBottom: 1,
        }}
      />
      <View
        style={{
          width: size * 0.84,
          height: size * 0.26,
          backgroundColor: color,
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
        }}
      />
      <View
        style={{
          width: size * 0.92,
          height: 1.4,
          backgroundColor: color,
          borderRadius: 1,
          marginTop: 1.5,
        }}
      />
    </View>
  );
};

const MoreIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 16 }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2.2 }}>
        <View style={{ width: 4, height: 1.5, backgroundColor: color, marginRight: 2 }} />
        <View style={{ flex: 1, height: 1.5, backgroundColor: color, borderRadius: 1 }} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2.2 }}>
        <View style={{ width: 6, height: 1.5, backgroundColor: color, marginRight: 2 }} />
        <View style={{ flex: 1, height: 1.5, backgroundColor: color, borderRadius: 1 }} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 3, height: 1.5, backgroundColor: color, marginRight: 2 }} />
        <View style={{ flex: 1, height: 1.5, backgroundColor: color, borderRadius: 1 }} />
      </View>
    </View>
  );
};

// -------------------------------------------------------------
// Component
// -------------------------------------------------------------

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab = 'Home',
  onTabPress,
}) => {
  const insets = useSafeAreaInsets();

  const tabs: { key: TabKey; label: string; renderIcon: (color: string) => React.ReactNode }[] = [
    { key: 'Home', label: 'Home', renderIcon: (c) => <HomeIcon color={c} size={15} /> },
    { key: 'Trips', label: 'Trips', renderIcon: (c) => <TripsIcon color={c} size={15} /> },
    { key: 'Vessel', label: 'Vessel', renderIcon: (c) => <VesselIcon color={c} size={15} /> },
    { key: 'More', label: 'More', renderIcon: (c) => <MoreIcon color={c} size={15} /> },
  ];

  return (
    <View
      style={{
        position: 'absolute',
        bottom: Math.max(insets.bottom + 8, 14),
        left: 14,
        right: 14,
        backgroundColor: '#FFFFFF',
        borderRadius: 9999,
        paddingVertical: 5,
        paddingHorizontal: 5,
        shadowColor: '#0B2236',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 8,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const iconColor = isActive ? '#FFFFFF' : '#334155';
        const textColor = isActive ? '#FFFFFF' : '#334155';

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            onPress={() => onTabPress?.(tab.key)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isActive ? '#1592A6' : 'transparent',
                borderRadius: 9999,
                paddingVertical: 8,
                paddingHorizontal: 4,
              }}
            >
              <View style={{ marginRight: 5 }}>
                {tab.renderIcon(iconColor)}
              </View>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 12.5,
                  fontWeight: isActive ? '700' : '500',
                  color: textColor,
                }}
              >
                {tab.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
