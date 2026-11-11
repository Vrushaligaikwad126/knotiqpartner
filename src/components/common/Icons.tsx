import React from 'react';
import { View, Text } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
}

// -------------------------------------------------------------
// Wind Vector Icon (2 streamlined wind flow lines with curled ends)
// -------------------------------------------------------------
export const WindIcon: React.FC<IconProps> = ({ size = 15, color = '#139BAE' }) => (
  <View style={{ width: size + 2, height: size, justifyContent: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2.2 }}>
      <View style={{ width: size * 0.72, height: 1.5, backgroundColor: color, borderRadius: 1 }} />
      <View
        style={{
          width: 4,
          height: 3,
          borderTopRightRadius: 2,
          borderBottomRightRadius: 2,
          borderWidth: 1.3,
          borderColor: color,
          borderLeftWidth: 0,
        }}
      />
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: size * 0.88, height: 1.5, backgroundColor: color, borderRadius: 1 }} />
      <View
        style={{
          width: 3.5,
          height: 2.8,
          borderTopRightRadius: 2,
          borderBottomRightRadius: 2,
          borderWidth: 1.3,
          borderColor: color,
          borderLeftWidth: 0,
        }}
      />
    </View>
  </View>
);

// -------------------------------------------------------------
// Wave Vector Icon (3 wavy oceanic ripples)
// -------------------------------------------------------------
export const WaveIcon: React.FC<IconProps> = ({ size = 15, color = '#139BAE' }) => (
  <View style={{ width: size + 2, height: size, justifyContent: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2.2 }}>
      <View style={{ width: 4.5, height: 1.5, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '-22deg' }] }} />
      <View style={{ width: 4.5, height: 1.5, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '22deg' }] }} />
      <View style={{ width: 4.5, height: 1.5, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '-22deg' }] }} />
      <View style={{ width: 4.5, height: 1.5, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '22deg' }] }} />
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 4.5, height: 1.5, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '-22deg' }] }} />
      <View style={{ width: 4.5, height: 1.5, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '22deg' }] }} />
      <View style={{ width: 4.5, height: 1.5, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '-22deg' }] }} />
      <View style={{ width: 4.5, height: 1.5, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '22deg' }] }} />
    </View>
  </View>
);

// -------------------------------------------------------------
// Rain Vector Icon (Cloud + Raindrops)
// -------------------------------------------------------------
export const RainIcon: React.FC<IconProps> = ({ size = 15, color = '#139BAE' }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: size * 0.88,
        height: size * 0.44,
        backgroundColor: color,
        borderRadius: size * 0.22,
        marginBottom: 2.5,
      }}
    />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: size * 0.72 }}>
      <View style={{ width: 1.4, height: 3.5, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '15deg' }] }} />
      <View style={{ width: 1.4, height: 3.5, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '15deg' }] }} />
      <View style={{ width: 1.4, height: 3.5, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '15deg' }] }} />
    </View>
  </View>
);

// -------------------------------------------------------------
// Scalloped / Rosette Check Badge Icon
// -------------------------------------------------------------
export const CheckBadgeIcon: React.FC<IconProps> = ({ size = 15, color = '#0D9468' }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: 4,
      borderWidth: 1.4,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ rotate: '45deg' }],
    }}
  >
    <Text
      style={{
        fontSize: size * 0.65,
        color,
        fontWeight: '900',
        transform: [{ rotate: '-45deg' }],
        lineHeight: size * 0.75,
      }}
    >
      ✓
    </Text>
  </View>
);

// -------------------------------------------------------------
// Refresh / Sync Icon
// -------------------------------------------------------------
export const RefreshIcon: React.FC<IconProps> = ({ size = 13, color = '#5A7A8C' }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 1.4,
      borderColor: color,
      borderTopColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        position: 'absolute',
        top: -1,
        right: 0,
        width: 3,
        height: 3,
        borderTopWidth: 1.5,
        borderRightWidth: 1.5,
        borderColor: color,
      }}
    />
  </View>
);

// -------------------------------------------------------------
// Fuel Pump Vector Icon
// -------------------------------------------------------------
export const FuelIcon: React.FC<IconProps> = ({ size = 14, color = '#1592A6' }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: size * 0.68,
        height: size * 0.88,
        borderWidth: 1.4,
        borderColor: color,
        borderRadius: 2,
        alignItems: 'center',
        paddingTop: 1.5,
      }}
    >
      <View style={{ width: '65%', height: '32%', backgroundColor: color, borderRadius: 1 }} />
    </View>
    <View
      style={{
        position: 'absolute',
        right: 0,
        top: size * 0.22,
        width: 1.2,
        height: size * 0.48,
        backgroundColor: color,
      }}
    />
  </View>
);

// -------------------------------------------------------------
// Engine / Gauge Vector Icon
// -------------------------------------------------------------
export const EngineIcon: React.FC<IconProps> = ({ size = 14, color = '#1592A6' }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 1.4,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        position: 'absolute',
        width: size * 0.35,
        height: 1.3,
        backgroundColor: color,
        transform: [{ rotate: '-45deg' }, { translateX: size * 0.1 }],
        borderRadius: 1,
      }}
    />
    <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
  </View>
);

// -------------------------------------------------------------
// Boat Silhouette Vector Icon
// -------------------------------------------------------------
export const BoatIcon: React.FC<IconProps> = ({ size = 20, color = '#1592A6' }) => (
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
        width: size * 0.85,
        height: size * 0.28,
        backgroundColor: color,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
      }}
    />
    <View
      style={{
        width: size * 0.95,
        height: 1.4,
        backgroundColor: color,
        borderRadius: 1,
        marginTop: 1.5,
      }}
    />
  </View>
);

