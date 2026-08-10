import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function AdminHome() {
  const router = useRouter();

  const stats = [
    { label: 'Total Citizens', value: '1,240', color: '#5C1A1A', route: '/(Admin)/CitizenManagement' },
    { label: 'Active Lawyers', value: '284', color: '#0F2744', route: '/(Admin)/LawyerManagement' },
    { label: 'NGO Partners', value: '18', color: '#1B4332', route: '/(Admin)/NGOManagement' },
    { label: 'Pending Verifications', value: '12', color: '#f59e0b', route: '/(Admin)/LawyerManagement' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0533" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Barq-e-Insaf 🛡️</Text>
          <Text style={styles.headerSub}>Super Admin Control Panel</Text>
        </View>
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => router.replace('/LoginScreen')}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>System Overview</Text>
        <View style={styles.grid}>
          {stats.map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.card, { backgroundColor: item.color }]}
              onPress={() => item.route && router.push(item.route as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.cardVal}>{item.value}</Text>
              <Text style={styles.cardLbl}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Management Quick Links */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Management Portals</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/(Admin)/CitizenManagement')}
        >
          <Text style={styles.menuText}>👤 Citizen Management</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/(Admin)/LawyerManagement')}
        >
          <Text style={styles.menuText}>⚖️ Lawyer Verification & Management</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/(Admin)/NGOManagement')}
        >
          <Text style={styles.menuText}>📊 NGO & Analytics Portal</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1A0533' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#1A0533',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: { color: '#ef4444', fontSize: 12, fontWeight: '700' },
  scroll: { flex: 1, backgroundColor: '#F5F3EF' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  cardVal: { fontSize: 24, fontWeight: '800', color: '#fff' },
  cardLbl: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontWeight: '600' },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e8e4e0',
  },
  menuText: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  menuArrow: { fontSize: 20, color: '#aaa' },
});
