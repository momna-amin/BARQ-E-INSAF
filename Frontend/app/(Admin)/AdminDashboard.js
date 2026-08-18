import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import AdminSidebar from './AdminSidebar';
import api from '../../services/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [pendingLawyers, setPendingLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [statsRes, activityRes, pendingRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/recent-activity?limit=10'),
        api.get('/admin/pending-lawyers'),
      ]);
      setStats(statsRes.data);
      setActivity(activityRes.data?.activity || []);
      setPendingLawyers(pendingRes.data || []);
    } catch (err) {
      console.error('AdminDashboard fetchData error:', err);
      setError('Data load karne mein masla hua. Dobara try karein.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleQuickApprove = async (lawyer) => {
    try {
      await api.put(`/admin/lawyers/${lawyer.id}/verify`, { status: 'approved', reason: '' });
      Alert.alert('✅ Approved!', `${lawyer.user?.name || 'Lawyer'} ko approve kar diya gaya.`);
      fetchData();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Approve nahi ho saka.');
    }
  };

  const handleQuickReject = async (lawyer) => {
    Alert.prompt
      ? Alert.prompt('Reject Karein', 'Wajah darj karein (optional):', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reject', style: 'destructive',
            onPress: async (reason) => {
              try {
                await api.put(`/admin/lawyers/${lawyer.id}/verify`, { status: 'rejected', reason: reason || '' });
                Alert.alert('Rejected', `${lawyer.user?.name || 'Lawyer'} ki request reject ho gayi.`);
                fetchData();
              } catch (err) {
                Alert.alert('Error', err?.response?.data?.message || 'Reject nahi ho saka.');
              }
            }
          }
        ])
      : Alert.alert(
          'Reject Request',
          `${lawyer.user?.name || 'Lawyer'} ki verification request reject karein?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Reject', style: 'destructive',
              onPress: async () => {
                try {
                  await api.put(`/admin/lawyers/${lawyer.id}/verify`, { status: 'rejected', reason: '' });
                  Alert.alert('Rejected', 'Request reject ho gayi.');
                  fetchData();
                } catch (err) {
                  Alert.alert('Error', err?.response?.data?.message || 'Reject nahi ho saka.');
                }
              }
            }
          ]
        );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ color: '#64748b', marginTop: 12, fontSize: 14 }}>Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.layoutRow}>
        <AdminSidebar
          activeRoute="dashboard"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={styles.contentPadding}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />}
        >
          {/* TOP HEADER BAR */}
          <View style={styles.headerBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 54 }}>
              <View>
                <Text style={styles.welcomeTitle}>Welcome back, Super Admin 👋</Text>
                <Text style={styles.welcomeSub}>Barq-e-Insaf Legal Platform — Real-Time Overview</Text>
              </View>
            </View>
            <View style={styles.systemStatusPill}>
              <Text style={styles.systemStatusText}>● Live</Text>
            </View>
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={fetchData}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
            </View>
          )}

          {/* KPI METRICS GRID */}
          <Text style={styles.sectionHeader}>PLATFORM METRICS</Text>
          <View style={styles.kpiGrid}>
            <TouchableOpacity
              style={[styles.kpiCard, { borderTopColor: '#2563eb' }]}
              onPress={() => router.push('/(Admin)/UserManagement')}
            >
              <Text style={styles.kpiValue}>{stats?.totalUsers ?? 0}</Text>
              <Text style={styles.kpiLabel}>Total Users & Citizens</Text>
              <Text style={[styles.kpiSub, { color: '#2563eb' }]}>Tap to manage</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.kpiCard, { borderTopColor: '#d97706' }]}
              onPress={() => router.push('/(Admin)/LawyerManagement')}
            >
              <Text style={styles.kpiValue}>{stats?.totalLawyers ?? 0}</Text>
              <Text style={styles.kpiLabel}>Verified Lawyers</Text>
              <Text style={[styles.kpiSub, { color: '#d97706' }]}>
                {stats?.pendingLawyers ?? 0} Pending Review
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.kpiCard, { borderTopColor: '#16a34a' }]}
              onPress={() => router.push('/(Admin)/VerificationQueue')}
            >
              <Text style={styles.kpiValue}>{stats?.pendingLawyers ?? 0}</Text>
              <Text style={styles.kpiLabel}>Pending Verification</Text>
              <Text style={[styles.kpiSub, { color: '#16a34a' }]}>Needs Review</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.kpiCard, { borderTopColor: '#9333ea' }]}
              onPress={() => router.push('/(Admin)/CasesPage')}
            >
              <Text style={styles.kpiValue}>{stats?.totalCases ?? 0}</Text>
              <Text style={styles.kpiLabel}>Total Legal Cases</Text>
              <Text style={[styles.kpiSub, { color: '#9333ea' }]}>
                {stats?.flaggedCases ?? 0} Flagged
              </Text>
            </TouchableOpacity>
          </View>

          {/* PENDING LAWYER VERIFICATIONS */}
          <Text style={styles.sectionHeader}>🚨 PENDING LAWYER VERIFICATIONS</Text>
          <View style={styles.attentionCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                ⚖️ Pending Verifications ({pendingLawyers.length})
              </Text>
              <TouchableOpacity onPress={() => router.push('/(Admin)/VerificationQueue')}>
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>

            {pendingLawyers.length === 0 ? (
              <Text style={styles.emptyText}>No pending verifications at this time. ✅</Text>
            ) : (
              pendingLawyers.slice(0, 3).map((lawyer) => (
                <View key={lawyer.id} style={styles.itemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{lawyer.user?.name || 'Unknown Lawyer'}</Text>
                    <Text style={styles.itemSub}>
                      SBC: {lawyer.sbc_number || '—'} · {lawyer.specialty || '—'} · {lawyer.user?.district || lawyer.district || '—'}
                    </Text>
                    <Text style={[styles.itemSub, { color: '#64748b' }]}>{lawyer.user?.email || '—'}</Text>
                  </View>
                  <View style={styles.btnGroup}>
                    <TouchableOpacity style={styles.btnApprove} onPress={() => handleQuickApprove(lawyer)}>
                      <Text style={styles.btnText}>✓ Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnReject} onPress={() => handleQuickReject(lawyer)}>
                      <Text style={styles.btnText}>✕ Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* RECENT ACTIVITY */}
          <Text style={[styles.sectionHeader, { marginTop: 20 }]}>📋 RECENT ACTIVITY</Text>
          <View style={styles.attentionCard}>
            {activity.length === 0 ? (
              <Text style={styles.emptyText}>No recent activity.</Text>
            ) : (
              activity.slice(0, 8).map((item) => (
                <View key={item.id} style={styles.activityRow}>
                  <View style={[
                    styles.activityDot,
                    { backgroundColor: item.type === 'signup' ? '#2563eb' : item.status === 'accepted' ? '#16a34a' : item.status === 'rejected' ? '#dc2626' : '#d97706' }
                  ]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activityDetail} numberOfLines={1}>{item.detail}</Text>
                    <Text style={styles.activityTime}>
                      {new Date(item.timestamp).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })}
                    </Text>
                  </View>
                  {item.status && (
                    <View style={[
                      styles.statusPill,
                      item.status === 'accepted' && styles.statusAccepted,
                      item.status === 'rejected' && styles.statusRejected,
                      item.status === 'pending' && styles.statusPending,
                    ]}>
                      <Text style={styles.statusPillText}>{item.status.toUpperCase()}</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#ffffff' },
  layoutRow: { flex: 1, flexDirection: 'row' },
  mainScroll: { flex: 1, backgroundColor: '#f8fafc' },
  contentPadding: { padding: 24, paddingBottom: 40 },
  headerBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 24, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  welcomeTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  welcomeSub: { fontSize: 12, color: '#475569', marginTop: 2 },
  systemStatusPill: {
    backgroundColor: '#dcfce7', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: '#86efac',
  },
  systemStatusText: { color: '#15803d', fontSize: 12, fontWeight: '700' },
  errorBanner: {
    backgroundColor: '#fef2f2', borderRadius: 10, padding: 14, marginBottom: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#fca5a5',
  },
  errorText: { color: '#dc2626', fontSize: 13, flex: 1 },
  retryText: { color: '#2563eb', fontSize: 13, fontWeight: '700', marginLeft: 12 },
  sectionHeader: {
    fontSize: 12, fontWeight: '800', color: '#64748b',
    letterSpacing: 1, marginBottom: 14,
  },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 28 },
  kpiCard: {
    flex: 1, minWidth: 160, backgroundColor: '#ffffff', borderRadius: 16,
    padding: 18, borderTopWidth: 4, borderWidth: 1, borderColor: '#e2e8f0',
  },
  kpiValue: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  kpiLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginTop: 4 },
  kpiSub: { fontSize: 11, marginTop: 4, fontWeight: '600', color: '#2563eb' },
  attentionCard: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  viewAllText: { fontSize: 12, color: '#2563eb', fontWeight: '700' },
  emptyText: { fontSize: 13, color: '#64748b', fontStyle: 'italic' },
  itemRow: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 12,
  },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  itemSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  btnGroup: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  btnApprove: {
    backgroundColor: '#16a34a', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6,
  },
  btnReject: {
    backgroundColor: '#dc2626', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6,
  },
  btnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  activityRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  activityDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  activityTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  activityDetail: { fontSize: 11, color: '#64748b', marginTop: 1 },
  activityTime: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  statusPill: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start',
  },
  statusAccepted: { backgroundColor: '#dcfce7' },
  statusRejected: { backgroundColor: '#fee2e2' },
  statusPending: { backgroundColor: '#fef3c7' },
  statusPillText: { fontSize: 10, fontWeight: '700', color: '#475569' },
});
