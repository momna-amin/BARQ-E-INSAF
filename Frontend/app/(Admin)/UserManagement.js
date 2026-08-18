import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
  StyleSheet, Alert, TextInput, ActivityIndicator, Modal, RefreshControl,
} from 'react-native';
import AdminSidebar from './AdminSidebar';
import api from '../../services/api';

export default function UserManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [error, setError] = useState(null);

  // Suspend modal
  const [suspendModal, setSuspendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendLoading, setSuspendLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get('/admin/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error('UserManagement fetch error:', err);
      setError('Users load nahi ho sake. Dobara try karein.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const onRefresh = () => { setRefreshing(true); fetchUsers(); };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch = !search ||
      (u.name || '').toLowerCase().includes(searchLower) ||
      (u.email || '').toLowerCase().includes(searchLower) ||
      (u.district || '').toLowerCase().includes(searchLower) ||
      (u.phone || '').toLowerCase().includes(searchLower);
    return matchesRole && matchesSearch;
  });

  const openSuspendModal = (user) => {
    setSelectedUser(user);
    setSuspendReason('');
    setSuspendModal(true);
  };

  const handleSuspendToggle = async () => {
    if (!selectedUser) return;
    const willSuspend = !selectedUser.is_suspended;
    setSuspendLoading(true);
    try {
      await api.put(`/admin/users/${selectedUser.id}/suspend`, {
        suspended: willSuspend,
        reason: willSuspend ? (suspendReason.trim() || undefined) : undefined,
      });
      setSuspendModal(false);
      Alert.alert(
        willSuspend ? '⛔ Account Suspended' : '✅ Account Activated',
        `${selectedUser.name} ka account ${willSuspend ? 'suspend' : 'activate'} ho gaya. Email notification bheji gayi.`
      );
      fetchUsers();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Action fail ho gaya.');
    } finally {
      setSuspendLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'lawyer': return '#2563eb';
      case 'ngo': return '#16a34a';
      case 'admin': return '#9333ea';
      default: return '#d97706'; // citizen
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ color: '#64748b', marginTop: 12 }}>Loading users...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="users" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <ScrollView
          style={styles.mainContent}
          contentContainerStyle={styles.contentPadding}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />}
        >
          {/* HEADER */}
          <View style={styles.headerBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <TouchableOpacity style={styles.hamburgerBtn} onPress={() => setSidebarOpen(v => !v)}>
                <Text style={styles.hamburgerIcon}>☰</Text>
              </TouchableOpacity>
              <View>
                <Text style={styles.headerTitle}>👥 User Management</Text>
                <Text style={styles.headerSub}>
                  {users.length} registered users — manage accounts & access
                </Text>
              </View>
            </View>
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={fetchUsers}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
            </View>
          )}

          {/* SEARCH & FILTERS */}
          <View style={styles.filterSection}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, email, district, phone..."
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={setSearch}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['All', 'citizen', 'lawyer', 'ngo', 'admin'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.filterTab, roleFilter === r && styles.filterTabActive]}
                  onPress={() => setRoleFilter(r)}
                >
                  <Text style={[styles.filterTabText, roleFilter === r && styles.filterTabTextActive]}>
                    {r === 'All' ? `All (${users.length})` : `${r.toUpperCase()} (${users.filter(u => u.role === r).length})`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* USER LIST */}
          <View style={styles.userList}>
            {filteredUsers.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Koi user nahi mila.</Text>
              </View>
            ) : (
              filteredUsers.map((user) => (
                <View key={user.id} style={[styles.userCard, user.is_suspended && styles.userCardSuspended]}>
                  <View style={[styles.userAvatar, { backgroundColor: getRoleColor(user.role) }]}>
                    <Text style={styles.avatarText}>{(user.name || '?').charAt(0).toUpperCase()}</Text>
                  </View>

                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name || 'Unknown'}</Text>
                    <Text style={styles.userEmail}>{user.email || '—'}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                      <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) + '20' }]}>
                        <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
                          {user.role?.toUpperCase() || 'USER'}
                        </Text>
                      </View>
                      {user.district && (
                        <Text style={styles.userMeta}>📍 {user.district}</Text>
                      )}
                      {user.phone && (
                        <Text style={styles.userMeta}>📞 {user.phone}</Text>
                      )}
                    </View>
                    {user.cnic && (
                      <Text style={styles.cnicText}>CNIC: {user.cnic}</Text>
                    )}
                    {user.is_suspended && user.suspension_reason && (
                      <Text style={styles.suspendedReason}>
                        ⛔ Reason: {user.suspension_reason}
                      </Text>
                    )}
                    <Text style={styles.dateText}>
                      Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString('en-PK') : '—'}
                    </Text>
                  </View>

                  <View style={styles.statusCol}>
                    <View style={[styles.statusTag, user.is_suspended ? styles.statusSuspended : styles.statusActive]}>
                      <Text style={[styles.statusTagText, user.is_suspended ? styles.statusSuspendedText : styles.statusActiveText]}>
                        {user.is_suspended ? 'Suspended' : 'Active'}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.toggleBtn, user.is_suspended ? styles.activateBtn : styles.suspendBtn]}
                      onPress={() => openSuspendModal(user)}
                    >
                      <Text style={styles.toggleBtnText}>
                        {user.is_suspended ? 'Activate' : 'Suspend'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* SUSPEND/ACTIVATE MODAL */}
      <Modal visible={suspendModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {selectedUser?.is_suspended ? '✅ Account Activate Karein' : '⛔ Account Suspend Karein'}
            </Text>
            <Text style={styles.modalSub}>
              User: <Text style={{ fontWeight: '800', color: '#0f172a' }}>{selectedUser?.name}</Text>
            </Text>
            <Text style={styles.modalSub2}>{selectedUser?.email}</Text>

            {!selectedUser?.is_suspended && (
              <>
                <Text style={styles.inputLabel}>SUSPENSION REASON (OPTIONAL)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Policy violation, fake documents..."
                  value={suspendReason}
                  onChangeText={setSuspendReason}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#94a3b8"
                />
                <Text style={styles.noteText}>ℹ️ User ko email notification bheji jayegi with reason.</Text>
              </>
            )}

            {selectedUser?.is_suspended && (
              <Text style={styles.noteText}>ℹ️ Account reactivate karne par user ko email notification jayegi.</Text>
            )}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.confirmBtn, selectedUser?.is_suspended ? { backgroundColor: '#16a34a' } : { backgroundColor: '#dc2626' }]}
                onPress={handleSuspendToggle}
                disabled={suspendLoading}
              >
                <Text style={styles.confirmBtnText}>
                  {suspendLoading ? 'Processing...' : selectedUser?.is_suspended ? '✅ Activate Account' : '⛔ Suspend Account'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setSuspendModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  layoutRow: { flex: 1, flexDirection: 'row', position: 'relative' },
  mainContent: { flex: 1, backgroundColor: '#f8fafc', width: '100%' },
  contentPadding: { padding: 24, paddingBottom: 40 },
  headerBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  hamburgerBtn: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: '#ffffff',
    borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center',
  },
  hamburgerIcon: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  headerSub: { fontSize: 12, color: '#475569', marginTop: 2 },
  errorBanner: {
    backgroundColor: '#fef2f2', borderRadius: 10, padding: 14, marginBottom: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#fca5a5',
  },
  errorText: { color: '#dc2626', fontSize: 13, flex: 1 },
  retryText: { color: '#2563eb', fontWeight: '700', marginLeft: 12 },
  filterSection: { marginBottom: 20, gap: 12 },
  searchInput: {
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 13, color: '#0f172a',
  },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 8,
  },
  filterTabActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  filterTabText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  filterTabTextActive: { color: '#ffffff' },
  userList: { gap: 12 },
  emptyCard: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0',
  },
  emptyText: { color: '#64748b', fontSize: 14 },
  userCard: {
    backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1,
    borderColor: '#e2e8f0', padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 14,
  },
  userCardSuspended: { borderColor: '#fca5a5', borderLeftWidth: 3, borderLeftColor: '#dc2626' },
  userAvatar: {
    width: 46, height: 46, borderRadius: 23,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#ffffff' },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  userEmail: { fontSize: 12, color: '#64748b', marginTop: 1 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  roleText: { fontSize: 10, fontWeight: '800' },
  userMeta: { fontSize: 11, color: '#64748b' },
  cnicText: { fontSize: 11, color: '#94a3b8', marginTop: 2, fontFamily: 'monospace' },
  suspendedReason: { fontSize: 11, color: '#dc2626', marginTop: 3, fontStyle: 'italic' },
  dateText: { fontSize: 10, color: '#94a3b8', marginTop: 3 },
  statusCol: { alignItems: 'flex-end', gap: 8, flexShrink: 0 },
  statusTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusActive: { backgroundColor: '#dcfce7' },
  statusSuspended: { backgroundColor: '#fee2e2' },
  statusTagText: { fontSize: 11, fontWeight: '700' },
  statusActiveText: { color: '#15803d' },
  statusSuspendedText: { color: '#b91c1c' },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  suspendBtn: { backgroundColor: '#dc2626' },
  activateBtn: { backgroundColor: '#16a34a' },
  toggleBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  modalCard: {
    width: '100%', maxWidth: 460, backgroundColor: '#ffffff',
    borderRadius: 20, padding: 24, elevation: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  modalSub: { fontSize: 13, color: '#475569', marginTop: 6 },
  modalSub2: { fontSize: 12, color: '#94a3b8', marginBottom: 16 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#475569', marginTop: 12, marginBottom: 6, letterSpacing: 0.5 },
  modalInput: {
    backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#0f172a', marginBottom: 12, textAlignVertical: 'top',
  },
  noteText: { fontSize: 12, color: '#64748b', marginBottom: 16, fontStyle: 'italic' },
  modalBtnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  confirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  cancelBtn: {
    paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#f1f5f9', alignItems: 'center',
  },
  cancelBtnText: { color: '#475569', fontWeight: '700', fontSize: 14 },
});
