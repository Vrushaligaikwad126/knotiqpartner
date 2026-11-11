import React from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { Images } from '../../../assets';
import {
  WindIcon,
  WaveIcon,
  RainIcon,
  CheckBadgeIcon,
  RefreshIcon,
} from '../../../components/common/Icons';

export interface TripConditionsProps {
  temperature?: number;
  feelsLike?: number;
  condition?: string;
  passageStatus?: 'Optimal' | 'Caution' | 'Restricted';
  windSpeedKnots?: number;
  windDirection?: string;
  waveHeightFt?: number;
  wavePeriodSec?: number;
  rainRiskPercentage?: number;
  rainRiskLevel?: string;
  lastUpdated?: string;
  locationName?: string;
  isLoading?: boolean;
}

export const TripConditionsCard: React.FC<TripConditionsProps> = ({
  temperature = 82,
  feelsLike = 84,
  condition = 'Partly Cloudy',
  passageStatus = 'Optimal',
  windSpeedKnots = 8,
  windDirection = 'ESE 112°',
  waveHeightFt = 1.2,
  wavePeriodSec = 5,
  rainRiskPercentage = 10,
  rainRiskLevel = 'Low Risk',
  lastUpdated = '5m ago',
  locationName,
  isLoading = false,
}) => {
  const monoFont = Platform.OS === 'ios' ? 'Courier' : 'monospace';

  return (
    <View
      style={{
        backgroundColor: '#E9F6F7',
        borderWidth: 1,
        borderColor: '#D3ECF1',
        borderRadius: 28,
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      {/* Warm Ambient Sun Glow on the Top-Right Corner */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -45,
          right: -45,
          width: 230,
          height: 230,
          borderRadius: 9999,
          backgroundColor: '#FDECC2',
          opacity: 0.85,
        }}
      />

      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER BADGES                                          */}
      {/* ------------------------------------------------------------- */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        {/* Left Pill: TRIP CONDITIONS */}
        <View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 9999,
            paddingVertical: 5,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#E68A00',
              fontSize: 11,
              fontWeight: '800',
              marginRight: 6,
            }}
          >
            ▲
          </Text>
          <Text
            style={{
              fontFamily: monoFont,
              fontSize: 10.5,
              fontWeight: '700',
              letterSpacing: 1.2,
              color: '#0E6C7C',
              textTransform: 'uppercase',
            }}
          >
            TRIP CONDITIONS
          </Text>
        </View>

        {/* Right Pill: Passage:Optimal */}
        <View
          style={{
            backgroundColor: 'rgba(255, 250, 235, 0.85)',
            borderWidth: 1,
            borderColor: 'rgba(254, 240, 200, 0.8)',
            borderRadius: 9999,
            paddingVertical: 5,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#10B981',
              marginRight: 6,
            }}
          />
          <Text
            style={{
              fontFamily: monoFont,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 0.8,
              color: '#0D7A5C',
            }}
          >
            Passage:{passageStatus}
          </Text>
        </View>
      </View>

      {/* ------------------------------------------------------------- */}
      {/* 2. TEMPERATURE & 3D WEATHER GRAPHIC                           */}
      {/* ------------------------------------------------------------- */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
          paddingHorizontal: 4,
        }}
      >
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text
              style={{
                fontSize: 54,
                fontWeight: '900',
                color: '#0E202E',
                lineHeight: 56,
                letterSpacing: -1,
              }}
            >
              {temperature}
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#0E202E',
                marginTop: 4,
                marginLeft: 2,
              }}
            >
              °F
            </Text>
          </View>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: '#139BAE',
              marginTop: 4,
            }}
          >
            Feels like {feelsLike}° • {condition}
            {locationName ? ` • 📍 ${locationName}` : ''}
          </Text>
        </View>

        {/* Authentic 3D Sun & Cloud Graphic */}
        <Image
          source={Images.weatherSunCloud}
          style={{ width: 92, height: 76 }}
          resizeMode="contain"
        />
      </View>

      {/* ------------------------------------------------------------- */}
      {/* 3. THREE FROSTED METRIC SUB-CARDS                             */}
      {/* ------------------------------------------------------------- */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        {/* Card 1: WIND */}
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: 16,
            paddingVertical: 12,
            paddingHorizontal: 6,
            alignItems: 'center',
            marginRight: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
            <WindIcon size={14} color="#139BAE" />
            <Text
              style={{
                fontSize: 10,
                fontWeight: '700',
                letterSpacing: 1.4,
                color: '#139BAE',
                marginLeft: 4,
                textTransform: 'uppercase',
              }}
            >
              WIND
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0E202E' }}>
              {windSpeedKnots}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#0E202E', marginLeft: 2 }}>
              kn
            </Text>
          </View>
          <Text
            style={{
              fontSize: 10.5,
              fontWeight: '500',
              color: '#5A7A8C',
              letterSpacing: 0.3,
            }}
          >
            {windDirection}
          </Text>
        </View>

        {/* Card 2: WAVES */}
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: 16,
            paddingVertical: 12,
            paddingHorizontal: 6,
            alignItems: 'center',
            marginRight: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
            <WaveIcon size={14} color="#139BAE" />
            <Text
              style={{
                fontSize: 10,
                fontWeight: '700',
                letterSpacing: 1.4,
                color: '#139BAE',
                marginLeft: 4,
                textTransform: 'uppercase',
              }}
            >
              WAVES
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0E202E' }}>
              {waveHeightFt}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#0E202E', marginLeft: 2 }}>
              ft
            </Text>
          </View>
          <Text
            style={{
              fontSize: 10.5,
              fontWeight: '500',
              color: '#5A7A8C',
              letterSpacing: 0.3,
            }}
          >
            {wavePeriodSec}s Swell
          </Text>
        </View>

        {/* Card 3: RAIN */}
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: 16,
            paddingVertical: 12,
            paddingHorizontal: 6,
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
            <RainIcon size={14} color="#139BAE" />
            <Text
              style={{
                fontSize: 10,
                fontWeight: '700',
                letterSpacing: 1.4,
                color: '#139BAE',
                marginLeft: 4,
                textTransform: 'uppercase',
              }}
            >
              RAIN
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0E202E' }}>
              {rainRiskPercentage}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#0E202E', marginLeft: 2 }}>
              %
            </Text>
          </View>
          <Text
            style={{
              fontSize: 10.5,
              fontWeight: '500',
              color: '#5A7A8C',
              letterSpacing: 0.3,
            }}
          >
            {rainRiskLevel}
          </Text>
        </View>
      </View>

      {/* ------------------------------------------------------------- */}
      {/* 4. FOOTER ROW: SAFE PASSAGE STATUS & TIMESTAMP               */}
      {/* ------------------------------------------------------------- */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 2,
        }}
      >
        {/* Left Pill: Safe Passage Window Clear */}
        <View
          style={{
            backgroundColor: 'rgba(215, 248, 237, 0.85)',
            borderWidth: 1,
            borderColor: 'rgba(130, 225, 195, 0.6)',
            borderRadius: 9999,
            paddingVertical: 6,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <CheckBadgeIcon size={14} color="#0D9468" />
          <Text
            style={{
              fontSize: 11.5,
              fontWeight: '600',
              color: '#0D9468',
              marginLeft: 6,
            }}
          >
            Safe Passage Window Clear
          </Text>
        </View>

        {/* Right Timestamp */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RefreshIcon size={13} color="#4A6572" />
          <Text
            style={{
              fontFamily: monoFont,
              fontSize: 12,
              fontWeight: '600',
              color: '#4A6572',
              marginLeft: 4,
            }}
          >
            {lastUpdated}
          </Text>
        </View>
      </View>
    </View>
  );
};
