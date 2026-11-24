import './global.css';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider, toast } from './src/components/common/Toast';
import { LoginScreen } from './src/screen/auth/LoginScreen';
import { HomeScreen } from './src/features/home/screens/HomeScreen';
import { TripsScreen } from './src/features/trips/screens/TripsScreen';
import { TripDetailsScreen } from './src/features/trips/screens/TripDetailsScreen';
import { GuestDetailsScreen } from './src/features/trips/screens/GuestDetailsScreen';
import { GuestProfileScreen } from './src/features/trips/screens/GuestProfileScreen';
import { VesselsScreen } from './src/features/vessels/screens/VesselsScreen';
import { MoreScreen } from './src/features/more/screens/MoreScreen';
import { ChatScreen } from './src/features/chat/screens/ChatScreen';
import { TabKey } from './src/components/navigation/BottomTabBar';
import {
  CaptainProfile,
  getAuthSession,
  clearAuthSession,
  setAuthToken,
} from './src/services';

type ActiveView = 'Login' | 'Tabs' | 'TripDetails' | 'GuestDetails' | 'GuestProfile' | 'Chat';

function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>('Home');
  const [navStack, setNavStack] = useState<ActiveView[]>(['Login']);
  const [selectedTripId, setSelectedTripId] = useState<string>('303');
  const [captain, setCaptain] = useState<CaptainProfile | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  // Active view is the top-most view on the navigation stack
  const activeView: ActiveView = navStack[navStack.length - 1] || 'Login';

  // Navigate forward to a new view
  const navigateTo = useCallback((view: ActiveView) => {
    setNavStack((prev) => {
      // Don't push identical view consecutively
      if (prev[prev.length - 1] === view) return prev;
      return [...prev, view];
    });
  }, []);

  // Navigate back to the previous view in the stack
  const handleGoBack = useCallback((): boolean => {
    if (navStack.length > 1) {
      setNavStack((prev) => prev.slice(0, prev.length - 1));
      return true; // Handled back navigation
    }

    // If at the root 'Tabs' view but not on Home tab, return to Home tab
    if (activeView === 'Tabs' && currentTab !== 'Home') {
      setCurrentTab('Home');
      return true; // Handled back navigation to Home
    }

    // At root Home or Login screen; allow default Android exit
    return false;
  }, [navStack, activeView, currentTab]);

  // Tab change handler
  const handleTabChange = useCallback((tab: TabKey) => {
    setCurrentTab(tab);
    // When changing bottom tabs, reset navigation stack to Tabs root
    setNavStack(['Tabs']);
  }, []);

  // Intercept Android hardware / bottom navigation back button
  useEffect(() => {
    const onHardwareBackPress = () => {
      if (isRestoringSession || activeView === 'Login') {
        return false;
      }
      return handleGoBack();
    };

    const backSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onHardwareBackPress
    );

    return () => backSubscription.remove();
  }, [handleGoBack, isRestoringSession, activeView]);

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
            setNavStack(['Tabs']);
          } else {
            setNavStack(['Login']);
          }
        }
      } catch (err) {
        console.log('Error restoring session:', err);
        if (isMounted) setNavStack(['Login']);
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
    setNavStack(['Login']);
    toast.info('Signed out of portal');
  };

  const renderContent = () => {
    // Splash / Session restoration screen
    if (isRestoringSession) {
      return (
        <View className="flex-1 bg-[#F4F7F9] items-center justify-center">
          <View className="w-16 h-16 rounded-3xl bg-[#E0F5F8] items-center justify-center mb-4 border border-cyan-100">
            <Text className="text-3xl">⚓</Text>
          </View>
          <ActivityIndicator color="#1592A6" size="large" />
          <Text className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-3">
            Resuming Captain Session...
          </Text>
        </View>
      );
    }

    // 1. Login Screen
    if (activeView === 'Login') {
      return (
        <LoginScreen
          onLoginSuccess={(response) => {
            console.log('Login successful:', response);
            if (response.data) {
              setCaptain(response.data);
            }
            setNavStack(['Tabs']);
            toast.success('Logged in successfully');
          }}
          onForgotPassword={() => {
            console.log('Forgot password tapped');
            toast.info('Contact Fleet Dispatch to reset credentials');
          }}
        />
      );
    }

    // 2. Chat Screen (Owner / Captain real-time channel)
    if (activeView === 'Chat') {
      return (
        <ChatScreen
          bookingId={selectedTripId}
          onBack={handleGoBack}
        />
      );
    }

    // 3. Guest Profile Modal / Screen
    if (activeView === 'GuestProfile') {
      return (
        <GuestProfileScreen
          bookingId={selectedTripId}
          onBack={handleGoBack}
          onDismiss={handleGoBack}
          onSendSMS={() => navigateTo('Chat')}
        />
      );
    }

    // 4. Guest Details Screen
    if (activeView === 'GuestDetails') {
      return (
        <GuestDetailsScreen
          bookingId={selectedTripId}
          onBack={handleGoBack}
          onSelectGuest={() => navigateTo('GuestProfile')}
          onMessageGuest={() => navigateTo('Chat')}
        />
      );
    }

    // 5. Trip Details Screen
    if (activeView === 'TripDetails') {
      return (
        <TripDetailsScreen
          tripId={selectedTripId}
          onBack={handleGoBack}
          onPressGuestsView={() => navigateTo('GuestDetails')}
          onMessageGuest={() => navigateTo('Chat')}
        />
      );
    }

    // 6. Bottom Tabs Navigation (Home / Trips / Vessel / Profile / More)
    return currentTab === 'More' || currentTab === 'Profile' ? (
      <MoreScreen
        crewId={captain?.crewId}
        onNavigateTab={handleTabChange}
        onLogout={handleLogout}
        onBack={() => handleTabChange('Home')}
      />
    ) : currentTab === 'Vessel' ? (
      <VesselsScreen
        yachtId={captain?.yachtId}
        yacht={captain?.yacht}
        captainName={captain?.name}
        onNavigateTab={handleTabChange}
        onSelectTrip={() => {
          setSelectedTripId(captain?.yachtId || '303');
          navigateTo('TripDetails');
        }}
        onPressGuests={() => navigateTo('GuestDetails')}
        onMessageGuest={() => navigateTo('Chat')}
      />
    ) : currentTab === 'Trips' ? (
      <TripsScreen
        yachtId={captain?.yachtId}
        onNavigateTab={handleTabChange}
        onSelectTrip={(id) => {
          setSelectedTripId(id);
          navigateTo('TripDetails');
        }}
      />
    ) : (
      <HomeScreen
        captainName={captain?.name}
        yachtName={captain?.yacht?.name}
        onNavigateTab={handleTabChange}
        onPressCharter={() => {
          setSelectedTripId('303');
          navigateTo('TripDetails');
        }}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <ToastProvider>
        {renderContent()}
      </ToastProvider>
    </SafeAreaProvider>
  );
}

export default App;
