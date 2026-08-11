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

export default function AdminDashboard() {
  const router = useRouter();
  const { state, approveLawyer, rejectLawyer } = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingLawyersList = state.lawyers.filter((l) => l.status === 'Pending');
  const openDisputesList = state.disputes.filter((d) => d.status === 'Open');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.layoutRow}>
        {/* RESPONSIVE TOGGLEABLE SIDE PANEL */}
        <AdminSidebar
          activeRoute="dashboard"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* MAIN DASHBOARD CONTENT */}
        <ScrollView style={styles.mainScroll} contentContainerStyle={styles.contentPadding}>
          {/* TOP HEADER BAR WITH ☰ HAMBURGER BUTTON */}
          <View style={styles.headerBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 54 }}>
              <View>
                <Text style={styles.welcomeTitle}>Welcome back, Super Admin 👋</Text>
                <Text style={styles.welcomeSub}>Sindh Legal Access Platform Overview — All Services Operational</Text>
              </View>
            </View>
            <View style={styles.systemStatusPill}>
              <Text style={styles.systemStatusText}>● System Live (Vercel & Supabase)</Text>
            </View>
          </View>

          {/* KPI METRICS GRID */}
          <Text style={styles.sectionHeader}>PLATFORM METRICS</Text>
          <View style={styles.kpiGrid}>
            <TouchableOpacity style={[styles.kpiCard, { borderTopColor: '#2563eb' }]} onPress={() => router.push('/(Admin)/UserManagement')}>
              <Text style={styles.kpiValue}>1,420</Text>
              <Text style={styles.kpiLabel}>Total Citizens & Users</Text>
              <Text style={styles.kpiSub}>+142 this week</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.kpiCard, { borderTopColor: '#d97706' }]} onPress={() => router.push('/(Admin)/LawyerManagement')}>
              <Text style={styles.kpiValue}>340</Text>
              <Text style={styles.kpiLabel}>Total Lawyers Registered</Text>
              <Text style={[styles.kpiSub, { color: '#d97706' }]}>{pendingLawyersList.length} Pending Review</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.kpiCard, { borderTopColor: '#16a34a' }]} onPress={() => router.push('/(Admin)/VerificationQueue')}>
              <Text style={styles.kpiValue}>258</Text>
              <Text style={styles.kpiLabel}>Verified Lawyers</Text>
              <Text style={[styles.kpiSub, { color: '#16a34a' }]}>76% Verification Rate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.kpiCard, { borderTopColor: '#9333ea' }]} onPress={() => router.push('/(Admin)/CasesDisputes')}>
              <Text style={styles.kpiValue}>890</Text>
              <Text style={styles.kpiLabel}>Active Legal Cases</Text>
              <Text style={styles.kpiSub}>Across 28 Districts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.kpiCard, { borderTopColor: '#059669' }]} onPress={() => router.push('/(Admin)/CasesDisputes')}>
              <Text style={styles.kpiValue}>1,240</Text>
              <Text style={styles.kpiLabel}>Cases Resolved</Text>
              <Text style={[styles.kpiSub, { color: '#059669' }]}>+156 this month</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.kpiCard, { borderTopColor: '#dc2626' }]} onPress={() => router.push('/(Admin)/CasesDisputes')}>
              <Text style={styles.kpiValue}>{openDisputesList.length}</Text>
              <Text style={styles.kpiLabel}>Open Disputes</Text>
              <Text style={[styles.kpiSub, { color: '#dc2626' }]}>Requires Review</Text>
            </TouchableOpacity>
          </View>

          {/* IMMEDIATE ATTENTION SECTION */}
          <Text style={styles.sectionHeader}>🚨 NEEDS IMMEDIATE ATTENTION</Text>

          <View style={styles.attentionGrid}>
            {/* PENDING VERIFICATIONS */}
            <View style={styles.attentionCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>⚖️ Pending Lawyer Verifications ({pendingLawyersList.length})</Text>
                <TouchableOpacity onPress={() => router.push('/(Admin)/VerificationQueue')}>
                  <Text style={styles.viewAllText}>View All →</Text>
                </TouchableOpacity>
              </View>

              {pendingLawyersList.length === 0 ? (
                <Text style={styles.emptyText}>No pending verifications at this time.</Text>
              ) : (
                pendingLawyersList.slice(0, 3).map((lawyer) => (
                  <View key={lawyer.id} style={styles.itemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{lawyer.name}</Text>
                      <Text style={styles.itemSub}>SBC: {lawyer.sbcNumber} · {lawyer.district}</Text>
                    </View>
                    <View style={styles.btnGroup}>
                      <TouchableOpacity style={styles.btnApprove} onPress={() => approveLawyer(lawyer.id)}>
                        <Text style={styles.btnText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.btnReject} onPress={() => rejectLawyer(lawyer.id)}>
                        <Text style={styles.btnText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* OPEN DISPUTES */}
            <View style={styles.attentionCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>⚠️ Open Disputes ({openDisputesList.length})</Text>
                <TouchableOpacity onPress={() => router.push('/(Admin)/CasesDisputes')}>
                  <Text style={styles.viewAllText}>View All →</Text>
                </TouchableOpacity>
              </View>

              {openDisputesList.length === 0 ? (
                <Text style={styles.emptyText}>No open disputes requiring intervention.</Text>
              ) : (
                openDisputesList.slice(0, 3).map((dispute) => (
                  <View key={dispute.id} style={styles.itemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{dispute.caseId} — {dispute.issue}</Text>
                      <Text style={styles.itemSub}>Client: {dispute.citizen} · {dispute.district}</Text>
                    </View>
                    <TouchableOpacity style={styles.btnResolve} onPress={() => router.push('/(Admin)/CasesDisputes')}>
                      <Text style={styles.btnText}>Review</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  layoutRow: {
    flex: 1,
    flexDirection: 'row',
  },
  mainScroll: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentPadding: {
    padding: 24,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  hamburgerBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerIcon: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  welcomeSub: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  systemStatusPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  systemStatusText: {
    color: '#15803d',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 14,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 28,
  },
  kpiCard: {
    flex: 1,
    minWidth: 170,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderTopWidth: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  kpiValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 4,
  },
  kpiSub: {
    fontSize: 11,
    color: '#2563eb',
    marginTop: 4,
    fontWeight: '600',
  },
  attentionGrid: {
    gap: 16,
  },
  attentionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  viewAllText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  itemSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  btnApprove: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnReject: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnResolve: {
    backgroundColor: '#d97706',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
