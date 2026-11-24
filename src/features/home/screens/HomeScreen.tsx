import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
  Platform,
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
  searchCities,
  saveUserLocation,
  UserCoordinates,
} from '../../../services';

export interface HomeScreenProps {
  captainName?: string;
  yachtName?: string;
  onNavigateTab?: (tab: TabKey) => void;
  onPressCharter?: () => void;
}

const PRESET_LOCATIONS: UserCoordinates[] = [
  { cityName: 'Pune', latitude: 18.5204, longitude: 73.8567, region: 'Maharashtra', country: 'India' },
  { cityName: 'Mumbai', latitude: 18.9220, longitude: 72.8347, region: 'Maharashtra', country: 'India' },
  { cityName: 'Goa', latitude: 15.4989, longitude: 73.8278, region: 'Goa', country: 'India' },
  { cityName: 'Dubai Marina', latitude: 25.0772, longitude: 55.1333, region: 'Dubai', country: 'UAE' },
  { cityName: 'Clearwater', latitude: 27.9659, longitude: -82.8001, region: 'Florida', country: 'USA' },
];

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

  // Location selector state
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserCoordinates[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const searchTimeoutRef = useRef<any>(null);

  const fetchDynamicWeather = useCallback(async (isRefresh = false, forceDetect = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setWeatherLoading(true);
      }

      // 1. Dynamically retrieve coordinates (saved, live GPS, or IPv4)
      const coords = await getUserCoordinates(forceDetect);
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

  // Handle live search for cities
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!text.trim() || text.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchCities(text);
      setSearchResults(results);
      setIsSearching(false);
    }, 400);
  };

  // Select a location manually
  const handleSelectLocation = async (coords: UserCoordinates) => {
    try {
      setIsLocationModalVisible(false);
      setSearchQuery('');
      setSearchResults([]);

      if (coords.cityName) {
        setLocationName(coords.cityName);
      }

      await saveUserLocation(coords);

      setWeatherLoading(true);
      const liveWeather = await getLiveWeatherConditions(
        coords.latitude,
        coords.longitude
      );
      setWeather(liveWeather);
    } catch (err) {
      console.log('Error applying selected location:', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Trigger live GPS detection
  const handleLiveDetect = async () => {
    try {
      setIsDetectingLocation(true);
      await fetchDynamicWeather(false, true);
      setIsLocationModalVisible(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.log('Error detecting live location:', err);
    } finally {
      setIsDetectingLocation(false);
    }
  };

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
            onPressProfile={() => handleTabChange('Profile')}
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

          {/* Overview Alerts Section */}
          <OverviewAlertCard
            type="warning"
            title="Attention! Weather update"
            description="Wind conditions 7 kn (NW 307°). Review conditions before departure."
            actionText="Review conditions →"
          />

          <OverviewAlertCard
            type="issue"
            title="Vessel Issue"
            description="Navigation light needs attention."
            actionText="View Issue →"
          />

          {/* Dynamic Trip Conditions Card */}
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
            lastUpdated={weather?.lastUpdated || 'Live sensor'}
            locationName={locationName}
            onPressLocation={() => setIsLocationModalVisible(true)}
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

        {/* Location Picker Modal */}
        <Modal
          visible={isLocationModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsLocationModalVisible(false)}
        >
          <View className="flex-1 bg-black/60 justify-end">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setIsLocationModalVisible(false)}
              className="flex-1"
            />
            <View className="bg-white rounded-t-3xl p-5 max-h-[85%]">
              {/* Header */}
              <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
                <View>
                  <Text className="text-lg font-bold text-slate-900">Select Location</Text>
                  <Text className="text-xs text-slate-500">
                    Currently showing: <Text className="font-bold text-[#1592A6]">{locationName}</Text>
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsLocationModalVisible(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
                >
                  <Text className="text-slate-600 font-bold">✕</Text>
                </TouchableOpacity>
              </View>

              {/* Auto-Detect Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={isDetectingLocation}
                onPress={handleLiveDetect}
                className="mt-4 bg-[#EAF5F8] border border-[#CDE5EA] py-3 px-4 rounded-2xl flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2.5">🎯</Text>
                  <View>
                    <Text className="text-sm font-bold text-[#0E6C7C]">
                      Use Live Device Location
                    </Text>
                    <Text className="text-[11px] text-[#0E6C7C]/80">
                      Query hardware GPS / network sensors
                    </Text>
                  </View>
                </View>
                {isDetectingLocation ? (
                  <ActivityIndicator size="small" color="#0E6C7C" />
                ) : (
                  <Text className="text-xs font-bold text-[#0E6C7C]">Detect →</Text>
                )}
              </TouchableOpacity>

              {/* Search Bar */}
              <View className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 flex-row items-center">
                <Text className="text-sm mr-2 text-slate-400">🔍</Text>
                <TextInput
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  placeholder="Search city (e.g. Pune, Mumbai, Goa)..."
                  placeholderTextColor="#94A3B8"
                  style={{ flex: 1, fontSize: 13, color: '#0F172A', paddingVertical: Platform.OS === 'android' ? 2 : 0 }}
                />
                {isSearching && <ActivityIndicator size="small" color="#1592A6" />}
              </View>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <View className="mt-2 max-h-48 border border-slate-100 rounded-2xl bg-white overflow-hidden shadow-xs">
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item, index) => `${item.cityName}-${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleSelectLocation(item)}
                        className="py-2.5 px-4 border-b border-slate-50 flex-row items-center justify-between active:bg-slate-50"
                      >
                        <View>
                          <Text className="text-sm font-bold text-slate-800">
                            {item.cityName}
                          </Text>
                          <Text className="text-xs text-slate-400">
                            {item.region ? `${item.region}, ` : ''}{item.country}
                          </Text>
                        </View>
                        <Text className="text-cyan-700 text-xs font-bold">Select</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}

              {/* Quick Select Presets */}
              <View className="mt-4">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Popular Hubs
                </Text>
                <View className="flex-row flex-wrap">
                  {PRESET_LOCATIONS.map((preset, idx) => {
                    const isSelected = locationName.toLowerCase() === preset.cityName?.toLowerCase();
                    return (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.7}
                        onPress={() => handleSelectLocation(preset)}
                        className={`mr-2 mb-2 px-3.5 py-2 rounded-xl border flex-row items-center ${
                          isSelected
                            ? 'bg-[#1592A6] border-[#1592A6]'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            isSelected ? 'text-white' : 'text-slate-700'
                          }`}
                        >
                          📍 {preset.cityName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsLocationModalVisible(false)}
                className="mt-4 w-full bg-slate-100 py-3 rounded-2xl items-center"
              >
                <Text className="text-slate-700 font-bold text-sm">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
