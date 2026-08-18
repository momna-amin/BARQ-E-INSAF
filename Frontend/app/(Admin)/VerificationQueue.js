import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
  StyleSheet, Alert, ActivityIndicator, TextInput, Modal, RefreshControl,
} from 'react-native';
import AdminSidebar from './AdminSidebar';
import api from '../../services/api';

export default function VerificationQueue() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('pending');
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Reason modal state
  const [reasonModal, setReasonModal] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approved' | 'rejected'
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLawyers = useCallback(async () => {
    try {
      setError(null);
      // Fetch all lawyers with user info
      const res = await api.get('/admin/users?role=lawyer');
      setLawyers(res.data || []);
    } catch (err) {
      console.error('VerificationQueue fetch error:', err);
      setError('Data load nahi ho saka. Dobara try karein.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchLawyers(); }, [fetchLawyers]);

  const onRefresh = () => { setRefreshing(true); fetchLawyers(); };

  // Map status from DB to filter labels
  const statusMap = {
    'pending': 'pending',
    'approved': 'approved',
    'rejected': 'rejected',
  };

  const getLawyerStatus = (user) => {
    const l = user.lawyers?.[0];
    if (!l) return 'unknown';
    return l.verification_status || 'pending';
  };

  const filteredLawyers = lawyers.filter((user) => {
    if (filter === 'All') return true;
    return getLawyerStatus(user) === filter;
  });

  const openActionModal = (user, action) => {
    setSelectedLawyer(user);
    setActionType(action);
    setReason('');
    setReasonModal(true);
  };

  const handleAction = async () => {
    if (!selectedLawyer) return;
    const lawyerProfile = selectedLawyer.lawyers?.[0];
    if (!lawyerProfile) return;

    setActionLoading(true);
    try {
      await api.put(`/admin/lawyers/${lawyerProfile.id}/verify`, {
        status: actionType,
        reason: reason.trim() || undefined,
      });
      setReasonModal(false);
      Alert.alert(
        actionType === 'approved' ? '✅ Approved!' : '❌ Rejected',
        `${selectedLawyer.name} ki request ${actionType === 'approved' ? 'approve' : 'reject'} ho gayi. Email bhej di gayi.`
      );
      fetchLawyers();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Action fail ho gaya.');
    } finally {
      setActionLoading(false);
    }
  };

  const statusCounts = {
    pending: lawyers.filter(u => getLawyerStatus(u) === 'pending').length,
    approved: lawyers.filter(u => getLawyerStatus(u) === 'approved').length,
    rejected: lawyers.filter(u => getLawyerStatus(u) === 'rejected').length,
    All: lawyers.length,
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ color: '#64748b', marginTop: 12 }}>Loading verification queue...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.layoutRow}>
        <AdminSidebar
          activeRoute="queue"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

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
                <Text style={styles.headerTitle}>⏳ Lawyer Verification Queue</Text>
                <Text style={styles.headerSub}>
                  Review and approve/reject Sindh Bar Council advocates
                </Text>
              </View>
            </View>
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={fetchLawyers}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* FILTER TABS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            {['pending', 'approved', 'rejected', 'All'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[styles.filterTab, filter === status && styles.filterTabActive]}
                onPress={() => setFilter(status)}
              >
                <Text style={[styles.filterTabText, filter === status && styles.filterTabTextActive]}>
                  {status === 'All' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status] ?? 0})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* QUEUE LIST */}
          <View style={styles.queueList}>
            {filteredLawyers.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  {filter === 'pending' ? 'Koi pending verification nahi hai. ✅' : 'Is category mein koi lawyer nahi mila.'}
                </Text>
              </View>
            ) : (
              filteredLawyers.map((user) => {
                const lawyerProfile = user.lawyers?.[0] || {};
                const status = lawyerProfile.verification_status || 'pending';
                return (
                  <View key={user.id} style={[styles.lawyerCard, status === 'rejected' && { borderLeftColor: '#dc2626' }, status === 'approved' && { borderLeftColor: '#16a34a' }]}>
                    <View style={styles.cardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.lawyerName}>{user.name || 'Unknown'}</Text>
                        <Text style={styles.sbcText}>SBC: {lawyerProfile.sbc_number || '—'}</Text>
                        <Text style={styles.emailText}>{user.email || '—'}</Text>
                      </View>
                      <View style={[
                        styles.statusTag,
                        status === 'approved' && styles.statusApproved,
                        status === 'rejected' && styles.statusRejected,
                        status === 'pending' && styles.statusPending,
                      ]}>
                        <Text style={[
                          styles.statusTagText,
                          status === 'approved' && styles.statusApprovedText,
                          status === 'rejected' && styles.statusRejectedText,
                          status === 'pending' && styles.statusPendingText,
                        ]}>
                          {status.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    {/* Details Grid */}
                    <View style={styles.detailsGrid}>
                      <View style={styles.detailCol}>
                        <Text style={styles.detailLabel}>Specialty</Text>
                        <Text style={styles.detailValue}>{lawyerProfile.specialty || '—'}</Text>
                      </View>
                      <View style={styles.detailCol}>
                        <Text style={styles.detailLabel}>District</Text>
                        <Text style={styles.detailValue}>{user.district || lawyerProfile.district || '—'}</Text>
                      </View>
                      <View style={styles.detailCol}>
                        <Text style={styles.detailLabel}>CNIC</Text>
                        <Text style={styles.detailValue}>{user.cnic || lawyerProfile.cnic || '—'}</Text>
                      </View>
                      <View style={styles.detailCol}>
                        <Text style={styles.detailLabel}>Phone</Text>
                        <Text style={styles.detailValue}>{user.phone || '—'}</Text>
                      </View>
                      <View style={styles.detailCol}>
                        <Text style={styles.detailLabel}>Registered</Text>
                        <Text style={styles.detailValue}>
                          {user.created_at ? new Date(user.created_at).toLocaleDateString('en-PK') : '—'}
                        </Text>
                      </View>
                    </View>

                    {/* Action Buttons — only for pending */}
                    {status === 'pending' && (
                      <View style={styles.actionRow}>
                        <TouchableOpacity
                          style={styles.approveBtn}
                          onPress={() => openActionModal(user, 'approved')}
                        >
                          <Text style={styles.approveBtnText}>✓ Approve Lawyer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.rejectBtn}
                          onPress={() => openActionModal(user, 'rejected')}
                        >
                          <Text style={styles.rejectBtnText}>✕ Reject</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>

      {/* REASON MODAL */}
      <Modal visible={reasonModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {actionType === 'approved' ? '✅ Lawyer Approve Karein' : '❌ Request Reject Karein'}
            </Text>
            <Text style={styles.modalSub}>
              Lawyer: <Text style={{ fontWeight: '800', color: '#0f172a' }}>{selectedLawyer?.name}</Text>
            </Text>

            <Text style={styles.inputLabel}>REASON (OPTIONAL)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={actionType === 'approved' ? 'e.g. Credentials verified successfully' : 'e.g. Invalid SBC number, documents missing'}
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={3}
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.noteText}>
              ℹ️ Lawyer ko email notification bheji jayegi.
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.confirmBtn, actionType === 'rejected' && { backgroundColor: '#dc2626' }]}
                onPress={handleAction}
                disabled={actionLoading}
              >
                <Text style={styles.confirmBtnText}>
                  {actionLoading ? 'Processing...' : actionType === 'approved' ? '✓ Confirm Approval' : '✕ Confirm Rejection'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setReasonModal(false)}>
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
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 8,
  },
  filterTabActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  filterTabText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  filterTabTextActive: { color: '#ffffff' },
  queueList: { gap: 16 },
  emptyCard: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0',
  },
  emptyText: { color: '#64748b', fontSize: 14, textAlign: 'center' },
  lawyerCard: {
    backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1,
    borderColor: '#e2e8f0', padding: 20, borderLeftWidth: 4, borderLeftColor: '#2563eb',
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16,
  },
  lawyerName: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  sbcText: { fontSize: 12, color: '#2563eb', fontWeight: '700', marginTop: 2 },
  emailText: { fontSize: 11, color: '#64748b', marginTop: 2 },
  statusTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusApproved: { backgroundColor: '#dcfce7' },
  statusRejected: { backgroundColor: '#fee2e2' },
  statusPending: { backgroundColor: '#fef3c7' },
  statusTagText: { fontSize: 11, fontWeight: '700' },
  statusApprovedText: { color: '#15803d' },
  statusRejectedText: { color: '#b91c1c' },
  statusPendingText: { color: '#b45309' },
  detailsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  detailCol: { minWidth: 130 },
  detailLabel: { fontSize: 10, fontWeight: '700', color: '#64748b', textTransform: 'uppercase' },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#0f172a', marginTop: 2 },
  actionRow: {
    flexDirection: 'row', gap: 10, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  approveBtn: {
    flex: 1, backgroundColor: '#16a34a', paddingVertical: 11,
    borderRadius: 10, alignItems: 'center',
  },
  approveBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  rejectBtn: {
    flex: 1, backgroundColor: '#dc2626', paddingVertical: 11,
    borderRadius: 10, alignItems: 'center',
  },
  rejectBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
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
  modalSub: { fontSize: 13, color: '#475569', marginTop: 6, marginBottom: 16 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#475569', marginBottom: 6, letterSpacing: 0.5 },
  modalInput: {
    backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#0f172a', marginBottom: 12, textAlignVertical: 'top',
  },
  noteText: { fontSize: 12, color: '#64748b', marginBottom: 16, fontStyle: 'italic' },
  modalBtnRow: { flexDirection: 'row', gap: 10 },
  confirmBtn: {
    flex: 1, backgroundColor: '#16a34a', paddingVertical: 14,
    borderRadius: 12, alignItems: 'center',
  },
  confirmBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  cancelBtn: {
    paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#f1f5f9', alignItems: 'center',
  },
  cancelBtnText: { color: '#475569', fontWeight: '700', fontSize: 14 },
});
