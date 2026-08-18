import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './CaseRequests.styles';
import api from '../../services/api';

export default function CaseRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await api.get('/requests/incoming');
      setRequests(res.data || []);
    } catch (err) {
      console.log('Error fetching incoming requests:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const onRefresh = () => { setRefreshing(true); fetchRequests(); };

  const handleAccept = (reqId) => {
    Alert.alert(
      'Accept Case',
      'By accepting this consultation request, you agree to represent this client.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await api.patch(`/requests/${reqId}`, { status: 'accepted' });
              Alert.alert('Case Accepted', 'Request accepted! Moving to active cases.');
              fetchRequests();
            } catch (err) {
              Alert.alert('Error', err?.response?.data?.message || 'Failed to accept request.');
            }
          }
        }
      ]
    );
  };

  const handleDecline = (reqId) => {
    Alert.alert(
      'Decline Request',
      'Are you sure you want to decline this request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.patch(`/requests/${reqId}`, { status: 'rejected' });
              Alert.alert('Request Declined', 'The request has been declined.');
              fetchRequests();
            } catch (err) {
              Alert.alert('Error', err?.response?.data?.message || 'Failed to decline request.');
            }
          }
        }
      ]
    );
  };

  const handleNav = (lbl) => {
    if (lbl === 'home') router.push('/(lawyer)/LawyerHome');
    if (lbl === 'requests') router.push('/(lawyer)/CaseRequests');
    if (lbl === 'cases') router.push('/(lawyer)/MyCases');
    if (lbl === 'schedule') router.push('/(lawyer)/Schedule');
    if (lbl === 'profile') router.push('/(lawyer)/LawyerProfile');
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>BI</Text>
          </View>
          <Text style={styles.headerTitle}>Case Requests ({pendingRequests.length})</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0F2744']} />}
      >
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0F2744" />
            <Text style={{ color: '#64748b', marginTop: 12 }}>Loading incoming requests...</Text>
          </View>
        ) : pendingRequests.length > 0 ? (
          pendingRequests.map((r) => (
            <View key={r.id} style={styles.reqCard}>
              <View style={styles.reqTop}>
                <Text style={styles.reqName}>{r.users?.name || 'Client Request'}</Text>
                <Text style={styles.badgeNew}>Pending</Text>
              </View>
              <Text style={styles.reqMeta}>
                Location: {r.users?.district || 'Sindh'} · {new Date(r.created_at).toLocaleDateString()}
              </Text>
              
              <View style={styles.problemBox}>
                <Text style={styles.problemLabel}>Problem Statement / Reason:</Text>
                <Text style={styles.reqDesc}>{r.reason || 'Legal consultation requested.'}</Text>
              </View>
              
              <View style={styles.securedNotice}>
                <Text style={styles.securedNoticeText}>
                  Client contact details will be shared via email once you accept this request.
                </Text>
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(r.id)}>
                  <Text style={styles.acceptText}>✓ Accept Case</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineBtn} onPress={() => handleDecline(r.id)}>
                  <Text style={styles.declineText}>✕ Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>📩</Text>
            <Text style={styles.emptyText}>No pending case requests at this time.</Text>
          </View>
        )}
      </ScrollView>

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
    </SafeAreaView>
  );
}