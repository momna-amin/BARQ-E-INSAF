import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, StyleSheet, Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const TABS = ['Personal', 'Professional', 'Performance', 'Account'];

const statusColors = {
  Active:    { bg: '#dcfce7', text: '#166534' },
  Pending:   { bg: '#fef3c7', text: '#92400e' },
  Suspended: { bg: '#fee2e2', text: '#991b1b' },
};

// Mock full detail — in real app this comes from API using lawyer id
const FULL_DETAIL = {
  'L-001': {
    fullName: 'Ali Hassan', gender: 'Male', dob: '15 Mar 1985',
    cnic: '42201-1234567-1', email: 'ali.hassan@law.pk', phone: '+92 300 1234567',
    officeAddress: '204, Justice Plaza, M.A. Jinnah Road', city: 'Karachi', country: 'Pakistan',
    licenseNumber: 'SBC-8821', barCouncil: 'BC-2210', specialty: 'Criminal',
    experience: 12, qualifications: 'LLB, LLM', university: 'University of Karachi',
    lawFirm: 'Hassan & Associates', languages: 'Urdu, English, Sindhi',
    fee: 'PKR 5,000', availableDays: 'Mon – Fri', availableTime: '10am – 5pm',
    onlineConsultation: 'Yes', courts: 'High Court Karachi, Supreme Court',
    bio: 'Experienced criminal lawyer with over 12 years of courtroom experience. Specializing in high-profile criminal defense and constitutional matters.',
    documents: ['Bar Council License ✅', 'LLM Degree ✅', 'Profile Photo ✅', 'Verification Docs ✅'],
    totalCases: 148, activeCases: 12, completedCases: 136, rating: 4.5, totalReviews: 89,
    username: 'ali.hassan', passwordHash: '***hashed***',
    accountStatus: 'Active', registeredOn: '12 Jan 2024', lastLogin: '2 hours ago',
    status: 'Active',
  },
  'L-002': {
    fullName: 'Nadia Memon', gender: 'Female', dob: '22 Jun 1990',
    cnic: '42301-9876543-2', email: 'nadia.memon@law.pk', phone: '+92 321 9876543',
    officeAddress: '88-B, Gulberg III', city: 'Lahore', country: 'Pakistan',
    licenseNumber: 'SBC-9043', barCouncil: 'BC-3301', specialty: 'Family',
    experience: 8, qualifications: 'LLB', university: 'Punjab University',
    lawFirm: 'Memon Legal', languages: 'Urdu, English, Punjabi',
    fee: 'PKR 3,500', availableDays: 'Mon – Sat', availableTime: '9am – 4pm',
    onlineConsultation: 'Yes', courts: 'Family Courts Lahore',
    bio: 'Dedicated family lawyer focusing on divorce, child custody, and inheritance matters with empathy and professionalism.',
    documents: ['Bar Council License ✅', 'LLB Degree ✅', 'Profile Photo ✅', 'Verification Docs ✅'],
    totalCases: 95, activeCases: 8, completedCases: 87, rating: 4.8, totalReviews: 62,
    username: 'nadia.memon', passwordHash: '***hashed***',
    accountStatus: 'Active', registeredOn: '5 Mar 2024', lastLogin: '1 day ago',
    status: 'Active',
  },
};

