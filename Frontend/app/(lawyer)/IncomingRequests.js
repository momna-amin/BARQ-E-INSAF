/**
 * IncomingRequests.js
 * Lawyer's screen to view and respond to client consultation requests.
 * - Lists all incoming requests (pending / accepted / rejected)
 * - Accept/Reject with optional reason
 * - On action: emails user + admin automatically (backend handles this)
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, Modal, TextInput, ActivityIndicator,
  Alert, RefreshControl, StyleSheet, Animated,
} from 'react-native';
import showAlert from '../../utils/showAlert';
import { useRouter } from 'expo-router';
import api from '../../services/api';

const STATUS_CONFIG = {
  pending:  { label: 'Pending', color: '#f59e0b', bg: '#fffbeb', icon: '⏳' },
  accepted: { label: 'Accepted',  color: '#0F2744', bg: '#e0f2fe', icon: '✅' },
  rejected: { label: 'Rejected',  color: '#dc2626', bg: '#fef2f2', icon: '❌' },
};

export default function IncomingRequests() {
  const router = useRouter();

  const handleNav = (lbl) => {
    if (lbl === 'home')     router.push('/(lawyer)/LawyerHome');
    if (lbl === 'requests') router.push('/(lawyer)/IncomingRequests');
    if (lbl === 'cases')    router.push('/(lawyer)/MyCases');
    if (lbl === 'schedule') router.push('/(lawyer)/Schedule');
    if (lbl === 'profile')  router.push('/(lawyer)/LawyerProfile');
  };
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // pending | accepted | rejected
  const [isMounted, setIsMounted] = useState(false);

  // Response modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseAction, setResponseAction] = useState(null); // 'accepted' | 'rejected'
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get('/requests/incoming');
      setRequests(res.data || []);
    } catch (err) {
      if (!silent) {
        showAlert('Error', err?.response?.data?.message || 'Failed to load client requests.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchRequests();
  }, []);

  const onRefresh = () => { setRefreshing(true); fetchRequests(true); };

  const openResponseModal = (request, action) => {
    setSelectedRequest(request);
    setResponseAction(action);
    setReason('');
    setShowModal(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedRequest || !responseAction) return;
    if (responseAction === 'rejected' && !reason.trim()) {
      showAlert('Reason Required ⚠️', 'Please enter a reason for declining this request.');
      return;
    }
    try {
      setSubmitting(true);
      await api.patch(`/requests/${selectedRequest.id}`, {
        status: responseAction,
        reason: reason.trim() || undefined,
      });
      setShowModal(false);
      showAlert(
        '✅ Response Submitted',
        `Request has been ${responseAction === 'accepted' ? 'accepted' : 'declined'}. Client has been notified via email.`
      );
      fetchRequests(true);
    } catch (err) {
      showAlert('Error', err?.response?.data?.message || 'Failed to submit response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = requests.filter((r) => r.status === activeTab);
  const counts = {
    pending: requests.filter((r) => r.status === 'pending').length,
    accepted: requests.filter((r) => r.status === 'accepted').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  const tabs = [
    { key: 'pending', label: 'Pending' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(lawyer)/LawyerHome')} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Client Requests</Text>
          <Text style={styles.headerSub}>{requests.length} total requests</Text>
        </View>
        <TouchableOpacity onPress={() => fetchRequests()} style={styles.refreshBtn}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {counts[tab.key] > 0 && (
              <View style={[styles.badge, activeTab === tab.key && styles.badgeActive]}>
                <Text style={styles.badgeText}>{counts[tab.key]}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#0F2744" size="large" />
          <Text style={styles.loadingText}>Loading requests...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0F2744']} />}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>

              <Text style={styles.emptyText}>
                {activeTab === 'pending' ? 'No pending requests found' :
                 activeTab === 'accepted' ? 'No accepted requests found' :
                 'No rejected requests found'}
              </Text>
            </View>
          ) : (
            filtered.map((req) => {
              const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
              const user = req.users || {};
              return (
                <View key={req.id} style={[styles.card, { borderLeftColor: cfg.color }]}>
                  {/* Client Info */}
                  <View style={styles.cardHeader}>
                    <View style={[styles.avatar, { backgroundColor: cfg.bg || '#f1f5f9' }]}>
                      <Text style={[styles.avatarText, { color: cfg.color }]}>
                        {(user.name || '?')[0].toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardName}>{user.name || 'No Name'}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <Text style={{ fontSize: 13, color: '#475569' }}>📧 {user.email || '—'}</Text>
                      </View>
                      {user.phone && <Text style={styles.cardPhone}>📞 {user.phone}</Text>}
                      {user.district && <Text style={styles.cardCity}>📍 {user.district}</Text>}
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                      <Text style={[styles.statusText, { color: cfg.color }]}>
                        {cfg.icon} {cfg.label}
                      </Text>
                    </View>
                  </View>

                  {/* Date */}
                  <Text style={styles.cardDate}>
                    📅 {isMounted ? new Date(req.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    }) : ''}
                  </Text>

                                    {/* Attached Case Details */}
                  {req.cases && (
                    <View style={{ backgroundColor: '#f0fdf4', borderRadius: 8, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#bbf7d0' }}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: '#15803d', textTransform: 'uppercase', marginBottom: 2 }}>📂 Attached Case Details:</Text>
                      <Text style={{ fontSize: 13, fontWeight: '750', color: '#166534' }}>{req.cases.title}</Text>
                      <Text style={{ fontSize: 11, color: '#16a34a', marginTop: 1, fontWeight: '600' }}>Category: {req.cases.type} • {req.cases.district}</Text>
                      {req.cases.description && (
                        <Text style={{ fontSize: 12, color: '#374151', marginTop: 4 }}>{req.cases.description}</Text>
                      )}
                    </View>
                  )}

                  {/* Reason (if any) */}
                  {req.reason && (
                    <View style={styles.reasonBox}>
                      <Text style={styles.reasonLabel}>Reason / Details:</Text>
                      <Text style={styles.reasonText}>{req.reason}</Text>
                    </View>
                  )}

                  {/* Action Buttons (only for pending) */}
                  {req.status === 'pending' && (
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.acceptBtn}
                        onPress={() => openResponseModal(req, 'accepted')}
                      >
                        <Text style={styles.acceptBtnText}>✅ Accept Request</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => openResponseModal(req, 'rejected')}
                      >
                        <Text style={styles.rejectBtnText}>❌ Decline Request</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* FOOTER */}
      <View style={styles.bottomNav}>
        {['Dashboard', 'Requests', 'Cases', 'Schedule', 'Profile'].map((lbl, idx) => {
          const ids = ['home', 'requests', 'cases', 'schedule', 'profile'];
          return (
            <TouchableOpacity
              key={lbl}
              style={styles.navItem}
              onPress={() => handleNav(ids[idx])}
            >
              <Text style={[styles.navLabel, ids[idx] === 'requests' && styles.navLabelActive]}>{lbl}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Response Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {responseAction === 'accepted' ? '✅ Accept Consultation Request' : '❌ Decline Consultation Request'}
            </Text>

            {selectedRequest && (
              <View style={styles.modalClientRow}>
                <Text style={styles.modalClientName}>{selectedRequest.users?.name || 'Client'}</Text>
                <Text style={styles.modalClientEmail}>{selectedRequest.users?.email}</Text>
              </View>
            )}

            <Text style={styles.modalReasonLabel}>
              {responseAction === 'accepted' ? 'Acceptance message / next steps (optional):' : 'Reason for decline * (Required):'}
            </Text>
            <TextInput
              style={[
                styles.modalReasonInput, 
                responseAction === 'rejected' && !reason.trim() && { borderColor: '#fca5a5', backgroundColor: '#fffbeb' }
              ]}
              value={reason}
              onChangeText={setReason}
              placeholder={
                responseAction === 'accepted'
                  ? 'e.g. I can meet you on Monday at 10 AM at my office.'
                  : 'Please explain why you cannot take this case...'
              }
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.modalNote}>
              {responseAction === 'accepted'
                ? "⭐ Accepting this request will automatically assign you to this client's case."
                : '⚠️ Client will receive an email containing this decline explanation.'}
            </Text>
            <Text style={styles.modalAdminNote}>Notifications and emails will be handled instantly by our server.</Text>

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowModal(false)}
                disabled={submitting}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalConfirmBtn,
                  responseAction === 'rejected' && styles.modalConfirmBtnRed,
                  submitting && styles.modalConfirmBtnDisabled,
                ]}
                onPress={handleSubmitResponse}
                disabled={submitting}
              >
                {submitting
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.modalConfirmText}>
                      {responseAction === 'accepted' ? 'Confirm Accept' : 'Confirm Decline'}
                    </Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f3f4f6' },
  header: {
    backgroundColor: '#0F2744', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  backBtn: { paddingVertical: 10, paddingHorizontal: 12, marginRight: 8, justifyContent: 'center', alignItems: 'center' },
  backText: { color: '#fff', fontSize: 22, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  refreshBtn: { marginLeft: 'auto', padding: 8 },
  refreshIcon: { fontSize: 18 },

  tabBar: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', gap: 4 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#0F2744' },
  tabIcon: { fontSize: 14 },
  tabLabel: { fontSize: 13, color: '#9ca3af', fontWeight: '500' },
  tabLabelActive: { color: '#0F2744', fontWeight: '700' },
  badge: { backgroundColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 },
  badgeActive: { backgroundColor: '#0F2744' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 100 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#6b7280', fontSize: 14 },

  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#9ca3af', fontSize: 15 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
    borderLeftWidth: 6, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  cardEmail: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  cardPhone: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  cardCity: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardDate: { fontSize: 12, color: '#9ca3af', marginBottom: 8 },
  reasonBox: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 10, marginBottom: 10 },
  reasonLabel: { fontSize: 11, fontWeight: '700', color: '#6b7280', marginBottom: 2 },
  reasonText: { fontSize: 13, color: '#374151' },

  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  acceptBtn: {
    flex: 1, backgroundColor: '#10b981', borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  acceptBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  rejectBtn: {
    flex: 1, backgroundColor: '#fee2e2', borderWidth: 1.5, borderColor: '#ef4444', borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  rejectBtnText: { color: '#b91c1c', fontWeight: '800', fontSize: 14 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalBox: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 28, paddingBottom: 40,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 12 },
  modalClientRow: { backgroundColor: '#f3f4f6', borderRadius: 10, padding: 12, marginBottom: 16 },
  modalClientName: { fontWeight: '700', fontSize: 15, color: '#111827' },
  modalClientEmail: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  modalReasonLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  modalReasonInput: {
    borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10, padding: 12,
    fontSize: 14, color: '#111827', minHeight: 80, textAlignVertical: 'top', marginBottom: 12,
  },
  modalNote: { fontSize: 12, color: '#6b7280', lineHeight: 17, marginBottom: 4 },
  modalAdminNote: { fontSize: 11, color: '#9ca3af', marginBottom: 20 },
  modalBtns: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: {
    flex: 1, backgroundColor: '#f3f4f6', borderRadius: 12, padding: 15, alignItems: 'center',
  },
  modalCancelText: { color: '#374151', fontWeight: '700', fontSize: 15 },
  modalConfirmBtn: {
    flex: 1, backgroundColor: '#0F2744', borderRadius: 12, paddingVertical: 15, alignItems: 'center',
  },
  modalConfirmBtnRed: { backgroundColor: '#dc2626' },
  modalConfirmBtnDisabled: { opacity: 0.6 },
  modalConfirmText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ece9e4',
    flexDirection: 'row',
    height: 80,
    paddingBottom: 24,
    paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 11, fontWeight: '600', color: '#bbb' },
  navLabelActive: { color: '#0F2744' },
});
