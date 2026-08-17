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
import styles from './CitizenHome.styles';
import api from '../../services/api';
import { clearTokens, getUser } from '../../services/authStorage';
import showAlert from '../../utils/showAlert';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'cases', label: 'Cases' },
  { id: 'lawyers', label: 'Lawyers' },
  { id: 'profile', label: 'Profile' },
];

const filterCategories = ['All', 'Property Law', 'Family Law', 'Civil Cases', 'Criminal Law'];

export default function CitizenHome() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('home');
  const [showCasePopup, setShowCasePopup] = useState(false);
  const [showLawyerProfile, setShowLawyerProfile] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  
  // Real user and dynamic data states
  const [realUser, setRealUser] = useState({ name: 'Citizen', role: 'citizen', cnic: '', phone: '', district: '', dp: 'C' });
  const [lawyers, setLawyers] = useState([]);
  const [activeCases, setActiveCases] = useState([]);
  const [consultationRequests, setConsultationRequests] = useState([]);

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

  const fetchData = async () => {
    try {
      const [lawyersRes, casesRes, reqsRes] = await Promise.all([
        api.get('/lawyers'),
        api.get('/cases/my'),
        api.get('/requests/my'),
      ]);

      const formattedLawyers = (lawyersRes.data || []).map(l => ({
        id: l.id,
        name: l.user?.name || 'Unknown Advocate',
        spec: l.specialty || 'General Practice',
        sbc: l.sbc_number,
        district: l.district || 'Sindh',
        initials: (l.user?.name || 'A').substring(0, 2).toUpperCase(),
        rating: (l.total_ratings > 0) ? (l.rating || '0.0') : 'New',
        cases: l.total_ratings || 0,
        color: '#5C1A1A'
      }));
      setLawyers(formattedLawyers);

      const formattedCases = (casesRes.data || []).map(c => ({
        id: c.id,
        title: c.title,
        type: c.type,
        status: c.status === 'active' ? 'Active' : c.status === 'pending' ? 'Pending' : 'Closed',
        lawyerName: c.lawyer?.user?.name || 'Assigned Counsel',
        nextHearing: c.hearing_date ? new Date(c.hearing_date).toLocaleDateString() : 'Pending Assignment',
        filingDate: new Date(c.created_at).toLocaleDateString(),
        lastUpdated: c.updated_at ? new Date(c.updated_at).toLocaleDateString() : 'Recently'
      }));
      setActiveCases(formattedCases);

      const formattedReqs = (reqsRes.data || []).map(r => ({
        id: r.id,
        lawyerName: r.lawyers?.lawyer_users?.name || 'Advocate',
        lawyerSbc: r.lawyers?.sbc_number || 'SBC-Verified',
        status: r.status === 'pending' ? 'Pending' : r.status === 'accepted' ? 'Accepted' : 'Declined',
        reason: r.reason || 'Legal Consultation',
        caseCategory: r.lawyers?.specialty || 'General',
        createdAt: new Date(r.created_at).toLocaleDateString()
      }));
      setConsultationRequests(formattedReqs);
    } catch (err) {
      console.log('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    getUser().then(u => {
      if (u) {
        setRealUser(prev => ({
          ...prev,
          ...u,
          dp: (u.name || 'C').substring(0, 2).toUpperCase()
        }));
      }
    });

    api.get('/auth/me').then(res => {
      if (res?.data) {
        setRealUser({
          ...res.data,
          dp: (res.data.name || 'C').substring(0, 2).toUpperCase()
        });
      }
    }).catch(() => {});

    fetchData();
  }, []);

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
    if (!lawyerObj) return;

    try {
      setLoading(true);
      await api.post('/requests', {
        lawyerId: lawyerObj.id,
        reason: requestReason,
        urgency: requestUrgency
      });

      setShowConsultModal(false);
      setRequestSuccessBanner(true);
      setTimeout(() => setRequestSuccessBanner(false), 4000);
      fetchData();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to send request';
      showAlert('Error ⚠️', msg);
    } finally {
      setLoading(false);
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
      showAlert('Error', 'Please enter current and new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert('Error', 'New passwords do not match');
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

      showAlert('Password Updated 🔑', 'Your password has been updated successfully!');
    } catch (err) {
      setLoading(false);
      const msg = err?.response?.data?.message || 'Password change nahi ho saka. Dobara koshish karein.';
      showAlert('Password Change Failed ⚠️', msg);
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
      showAlert('Confirm Logout 🚪', 'Are you sure you want to log out of Barq-e-Insaf?', [
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
      (l.sbc || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'All' || l.spec.toLowerCase().includes(selectedFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

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
              <Text style={styles.brandSub}>LIGHTNING JUSTICE · SINDH</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.profileBtn} onPress={() => setShowProfileModal(true)}>
              <Text style={styles.profileBtnText}>Profile</Text>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{realUser.dp}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.greeting}>Asalam-u-Alaikum, {realUser.name} 👋</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SUCCESS BANNER */}
        {requestSuccessBanner && (
          <View style={{ backgroundColor: '#dcfce7', borderWidth: 1, borderColor: '#bbf7d0', padding: 14, borderRadius: 14, marginBottom: 16 }}>
            <Text style={{ color: '#15803d', fontSize: 14, fontWeight: '800' }}>✅ Consultation Request Sent!</Text>
            <Text style={{ color: '#166534', fontSize: 12, marginTop: 4 }}>
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
                  <Text style={{ fontWeight: '800', color: '#5C1A1A' }}>Reason: </Text>
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
            placeholderTextColor="#888888"
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
              <View style={[styles.lawyerAvatar, { backgroundColor: l.color || '#5C1A1A' }]}>
                <Text style={styles.lawyerAvatarText}>{l.initials}</Text>
                <View style={styles.onlineDot} />
              </View>
              <Text style={styles.lawyerName}>{l.name}</Text>
              <Text style={styles.lawyerSpec}>{l.spec}</Text>
              <Text style={styles.lawyerSbc}>{l.sbc || 'SBC Verified'}</Text>

              <View style={styles.ratingRow}>
                <Text style={{ fontSize: 11, color: '#5C1A1A' }}>⭐</Text>
                <Text style={styles.ratingText}>{l.rating || '4.8'}</Text>
                <Text style={{ fontSize: 10, color: '#888888' }}>({l.cases || 30}+ cases)</Text>
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
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 440, backgroundColor: '#ffffff', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#ece9e4' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a' }}>
                ⚖️ Request Consultation
              </Text>
              <TouchableOpacity onPress={() => setShowConsultModal(false)} style={{ padding: 6, backgroundColor: '#f3f4f6', borderRadius: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#666666' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedLawyer && (
              <View style={{ backgroundColor: '#f8f9fa', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#ece9e4' }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#1a1a1a' }}>Adv. {selectedLawyer.name}</Text>
                <Text style={{ fontSize: 12, color: '#5C1A1A', fontWeight: '700', marginTop: 2 }}>{selectedLawyer.spec} · {selectedLawyer.sbc}</Text>
                <Text style={{ fontSize: 11, color: '#666666', marginTop: 2 }}>District: {selectedLawyer.district || 'Sindh'}</Text>
              </View>
            )}

            <Text style={{ fontSize: 12, fontWeight: '700', color: '#5C1A1A', marginBottom: 6 }}>PROBLEM REASON / DESCRIPTION</Text>
            <TextInput
              style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ece9e4', borderRadius: 12, padding: 14, fontSize: 13, color: '#1a1a1a', height: 100, textAlignVertical: 'top', marginBottom: 16 }}
              placeholder="Describe your legal issue, property dispute, or advice needed..."
              placeholderTextColor="#888888"
              multiline
              value={requestReason}
              onChangeText={setRequestReason}
            />

            <Text style={{ fontSize: 12, fontWeight: '700', color: '#5C1A1A', marginBottom: 8 }}>URGENCY LEVEL</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              {['Low', 'Medium', 'Urgent'].map((urg) => (
                <TouchableOpacity
                  key={urg}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: requestUrgency === urg ? '#5C1A1A' : '#f8f9fa',
                    borderWidth: 1,
                    borderColor: requestUrgency === urg ? '#5C1A1A' : '#ece9e4',
                  }}
                  onPress={() => setRequestUrgency(urg)}
                >
                  <Text style={{ fontSize: 12, fontWeight: '800', color: requestUrgency === urg ? '#ffffff' : '#666666' }}>
                    {urg}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={{ backgroundColor: '#5C1A1A', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              onPress={handleSendConsultationRequest}
            >
              <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '800' }}>📤 Send Request to Advocate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PROFILE MODAL */}
      <Modal visible={showProfileModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 440, backgroundColor: '#ffffff', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#ece9e4' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a' }}>👤 Citizen Account Details</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)} style={{ padding: 6, backgroundColor: '#f3f4f6', borderRadius: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: '#666666' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#f8f9fa', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#ece9e4' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1a1a1a' }}>{realUser.name}</Text>
              <Text style={{ fontSize: 13, color: '#5C1A1A', fontWeight: '700', marginTop: 2 }}>{realUser.email}</Text>
              <Text style={{ fontSize: 12, color: '#666666', marginTop: 4 }}>Phone: {realUser.phone || 'N/A'} · CNIC: {realUser.cnic || 'N/A'}</Text>
              <Text style={{ fontSize: 12, color: '#666666', marginTop: 2 }}>District: {realUser.district || 'N/A'} · Sindh</Text>
            </View>

            <TouchableOpacity
              style={{ backgroundColor: '#5C1A1A', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 }}
              onPress={() => { setShowProfileModal(false); setShowPwModal(true); }}
            >
              <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '800' }}>🔑 Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fca5a5', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              onPress={handleLogout}
            >
              <Text style={{ color: '#b91c1c', fontSize: 14, fontWeight: '800' }}>🚪 Logout Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CHANGE PASSWORD MODAL */}
      <Modal visible={showPwModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ width: '100%', maxWidth: 420, backgroundColor: '#ffffff', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#ece9e4' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 }}>🔑 Change Citizen Password</Text>
            <Text style={{ fontSize: 12, color: '#666666', marginBottom: 16 }}>Update Citizen Account Password (Saved to DB)</Text>

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#5C1A1A', marginBottom: 6 }}>CURRENT PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ece9e4', borderRadius: 10, padding: 12, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}
              value={currPassword}
              onChangeText={setCurrPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
              placeholderTextColor="#888888"
            />

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#5C1A1A', marginBottom: 6 }}>NEW PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ece9e4', borderRadius: 10, padding: 12, fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
              placeholderTextColor="#888888"
            />

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#5C1A1A', marginBottom: 6 }}>CONFIRM NEW PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ece9e4', borderRadius: 10, padding: 12, fontSize: 14, color: '#1a1a1a', marginBottom: 16 }}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
              placeholderTextColor="#888888"
            />

            <TouchableOpacity style={{ marginBottom: 16 }} onPress={() => setShowPw(v => !v)}>
              <Text style={{ fontSize: 13, color: '#5C1A1A', fontWeight: '700' }}>{showPw ? '👁️ Hide Passwords' : '👁️‍🗨️ View Passwords'}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#5C1A1A', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
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