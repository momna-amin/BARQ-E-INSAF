import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { CustomDrawerContent } from '@/components/shell/DrawerContent';
import { Colors } from '@/lib/theme';

export default function AdminLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0a0a0a',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: '700',
        },
        drawerStyle: {
          width: 280,
          backgroundColor: '#0a0a0a',
        },
        sceneStyle: {
          backgroundColor: Colors.bg,
        },
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="analytics" options={{ title: 'Analytics' }} />
      <Drawer.Screen name="users" options={{ title: 'Users (Clients)' }} />
      <Drawer.Screen name="lawyers" options={{ title: 'Lawyers' }} />
      <Drawer.Screen name="verification-queue" options={{ title: 'Verification Queue' }} />
      <Drawer.Screen name="cases" options={{ title: 'Cases' }} />
      <Drawer.Screen name="evidence-moderation" options={{ title: 'Evidence Moderation' }} />
      <Drawer.Screen name="proposals" options={{ title: 'Proposals' }} />
      <Drawer.Screen name="appointments" options={{ title: 'Appointments' }} />
      <Drawer.Screen name="disputes" options={{ title: 'Disputes' }} />
      <Drawer.Screen name="reports" options={{ title: 'Reports' }} />
      <Drawer.Screen name="reviews" options={{ title: 'Reviews' }} />
      <Drawer.Screen name="ai-monitoring" options={{ title: 'AI Monitoring' }} />
      <Drawer.Screen name="categories" options={{ title: 'Categories' }} />
      <Drawer.Screen name="locations" options={{ title: 'Locations' }} />
      <Drawer.Screen name="cms-pages" options={{ title: 'CMS Pages' }} />
      <Drawer.Screen name="faqs" options={{ title: 'FAQs' }} />
      <Drawer.Screen name="legal-resources" options={{ title: 'Legal Resources' }} />
      <Drawer.Screen name="admin-profile" options={{ title: 'Admin Profile' }} />
      <Drawer.Screen name="audit-logs" options={{ title: 'Audit Logs' }} />
      <Drawer.Screen name="notifications-center" options={{ title: 'Notifications' }} />
      <Drawer.Screen name="notification-settings" options={{ title: 'Notification Settings' }} />
      <Drawer.Screen name="system-settings" options={{ title: 'System Settings' }} />
    </Drawer>
  );
}
