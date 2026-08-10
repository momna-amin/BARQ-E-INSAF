import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Users, Scale, CheckCircle, Briefcase, TrendingUp,
  AlertTriangle, Clock,
} from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStore } from '@/lib/store';
import { timeAgo } from '@/lib/utils';
import {
  DASHBOARD_KPI, LAWYER_VERIFICATION_FUNNEL,
} from '@/lib/mock-data';

const KPI_CARDS = [
  { label: 'Total Users', key: 'totalUsers', change: '+142', icon: Users, color: '#3b82f6' },
  { label: 'Total Lawyers', key: 'totalLawyers', change: '+12 pending', icon: Scale, color: '#f59e0b' },
  { label: 'Verified Lawyers', key: 'verifiedLawyers', change: '76% verified', icon: CheckCircle, color: '#10b981' },
  { label: 'Active Cases', key: 'activeCases', change: '+88 this month', icon: Briefcase, color: '#8b5cf6' },
  { label: 'Completed Cases', key: 'completedCases', change: '+156 this month', icon: TrendingUp, color: '#A4F4FD' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { auditLogs, lawyers, disputes, reports } = useStore();

  const pendingLawyers = lawyers.filter(l => l.status === 'Pending' || l.status === 'Under Review').length;
  const openDisputes = disputes.filter(d => d.status === 'Open').length;
  const newReports = reports.filter(r => r.status === 'New').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Platform health at a glance</Text>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiGrid}>
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          const value = (DASHBOARD_KPI as any)[card.key];
          return (
            <GlassCard key={card.key} style={styles.kpiCard}>
              <View style={styles.kpiTop}>
                <View style={[styles.kpiIcon, { backgroundColor: card.color + '22' }]}>
                  <Icon size={16} color={card.color} />
                </View>
                <View style={styles.changeBadge}>
                  <Text style={styles.changeText}>{card.change}</Text>
                </View>
              </View>
              <Text style={styles.kpiValue}>{value.toLocaleString('en-PK')}</Text>
              <Text style={styles.kpiLabel}>{card.label}</Text>
            </GlassCard>
          );
        })}
      </View>

      {/* Pending Actions Required */}
      <GlassCard style={styles.section}>
        <View style={styles.sectionHeader}>
          <AlertTriangle size={16} color={Colors.amber} />
          <Text style={styles.sectionTitle}>Pending Actions Required</Text>
        </View>
        <View style={styles.pendingGrid}>
          {[
            { label: 'Lawyers Awaiting Verification', count: pendingLawyers, color: Colors.amber, bg: Colors.amberDim, href: '/(admin)/verification-queue' },
            { label: 'Open Disputes', count: openDisputes, color: Colors.red, bg: Colors.redDim, href: '/(admin)/disputes' },
            { label: 'New Reports', count: newReports, color: '#f97316', bg: 'rgba(249,115,22,0.1)', href: '/(admin)/reports' },
          ].map(item => (
            <TouchableOpacity
              key={item.label}
              onPress={() => router.push(item.href as any)}
              style={[styles.pendingItem, { backgroundColor: item.bg }]}
              activeOpacity={0.7}
            >
              <Text style={styles.pendingLabel}>{item.label}</Text>
              <Text style={[styles.pendingCount, { color: item.color }]}>{item.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </GlassCard>

      {/* Lawyer Verification Funnel */}
      <GlassCard style={styles.section}>
        <Text style={styles.sectionTitle}>Lawyer Verification Funnel</Text>
        <View style={styles.funnelGrid}>
          {LAWYER_VERIFICATION_FUNNEL.map((item, i) => {
            const funnelColors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
            return (
              <View key={item.stage} style={[styles.funnelItem, { backgroundColor: funnelColors[i] + '15' }]}>
                <Text style={[styles.funnelCount, { color: funnelColors[i] }]}>{item.count}</Text>
                <Text style={styles.funnelStage}>{item.stage}</Text>
              </View>
            );
          })}
        </View>
      </GlassCard>

      {/* Recent Activity */}
      <GlassCard style={styles.section}>
        <View style={styles.sectionHeaderBetween}>
          <View style={styles.sectionHeader}>
            <Clock size={16} color={Colors.textDim} />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(admin)/audit-logs' as any)}>
            <Text style={styles.viewAll}>View all →</Text>
          </TouchableOpacity>
        </View>
        {auditLogs.slice(0, 7).map(log => (
          <View key={log.id} style={styles.activityRow}>
            <View style={styles.activityDot} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.activityText}>
                <Text style={styles.activityActor}>{log.actor}</Text>
                {' · '}
                <Text style={styles.activityAction}>{log.action}</Text>
                {' · '}
                <Text style={styles.activityEntity}>{log.entityType} #{log.entityId}</Text>
              </Text>
            </View>
            <Text style={styles.activityTime}>{timeAgo(log.timestamp)}</Text>
          </View>
        ))}
      </GlassCard>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: Colors.textDim, marginTop: 2 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  kpiCard: { width: '47%', flexGrow: 1 },
  kpiTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  kpiIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  changeBadge: { backgroundColor: 'rgba(16,185,129,0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 99 },
  changeText: { fontSize: 10, fontWeight: '600', color: Colors.emerald },
  kpiValue: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 2 },
  kpiLabel: { fontSize: 11, color: Colors.textDim, fontWeight: '500' },
  section: { marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionHeaderBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#fff' },
  viewAll: { fontSize: 12, color: Colors.glow },
  pendingGrid: { gap: 8 },
  pendingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, padding: 12 },
  pendingLabel: { fontSize: 12, color: Colors.textMuted, flex: 1, paddingRight: 8 },
  pendingCount: { fontSize: 20, fontWeight: '800' },
  funnelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  funnelItem: { width: '47%', flexGrow: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  funnelCount: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  funnelStage: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  activityRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  activityDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.glow, marginTop: 4 },
  activityText: { fontSize: 12 },
  activityActor: { color: Colors.text, fontWeight: '500' },
  activityAction: { color: Colors.textMuted },
  activityEntity: { color: Colors.textDimmer },
  activityTime: { fontSize: 10, color: Colors.textDimmest },
});
