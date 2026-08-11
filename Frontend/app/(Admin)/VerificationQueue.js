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
} from 'react-native';
import { useRouter } from 'expo-router';
import AdminSidebar from './AdminSidebar';
import { useAdminStore } from './AdminStore';

export default function VerificationQueue() {
  const router = useRouter();
  const { state, approveLawyer, rejectLawyer } = useAdminStore();
  const [filter, setFilter] = useState('Pending');

  const filteredLawyers = state.lawyers.filter((l) => {
    if (filter === 'All') return true;
    return l.status === filter;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="queue" />

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>⏳ Lawyer Verification Queue</Text>
            <Text style={styles.headerSub}>Verify Sindh Bar Council advocates, inspect licenses & approving platform credentials</Text>
          </View>

          {/* FILTER TABS */}
          <View style={styles.filterTabs}>
            {['Pending', 'Approved', 'Rejected', 'All'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[styles.filterTab, filter === status && styles.filterTabActive]}
                onPress={() => setFilter(status)}
              >
                <Text style={[styles.filterTabText, filter === status && styles.filterTabTextActive]}>
                  {status} ({state.lawyers.filter((l) => status === 'All' ? true : l.status === status).length})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* LAWYER QUEUE LIST */}
          <View style={styles.queueList}>
            {filteredLawyers.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No lawyers found in this verification status.</Text>
              </View>
            ) : (
              filteredLawyers.map((lawyer) => (
                <View key={lawyer.id} style={styles.lawyerCard}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.lawyerName}>{lawyer.name}</Text>
                      <Text style={styles.sbcText}>SBC License: {lawyer.sbcNumber}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusTag,
                        lawyer.status === 'Approved' && styles.statusApproved,
                        lawyer.status === 'Rejected' && styles.statusRejected,
                        lawyer.status === 'Pending' && styles.statusPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusTagText,
                          lawyer.status === 'Approved' && styles.statusApprovedText,
                          lawyer.status === 'Rejected' && styles.statusRejectedText,
                          lawyer.status === 'Pending' && styles.statusPendingText,
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
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  layoutRow: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentPadding: {
    padding: 24,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterTabActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  queueList: {
    gap: 16,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
  },
  lawyerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  lawyerName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  sbcText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '700',
    marginTop: 2,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusApproved: {
    backgroundColor: '#dcfce7',
  },
  statusRejected: {
    backgroundColor: '#fee2e2',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusApprovedText: {
    color: '#15803d',
  },
  statusRejectedText: {
    color: '#b91c1c',
  },
  statusPendingText: {
    color: '#b45309',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  detailCol: {
    minWidth: 140,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 2,
  },
  docsSection: {
    marginBottom: 16,
  },
  docsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
  },
  docsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  docChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  docChipText: {
    fontSize: 11,
    color: '#0f172a',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  approveBtn: {
    flex: 1,
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  approveBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  rejectBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
