import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, Alert } from 'react-native';
import AdminSidebar from './AdminSidebar';

export default function ReportsModeration() {
  const reports = [
    { id: 'RPT-001', type: 'Lawyer Misconduct', reportedEntity: 'Adv. Bilal Chaudhry', reportedBy: 'Kamran Mirza', reason: 'Harassment and failure to present evidence in court.', date: '2026-08-09', status: 'New' },
    { id: 'RPT-002', type: 'Fake Review', reportedEntity: 'Review #REV-019', reportedBy: 'Miss Aysha Begum', reason: 'Abusive language by unverified account.', date: '2026-08-07', status: 'Investigating' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0c0414" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="reports" />
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          <Text style={styles.headerTitle}>🚩 Reports & Moderation Center</Text>
          <Text style={styles.headerSub}>Investigate flagged content, fake reviews, and professional misconduct reports</Text>
          
          <View style={{ gap: 12, marginTop: 20 }}>
            {reports.map(r => (
              <View key={r.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.mono}>{r.id} · {r.type}</Text>
                  <View style={styles.badge}><Text style={styles.badgeText}>{r.status}</Text></View>
                </View>
                <Text style={styles.reason}>{r.reason}</Text>
                <Text style={styles.meta}>Reported Entity: {r.reportedEntity} · By: {r.reportedBy} · Date: {r.date}</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                  <TouchableOpacity style={styles.btnSuccess} onPress={() => Alert.alert('Resolved', `Report ${r.id} has been marked as Resolved.`)}>
                    <Text style={styles.btnText}>✓ Mark Resolved</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnDanger} onPress={() => Alert.alert('Dismissed', `Report ${r.id} has been Dismissed.`)}>
                    <Text style={styles.btnText}>✕ Dismiss Report</Text>
                  </TouchableOpacity>
                </View>
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
  card: { backgroundColor: '#1e293b', borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#ef4444', padding: 18 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  mono: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  badge: { backgroundColor: 'rgba(239,68,68,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { color: '#f87171', fontSize: 11, fontWeight: '700' },
  reason: { color: '#f1f5f9', fontSize: 14, fontStyle: 'italic', marginBottom: 8 },
  meta: { color: '#64748b', fontSize: 11 },
  btnSuccess: { backgroundColor: '#16a34a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  btnDanger: { backgroundColor: '#dc2626', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
