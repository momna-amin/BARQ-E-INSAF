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
import {
  useMockStore,
  userData,
  lawyers,
  activeCases,
  consultationRequests,
  addConsultationRequest,
} from './MockStore';
import api from '../../services/api';
import { clearTokens } from '../../services/authStorage';
import showAlert from '../../utils/showAlert';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'cases', label: 'Cases' },
  { id: 'lawyers', label: 'Lawyers' },
  { id: 'profile', label: 'Profile' },
];

const filterCategories = ['All', 'Property Law', 'Family Law', 'Civil Cases', 'Criminal Law'];

export default function CitizenHome() {
  useMockStore();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('home');
  const [showCasePopup, setShowCasePopup] = useState(false);
  const [showLawyerProfile, setShowLawyerProfile] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Consultation Request Modal state
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [requestReason, setRequestReason] = useState('');
  const [requestUrgency, setRequestUrgency] = useState('Medium');
  const [requestSuccessBanner, setRequestSuccessBanner] = useState(false);

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

  const handleConsultPress = (lawyer) => {
    setSelectedLawyer(lawyer);
    setRequestReason('');
    setShowConsultModal(true);
  };

  const handleSendConsultationRequest = async () => {
    if (!requestReason.trim()) {
      showAlert('Input Required ⚠️', 'Barah-e-karam maslay ki tafseel (reason) darj karein.');
      return;
    }

    const lawyerObj = selectedLawyer || lawyers[0];

    // 1. Optimistic UI update — record in store immediately
    addConsultationRequest({
      lawyerId: lawyerObj.id,
      lawyerName: lawyerObj.name,
      lawyerSpec: lawyerObj.spec,
      lawyerSbc: lawyerObj.sbc,
      citizenName: userData.name,
      citizenEmail: userData.email,
      citizenPhone: userData.phone,
      caseCategory: lawyerObj.spec,
      reason: requestReason,
      urgency: requestUrgency,
    });

    // 2. UI feedback is immediate and not blocked by email/network delay
    setShowConsultModal(false);
    setRequestSuccessBanner(true);
    setTimeout(() => setRequestSuccessBanner(false), 4000);

    // 3. Asynchronous background API call (non-blocking)
    try {
      api.post('/requests', {
        lawyer_id: lawyerObj.id,
        user_id: userData.email,
        reason: requestReason,
        urgency: requestUrgency,
      }).catch(() => {
        // Silent catch — UI has already saved optimistic request locally
      });
    } catch {
      // Ignored — frontend operates optimistically
    }
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

      showAlert('Password Updated 🔑', 'Your password has been updated successfully!');
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
      if (window.confirm('Are you sure you want to log out of Barq-e-Insaf?')) {
        doLogout();
      }
    } else {
      Alert.alert('Confirm Logout 🚪', 'Are you sure you want to log out of Barq-e-Insaf?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: doLogout },
      ]);
    }
  };

  // Filter lawyers by search query and specialty chip
  const filteredLawyers = lawyers.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.sbc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'All' || l.spec.toLowerCase().includes(selectedFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>BI</Text>
            </View>
            <View style={styles.brand}>
              <Text style={styles.brandName}>Barq-e-Insaf</Text>
              <Text style={styles.brandSub}>LIGHTNING JUSTICE · SINDH</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.profileBtn} onPress={() => setShowProfileModal(true)}>
              <Text style={styles.profileBtnText}>Profile</Text>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{userData.dp}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.greeting}>Asalam-u-Alaikum, {userData.name} 👋</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SUCCESS BANNER */}
        {requestSuccessBanner && (
          <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', borderWidth: 1, borderColor: '#10b981', padding: 14, borderRadius: 14, marginBottom: 16 }}>
            <Text style={{ color: '#10b981', fontSize: 14, fontWeight: '800' }}>✅ Consultation Request Sent!</Text>
            <Text style={{ color: '#e2e8f0', fontSize: 12, marginTop: 4 }}>
              Aap ki request advocate ko bhej di gayi hai. Status niche "My Consultation Requests" mein dekhein.
            </Text>
          </View>
        )}

        {/* HERO BANNER */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerTag}>SINDH LEGAL ACCESS</Text>
          <Text style={styles.bannerTitle}>Justice at Your Fingertips</Text>
          <Text style={styles.bannerSub}>Connect with verified Sindh Bar Council lawyers & track your cases live.</Text>

          <TouchableOpacity style={styles.bannerBtn} onPress={() => router.push('/(citizen)/CaseForm')}>
            <Text style={styles.bannerBtnText}>+ File New Legal Case</Text>
          </TouchableOpacity>
        </View>

        {/* CONSULTATION REQUEST STATUS TRACKER */}
        {consultationRequests.length > 0 && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>My Consultation Requests ({consultationRequests.length})</Text>
            </View>

            {consultationRequests.map((req) => (
              <View key={req.id} style={styles.reqCard}>
                <View style={styles.reqCardHeader}>
                  <Text style={styles.reqLawyerName}>Adv. {req.lawyerName}</Text>
                  <View
                    style={
                      req.status === 'Accepted'
                        ? styles.reqStatusPillAccepted
                        : req.status === 'Declined'
                        ? styles.reqStatusPillDeclined
                        : styles.reqStatusPillPending
                    }
                  >
                    <Text
                      style={
                        req.status === 'Accepted'
                          ? styles.reqStatusTextAccepted
                          : req.status === 'Declined'
                          ? styles.reqStatusTextDeclined
                          : styles.reqStatusTextPending
                      }
                    >
                      {req.status === 'Accepted'
                        ? '✅ Accepted'
                        : req.status === 'Declined'
                        ? '❌ Declined'
                        : '⏳ Pending Review'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.reqReason}>
                  <Text style={{ fontWeight: '800', color: '#fbbf24' }}>Reason: </Text>
                  {req.reason}
                </Text>

                <View style={styles.reqMetaRow}>
                  <Text style={styles.reqMetaText}>SBC: {req.lawyerSbc || 'SBC-Verified'} · {req.caseCategory}</Text>
                  <Text style={styles.reqMetaText}>{req.createdAt}</Text>
                </View>
              </View>
            ))}
          </>
        )}

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
              <Text style={styles.caseCategory}>{c.type || c.category}</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>{c.status}</Text>
              </View>
            </View>
            <Text style={styles.caseTitle}>{c.title}</Text>
            <Text style={styles.caseLawyer}>Advocate: {c.lawyerName || 'Assigned Counsel'}</Text>
            <Text style={styles.caseDate}>Next Hearing: {c.nextHearing || c.filingDate}</Text>
          </TouchableOpacity>
        ))}

        {/* VERIFIED LAWYERS SECTION WITH SEARCH */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>SBC Verified Advocates</Text>
          <TouchableOpacity onPress={() => router.push('/(citizen)/FindLawyer')}>
            <Text style={styles.seeAllText}>Search Lawyers →</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBarWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="search lawyers by name, spec, district..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* FILTER CHIPS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filterCategories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, selectedFilter === cat && styles.filterChipActive]}
              onPress={() => setSelectedFilter(cat)}
            >
              <Text style={[styles.filterChipText, selectedFilter === cat && styles.filterChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LAWYER GRID / CARDS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.lawyerScroll}>
          {filteredLawyers.map((l) => (
            <TouchableOpacity key={l.id} style={styles.lawyerCard} onPress={() => handleConsultPress(l)}>
              <View style={[styles.lawyerAvatar, { backgroundColor: l.color || '#0F2744' }]}>
                <Text style={styles.lawyerAvatarText}>{l.initials}</Text>
                <View style={styles.onlineDot} />
              </View>
              <Text style={styles.lawyerName}>{l.name}</Text>
              <Text style={styles.lawyerSpec}>{l.spec}</Text>
              <Text style={styles.lawyerSbc}>{l.sbc || 'SBC Verified'}</Text>

              <View style={styles.ratingRow}>
                <Text style={{ fontSize: 11, color: '#fbbf24' }}>⭐</Text>
                <Text style={styles.ratingText}>{l.rating || '4.8'}</Text>
                <Text style={{ fontSize: 10, color: '#94a3b8' }}>({l.cases || 30}+ cases)</Text>
              </View>

              <View style={styles.hireBtn}>
                <Text style={styles.hireBtnText}>Consult Now</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* REQUEST CONSULTATION MODAL */}
      <Modal visible={showConsultModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 440, backgroundColor: '#0F172A', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(251, 191, 36, 0.3)' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#ffffff' }}>
                ⚖️ Request Consultation
              </Text>
              <TouchableOpacity onPress={() => setShowConsultModal(false)} style={{ padding: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#ffffff' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedLawyer && (
              <View style={{ backgroundColor: 'rgba(15, 39, 68, 0.8)', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#ffffff' }}>Adv. {selectedLawyer.name}</Text>
                <Text style={{ fontSize: 12, color: '#3b82f6', fontWeight: '700', marginTop: 2 }}>{selectedLawyer.spec} · {selectedLawyer.sbc}</Text>
                <Text style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>District: {selectedLawyer.district || 'Sindh'}</Text>
              </View>
            )}

            <Text style={{ fontSize: 12, fontWeight: '700', color: '#fbbf24', marginBottom: 6 }}>PROBLEM REASON / DESCRIPTION</Text>
            <TextInput
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 14, fontSize: 13, color: '#ffffff', height: 100, textAlignVertical: 'top', marginBottom: 16 }}
              placeholder="Describe your legal issue, property dispute, or advice needed..."
              placeholderTextColor="#64748b"
              multiline
              value={requestReason}
              onChangeText={setRequestReason}
            />

            <Text style={{ fontSize: 12, fontWeight: '700', color: '#fbbf24', marginBottom: 8 }}>URGENCY LEVEL</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              {['Low', 'Medium', 'Urgent'].map((urg) => (
                <TouchableOpacity
                  key={urg}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: requestUrgency === urg ? '#fbbf24' : 'rgba(255,255,255,0.06)',
                    borderWidth: 1,
                    borderColor: requestUrgency === urg ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                  }}
                  onPress={() => setRequestUrgency(urg)}
                >
                  <Text style={{ fontSize: 12, fontWeight: '800', color: requestUrgency === urg ? '#07152E' : '#94a3b8' }}>
                    {urg}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={{ backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              onPress={handleSendConsultationRequest}
            >
              <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '800' }}>📤 Send Request to Advocate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PROFILE MODAL */}
      <Modal visible={showProfileModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 440, backgroundColor: '#0F172A', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#ffffff' }}>👤 Citizen Account Details</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)} style={{ padding: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#ffffff' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#ffffff' }}>{userData.name}</Text>
              <Text style={{ fontSize: 13, color: '#3b82f6', fontWeight: '700', marginTop: 2 }}>{userData.email}</Text>
              <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Phone: {userData.phone} · CNIC: {userData.cnic}</Text>
              <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>District: {userData.district} · Sindh</Text>
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
              <Text style={{ color: '#ef4444', fontSize: 14, fontWeight: '800' }}>🚪 Logout Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal visible={showPwModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 420, backgroundColor: '#0F172A', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#ffffff', marginBottom: 4 }}>🔑 Change Citizen Password</Text>
            <Text style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Update Citizen Account Password (Saved to DB)</Text>

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