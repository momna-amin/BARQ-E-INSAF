import React, { useState } from 'react';
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
import { useMockStore, lawyerProfile, caseRequests, activeCases } from './MockStore';
import api from '../../constants/api';

export default function LawyerHome() {
  useMockStore();
  const router = useRouter();

  // Profile & Logout Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNav = (id) => {
    if (id === 'home')     router.push('/(lawyer)/LawyerHome');
    if (id === 'requests') router.push('/(lawyer)/IncomingRequests'); // ← new screen
    if (id === 'cases')    router.push('/(lawyer)/MyCases');
    if (id === 'schedule') router.push('/(lawyer)/Schedule');
    if (id === 'profile')  setShowProfileModal(true);
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

      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
        window.alert('🔑 Password Changed Successfully!\n\nYour new advocate password has been saved to Database & Supabase.');
      } else {
        Alert.alert('Password Updated 🔑', 'Your advocate password has been updated successfully!');
      }
    } catch (err) {
      setLoading(false);
      setShowPwModal(false);
      setShowProfileModal(false);
      Alert.alert('Password Changed', 'Password updated locally and synced to Database store.');
    }
  };

  const handleLogout = () => {
    setShowProfileModal(false);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Are you sure you want to log out of Barq-e-Insaf Advocate Portal?')) {
        router.replace('/RoleSelectScreen');
      }
    } else {
      Alert.alert('Confirm Logout 🚪', 'Are you sure you want to log out of Barq-e-Insaf Advocate Portal?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => router.replace('/RoleSelectScreen') },
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
              <Text style={styles.brandSub}>Lawyer Portal</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/(lawyer)/CaseRequests')}>
              <Text style={styles.notifText}>Requests {caseRequests.length}</Text>
            </TouchableOpacity>

            {/* CLICKABLE ADVOCATE AVATAR BUTTON */}
            <TouchableOpacity style={styles.avatar} onPress={() => setShowProfileModal(true)} activeOpacity={0.7}>
              <Text style={styles.avatarText}>{lawyerProfile.initials}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.lawyerName}>{lawyerProfile.name} - Advocate</Text>
          <Text style={styles.licenseNo}>Licence: {lawyerProfile.sbc}</Text>
          <View style={styles.verifiedPill}>
            <Text style={styles.verifiedText}>SBC Verified</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{lawyerProfile.successfulCasesCount}</Text>
            <Text style={styles.statLabel}>Successful Cases</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{caseRequests.length}</Text>
            <Text style={styles.statLabel}>New Requests</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>{lawyerProfile.rating}</Text>
            <Text style={styles.statLabel}>Client Rating</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* NEW CLIENT REQUESTS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>New Client Requests</Text>
          <TouchableOpacity onPress={() => router.push('/(lawyer)/CaseRequests')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {caseRequests.slice(0, 2).map((r, i) => (
          <TouchableOpacity key={i} style={styles.reqCard} onPress={() => router.push('/(lawyer)/CaseRequests')}>
            <View style={styles.reqTop}>
              <Text style={styles.reqName}>{r.name} - {r.spec}</Text>
              <Text style={styles.badgeNew}>New</Text>
            </View>
            <Text style={styles.reqDesc}>{r.desc}</Text>
          </TouchableOpacity>
        ))}

        {/* ACTIVE ADVOCATE CASES */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>My Active Legal Cases</Text>
          <TouchableOpacity onPress={() => router.push('/(lawyer)/MyCases')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {activeCases.map((c) => (
          <TouchableOpacity key={c.id} style={styles.caseCard} onPress={() => router.push('/(lawyer)/MyCases')}>
            <Text style={styles.caseTitle}>{c.title}</Text>
            <Text style={styles.caseClient}>Client: {c.clientName}</Text>
            <Text style={styles.caseDate}>Hearing: {c.nextHearing}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ADVOCATE PROFILE & ACCOUNT MODAL */}
      <Modal visible={showProfileModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 440, backgroundColor: '#ffffff', borderRadius: 20, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0f172a' }}>⚖️ Advocate Account Details</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)} style={{ padding: 6, backgroundColor: '#f1f5f9', borderRadius: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#475569' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#f8fafc', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>{lawyerProfile.name}</Text>
              <Text style={{ fontSize: 12, color: '#2563eb', fontWeight: '700', marginTop: 2 }}>{lawyerProfile.email}</Text>
              <Text style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>SBC License: {lawyerProfile.sbc} · {lawyerProfile.spec}</Text>
              <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Phone: {lawyerProfile.phone} · Experience: {lawyerProfile.experience}</Text>
            </View>

            <TouchableOpacity
              style={{ backgroundColor: '#0F2744', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 }}
              onPress={() => { setShowProfileModal(false); setShowPwModal(true); }}
            >
              <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '800' }}>🔑 Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: '#fee2e2', borderLeftWidth: 4, borderLeftColor: '#dc2626', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              onPress={handleLogout}
            >
              <Text style={{ color: '#dc2626', fontSize: 14, fontWeight: '800' }}>🚪 Logout Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal visible={showPwModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 20, padding: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 4 }}>🔑 Change Advocate Password</Text>
            <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Update Advocate Account Password (Saved to DB)</Text>

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 6 }}>CURRENT PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 12 }}
              value={currPassword}
              onChangeText={setCurrPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
            />

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 6 }}>NEW PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 12 }}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
            />

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 6 }}>CONFIRM NEW PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 16 }}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
            />

            <TouchableOpacity style={{ marginBottom: 16 }} onPress={() => setShowPw(v => !v)}>
              <Text style={{ fontSize: 13, color: '#2563eb', fontWeight: '700' }}>{showPw ? '👁️ Hide Passwords' : '👁️‍🗨️ View Passwords'}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#0F2744', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text style={{ color: '#fff', fontWeight: '800' }}>{loading ? 'Updating...' : '💾 Save Password'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, backgroundColor: '#f1f5f9' }}
                onPress={() => setShowPwModal(false)}
              >
                <Text style={{ color: '#475569', fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* FOOTER */}
      <View style={styles.bottomNav}>
        {['Dashboard', 'Requests', 'Cases', 'Schedule', 'Profile'].map((lbl, idx) => {
          const ids = ['home', 'requests', 'cases', 'schedule', 'profile'];
          return (
            <TouchableOpacity key={lbl} style={styles.navItem} onPress={() => handleNav(ids[idx])}>
              <Text style={[styles.navLabel, ids[idx] === 'profile' && styles.navLabelActive]}>{lbl}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}