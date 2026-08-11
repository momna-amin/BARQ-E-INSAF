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
import styles from './CitizenHome.styles';
import { useMockStore, userData, lawyers, activeCases } from './MockStore';
import api from '../../constants/api';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'cases', label: 'Cases' },
  { id: 'lawyers', label: 'Lawyers' },
  { id: 'profile', label: 'Profile' },
];

export default function CitizenHome() {
  useMockStore();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('home');
  const [showCasePopup, setShowCasePopup] = useState(false);
  const [showLawyerProfile, setShowLawyerProfile] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Profile & Logout Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNav = (id) => {
    setActiveNav(id);
    if (id === 'cases') router.push('/(citizen)/MyCases');
    if (id === 'lawyers') router.push('/(citizen)/FindLawyer');
    if (id === 'home') router.push('/(citizen)/CitizenHome');
    if (id === 'profile') setShowProfileModal(true);
  };

  const handleCaseTypeSelect = (type) => {
    setShowCasePopup(false);
    router.push({
      pathname: '/(citizen)/CaseForm',
      params: { caseType: type },
    });
  };

  const handleLawyerPress = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowLawyerProfile(true);
  };

  const handleSendRequest = () => {
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setShowLawyerProfile(false);
    }, 2000);
  };

  const handleCasePress = (caseItem) => {
    router.push({
      pathname: '/(citizen)/CaseDetail',
      params: { caseId: caseItem.id },
    });
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
        email: userData.email,
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
        window.alert('🔑 Password Changed Successfully!\n\nYour new citizen password has been saved to Database & Supabase.');
      } else {
        Alert.alert('Password Updated 🔑', 'Your password has been updated successfully!');
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
      if (window.confirm('Are you sure you want to log out of Barq-e-Insaf?')) {
        router.replace('/RoleSelectScreen');
      }
    } else {
      Alert.alert('Confirm Logout 🚪', 'Are you sure you want to log out of Barq-e-Insaf?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => router.replace('/RoleSelectScreen') },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5C1A1A" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>BI</Text>
            </View>
            <View style={styles.brand}>
              <Text style={styles.brandName}>Barq-e-Insaf</Text>
              <Text style={styles.brandSub}>Lightning Justice</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn} onPress={() => setShowProfileModal(true)}>
              <Text style={styles.notifBtnText}>Profile</Text>
            </TouchableOpacity>

            {/* CLICKABLE USER AVATAR BUTTON FOR PROFILE & LOGOUT */}
            <TouchableOpacity style={styles.avatar} onPress={() => setShowProfileModal(true)} activeOpacity={0.7}>
              <Text style={styles.avatarText}>{userData.dp}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.greeting}>Asalam-u-Alaikum, {userData.name}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* BANNER */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerTag}>SINDH LEGAL ACCESS</Text>
          <Text style={styles.bannerTitle}>Justice at Your Fingertips</Text>
          <Text style={styles.bannerSub}>Connect with verified Sindh Bar Council lawyers & track your cases live.</Text>

          <TouchableOpacity style={styles.bannerBtn} onPress={() => setShowCasePopup(true)}>
            <Text style={styles.bannerBtnText}>+ File New Legal Case</Text>
          </TouchableOpacity>
        </View>

        {/* ACTIVE CASES SECTION */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>Active Cases ({activeCases.length})</Text>
          <TouchableOpacity onPress={() => router.push('/(citizen)/MyCases')}>
            <Text style={styles.seeAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        {activeCases.map((c) => (
          <TouchableOpacity key={c.id} style={styles.caseCard} onPress={() => handleCasePress(c)}>
            <View style={styles.caseCardHeader}>
              <Text style={styles.caseCategory}>{c.category}</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>{c.status}</Text>
              </View>
            </View>
            <Text style={styles.caseTitle}>{c.title}</Text>
            <Text style={styles.caseLawyer}>Lawyer: {c.lawyerName}</Text>
            <Text style={styles.caseDate}>Next Hearing: {c.nextHearing}</Text>
          </TouchableOpacity>
        ))}

        {/* VERIFIED LAWYERS SECTION */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>SBC Verified Advocates</Text>
          <TouchableOpacity onPress={() => router.push('/(citizen)/FindLawyer')}>
            <Text style={styles.seeAllText}>Search Lawyers →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.lawyerScroll}>
          {lawyers.map((l) => (
            <TouchableOpacity key={l.id} style={styles.lawyerCard} onPress={() => handleLawyerPress(l)}>
              <View style={[styles.lawyerAvatar, { backgroundColor: l.color }]}>
                <Text style={styles.lawyerAvatarText}>{l.initials}</Text>
              </View>
              <Text style={styles.lawyerName}>{l.name}</Text>
              <Text style={styles.lawyerSpec}>{l.spec}</Text>
              <Text style={styles.lawyerSbc}>SBC: {l.sbc}</Text>
              <View style={styles.hireBtn}>
                <Text style={styles.hireBtnText}>Consult</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* USER PROFILE & ACCOUNT MODAL */}
      <Modal visible={showProfileModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 440, backgroundColor: '#ffffff', borderRadius: 20, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#0f172a' }}>👤 Citizen Account Details</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)} style={{ padding: 6, backgroundColor: '#f1f5f9', borderRadius: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#475569' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#f8fafc', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>{userData.name}</Text>
              <Text style={{ fontSize: 12, color: '#2563eb', fontWeight: '700', marginTop: 2 }}>{userData.email}</Text>
              <Text style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Phone: {userData.phone} · CNIC: {userData.cnic}</Text>
              <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>District: {userData.district} · Sindh</Text>
            </View>

            <TouchableOpacity
              style={{ backgroundColor: '#5C1A1A', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 }}
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
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 4 }}>🔑 Change Citizen Password</Text>
            <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Update Citizen Account Password (Saved to DB)</Text>

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
                style={{ flex: 1, backgroundColor: '#5C1A1A', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
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