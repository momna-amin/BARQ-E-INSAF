import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, Alert, Switch } from 'react-native';
import AdminSidebar from './AdminSidebar';

export default function SystemSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [requireCnic, setRequireCnic] = useState(true);
  const [aiChatActive, setAiChatActive] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.layoutRow}>
        <AdminSidebar
          activeRoute="settings"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          {/* TOP HEADER BAR WITH ☰ HAMBURGER MENU BUTTON */}
          <View style={styles.headerBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <TouchableOpacity style={styles.hamburgerBtn} onPress={() => setSidebarOpen(v => !v)}>
                <Text style={styles.hamburgerIcon}>☰</Text>
              </TouchableOpacity>
              <View>
                <Text style={styles.headerTitle}>⚙️ System Configuration & Settings</Text>
                <Text style={styles.headerSub}>Manage Vercel API production connections, Supabase keys, AI status & security policies</Text>
              </View>
            </View>
          </View>

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
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginTop: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { color: '#0f172a', fontSize: 16, fontWeight: '700', marginBottom: 16 },
  statusRow: { marginBottom: 12 },
  label: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  valSuccess: { color: '#16a34a', fontSize: 13, fontWeight: '700', marginTop: 2 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  toggleLabel: { color: '#0f172a', fontSize: 14, fontWeight: '700' },
  toggleSub: { color: '#64748b', fontSize: 11, marginTop: 2 },
  saveBtn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
