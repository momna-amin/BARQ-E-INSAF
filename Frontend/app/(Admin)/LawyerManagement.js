import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView,
  StatusBar, StyleSheet, Alert, ActivityIndicator, Modal, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import AdminSidebar from './AdminSidebar';
import api from '../../services/api';

const ITEMS_PER_PAGE = 8;

const statusColors = {
  approved: { bg: '#dcfce7', text: '#166534' },
  pending:  { bg: '#fef3c7', text: '#92400e' },
  rejected: { bg: '#fee2e2', text: '#991b1b' },
};

export default function LawyerManagement() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  // Suspend modal
  const [suspendModal, setSuspendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendLoading, setSuspendLoading] = useState(false);

  const fetchLawyers = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get('/admin/users?role=lawyer');
      setUsers(res.data || []);
    } catch (err) {
      console.error('LawyerManagement fetch error:', err);
      setError('Lawyers load nahi ho sake.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchLawyers(); }, [fetchLawyers]);

  const onRefresh = () => { setRefreshing(true); fetchLawyers(); };

  const getLawyerStatus = (user) => {
    const l = user.lawyers?.[0];
    if (!l) return 'unknown';
    if (user.is_suspended) return 'suspended';
    return l.verification_status || 'pending';
  };

  const STATUSES = ['All', 'approved', 'pending', 'rejected', 'suspended'];

  const filtered = users.filter((u) => {
    const s = getLawyerStatus(u);
    const matchStatus = selectedStatus === 'All' || s === selectedStatus;
    const searchLower = search.toLowerCase();
    const lawyerProfile = u.lawyers?.[0] || {};
    const matchSearch = !search ||
      (u.name || '').toLowerCase().includes(searchLower) ||
      (u.email || '').toLowerCase().includes(searchLower) ||
      (lawyerProfile.sbc_number || '').toLowerCase().includes(searchLower) ||
      (lawyerProfile.specialty || '').toLowerCase().includes(searchLower) ||
      (u.district || '').toLowerCase().includes(searchLower);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const resetPage = () => setCurrentPage(1);

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
        willSuspend ? '⛔ Suspended' : '✅ Activated',
        `${selectedUser.name} ka account ${willSuspend ? 'suspend' : 'activate'} ho gaya. Email bheji gayi.`
      );
      fetchLawyers();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Action fail ho gaya.');
    } finally {
      setSuspendLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ color: '#64748b', marginTop: 12 }}>Loading lawyers...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f3ef" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="lawyers" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentPadding}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.hamburgerBtn} onPress={() => setSidebarOpen(v => !v)}>
              <Text style={styles.hamburgerIcon}>☰</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>⚖️ Lawyer Management</Text>
              <Text style={styles.headerSub}>{users.length} lawyers registered on platform</Text>
            </View>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                {users.filter(u => (u.lawyers?.[0]?.verification_status) === 'pending').length} Pending
              </Text>
            </View>
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={fetchLawyers}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
            </View>
          )}

          {/* SEARCH */}
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, SBC, specialty, district..."
              placeholderTextColor="#bbb"
              value={search}
              onChangeText={t => { setSearch(t); resetPage(); }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => { setSearch(''); resetPage(); }}>
                <Text style={styles.clearText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* STATUS FILTER */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {STATUSES.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.filterChip, selectedStatus === s && styles.filterChipActive]}
                onPress={() => { setSelectedStatus(s); resetPage(); }}
              >
                <Text style={[styles.filterChipText, selectedStatus === s && styles.filterChipTextActive]}>
                  {s === 'All' ? `All (${users.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${users.filter(u => getLawyerStatus(u) === s).length})`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.resultCount}>{filtered.length} result{filtered.length !== 1 ? 's' : ''} found</Text>

          {/* LAWYER CARDS */}
          {paginated.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Koi lawyer nahi mila</Text>
            </View>
          ) : (
            paginated.map(user => {
              const lawyerProfile = user.lawyers?.[0] || {};
              const statusKey = getLawyerStatus(user);
              const statusStyle = statusColors[statusKey] || { bg: '#f1f5f9', text: '#64748b' };

              return (
                <View key={user.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {(user.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardName}>{user.name || 'Unknown'}</Text>
                      <Text style={styles.cardSub}>{lawyerProfile.sbc_number || '—'} · {lawyerProfile.specialty || '—'}</Text>
                      <Text style={styles.cardSub}>📍 {user.district || '—'}</Text>
                      <Text style={styles.cardSub}>✉ {user.email || '—'}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {statusKey.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Stats */}
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statVal}>{lawyerProfile.experience_years || '—'}</Text>
                      <Text style={styles.statLbl}>Yrs Exp</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statVal}>{user.phone || '—'}</Text>
                      <Text style={styles.statLbl}>Phone</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statVal}>{user.cnic || lawyerProfile.cnic || '—'}</Text>
                      <Text style={styles.statLbl}>CNIC</Text>
                    </View>
                  </View>

                  {user.is_suspended && user.suspension_reason && (
                    <View style={styles.suspendedBanner}>
                      <Text style={styles.suspendedText}>⛔ Reason: {user.suspension_reason}</Text>
                    </View>
                  )}

                  {/* Actions */}
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={[styles.toggleBtn, user.is_suspended ? styles.activateBtn : styles.suspendBtn]}
                      onPress={() => openSuspendModal(user)}
                    >
                      <Text style={styles.toggleBtnText}>
                        {user.is_suspended ? '✅ Activate' : '⛔ Suspend'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
                onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <Text style={styles.pageBtnText}>← Prev</Text>
              </TouchableOpacity>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)
              ).map(page => (
                <TouchableOpacity
                  key={page}
                  style={[styles.pageNum, currentPage === page && styles.pageNumActive]}
                  onPress={() => setCurrentPage(page)}
                >
                  <Text style={[styles.pageNumText, currentPage === page && styles.pageNumTextActive]}>{page}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
                onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <Text style={styles.pageBtnText}>Next →</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ height: 30 }} />
        </ScrollView>
      </View>

      {/* SUSPEND MODAL */}
      <Modal visible={suspendModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {selectedUser?.is_suspended ? '✅ Lawyer Activate Karein' : '⛔ Lawyer Suspend Karein'}
            </Text>
            <Text style={styles.modalSub}>
              Lawyer: <Text style={{ fontWeight: '800' }}>{selectedUser?.name}</Text>
            </Text>
            <Text style={styles.modalSub2}>{selectedUser?.email}</Text>

            {!selectedUser?.is_suspended && (
              <>
                <Text style={styles.inputLabel}>REASON (OPTIONAL)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Misconduct, invalid license..."
                  value={suspendReason}
                  onChangeText={setSuspendReason}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#94a3b8"
                />
              </>
            )}
            <Text style={styles.noteText}>ℹ️ Lawyer ko email notification bheji jayegi.</Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.confirmBtn, selectedUser?.is_suspended ? { backgroundColor: '#16a34a' } : { backgroundColor: '#dc2626' }]}
                onPress={handleSuspendToggle}
                disabled={suspendLoading}
              >
                <Text style={styles.confirmBtnText}>
                  {suspendLoading ? 'Processing...' : selectedUser?.is_suspended ? '✅ Activate' : '⛔ Suspend'}
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
  safe: { flex: 1, backgroundColor: '#f5f3ef' },
  layoutRow: { flex: 1, flexDirection: 'row' },
  scroll: { flex: 1, padding: 14 },
  contentPadding: { paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: 16, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: '#ece9e4',
  },
  hamburgerBtn: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: '#ffffff',
    borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center',
  },
  hamburgerIcon: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1a1a1a' },
  headerSub: { fontSize: 11, color: '#888', marginTop: 2 },
  headerBadge: { backgroundColor: '#fef3c7', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  headerBadgeText: { fontSize: 11, fontWeight: '700', color: '#92400e' },
  errorBanner: {
    backgroundColor: '#fef2f2', borderRadius: 10, padding: 14, marginBottom: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#fca5a5',
  },
  errorText: { color: '#dc2626', fontSize: 13, flex: 1 },
  retryText: { color: '#2563eb', fontWeight: '700', marginLeft: 12 },
  searchBox: {
    backgroundColor: '#fff', borderRadius: 14, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, marginBottom: 12, borderWidth: 1, borderColor: '#ece9e4',
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#1a1a1a', paddingVertical: 12 },
  clearText: { fontSize: 14, color: '#bbb', paddingLeft: 8 },
  filterRow: { marginBottom: 12 },
  filterChip: {
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14,
    paddingVertical: 6, marginRight: 8, borderWidth: 1, borderColor: '#ece9e4',
  },
  filterChipActive: { backgroundColor: '#1A0533', borderColor: '#1A0533' },
  filterChipText: { fontSize: 12, fontWeight: '600', color: '#666' },
  filterChipTextActive: { color: '#fff' },
  resultCount: { fontSize: 11, color: '#999', marginBottom: 12, marginTop: 4 },
  emptyBox: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#bbb', fontSize: 14 },
  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#ece9e4',
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#f0ece8',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatarText: { fontSize: 14, fontWeight: '800', color: '#5C1A1A' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '800', color: '#1a1a1a' },
  cardSub: { fontSize: 11, color: '#888', marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  statusText: { fontSize: 10, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#f9f8f6',
    borderRadius: 12, padding: 10, marginBottom: 12, alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 12, fontWeight: '800', color: '#1a1a1a' },
  statLbl: { fontSize: 9, color: '#999', marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: '#ece9e4' },
  suspendedBanner: {
    backgroundColor: '#fef2f2', borderRadius: 8, padding: 10, marginBottom: 10,
  },
  suspendedText: { color: '#dc2626', fontSize: 12, fontStyle: 'italic' },
  cardActions: { flexDirection: 'row', gap: 8 },
  toggleBtn: { flex: 1, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  suspendBtn: { backgroundColor: '#dc2626' },
  activateBtn: { backgroundColor: '#16a34a' },
  toggleBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  pagination: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, marginVertical: 16,
  },
  pageBtn: {
    backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12,
    paddingVertical: 7, borderWidth: 1, borderColor: '#ece9e4',
  },
  pageBtnDisabled: { opacity: 0.4 },
  pageBtnText: { fontSize: 12, fontWeight: '600', color: '#1A0533' },
  pageNum: {
    width: 32, height: 32, borderRadius: 8, justifyContent: 'center',
    alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ece9e4',
  },
  pageNumActive: { backgroundColor: '#1A0533', borderColor: '#1A0533' },
  pageNumText: { fontSize: 12, fontWeight: '700', color: '#666' },
  pageNumTextActive: { color: '#fff' },
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
  modalSub2: { fontSize: 12, color: '#94a3b8', marginBottom: 12 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#475569', marginBottom: 6, letterSpacing: 0.5 },
  modalInput: {
    backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#0f172a', marginBottom: 12, textAlignVertical: 'top',
  },
  noteText: { fontSize: 12, color: '#64748b', marginBottom: 16, fontStyle: 'italic' },
  modalBtnRow: { flexDirection: 'row', gap: 10 },
  confirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  cancelBtn: {
    paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#f1f5f9', alignItems: 'center',
  },
  cancelBtnText: { color: '#475569', fontWeight: '700', fontSize: 14 },
});
