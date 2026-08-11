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
import AdminSidebar from './AdminSidebar';
import { useAdminStore } from './AdminStore';

export default function UserManagement() {
  const router = useRouter();
  const { state, toggleUserStatus } = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.layoutRow}>
        <AdminSidebar
          activeRoute="users"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          {/* HEADER BAR WITH ☰ HAMBURGER BUTTON */}
          <View style={styles.headerBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <TouchableOpacity style={styles.hamburgerBtn} onPress={() => setSidebarOpen(v => !v)}>
                <Text style={styles.hamburgerIcon}>☰</Text>
              </TouchableOpacity>
              <View>
                <Text style={styles.headerTitle}>👥 User Management Directory</Text>
                <Text style={styles.headerSub}>Manage Citizen, Lawyer, NGO & Admin platform accounts</Text>
              </View>
            </View>
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
                    {r === 'All' ? 'All Roles' : r.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* USER LIST */}
          <View style={styles.userList}>
            {filteredUsers.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userAvatar}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>

                <View style={styles.userInfo}>
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
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  layoutRow: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f8fafc',
    width: '100%',
  },
  contentPadding: {
    padding: 24,
  },
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  filterSection: {
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    color: '#0f172a',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterTabActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  userList: {
    gap: 12,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  userAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  userMeta: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
  highlight: {
    color: '#2563eb',
    fontWeight: '700',
  },
  cnicText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  statusCol: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusActive: {
    backgroundColor: '#dcfce7',
  },
  statusSuspended: {
    backgroundColor: '#fee2e2',
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusActiveText: {
    color: '#15803d',
  },
  statusSuspendedText: {
    color: '#b91c1c',
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  suspendBtn: {
    backgroundColor: '#dc2626',
  },
  activateBtn: {
    backgroundColor: '#16a34a',
  },
  toggleBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
