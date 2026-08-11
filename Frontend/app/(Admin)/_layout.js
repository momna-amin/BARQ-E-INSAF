import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="AdminDashboard" options={{ headerShown: false }} />
      <Stack.Screen name="VerificationQueue" options={{ headerShown: false }} />
      <Stack.Screen name="UserManagement" options={{ headerShown: false }} />
      <Stack.Screen name="CasesDisputes" options={{ headerShown: false }} />
      <Stack.Screen name="SystemSettings" options={{ headerShown: false }} />
    </Stack>
  );
}
