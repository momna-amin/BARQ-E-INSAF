import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, StatusBar, StyleSheet, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 5;

const ALL_LAWYERS = [
  {
    id: 'L-001', name: 'Ali Hassan', gender: 'Male', dob: '15 Mar 1985',
    cnic: '42201-1234567-1', email: 'ali.hassan@law.pk', phone: '+92 300 1234567',
    city: 'Karachi', specialty: 'Criminal', experience: 12, license: 'SBC-8821',
    barCouncil: 'BC-2210', status: 'Pending', rating: 4.5, cases: 148,
    activeCases: 12, completedCases: 136, fee: 'PKR 5,000', registeredOn: '12 Jan 2024',
  },
  {
    id: 'L-002', name: 'Nadia Memon', gender: 'Female', dob: '22 Jun 1990',
    cnic: '42301-9876543-2', email: 'nadia.memon@law.pk', phone: '+92 321 9876543',
    city: 'Lahore', specialty: 'Family', experience: 8, license: 'SBC-9043',
    barCouncil: 'BC-3301', status: 'Active', rating: 4.8, cases: 95,
    activeCases: 8, completedCases: 87, fee: 'PKR 3,500', registeredOn: '5 Mar 2024',
  },
  {
    id: 'L-003', name: 'Tariq Shah', gender: 'Male', dob: '3 Sep 1978',
    cnic: '42101-5556677-3', email: 'tariq.shah@law.pk', phone: '+92 333 5556677',
    city: 'Islamabad', specialty: 'Civil', experience: 18, license: 'SBC-7711',
    barCouncil: 'BC-1102', status: 'Active', rating: 4.2, cases: 220,
    activeCases: 20, completedCases: 200, fee: 'PKR 8,000', registeredOn: '18 Feb 2024',
  },
  {
    id: 'L-004', name: 'Sara Qureshi', gender: 'Female', dob: '10 Dec 1992',
    cnic: '35202-7778899-4', email: 'sara.q@law.pk', phone: '+92 311 7778899',
    city: 'Karachi', specialty: 'Corporate', experience: 6, license: 'SBC-6620',
    barCouncil: 'BC-4410', status: 'Pending', rating: 0, cases: 0,
    activeCases: 0, completedCases: 0, fee: 'PKR 4,000', registeredOn: '1 Apr 2024',
  },
  {
    id: 'L-005', name: 'Bilal Chaudhry', gender: 'Male', dob: '28 Aug 1982',
    cnic: '35101-3334455-5', email: 'bilal.c@law.pk', phone: '+92 345 3334455',
    city: 'Faisalabad', specialty: 'Tax', experience: 14, license: 'SBC-5530',
    barCouncil: 'BC-5520', status: 'Suspended', rating: 3.1, cases: 110,
    activeCases: 0, completedCases: 110, fee: 'PKR 6,000', registeredOn: '22 Dec 2023',
  },
  {
    id: 'L-006', name: 'Hina Baig', gender: 'Female', dob: '5 Feb 1988',
    cnic: '42201-6667788-6', email: 'hina.baig@law.pk', phone: '+92 300 6667788',
    city: 'Karachi', specialty: 'Property', experience: 10, license: 'SBC-4411',
    barCouncil: 'BC-6630', status: 'Active', rating: 4.6, cases: 75,
    activeCases: 5, completedCases: 70, fee: 'PKR 4,500', registeredOn: '10 Nov 2023',
  },
];

const SPECIALTIES = ['All', 'Criminal', 'Family', 'Civil', 'Corporate', 'Tax', 'Property', 'Intellectual Property'];
const STATUSES = ['All', 'Active', 'Pending', 'Suspended'];

const statusColors = {
  Active:    { bg: '#dcfce7', text: '#166534' },
  Pending:   { bg: '#fef3c7', text: '#92400e' },
  Suspended: { bg: '#fee2e2', text: '#991b1b' },
};

