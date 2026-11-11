import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../../components/common/AppHeader';
import { BottomTabBar, TabKey } from '../../../components/navigation/BottomTabBar';
import {
  getAllBooking,
  BookingItem,
  getAuthSession,
} from '../../../services';
import {
  TripFilterTabs,
  BookingFilterStatus,
  BookingCard,
} from '../components';

export interface TripsScreenProps {
  initialFilter?: BookingFilterStatus;
  yachtId?: string;
  onNavigateTab?: (tab: TabKey) => void;
  onSelectTrip?: (tripId: string) => void;
}

export const TripsScreen: React.FC<TripsScreenProps> = ({
  initialFilter = 'Pending',
  yachtId,
  onNavigateTab,
  onSelectTrip,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<BookingFilterStatus>(initialFilter);
  const [activeTab, setActiveTab] = useState<TabKey>('Trips');
  const [liveBookings, setLiveBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState<Partial<Record<BookingFilterStatus, number>>>({});

  const fetchBookingsForStatus = useCallback(
    async (status: BookingFilterStatus, isPullToRefresh = false) => {
      try {
        if (isPullToRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setErrorMessage(null);

        // Dynamically resolve yachtId from props or stored captain session
        let dynamicYachtId = yachtId;
        if (!dynamicYachtId) {
          const session = await getAuthSession();
          dynamicYachtId = session.captain?.yachtId;
        }

        if (!dynamicYachtId) {
          throw new Error('Yacht ID not found. Please log in again.');
        }

        const res = await getAllBooking({
          yachtId: dynamicYachtId,
          bookingStatus: status,
          limit: '10',
          start: '0',
          search: '',
        });

        if (res?.data && Array.isArray(res.data)) {
          setLiveBookings(res.data);
          setStatusCounts((prev) => ({
            ...prev,
            [status]: res.total ?? res.data?.length ?? 0,
          }));
        } else {
          setLiveBookings([]);
        }
      } catch (err: any) {
        console.log('Error fetching bookings:', err);
        setErrorMessage(err.message || 'Could not load bookings.');
        setLiveBookings([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [yachtId]
  );

  useEffect(() => {
    fetchBookingsForStatus(selectedStatus);
  }, [selectedStatus, fetchBookingsForStatus]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    onNavigateTab?.(tab);
  };

  const handleStatusFilterChange = (status: BookingFilterStatus) => {
    setSelectedStatus(status);
  };

  const handleRefresh = () => {
    fetchBookingsForStatus(selectedStatus, true);
  };

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
              onRefresh={handleRefresh}
              colors={['#1592A6']}
              tintColor="#1592A6"
            />
          }
        >
          {/* Top Header */}
          <AppHeader
            title="Charters & Trips!"
            subtitle="Live schedule & booking management"
            hasNotification={true}
          />

          {/* Booking Status Tabs: Pending / Accepted / Completed / Cancelled */}
          <TripFilterTabs
            selectedTab={selectedStatus}
            onSelectTab={handleStatusFilterChange}
            counts={statusCounts}
          />

          {/* Loading Indicator */}
          {loading && (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator color="#1592A6" size="large" />
              <Text className="text-xs text-slate-500 font-semibold mt-3">
                Loading {selectedStatus} bookings...
              </Text>
            </View>
          )}

          {/* Error Message */}
          {errorMessage && !loading && (
            <View className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-4 flex-row items-center">
              <Text className="text-base mr-2">⚠️</Text>
              <View className="flex-1">
                <Text className="text-xs font-bold text-rose-800">
                  Failed to load bookings
                </Text>
                <Text className="text-xs text-rose-600 mt-0.5">
                  {errorMessage}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleRefresh}
                className="bg-rose-100 px-3 py-1.5 rounded-lg ml-2"
              >
                <Text className="text-xs font-bold text-rose-800">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Real Live Bookings List */}
          {!loading && !errorMessage && liveBookings.length > 0 && (
            <View>
              <View className="flex-row items-center justify-between mb-2.5 px-0.5">
                <Text className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  {selectedStatus} Bookings ({liveBookings.length})
                </Text>
                <Text className="text-[10px] font-semibold text-cyan-700">
                  Pull down to refresh
                </Text>
              </View>

              {liveBookings.map((booking, index) => {
                const bookingKey =
                  booking.id || booking.bookingId || `booking-${index}`;
                const targetTripId =
                  booking.id || booking.bookingId || String(index);

                return (
                  <BookingCard
                    key={bookingKey}
                    booking={booking}
                    onPressCard={() => onSelectTrip?.(targetTripId)}
                    onPressAction={() => onSelectTrip?.(targetTripId)}
                  />
                );
              })}
            </View>
          )}

          {/* Empty State when no bookings match the selected status */}
          {!loading && !errorMessage && liveBookings.length === 0 && (
            <View className="bg-white rounded-3xl p-8 border border-slate-100 items-center justify-center my-6">
              <View className="w-16 h-16 rounded-full bg-slate-50 items-center justify-center mb-3 border border-slate-100">
                <Text className="text-2xl">
                  {selectedStatus === 'Pending'
                    ? '⏳'
                    : selectedStatus === 'Accepted'
                    ? '🛥️'
                    : selectedStatus === 'Completed'
                    ? '✅'
                    : '❌'}
                </Text>
              </View>
              <Text className="text-base font-extrabold text-slate-900 text-center">
                No {selectedStatus} Bookings
              </Text>
              <Text className="text-xs text-slate-500 text-center mt-1 px-4 leading-4">
                {selectedStatus === 'Pending'
                  ? 'There are currently no new charter requests waiting for approval.'
                  : selectedStatus === 'Accepted'
                  ? 'There are no active or accepted bookings scheduled for this yacht.'
                  : selectedStatus === 'Completed'
                  ? 'No completed charters recorded yet.'
                  : 'No cancelled bookings.'}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleRefresh}
                className="mt-4 bg-[#E0F5F8] px-4 py-2 rounded-xl border border-cyan-100"
              >
                <Text className="text-xs font-bold text-[#1592A6]">
                  Refresh Bookings
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Floating Bottom Navigation Bar */}
        <BottomTabBar activeTab={activeTab} onTabPress={handleTabChange} />
      </View>
    </SafeAreaView>
  );
};

export default TripsScreen;
