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
import { useAdminStore } from './AdminStore';

export default function AdminDashboard() {
  const router = useRouter();
  const { state, approveLawyer, rejectLawyer, resolveDispute } = useAdminStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  const pendingLawyersList = state.lawyers.filter((l) => l.status === 'Pending');
  const openDisputesList = state.disputes.filter((d) => d.status === 'Open');

  const handleNav = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'verification') router.push('/(Admin)/VerificationQueue');
    if (tabId === 'users') router.push('/(Admin)/UserManagement');
    if (tabId === 'disputes') router.push('/(Admin)/CasesDisputes');
    if (tabId === 'settings') router.push('/(Admin)/SystemSettings');
  };

  const handleRoleSelect = () => {
    router.replace('/RoleSelectScreen');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#120424" />

      {/* TOP HEADER */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandEmoji}>🛡️</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>Barq-e-Insaf ⚡</Text>
            <Text style={styles.brandSub}>Super Admin Control Panel</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.roleSelectBtn} onPress={handleRoleSelect}>
            <Text style={styles.roleSelectBtnText}>Switch Role</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              Alert.alert('Logged Out', 'Returned to Role Selection', [
                { text: 'OK', onPress: () => router.replace('/RoleSelectScreen') },
              ]);
            }}
          >
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODULE NAVIGATION TABS */}
      <View style={styles.navBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navScroll}>
          <TouchableOpacity
            style={[styles.navTab, activeTab === 'dashboard' && styles.navTabActive]}
            onPress={() => setActiveTab('dashboard')}
          >
            <Text style={[styles.navTabText, activeTab === 'dashboard' && styles.navTabTextActive]}>
              📊 Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navTab, activeTab === 'verification' && styles.navTabActive]}
            onPress={() => handleNav('verification')}
          >
            <Text style={[styles.navTabText, activeTab === 'verification' && styles.navTabTextActive]}>
              ⚖️ Verifications ({pendingLawyersList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navTab, activeTab === 'users' && styles.navTabActive]}
            onPress={() => handleNav('users')}
          >
            <Text style={[styles.navTabText, activeTab === 'users' && styles.navTabTextActive]}>
              👥 User Management
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navTab, activeTab === 'disputes' && styles.navTabActive]}
            onPress={() => handleNav('disputes')}
          >
            <Text style={[styles.navTabText, activeTab === 'disputes' && styles.navTabTextActive]}>
              🚨 Cases & Disputes ({openDisputesList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navTab, activeTab === 'settings' && styles.navTabActive]}
            onPress={() => handleNav('settings')}
          >
            <Text style={[styles.navTabText, activeTab === 'settings' && styles.navTabTextActive]}>
              ⚙️ System Settings
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* MAIN DASHBOARD CONTENT */}
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        {/* WELCOME BANNER */}
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeTextGroup}>
            <Text style={styles.welcomeTitle}>Welcome back, Super Admin 👋</Text>
            <Text style={styles.welcomeSub}>
              Sindh Legal Platform Overview — All Services Operational
            </Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.greenDot} />
            <Text style={styles.statusPillText}>System Live</Text>
          </View>
        </View>

        {/* KPI METRICS GRID */}
        <Text style={styles.sectionHeader}>PLATFORM METRICS</Text>
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { borderLeftColor: '#3b82f6' }]}>
            <Text style={styles.kpiValue}>{state.kpi.totalUsers.toLocaleString()}</Text>
            <Text style={styles.kpiLabel}>Total Citizens & Users</Text>
            <Text style={styles.kpiSub}>+142 this week</Text>
          </View>

          <View style={[styles.kpiCard, { borderLeftColor: '#f59e0b' }]}>
            <Text style={styles.kpiValue}>{state.kpi.totalLawyers}</Text>
            <Text style={styles.kpiLabel}>Total Lawyers Registered</Text>
            <Text style={styles.kpiSub}>{state.kpi.pendingLawyers} Pending Review</Text>
          </View>

          <View style={[styles.kpiCard, { borderLeftColor: '#10b981' }]}>
            <Text style={styles.kpiValue}>{state.kpi.verifiedLawyers}</Text>
            <Text style={styles.kpiLabel}>Verified Lawyers</Text>
            <Text style={[styles.kpiSub, { color: '#10b981' }]}>76% Verification Rate</Text>
          </View>

          <View style={[styles.kpiCard, { borderLeftColor: '#8b5cf6' }]}>
            <Text style={styles.kpiValue}>{state.kpi.activeCases.toLocaleString()}</Text>
            <Text style={styles.kpiLabel}>Active Legal Cases</Text>
            <Text style={styles.kpiSub}>Across 28 Districts</Text>
          </View>

          <View style={[styles.kpiCard, { borderLeftColor: '#06b6d4' }]}>
            <Text style={styles.kpiValue}>{state.kpi.completedCases.toLocaleString()}</Text>
            <Text style={styles.kpiLabel}>Cases Resolved</Text>
            <Text style={[styles.kpiSub, { color: '#06b6d4' }]}>+156 this month</Text>
          </View>

          <View style={[styles.kpiCard, { borderLeftColor: '#ef4444' }]}>
            <Text style={[styles.kpiValue, { color: '#ef4444' }]}>{state.kpi.openDisputes}</Text>
            <Text style={styles.kpiLabel}>Open Disputes</Text>
            <Text style={[styles.kpiSub, { color: '#ef4444' }]}>Requires Review</Text>
          </View>
        </View>

        {/* NEEDS ATTENTION SECTION */}
        <View style={styles.alertCard}>
          <View style={styles.alertCardHeader}>
            <Text style={styles.alertCardTitle}>🚨 Needs Immediate Attention</Text>
            <Text style={styles.alertCardSub}>Review pending verification requests and open disputes</Text>
          </View>

          <View style={styles.alertActionsRow}>
            <TouchableOpacity
              style={styles.alertBtn}
              onPress={() => router.push('/(Admin)/VerificationQueue')}
            >
              <View style={styles.alertBtnBadge}>
                <Text style={styles.alertBtnBadgeText}>{pendingLawyersList.length}</Text>
              </View>
              <Text style={styles.alertBtnText}>Lawyer Verifications Awaiting</Text>
              <Text style={styles.arrowText}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.alertBtn}
              onPress={() => router.push('/(Admin)/CasesDisputes')}
            >
              <View style={[styles.alertBtnBadge, { backgroundColor: '#ef4444' }]}>
                <Text style={styles.alertBtnBadgeText}>{openDisputesList.length}</Text>
              </View>
              <Text style={styles.alertBtnText}>Open Client-Lawyer Disputes</Text>
              <Text style={styles.arrowText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LAWYER VERIFICATION QUEUE PREVIEW */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>⚖️ Lawyer Verification Queue</Text>
            <TouchableOpacity onPress={() => router.push('/(Admin)/VerificationQueue')}>
              <Text style={styles.linkText}>View All ({state.lawyers.length}) →</Text>
            </TouchableOpacity>
          </View>

          {pendingLawyersList.length === 0 ? (
            <Text style={styles.emptyText}>✓ All lawyer applications processed!</Text>
          ) : (
            pendingLawyersList.map((lawyer) => (
              <View key={lawyer.id} style={styles.queueItem}>
                <View style={styles.queueItemInfo}>
                  <Text style={styles.lawyerName}>{lawyer.name}</Text>
                  <Text style={styles.lawyerMeta}>
                    License: {lawyer.sbcNumber} · {lawyer.specialty} · {lawyer.district}
                  </Text>
                  <Text style={styles.lawyerDocs}>
                    CNIC: {lawyer.cnic} | Submitted: {lawyer.submittedAt}
                  </Text>
                </View>

                <View style={styles.queueItemActions}>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => {
                      approveLawyer(lawyer.id);
                      Alert.alert('Approved', `${lawyer.name} verified successfully!`);
                    }}
                  >
                    <Text style={styles.approveBtnText}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => {
                      rejectLawyer(lawyer.id);
                      Alert.alert('Rejected', `${lawyer.name} application rejected.`);
                    }}
                  >
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* SINDH DISTRICT BREAKDOWN */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📍 Sindh District Coverage & Activity</Text>
          <View style={styles.districtGrid}>
            {[
              { district: 'Karachi South', cases: '342 Active', lawyers: '84 Verified' },
              { district: 'Hyderabad', cases: '189 Active', lawyers: '46 Verified' },
              { district: 'Sukkur', cases: '124 Active', lawyers: '32 Verified' },
              { district: 'Larkana', cases: '98 Active', lawyers: '24 Verified' },
              { district: 'Mirpur Khas', cases: '76 Active', lawyers: '18 Verified' },
              { district: 'Shaheed Benazirabad', cases: '61 Active', lawyers: '14 Verified' },
            ].map((item) => (
              <View key={item.district} style={styles.districtCard}>
                <Text style={styles.districtName}>{item.district}</Text>
                <Text style={styles.districtMeta}>{item.cases}</Text>
                <Text style={styles.districtLawyers}>{item.lawyers}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* RECENT AUDIT LOGS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📜 Recent Platform Audit Activity</Text>
          {state.auditLogs.slice(0, 5).map((log) => (
            <View key={log.id} style={styles.auditRow}>
              <View style={styles.auditDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.auditActor}>{log.actor}</Text>
                <Text style={styles.auditAction}>{log.action} — <Text style={styles.auditEntity}>{log.entity}</Text></Text>
              </View>
              <Text style={styles.auditTime}>{log.timestamp}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0d041a',
  },
  topHeader: {
    backgroundColor: '#16072b',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#2b104a',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#2b104a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandEmoji: {
    fontSize: 20,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  brandSub: {
    fontSize: 10,
    color: '#a78bfa',
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleSelectBtn: {
    backgroundColor: 'rgba(167,139,250,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.3)',
  },
  roleSelectBtnText: {
    fontSize: 11,
    color: '#c4b5fd',
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutBtnText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '800',
  },
  navBar: {
    backgroundColor: '#120424',
    borderBottomWidth: 1,
    borderBottomColor: '#230a3f',
  },
  navScroll: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  navTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1b0833',
  },
  navTabActive: {
    backgroundColor: '#3b0764',
    borderWidth: 1,
    borderColor: '#a78bfa',
  },
  navTabText: {
    fontSize: 12,
    color: '#a0aec0',
    fontWeight: '600',
  },
  navTabTextActive: {
    color: '#fff',
    fontWeight: '800',
  },
  scrollBody: {
    flex: 1,
    backgroundColor: '#090214',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  welcomeBanner: {
    backgroundColor: '#1e0938',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b126b',
  },
  welcomeTextGroup: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
  },
  welcomeSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8b5cf6',
    letterSpacing: 1,
    marginTop: 4,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: '#15062b',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#260c48',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#e2e8f0',
    fontWeight: '700',
    marginTop: 4,
  },
  kpiSub: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '500',
  },
  alertCard: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 16,
    padding: 16,
  },
  alertCardHeader: {
    marginBottom: 12,
  },
  alertCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f87171',
  },
  alertCardSub: {
    fontSize: 11,
    color: '#cbd5e1',
    marginTop: 2,
  },
  alertActionsRow: {
    gap: 8,
  },
  alertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0833',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#34105e',
  },
  alertBtnBadge: {
    backgroundColor: '#f59e0b',
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  alertBtnBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  alertBtnText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  arrowText: {
    fontSize: 14,
    color: '#c4b5fd',
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#15062b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#260c48',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
  },
  linkText: {
    fontSize: 11,
    color: '#a78bfa',
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    paddingVertical: 10,
  },
  queueItem: {
    backgroundColor: '#1f093d',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#371269',
  },
  queueItemInfo: {
    marginBottom: 8,
  },
  lawyerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
  lawyerMeta: {
    fontSize: 11,
    color: '#c4b5fd',
    marginTop: 2,
  },
  lawyerDocs: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  queueItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: 'rgba(239,68,68,0.2)',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  rejectBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#f87171',
  },
  districtGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  districtCard: {
    width: '48%',
    backgroundColor: '#1e0938',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#34105e',
  },
  districtName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
  districtMeta: {
    fontSize: 10,
    color: '#a78bfa',
    marginTop: 2,
  },
  districtLawyers: {
    fontSize: 10,
    color: '#10b981',
    marginTop: 1,
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#230a3f',
  },
  auditDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#a78bfa',
  },
  auditActor: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  auditAction: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  auditEntity: {
    color: '#c4b5fd',
    fontWeight: '700',
  },
  auditTime: {
    fontSize: 10,
    color: '#64748b',
  },
});