function InfoRow({ label, value, highlight }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && styles.infoHighlight]}>{value || '—'}</Text>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function LawyerDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('Personal');

  // Get data passed from LawyerManagement or fallback to mock
  let lawyer = null;
  try {
    lawyer = params.data ? JSON.parse(params.data) : null;
  } catch (_) {}

  // Merge with full detail if available
  const fullData = FULL_DETAIL[params.id] || {};
  const data = { ...lawyer, ...fullData };

  if (!data.fullName && !data.name) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.notFound}>Lawyer not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const displayName = data.fullName || data.name;
  const initials = displayName.split(' ').map(n => n[0]).join('');
  const sc = statusColors[data.status] || statusColors['Pending'];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0533" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lawyer Profile</Text>
        <View style={[styles.statusPill, { backgroundColor: sc.bg }]}>
          <Text style={[styles.statusPillText, { color: sc.text }]}>{data.status}</Text>
        </View>
      </View>

      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{displayName}</Text>
          <Text style={styles.profileSub}>{data.licenseNumber || data.license} · {data.specialty}</Text>
          <Text style={styles.profileSub}>📍 {data.city} · {data.experience} yrs</Text>
        </View>
        {data.rating > 0 && (
          <View style={styles.ratingBox}>
            <Text style={styles.ratingVal}>⭐ {data.rating}</Text>
            <Text style={styles.ratingCount}>{data.totalReviews} reviews</Text>
          </View>
        )}
      </View>

      {/* TABS */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── PERSONAL TAB ── */}
        {activeTab === 'Personal' && (
          <>
            <Section title="👤 Personal Information">
              <InfoRow label="Full Name"    value={data.fullName || data.name} />
              <InfoRow label="Gender"       value={data.gender} />
              <InfoRow label="Date of Birth" value={data.dob} />
              <InfoRow label="CNIC (Admin Only)" value={data.cnic} highlight />
            </Section>

            <Section title="📞 Contact Information">
              <InfoRow label="Email"          value={data.email} />
              <InfoRow label="Phone"          value={data.phone} />
              <InfoRow label="Office Address" value={data.officeAddress} />
              <InfoRow label="City"           value={data.city} />
              <InfoRow label="Country"        value={data.country} />
            </Section>
          </>
        )}

        {/* ── PROFESSIONAL TAB ── */}
        {activeTab === 'Professional' && (
          <>
            <Section title="⚖️ Professional Information">
              <InfoRow label="License Number"          value={data.licenseNumber || data.license} />
              <InfoRow label="Bar Council Reg. No."   value={data.barCouncil} />
              <InfoRow label="Specialization"          value={data.specialty} />
              <InfoRow label="Years of Experience"     value={`${data.experience} years`} />
              <InfoRow label="Qualifications"          value={data.qualifications} />
              <InfoRow label="University"              value={data.university} />
              <InfoRow label="Current Law Firm"        value={data.lawFirm || 'Independent'} />
              <InfoRow label="Languages Spoken"        value={data.languages} />
            </Section>

            <Section title="🗓️ Practice Information">
              <InfoRow label="Consultation Fee"      value={data.fee} />
              <InfoRow label="Available Days"        value={data.availableDays} />
              <InfoRow label="Available Time"        value={data.availableTime} />
              <InfoRow label="Online Consultation"   value={data.onlineConsultation} />
              <InfoRow label="Courts of Practice"    value={data.courts} />
            </Section>

            <Section title="📝 Bio / Professional Summary">
              <Text style={styles.bioText}>{data.bio || 'No bio provided.'}</Text>
            </Section>

            <Section title="📄 Documents">
              {(data.documents || ['No documents uploaded']).map((doc, i) => (
                <View key={i} style={styles.docRow}>
                  <Text style={styles.docText}>{doc}</Text>
                </View>
              ))}
            </Section>
          </>
        )}

        {/* ── PERFORMANCE TAB ── */}
        {activeTab === 'Performance' && (
          <>
            <Section title="📊 Case Statistics">
              <View style={styles.perfGrid}>
                {[
                  { label: 'Total Cases',     value: data.totalCases || data.cases || 0,      color: '#1A0533' },
                  { label: 'Active Cases',    value: data.activeCases || 0,                   color: '#0F2744' },
                  { label: 'Completed',       value: data.completedCases || 0,                color: '#1B4332' },
                  { label: 'Client Rating',   value: data.rating > 0 ? `⭐ ${data.rating}` : '—', color: '#5C1A1A' },
                  { label: 'Total Reviews',   value: data.totalReviews || 0,                  color: '#92400e' },
                ].map((item, i) => (
                  <View key={i} style={styles.perfCard}>
                    <View style={[styles.perfAccent, { backgroundColor: item.color }]} />
                    <Text style={styles.perfVal}>{item.value}</Text>
                    <Text style={styles.perfLbl}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </Section>
          </>
        )}

        {/* ── ACCOUNT TAB ── */}
        {activeTab === 'Account' && (
          <>
            <Section title="🔐 Account Information">
              <InfoRow label="Username"         value={data.username} />
              <InfoRow label="Password"         value={data.passwordHash} highlight />
              <InfoRow label="Account Status"   value={data.accountStatus || data.status} />
              <InfoRow label="Registration Date" value={data.registeredOn || data.registrationDate} />
              <InfoRow label="Last Login"       value={data.lastLogin} />
            </Section>

            {/* Admin Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🛡️ Admin Actions</Text>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>✓ Approve Lawyer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnWarn]}>
                <Text style={[styles.actionBtnText, { color: '#92400e' }]}>⏸ Suspend Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]}>
                <Text style={[styles.actionBtnText, { color: '#991b1b' }]}>✕ Remove Lawyer</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f3ef' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFound: { fontSize: 16, color: '#999', marginBottom: 12 },
  backLink: { color: '#1A0533', fontWeight: '700' },
  header: {
    backgroundColor: '#1A0533', paddingHorizontal: 20,
    paddingTop: 14, paddingBottom: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: { marginRight: 10 },
  backText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#fff', flex: 1, textAlign: 'center' },
  statusPill: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  profileCard: {
    backgroundColor: '#1A0533', paddingHorizontal: 20, paddingBottom: 20,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  profileAvatar: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
  },
  profileAvatarText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '800', color: '#fff' },
  profileSub: { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 3 },
  ratingBox: { alignItems: 'center' },
  ratingVal: { fontSize: 14, fontWeight: '800', color: '#fbbf24' },
  ratingCount: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  tabBar: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#ece9e4',
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#1A0533' },
  tabText: { fontSize: 11, fontWeight: '600', color: '#bbb' },
  tabTextActive: { color: '#1A0533' },
  scroll: { flex: 1, padding: 14 },
  section: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#ece9e4',
  },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#1a1a1a', marginBottom: 12 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#f5f3f0',
  },
  infoLabel: { fontSize: 12, color: '#888', fontWeight: '500', flex: 1 },
  infoValue: { fontSize: 12, color: '#1a1a1a', fontWeight: '700', flex: 1.4, textAlign: 'right' },
  infoHighlight: { color: '#5C1A1A' },
  bioText: { fontSize: 13, color: '#444', lineHeight: 20 },
  docRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f5f3f0' },
  docText: { fontSize: 13, color: '#1a1a1a', fontWeight: '600' },
  perfGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  perfCard: {
    backgroundColor: '#f9f8f6', borderRadius: 14, padding: 14,
    width: (width - 76) / 2, borderWidth: 1, borderColor: '#ece9e4', overflow: 'hidden',
  },
  perfAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  perfVal: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', marginTop: 8 },
  perfLbl: { fontSize: 11, color: '#888', marginTop: 4 },
  actionBtn: {
    backgroundColor: '#dcfce7', borderRadius: 12,
    paddingVertical: 12, alignItems: 'center', marginBottom: 8,
  },
  actionBtnWarn: { backgroundColor: '#fef3c7' },
  actionBtnDanger: { backgroundColor: '#fee2e2' },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#166534' },
});
