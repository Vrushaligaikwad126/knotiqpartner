import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBookingById, BookingItem } from '../../../services';
import {
  TripSummaryBanner,
  TripReadinessCard,
  TripGuestsCard,
  TripConditionsSummaryCard,
  TripOverviewTableCard,
} from '../components';

export interface TripDetailsScreenProps {
  tripId?: string;
  onBack?: () => void;
  onPressGuestsView?: () => void;
  onCallGuest?: () => void;
  onMessageGuest?: () => void;
  onContinuePreparation?: () => void;
}

export const TripDetailsScreen: React.FC<TripDetailsScreenProps> = ({
  tripId,
  onBack,
  onPressGuestsView,
  onCallGuest,
  onMessageGuest,
  onContinuePreparation,
}) => {
  const insets = useSafeAreaInsets();
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tripId) return;

    let isMounted = true;
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const res = await getBookingById(tripId);
        if (isMounted && res?.data) {
          setBooking(res.data);
        }
      } catch (err) {
        console.log('Error loading booking by id:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBookingDetails();
    return () => {
      isMounted = false;
    };
  }, [tripId]);

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7F9]" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Top Navigation Bar: Back Arrow & Title */}
      <View className="flex-row items-center px-4 py-3 bg-[#F4F7F9]">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          className="w-9 h-9 items-center justify-center mr-2 rounded-full active:bg-slate-200"
        >
          <Text className="text-xl font-bold text-slate-900">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-extrabold text-slate-900">
          Trip Details!
        </Text>
      </View>

      {/* Scrollable Details Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 6,
          paddingBottom: 24,
        }}
      >
        {/* Top Teal Charter Summary Banner */}
        <TripSummaryBanner
          startTime={booking?.startTime || '02:00 PM'}
          timeRange={
            booking?.startTime && booking?.endTime
              ? `${booking.startTime} — ${booking.endTime}`
              : '02:00 PM — 06:00 PM'
          }
          tripTitle={
            booking?.notes ||
            (booking?.yacht?.name
              ? `${booking.yacht.name} Charter`
              : 'Yacht Charter')
          }
          vesselName={booking?.yacht?.name || '100’ NEDSHIP'}
          location="Dubai Marina"
          duration={booking?.duration ? `${booking.duration} hrs` : '4 hrs'}
          guestsCount={booking?.guests || booking?.totalGuests || 1}
          statusText={booking?.bookingStatus || 'Pending'}
        />

        {/* Trip Readiness Checklist Card */}
        <TripReadinessCard
          percentage={booking?.bookingStatus === 'Completed' ? 100 : 70}
          completedCount={booking?.bookingStatus === 'Completed' ? 6 : 4}
          totalCount={6}
        />

        {/* Guests Card */}
        <TripGuestsCard
          guestsCount={booking?.guests || booking?.totalGuests || 1}
          primaryGuestName={
            booking?.user?.name?.trim() ||
            booking?.primaryGuest?.name ||
            'Vrushali'
          }
          occasion={booking?.primaryGuest?.occasion || 'Private Luxury Charter'}
          onPressView={onPressGuestsView}
        />

        {/* Conditions Summary Card */}
        <TripConditionsSummaryCard
          temperatureF={82}
          windSpeedKnots={8}
          waveHeightFt={1.2}
          lastUpdated="Live forecast"
        />

        {/* Trip Overview Key-Value Details */}
        <TripOverviewTableCard
          date={booking?.bookingDate || '2026-10-28'}
          duration={booking?.duration ? `${booking.duration} hrs` : '4 hrs'}
          destination="Coastal Cruise"
          tripType="Private Charter"
          vesselName={booking?.yacht?.name || '100’ NEDSHIP'}
        />

        {/* Bottom Actions Container */}
        <View style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
          {/* Dual Action Buttons (Call Guest / Message) */}
          <View className="flex-row items-center justify-between space-x-3 mb-3">
            {/* Call Guest Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onCallGuest}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 6,
                elevation: 1,
              }}
              className="flex-1 bg-white border border-slate-200 py-3 rounded-2xl flex-row items-center justify-center mr-2"
            >
              <Text className="text-sm mr-2">📞</Text>
              <Text className="text-xs font-bold text-slate-800">
                Call Guest
              </Text>
            </TouchableOpacity>

            {/* Message Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onMessageGuest}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 6,
                elevation: 1,
              }}
              className="flex-1 bg-white border border-slate-200 py-3 rounded-2xl flex-row items-center justify-center"
            >
              <Text className="text-sm mr-2">💬</Text>
              <Text className="text-xs font-bold text-slate-800">
                Message
              </Text>
            </TouchableOpacity>
          </View>

          {/* Primary CTA: Continue Preparation */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onContinuePreparation}
            style={{
              shadowColor: '#1592A6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 3,
            }}
            className="w-full bg-brand-primary py-3.5 rounded-2xl items-center justify-center"
          >
            <Text className="text-white font-extrabold text-sm tracking-wide">
              Continue Preparation
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TripDetailsScreen;

