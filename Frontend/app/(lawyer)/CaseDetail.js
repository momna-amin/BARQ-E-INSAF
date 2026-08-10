import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Alert 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMockStore, activeCases, caseRequests } from './MockStore';

export default function CaseDetail() {
  useMockStore();
  const router = useRouter();
  const params = useLocalSearchParams();
  const caseId = params.caseId;
  
  // Find case in active cases
  const activeCase = activeCases.find(c => c.id === caseId);
  const requestCase = caseRequests.find(c => c.id === caseId);
  
  const caseData = activeCase || requestCase;

  const handleContactClient = () => {
    if (caseData.contact) {
      Alert.alert('Contact Client', `Phone: ${caseData.contact}`);
    } else {
      Alert.alert('Contact Hidden', 'Accept the case request to view client contact information.');
    }
  };

  const handleViewEvidence = () => {
    if (caseData.evidence && caseData.evidence.length > 0) {
      Alert.alert('Evidence', caseData.evidence.join('\n'));
    } else {
      Alert.alert('No Evidence', 'No evidence has been uploaded for this case.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Case Details</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Case Information</Text>
          <Text style={styles.detailText}>Case: {caseData?.title || caseData?.name}</Text>
          <Text style={styles.detailText}>Client: {caseData?.clientName || caseData?.name}</Text>
          <Text style={styles.detailText}>Type: {caseData?.spec || 'Active Case'}</Text>
          {caseData?.court && (
            <Text style={styles.detailText}>Court: {caseData.court}</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Problem Statement</Text>
          <Text style={styles.descriptionText}>{caseData?.problemStatement || caseData?.desc || caseData?.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Contact Information</Text>
          {caseData?.contact ? (
            <TouchableOpacity style={styles.contactBtn} onPress={handleContactClient}>
              <Text style={styles.contactBtnText}>View Client Contact</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.securedNotice}>
              <Text style={styles.securedNoticeText}>
                Client contact is hidden. Accept the case request to view contact details.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Evidence</Text>
          {caseData?.evidence && caseData.evidence.length > 0 ? (
            <TouchableOpacity style={styles.evidenceBtn} onPress={handleViewEvidence}>
              <Text style={styles.evidenceBtnText}>View Evidence ({caseData.evidence.length} files)</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.securedNotice}>
              <Text style={styles.securedNoticeText}>
                Evidence is hidden until you accept the case request.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F2744' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: { marginRight: 16 },
  backText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  scroll: { flex: 1, backgroundColor: '#F5F3EF' },
  scrollContent: { padding: 20, gap: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    elevation: 3,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F2744',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  contactBtn: {
    backgroundColor: '#0F2744',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  contactBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  evidenceBtn: {
    backgroundColor: '#1B4332',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  evidenceBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  securedNotice: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
  },
  securedNoticeText: {
    fontSize: 12,
    color: '#92400e',
    textAlign: 'center',
  },
});