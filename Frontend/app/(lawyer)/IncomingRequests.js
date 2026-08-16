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
  accepted: { label: 'Qabool',  color: '#0b5d3b', bg: '#f0faf5', icon: '✅' },
  rejected: { label: 'Reject',  color: '#dc2626', bg: '#fef2f2', icon: '❌' },
};

export default function IncomingRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // pending | accepted | rejected

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
        showAlert('Error', err?.response?.data?.message || 'Requests load nahi ho sake');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchRequests(true); };

  const openResponseModal = (request, action) => {
    setSelectedRequest(request);
    setResponseAction(action);
    setReason('');
    setShowModal(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedRequest || !responseAction) return;
    try {
      setSubmitting(true);
      await api.patch(`/requests/${selectedRequest.id}`, {
        status: responseAction,
        reason: reason.trim() || undefined,
      });
      setShowModal(false);
      showAlert(
        '✅ Jawab Bhej Diya',
        `Request ${responseAction === 'accepted' ? 'qabool' : 'reject'} kar di — user ko email bhi pohonch gayi.`,
      );
      fetchRequests(true);
    } catch (err) {
      showAlert('Error', err?.response?.data?.message || 'Kuch masla ho gaya');
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
    { key: 'pending', label: 'Pending', icon: '⏳' },
    { key: 'accepted', label: 'Qabool', icon: '✅' },
    { key: 'rejected', label: 'Reject', icon: '❌' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0b5d3b" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Client Requests</Text>
          <Text style={styles.headerSub}>{requests.length} kul requests</Text>
        </View>
        <TouchableOpacity onPress={() => fetchRequests()} style={styles.refreshBtn}>
          <Text style={styles.refreshIcon}>🔄</Text>
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
            <Text style={styles.tabIcon}>{tab.icon}</Text>
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
          <ActivityIndicator color="#0b5d3b" size="large" />
          <Text style={styles.loadingText}>Requests load ho rahi hain...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0b5d3b']} />}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>
                {activeTab === 'pending' ? '📭' : activeTab === 'accepted' ? '🤝' : '🚫'}
              </Text>
              <Text style={styles.emptyText}>
                {activeTab === 'pending' ? 'Abhi koi pending request nahi' :
                 activeTab === 'accepted' ? 'Koi qabool shuda request nahi' :
                 'Koi reject shuda request nahi'}
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
                    <View style={[styles.avatar, { backgroundColor: cfg.color + '22' }]}>
                      <Text style={[styles.avatarText, { color: cfg.color }]}>
                        {(user.name || '?')[0].toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardName}>{user.name || 'Naam nahi'}</Text>
                      <Text style={styles.cardEmail}>{user.email || '—'}</Text>
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
                    📅 {new Date(req.created_at).toLocaleDateString('ur-PK', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </Text>

                  {/* Reason (if any) */}
                  {req.reason && (
                    <View style={styles.reasonBox}>
                      <Text style={styles.reasonLabel}>Wajah:</Text>
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
                        <Text style={styles.acceptBtnText}>✅ Qabool Karein</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => openResponseModal(req, 'rejected')}
                      >
                        <Text style={styles.rejectBtnText}>❌ Manzoor Nahi</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      )}

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
              {responseAction === 'accepted' ? '✅ Request Qabool Karein' : '❌ Request Reject Karein'}
            </Text>

            {selectedRequest && (
              <View style={styles.modalClientRow}>
                <Text style={styles.modalClientName}>{selectedRequest.users?.name || 'Client'}</Text>
                <Text style={styles.modalClientEmail}>{selectedRequest.users?.email}</Text>
              </View>
            )}

            <Text style={styles.modalReasonLabel}>
              Wajah likhein (ikhtiari — optional):
            </Text>
            <TextInput
              style={styles.modalReasonInput}
              value={reason}
              onChangeText={setReason}
              placeholder={
                responseAction === 'accepted'
                  ? 'Mubarak ho! Ya koi khas baat likhein...'
                  : 'Reject ki wajah batayein (masalan: schedule full hai)'
              }
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
            />

            <Text style={styles.modalNote}>
              {responseAction === 'accepted'
                ? 'Client ko email aur in-app notification jayegi ke request qabool ho gayi.'
                : 'Client ko email aur notification jayegi ke request manzoor nahi hui.'}
            </Text>
            <Text style={styles.modalAdminNote}>Admin ko bhi automatically email jayegi.</Text>

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowModal(false)}
                disabled={submitting}
              >
                <Text style={styles.modalCancelText}>Wapis</Text>
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
                      {responseAction === 'accepted' ? 'Haan, Qabool Hai' : 'Haan, Reject Karein'}
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
    backgroundColor: '#0b5d3b', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  backBtn: { padding: 4 },
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
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#0b5d3b' },
  tabIcon: { fontSize: 14 },
  tabLabel: { fontSize: 13, color: '#9ca3af', fontWeight: '500' },
  tabLabelActive: { color: '#0b5d3b', fontWeight: '700' },
  badge: { backgroundColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 },
  badgeActive: { backgroundColor: '#0b5d3b' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#6b7280', fontSize: 14 },

  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#9ca3af', fontSize: 15 },

  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    borderLeftWidth: 4, shadowColor: '#000',
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
    flex: 1, backgroundColor: '#f0faf5', borderWidth: 1.5, borderColor: '#0b5d3b',
    borderRadius: 10, padding: 12, alignItems: 'center',
  },
  acceptBtnText: { color: '#0b5d3b', fontWeight: '700', fontSize: 14 },
  rejectBtn: {
    flex: 1, backgroundColor: '#fef2f2', borderWidth: 1.5, borderColor: '#dc2626',
    borderRadius: 10, padding: 12, alignItems: 'center',
  },
  rejectBtnText: { color: '#dc2626', fontWeight: '700', fontSize: 14 },

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
    flex: 1, backgroundColor: '#0b5d3b', borderRadius: 12, padding: 15, alignItems: 'center',
  },
  modalConfirmBtnRed: { backgroundColor: '#dc2626' },
  modalConfirmBtnDisabled: { opacity: 0.6 },
  modalConfirmText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
