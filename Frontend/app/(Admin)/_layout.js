import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* FIXED PERMANENT ☰ HAMBURGER BUTTON AT TOP-LEFT OF ALL ADMIN PAGES */}
      <TouchableOpacity
        style={styles.fixedHamburgerBtn}
        onPress={() => setSidebarOpen(prev => !prev)}
        activeOpacity={0.8}
      >
        <Text style={styles.hamburgerIcon}>☰</Text>
      </TouchableOpacity>

      {/* OVERLAY SIDEBAR DRAWER WITH GUARANTEED WORKING ✕ CLOSE BUTTON */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="AdminDashboard" options={{ headerShown: false }} />
        <Stack.Screen name="VerificationQueue" options={{ headerShown: false }} />
        <Stack.Screen name="UserManagement" options={{ headerShown: false }} />
        <Stack.Screen name="LawyerManagement" options={{ headerShown: false }} />
        <Stack.Screen name="CasesPage" options={{ headerShown: false }} />
        <Stack.Screen name="ReportsModeration" options={{ headerShown: false }} />
        <Stack.Screen name="ReviewsModeration" options={{ headerShown: false }} />
        <Stack.Screen name="AnalyticsPage" options={{ headerShown: false }} />
        <Stack.Screen name="AuditLogs" options={{ headerShown: false }} />
        <Stack.Screen name="CategoriesPage" options={{ headerShown: false }} />
        <Stack.Screen name="LocationsPage" options={{ headerShown: false }} />
        <Stack.Screen name="SystemSettings" options={{ headerShown: false }} />
        <Stack.Screen name="LawyerDetail" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  fixedHamburgerBtn: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    top: 18,
    left: 20,
    zIndex: 9990,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 12,
  },
  hamburgerIcon: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
});
