import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import AIChatFloatingButton from '../components/AIChatFloatingButton';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

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