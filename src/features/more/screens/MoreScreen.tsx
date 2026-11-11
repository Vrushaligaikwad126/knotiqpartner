import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar, TabKey } from '../../../components/navigation/BottomTabBar';
import {
  AnchorIcon,
  GlobeIcon,
  AwardIcon,
  MailIcon,
  SettingsIcon,
  BoatIcon,
} from '../../../components/common/Icons';
import { getCrewById, CrewMemberData, getAuthSession } from '../../../services';

export interface MoreScreenProps {
  crewId?: string | number;
  onNavigateTab?: (tab: TabKey) => void;
  onLogout?: () => void;
  onBack?: () => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({
  crewId,
  onNavigateTab,
  onLogout,
  onBack,
}) => {
  const [crew, setCrew] = useState<CrewMemberData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCrewProfile = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        // Dynamically resolve captain ID from props or stored session
        let dynamicCaptainId = crewId;
        if (!dynamicCaptainId) {
          const session = await getAuthSession();
          dynamicCaptainId = session.captain?.crewId;
        }

        if (!dynamicCaptainId) {
          throw new Error('Captain ID not found. Please log in again.');
        }

        const response = await getCrewById(dynamicCaptainId);
        if (isMounted && response?.data) {
          setCrew(response.data);
        }
      } catch (err: any) {
        if (isMounted) {
          console.log('Error loading crew profile:', err);
          setErrorMessage(err.message || 'Could not load crew profile.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCrewProfile();

    return () => {
      isMounted = false;
    };
  }, [crewId]);

  // Compute initials for avatar fallback (e.g. "VG" for "Vrushali Gaikwad")
  const captainName = crew?.name || 'Vrushali Gaikwad';
  const initials = captainName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Parse comma-separated languages cleanly
  const languageList = crew?.language
    ? crew.language.split(',').map((l) => l.trim()).filter(Boolean)
    : ['English', 'Spanish', 'French', 'Marathi'];

  // Parse certifications
  const certList =
    crew?.certifications && crew.certifications.length > 0
      ? crew.certifications
      : ['Advanced Sailing Certifications', 'Maritime Safety STCW'];

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7F9]" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Fixed Top Header (Never cut off or scrolled away awkwardly) */}
      <View className="px-5 pt-2 pb-3 bg-[#F4F7F9] border-b border-slate-200/60 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-2">
          {onBack && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onBack}
              className="w-9 h-9 items-center justify-center mr-2 rounded-full active:bg-slate-200"
            >
              <Text className="text-xl font-bold text-slate-900">←</Text>
            </TouchableOpacity>
          )}
          <View>
            <Text className="text-xl font-black text-slate-900">Captain Profile</Text>
            <Text className="text-xs text-cyan-700/80 font-medium">
              Maritime operations & credentials
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full bg-cyan-50 items-center justify-center border border-cyan-100"
        >
          <SettingsIcon size={18} color="#1592A6" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 relative">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 110,
          }}
        >
          {/* Loading Indicator */}
          {loading && (
            <View className="py-4 items-center">
              <ActivityIndicator color="#1592A6" size="small" />
              <Text className="text-xs text-slate-400 font-medium mt-1.5">
                Refreshing profile credentials...
              </Text>
            </View>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <View className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-4 flex-row items-center">
              <Text className="text-sm mr-2">⚠️</Text>
              <Text className="text-xs font-semibold text-rose-700 flex-1">
                {errorMessage}
              </Text>
            </View>
          )}

          {/* 1. Hero Profile Card */}
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 2,
            }}
            className="bg-white rounded-3xl p-5 border border-slate-100 mb-4 items-center"
          >
            {/* Captain Avatar Container */}
            <View className="relative mb-2.5">
              {crew?.profilePicture ? (
                <Image
                  source={{ uri: crew.profilePicture }}
                  className="w-20 h-20 rounded-full border-2 border-cyan-100"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-20 h-20 rounded-full bg-[#1592A6] items-center justify-center border-3 border-cyan-100 shadow-sm">
                  <Text className="text-2xl font-black text-white tracking-wider">
                    {initials}
                  </Text>
                </View>
              )}

              {/* Active Duty Indicator Badge */}
              <View className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#10B981] border-2 border-white items-center justify-center shadow-xs">
                <Text className="text-xs text-white font-extrabold leading-3">✓</Text>
              </View>
            </View>

            {/* Captain Name */}
            <Text className="text-2xl font-black text-slate-900 tracking-tight text-center">
              {captainName}
            </Text>

            {/* Role & Active Status Chips */}
            <View className="flex-row items-center mt-1.5">
              <View className="bg-[#E0F5F8] rounded-md px-2.5 py-0.5 border border-cyan-100 mr-2">
                <Text className="text-[10px] font-extrabold tracking-wide text-[#1592A6]">
                  {crew?.role ? crew.role.toUpperCase() : 'CAPTAIN'}
                </Text>
              </View>

              <View className="bg-[#E6F8F2] rounded-full px-2.5 py-0.5 border border-[#BCEEDB]">
                <Text className="text-[10px] font-bold text-[#0D7A5C]">
                  ● Active Duty
                </Text>
              </View>
            </View>

            {/* Assigned Yacht Pill */}
            <View className="bg-slate-50 border border-slate-100 rounded-full px-3.5 py-1.5 mt-3 flex-row items-center">
              <BoatIcon size={14} color="#1592A6" />
              <Text className="text-xs font-bold text-slate-700 ml-1.5">
                Assigned: {crew?.yacht?.name || '100’ NEDSHIP'} ({crew?.yacht?.model || 'DT 120'})
              </Text>
            </View>
          </View>

          {/* 2. Qualifications & Credentials Card */}
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
            <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
              Qualifications & Credentials
            </Text>

            {/* Sea Experience */}
            <View className="flex-row items-center justify-between py-2.5 border-b border-slate-100">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-cyan-50 items-center justify-center mr-3 border border-cyan-100">
                  <AnchorIcon size={15} color="#1592A6" />
                </View>
                <Text className="text-xs font-semibold text-slate-500">
                  Sea Experience
                </Text>
              </View>
              <Text className="text-xs font-black text-slate-900">
                {crew?.experience || '5 years'}
              </Text>
            </View>

            {/* Languages */}
            <View className="py-2.5 border-b border-slate-100">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-lg bg-blue-50 items-center justify-center mr-3 border border-blue-100">
                    <GlobeIcon size={15} color="#2B6CB0" />
                  </View>
                  <Text className="text-xs font-semibold text-slate-500">
                    Languages
                  </Text>
                </View>
                <Text className="text-[11px] font-bold text-cyan-700">
                  {languageList.length} Fluent
                </Text>
              </View>

              {/* Wrapped Language Badges so they NEVER overflow or squish */}
              <View className="flex-row flex-wrap gap-1.5 pl-11">
                {languageList.map((lang, idx) => (
                  <View
                    key={idx}
                    className="bg-slate-50 border border-slate-200/80 rounded-md px-2.5 py-1 mr-1.5 mb-1"
                  >
                    <Text className="text-[11px] font-semibold text-slate-800">
                      {lang}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Certifications */}
            <View className="pt-2.5">
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 rounded-lg bg-amber-50 items-center justify-center mr-3 border border-amber-100">
                  <AwardIcon size={15} color="#D97706" />
                </View>
                <Text className="text-xs font-semibold text-slate-500">
                  Certifications
                </Text>
              </View>

              <View className="flex-row flex-wrap pl-11">
                {certList.map((cert, index) => (
                  <View
                    key={index}
                    className="bg-[#EBF7F9] border border-cyan-100 rounded-full px-3 py-1 mr-2 mb-1.5 flex-row items-center"
                  >
                    <Text className="text-[11px] font-extrabold text-[#1592A6] mr-1">✓</Text>
                    <Text className="text-[11px] font-bold text-cyan-900">{cert}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* 3. Assigned Vessel Specifications Card */}
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
            <View className="flex-row items-center justify-between mb-3.5">
              <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Assigned Vessel Specs
              </Text>
              <View className="bg-slate-100 px-2 py-0.5 rounded">
                <Text className="text-[10px] font-extrabold text-slate-600">
                  {crew?.yacht?.sequenceId || 'KNY-0045'}
                </Text>
              </View>
            </View>

            {/* 3 Stat Boxes with proper padding and text wrapping protection */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1 bg-slate-50 rounded-2xl py-2.5 px-2 mr-2 border border-slate-100 items-center justify-center">
                <Text className="text-[9px] font-bold tracking-wider text-slate-400 uppercase text-center">
                  Capacity
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-sm font-black text-slate-900 mt-0.5 text-center"
                >
                  {crew?.yacht?.capacity || 40} Guests
                </Text>
              </View>

              <View className="flex-1 bg-slate-50 rounded-2xl py-2.5 px-2 mr-2 border border-slate-100 items-center justify-center">
                <Text className="text-[9px] font-bold tracking-wider text-slate-400 uppercase text-center">
                  Length
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-sm font-black text-slate-900 mt-0.5 text-center"
                >
                  {crew?.yacht?.length || 100} ft
                </Text>
              </View>

              <View className="flex-1 bg-slate-50 rounded-2xl py-2.5 px-2 border border-slate-100 items-center justify-center">
                <Text className="text-[9px] font-bold tracking-wider text-slate-400 uppercase text-center">
                  Hourly Rate
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-sm font-black text-[#1592A6] mt-0.5 text-center"
                >
                  ${crew?.yacht?.perHour ? Math.round(Number(crew.yacht.perHour)).toLocaleString() : '2,560'}
                </Text>
              </View>
            </View>

            {/* Footnote description box */}
            <View className="bg-cyan-50/50 rounded-xl p-2.5 border border-cyan-100/60 mt-1">
              <Text className="text-[11px] text-slate-600 leading-4">
                ℹ️ {crew?.yacht?.note ||
                  'The coverage area may vary depending on the yacht and duration of the charter.'}
              </Text>
            </View>
          </View>

          {/* 4. Contact & Bio Card */}
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
            <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
              Contact & Bio
            </Text>

            {/* Email row */}
            <View className="flex-row items-center justify-between py-2.5 border-b border-slate-100">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-cyan-50 items-center justify-center mr-3 border border-cyan-100">
                  <MailIcon size={14} color="#1592A6" />
                </View>
                <Text className="text-xs font-semibold text-slate-500">Official Email</Text>
              </View>
              <Text
                selectable
                numberOfLines={1}
                className="text-xs font-bold text-slate-900 max-w-[180px] text-right"
              >
                {crew?.email || 'vrushalig126@gmail.com'}
              </Text>
            </View>

            {/* About Captain */}
            <View className="pt-3">
              <Text className="text-xs font-semibold text-slate-500 mb-1.5">
                About Captain
              </Text>
              <View className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <Text className="text-xs text-slate-700 leading-5">
                  {crew?.about && crew.about.trim().length > 0
                    ? crew.about
                    : 'Professional yacht captain dedicated to ensuring safe, memorable, and luxurious charter experiences.'}
                </Text>
              </View>
            </View>
          </View>

          {/* 5. Logout Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onLogout}
            className="w-full bg-rose-50 border border-rose-200/90 py-3.5 rounded-2xl items-center justify-center mb-8 active:bg-rose-100"
          >
            <Text className="text-rose-700 font-extrabold text-sm tracking-wide">
              Sign Out of Portal
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Floating Bottom Tab Bar with More Active */}
        <BottomTabBar
          activeTab="More"
          onTabPress={(tab) => onNavigateTab?.(tab)}
        />
      </View>
    </SafeAreaView>
  );
};

export default MoreScreen;
