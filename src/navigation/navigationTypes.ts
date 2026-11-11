/**
 * Navigation Type Definitions
 * Designed to work standalone or with @react-navigation
 */

export type RootTabParamList = {
  Home: undefined;
  Trips: { filter?: 'Today' | 'Upcoming' | 'Completed' } | undefined;
  Vessel: { vesselId?: string } | undefined;
  More: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  TripDetails: { tripId: string };
  GuestDetails: { tripId: string };
  VesselDetails: { vesselId: string };
};

export type TabKey = keyof RootTabParamList;
export type ScreenKey = keyof RootStackParamList;
