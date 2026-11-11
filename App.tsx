import './global.css';
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './src/screen/auth/LoginScreen';
import { HomeScreen } from './src/features/home/screens/HomeScreen';
import { TripsScreen } from './src/features/trips/screens/TripsScreen';
import { TripDetailsScreen } from './src/features/trips/screens/TripDetailsScreen';
import { GuestDetailsScreen } from './src/features/trips/screens/GuestDetailsScreen';
import { GuestProfileScreen } from './src/features/trips/screens/GuestProfileScreen';
import { VesselsScreen } from './src/features/vessels/screens/VesselsScreen';
import { MoreScreen } from './src/features/more/screens/MoreScreen';
import { TabKey } from './src/components/navigation/BottomTabBar';
import {
  CaptainProfile,
  getAuthSession,
  clearAuthSession,
  setAuthToken,
} from './src/services';

type ActiveView = 'Login' | 'Tabs' | 'TripDetails' | 'GuestDetails' | 'GuestProfile';

function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>('Home');
  const [activeView, setActiveView] = useState<ActiveView>('Login');
  const [selectedTripId, setSelectedTripId] = useState<string>('trip-island-explorer');
  const [captain, setCaptain] = useState<CaptainProfile | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  // Restore authenticated session from persistent storage on app startup
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const { token, captain: savedCaptain } = await getAuthSession();
        if (isMounted) {
          if (token && savedCaptain) {
            setAuthToken(token);
            setCaptain(savedCaptain);
            setActiveView('Tabs');
          } else {
            setActiveView('Login');
          }
        }
      } catch (err) {
        console.log('Error restoring session:', err);
        if (isMounted) setActiveView('Login');
      } finally {
        if (isMounted) setIsRestoringSession(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await clearAuthSession();
    setAuthToken(null);
    setCaptain(null);
    setActiveView('Login');
  };

  // Splash / Session restoration screen
  if (isRestoringSession) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 bg-[#F4F7F9] items-center justify-center">
          <View className="w-16 h-16 rounded-3xl bg-[#E0F5F8] items-center justify-center mb-4 border border-cyan-100">
            <Text className="text-3xl">⚓</Text>
          </View>
          <ActivityIndicator color="#1592A6" size="large" />
          <Text className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-3">
            Resuming Captain Session...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Login Screen (Calls POST /knotiqapi/yachtsOwners/login)
  if (activeView === 'Login') {
    return (
      <SafeAreaProvider>
        <LoginScreen
          onLoginSuccess={(response) => {
            console.log('Login successful:', response);
            if (response.data) {
              setCaptain(response.data);
            }
            setActiveView('Tabs');
          }}
          onForgotPassword={() => {
            console.log('Forgot password tapped');
          }}
        />
      </SafeAreaProvider>
    );
  }

  // Guest Profile Modal / Screen
  if (activeView === 'GuestProfile') {
    return (
      <SafeAreaProvider>
        <GuestProfileScreen
          bookingId={selectedTripId}
          onBack={() => setActiveView('GuestDetails')}
          onDismiss={() => setActiveView('GuestDetails')}
        />
      </SafeAreaProvider>
    );
  }

  // Guest Details Screen
  if (activeView === 'GuestDetails') {
    return (
      <SafeAreaProvider>
        <GuestDetailsScreen
          onBack={() => setActiveView('TripDetails')}
          onSelectGuest={() => setActiveView('GuestProfile')}
        />
      </SafeAreaProvider>
    );
  }

  // Trip Details Screen
  if (activeView === 'TripDetails') {
    return (
      <SafeAreaProvider>
        <TripDetailsScreen
          tripId={selectedTripId}
          onBack={() => setActiveView('Tabs')}
          onPressGuestsView={() => setActiveView('GuestDetails')}
        />
      </SafeAreaProvider>
    );
  }

  // Bottom Tabs Navigation (Home / Trips / Vessel / More)
  return (
    <SafeAreaProvider>
      {currentTab === 'More' ? (
        <MoreScreen
          crewId={captain?.crewId}
          onNavigateTab={setCurrentTab}
          onLogout={handleLogout}
        />
      ) : currentTab === 'Vessel' ? (
        <VesselsScreen
          yachtId={captain?.yachtId}
          yacht={captain?.yacht}
          captainName={captain?.name}
          onNavigateTab={setCurrentTab}
          onSelectTrip={() => setActiveView('TripDetails')}
          onPressGuests={() => setActiveView('GuestDetails')}
        />
      ) : currentTab === 'Trips' ? (
        <TripsScreen
          yachtId={captain?.yachtId}
          onNavigateTab={setCurrentTab}
          onSelectTrip={(id) => {
            setSelectedTripId(id);
            setActiveView('TripDetails');
          }}
        />
      ) : (
        <HomeScreen
          captainName={captain?.name}
          yachtName={captain?.yacht?.name}
          onNavigateTab={setCurrentTab}
          onPressCharter={() => {
            setSelectedTripId('charter-today');
            setActiveView('TripDetails');
          }}
        />
      )}
    </SafeAreaProvider>
  );
}

export default App;
