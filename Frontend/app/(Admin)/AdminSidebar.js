import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', route: '/(Admin)/AdminDashboard' },
  { id: 'queue', label: 'Verification Queue', icon: '⏳', route: '/(Admin)/VerificationQueue', badge: '12' },
  { id: 'users', label: 'User Directory', icon: '👥', route: '/(Admin)/UserManagement' },
  { id: 'lawyers', label: 'Lawyer Directory', icon: '⚖️', route: '/(Admin)/LawyerManagement' },
  { id: 'cases', label: 'Cases & Disputes', icon: '📁', route: '/(Admin)/CasesDisputes', badge: '14' },
  { id: 'reports', label: 'Reports & Moderation', icon: '🚩', route: '/(Admin)/ReportsModeration', badge: '8' },
  { id: 'reviews', label: 'Reviews Moderation', icon: '⭐', route: '/(Admin)/ReviewsModeration' },
  { id: 'analytics', label: 'Analytics & Trends', icon: '📈', route: '/(Admin)/AnalyticsPage' },
  { id: 'audit', label: 'Audit Logs', icon: '🛡️', route: '/(Admin)/AuditLogs' },
  { id: 'categories', label: 'Legal Categories', icon: '🏷️', route: '/(Admin)/CategoriesPage' },
  { id: 'locations', label: 'Locations & Benches', icon: '📍', route: '/(Admin)/LocationsPage' },
  { id: 'settings', label: 'System Settings', icon: '⚙️', route: '/(Admin)/SystemSettings' },
];

export default function AdminSidebar({ activeRoute }) {
  const router = useRouter();
  const currentPath = usePathname();

  const handleNavigate = (item) => {
    router.push(item.route);
  };

  const handleLogout = () => {
    router.replace('/RoleSelectScreen');
  };

  return (
    <View style={styles.sidebar}>
      {/* BRAND HEADER */}
      <View style={styles.brandContainer}>
        <View style={styles.brandIcon}>
          <Text style={styles.brandIconText}>⚡</Text>
        </View>
        <View>
          <Text style={styles.brandTitle}>Barq-e-Insaf</Text>
          <Text style={styles.brandBadge}>Super Admin Panel</Text>
        </View>
      </View>

      {/* NAVIGATION MENU */}
      <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>MAIN NAVIGATION</Text>

        {MENU_ITEMS.map((item) => {
          const isActive = currentPath === item.route || activeRoute === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => handleNavigate(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navText, isActive && styles.navTextActive]}>
                {item.label}
              </Text>
              {item.badge && (
                <View style={[styles.badgePill, isActive && styles.badgePillActive]}>
                  <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                    {item.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* FOOTER USER PROFILE */}
      <View style={styles.footer}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>AK</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>Asad Khan</Text>
          <Text style={styles.userRole}>admin@barqeinsaf.pk</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: '#0c0414',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 20,
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandIconText: { fontSize: 20 },
  brandTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  brandBadge: { color: '#fbbf24', fontSize: 10, fontWeight: '700', marginTop: 1 },
  menuScroll: { flex: 1 },
  sectionLabel: { color: '#64748b', fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 12, marginTop: 4 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 4,
    gap: 12,
  },
  navItemActive: {
    backgroundColor: '#3b82f6',
  },
  navIcon: { fontSize: 16 },
  navText: { color: '#94a3b8', fontSize: 13, fontWeight: '600', flex: 1 },
  navTextActive: { color: '#ffffff', fontWeight: '800' },
  badgePill: { backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgePillActive: { backgroundColor: '#ffffff' },
  badgeText: { color: '#94a3b8', fontSize: 10, fontWeight: '700' },
  badgeTextActive: { color: '#3b82f6', fontWeight: '900' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  userAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#8b5cf6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  userName: { color: '#f8fafc', fontSize: 13, fontWeight: '700' },
  userRole: { color: '#64748b', fontSize: 10 },
  logoutBtn: { padding: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
  logoutIcon: { fontSize: 14 },
});
