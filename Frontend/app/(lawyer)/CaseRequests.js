import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './CaseRequests.styles';
import { useMockStore, caseRequests, declineRequest, acceptRequest } from './MockStore';

export default function CaseRequests() {
  useMockStore();
  const router = useRouter();

  const handleAccept = (id) => {
    Alert.alert(
      'Accept Case',
      'By accepting this case, you will be able to view the client\'s contact information and evidence.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept', 
          onPress: () => {
            acceptRequest(id);
            Alert.alert('Case Accepted', 'Case has been moved to Active Cases. Client contact and evidence are now visible.');
          }
        }
      ]
    );
  };

  const handleDecline = (id) => {
    Alert.alert(
      'Decline Request',
      'Are you sure you want to decline and delete this request?',
      [
        { text: 'Yes', onPress: () => {
            declineRequest(id);
            Alert.alert('Request Declined', 'The case request has been removed.');
          }
        },
        { text: 'No', style: 'cancel' }
      ]
    );
  };

  const handleViewCase = (id) => {
    router.push({
      pathname: '/(lawyer)/CaseDetail',
      params: { caseId: id }
    });
  };

  const handleNav = (lbl) => {
    if (lbl === 'home') router.push('/(lawyer)/LawyerHome');
    if (lbl === 'requests') router.push('/(lawyer)/CaseRequests');
    if (lbl === 'cases') router.push('/(lawyer)/MyCases');
    if (lbl === 'schedule') router.push('/(lawyer)/Schedule');
    if (lbl === 'profile') router.push('/(lawyer)/LawyerProfile');
  };

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
          <Text style={styles.headerTitle}>Case Requests</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {caseRequests.length > 0 ? (
          caseRequests.map((r, i) => (
            <View key={i} style={styles.reqCard}>
              <TouchableOpacity onPress={() => handleViewCase(r.id)}>
                <View style={styles.reqTop}>
                  <Text style={styles.reqName}>{r.name} - {r.spec}</Text>
                  <Text style={styles.badgeNew}>Pending</Text>
                </View>
                <Text style={styles.reqMeta}>Location: {r.location} · {r.time}</Text>
                
                <View style={styles.problemBox}>
                  <Text style={styles.problemLabel}>Problem Statement:</Text>
                  <Text style={styles.reqDesc}>{r.problemStatement || r.desc.substring(0, 80)}</Text>
                </View>
                
                {/* Note detailing that contact and evidence are hidden until acceptance */}
                <View style={styles.securedNotice}>
                  <Text style={styles.securedNoticeText}>
                    Contact and evidence are hidden until you accept this case.
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(r.id)}>
                  <Text style={styles.acceptText}>Accept Case</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineBtn} onPress={() => handleDecline(r.id)}>
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No pending requests.</Text>
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