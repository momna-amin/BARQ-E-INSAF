import { Stack } from 'expo-router';

export default function LawyerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LawyerHome" options={{ headerShown: false }} />
      <Stack.Screen name="CaseRequests" options={{ headerShown: false }} />
      <Stack.Screen name="MyCases" options={{ headerShown: false }} />
      <Stack.Screen name="CaseDetail" options={{ headerShown: false }} />
      <Stack.Screen name="LawyerProfile" options={{ headerShown: false }} />
      <Stack.Screen name="LawyerReviews" options={{ headerShown: false }} />
      <Stack.Screen name="VerificationPending" options={{ headerShown: false }} />
      <Stack.Screen name="Schedule" options={{ headerShown: false }} />
    </Stack>
  );
}