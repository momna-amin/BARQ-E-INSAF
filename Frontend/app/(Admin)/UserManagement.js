import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAdminStore } from './AdminStore';

export default function UserManagement() {
  const router = useRouter();
  const { state, toggleUserStatus } = useAdminStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredUsers = state.users.filter((u) => {
    const matchesRole = roleFilter === 'All' ? true : u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.district.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#120424" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back to Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>👥 User Management Directory</Text>
        <Text style={styles.headerSub}>Manage Citizen, Lawyer, NGO & Admin platform accounts</Text>
      </View>

      {/* SEARCH & FILTERS */}
      <View style={styles.filterSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name, email, or district..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filterTabs}>
          {['All', 'citizen', 'lawyer', 'ngo'].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.filterTab, roleFilter === r && styles.filterTabActive]}
              onPress={() => setRoleFilter(r)}
            >
              <Text style={[styles.filterTabText, roleFilter === r && styles.filterTabTextActive]}>
                {r.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userMainRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userMeta}>
                  Role: <Text style={styles.highlight}>{user.role.toUpperCase()}</Text> · District: {user.district}
                </Text>
                <Text style={styles.cnicText}>CNIC: {user.cnic}</Text>
              </View>

              <View style={styles.statusCol}>
                <View
                  style={[
                    styles.statusTag,
                    user.status === 'Active' && styles.statusActive,
                    user.status === 'Suspended' && styles.statusSuspended,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusTagText,
                      user.status === 'Active' && styles.statusActiveText,
                      user.status === 'Suspended' && styles.statusSuspendedText,
                    ]}
                  >
                    {user.status}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    user.status === 'Active' ? styles.suspendBtn : styles.activateBtn,
                  ]}
                  onPress={() => {
                    toggleUserStatus(user.id);
                    Alert.alert(
                      'Account Updated',
                      `User ${user.name} status changed to ${user.status === 'Active' ? 'Suspended' : 'Active'}`
                    );
                  }}
                >
                  <Text style={styles.toggleBtnText}>
                    {user.status === 'Active' ? 'Suspend' : 'Activate'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d041a' },
  header: { backgroundColor: '#16072b', padding: 18, borderBottomWidth: 1, borderBottomColor: '#2b104a' },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 12, color: '#a78bfa', fontWeight: '700' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  filterSection: { padding: 16, backgroundColor: '#120424', gap: 12 },
  searchInput: { backgroundColor: '#1e0938', borderWidth: 1, borderColor: '#34105e', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, color: '#fff', fontSize: 13 },
  filterTabs: { flexDirection: 'row', gap: 8 },
  filterTab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#1b0833' },
  filterTabActive: { backgroundColor: '#3b0764', borderWidth: 1, borderColor: '#a78bfa' },
  filterTabText: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  filterTabTextActive: { color: '#fff', fontWeight: '800' },
  scrollBody: { flex: 1, backgroundColor: '#090214' },
  scrollContent: { padding: 16, gap: 12 },
  userCard: { backgroundColor: '#15062b', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#260c48' },
  userMainRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#3b126b', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#c4b5fd' },
  userName: { fontSize: 14, fontWeight: '800', color: '#fff' },
  userEmail: { fontSize: 11, color: '#94a3b8', marginTop: 1 },
  userMeta: { fontSize: 10, color: '#cbd5e1', marginTop: 3 },
  cnicText: { fontSize: 10, color: '#a78bfa', marginTop: 1 },
  highlight: { color: '#a78bfa', fontWeight: '800' },
  statusCol: { alignItems: 'flex-end', gap: 8 },
  statusTag: { backgroundColor: 'rgba(167,139,250,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  statusTagText: { fontSize: 10, fontWeight: '800', color: '#a78bfa' },
  statusActive: { backgroundColor: 'rgba(16,185,129,0.15)' },
  statusActiveText: { color: '#10b981' },
  statusSuspended: { backgroundColor: 'rgba(239,68,68,0.15)' },
  statusSuspendedText: { color: '#f87171' },
  toggleBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  suspendBtn: { backgroundColor: 'rgba(239,68,68,0.2)', borderWidth: 1, borderColor: '#ef4444' },
  activateBtn: { backgroundColor: '#10b981' },
  toggleBtnText: { fontSize: 10, fontWeight: '800', color: '#fff' },
});
