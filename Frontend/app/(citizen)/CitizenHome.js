import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './CitizenHome.styles';
import { useMockStore, userData, lawyers, activeCases } from './MockStore';

const navItems = [
  { id: 'home',     label: 'Home'    },
  { id: 'cases',    label: 'Cases'   },
  { id: 'lawyers',  label: 'Lawyers' },
  { id: 'profile',  label: 'Profile' },
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

  const handleNav = (id) => {
    setActiveNav(id);
    if (id === 'cases')   router.push('/(citizen)/MyCases');
    if (id === 'lawyers') router.push('/(citizen)/FindLawyer');
    if (id === 'home')    router.push('/(citizen)/CitizenHome');
    if (id === 'profile') router.push('/(citizen)/Profile');
  };

  const handleBuildCase = () => {
    setShowCasePopup(true);
  };

  const handleCaseTypeSelect = (type) => {
    setShowCasePopup(false);
    router.push({
      pathname: '/(citizen)/CaseForm',
      params: { caseType: type }
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
      params: { caseId: caseItem.id }
    });
  };

  // Filter lawyers by citizen's current district
  const localLawyers = lawyers.filter(
    l => l.district.toLowerCase() === userData.district.toLowerCase()
  );

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
            <TouchableOpacity style={styles.notifBtn}>
              <Text style={styles.notifBtnText}>Notif</Text>
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userData.dp}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.greeting}>Asalam-u-Alaikum, {userData.name}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* BUILD A CASE BUTTON */}
        <TouchableOpacity style={styles.buildCaseBtn} onPress={handleBuildCase}>
          <Text style={styles.buildCaseBtnText}>Build a Case</Text>
        </TouchableOpacity>

        {/* VERIFIED LAWYERS NEAR YOU */}
        <Text style={styles.sectionLabel}>Verified Lawyers Near You ({userData.district})</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.lawyerRow}
        >
          {localLawyers.length > 0 ? (
            localLawyers.map((l, i) => (
              <TouchableOpacity 
                key={i} 
                style={styles.lawyerBubble}
                onPress={() => handleLawyerPress(l)}
              >
                <View style={[styles.lawyerAvatar, { backgroundColor: l.color }]}>
                  <Text style={styles.lawyerAvatarText}>{l.initials}</Text>
                </View>
                <Text style={styles.lawyerName} numberOfLines={1}>{l.name}</Text>
                <Text style={styles.lawyerSpec}>{l.spec}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>Rating: {l.rating}</Text>
                </View>
                <Text style={styles.sbcBadge}>SBC Approved</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No lawyers found in this district.</Text>
          )}
        </ScrollView>

        {/* ACTIVE CASES */}
        <Text style={styles.sectionLabel}>My Active Cases</Text>
        {activeCases.map((c, i) => (
          <TouchableOpacity
            key={i}
            style={styles.caseItem}
            onPress={() => handleCasePress(c)}
          >
            <View style={[styles.caseDot, { backgroundColor: c.status === 'Active' ? '#4ade80' : '#f59e0b' }]} />
            <View style={styles.caseInfo}>
              <Text style={styles.caseTitle}>{c.title}</Text>
              <Text style={styles.caseSub}>{c.type} Law · Updated {c.lastUpdated}</Text>
            </View>
            <Text style={styles.badgeText}>{c.status}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => handleNav(item.id)}
          >
            <Text style={[
              styles.navLabel,
              activeNav === item.id && styles.navLabelActive,
            ]}>
              {item.label}
            </Text>
            {activeNav === item.id && <View style={styles.navActiveDot} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* CASE TYPE POPUP */}
      <Modal
        transparent={true}
        visible={showCasePopup}
        animationType="fade"
        onRequestClose={() => setShowCasePopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Choose Case Type</Text>
            <Text style={styles.popupSubtitle}>
              Select the type of case you want to build. Each type has specific requirements and documentation needs.
            </Text>
            
            <TouchableOpacity 
              style={styles.caseTypeOption}
              onPress={() => handleCaseTypeSelect('property')}
            >
              <View style={styles.caseTypeInfo}>
                <Text style={styles.caseTypeTitle}>Property Dispute</Text>
                <Text style={styles.caseTypeDesc}>
                  For issues related to property ownership, inheritance, tenant disputes, and land matters.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.caseTypeOption}
              onPress={() => handleCaseTypeSelect('family')}
            >
              <View style={styles.caseTypeInfo}>
                <Text style={styles.caseTypeTitle}>Family Case</Text>
                <Text style={styles.caseTypeDesc}>
                  For divorce proceedings, child custody, maintenance, and other family law matters.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.popupCloseBtn}
              onPress={() => setShowCasePopup(false)}
            >
              <Text style={styles.popupCloseBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* LAWYER PROFILE MODAL */}
      <Modal
        transparent={true}
        visible={showLawyerProfile}
        animationType="slide"
        onRequestClose={() => setShowLawyerProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.lawyerProfileContainer}>
            <TouchableOpacity 
              style={styles.closeProfileBtn}
              onPress={() => setShowLawyerProfile(false)}
            >
              <Text style={styles.closeProfileText}>Close</Text>
            </TouchableOpacity>
            
            {selectedLawyer && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.profileAvatarLarge, { backgroundColor: selectedLawyer.color }]}>
                  <Text style={styles.profileAvatarText}>{selectedLawyer.initials}</Text>
                </View>
                
                <Text style={styles.profileName}>{selectedLawyer.name}</Text>
                <Text style={styles.profileSpec}>{selectedLawyer.spec}</Text>
                
                <View style={styles.profileDetails}>
                  <View style={styles.profileDetailItem}>
                    <Text style={styles.profileDetailLabel}>Location</Text>
                    <Text style={styles.profileDetailValue}>{selectedLawyer.location}</Text>
                  </View>
                  <View style={styles.profileDetailItem}>
                    <Text style={styles.profileDetailLabel}>Rating</Text>
                    <Text style={styles.profileDetailValue}>{selectedLawyer.rating}</Text>
                  </View>
                  <View style={styles.profileDetailItem}>
                    <Text style={styles.profileDetailLabel}>Successful Cases</Text>
                    <Text style={styles.profileDetailValue}>{selectedLawyer.cases}</Text>
                  </View>
                  <View style={styles.profileDetailItem}>
                    <Text style={styles.profileDetailLabel}>Experience</Text>
                    <Text style={styles.profileDetailValue}>{selectedLawyer.experience}</Text>
                  </View>
                  <View style={styles.profileDetailItem}>
                    <Text style={styles.profileDetailLabel}>SBC Number</Text>
                    <Text style={styles.profileDetailValue}>{selectedLawyer.sbc} (Approved)</Text>
                  </View>
                </View>
                
                <Text style={styles.profileAbout}>{selectedLawyer.about}</Text>
                
                {/* OFFICE SCHEDULE BUTTON */}
                <TouchableOpacity 
                  style={styles.scheduleBtn} 
                  onPress={() => setShowScheduleModal(true)}
                >
                  <Text style={styles.scheduleBtnText}>View Office Schedule</Text>
                </TouchableOpacity>

                {/* REVIEWS LIST */}
                <Text style={styles.reviewsTitle}>Client Reviews</Text>
                {selectedLawyer.reviews.map((r, ri) => (
                  <View key={ri} style={styles.reviewCard}>
                    <Text style={styles.reviewUser}>{r.user} (Rating: {r.rating})</Text>
                    <Text style={styles.reviewComment}>{r.comment}</Text>
                  </View>
                ))}
                
                {requestSent ? (
                  <View style={styles.requestSentContainer}>
                    <Text style={styles.requestSentText}>Request Sent Successfully</Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.sendRequestBtn}
                    onPress={() => {
                      setShowLawyerProfile(false);
                      router.push({
                        pathname: '/(citizen)/RequestConsultation',
                        params: { lawyerId: selectedLawyer.id }
                      });
                    }}
                  >
                    <Text style={styles.sendRequestBtnText}>Request Consultation</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* SCHEDULE MODAL */}
      <Modal
        transparent={true}
        visible={showScheduleModal}
        animationType="fade"
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Office Schedule</Text>
            {selectedLawyer && selectedLawyer.schedule.map((item, idx) => (
              <View key={idx} style={styles.scheduleItemRow}>
                <Text style={styles.scheduleDay}>{item.day}</Text>
                <Text style={styles.scheduleTime}>{item.time}</Text>
              </View>
            ))}
            <TouchableOpacity 
              style={styles.popupCloseBtn}
              onPress={() => setShowScheduleModal(false)}
            >
              <Text style={styles.popupCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}