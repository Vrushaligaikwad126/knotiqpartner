import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginService, LoginResponse } from '../../services';

export interface LoginScreenProps {
  onLoginSuccess?: (response: LoginResponse) => void;
  onForgotPassword?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    // Basic validation
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await loginService({
        email: email.trim(),
        password: password,
      });

      // Successful login
      onLoginSuccess?.(response);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7F9]" edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingVertical: 24,
          }}
        >
          {/* Top Brand Header */}
          <View className="items-center mb-6">
            {/* Nautical Helm Badge */}
            <View className="w-18 h-18 rounded-3xl bg-[#E0F5F8] items-center justify-center mb-3 border border-cyan-100 shadow-xs">
              <Text className="text-3xl">⚓</Text>
            </View>

            <View className="bg-cyan-50 border border-cyan-200/80 rounded-full px-3 py-1 mb-2">
              <Text className="text-[10px] font-extrabold tracking-widest text-cyan-800 uppercase">
                KnotIQ Partner Portal
              </Text>
            </View>

            <Text className="text-2xl font-black text-slate-900 tracking-tight text-center">
              Welcome Back, Captain
            </Text>

            <Text className="text-xs text-slate-500 font-medium text-center mt-1 max-w-xs leading-4">
              Sign in to manage your charter schedule, vessel operations, and guest check-ins.
            </Text>
          </View>

          {/* Elevated Login Card */}
          <View
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 14,
              elevation: 3,
            }}
            className="bg-white rounded-3xl p-6 border border-slate-100 mb-6"
          >
            {/* Error Banner */}
            {errorMessage && (
              <View className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-4 flex-row items-center">
                <Text className="text-sm mr-2">⚠️</Text>
                <Text className="text-xs font-semibold text-rose-700 flex-1">
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5 px-0.5">
                Email Address
              </Text>
              <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex-row items-center focus:border-cyan-600">
                <Text className="text-sm mr-2.5">✉️</Text>
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="captain@knotiq.com"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  className="flex-1 text-sm font-semibold text-slate-900 p-0"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-3">
              <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5 px-0.5">
                Password
              </Text>
              <View className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex-row items-center justify-between focus:border-cyan-600">
                <View className="flex-row items-center flex-1 mr-2">
                  <Text className="text-sm mr-2.5">🔒</Text>
                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter your password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    className="flex-1 text-sm font-semibold text-slate-900 p-0"
                  />
                </View>

                {/* Show/Hide Toggle */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowPassword(!showPassword)}
                  className="p-1"
                >
                  <Text className="text-xs font-bold text-slate-400">
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <View className="flex-row justify-end mb-5">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onForgotPassword}
              >
                <Text className="text-xs font-bold text-cyan-700">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In CTA Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={loading}
              onPress={handleLogin}
              style={{
                shadowColor: '#1592A6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 3,
              }}
              className={`w-full py-3.5 rounded-2xl items-center justify-center flex-row ${
                loading ? 'bg-cyan-700' : 'bg-brand-primary'
              }`}
            >
              {loading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text className="text-white font-extrabold text-sm ml-2">
                    Authenticating...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-extrabold text-sm tracking-wide">
                  Sign In to Dashboard
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Bottom Support Info */}
          <View className="items-center">
            <Text className="text-[11px] text-slate-400 font-medium">
              Need assistance with your account?
            </Text>
            <TouchableOpacity activeOpacity={0.7} className="mt-1">
              <Text className="text-xs font-bold text-cyan-800">
                Contact Fleet Dispatch or Dock Support
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

