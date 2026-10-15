import '../../global.css';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
} from '@expo-google-fonts/jetbrains-mono';
import { colors } from '../theme/tokens';
import { initRevenueCat } from '../lib/revenuecat';
import { initSentry } from '../lib/sentry';
import { TacticalToast } from '../components/ui/TacticalToast';
import { BootSplash } from '../components/ui/LoadingOverlay';
import { useUserStore } from '../store/useUserStore';

const queryClient = new QueryClient();

function RootNavigation() {
  const router = useRouter();
  const segments = useSegments();
  const { hasSeenIntro, isAuthenticated, hasCompletedDiagnostic, hasHydrated } = useUserStore();
  const [isHydrated, setIsHydrated] = useState(hasHydrated);

  useEffect(() => {
    if (hasHydrated) {
      setIsHydrated(true);
      return;
    }
    const unsub = useUserStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    if (useUserStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }
    return () => unsub();
  }, [hasHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    const rootSegment = segments[0] as string | undefined;
    const subSegment = segments[1] as string | undefined;

    // Allow user to remain on welcome walkthrough if navigated there explicitly
    if (rootSegment === '(onboarding)' && subSegment === 'welcome') {
      return;
    }

    if (!hasSeenIntro) {
      if (rootSegment !== '(onboarding)' || subSegment !== 'welcome') {
        router.replace('/(onboarding)/welcome' as any);
      }
    } else if (!isAuthenticated) {
      if (rootSegment !== '(auth)') {
        router.replace('/(auth)/login');
      }
    } else if (!hasCompletedDiagnostic) {
      if (rootSegment !== '(onboarding)' || subSegment !== 'diagnostic') {
        router.replace('/(onboarding)/diagnostic' as any);
      }
    } else {
      // Authenticated & diagnostic complete: exit auth/diagnostic if landing there
      if (rootSegment === '(auth)' || (rootSegment === '(onboarding)' && subSegment === 'diagnostic')) {
        router.replace('/(tabs)');
      }
    }
  }, [isHydrated, hasSeenIntro, isAuthenticated, hasCompletedDiagnostic, segments]);

  return (
    <>
      <TacticalToast />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.surface },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen
          name="paywall"
          options={{
            presentation: 'modal',
            headerShown: false,
            contentStyle: { backgroundColor: colors.surface },
          }}
        />
        <Stack.Screen
          name="advisor"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: false,
            contentStyle: { backgroundColor: colors.surface },
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: false,
            contentStyle: { backgroundColor: colors.surface },
          }}
        />
        <Stack.Screen
          name="legal"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: false,
            contentStyle: { backgroundColor: colors.surface },
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    initSentry();
    initRevenueCat();
  }, []);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <View style={styles.container}>
          <StatusBar style="light" />
          <RootNavigation />
          {showSplash && (
            <BootSplash
              duration={1400}
              onFinish={() => setShowSplash(false)}
            />
          )}
        </View>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#09090B',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
