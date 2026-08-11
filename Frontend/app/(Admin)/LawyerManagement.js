import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import AdminSidebar from './AdminSidebar';
import { useAdminStore } from './AdminStore';

export default function LawyerManagement() {
  const router = useRouter();
  const { state, approveLawyer, rejectLawyer } = useAdminStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const lawyerList = [
    { id: 'LAW-20345', name: 'Miss Aysha Begum', father: 'Ata Ur Rehman', email: 'aysha.begum@barqeinsaf.pk', sbc: 'SBC-20345', district: 'Karachi West', specialty: 'High Court Civil & Property', experience: '6 Years', status: 'Verified', gender: 'Female' },
    { id: 'LAW-00475', name: 'Mr. Nasrullah', father: 'Tahir Khan Sahito', email: 'nasrullah.sahito@barqeinsaf.pk', sbc: 'SBC-475', district: 'Naushahro Feroze', specialty: 'Criminal & High Court Litigation', experience: '22 Years', status: 'Verified', gender: 'Male' },
    { id: 'LAW-001', name: 'Ali Hassan', father: 'Hassan Mahmood', email: 'ali.hassan@law.pk', sbc: 'SBC-8821', district: 'Karachi Central', specialty: 'Criminal Law', experience: '12 Years', status: 'Verified', gender: 'Male' },
    { id: 'LAW-002', name: 'Nadia Memon', father: 'Ghulam Qadir Memon', email: 'nadia.memon@law.pk', sbc: 'SBC-9043', district: 'Hyderabad', specialty: 'Family Law', experience: '8 Years', status: 'Verified', gender: 'Female' },
    { id: 'LAW-003', name: 'Tariq Shah', father: 'Syed Ahmed Shah', email: 'tariq.shah@law.pk', sbc: 'SBC-7711', district: 'Sukkur', specialty: 'Civil Law', experience: '18 Years', status: 'Verified', gender: 'Male' },
    { id: 'LAW-004', name: 'Sara Qureshi', father: 'Tariq Qureshi', email: 'sara.q@law.pk', sbc: 'SBC-6620', district: 'Karachi East', specialty: 'Corporate Law', experience: '6 Years', status: 'Pending', gender: 'Female' },
  ];

  const filtered = lawyerList.filter(l => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.sbc.toLowerCase().includes(search.toLowerCase()) || l.district.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || l.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0c0414" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="lawyers" />

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>⚖️ Lawyer & Advocate Directory</Text>
            <Text style={styles.headerSub}>Manage Sindh Bar Council verified advocates & pending enrollments</Text>
          </View>

          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search lawyer by name, SBC license, or district..."
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={setSearch}
            />
            <View style={styles.tabsRow}>
              {['All', 'Verified', 'Pending', 'Suspended'].map(st => (
                <TouchableOpacity key={st} style={[styles.tab, filter === st && styles.tabActive]} onPress={() => setFilter(st)}>
                  <Text style={[styles.tabText, filter === st && styles.tabTextActive]}>{st}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.cardGrid}>
            {filtered.map(lawyer => (
              <View key={lawyer.id} style={styles.lawyerCard}>
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{lawyer.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.lawyerName}>{lawyer.name}</Text>
                    <Text style={styles.fatherName}>s/o, d/o {lawyer.father}</Text>
                    <Text style={styles.lawyerEmail}>{lawyer.email}</Text>
                  </View>
                  <View style={[styles.badge, lawyer.status === 'Verified' ? styles.badgeSuccess : styles.badgeWarning]}>
                    <Text style={[styles.badgeText, lawyer.status === 'Verified' ? styles.badgeTextSuccess : styles.badgeTextWarning]}>{lawyer.status}</Text>
                  </View>
                </View>

                <View style={styles.metaGrid}>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>SBC License</Text>
                    <Text style={styles.metaValue}>{lawyer.sbc}</Text>
                  </View>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>District</Text>
                    <Text style={styles.metaValue}>{lawyer.district}</Text>
                  </View>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>Specialty</Text>
                    <Text style={styles.metaValue}>{lawyer.specialty}</Text>
                  </View>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>Gender</Text>
                    <Text style={styles.metaValue}>{lawyer.gender === 'Female' ? '👩 Female' : '👨 Male'}</Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  {lawyer.status === 'Pending' ? (
                    <TouchableOpacity style={styles.btnSuccess} onPress={() => Alert.alert('Verified', `Advocate ${lawyer.name} verified successfully!`)}>
                      <Text style={styles.btnText}>✓ Verify Advocate</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.btnWarning} onPress={() => Alert.alert('Action Updated', `Advocate ${lawyer.name} status updated.`)}>
                      <Text style={styles.btnText}>⚙ Manage Status</Text>
                    </TouchableOpacity>
                  )}
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
  header: { marginBottom: 20 },
  headerTitle: { color: '#f8fafc', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  searchRow: { gap: 12, marginBottom: 20 },
  searchInput: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#fff', fontSize: 13 },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1e293b' },
  tabActive: { backgroundColor: '#3b82f6' },
  tabText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  cardGrid: { gap: 12 },
  lawyerCard: { backgroundColor: '#1e293b', borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#3b82f6', padding: 18, marginBottom: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  lawyerName: { color: '#f8fafc', fontSize: 15, fontWeight: '700' },
  fatherName: { color: '#cbd5e1', fontSize: 12 },
  lawyerEmail: { color: '#64748b', fontSize: 11 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeSuccess: { backgroundColor: 'rgba(34,197,94,0.15)' },
  badgeWarning: { backgroundColor: 'rgba(245,158,11,0.15)' },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeTextSuccess: { color: '#4ade80' },
  badgeTextWarning: { color: '#fbbf24' },
  metaGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#334155' },
  metaCol: { minWidth: 120 },
  metaLabel: { color: '#64748b', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  metaValue: { color: '#e2e8f0', fontSize: 12, fontWeight: '600', marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10 },
  btnSuccess: { backgroundColor: '#16a34a', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  btnWarning: { backgroundColor: '#d97706', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
