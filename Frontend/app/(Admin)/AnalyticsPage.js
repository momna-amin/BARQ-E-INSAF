import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import AdminSidebar from './AdminSidebar';

export default function AnalyticsPage() {
  const kpis = [
    { label: 'Total Registered Users', val: '2,841', change: '+14%', color: '#3b82f6' },
    { label: 'Verified Sindh Lawyers', val: '284', change: '+8%', color: '#10b981' },
    { label: 'Active Legal Cases', val: '1,094', change: '+18%', color: '#8b5cf6' },
    { label: 'Resolved Disputes', val: '3,220', change: '+24%', color: '#34d399' },
  ];

  const districts = [
    { district: 'Karachi Central', count: 284, pct: '100%' },
    { district: 'Hyderabad', count: 241, pct: '85%' },
    { district: 'Karachi South', count: 198, pct: '70%' },
    { district: 'Sukkur', count: 167, pct: '58%' },
    { district: 'Larkana', count: 143, pct: '50%' },
    { district: 'Naushahro Feroze', count: 121, pct: '42%' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0c0414" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="analytics" />
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          <Text style={styles.headerTitle}>📈 Platform Analytics & Insights</Text>
          <Text style={styles.headerSub}>Barq-e-Insaf case volume, lawyer growth & district analytics across Sindh</Text>

          <View style={styles.kpiGrid}>
            {kpis.map((k, i) => (
              <View key={i} style={[styles.kpiCard, { borderTopColor: k.color }]}>
                <Text style={styles.kpiLabel}>{k.label}</Text>
                <Text style={[styles.kpiVal, { color: k.color }]}>{k.val}</Text>
                <Text style={styles.kpiChange}>{k.change} vs last month</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Top Sindh Districts by Case Filings</Text>
            {districts.map(d => (
              <View key={d.district} style={styles.distRow}>
                <Text style={styles.distName}>{d.district}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: d.pct }]} />
                </View>
                <Text style={styles.distVal}>{d.count}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0c0414' },
  layoutRow: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1, backgroundColor: '#0f172a' },
  contentPadding: { padding: 24 },
  headerTitle: { color: '#f8fafc', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  kpiGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginTop: 20 },
  kpiCard: { flex: 1, minWidth: 160, backgroundColor: '#1e293b', borderRadius: 16, padding: 18, borderTopWidth: 4 },
  kpiLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  kpiVal: { fontSize: 26, fontWeight: '800', marginTop: 6 },
  kpiChange: { color: '#4ade80', fontSize: 11, marginTop: 4 },
  sectionCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginTop: 20 },
  sectionTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 16 },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  distName: { width: 130, color: '#e2e8f0', fontSize: 13 },
  barTrack: { flex: 1, height: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 5 },
  distVal: { width: 36, color: '#94a3b8', fontSize: 12, textAlign: 'right', fontWeight: '700' },
});
