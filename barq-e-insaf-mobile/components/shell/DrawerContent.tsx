import React from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import {
  LayoutDashboard, BarChart3, Users, Scale, Briefcase, FileText,
  Calendar, AlertTriangle, Flag, Star, Bot, Globe,
  Tag, MapPin, Shield, ClipboardList, Bell, Settings, ChevronRight,
  X, Gavel,
} from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { useStore } from '@/lib/store';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/(admin)/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/(admin)/analytics', icon: BarChart3, label: 'Analytics' },
      { href: '/(admin)/cases', icon: Briefcase, label: 'Cases' },
      { href: '/(admin)/evidence-moderation', icon: Shield, label: 'Evidence Moderation' },
    ],
  },
  {
    label: 'People',
    items: [
      { href: '/(admin)/users', icon: Users, label: 'Users (Clients)' },
      { href: '/(admin)/lawyers', icon: Scale, label: 'Lawyers' },
      { href: '/(admin)/verification-queue', icon: Gavel, label: 'Verification Queue', badge: 'queue' as const },
    ],
  },
  {
    label: 'Moderation',
    items: [
      { href: '/(admin)/disputes', icon: AlertTriangle, label: 'Disputes', badge: 'disputes' as const },
      { href: '/(admin)/reports', icon: Flag, label: 'Reports', badge: 'reports' as const },
      { href: '/(admin)/reviews', icon: Star, label: 'Reviews' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/(admin)/ai-monitoring', icon: Bot, label: 'AI Monitoring' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/(admin)/categories', icon: Tag, label: 'Categories' },
      { href: '/(admin)/locations', icon: MapPin, label: 'Locations' },
      { href: '/(admin)/cms-pages', icon: Globe, label: 'CMS Pages' },
      { href: '/(admin)/faqs', icon: Globe, label: 'FAQs' },
      { href: '/(admin)/legal-resources', icon: Globe, label: 'Legal Resources' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { href: '/(admin)/admin-profile', icon: Shield, label: 'Admin Profile' },
      { href: '/(admin)/audit-logs', icon: ClipboardList, label: 'Audit Logs' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/(admin)/notifications-center', icon: Bell, label: 'Notifications', badge: 'notifications' as const },
      { href: '/(admin)/notification-settings', icon: Bell, label: 'Notif. Settings' },
      { href: '/(admin)/system-settings', icon: Settings, label: 'System Settings' },
    ],
  },
];

type BadgeKey = 'queue' | 'disputes' | 'reports' | 'notifications';

export function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { unreadCount, lawyers, disputes, reports } = useStore();

  const pendingLawyers = lawyers.filter(l => l.status === 'Pending' || l.status === 'Under Review').length;
  const openDisputes = disputes.filter(d => d.status === 'Open').length;
  const newReports = reports.filter(r => r.status === 'New').length;

  const badgeMap: Record<BadgeKey, number> = {
    queue: pendingLawyers,
    disputes: openDisputes,
    reports: newReports,
    notifications: unreadCount,
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoRow}>
        <Image
          source={require('@/assets/images/barq-e-insaf.png')}
          style={styles.logoImg}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.logoTitle}>Barq-e-Insaf</Text>
          <Text style={styles.logoSub}>Admin Panel</Text>
        </View>
      </View>

      {/* Nav */}
      <ScrollView style={styles.nav} showsVerticalScrollIndicator={false}>
        {NAV_GROUPS.map(group => (
          <View key={group.label} style={styles.group}>
            <Text style={styles.groupLabel}>{group.label}</Text>
            {group.items.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const badge = item.badge ? badgeMap[item.badge as BadgeKey] : 0;
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.href}
                  onPress={() => {
                    router.push(item.href as any);
                    props.navigation?.closeDrawer();
                  }}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  activeOpacity={0.7}
                >
                  <Icon
                    size={16}
                    color={isActive ? Colors.glow : Colors.textDimmer}
                    strokeWidth={2}
                  />
                  <Text style={[styles.navLabel, isActive && styles.navLabelActive]} numberOfLines={1}>
                    {item.label}
                  </Text>
                  {badge > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                  )}
                  {isActive && <ChevronRight size={12} color={Colors.textGhost} />}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.adminDot} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.adminName} numberOfLines={1}>Asad Khan</Text>
          <Text style={styles.adminRole}>SUPER ADMIN</Text>
        </View>
        <View style={styles.onlineDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoImg: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  logoTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  logoSub: {
    color: Colors.textDimmer,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
  nav: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  group: {
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textDimmest,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 2,
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  navLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  navLabelActive: {
    color: '#fff',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: Colors.brand,
    borderRadius: 99,
    minWidth: 18,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  adminDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminName: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  adminRole: {
    color: Colors.textDimmer,
    fontSize: 10,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.green,
  },
});
