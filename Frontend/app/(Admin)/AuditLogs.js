import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, StyleSheet, TextInput } from 'react-native';
import AdminSidebar from './AdminSidebar';

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const logs = [
    { id: 'AUD-001', actor: 'Super Admin', action: 'lawyer.verified', entity: 'Lawyer Miss Aysha Begum (SBC-20345)', ip: '192.168.1.1', time: '10 mins ago', details: 'Verified High Court Advocate credentials' },
    { id: 'AUD-002', actor: 'Super Admin', action: 'lawyer.verified', entity: 'Lawyer Mr. Nasrullah (SBC-475)', ip: '192.168.1.1', time: '25 mins ago', details: 'Verified Naushahro Feroze advocate' },
    { id: 'AUD-003', actor: 'System AI', action: 'dispute.resolved', entity: 'Dispute #DIS-003', ip: 'System', time: '1 hour ago', details: 'Automated resolution confirmation' },
  ];

  const filtered = logs.filter(l => !search || l.action.toLowerCase().includes(search.toLowerCase()) || l.entity.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0c0414" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="audit" />
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          <Text style={styles.headerTitle}>🛡️ System Audit Logs</Text>
          <Text style={styles.headerSub}>Real-time immutable audit trail of administrative actions & system events</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Filter audit logs by action, actor, or entity..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />

          <View style={{ gap: 10, marginTop: 16 }}>
            {filtered.map(l => (
              <View key={l.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.mono}>{l.id} · {l.time}</Text>
                  <View style={styles.actionBadge}><Text style={styles.actionText}>{l.action}</Text></View>
                </View>
                <Text style={styles.details}>{l.details}</Text>
                <Text style={styles.meta}>Actor: {l.actor} · Entity: {l.entity} · IP: {l.ip}</Text>
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
  searchInput: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#fff', fontSize: 13, marginTop: 20 },
  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 16, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  mono: { color: '#64748b', fontSize: 11, fontWeight: '700' },
  actionBadge: { backgroundColor: 'rgba(59,130,246,0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  actionText: { color: '#60a5fa', fontSize: 11, fontWeight: '700' },
  details: { color: '#f1f5f9', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  meta: { color: '#94a3b8', fontSize: 11 },
});
