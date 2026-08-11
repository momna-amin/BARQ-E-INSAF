import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, Alert } from 'react-native';
import AdminSidebar from './AdminSidebar';

export default function CasesDisputes() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.layoutRow}>
        {/* OVERLAY RESPONSIVE DRAWER SIDEBAR */}
        <AdminSidebar
          activeRoute="cases"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* FULL WIDTH MAIN CONTENT */}
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          {/* HEADER BAR WITH ☰ HAMBURGER MENU BUTTON */}
          <View style={styles.headerBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 54 }}>
              <View>
                <Text style={styles.headerTitle}>📁 Cases & Disputes Moderation</Text>
                <Text style={styles.headerSub}>Monitor active legal cases, track hearings & resolve client-advocate disputes</Text>
              </View>
            </View>
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
                    <Text style={styles.metaItem}>👤 Client: <Text style={{ color: '#0f172a', fontWeight: '700' }}>{c.client}</Text></Text>
                    <Text style={styles.metaItem}>⚖️ Lawyer: <Text style={{ color: '#0f172a', fontWeight: '700' }}>{c.lawyer}</Text></Text>
                    <Text style={styles.metaItem}>📍 District: <Text style={{ color: '#0f172a', fontWeight: '700' }}>{c.district}</Text></Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.listSection}>
              {disputesList.map(d => (
                <View key={d.id} style={[styles.card, { borderLeftColor: '#dc2626' }]}>
                  <View style={styles.cardTop}>
                    <Text style={styles.monoId}>{d.id} · {d.caseId}</Text>
                    <View style={[styles.badge, styles.badgeDisputed]}>
                      <Text style={styles.badgeText}>{d.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardReason}>{d.reason}</Text>
                  <Text style={styles.metaItem}>Raised By: <Text style={{ color: '#0f172a', fontWeight: '700' }}>{d.raisedBy}</Text> · Age: {d.age}</Text>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
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
  safe: { flex: 1, backgroundColor: '#ffffff' },
  layoutRow: { flex: 1, flexDirection: 'row', position: 'relative' },
  mainContent: { flex: 1, backgroundColor: '#f8fafc', width: '100%' },
  contentPadding: { padding: 24 },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  hamburgerBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerIcon: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerTitle: { color: '#0f172a', fontSize: 20, fontWeight: '800' },
  headerSub: { color: '#475569', fontSize: 12, marginTop: 2 },
  tabToggleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 12, backgroundColor: '#ffffff', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  toggleBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  toggleText: { color: '#475569', fontSize: 13, fontWeight: '700' },
  toggleTextActive: { color: '#ffffff' },
  listSection: { gap: 12 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#2563eb', padding: 18, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  monoId: { color: '#64748b', fontSize: 12, fontWeight: '700' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeActive: { backgroundColor: '#dbeafe' },
  badgeCompleted: { backgroundColor: '#dcfce7' },
  badgeDisputed: { backgroundColor: '#fee2e2' },
  badgeText: { color: '#1d4ed8', fontSize: 11, fontWeight: '700' },
  cardTitle: { color: '#0f172a', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  cardReason: { color: '#334155', fontSize: 14, marginBottom: 8, fontStyle: 'italic' },
  metaRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  metaItem: { color: '#64748b', fontSize: 12 },
  btnSuccess: { backgroundColor: '#16a34a', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  btnWarning: { backgroundColor: '#d97706', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
