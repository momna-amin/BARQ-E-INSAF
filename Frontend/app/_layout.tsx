import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import AIChatFloatingButton from '../components/AIChatFloatingButton';
import { getTokens, getUser, clearTokens } from '../services/authStorage';
import api from '../services/api';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [checking, setChecking] = useState(true); // true = still checking session

  // ── Auto-login on every app boot ──────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { refreshToken, accessToken } = await getTokens();

        // No token at all → show login
        if (!refreshToken && !accessToken) {
          setChecking(false);
          return;
        }

        // Try to refresh session silently
        try {
          const res = await api.post('/auth/refresh', { refreshToken });
          const { accessToken: newAccess, refreshToken: newRefresh, user } = res.data;

          // Save fresh tokens
          const { saveTokens, saveUser } = await import('../services/authStorage');
          await saveTokens(newAccess, newRefresh);
          if (user) await saveUser(user);

          // Route by role
          const role = user?.role || (await getUser())?.role;
          const dest =
            role === 'citizen' ? '/(citizen)/CitizenHome' :
            role === 'lawyer'  ? '/(lawyer)/LawyerHome'  :
            role === 'admin'   ? '/(Admin)/AdminDashboard' :
            role === 'ngo'     ? '/(ngo)/NGOHome'         :
            null;

          if (dest) {
            router.replace(dest);
            return; // don't setChecking(false) — we're navigating away
          }
        } catch {
          // Refresh failed (expired/invalid) → clear tokens → show login
          await clearTokens();
        }
      } catch {
        // Any unexpected error → safe fallback to login
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  // Show a minimal splash while session check runs
  if (checking) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0b5d3b', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Core Startup Screens */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
        <Stack.Screen name="StartScreen" options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingScreen" options={{ headerShown: false }} />
        <Stack.Screen name="LandingScreen" options={{ headerShown: false }} />
        <Stack.Screen name="RoleSelectScreen" options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" options={{ headerShown: false }} />

        {/* Route Group Folders */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(Admin)" options={{ headerShown: false }} />
        <Stack.Screen name="(lawyer)" options={{ headerShown: false }} />
        <Stack.Screen name="(citizen)" options={{ headerShown: false }} />
        <Stack.Screen name="(ngo)" options={{ headerShown: false }} />

        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      <StatusBar style="auto" />

      {/* ⚡ Moveable Draggable AI Chatbot Button on ALL Screens */}
      <AIChatFloatingButton />
    </ThemeProvider>
  );
}