// -------------------------------------------------------------
// Quick Action Icons
// -------------------------------------------------------------
export const CompassIcon: React.FC<IconProps> = ({ size = 18, color = '#2B6CB0' }) => (
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
    <View
      style={{
        width: size * 0.55,
        height: 2,
        backgroundColor: color,
        transform: [{ rotate: '45deg' }],
        borderRadius: 1,
      }}
    />
  </View>
);

export const MessageIcon: React.FC<IconProps> = ({ size = 18, color = '#4A5568' }) => (
  <View
    style={{
      width: size * 0.9,
      height: size * 0.75,
      borderRadius: 4,
      borderWidth: 1.4,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View style={{ width: '60%', height: 1.2, backgroundColor: color, marginBottom: 2 }} />
    <View style={{ width: '40%', height: 1.2, backgroundColor: color }} />
  </View>
);

export const FlagIcon: React.FC<IconProps> = ({ size = 18, color = '#E53E3E' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      <View style={{ width: 1.5, height: size * 0.85, backgroundColor: color, borderRadius: 1 }} />
      <View
        style={{
          width: size * 0.55,
          height: size * 0.42,
          backgroundColor: color,
          borderTopRightRadius: 2,
          borderBottomRightRadius: 2,
        }}
      />
    </View>
  </View>
);

// -------------------------------------------------------------
// Maritime Anchor Icon
// -------------------------------------------------------------
export const AnchorIcon: React.FC<IconProps> = ({ size = 16, color = '#1592A6' }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    {/* Top ring */}
    <View
      style={{
        width: size * 0.35,
        height: size * 0.35,
        borderRadius: size * 0.18,
        borderWidth: 1.5,
        borderColor: color,
      }}
    />
    {/* Central stock crossbar */}
    <View
      style={{
        width: size * 0.65,
        height: 1.6,
        backgroundColor: color,
        borderRadius: 1,
        marginTop: 1,
      }}
    />
    {/* Central vertical shank */}
    <View
      style={{
        width: 1.6,
        height: size * 0.45,
        backgroundColor: color,
        borderRadius: 1,
      }}
    />
    {/* Curved bottom flukes */}
    <View
      style={{
        position: 'absolute',
        bottom: 1,
        width: size * 0.85,
        height: size * 0.42,
        borderBottomLeftRadius: size * 0.42,
        borderBottomRightRadius: size * 0.42,
        borderWidth: 1.6,
        borderTopWidth: 0,
        borderColor: color,
      }}
    />
  </View>
);

// -------------------------------------------------------------
// Globe Icon
// -------------------------------------------------------------
export const GlobeIcon: React.FC<IconProps> = ({ size = 16, color = '#2B6CB0' }) => (
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
    {/* Horizontal equator line */}
    <View style={{ width: '100%', height: 1.2, backgroundColor: color }} />
    {/* Vertical ellipse longitude line */}
    <View
      style={{
        position: 'absolute',
        width: size * 0.5,
        height: '100%',
        borderRadius: size / 2,
        borderWidth: 1.2,
        borderColor: color,
      }}
    />
  </View>
);

// -------------------------------------------------------------
// Award / Certificate Ribbon Icon
// -------------------------------------------------------------
export const AwardIcon: React.FC<IconProps> = ({ size = 16, color = '#D97706' }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    {/* Medal circle */}
    <View
      style={{
        width: size * 0.65,
        height: size * 0.65,
        borderRadius: (size * 0.65) / 2,
        borderWidth: 1.5,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: size * 0.25,
          height: size * 0.25,
          borderRadius: 2,
          backgroundColor: color,
        }}
      />
    </View>
    {/* Ribbons */}
    <View
      style={{
        flexDirection: 'row',
        width: size * 0.55,
        justifyContent: 'space-between',
        marginTop: -1,
      }}
    >
      <View
        style={{
          width: 1.5,
          height: size * 0.35,
          backgroundColor: color,
          transform: [{ rotate: '15deg' }],
        }}
      />
      <View
        style={{
          width: 1.5,
          height: size * 0.35,
          backgroundColor: color,
          transform: [{ rotate: '-15deg' }],
        }}
      />
    </View>
  </View>
);

// -------------------------------------------------------------
// Mail Icon
// -------------------------------------------------------------
export const MailIcon: React.FC<IconProps> = ({ size = 16, color = '#1592A6' }) => (
  <View
    style={{
      width: size,
      height: size * 0.72,
      borderWidth: 1.4,
      borderColor: color,
      borderRadius: 3,
      justifyContent: 'flex-start',
      overflow: 'hidden',
    }}
  >
    <View
      style={{
        width: '100%',
        height: size * 0.45,
        borderBottomWidth: 1.3,
        borderLeftWidth: 1.3,
        borderRightWidth: 1.3,
        borderColor: color,
        transform: [{ scaleX: 1.3 }, { rotate: '45deg' }, { translateY: -size * 0.2 }],
      }}
    />
  </View>
);

// -------------------------------------------------------------
// Settings / Gear Icon
// -------------------------------------------------------------
export const SettingsIcon: React.FC<IconProps> = ({ size = 16, color = '#1592A6' }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 1.8,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        width: size * 0.35,
        height: size * 0.35,
        borderRadius: size * 0.2,
        backgroundColor: color,
      }}
    />
  </View>
);
