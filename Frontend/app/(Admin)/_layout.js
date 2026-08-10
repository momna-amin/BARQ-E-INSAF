import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="CitizenManagement" options={{ headerShown: false }} />
      <Stack.Screen name="LawyerManagement" options={{ headerShown: false }} />
      <Stack.Screen name="NGOManagement" options={{ headerShown: false }} />
    </Stack>
  );
}
