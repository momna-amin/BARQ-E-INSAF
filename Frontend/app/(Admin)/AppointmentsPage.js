import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, Alert, TextInput } from 'react-native';
import AdminSidebar from './AdminSidebar';

export default function AppointmentsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const appointmentsList = [
    { id: 'APT-001', client: 'Muhammad Usman', clientCnic: '42201-1234567-1', lawyer: 'Miss Aysha Begum', lawyerSbc: 'SBC-20345', date: '2026-08-15 10:30 AM', type: 'Online Video Consultation', district: 'Karachi West', status: 'Scheduled' },
    { id: 'APT-002', client: 'Fatima Zahra', clientCnic: '42301-9876543-2', lawyer: 'Nadia Memon', lawyerSbc: 'SBC-9043', date: '2026-08-14 02:00 PM', type: 'In-Person Chamber Meeting', district: 'Hyderabad', status: 'Completed' },
    { id: 'APT-003', client: 'Rizwan Akhtar', clientCnic: '45205-5556677-3', lawyer: 'Mr. Nasrullah', lawyerSbc: 'SBC-475', date: '2026-08-18 11:00 AM', type: 'Court Hearing Prep', district: 'Naushahro Feroze', status: 'Scheduled' },
    { id: 'APT-004', client: 'Ayesha Siddiqui', clientCnic: '42301-3334455-4', lawyer: 'Ali Hassan', lawyerSbc: 'SBC-8821', date: '2026-08-10 03:30 PM', type: 'Online Video Consultation', district: 'Karachi Central', status: 'Cancelled' },
  ];

  const filtered = appointmentsList.filter(a => {
    const matchSearch = !search || a.client.toLowerCase().includes(search.toLowerCase()) || a.lawyer.toLowerCase().includes(search.toLowerCase()) || a.district.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || a.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="appointments" />

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>📅 Client & Advocate Appointments</Text>
            <Text style={styles.headerSub}>Overview of scheduled consultations, online meetings & chamber bookings across Sindh</Text>
          </View>

          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search appointments by client, lawyer, or district..."
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={setSearch}
            />
            <View style={styles.tabsRow}>
              {['All', 'Scheduled', 'Completed', 'Cancelled'].map(st => (
                <TouchableOpacity key={st} style={[styles.tab, filter === st && styles.tabActive]} onPress={() => setFilter(st)}>
                  <Text style={[styles.tabText, filter === st && styles.tabTextActive]}>{st}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.cardGrid}>
            {filtered.map(apt => (
              <View key={apt.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.monoId}>{apt.id} · {apt.date}</Text>
                  <View style={[styles.badge, apt.status === 'Scheduled' ? styles.badgeScheduled : apt.status === 'Completed' ? styles.badgeCompleted : styles.badgeCancelled]}>
                    <Text style={[styles.badgeText, apt.status === 'Scheduled' ? styles.badgeTextScheduled : apt.status === 'Completed' ? styles.badgeTextCompleted : styles.badgeTextCancelled]}>{apt.status}</Text>
                  </View>
                </View>

                <Text style={styles.consultType}>💬 {apt.type}</Text>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailCol}>
                    <Text style={styles.label}>Client Name</Text>
                    <Text style={styles.val}>{apt.client}</Text>
                    <Text style={styles.subVal}>CNIC: {apt.clientCnic}</Text>
                  </View>

                  <View style={styles.detailCol}>
                    <Text style={styles.label}>Advocate / Lawyer</Text>
                    <Text style={styles.val}>{apt.lawyer}</Text>
                    <Text style={styles.subVal}>SBC: {apt.lawyerSbc}</Text>
                  </View>

                  <View style={styles.detailCol}>
                    <Text style={styles.label}>District / Location</Text>
                    <Text style={styles.val}>{apt.district}</Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.btnNotify} onPress={() => Alert.alert('Notification Sent', `Reminder sent to client ${apt.client} and advocate ${apt.lawyer}.`)}>
                    <Text style={styles.btnText}>🔔 Send Reminder</Text>
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
  safe: { flex: 1, backgroundColor: '#ffffff' },
  layoutRow: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1, backgroundColor: '#f8fafc' },
  contentPadding: { padding: 24 },
  header: { marginBottom: 20 },
  headerTitle: { color: '#0f172a', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#475569', fontSize: 13, marginTop: 4 },
  searchRow: { gap: 12, marginBottom: 20 },
  searchInput: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#0f172a', fontSize: 13 },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0' },
  tabActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  tabText: { color: '#475569', fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: '#ffffff' },
  cardGrid: { gap: 14 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#2563eb', padding: 20, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 8 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  monoId: { color: '#64748b', fontSize: 12, fontWeight: '700' },
  consultType: { color: '#0f172a', fontSize: 15, fontWeight: '700', marginBottom: 14 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeScheduled: { backgroundColor: '#dbeafe' },
  badgeCompleted: { backgroundColor: '#dcfce7' },
  badgeCancelled: { backgroundColor: '#fee2e2' },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeTextScheduled: { color: '#1d4ed8' },
  badgeTextCompleted: { color: '#15803d' },
  badgeTextCancelled: { color: '#b91c1c' },
  detailsGrid: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  detailCol: { minWidth: 160 },
  label: { color: '#64748b', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  val: { color: '#0f172a', fontSize: 13, fontWeight: '700', marginTop: 2 },
  subVal: { color: '#64748b', fontSize: 11, marginTop: 1 },
  actionRow: { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  btnNotify: { backgroundColor: '#2563eb', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
