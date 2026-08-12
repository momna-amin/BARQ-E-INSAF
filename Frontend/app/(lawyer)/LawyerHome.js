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
import {
  useMockStore,
  lawyerProfile,
  caseRequests,
  activeCases,
  updateLawyerProfile,
  acceptRequest,
  declineRequest,
} from './MockStore';
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
  useMockStore();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('home');

  // Profile & Logout Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // Success toast for actions
  const [toastMessage, setToastMessage] = useState('');

  // ── Load the REAL logged-in lawyer's data
  useEffect(() => {
    (async () => {
      try {
        const stored = await getUser();
        if (stored) updateLawyerProfile({ name: stored.name, email: stored.email });
        const res = await api.get('/auth/me');
        if (res?.data) {
          updateLawyerProfile({
            name: res.data.name || lawyerProfile.name,
            email: res.data.email || lawyerProfile.email,
            phone: res.data.phone || lawyerProfile.phone,
            district: res.data.district || lawyerProfile.district,
          });
        }
      } catch {
        // Backend fetch failed — keep local saved values
      }
    })();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleNav = (id) => {
    setActiveNav(id);
    if (id === 'home') router.push('/(lawyer)/LawyerHome');
    if (id === 'requests') router.push('/(lawyer)/IncomingRequests');
    if (id === 'cases') router.push('/(lawyer)/MyCases');
    if (id === 'schedule') router.push('/(lawyer)/Schedule');
    if (id === 'profile') setShowProfileModal(true);
  };

  const handleAcceptClientRequest = (reqId, clientName) => {
    acceptRequest(reqId);
    triggerToast(`✅ Consultation Accepted for ${clientName}! Moved to Active Cases.`);
  };

  const handleDeclineClientRequest = (reqId, clientName) => {
    declineRequest(reqId);
    triggerToast(`❌ Consultation Request from ${clientName} declined.`);
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
        email: lawyerProfile.email,
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
                <Text style={styles.avatarText}>{lawyerProfile.initials || 'SR'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>Welcome, Adv. {lawyerProfile.name} ⚖️</Text>
          <View style={styles.sbcBadge}>
            <Text style={styles.sbcBadgeText}>{lawyerProfile.sbc || 'SBC-4421'}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ACTION TOAST */}
        {toastMessage !== '' && (
          <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', borderWidth: 1, borderColor: '#10b981', padding: 14, borderRadius: 14, marginBottom: 16 }}>
            <Text style={{ color: '#10b981', fontSize: 13, fontWeight: '800' }}>{toastMessage}</Text>
          </View>
        )}

        {/* QUICK STATS COUNTER */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{activeCases.length}</Text>
            <Text style={styles.statLabel}>Active Cases</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNum}>{caseRequests.length}</Text>
            <Text style={styles.statLabel}>New Requests</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNum}>⭐ {lawyerProfile.rating || '4.9'}</Text>
            <Text style={styles.statLabel}>Rating ({lawyerProfile.successfulCasesCount || 42})</Text>
          </View>
        </View>

        {/* NEW CLIENT REQUESTS SECTION */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Text style={styles.sectionTitle}>New Client Requests</Text>
            {caseRequests.length > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{caseRequests.length}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push('/(lawyer)/IncomingRequests')}>
            <Text style={styles.seeAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        {caseRequests.length === 0 ? (
          <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
            <Text style={{ color: '#94a3b8', fontSize: 13 }}>No pending client requests right now.</Text>
          </View>
        ) : (
          caseRequests.map((req) => (
            <View key={req.id} style={styles.reqCard}>
              <View style={styles.reqHeader}>
                <Text style={styles.clientName}>{req.name}</Text>
                <View style={styles.reqSpecTag}>
                  <Text style={styles.reqSpecTagText}>{req.spec}</Text>
                </View>
              </View>

              <View style={styles.reqMetaRow}>
                <Text style={styles.reqMetaText}>📍 {req.location || 'Karachi'}</Text>
                <Text style={styles.reqMetaText}>🕒 {req.time || 'Recently'}</Text>
                <Text style={styles.reqMetaText}>📞 {req.contact}</Text>
              </View>

              <Text style={styles.reqDesc}>{req.desc}</Text>

              <View style={styles.reqActions}>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => handleAcceptClientRequest(req.id, req.name)}
                >
                  <Text style={styles.acceptBtnText}>✓ Accept Request</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.declineBtn}
                  onPress={() => handleDeclineClientRequest(req.id, req.name)}
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

        {activeCases.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.caseCard}
            onPress={() => router.push({ pathname: '/(lawyer)/CaseDetail', params: { caseId: c.id } })}
          >
            <View style={styles.caseHeader}>
              <Text style={styles.caseTitle}>{c.title}</Text>
            </View>
            <Text style={styles.caseCourt}>🏛️ {c.court || 'District Court Sindh'}</Text>
            <Text style={styles.caseClient}>Client: {c.clientName || 'Assigned Client'}</Text>
            <Text style={styles.caseDesc}>{c.description}</Text>

            <View style={styles.caseFooterRow}>
              <Text style={styles.evidenceCount}>📁 {c.evidence?.length || 0} Evidence Files</Text>
              <Text style={styles.manageBtnText}>View Details →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ADVOCATE PROFILE MODAL */}
      <Modal visible={showProfileModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 440, backgroundColor: '#0F172A', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#ffffff' }}>⚖️ Advocate Profile</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)} style={{ padding: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#ffffff' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#ffffff' }}>Adv. {lawyerProfile.name}</Text>
              <Text style={{ fontSize: 13, color: '#3b82f6', fontWeight: '700', marginTop: 2 }}>{lawyerProfile.email}</Text>
              <Text style={{ fontSize: 12, color: '#fbbf24', marginTop: 4 }}>SBC License: {lawyerProfile.sbc || 'SBC-4421'}</Text>
              <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Specialty: {lawyerProfile.spec} · District: {lawyerProfile.district || 'Karachi'}</Text>
            </View>

            <TouchableOpacity
              style={{ backgroundColor: '#fbbf24', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 }}
              onPress={() => { setShowProfileModal(false); setShowPwModal(true); }}
            >
              <Text style={{ color: '#07152E', fontSize: 14, fontWeight: '800' }}>🔑 Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.4)', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              onPress={handleLogout}
            >
              <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '800' }}>🚪 Logout Advocate Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal visible={showPwModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 420, backgroundColor: '#0F172A', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#ffffff', marginBottom: 4 }}>🔑 Change Advocate Password</Text>
            <Text style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Update Advocate Account Password (Saved to DB)</Text>

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#fbbf24', marginBottom: 6 }}>CURRENT PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, fontSize: 14, color: '#ffffff', marginBottom: 12 }}
              value={currPassword}
              onChangeText={setCurrPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
              placeholderTextColor="#64748b"
            />

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#fbbf24', marginBottom: 6 }}>NEW PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, fontSize: 14, color: '#ffffff', marginBottom: 12 }}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
              placeholderTextColor="#64748b"
            />

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#fbbf24', marginBottom: 6 }}>CONFIRM NEW PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, fontSize: 14, color: '#ffffff', marginBottom: 16 }}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
              placeholderTextColor="#64748b"
            />

            <TouchableOpacity style={{ marginBottom: 16 }} onPress={() => setShowPw(v => !v)}>
              <Text style={{ fontSize: 13, color: '#3b82f6', fontWeight: '700' }}>{showPw ? '👁️ Hide Passwords' : '👁️‍🗨️ View Passwords'}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#fbbf24', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text style={{ color: '#07152E', fontWeight: '800' }}>{loading ? 'Updating...' : '💾 Save Password'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)' }}
                onPress={() => setShowPwModal(false)}
              >
                <Text style={{ color: '#94a3b8', fontWeight: '700' }}>Cancel</Text>
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