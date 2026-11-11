import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../../components/common/AppHeader';
import { BottomTabBar, TabKey } from '../../../components/navigation/BottomTabBar';
import {
  BoatIcon,
  CheckBadgeIcon,
  EngineIcon,
  FuelIcon,
  RefreshIcon,
} from '../../../components/common/Icons';
import {
  YachtDetails,
  getYachtById,
  getAuthSession,
} from '../../../services';

export interface VesselsScreenProps {
  yachtId?: string | number;
  yacht?: YachtDetails | null;
  captainName?: string;
  onNavigateTab?: (tab: TabKey) => void;
  onSelectTrip?: () => void;
  onCallGuest?: () => void;
  onMessageGuest?: () => void;
  onPressVesselStatus?: () => void;
  onPressGuests?: () => void;
}

export const VesselsScreen: React.FC<VesselsScreenProps> = ({
  yachtId,
  yacht: propYacht,
  captainName,
  onNavigateTab,
  onSelectTrip,
  onCallGuest,
  onMessageGuest,
  onPressVesselStatus,
  onPressGuests,
}) => {
  const [yacht, setYacht] = useState<YachtDetails | null>(propYacht || null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchYachtData = useCallback(
    async (isPullToRefresh = false) => {
      try {
        if (isPullToRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setErrorMessage(null);

        // Dynamically resolve yacht ID
        let dynamicYachtId = yachtId || propYacht?.yachtId;
        if (!dynamicYachtId) {
          const session = await getAuthSession();
          dynamicYachtId = session.captain?.yachtId;
        }

        if (!dynamicYachtId) {
          throw new Error('Yacht ID not found. Please log in again.');
        }

        const res = await getYachtById(dynamicYachtId);
        const yachtData = (res as any)?.data || res;
        if (yachtData && (yachtData.name || yachtData.yachtId)) {
          setYacht(yachtData);
        }
      } catch (err: any) {
        console.log('Error loading yacht by id:', err);
        setErrorMessage(err.message || 'Could not load yacht specifications.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [yachtId, propYacht]
  );

  useEffect(() => {
    fetchYachtData();
  }, [fetchYachtData]);

  const readyTasks = [
    { id: '1', label: 'Guest information' },
    { id: '2', label: 'Weather & Navigation' },
    { id: '3', label: 'Fuel & Fluid levels' },
    { id: '4', label: 'Engine diagnostics' },
    { id: '5', label: 'Safety equipment & Life rafts' },
    { id: '6', label: 'Vessel hull & deck inspection' },
  ];

  const vesselName = yacht?.name || '100’ NEDSHIP';
  const vesselModel = yacht?.model || 'DT 120';
  const vesselSequence = yacht?.sequenceId || 'KNY-0045';
  const vesselCapacity = yacht?.capacity || 40;
  const vesselLength = yacht?.length || 100;
  const vesselRate = yacht?.perHour
    ? Math.round(Number(yacht.perHour)).toLocaleString()
    : '2,560';
  const vesselType = yacht?.yachtType || 'Motor Yachts';
  const vesselYear = yacht?.year || 2025;

  // Extract gallery photos from API
  const allImages = [
    ...(Array.isArray(yacht?.thumbnail) ? yacht.thumbnail : []),
    ...(Array.isArray(yacht?.images) ? yacht.images : []),
  ].filter(Boolean);

  const heroImage = allImages.length > 0 ? allImages[0] : null;

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
              onRefresh={() => fetchYachtData(true)}
              colors={['#1592A6']}
              tintColor="#1592A6"
            />
          }
        >
          {/* Header */}
          <AppHeader
            title="Vessel & Fleet!"
            subtitle="Assigned vessel readiness & diagnostics"
            hasNotification={true}
          />

          {/* Loading Indicator */}
          {loading && (
            <View className="py-6 items-center">
              <ActivityIndicator color="#1592A6" size="large" />
              <Text className="text-xs text-slate-400 font-medium mt-2">
                Fetching yacht data from API...
              </Text>
            </View>
          )}

          {/* Error Banner */}
          {errorMessage && !loading && (
            <View className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-4 flex-row items-center">
              <Text className="text-base mr-2">⚠️</Text>
              <View className="flex-1">
                <Text className="text-xs font-bold text-rose-800">
                  Could not load yacht specifications
                </Text>
                <Text className="text-xs text-rose-600 mt-0.5">{errorMessage}</Text>
              </View>
              <TouchableOpacity
                onPress={() => fetchYachtData(false)}
                className="bg-rose-100 px-3 py-1.5 rounded-lg ml-2"
              >
                <Text className="text-xs font-bold text-rose-800">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 1. Main Vessel Hero Card */}
          <View
            style={{
              backgroundColor: '#0E6C7C',
              shadowColor: '#084854',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 4,
            }}
            className="rounded-3xl overflow-hidden mb-4"
          >
            {/* If hero image exists from API */}
            {heroImage && (
              <View className="h-44 w-full relative">
                <Image
                  source={{ uri: heroImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                {/* Dark gradient overlay for readability */}
                <View className="absolute inset-0 bg-black/35" />

                <View className="absolute top-3.5 left-3.5 right-3.5 flex-row items-center justify-between">
                  <View className="bg-black/50 backdrop-blur-md rounded-full px-3 py-1 flex-row items-center border border-white/20">
                    <View className="w-2 h-2 rounded-full bg-[#10B981] mr-1.5" />
                    <Text className="text-white text-xs font-bold">
                      Ready for Charter
                    </Text>
                  </View>

                  <View className="bg-black/50 backdrop-blur-md rounded-md px-2.5 py-0.5 border border-white/20">
                    <Text className="text-white text-[11px] font-extrabold tracking-wider">
                      {vesselSequence}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Vessel Text Content */}
            <View className="p-5">
              {!heroImage && (
                <View className="flex-row items-center justify-between mb-3">
                  <View className="bg-white/20 rounded-full px-3 py-1 flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-[#10B981] mr-1.5" />
                    <Text className="text-white text-xs font-bold">
                      Ready for Charter
                    </Text>
                  </View>

                  <View className="bg-white/15 rounded-md px-2.5 py-0.5">
                    <Text className="text-white/90 text-[11px] font-extrabold tracking-wider">
                      {vesselSequence}
                    </Text>
                  </View>
                </View>
              )}

              <View className="mb-3">
                <Text className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
                  Assigned Superyacht
                </Text>
                <Text className="text-white text-2xl font-black mt-0.5">
                  {vesselName}
                </Text>
                <Text className="text-white/80 text-xs font-semibold mt-0.5">
                  {vesselModel} · {vesselType} ({vesselYear})
                </Text>
              </View>

              {/* 3 Key Stats Pills */}
              <View className="flex-row items-center justify-between pt-3 border-t border-white/15">
                <View>
                  <Text className="text-white/60 text-[9px] font-bold uppercase">
                    Capacity
                  </Text>
                  <Text className="text-white text-sm font-extrabold mt-0.5">
                    {vesselCapacity} Guests
                  </Text>
                </View>

                <View className="h-6 w-px bg-white/20" />

                <View>
                  <Text className="text-white/60 text-[9px] font-bold uppercase">
                    Length
                  </Text>
                  <Text className="text-white text-sm font-extrabold mt-0.5">
                    {vesselLength} ft
                  </Text>
                </View>

                <View className="h-6 w-px bg-white/20" />

                <View>
                  <Text className="text-white/60 text-[9px] font-bold uppercase">
                    Charter Rate
                  </Text>
                  <Text className="text-white text-sm font-extrabold mt-0.5">
                    ${vesselRate} / hr
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 2. Yacht Photo Gallery (from API images) */}
          {allImages.length > 1 && (
            <View className="mb-4">
              <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2 px-1">
                Yacht Gallery ({allImages.length} Photos)
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {allImages.map((imgUri, index) => (
                  <View
                    key={index}
                    className="mr-2.5 rounded-2xl overflow-hidden border border-slate-200"
                    style={{ width: 120, height: 80 }}
                  >
                    <Image
                      source={{ uri: imgUri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 3. Vessel Status & Telemetry Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressVesselStatus}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 10,
              elevation: 2,
            }}
            className="bg-white rounded-3xl p-5 mb-4 border border-slate-100"
          >
            <View className="flex-row items-center justify-between mb-2.5">
              <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Vessel Status
              </Text>
              <Text className="text-slate-400 font-bold text-sm">›</Text>
            </View>

            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-[10px] text-slate-400 font-medium">
                  Last inspection
                </Text>
                <Text className="text-base font-extrabold text-slate-900 mt-0.5">
                  Today · 8:42 AM
                </Text>
              </View>

              <View className="bg-[#E6F8F2] rounded-full px-3 py-1.5 flex-row items-center border border-[#BCEEDB]">
                <Text className="text-[#0D7A5C] text-xs font-bold">
                  ✓ Ready for Charter
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between pt-2.5 border-t border-slate-100">
              <View className="flex-row items-center">
                <RefreshIcon size={12} color="#94A3B8" />
                <Text className="text-[11px] text-slate-400 font-medium ml-1.5">
                  Last telemetry sync 5 min ago
                </Text>
              </View>
              <Text className="text-[11px] font-bold text-cyan-700">
                All Systems Normal
              </Text>
            </View>
          </TouchableOpacity>

          {/* 4. Pre-Charter Readiness Checklist (100% Complete) */}
          <View className="mb-4">
            <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2 px-1">
              Trip Readiness
            </Text>

            <View
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.04,
                shadowRadius: 10,
                elevation: 2,
              }}
              className="bg-white rounded-3xl p-5 border border-slate-100"
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Preparation
                </Text>
                <Text className="text-2xl font-black text-slate-900">
                  100%
                </Text>
              </View>

              {/* 100% Full Cyan Progress Bar */}
              <View className="w-full bg-slate-100 h-2 rounded-full mb-2 overflow-hidden">
                <View className="w-full bg-[#1592A6] h-full rounded-full" />
              </View>

              <Text className="text-xs text-slate-400 font-medium mb-3.5">
                6 of 6 tasks complete · 0 task remaining
              </Text>

              {/* All 6 Checklist Items Completed */}
              <View className="space-y-2.5">
                {readyTasks.map((task) => (
                  <View
                    key={task.id}
                    className="flex-row items-center py-1.5 px-2.5 rounded-xl bg-slate-50/80 mb-1 border border-slate-100"
                  >
                    <View className="w-5 h-5 rounded-full bg-[#10B981] items-center justify-center mr-2.5">
                      <Text className="text-[10px] text-white font-extrabold leading-3">
                        ✓
                      </Text>
                    </View>
                    <Text className="text-xs font-bold text-slate-800">
                      {task.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* 5. Complete Technical Specifications Table */}
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.03,
              shadowRadius: 8,
              elevation: 1,
            }}
            className="bg-white rounded-3xl p-5 mb-4 border border-slate-100"
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Vessel Specifications
              </Text>
              <View className="bg-slate-100 px-2 py-0.5 rounded">
                <Text className="text-[10px] font-extrabold text-slate-600">
                  {vesselSequence}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between py-2 border-b border-slate-100">
              <Text className="text-xs font-semibold text-slate-500">Yacht Name</Text>
              <Text className="text-xs font-black text-slate-900">{vesselName}</Text>
            </View>

            <View className="flex-row items-center justify-between py-2 border-b border-slate-100">
              <Text className="text-xs font-semibold text-slate-500">Model / Type</Text>
              <Text className="text-xs font-bold text-slate-900">
                {vesselModel} · {vesselType}
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2 border-b border-slate-100">
              <Text className="text-xs font-semibold text-slate-500">Capacity</Text>
              <Text className="text-xs font-bold text-slate-900">
                {vesselCapacity} Passengers
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2 border-b border-slate-100">
              <Text className="text-xs font-semibold text-slate-500">Length</Text>
              <Text className="text-xs font-bold text-slate-900">
                {vesselLength} ft Superyacht
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2 border-b border-slate-100">
              <Text className="text-xs font-semibold text-slate-500">Hourly Charter</Text>
              <Text className="text-xs font-black text-[#1592A6]">
                ${vesselRate} / hr
              </Text>
            </View>

            <View className="flex-row items-center justify-between py-2 border-b border-slate-100">
              <Text className="text-xs font-semibold text-slate-500">Instant Booking</Text>
              <Text className="text-xs font-bold text-slate-800">
                {yacht?.isInstantBooking ? 'Enabled' : 'Disabled'}
              </Text>
            </View>

            {/* Note Footnote */}
            <View className="bg-cyan-50/50 rounded-xl p-2.5 border border-cyan-100/60 mt-3">
              <Text className="text-[11px] text-slate-600 leading-4">
                ℹ️ {yacht?.note ||
                  'The coverage area may vary depending on the yacht and duration of the charter.'}
              </Text>
            </View>
          </View>

          {/* 6. About the Yacht / Overview Description */}
          {yacht?.description && (
            <View
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
                elevation: 1,
              }}
              className="bg-white rounded-3xl p-5 mb-5 border border-slate-100"
            >
              <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">
                About The Vessel
              </Text>
              <Text className="text-xs text-slate-700 leading-5">
                {yacht.description}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Bottom Navigation Bar with Vessel Active */}
        <BottomTabBar
          activeTab="Vessel"
          onTabPress={(tab) => onNavigateTab?.(tab)}
        />
      </View>
    </SafeAreaView>
  );
};

export default VesselsScreen;
