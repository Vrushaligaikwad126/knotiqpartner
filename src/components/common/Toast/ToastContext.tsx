import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastConfig {
  id?: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (config: ToastConfig | string, type?: ToastType) => void;
  hideToast: () => void;
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
  };
}

const ToastContext = createContext<ToastContextType | null>(null);

let globalToastHandler: ((config: ToastConfig) => void) | null = null;

export const showGlobalToast = (config: ToastConfig) => {
  if (globalToastHandler) {
    globalToastHandler(config);
  }
};

export const toast = {
  success: (message: string, duration: number = 2800) => {
    showGlobalToast({ type: 'success', message, duration });
  },
  error: (message: string, duration: number = 3200) => {
    showGlobalToast({ type: 'error', message, duration });
  },
  info: (message: string, duration: number = 2800) => {
    showGlobalToast({ type: 'info', message, duration });
  },
  warning: (message: string, duration: number = 2800) => {
    showGlobalToast({ type: 'warning', message, duration });
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const [currentToast, setCurrentToast] = useState<ToastConfig | null>(null);

  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<any>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 15,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentToast(null);
    });
  }, [translateY, opacity]);

  const showToast = useCallback(
    (config: ToastConfig | string, type: ToastType = 'info') => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const toastData: ToastConfig =
        typeof config === 'string'
          ? { message: config, type }
          : { ...config, type: config.type || type };

      setCurrentToast(toastData);

      // Reset values for entrance animation from bottom
      translateY.setValue(20);
      opacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 9,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      const duration = toastData.duration || 2800;
      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [translateY, opacity, hideToast]
  );

  globalToastHandler = showToast;

  const toastHelpers = {
    success: (message: string, duration: number = 2800) =>
      showToast({ type: 'success', message, duration }),
    error: (message: string, duration: number = 3200) =>
      showToast({ type: 'error', message, duration }),
    info: (message: string, duration: number = 2800) =>
      showToast({ type: 'info', message, duration }),
    warning: (message: string, duration: number = 2800) =>
      showToast({ type: 'warning', message, duration }),
  };

  const toastType = currentToast?.type || 'info';

  // Subtle accent dot for type differentiation without cluttering the minimalist aesthetic
  const dotColor =
    toastType === 'success'
      ? '#34D399' // soft emerald
      : toastType === 'error'
      ? '#F87171' // soft rose
      : toastType === 'warning'
      ? '#FBBF24' // soft amber
      : '#38BDF8'; // soft cyan/sky

  // Combined display text
  const displayText = currentToast
    ? currentToast.title && currentToast.message
      ? `${currentToast.message}`
      : currentToast.message || currentToast.title || ''
    : '';

  return (
    <ToastContext.Provider value={{ showToast, hideToast, toast: toastHelpers }}>
      {children}

      {/* Minimalist Floating Pill Toast (Matching Reference) */}
      {currentToast && (
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            bottom: Math.max(insets.bottom + 85, Platform.OS === 'android' ? 88 : 95),
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            elevation: 12,
          }}
        >
          <Animated.View
            style={{
              transform: [{ translateY }],
              opacity,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={hideToast}
              style={{
                backgroundColor: 'rgba(48, 52, 56, 0.94)',
                borderRadius: 9999,
                paddingVertical: 10,
                paddingHorizontal: 22,
                maxWidth: 320,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.22,
                shadowRadius: 10,
                elevation: 6,
                borderWidth: 0.6,
                borderColor: 'rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* Subtle Status Indicator Dot */}
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: dotColor,
                  marginRight: 8,
                }}
              />

              <Text
                numberOfLines={2}
                style={{
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: '600',
                  letterSpacing: 0.1,
                  textAlign: 'center',
                }}
              >
                {displayText}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (config: ToastConfig | string) =>
        showGlobalToast(typeof config === 'string' ? { message: config } : config),
      hideToast: () => {},
      toast,
    };
  }
  return context;
};

export default ToastProvider;
