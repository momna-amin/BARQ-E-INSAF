import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import AIChatFloatingButton from '../components/AIChatFloatingButton';

// NOTE: Do NOT set initialRouteName here — it breaks
// Vercel static export by forcing the stack to start at
// (tabs) instead of following the current browser URL.
export const unstable_settings = {};

// NOTE: session/auto-login checking intentionally does NOT happen here anymore.
// It used to run on every cold boot and force-redirect away from whatever
// screen (StartScreen, RoleSelect, etc.) the user landed on — racing with
// SplashScreen's own navigation and getting stuck on a green loading screen
// that never resolved. Session checking now happens only on LoginScreen,
// scoped to the role the user actually selected. See LoginScreen.js.
export default function RootLayout() {
  const colorScheme = useColorScheme();

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