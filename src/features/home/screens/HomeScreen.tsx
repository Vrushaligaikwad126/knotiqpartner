import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images } from '../../../assets';
import { AppHeader } from '../../../components/common/AppHeader';
import {
  TripConditionsCard,
  VesselCard,
  QuickActionsGrid,
  OverviewAlertCard,
} from '../components';
import { BottomTabBar, TabKey } from '../../../components/navigation/BottomTabBar';
import {
  getUserCoordinates,
  getLiveWeatherConditions,
  MaritimeWeatherConditions,
} from '../../../services';

export interface HomeScreenProps {
  captainName?: string;
  yachtName?: string;
  onNavigateTab?: (tab: TabKey) => void;
  onPressCharter?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  captainName,
  yachtName,
  onNavigateTab,
  onPressCharter,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('Home');
  const [weather, setWeather] = useState<MaritimeWeatherConditions | null>(null);
  const [locationName, setLocationName] = useState<string>('Dubai Marina');
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchDynamicWeather = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setWeatherLoading(true);
      }

      // 1. Dynamically retrieve the user's latitude and longitude
      const coords = await getUserCoordinates();
      if (coords.cityName) {
        setLocationName(coords.cityName);
      }

      // 2. Fetch live weather using Google Weather API / Maritime network for these coordinates
      const liveWeather = await getLiveWeatherConditions(
        coords.latitude,
        coords.longitude
      );
      setWeather(liveWeather);
    } catch (err) {
      console.log('Error loading dynamic weather on Home:', err);
    } finally {
      setWeatherLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDynamicWeather();
  }, [fetchDynamicWeather]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    onNavigateTab?.(tab);
  };

  const displayName = captainName ? captainName.split(' ')[0] : 'Captain';
  const displayYacht = yachtName || '100’ NEDSHIP';

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7F9]" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <View className="flex-1 relative">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchDynamicWeather(true)}
              colors={['#1592A6']}
              tintColor="#1592A6"
            />
          }
        >
          {/* Reusable Common Header */}
          <AppHeader
            title={`Good morning! ${displayName}`}
            subtitle="Let's get you ready for today."
            hasNotification={true}
          />

          {/* Today's Charter Card */}
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={onPressCharter}
            className="mb-5"
          >
            <ImageBackground
              source={Images.charterCardBg}
              resizeMode="cover"
              className="rounded-3xl p-5 overflow-hidden"
              style={{
                backgroundColor: '#0E6C7C',
                shadowColor: '#084854',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white/80 text-xs font-semibold">Today's Charter</Text>
                <View className="flex-row items-center">
                  <Text className="text-white/70 text-[10px] mr-1.5 font-medium">Starts at</Text>
                  <Text className="text-white text-xs font-bold mr-1.5">10:30 AM</Text>
                  <Text className="text-sm">☀️</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-white text-2xl font-extrabold">Island Explorer</Text>
                <View className="bg-white/20 rounded-full px-2.5 py-1">
                  <Text className="text-white text-[11px] font-semibold">10:30 AM — 2:30 PM</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between mb-3">
                <View>
                  <Text className="text-white/95 text-base font-bold">{displayYacht}</Text>
                  <Text className="text-white/70 text-xs mt-0.5">
                    Clearwater | 4 hrs | 12 Guests
                  </Text>
                </View>

                <View className="bg-[#FFF4DC] rounded-full px-3 py-1 flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
                  <Text className="text-amber-800 text-xs font-bold">Preparing</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="w-full bg-slate-900/40 h-2 rounded-full mb-2 overflow-hidden">
                <View className="bg-cyan-300 h-full w-[72%] rounded-full" />
              </View>

              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white/85 text-[11px] font-medium">72% Ready</Text>
                <Text className="text-white/85 text-[11px] font-medium">2 tasks remaining</Text>
              </View>

              {/* Action Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPressCharter}
                className="w-full bg-[#1592A6] py-3 rounded-2xl items-center justify-center border border-cyan-300/30"
              >
                <Text className="text-white font-extrabold text-sm tracking-wide">
                  Continue Preparation
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </TouchableOpacity>

          {/* OVERVIEW Alerts */}
          <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2 px-1">
            Overview
          </Text>

          <OverviewAlertCard
            type="warning"
            title="Attention! Weather update"
            description={`Wind conditions ${weather?.windSpeedKnots ? `${weather.windSpeedKnots} kn (${weather.windDirection})` : 'may change after 3 PM'}. Review conditions before departure.`}
            actionText="Review conditions →"
          />

          <OverviewAlertCard
            type="issue"
            title="Vessel Issue"
            description="Navigation light needs attention."
            actionText="View Issue →"
          />

          {/* Dynamic Trip Conditions Card based on User Latitude & Longitude */}
          <TripConditionsCard
            temperature={weather?.temperature}
            feelsLike={weather?.feelsLike}
            condition={weather?.condition}
            passageStatus={weather?.passageStatus}
            windSpeedKnots={weather?.windSpeedKnots}
            windDirection={weather?.windDirection}
            waveHeightFt={weather?.waveHeightFt}
            wavePeriodSec={weather?.wavePeriodSec}
            rainRiskPercentage={weather?.rainRiskPercentage}
            rainRiskLevel={weather?.rainRiskLevel}
            lastUpdated={weather?.lastUpdated || 'Live'}
            locationName={locationName}
            isLoading={weatherLoading}
          />

          <VesselCard name={displayYacht} />

          <QuickActionsGrid
            onPressTrips={() => handleTabChange('Trips')}
            onPressVessel={() => handleTabChange('Vessel')}
          />
        </ScrollView>

        {/* Floating Bottom Navigation Bar */}
        <BottomTabBar activeTab={activeTab} onTabPress={handleTabChange} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
