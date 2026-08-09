import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, StatusBar, StyleSheet,
  Dimensions, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const PER_PAGE = 5;

const CITIZENS = [
  {
    id: 'CIT-001', fullName: 'Muhammad Usman', email: 'usman@gmail.com',
    phone: '+92 300 1112233', cnic: '42201-1234567-1', gender: 'Male', dob: '10 Apr 1990',
    country: 'Pakistan', province: 'Sindh', city: 'Karachi', address: 'House 12, Block B, North Nazimabad',
    registeredOn: '5 Jan 2024', lastLogin: '2 hours ago', status: 'Active',
    totalComplaints: 5, activeComplaints: 2, resolvedComplaints: 3,
    assignedLawyer: 'Ali Hassan', appointments: 4,
    documents: ['CNIC ✅', 'Complaint Docs ✅'],
  },
  {
    id: 'CIT-002', fullName: 'Fatima Zahra', email: 'fatima.z@gmail.com',
    phone: '+92 321 4445566', cnic: '35202-9876543-2', gender: 'Female', dob: '22 Aug 1995',
    country: 'Pakistan', province: 'Punjab', city: 'Lahore', address: 'Flat 5, Gulberg Residency',
    registeredOn: '14 Feb 2024', lastLogin: '1 day ago', status: 'Active',
    totalComplaints: 2, activeComplaints: 1, resolvedComplaints: 1,
    assignedLawyer: 'Nadia Memon', appointments: 2,
    documents: ['CNIC ✅'],
  },
  {
    id: 'CIT-003', fullName: 'Rizwan Akhtar', email: 'rizwan.a@yahoo.com',
    phone: '+92 333 7778899', cnic: '37405-5556677-3', gender: 'Male', dob: '3 Dec 1985',
    country: 'Pakistan', province: 'KPK', city: 'Peshawar', address: '44 University Road',
    registeredOn: '20 Mar 2024', lastLogin: '5 days ago', status: 'Suspended',
    totalComplaints: 8, activeComplaints: 0, resolvedComplaints: 8,
    assignedLawyer: 'Tariq Shah', appointments: 6,
    documents: ['CNIC ✅', 'Complaint Docs ✅'],
  },
  {
    id: 'CIT-004', fullName: 'Ayesha Siddiqui', email: 'ayesha.s@hotmail.com',
    phone: '+92 311 2223344', cnic: '42301-3334455-4', gender: 'Female', dob: '18 May 1998',
    country: 'Pakistan', province: 'Sindh', city: 'Hyderabad', address: '9-C, Latifabad',
    registeredOn: '2 Apr 2024', lastLogin: '3 hours ago', status: 'Active',
    totalComplaints: 1, activeComplaints: 1, resolvedComplaints: 0,
    assignedLawyer: 'Unassigned', appointments: 1,
    documents: ['CNIC ✅'],
  },
  {
    id: 'CIT-005', fullName: 'Kamran Mirza', email: 'kamran.m@gmail.com',
    phone: '+92 345 6667788', cnic: '35101-6667788-5', gender: 'Male', dob: '7 Jan 1980',
    country: 'Pakistan', province: 'Punjab', city: 'Faisalabad', address: 'Plot 33, D-Ground',
    registeredOn: '9 Nov 2023', lastLogin: '2 weeks ago', status: 'Inactive',
    totalComplaints: 3, activeComplaints: 0, resolvedComplaints: 3,
    assignedLawyer: 'Bilal Chaudhry', appointments: 3,
    documents: ['CNIC ✅', 'Complaint Docs ✅'],
  },
  {
    id: 'CIT-006', fullName: 'Sara Malik', email: 'sara.malik@gmail.com',
    phone: '+92 300 9990011', cnic: '42201-9990011-6', gender: 'Female', dob: '30 Oct 1993',
    country: 'Pakistan', province: 'Sindh', city: 'Karachi', address: 'Flat 8, Clifton Block 5',
    registeredOn: '1 Jun 2024', lastLogin: 'Just now', status: 'Active',
    totalComplaints: 0, activeComplaints: 0, resolvedComplaints: 0,
    assignedLawyer: 'Unassigned', appointments: 0,
    documents: ['CNIC ✅'],
  },
];

