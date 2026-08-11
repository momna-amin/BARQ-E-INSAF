import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAdminStore } from './AdminStore';

export default function VerificationQueue() {
  const router = useRouter();
  const { state, approveLawyer, rejectLawyer } = useAdminStore();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredLawyers = state.lawyers.filter((l) => {
    const matchesFilter = filter === 'All' ? true : l.status === filter;
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.sbcNumber.toLowerCase().includes(search.toLowerCase()) ||
      l.district.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#120424" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back to Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚖️ Lawyer Verification Queue</Text>
        <Text style={styles.headerSub}>Verify Sindh Bar Council (SBC) credentials & documents</Text>
      </View>

      {/* SEARCH & FILTERS */}
      <View style={styles.filterSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by lawyer name, SBC number or district..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filterTabs}>
          {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterTab, filter === tab && styles.filterTabActive]}
              onPress={() => setFilter(tab)}
            >
              <Text style={[styles.filterTabText, filter === tab && styles.filterTabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* LAWYER LIST */}
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        {filteredLawyers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No lawyer verifications found</Text>
            <Text style={styles.emptySub}>Try searching with a different name or status filter.</Text>
          </View>
        ) : (
          filteredLawyers.map((lawyer) => (
            <View key={lawyer.id} style={styles.lawyerCard}>
              <View style={styles.lawyerCardHeader}>
                <View>
                  <Text style={styles.lawyerName}>{lawyer.name}</Text>
                  <Text style={styles.sbcText}>SBC License: {lawyer.sbcNumber}</Text>
                </View>
                <View
                  style={[
                    styles.statusTag,
                    lawyer.status === 'Approved' && styles.statusApproved,
                    lawyer.status === 'Rejected' && styles.statusRejected,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusTagText,
                      lawyer.status === 'Approved' && styles.statusApprovedText,
                      lawyer.status === 'Rejected' && styles.statusRejectedText,
                    ]}
                  >
                    {lawyer.status}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailCol}>
                  <Text style={styles.detailLabel}>District</Text>
                  <Text style={styles.detailValue}>{lawyer.district}</Text>
                </View>

                <View style={styles.detailCol}>
                  <Text style={styles.detailLabel}>Specialty</Text>
                  <Text style={styles.detailValue}>{lawyer.specialty}</Text>
                </View>

                <View style={styles.detailCol}>
                  <Text style={styles.detailLabel}>Experience</Text>
                  <Text style={styles.detailValue}>{lawyer.experience}</Text>
                </View>

                <View style={styles.detailCol}>
                  <Text style={styles.detailLabel}>CNIC Number</Text>
                  <Text style={styles.detailValue}>{lawyer.cnic}</Text>
                </View>
              </View>

              <View style={styles.docsSection}>
                <Text style={styles.docsTitle}>Attached Verification Documents:</Text>
                <View style={styles.docsRow}>
                  {lawyer.documents.map((doc, idx) => (
                    <View key={idx} style={styles.docChip}>
                      <Text style={styles.docChipText}>📄 {doc}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {lawyer.status === 'Pending' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => {
                      approveLawyer(lawyer.id);
                      Alert.alert('Success', `${lawyer.name} has been verified and granted lawyer access!`);
                    }}
                  >
                    <Text style={styles.approveBtnText}>✓ Verify & Approve Lawyer</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => {
                      rejectLawyer(lawyer.id);
                      Alert.alert('Rejected', `${lawyer.name}'s verification request has been rejected.`);
                    }}
                  >
                    <Text style={styles.rejectBtnText}>✕ Reject Application</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d041a' },
  header: { backgroundColor: '#16072b', padding: 18, borderBottomWidth: 1, borderBottomColor: '#2b104a' },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 12, color: '#a78bfa', fontWeight: '700' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  filterSection: { padding: 16, backgroundColor: '#120424', gap: 12 },
  searchInput: { backgroundColor: '#1e0938', borderWidth: 1, borderColor: '#34105e', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, color: '#fff', fontSize: 13 },
  filterTabs: { flexDirection: 'row', gap: 8 },
  filterTab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#1b0833' },
  filterTabActive: { backgroundColor: '#3b0764', borderWidth: 1, borderColor: '#a78bfa' },
  filterTabText: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  filterTabTextActive: { color: '#fff', fontWeight: '800' },
  scrollBody: { flex: 1, backgroundColor: '#090214' },
  scrollContent: { padding: 16, gap: 14 },
  emptyCard: { padding: 30, alignItems: 'center', backgroundColor: '#15062b', borderRadius: 16 },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: '#fff' },
  emptySub: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  lawyerCard: { backgroundColor: '#15062b', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#260c48' },
  lawyerCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  lawyerName: { fontSize: 15, fontWeight: '800', color: '#fff' },
  sbcText: { fontSize: 12, color: '#c4b5fd', fontWeight: '700', marginTop: 2 },
  statusTag: { backgroundColor: 'rgba(245,158,11,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#f59e0b' },
  statusTagText: { fontSize: 10, fontWeight: '800', color: '#f59e0b' },
  statusApproved: { backgroundColor: 'rgba(16,185,129,0.15)', borderColor: '#10b981' },
  statusApprovedText: { color: '#10b981' },
  statusRejected: { backgroundColor: 'rgba(239,68,68,0.15)', borderColor: '#ef4444' },
  statusRejectedText: { color: '#f87171' },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12, backgroundColor: '#1c0836', padding: 12, borderRadius: 10 },
  detailCol: { width: '46%' },
  detailLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' },
  detailValue: { fontSize: 12, color: '#fff', fontWeight: '600', marginTop: 2 },
  docsSection: { marginBottom: 12 },
  docsTitle: { fontSize: 11, color: '#c4b5fd', fontWeight: '700', marginBottom: 6 },
  docsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  docChip: { backgroundColor: '#260c48', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  docChipText: { fontSize: 10, color: '#cbd5e1', fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  approveBtn: { flex: 1, backgroundColor: '#10b981', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  approveBtnText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  rejectBtn: { flex: 1, backgroundColor: 'rgba(239,68,68,0.2)', borderWidth: 1, borderColor: '#ef4444', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  rejectBtnText: { fontSize: 12, fontWeight: '800', color: '#f87171' },
});
