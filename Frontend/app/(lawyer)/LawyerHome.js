import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './LawyerHome.styles';

import api from '../../services/api';
import { clearTokens, getUser } from '../../services/authStorage';
import showAlert from '../../utils/showAlert';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'requests', label: 'Requests' },
  { id: 'cases', label: 'Cases' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'profile', label: 'Profile' },
];

export default function LawyerHome() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('home');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // Real data state variables
  const [realUser, setRealUser] = useState({ name: 'Lawyer', email: '', role: 'lawyer', dp: 'L' });
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeCases, setActiveCases] = useState([]);
  const [stats, setStats] = useState({ activeCases: 0, pendingRequests: 0, rating: 5.0 });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, reqsRes, casesRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/requests/incoming'),
        api.get('/cases/my'),
      ]);

      if (profileRes?.data) {
        setRealUser({
          ...profileRes.data,
          dp: (profileRes.data.name || 'L').substring(0, 2).toUpperCase()
        });
        setStats(prev => ({
          ...prev,
          rating: profileRes.data.lawyer_profile?.rating || 5.0,
        }));
      }

      const formattedReqs = (reqsRes.data || []).map(r => ({
        id: r.id,
        citizenName: r.users?.name || 'Client',
        citizenPhone: r.users?.phone || 'N/A',
        citizenEmail: r.users?.email || 'N/A',
        caseCategory: r.reason ? r.reason.substring(0, 20) : 'General Consultation',
        reason: r.reason || 'Legal consultation needed.',
        status: r.status,
        createdAt: new Date(r.created_at).toLocaleDateString(),
      }));
      setIncomingRequests(formattedReqs.filter(r => r.status === 'pending'));

      const formattedCases = (casesRes.data || []).map(c => ({
        id: c.id,
        title: c.title,
        type: c.type,
        citizenName: c.citizen?.name || 'Client',
        nextHearing: c.hearing_date ? new Date(c.hearing_date).toLocaleDateString() : 'TBD',
        status: c.status,
      }));
      setActiveCases(formattedCases);

      setStats({
        activeCases: formattedCases.length,
        pendingRequests: formattedReqs.filter(r => r.status === 'pending').length,
        rating: profileRes?.data?.lawyer_profile?.rating || 5.0
      });
    } catch (err) {
      console.log('Error fetching lawyer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser().then(u => {
      if (u) {
        setRealUser(prev => ({
          ...prev,
          ...u,
          dp: (u.name || 'L').substring(0, 2).toUpperCase()
        }));
      }
    });
    fetchDashboardData();
  }, []);

  const handleNav = (id) => {
    setActiveNav(id);
    if (id === 'home')     router.push('/(lawyer)/LawyerHome');
    if (id === 'requests') router.push('/(lawyer)/IncomingRequests');
    if (id === 'cases')    router.push('/(lawyer)/MyCases');
    if (id === 'schedule') router.push('/(lawyer)/Schedule');
    if (id === 'profile')  setShowProfileModal(true);
  };

  const handleAcceptClientRequest = async (reqId, clientName) => {
    try {
      await api.patch(`/requests/${reqId}`, { status: 'accepted' });
      Alert.alert('✅ Request Accepted', `Consultation with ${clientName} has been accepted.`);
      fetchDashboardData();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleDeclineClientRequest = async (reqId, clientName) => {
    try {
      await api.patch(`/requests/${reqId}`, { status: 'rejected' });
      Alert.alert('❌ Request Declined', `Consultation with ${clientName} declined.`);
      fetchDashboardData();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to decline request');
    }
  };

  const handleChangePassword = async () => {
    if (!currPassword || !newPassword) {
      Alert.alert('Error', 'Please enter current and new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await api.put('/auth/change-password', {
        email: realUser.email,
        oldPassword: currPassword,
        newPassword,
      });

      setLoading(false);
      setShowPwModal(false);
      setShowProfileModal(false);
      setCurrPassword('');
      setNewPassword('');
      setConfirmPassword('');

      showAlert('Password Updated 🔑', 'Your advocate password has been updated successfully!');
    } catch (err) {
      setLoading(false);
      const msg = err?.response?.data?.message || 'Password change nahi ho saka. Dobara koshish karein.';
      Alert.alert('Password Change Failed ⚠️', msg);
    }
  };

  const doLogout = async () => {
    await clearTokens();
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.href = '/RoleSelectScreen';
    } else {
      router.replace('/RoleSelectScreen');
    }
  };

  const handleLogout = () => {
    setShowProfileModal(false);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Are you sure you want to log out of Barq-e-Insaf Advocate Portal?')) {
        doLogout();
      }
    } else {
      Alert.alert('Confirm Logout 🚪', 'Are you sure you want to log out of Barq-e-Insaf Advocate Portal?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: doLogout },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>SBC</Text>
            </View>
            <View style={styles.brand}>
              <Text style={styles.brandName}>Barq-e-Insaf</Text>
              <Text style={styles.brandSub}>ADVOCATE PORTAL · SINDH</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.profileBtn} onPress={() => setShowProfileModal(true)}>
              <Text style={styles.profileBtnText}>Profile</Text>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{realUser.dp || 'L'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>Welcome, Adv. {realUser.name} ⚖️</Text>
          <View style={styles.sbcBadge}>
            <Text style={styles.sbcBadgeText}>{realUser.lawyer_profile?.sbc_number || 'SBC-Verified'}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* QUICK STATS COUNTER */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{stats.activeCases}</Text>
            <Text style={styles.statLabel}>Active Cases</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNum}>{stats.pendingRequests}</Text>
            <Text style={styles.statLabel}>New Requests</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNum}>⭐ {stats.rating || '5.0'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* NEW CLIENT REQUESTS SECTION */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Text style={styles.sectionTitle}>New Client Requests</Text>
            {incomingRequests.length > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{incomingRequests.length}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push('/(lawyer)/IncomingRequests')}>
            <Text style={styles.seeAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        {incomingRequests.length === 0 ? (
          <View style={{ backgroundColor: '#ffffff', padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#ece9e4' }}>
            <Text style={{ color: '#666666', fontSize: 13 }}>No pending client requests right now.</Text>
          </View>
        ) : (
          incomingRequests.map((req) => (
            <View key={req.id} style={styles.reqCard}>
              <View style={styles.reqHeader}>
                <Text style={styles.clientName}>{req.citizenName}</Text>
                <View style={styles.reqSpecTag}>
                  <Text style={styles.reqSpecTagText}>{req.caseCategory}</Text>
                </View>
              </View>

              <View style={styles.reqMetaRow}>
                <Text style={styles.reqMetaText}>🕒 {req.createdAt}</Text>
                <Text style={styles.reqMetaText}>📞 {req.citizenPhone}</Text>
              </View>

              <Text style={styles.reqDesc}>{req.reason}</Text>

              <View style={styles.reqActions}>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => handleAcceptClientRequest(req.id, req.citizenName)}
                >
                  <Text style={styles.acceptBtnText}>✓ Accept Request</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.declineBtn}
                  onPress={() => handleDeclineClientRequest(req.id, req.citizenName)}
                >
                  <Text style={styles.declineBtnText}>✕ Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* ACTIVE LEGAL CASES SECTION */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>My Active Legal Cases ({activeCases.length})</Text>
          <TouchableOpacity onPress={() => router.push('/(lawyer)/MyCases')}>
            <Text style={styles.seeAllText}>Manage All →</Text>
          </TouchableOpacity>
        </View>

        {activeCases.length === 0 ? (
          <View style={{ backgroundColor: '#ffffff', padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#ece9e4' }}>
            <Text style={{ color: '#666666', fontSize: 13 }}>No active cases assigned yet.</Text>
          </View>
        ) : (
          activeCases.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.caseCard}
              onPress={() => router.push({ pathname: '/(lawyer)/CaseDetail', params: { caseId: c.id } })}
            >
              <View style={styles.caseHeader}>
                <Text style={styles.caseTitle}>{c.title}</Text>
              </View>
              <Text style={styles.caseCourt}>🏛️ {c.court || 'District Court Sindh'}</Text>
              <Text style={styles.caseClient}>Client: {c.citizenName || 'Assigned Client'}</Text>
              <Text style={styles.caseDesc}>{c.description}</Text>

              <View style={styles.caseFooterRow}>
                <Text style={styles.evidenceCount}>📁 {c.evidence?.length || 0} Evidence Files</Text>
                <Text style={styles.manageBtnText}>View Details →</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* ADVOCATE PROFILE MODAL */}
      <Modal visible={showProfileModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 440, backgroundColor: '#ffffff', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#ece9e4' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a' }}>⚖️ Advocate Profile</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)} style={{ padding: 6, backgroundColor: '#f3f4f6', borderRadius: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#666666' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#f8f9fa', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#ece9e4' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1a1a1a' }}>Adv. {realUser.name}</Text>
              <Text style={{ fontSize: 13, color: '#0F2744', fontWeight: '700', marginTop: 2 }}>{realUser.email}</Text>
              <Text style={{ fontSize: 12, color: '#0F2744', marginTop: 4, fontWeight: '600' }}>SBC License: {realUser.lawyer_profile?.sbc_number || 'SBC-Verified'}</Text>
              <Text style={{ fontSize: 12, color: '#666666', marginTop: 2 }}>Specialty: {realUser.lawyer_profile?.specialty || 'General Practice'} · District: {realUser.district || realUser.lawyer_profile?.district || 'Sindh'}</Text>
            </View>

            <TouchableOpacity
              style={{ backgroundColor: '#0F2744', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 }}
              onPress={() => { setShowProfileModal(false); setShowPwModal(true); }}
            >
              <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '800' }}>🔑 Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fca5a5', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              onPress={handleLogout}
            >
              <Text style={{ color: '#b91c1c', fontSize: 14, fontWeight: '800' }}>🚪 Logout Advocate Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal visible={showPwModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 420, backgroundColor: '#ffffff', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#ece9e4' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 }}>🔑 Change Advocate Password</Text>
            <Text style={{ fontSize: 12, color: '#666666', marginBottom: 16 }}>Update Advocate Account Password (Saved to DB)</Text>

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#0F2744', marginBottom: 6 }}>CURRENT PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ece9e4', borderRadius: 10, padding: 12, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}
              value={currPassword}
              onChangeText={setCurrPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
              placeholderTextColor="#888888"
            />

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#0F2744', marginBottom: 6 }}>NEW PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ece9e4', borderRadius: 10, padding: 12, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
              placeholderTextColor="#888888"
            />

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#0F2744', marginBottom: 6 }}>CONFIRM NEW PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ece9e4', borderRadius: 10, padding: 12, fontSize: 14, color: '#1a1a1a', marginBottom: 16 }}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
              placeholderTextColor="#888888"
            />

            <TouchableOpacity style={{ marginBottom: 16 }} onPress={() => setShowPw(v => !v)}>
              <Text style={{ fontSize: 13, color: '#0F2744', fontWeight: '700' }}>{showPw ? '👁️ Hide Passwords' : '👁️‍🗨️ View Passwords'}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#0F2744', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text style={{ color: '#ffffff', fontWeight: '800' }}>{loading ? 'Updating...' : '💾 Save Password'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, backgroundColor: '#f3f4f6' }}
                onPress={() => setShowPwModal(false)}
              >
                <Text style={{ color: '#666666', fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.navItem} onPress={() => handleNav(item.id)}>
            <Text style={[styles.navLabel, activeNav === item.id && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}