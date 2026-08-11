import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="AdminDashboard" options={{ headerShown: false }} />
      <Stack.Screen name="VerificationQueue" options={{ headerShown: false }} />
      <Stack.Screen name="UserManagement" options={{ headerShown: false }} />
      <Stack.Screen name="LawyerManagement" options={{ headerShown: false }} />
      <Stack.Screen name="CasesDisputes" options={{ headerShown: false }} />
      <Stack.Screen name="ReportsModeration" options={{ headerShown: false }} />
      <Stack.Screen name="ReviewsModeration" options={{ headerShown: false }} />
      <Stack.Screen name="AnalyticsPage" options={{ headerShown: false }} />
      <Stack.Screen name="AuditLogs" options={{ headerShown: false }} />
      <Stack.Screen name="CategoriesPage" options={{ headerShown: false }} />
      <Stack.Screen name="LocationsPage" options={{ headerShown: false }} />
      <Stack.Screen name="AppointmentsPage" options={{ headerShown: false }} />
      <Stack.Screen name="SystemSettings" options={{ headerShown: false }} />
    </Stack>
  );
}
