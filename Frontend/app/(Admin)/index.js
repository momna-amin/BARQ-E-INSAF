import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, StyleSheet, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Total Lawyers',       value: '284',   delta: '+12 pending',    color: '#5C1A1A', icon: '⚖️' },
  { label: 'Verified Lawyers',    value: '217',   delta: '76% verified',   color: '#0F2744', icon: '✅' },
  { label: 'Pending Verifications', value: '12', delta: 'Needs review',    color: '#92400e', icon: '⏳' },
  { label: 'Total Citizens',      value: '2,841', delta: '+142 this week', color: '#1B4332', icon: '👥' },
  { label: 'Total NGOs',          value: '38',    delta: '5 pending',      color: '#1e40af', icon: '🏢' },
  { label: 'Active Cases',        value: '1,094', delta: '+88 this month', color: '#166534', icon: '📁' },
  { label: 'Resolved Cases',      value: '3,220', delta: 'All time',       color: '#1A0533', icon: '✔️' },
  { label: 'Pending Cases',       value: '204',   delta: 'Needs action',   color: '#7c3aed', icon: '🕐' },
  { label: 'Total Appointments',  value: '540',   delta: '+32 this week',  color: '#0e7490', icon: '📅' },
  { label: 'Monthly Registrations', value: '142', delta: 'June 2025',      color: '#065f46', icon: '📈' },
];

const RECENT_ACTIVITIES = [
  { color: '#4ade80', title: 'Lawyer #L-0218 Verified',      sub: '10 mins ago · Auto-matched SBC',     icon: '✅' },
  { color: '#ef4444', title: 'User Report Filed',            sub: '32 mins ago · Awaiting review',       icon: '🚩' },
  { color: '#3b82f6', title: 'New Case Filed — Karachi',     sub: '1 hour ago · Property dispute',       icon: '📁' },
  { color: '#f59e0b', title: 'NGO "Justice For All" Applied', sub: '2 hours ago · Verification pending', icon: '🏢' },
  { color: '#a78bfa', title: 'Citizen Sara Malik Registered', sub: '3 hours ago · Karachi',              icon: '👤' },
];

const LATEST_COMPLAINTS = [
  { id: 'CMP-201', citizen: 'Muhammad Usman', type: 'Property Dispute',  status: 'Active',   time: '1h ago' },
  { id: 'CMP-202', citizen: 'Fatima Zahra',  type: 'Family Matter',      status: 'Pending',  time: '3h ago' },
  { id: 'CMP-203', citizen: 'Rizwan Akhtar', type: 'Criminal Defense',   status: 'Resolved', time: '5h ago' },
];

const LATEST_APPOINTMENTS = [
  { id: 'APT-101', citizen: 'Ayesha Siddiqui', lawyer: 'Ali Hassan',    date: 'Today 3:00 PM',    status: 'Confirmed' },
  { id: 'APT-102', citizen: 'Kamran Mirza',     lawyer: 'Nadia Memon',   date: 'Today 5:30 PM',    status: 'Pending'   },
  { id: 'APT-103', citizen: 'Sara Malik',        lawyer: 'Tariq Shah',    date: 'Tomorrow 11:00 AM', status: 'Confirmed' },
];

const NOTIFICATIONS = [
  { type: 'red',    text: '5 flagged reports need immediate review',     time: '5m ago'  },
  { type: 'amber',  text: '3 NGO applications pending verification',     time: '1h ago'  },
  { type: 'blue',   text: 'System uptime 98.2% — last 30 days',         time: '2h ago'  },
  { type: 'green',  text: '12 lawyers approved this week',               time: '3h ago'  },
];

const BOTTOM_NAV = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'users',     icon: '👥', label: 'Users'     },
  { id: 'lawyers',   icon: '⚖️', label: 'Lawyers'   },
  { id: 'reports',   icon: '🚩', label: 'Reports'   },
  { id: 'settings',  icon: '⚙️', label: 'Settings'  },
];

const notifColors = {
  red:   { bg: '#fee2e2', dot: '#ef4444', text: '#991b1b' },
  amber: { bg: '#fef3c7', dot: '#f59e0b', text: '#92400e' },
  blue:  { bg: '#dbeafe', dot: '#3b82f6', text: '#1e40af' },
  green: { bg: '#dcfce7', dot: '#22c55e', text: '#166534' },
};

const cmpColors = {
  Active:   { bg: '#dcfce7', text: '#166534' },
  Pending:  { bg: '#fef3c7', text: '#92400e' },
  Resolved: { bg: '#f3f4f6', text: '#374151' },
};

const aptColors = {
  Confirmed: { bg: '#dbeafe', text: '#1e40af' },
  Pending:   { bg: '#fef3c7', text: '#92400e' },
};