export default function LawyerManagement() {
  const router = useRouter();
  const [lawyers, setLawyers] = useState(ALL_LAWYERS);
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter logic
  const filtered = lawyers.filter(l => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.license.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = selectedSpecialty === 'All' || l.specialty === selectedSpecialty;
    const matchStatus    = selectedStatus    === 'All' || l.status    === selectedStatus;
    return matchSearch && matchSpecialty && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleApprove = (id) => {
    setLawyers(prev => prev.map(l => l.id === id ? { ...l, status: 'Active' } : l));
  };

  const handleRemove = (id) => {
    setLawyers(prev => prev.filter(l => l.id !== id));
  };

  const resetPage = () => setCurrentPage(1);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0533" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Lawyer Management</Text>
          <Text style={styles.headerSub}>{lawyers.length} lawyers registered</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>
            {lawyers.filter(l => l.status === 'Pending').length} Pending
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, license, city..."
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={t => { setSearch(t); resetPage(); }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(''); resetPage(); }}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* FILTER — STATUS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {STATUSES.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.filterChip, selectedStatus === s && styles.filterChipActive]}
              onPress={() => { setSelectedStatus(s); resetPage(); }}
            >
              <Text style={[styles.filterChipText, selectedStatus === s && styles.filterChipTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FILTER — SPECIALTY */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterRow, { marginTop: 4 }]}>
          {SPECIALTIES.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.filterChip, selectedSpecialty === s && styles.filterChipSpecialty]}
              onPress={() => { setSelectedSpecialty(s); resetPage(); }}
            >
              <Text style={[styles.filterChipText, selectedSpecialty === s && styles.filterChipTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* RESULTS COUNT */}
        <Text style={styles.resultCount}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
        </Text>

        {/* LAWYER CARDS */}
        {paginated.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No lawyers found</Text>
          </View>
        ) : (
          paginated.map(lawyer => (
            <View key={lawyer.id} style={styles.card}>
              {/* Card Top */}
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {lawyer.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{lawyer.name}</Text>
                  <Text style={styles.cardSub}>{lawyer.license} · {lawyer.specialty}</Text>
                  <Text style={styles.cardSub}>📍 {lawyer.city} · {lawyer.experience} yrs exp</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColors[lawyer.status]?.bg }]}>
                  <Text style={[styles.statusText, { color: statusColors[lawyer.status]?.text }]}>
                    {lawyer.status}
                  </Text>
                </View>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{lawyer.cases}</Text>
                  <Text style={styles.statLbl}>Cases</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{lawyer.activeCases}</Text>
                  <Text style={styles.statLbl}>Active</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{lawyer.rating > 0 ? lawyer.rating : '—'}</Text>
                  <Text style={styles.statLbl}>Rating</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{lawyer.fee}</Text>
                  <Text style={styles.statLbl}>Fee</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.detailBtn}
                  onPress={() => router.push({ pathname: '/(Admin)/LawyerDetail', params: { id: lawyer.id, data: JSON.stringify(lawyer) } })}
                >
                  <Text style={styles.detailBtnText}>View Details</Text>
                </TouchableOpacity>

                {lawyer.status === 'Pending' && (
                  <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(lawyer.id)}>
                    <Text style={styles.approveBtnText}>✓ Approve</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(lawyer.id)}>
                  <Text style={styles.removeBtnText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
              onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <Text style={styles.pageBtnText}>← Prev</Text>
            </TouchableOpacity>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <TouchableOpacity
                key={page}
                style={[styles.pageNum, currentPage === page && styles.pageNumActive]}
                onPress={() => setCurrentPage(page)}
              >
                <Text style={[styles.pageNumText, currentPage === page && styles.pageNumTextActive]}>
                  {page}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
              onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <Text style={styles.pageBtnText}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f3ef' },
  header: {
    backgroundColor: '#1A0533', paddingHorizontal: 20,
    paddingTop: 14, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: { marginRight: 10 },
  backText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  headerBadge: { backgroundColor: '#fef3c7', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  headerBadgeText: { fontSize: 11, fontWeight: '700', color: '#92400e' },
  scroll: { flex: 1, padding: 14 },
  searchBox: {
    backgroundColor: '#fff', borderRadius: 14, flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: 14, marginBottom: 12,
    borderWidth: 1, borderColor: '#ece9e4',
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#1a1a1a', paddingVertical: 12 },
  clearText: { fontSize: 14, color: '#bbb', paddingLeft: 8 },
  filterRow: { marginBottom: 8 },
  filterChip: {
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14,
    paddingVertical: 6, marginRight: 8, borderWidth: 1, borderColor: '#ece9e4',
  },
  filterChipActive: { backgroundColor: '#1A0533', borderColor: '#1A0533' },
  filterChipSpecialty: { backgroundColor: '#5C1A1A', borderColor: '#5C1A1A' },
  filterChipText: { fontSize: 12, fontWeight: '600', color: '#666' },
  filterChipTextActive: { color: '#fff' },
  resultCount: { fontSize: 11, color: '#999', marginBottom: 12, marginTop: 4 },
  emptyBox: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#bbb', fontSize: 14 },
  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#ece9e4',
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#f0ece8', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatarText: { fontSize: 14, fontWeight: '800', color: '#5C1A1A' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '800', color: '#1a1a1a' },
  cardSub: { fontSize: 11, color: '#888', marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#f9f8f6',
    borderRadius: 12, padding: 10, marginBottom: 12, alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 13, fontWeight: '800', color: '#1a1a1a' },
  statLbl: { fontSize: 10, color: '#999', marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: '#ece9e4' },
  cardActions: { flexDirection: 'row', gap: 8 },
  detailBtn: {
    flex: 1, backgroundColor: '#f0ece8', borderRadius: 10,
    paddingVertical: 8, alignItems: 'center',
  },
  detailBtnText: { fontSize: 12, fontWeight: '700', color: '#5C1A1A' },
  approveBtn: {
    flex: 1, backgroundColor: '#1A0533', borderRadius: 10,
    paddingVertical: 8, alignItems: 'center',
  },
  approveBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  removeBtn: {
    backgroundColor: '#fee2e2', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center',
  },
  removeBtnText: { fontSize: 12, fontWeight: '700', color: '#991b1b' },
  pagination: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, marginVertical: 16,
  },
  pageBtn: {
    backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12,
    paddingVertical: 7, borderWidth: 1, borderColor: '#ece9e4',
  },
  pageBtnDisabled: { opacity: 0.4 },
  pageBtnText: { fontSize: 12, fontWeight: '600', color: '#1A0533' },
  pageNum: {
    width: 32, height: 32, borderRadius: 8, justifyContent: 'center',
    alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ece9e4',
  },
  pageNumActive: { backgroundColor: '#1A0533', borderColor: '#1A0533' },
  pageNumText: { fontSize: 12, fontWeight: '700', color: '#666' },
  pageNumTextActive: { color: '#fff' },
});