const STATUSES   = ['All', 'Active', 'Inactive', 'Suspended'];
const CITIES     = ['All', 'Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Hyderabad', 'Faisalabad'];
const SORT_OPTIONS = ['Name ↑', 'Name ↓', 'Date ↑', 'Date ↓', 'Complaints ↓'];

const statusColors = {
  Active:    { bg: '#dcfce7', text: '#166534' },
  Inactive:  { bg: '#f3f4f6', text: '#374151' },
  Suspended: { bg: '#fee2e2', text: '#991b1b' },
};

export default function CitizenManagement() {
  const router   = useRouter();
  const [data, setData]             = useState(CITIZENS);
  const [search, setSearch]         = useState('');
  const [status, setStatus]         = useState('All');
  const [city, setCity]             = useState('All');
  const [sort, setSort]             = useState('Name ↑');
  const [showSort, setShowSort]     = useState(false);
  const [page, setPage]             = useState(1);
  const [selected, setSelected]     = useState([]);
  const [showDetail, setShowDetail] = useState(null);

  // Filter
  let filtered = data.filter(c => {
    const q = search.toLowerCase();
    const matchQ = c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.cnic.includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q);
    return matchQ &&
      (status === 'All' || c.status === status) &&
      (city   === 'All' || c.city   === city);
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sort === 'Name ↑') return a.fullName.localeCompare(b.fullName);
    if (sort === 'Name ↓') return b.fullName.localeCompare(a.fullName);
    if (sort === 'Complaints ↓') return b.totalComplaints - a.totalComplaints;
    if (sort === 'Date ↑') return new Date(a.registeredOn) - new Date(b.registeredOn);
    if (sort === 'Date ↓') return new Date(b.registeredOn) - new Date(a.registeredOn);
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const reset      = () => setPage(1);

  // Actions
  const handleDelete  = (id) => setData(p => p.filter(c => c.id !== id));
  const handleSuspend = (id) => setData(p => p.map(c => c.id === id ? { ...c, status: 'Suspended' } : c));
  const handleActivate= (id) => setData(p => p.map(c => c.id === id ? { ...c, status: 'Active' }    : c));

  // Bulk
  const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const selectAll    = () => setSelected(paginated.map(c => c.id));
  const clearSelect  = () => setSelected([]);
  const bulkDelete   = () => { setData(p => p.filter(c => !selected.includes(c.id))); clearSelect(); };
  const bulkSuspend  = () => { setData(p => p.map(c => selected.includes(c.id) ? { ...c, status: 'Suspended' } : c)); clearSelect(); };

  if (showDetail) return <CitizenDetail citizen={showDetail} onBack={() => setShowDetail(null)} />;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0533" />

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={s.backText}>← Back</Text></TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.headerTitle}>Citizen Management</Text>
          <Text style={s.headerSub}>{data.length} citizens registered</Text>
        </View>
        <View style={s.badge}><Text style={s.badgeText}>{data.filter(c=>c.status==='Active').length} Active</Text></View>
      </View>

      <ScrollView style={{ flex: 1, padding: 14 }} showsVerticalScrollIndicator={false}>

        {/* SEARCH */}
        <View style={s.searchBox}>
          <Text>🔍</Text>
          <TextInput
            style={s.searchInput} placeholderTextColor="#bbb"
            placeholder="Search name, CNIC, city, ID..."
            value={search} onChangeText={t => { setSearch(t); reset(); }}
          />
          {search ? <TouchableOpacity onPress={() => { setSearch(''); reset(); }}><Text style={s.clearX}>✕</Text></TouchableOpacity> : null}
        </View>

        {/* STATUS FILTER */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow}>
          {STATUSES.map(st => (
            <TouchableOpacity key={st}
              style={[s.chip, status === st && s.chipActive]}
              onPress={() => { setStatus(st); reset(); }}>
              <Text style={[s.chipTxt, status === st && s.chipTxtActive]}>{st}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* CITY FILTER */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[s.filterRow, { marginTop: 4 }]}>
          {CITIES.map(ct => (
            <TouchableOpacity key={ct}
              style={[s.chip, city === ct && s.chipCity]}
              onPress={() => { setCity(ct); reset(); }}>
              <Text style={[s.chipTxt, city === ct && s.chipTxtActive]}>📍 {ct}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SORT + RESULTS */}
        <View style={s.toolRow}>
          <Text style={s.resultCount}>{filtered.length} results</Text>
          <TouchableOpacity style={s.sortBtn} onPress={() => setShowSort(p => !p)}>
            <Text style={s.sortBtnTxt}>Sort: {sort} ▾</Text>
          </TouchableOpacity>
        </View>
        {showSort && (
          <View style={s.sortMenu}>
            {SORT_OPTIONS.map(o => (
              <TouchableOpacity key={o} style={s.sortOption} onPress={() => { setSort(o); setShowSort(false); }}>
                <Text style={[s.sortOptionTxt, sort === o && { color: '#1A0533', fontWeight: '800' }]}>{o}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* BULK ACTIONS */}
        {selected.length > 0 && (
          <View style={s.bulkBar}>
            <Text style={s.bulkCount}>{selected.length} selected</Text>
            <TouchableOpacity style={s.bulkBtn} onPress={bulkSuspend}><Text style={s.bulkBtnTxt}>Suspend All</Text></TouchableOpacity>
            <TouchableOpacity style={[s.bulkBtn, s.bulkDanger]} onPress={bulkDelete}><Text style={[s.bulkBtnTxt, { color: '#991b1b' }]}>Delete All</Text></TouchableOpacity>
            <TouchableOpacity onPress={clearSelect}><Text style={s.bulkClear}>✕</Text></TouchableOpacity>
          </View>
        )}

        {/* SELECT ALL */}
        {paginated.length > 0 && (
          <TouchableOpacity style={s.selectAllRow} onPress={selected.length === paginated.length ? clearSelect : selectAll}>
            <Text style={s.selectAllTxt}>
              {selected.length === paginated.length ? '☑ Deselect All' : '☐ Select All'}
            </Text>
          </TouchableOpacity>
        )}

        {/* CARDS */}
        {paginated.length === 0
          ? <View style={s.empty}><Text style={s.emptyTxt}>No citizens found</Text></View>
          : paginated.map(c => {
            const sc = statusColors[c.status] || statusColors['Inactive'];
            const isSelected = selected.includes(c.id);
            return (
              <View key={c.id} style={[s.card, isSelected && s.cardSelected]}>
                <View style={s.cardTop}>
                  <TouchableOpacity onPress={() => toggleSelect(c.id)} style={s.checkbox}>
                    <Text style={{ fontSize: 16 }}>{isSelected ? '☑' : '☐'}</Text>
                  </TouchableOpacity>
                  <View style={s.avatar}>
                    <Text style={s.avatarTxt}>{c.fullName.split(' ').map(n=>n[0]).join('')}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardName}>{c.fullName}</Text>
                    <Text style={s.cardSub}>{c.id} · {c.city}</Text>
                    <Text style={s.cardSub}>{c.email}</Text>
                  </View>
                  <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
                    <Text style={[s.statusTxt, { color: sc.text }]}>{c.status}</Text>
                  </View>
                </View>

                {/* Stats */}
                <View style={s.statsRow}>
                  {[
                    { l: 'Complaints', v: c.totalComplaints },
                    { l: 'Active',     v: c.activeComplaints },
                    { l: 'Resolved',   v: c.resolvedComplaints },
                    { l: 'Appts',      v: c.appointments },
                  ].map((item, i) => (
                    <React.Fragment key={i}>
                      <View style={s.statItem}>
                        <Text style={s.statVal}>{item.v}</Text>
                        <Text style={s.statLbl}>{item.l}</Text>
                      </View>
                      {i < 3 && <View style={s.statDiv} />}
                    </React.Fragment>
                  ))}
                </View>

                {/* Actions */}
                <View style={s.actions}>
                  <TouchableOpacity style={s.actView}  onPress={() => setShowDetail(c)}><Text style={s.actViewTxt}>View</Text></TouchableOpacity>
                  <TouchableOpacity style={s.actEdit}><Text style={s.actEditTxt}>Edit</Text></TouchableOpacity>
                  {c.status !== 'Suspended'
                    ? <TouchableOpacity style={s.actSuspend} onPress={() => handleSuspend(c.id)}><Text style={s.actSuspendTxt}>Suspend</Text></TouchableOpacity>
                    : <TouchableOpacity style={s.actActivate} onPress={() => handleActivate(c.id)}><Text style={s.actActivateTxt}>Activate</Text></TouchableOpacity>
                  }
                  <TouchableOpacity style={s.actDelete} onPress={() => handleDelete(c.id)}><Text style={s.actDeleteTxt}>✕</Text></TouchableOpacity>
                </View>
              </View>
            );
          })
        }

        {/* PAGINATION */}
        {totalPages > 1 && (
          <View style={s.pager}>
            <TouchableOpacity style={[s.pageBtn, page===1 && s.pageDis]} disabled={page===1} onPress={() => setPage(p=>p-1)}>
              <Text style={s.pageBtnTxt}>← Prev</Text>
            </TouchableOpacity>
            {Array.from({ length: totalPages }, (_, i) => i+1).map(pg => (
              <TouchableOpacity key={pg} style={[s.pageNum, page===pg && s.pageNumAct]} onPress={() => setPage(pg)}>
                <Text style={[s.pageNumTxt, page===pg && s.pageNumActTxt]}>{pg}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[s.pageBtn, page===totalPages && s.pageDis]} disabled={page===totalPages} onPress={() => setPage(p=>p+1)}>
              <Text style={s.pageBtnTxt}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── DETAIL VIEW ─────────────────────────────────────────────────────────────
const DETAIL_TABS = ['Personal', 'Legal', 'Documents', 'Account'];

function CitizenDetail({ citizen: c, onBack }) {
  const [tab, setTab] = useState('Personal');
  const sc = statusColors[c.status] || statusColors['Inactive'];
  const initials = c.fullName.split(' ').map(n=>n[0]).join('');

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0533" />
      <View style={s.header}>
        <TouchableOpacity onPress={onBack}><Text style={s.backText}>← Back</Text></TouchableOpacity>
        <Text style={[s.headerTitle, { flex: 1, marginLeft: 10 }]}>Citizen Profile</Text>
        <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
          <Text style={[s.statusTxt, { color: sc.text }]}>{c.status}</Text>
        </View>
      </View>

      {/* Profile Card */}
      <View style={[s.header, { paddingBottom: 18 }]}>
        <View style={[s.avatar, { width: 52, height: 52, borderRadius: 14, marginRight: 14 }]}>
          <Text style={[s.avatarTxt, { fontSize: 16 }]}>{initials}</Text>
        </View>
        <View>
          <Text style={s.headerTitle}>{c.fullName}</Text>
          <Text style={s.headerSub}>{c.id} · {c.city}</Text>
          <Text style={s.headerSub}>{c.phone}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabBar}>
        {DETAIL_TABS.map(t => (
          <TouchableOpacity key={t} style={[s.tabItem, tab===t && s.tabActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabTxt, tab===t && s.tabTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ padding: 14 }}>
        {tab === 'Personal' && (
          <>
            <DetailSection title="👤 Personal Information">
              {[['Citizen ID', c.id], ['Full Name', c.fullName], ['Gender', c.gender],
                ['Date of Birth', c.dob], ['CNIC', c.cnic], ['Email', c.email], ['Phone', c.phone]
              ].map(([l,v]) => <InfoRow key={l} label={l} value={v} />)}
            </DetailSection>
            <DetailSection title="📍 Address">
              {[['Country', c.country], ['Province', c.province], ['City', c.city], ['Address', c.address]
              ].map(([l,v]) => <InfoRow key={l} label={l} value={v} />)}
            </DetailSection>
          </>
        )}
        {tab === 'Legal' && (
          <DetailSection title="⚖️ Legal Information">
            {[['Total Complaints', c.totalComplaints], ['Active Complaints', c.activeComplaints],
              ['Resolved Complaints', c.resolvedComplaints], ['Assigned Lawyer', c.assignedLawyer],
              ['Appointments Booked', c.appointments]
            ].map(([l,v]) => <InfoRow key={l} label={l} value={v} />)}
          </DetailSection>
        )}
        {tab === 'Documents' && (
          <DetailSection title="📄 Documents">
            {(c.documents || []).map((d, i) => (
              <View key={i} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f5f3f0' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#1a1a1a' }}>{d}</Text>
              </View>
            ))}
          </DetailSection>
        )}
        {tab === 'Account' && (
          <>
            <DetailSection title="🔐 Account">
              {[['Registration Date', c.registeredOn], ['Last Login', c.lastLogin], ['Status', c.status]
              ].map(([l,v]) => <InfoRow key={l} label={l} value={v} />)}
            </DetailSection>
            <DetailSection title="🛡️ Admin Actions">
              {[
                { label: 'Edit Profile',          color: '#dbeafe', txt: '#1e40af' },
                { label: 'View Complaint History', color: '#f0fdf4', txt: '#166534' },
                { label: 'View Appointment History', color: '#fef9c3', txt: '#713f12' },
                { label: 'Suspend Account',       color: '#fef3c7', txt: '#92400e' },
                { label: 'Delete Citizen',        color: '#fee2e2', txt: '#991b1b' },
              ].map(btn => (
                <TouchableOpacity key={btn.label} style={[s.actionBigBtn, { backgroundColor: btn.color }]}>
                  <Text style={[s.actionBigBtnTxt, { color: btn.txt }]}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
            </DetailSection>
          </>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailSection({ title, children }) {
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#ece9e4' }}>
      <Text style={{ fontSize: 13, fontWeight: '800', color: '#1a1a1a', marginBottom: 12 }}>{title}</Text>
      {children}
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#f5f3f0' }}>
      <Text style={{ fontSize: 12, color: '#888', fontWeight: '500', flex: 1 }}>{label}</Text>
      <Text style={{ fontSize: 12, color: '#1a1a1a', fontWeight: '700', flex: 1.4, textAlign: 'right' }}>{String(value ?? '—')}</Text>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#f5f3ef' },
  header:        { backgroundColor: '#1A0533', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' },
  backText:      { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  headerTitle:   { fontSize: 15, fontWeight: '800', color: '#fff' },
  headerSub:     { fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  badge:         { backgroundColor: '#dcfce7', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:     { fontSize: 11, fontWeight: '700', color: '#166534' },
  searchBox:     { backgroundColor: '#fff', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 12, borderWidth: 1, borderColor: '#ece9e4' },
  searchInput:   { flex: 1, fontSize: 13, color: '#1a1a1a', paddingVertical: 12, marginLeft: 8 },
  clearX:        { fontSize: 14, color: '#bbb', paddingLeft: 8 },
  filterRow:     { marginBottom: 8 },
  chip:          { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8, borderWidth: 1, borderColor: '#ece9e4' },
  chipActive:    { backgroundColor: '#1A0533', borderColor: '#1A0533' },
  chipCity:      { backgroundColor: '#5C1A1A', borderColor: '#5C1A1A' },
  chipTxt:       { fontSize: 12, fontWeight: '600', color: '#666' },
  chipTxtActive: { color: '#fff' },
  toolRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  resultCount:   { fontSize: 11, color: '#999' },
  sortBtn:       { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#ece9e4' },
  sortBtnTxt:    { fontSize: 12, fontWeight: '600', color: '#1A0533' },
  sortMenu:      { backgroundColor: '#fff', borderRadius: 14, padding: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ece9e4' },
  sortOption:    { paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f5f3f0' },
  sortOptionTxt: { fontSize: 13, color: '#555' },
  bulkBar:       { backgroundColor: '#1A0533', borderRadius: 14, flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 10, gap: 8 },
  bulkCount:     { color: '#fff', fontSize: 12, fontWeight: '700', flex: 1 },
  bulkBtn:       { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  bulkDanger:    { backgroundColor: '#fee2e2' },
  bulkBtnTxt:    { fontSize: 11, fontWeight: '700', color: '#fff' },
  bulkClear:     { color: 'rgba(255,255,255,0.6)', fontSize: 16, paddingLeft: 4 },
  selectAllRow:  { marginBottom: 8 },
  selectAllTxt:  { fontSize: 12, color: '#1A0533', fontWeight: '600' },
  empty:         { alignItems: 'center', padding: 40 },
  emptyTxt:      { color: '#bbb', fontSize: 14 },
  card:          { backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#ece9e4' },
  cardSelected:  { borderColor: '#1A0533', borderWidth: 2 },
  cardTop:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  checkbox:      { marginRight: 8, marginTop: 2 },
  avatar:        { width: 42, height: 42, borderRadius: 12, backgroundColor: '#f0ece8', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarTxt:     { fontSize: 13, fontWeight: '800', color: '#5C1A1A' },
  cardName:      { fontSize: 14, fontWeight: '800', color: '#1a1a1a' },
  cardSub:       { fontSize: 11, color: '#888', marginTop: 2 },
  statusBadge:   { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusTxt:     { fontSize: 10, fontWeight: '700' },
  statsRow:      { flexDirection: 'row', backgroundColor: '#f9f8f6', borderRadius: 12, padding: 10, marginBottom: 12, alignItems: 'center' },
  statItem:      { flex: 1, alignItems: 'center' },
  statVal:       { fontSize: 13, fontWeight: '800', color: '#1a1a1a' },
  statLbl:       { fontSize: 10, color: '#999', marginTop: 2 },
  statDiv:       { width: 1, height: 24, backgroundColor: '#ece9e4' },
  actions:       { flexDirection: 'row', gap: 8 },
  actView:       { flex: 1, backgroundColor: '#f0ece8', borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  actViewTxt:    { fontSize: 12, fontWeight: '700', color: '#5C1A1A' },
  actEdit:       { flex: 1, backgroundColor: '#dbeafe', borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  actEditTxt:    { fontSize: 12, fontWeight: '700', color: '#1e40af' },
  actSuspend:    { flex: 1, backgroundColor: '#fef3c7', borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  actSuspendTxt: { fontSize: 12, fontWeight: '700', color: '#92400e' },
  actActivate:   { flex: 1, backgroundColor: '#dcfce7', borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  actActivateTxt:{ fontSize: 12, fontWeight: '700', color: '#166534' },
  actDelete:     { backgroundColor: '#fee2e2', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center' },
  actDeleteTxt:  { fontSize: 14, fontWeight: '800', color: '#991b1b' },
  pager:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginVertical: 16 },
  pageBtn:       { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: '#ece9e4' },
  pageDis:       { opacity: 0.4 },
  pageBtnTxt:    { fontSize: 12, fontWeight: '600', color: '#1A0533' },
  pageNum:       { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ece9e4' },
  pageNumAct:    { backgroundColor: '#1A0533', borderColor: '#1A0533' },
  pageNumTxt:    { fontSize: 12, fontWeight: '700', color: '#666' },
  pageNumActTxt: { color: '#fff' },
  tabBar:        { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ece9e4' },
  tabItem:       { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive:     { borderBottomWidth: 2, borderBottomColor: '#1A0533' },
  tabTxt:        { fontSize: 11, fontWeight: '600', color: '#bbb' },
  tabTxtActive:  { color: '#1A0533' },
  actionBigBtn:  { borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 8 },
  actionBigBtnTxt:{ fontSize: 13, fontWeight: '700' },
});