export default function AdminHome() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('dashboard');

  const goTo = (screen) => router.push(`/(Admin)/${screen}`);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0533" />

      {/* HEADER */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Barq-e-Insaf ⚡</Text>
          <Text style={s.headerSub}>Admin Control Panel</Text>
        </View>
        <View style={s.headerRight}>
          <View style={s.liveDot} />
          <Text style={s.liveText}>Live</Text>
          <View style={s.avatar}><Text style={s.avatarText}>AD</Text></View>
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ALERT BADGES */}
        <View style={s.alertRow}>
          <View style={[s.alertBadge, { backgroundColor: '#fee2e2' }]}>
            <Text style={[s.alertText, { color: '#991b1b' }]}>5 Flagged</Text>
          </View>
          <View style={[s.alertBadge, { backgroundColor: '#fef3c7' }]}>
            <Text style={[s.alertText, { color: '#92400e' }]}>12 Pending</Text>
          </View>
          <View style={[s.alertBadge, { backgroundColor: '#dbeafe' }]}>
            <Text style={[s.alertText, { color: '#1e40af' }]}>3 NGOs</Text>
          </View>
        </View>

        {/* ── STATS GRID ── */}
        <Text style={s.secTitle}>📊 Dashboard Overview</Text>
        <View style={s.statsGrid}>
          {STATS.map((st, i) => (
            <View key={i} style={s.statCard}>
              <View style={[s.statAccent, { backgroundColor: st.color }]} />
              <Text style={s.statIcon}>{st.icon}</Text>
              <Text style={s.statValue}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
              <Text style={s.statDelta}>{st.delta}</Text>
            </View>
          ))}
        </View>

        {/* ── QUICK ACTIONS ── */}
        <Text style={s.secTitle}>⚡ Quick Actions</Text>
        <View style={s.quickGrid}>
          {[
            { icon: '⚖️', label: 'Lawyer Management',  sub: 'Verify & manage',  screen: 'LawyerManagement',  color: '#5C1A1A' },
            { icon: '👥', label: 'Citizen Management', sub: 'View & manage',    screen: 'CitizenManagement', color: '#1B4332' },
            { icon: '🏢', label: 'NGO Management',     sub: 'Verify & manage',  screen: 'NGOManagement',     color: '#1e40af' },
            { icon: '🚩', label: 'Reports Queue',      sub: 'Review flags',     screen: null,                color: '#92400e' },
            { icon: '🗃️', label: 'Legal Database',     sub: 'Update laws',      screen: null,                color: '#0e7490' },
            { icon: '⚙️', label: 'System Config',      sub: 'App settings',     screen: null,                color: '#7c3aed' },
          ].map((item, i) => (
            <TouchableOpacity
              key={i} style={s.quickCard}
              onPress={() => item.screen && goTo(item.screen)}
            >
              <View style={[s.quickIconBox, { backgroundColor: item.color + '18' }]}>
                <Text style={s.quickIcon}>{item.icon}</Text>
              </View>
              <Text style={s.quickLabel}>{item.label}</Text>
              <Text style={s.quickSub}>{item.sub}</Text>
              <Text style={[s.quickArrow, { color: item.color }]}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── NOTIFICATIONS ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>🔔 Notifications</Text>
          {NOTIFICATIONS.map((n, i) => {
            const c = notifColors[n.type];
            return (
              <View key={i} style={[s.notifRow, { backgroundColor: c.bg }]}>
                <View style={[s.notifDot, { backgroundColor: c.dot }]} />
                <Text style={[s.notifText, { color: c.text, flex: 1 }]}>{n.text}</Text>
                <Text style={[s.notifTime, { color: c.text }]}>{n.time}</Text>
              </View>
            );
          })}
        </View>

        {/* ── LATEST COMPLAINTS ── */}
        <View style={s.section}>
          <View style={s.secRow}>
            <Text style={s.sectionTitle}>📋 Latest Complaints</Text>
            <TouchableOpacity><Text style={s.seeAll}>See All →</Text></TouchableOpacity>
          </View>
          {LATEST_COMPLAINTS.map((c, i) => {
            const sc = cmpColors[c.status];
            return (
              <View key={i} style={s.rowItem}>
                <View style={s.rowLeft}>
                  <Text style={s.rowId}>{c.id}</Text>
                  <Text style={s.rowMain}>{c.citizen}</Text>
                  <Text style={s.rowSub}>{c.type} · {c.time}</Text>
                </View>
                <View style={[s.pill, { backgroundColor: sc.bg }]}>
                  <Text style={[s.pillTxt, { color: sc.text }]}>{c.status}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── LATEST APPOINTMENTS ── */}
        <View style={s.section}>
          <View style={s.secRow}>
            <Text style={s.sectionTitle}>📅 Latest Appointments</Text>
            <TouchableOpacity><Text style={s.seeAll}>See All →</Text></TouchableOpacity>
          </View>
          {LATEST_APPOINTMENTS.map((a, i) => {
            const sc = aptColors[a.status];
            return (
              <View key={i} style={s.rowItem}>
                <View style={s.rowLeft}>
                  <Text style={s.rowId}>{a.id}</Text>
                  <Text style={s.rowMain}>{a.citizen} → {a.lawyer}</Text>
                  <Text style={s.rowSub}>{a.date}</Text>
                </View>
                <View style={[s.pill, { backgroundColor: sc?.bg || '#f3f4f6' }]}>
                  <Text style={[s.pillTxt, { color: sc?.text || '#374151' }]}>{a.status}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── RECENT ACTIVITY ── */}
        <View style={[s.section, { marginBottom: 100 }]}>
          <Text style={s.sectionTitle}>🕐 Recent Activity</Text>
          {RECENT_ACTIVITIES.map((item, i) => (
            <View key={i} style={s.activityItem}>
              <View style={[s.activityDot, { backgroundColor: item.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.activityTitle}>{item.icon} {item.title}</Text>
                <Text style={s.activitySub}>{item.sub}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={s.bottomNav}>
        {BOTTOM_NAV.map(item => (
          <TouchableOpacity
            key={item.id} style={s.navItem}
            onPress={() => {
              setActiveNav(item.id);
              if (item.id === 'lawyers') goTo('LawyerManagement');
              if (item.id === 'users')   goTo('CitizenManagement');
            }}
          >
            <Text style={s.navIcon}>{item.icon}</Text>
            <Text style={[s.navLabel, activeNav === item.id && s.navLabelActive]}>{item.label}</Text>
            {activeNav === item.id && <View style={s.navDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#f5f3ef' },
  header:        { backgroundColor: '#1A0533', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle:   { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  headerSub:     { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2, fontWeight: '500' },
  headerRight:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot:       { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4ade80' },
  liveText:      { fontSize: 11, color: '#4ade80', fontWeight: '700' },
  avatar:        { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
  avatarText:    { fontSize: 12, fontWeight: '800', color: '#fff' },
  scroll:        { flex: 1 },
  scrollContent: { padding: 16 },
  alertRow:      { flexDirection: 'row', gap: 8, marginBottom: 16 },
  alertBadge:    { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  alertText:     { fontSize: 12, fontWeight: '700' },
  secTitle:      { fontSize: 13, fontWeight: '800', color: '#1a1a1a', marginBottom: 12, marginTop: 4 },
  statsGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard:      { backgroundColor: '#fff', borderRadius: 16, padding: 14, width: (width - 42) / 2, borderWidth: 1, borderColor: '#ece9e4', overflow: 'hidden' },
  statAccent:    { position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  statIcon:      { fontSize: 18, marginTop: 8, marginBottom: 4 },
  statValue:     { fontSize: 22, fontWeight: '800', color: '#1a1a1a', letterSpacing: -0.5 },
  statLabel:     { fontSize: 10, color: '#888', marginTop: 4, fontWeight: '500' },
  statDelta:     { fontSize: 10, color: '#5C1A1A', marginTop: 4, fontWeight: '700' },
  quickGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  quickCard:     { backgroundColor: '#fff', borderRadius: 16, padding: 14, width: (width - 42) / 2, borderWidth: 1, borderColor: '#ece9e4' },
  quickIconBox:  { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  quickIcon:     { fontSize: 20 },
  quickLabel:    { fontSize: 12, fontWeight: '800', color: '#1a1a1a' },
  quickSub:      { fontSize: 10, color: '#999', marginTop: 2 },
  quickArrow:    { fontSize: 16, fontWeight: '800', marginTop: 8 },
  section:       { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#ece9e4' },
  sectionTitle:  { fontSize: 13, fontWeight: '800', color: '#1a1a1a', marginBottom: 12 },
  secRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAll:        { fontSize: 12, color: '#1A0533', fontWeight: '700' },
  notifRow:      { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 10, marginBottom: 8, gap: 10 },
  notifDot:      { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  notifText:     { fontSize: 12, fontWeight: '600' },
  notifTime:     { fontSize: 10, fontWeight: '500' },
  rowItem:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f5f3f0' },
  rowLeft:       { flex: 1 },
  rowId:         { fontSize: 10, color: '#bbb', fontWeight: '600', marginBottom: 2 },
  rowMain:       { fontSize: 13, fontWeight: '700', color: '#1a1a1a' },
  rowSub:        { fontSize: 11, color: '#999', marginTop: 2 },
  pill:          { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  pillTxt:       { fontSize: 10, fontWeight: '700' },
  activityItem:  { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f5f3f0' },
  activityDot:   { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  activityTitle: { fontSize: 13, fontWeight: '600', color: '#1a1a1a' },
  activitySub:   { fontSize: 11, color: '#999', marginTop: 2 },
  bottomNav:     { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ece9e4', flexDirection: 'row', height: 68, paddingBottom: 8 },
  navItem:       { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  navIcon:       { fontSize: 20 },
  navLabel:      { fontSize: 9, fontWeight: '600', color: '#bbb', letterSpacing: 0.2 },
  navLabelActive:{ color: '#1A0533' },
  navDot:        { width: 4, height: 4, borderRadius: 2, backgroundColor: '#1A0533', marginTop: 1 },
});
