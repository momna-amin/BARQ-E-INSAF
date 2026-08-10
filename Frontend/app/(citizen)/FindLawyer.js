import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './FindLawyer.styles';
import { useMockStore, lawyers } from './MockStore';

const specialties = ['All', 'Property Law', 'Family Law'];

export default function FindLawyer() {
  useMockStore();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showLawyerProfile, setShowLawyerProfile] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const filtered = lawyers.filter(l => {
    const matchSpec = activeFilter === 'All' || l.spec === activeFilter;
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchSearch;
  });

  const handleNav = (id) => {
    if (id === 'home')    router.push('/(citizen)/CitizenHome');
    if (id === 'cases')   router.push('/(citizen)/MyCases');
    if (id === 'lawyers') router.push('/(citizen)/FindLawyer');
    if (id === 'profile') router.push('/(citizen)/Profile');
  };

  const handleLawyerPress = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowLawyerProfile(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5C1A1A" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>BI</Text>
          </View>
          <Text style={styles.headerTitle}>Find a Lawyer</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SEARCH */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {specialties.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.filterChip, activeFilter === s && styles.filterChipActive]}
              onPress={() => setActiveFilter(s)}
            >
              <Text style={[styles.filterText, activeFilter === s && styles.filterTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LAWYER CARDS */}
        {filtered.map((l, i) => (
          <TouchableOpacity 
            key={i} 
            style={styles.lawyerCard}
            onPress={() => handleLawyerPress(l)}
          >
            <View style={[styles.lawyerAvatar, { backgroundColor: l.color }]}>
              <Text style={styles.lawyerAvatarText}>{l.initials}</Text>
            </View>
            <View style={styles.lawyerInfo}>
              <Text style={styles.lawyerName}>{l.name}</Text>
              <Text style={styles.lawyerSpec}>{l.spec} · {l.location}</Text>
              <View style={styles.lawyerMeta}>
                <Text style={styles.sbcBadge}>SBC Approved</Text>
                <Text style={styles.ratingText}>Rating: {l.rating} ({l.cases} cases)</Text>
              </View>
              
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.profileBtn]} 
                  onPress={() => handleLawyerPress(l)}
                >
                  <Text style={styles.profileBtnText}>View Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.requestBtn]}
                  onPress={() => {
                    router.push({
                      pathname: '/(citizen)/RequestConsultation',
                      params: { lawyerId: l.id }
                    });
                  }}
                >
                  <Text style={styles.requestBtnText}>Request Consultation</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {['Home', 'Cases', 'Lawyers', 'Profile'].map((lbl) => (
          <TouchableOpacity
            key={lbl}
            style={styles.navItem}
            onPress={() => handleNav(lbl.toLowerCase())}
          >
            <Text style={[styles.navLabel, lbl === 'Lawyers' && styles.navLabelActive]}>{lbl}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
                    <Text style={styles.profileDetailLabel}>District</Text>
                    <Text style={styles.profileDetailValue}>{selectedLawyer.location}</Text>
                  </View>
                  <View style={styles.profileDetailItem}>
                    <Text style={styles.profileDetailLabel}>Rating</Text>
                    <Text style={styles.profileDetailValue}>{selectedLawyer.rating} / 5.0</Text>
                  </View>
                  <View style={styles.profileDetailItem}>
                    <Text style={styles.profileDetailLabel}>Successful Cases</Text>
                    <Text style={styles.profileDetailValue}>{selectedLawyer.cases}</Text>
                  </View>
                  <View style={styles.profileDetailItem}>
                    <Text style={styles.profileDetailLabel}>SBC License</Text>
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

                {/* REVIEWS */}
                <Text style={styles.reviewsHeader}>Client Reviews</Text>
                {selectedLawyer.reviews.map((r, ri) => (
                  <View key={ri} style={styles.reviewCard}>
                    <Text style={styles.reviewUser}>{r.user} (Rating: {r.rating})</Text>
                    <Text style={styles.reviewComment}>{r.comment}</Text>
                  </View>
                ))}

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
                  <Text style={styles.sendRequestBtnText}>Send Consultation Request</Text>
                </TouchableOpacity>
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