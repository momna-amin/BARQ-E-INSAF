import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, Alert, TextInput } from 'react-native';
import AdminSidebar from './AdminSidebar';

export default function CasesDisputes() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('cases');

  const casesList = [
    { id: 'BI-2026-000101', client: 'Muhammad Usman', lawyer: 'Miss Aysha Begum', category: 'Property Dispute', district: 'Karachi West', status: 'Active', hearingDate: '2026-08-20' },
    { id: 'BI-2026-000102', client: 'Fatima Zahra', lawyer: 'Nadia Memon', category: 'Family Khula', district: 'Hyderabad', status: 'Completed', hearingDate: '2026-07-15' },
    { id: 'BI-2026-000103', client: 'Rizwan Akhtar', lawyer: 'Mr. Nasrullah', category: 'Criminal Bail (CrPC 497)', district: 'Naushahro Feroze', status: 'Disputed', hearingDate: '2026-08-25' },
  ];

  const disputesList = [
    { id: 'DIS-001', caseId: 'BI-2026-000103', raisedBy: 'Client (Rizwan Akhtar)', reason: 'Lawyer did not appear for scheduled hearing without prior notice.', status: 'Open', age: '2 days' },
    { id: 'DIS-002', caseId: 'BI-2026-000101', raisedBy: 'Client (Muhammad Usman)', reason: 'Fee structure discrepancy for additional High Court filings.', status: 'Under Review', age: '5 days' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0c0414" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="cases" />

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>📁 Cases & Disputes Moderation</Text>
            <Text style={styles.headerSub}>Monitor active legal cases, track hearings & resolve client-advocate disputes</Text>
          </View>

          <View style={styles.tabToggleRow}>
            <TouchableOpacity style={[styles.toggleBtn, activeTab === 'cases' && styles.toggleBtnActive]} onPress={() => setActiveTab('cases')}>
              <Text style={[styles.toggleText, activeTab === 'cases' && styles.toggleTextActive]}>📋 All Platform Cases (3)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleBtn, activeTab === 'disputes' && styles.toggleBtnActive]} onPress={() => setActiveTab('disputes')}>
              <Text style={[styles.toggleText, activeTab === 'disputes' && styles.toggleTextActive]}>⚠️ Open Disputes (2)</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'cases' ? (
            <View style={styles.listSection}>
              {casesList.map(c => (
                <View key={c.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.monoId}>{c.id}</Text>
                    <View style={[styles.badge, c.status === 'Active' ? styles.badgeActive : c.status === 'Completed' ? styles.badgeCompleted : styles.badgeDisputed]}>
                      <Text style={styles.badgeText}>{c.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>{c.category}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaItem}>👤 Client: <Text style={{ color: '#fff' }}>{c.client}</Text></Text>
                    <Text style={styles.metaItem}>⚖️ Lawyer: <Text style={{ color: '#fff' }}>{c.lawyer}</Text></Text>
                    <Text style={styles.metaItem}>📍 District: <Text style={{ color: '#fff' }}>{c.district}</Text></Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.listSection}>
              {disputesList.map(d => (
                <View key={d.id} style={[styles.card, { borderLeftColor: '#ef4444' }]}>
                  <View style={styles.cardTop}>
                    <Text style={styles.monoId}>{d.id} · {d.caseId}</Text>
                    <View style={[styles.badge, styles.badgeDisputed]}>
                      <Text style={styles.badgeText}>{d.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardReason}>{d.reason}</Text>
                  <Text style={styles.metaItem}>Raised By: <Text style={{ color: '#fff' }}>{d.raisedBy}</Text> · Age: {d.age}</Text>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                    <TouchableOpacity style={styles.btnSuccess} onPress={() => Alert.alert('Dispute Resolved', `Dispute ${d.id} has been marked as Resolved.`)}>
                      <Text style={styles.btnText}>✓ Resolve Dispute</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnWarning} onPress={() => Alert.alert('Investigation Started', `Dispute ${d.id} moved to Under Review.`)}>
                      <Text style={styles.btnText}>🔍 Investigate</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  header: { marginBottom: 20 },
  headerTitle: { color: '#f8fafc', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  tabToggleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 12, backgroundColor: '#1e293b', borderRadius: 12, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: '#3b82f6' },
  toggleText: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
  toggleTextActive: { color: '#ffffff' },
  listSection: { gap: 12 },
  card: { backgroundColor: '#1e293b', borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#3b82f6', padding: 18, marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  monoId: { color: '#94a3b8', fontSize: 12, fontWeight: '700', fontFamily: 'monospace' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeActive: { backgroundColor: 'rgba(59,130,246,0.2)' },
  badgeCompleted: { backgroundColor: 'rgba(34,197,94,0.2)' },
  badgeDisputed: { backgroundColor: 'rgba(239,68,68,0.2)' },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  cardTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  cardReason: { color: '#f1f5f9', fontSize: 14, marginBottom: 8, fontStyle: 'italic' },
  metaRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  metaItem: { color: '#94a3b8', fontSize: 12 },
  btnSuccess: { backgroundColor: '#16a34a', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  btnWarning: { backgroundColor: '#d97706', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
