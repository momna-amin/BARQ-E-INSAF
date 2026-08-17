import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, 
  StatusBar, Modal, ActivityIndicator, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './OtherLawyers.styles';
import api from '../../services/api';

export default function OtherLawyers() {
  const router = useRouter();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const fetchLawyers = useCallback(async () => {
    try {
      const res = await api.get('/lawyers');
      setLawyers(res.data || []);
    } catch (err) {
      console.log('Error fetching other lawyers:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchLawyers(); }, [fetchLawyers]);

  const onRefresh = () => { setRefreshing(true); fetchLawyers(); };

  const handleNav = (lbl) => {
    if (lbl === 'home') router.push('/(lawyer)/LawyerHome');
    if (lbl === 'requests') router.push('/(lawyer)/IncomingRequests');
    if (lbl === 'cases') router.push('/(lawyer)/MyCases');
    if (lbl === 'schedule') router.push('/(lawyer)/Schedule');
    if (lbl === 'profile') router.push('/(lawyer)/LawyerProfile');
  };

  const handleLawyerPress = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowProfile(true);
  };

  const getInitials = (name) => {
    if (!name) return 'L';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>BI</Text>
          </View>
          <Text style={styles.headerTitle}>Other Verified Advocates</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0F2744']} />}
      >
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0F2744" />
            <Text style={{ color: '#64748b', marginTop: 12 }}>Loading advocates...</Text>
          </View>
        ) : lawyers.length > 0 ? (
          lawyers.map((lawyer) => {
            const user = lawyer.user || {};
            const initials = getInitials(user.name);
            return (
              <TouchableOpacity 
                key={lawyer.id} 
                style={styles.lawyerCard}
                onPress={() => handleLawyerPress(lawyer)}
              >
                <View style={[styles.avatarLarge, { backgroundColor: '#0F2744' }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.lawyerInfo}>
                  <Text style={styles.lawyerName}>{user.name || 'Advocate'}</Text>
                  <Text style={styles.lawyerSpec}>{lawyer.specialty || 'General Practice'} · SBC: {lawyer.sbc_number || '—'}</Text>
                  <View style={styles.ratingRow}>
                    <Text style={styles.ratingStar}>★</Text>
                    <Text style={styles.ratingText}>
                      {lawyer.rating || 'New'} ({lawyer.experience_years || 1} yrs exp)
                    </Text>
                  </View>
                  <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: '#4ade80' }]} />
                    <Text style={styles.statusText}>Verified Advocate</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={styles.emptyText}>No other advocates found.</Text>
          </View>
        )}
      </ScrollView>

      {/* Lawyer Profile Modal */}
      <Modal
        transparent={true}
        visible={showProfile}
        animationType="slide"
        onRequestClose={() => setShowProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => setShowProfile(false)}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

            {selectedLawyer && (
              <>
                <View style={[styles.modalAvatar, { backgroundColor: '#0F2744' }]}>
                  <Text style={styles.modalAvatarText}>{getInitials(selectedLawyer.user?.name)}</Text>
                </View>
                
                <Text style={styles.modalName}>{selectedLawyer.user?.name || 'Advocate'}</Text>
                <Text style={styles.modalSpec}>{selectedLawyer.specialty || 'General Practice'}</Text>
                
                <View style={styles.modalDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>District</Text>
                    <Text style={styles.detailValue}>{selectedLawyer.user?.district || selectedLawyer.district || 'Sindh'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>SBC License</Text>
                    <Text style={styles.detailValue}>{selectedLawyer.sbc_number || '—'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Experience</Text>
                    <Text style={styles.detailValue}>{selectedLawyer.experience_years || 1} years</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>{selectedLawyer.user?.email || '—'}</Text>
                  </View>
                  <View style={[styles.detailRow, styles.detailRowLast]}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <Text style={[styles.detailValue, { color: '#4ade80' }]}>Verified Active Advocate</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

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
              <Text style={[styles.navLabel, ids[idx] === 'profile' && styles.navLabelActive]}>{lbl}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}