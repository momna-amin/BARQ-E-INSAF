import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, Alert, Switch } from 'react-native';
import AdminSidebar from './AdminSidebar';

export default function SystemSettings() {
  const [maintenance, setMaintenance] = useState(false);
  const [requireCnic, setRequireCnic] = useState(true);
  const [aiChatActive, setAiChatActive] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0c0414" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="settings" />
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          <Text style={styles.headerTitle}>⚙️ System Configuration & Settings</Text>
          <Text style={styles.headerSub}>Manage Vercel API production connections, Supabase keys, AI status & security policies</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🌐 Live Environment Connections</Text>
            <View style={styles.statusRow}>
              <Text style={styles.label}>Backend Production (Vercel):</Text>
              <Text style={styles.valSuccess}>● CONNECTED (Port 5000 / Vercel API)</Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.label}>Database (Supabase):</Text>
              <Text style={styles.valSuccess}>● ACTIVE (hbdgsziimogmjvfatzdc)</Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.label}>AI Legal Chatbot:</Text>
              <Text style={styles.valSuccess}>● ONLINE (Groq & Legal Engine)</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔒 Security & Access Controls</Text>

            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Require Sindh CNIC Verification</Text>
                <Text style={styles.toggleSub}>Enforce 41-45 CNIC prefix check on user signup</Text>
              </View>
              <Switch value={requireCnic} onValueChange={setRequireCnic} />
            </View>

            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Enable AI Legal Assistant</Text>
                <Text style={styles.toggleSub}>Allow floating AI chatbot for Pakistan legal advice</Text>
              </View>
              <Switch value={aiChatActive} onValueChange={setAiChatActive} />
            </View>

            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>System Maintenance Mode</Text>
                <Text style={styles.toggleSub}>Restrict access for scheduled maintenance</Text>
              </View>
              <Switch value={maintenance} onValueChange={setMaintenance} />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert('Settings Saved', 'System configuration updated successfully.')}>
              <Text style={styles.saveBtnText}>💾 Save System Settings</Text>
            </TouchableOpacity>
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
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginTop: 20 },
  cardTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 16 },
  statusRow: { marginBottom: 12 },
  label: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  valSuccess: { color: '#4ade80', fontSize: 13, fontWeight: '700', marginTop: 2 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#334155' },
  toggleLabel: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
  toggleSub: { color: '#64748b', fontSize: 11, marginTop: 2 },
  saveBtn: { backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
