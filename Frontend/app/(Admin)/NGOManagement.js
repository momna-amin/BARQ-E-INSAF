import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, StatusBar, StyleSheet, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const PER_PAGE = 5;

const NGOS = [
  {
    id: 'NGO-001', name: 'Justice For All', registrationNo: 'NGO-KHI-2019-441',
    registeredOn: '12 Mar 2019', type: 'Legal Aid', website: 'www.justiceforall.pk',
    email: 'info@justiceforall.pk', phone: '+92 21 3456789',
    officeAddress: '14-A, Clifton', city: 'Karachi', country: 'Pakistan',
    founder: 'Dr. Aamir Khan', contactPerson: 'Sana Raza',
    mission: 'Providing free legal aid to underprivileged citizens across Pakistan.',
    areasOfWork: 'Legal Aid, Human Rights, Women Rights',
    operatingRegions: 'Karachi, Hyderabad, Sukkur',
    documents: ['Registration Certificate ✅', 'Tax Certificate ✅'],
    verificationStatus: 'Verified', totalCases: 340, totalBeneficiaries: 1200,
    totalLawyers: 18, activePrograms: 5,
    status: 'Active', lastLogin: '3 hours ago',
  },
  {
    id: 'NGO-002', name: 'Haqooq Foundation', registrationNo: 'NGO-LHR-2021-889',
    registeredOn: '5 Aug 2021', type: 'Human Rights', website: 'www.haqooq.org.pk',
    email: 'contact@haqooq.org.pk', phone: '+92 42 9988776',
    officeAddress: 'Model Town, Block C', city: 'Lahore', country: 'Pakistan',
    founder: 'Asma Bibi', contactPerson: 'Raza Hussain',
    mission: 'Empowering marginalized communities through legal education and advocacy.',
    areasOfWork: 'Education, Legal Awareness, Youth Empowerment',
    operatingRegions: 'Lahore, Multan, Rawalpindi',
    documents: ['Registration Certificate ✅'],
    verificationStatus: 'Pending', totalCases: 120, totalBeneficiaries: 450,
    totalLawyers: 9, activePrograms: 3,
    status: 'Pending', lastLogin: '1 day ago',
  },
  {
    id: 'NGO-003', name: 'Awaaz-e-Insaf', registrationNo: 'NGO-ISB-2020-312',
    registeredOn: '20 Jan 2020', type: 'Women Rights', website: 'www.awaaz-insaf.pk',
    email: 'hello@awaaz-insaf.pk', phone: '+92 51 2233445',
    officeAddress: 'F-7 Markaz', city: 'Islamabad', country: 'Pakistan',
    founder: 'Zainab Mirza', contactPerson: 'Ali Nawaz',
    mission: 'Defending women\'s rights and providing legal shelter to abuse survivors.',
    areasOfWork: 'Gender Violence, Custody, Divorce Rights',
    operatingRegions: 'Islamabad, Rawalpindi, Attock',
    documents: ['Registration Certificate ✅', 'Tax Certificate ✅'],
    verificationStatus: 'Verified', totalCases: 215, totalBeneficiaries: 780,
    totalLawyers: 12, activePrograms: 4,
    status: 'Active', lastLogin: '6 hours ago',
  },
  {
    id: 'NGO-004', name: 'Legal Shield Pakistan', registrationNo: 'NGO-PES-2022-577',
    registeredOn: '8 Jun 2022', type: 'Legal Aid', website: '',
    email: 'legalshield@yahoo.com', phone: '+92 91 5544332',
    officeAddress: 'Saddar Road, Phase 2', city: 'Peshawar', country: 'Pakistan',
    founder: 'Hamid Afridi', contactPerson: 'Hamid Afridi',
    mission: 'Providing affordable legal counsel to tribal and remote communities.',
    areasOfWork: 'Tribal Law, Criminal Defense, Land Rights',
    operatingRegions: 'Peshawar, Mardan, Kohat',
    documents: ['Registration Certificate ✅'],
    verificationStatus: 'Pending', totalCases: 55, totalBeneficiaries: 180,
    totalLawyers: 4, activePrograms: 1,
    status: 'Pending', lastLogin: '3 days ago',
  },
  {
    id: 'NGO-005', name: 'Munsif Welfare Trust', registrationNo: 'NGO-QTA-2018-109',
    registeredOn: '3 Feb 2018', type: 'Welfare', website: 'www.munsif.org',
    email: 'admin@munsif.org', phone: '+92 81 2211330',
    officeAddress: 'Jinnah Road, Quetta', city: 'Quetta', country: 'Pakistan',
    founder: 'Noor Baloch', contactPerson: 'Fatima Shah',
    mission: 'Welfare and rehabilitation of prison inmates and their families.',
    areasOfWork: 'Prison Reform, Rehabilitation, Legal Assistance',
    operatingRegions: 'Quetta, Turbat, Khuzdar',
    documents: ['Registration Certificate ✅', 'Tax Certificate ✅'],
    verificationStatus: 'Suspended', totalCases: 78, totalBeneficiaries: 320,
    totalLawyers: 6, activePrograms: 0,
    status: 'Suspended', lastLogin: '2 months ago',
  },
];

const STATUSES      = ['All', 'Active', 'Pending', 'Suspended'];
const VERIFY_STATUS = ['All', 'Verified', 'Pending', 'Suspended'];
const TYPES         = ['All', 'Legal Aid', 'Human Rights', 'Women Rights', 'Welfare'];
const SORT_OPTIONS  = ['Name ↑', 'Name ↓', 'Cases ↓', 'Beneficiaries ↓', 'Date ↑'];

const statusColors = {
  Active:    { bg: '#dcfce7', text: '#166534' },
  Pending:   { bg: '#fef3c7', text: '#92400e' },
  Suspended: { bg: '#fee2e2', text: '#991b1b' },
  Verified:  { bg: '#dbeafe', text: '#1e40af' },
};

const DETAIL_TABS = ['Organization', 'Verification', 'Statistics', 'Account'];

// ─── DETAIL ──────────────────────────────────────────────────────────────────
function NGODetail({ ngo: n, onBack }) {
  const [tab, setTab] = useState('Organization');
  const sc = statusColors[n.status] || statusColors['Pending'];
  const initials = n.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0533" />
      <View style={s.header}>
        <TouchableOpacity onPress={onBack}><Text style={s.backText}>← Back</Text></TouchableOpacity>
        <Text style={[s.headerTitle, { flex: 1, marginLeft: 10 }]}>NGO Profile</Text>
        <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
          <Text style={[s.statusTxt, { color: sc.text }]}>{n.status}</Text>
        </View>
      </View>

      {/* Profile */}
      <View style={[s.header, { paddingBottom: 18 }]}>
        <View style={[s.avatar, { width: 52, height: 52, borderRadius: 14, marginRight: 14 }]}>
          <Text style={[s.avatarTxt, { fontSize: 16 }]}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>{n.name}</Text>
          <Text style={s.headerSub}>{n.id} · {n.type}</Text>
          <Text style={s.headerSub}>📍 {n.city} · {n.registrationNo}</Text>
        </View>
        <View style={[s.statusBadge, { backgroundColor: statusColors[n.verificationStatus]?.bg || '#f3f4f6' }]}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: statusColors[n.verificationStatus]?.text || '#374151' }}>
            {n.verificationStatus}
          </Text>
        </View>
      </View>

      <View style={s.tabBar}>
        {DETAIL_TABS.map(t => (
          <TouchableOpacity key={t} style={[s.tabItem, tab===t && s.tabActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabTxt, tab===t && s.tabTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ padding: 14 }}>
        {tab === 'Organization' && (
          <>
            <DSec title="🏢 Organization Information">
              {[['NGO ID', n.id], ['NGO Name', n.name], ['Registration No.', n.registrationNo],
                ['Registration Date', n.registeredOn], ['NGO Type', n.type], ['Website', n.website || 'N/A']
              ].map(([l,v]) => <IR key={l} label={l} value={v} />)}
            </DSec>
            <DSec title="📞 Contact Details">
              {[['Official Email', n.email], ['Phone', n.phone], ['Office Address', n.officeAddress],
                ['City', n.city], ['Country', n.country]
              ].map(([l,v]) => <IR key={l} label={l} value={v} />)}
            </DSec>
            <DSec title="📋 Organization Details">
              {[['Founder / Director', n.founder], ['Contact Person', n.contactPerson],
                ['Areas of Work', n.areasOfWork], ['Operating Regions', n.operatingRegions]
              ].map(([l,v]) => <IR key={l} label={l} value={v} />)}
              <Text style={{ fontSize: 12, color: '#888', marginTop: 10 }}>Mission</Text>
              <Text style={{ fontSize: 13, color: '#333', lineHeight: 20, marginTop: 4 }}>{n.mission}</Text>
            </DSec>
          </>
        )}
        {tab === 'Verification' && (
          <DSec title="✅ Verification">
            {[['Verification Status', n.verificationStatus]].map(([l,v]) => <IR key={l} label={l} value={v} />)}
            <Text style={{ fontSize: 12, color: '#888', marginTop: 14, marginBottom: 8 }}>Documents</Text>
            {n.documents.map((d,i) => (
              <View key={i} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f5f3f0' }}>
                <Text style={{ fontSize: 13, fontWeight: '600' }}>{d}</Text>
              </View>
            ))}
          </DSec>
        )}
        {tab === 'Statistics' && (
          <DSec title="📊 Statistics">
            <View style={s.perfGrid}>
              {[
                { l: 'Cases Assisted',     v: n.totalCases,         c: '#1A0533' },
                { l: 'Beneficiaries',      v: n.totalBeneficiaries, c: '#0F2744' },
                { l: 'Lawyers Associated', v: n.totalLawyers,       c: '#1B4332' },
                { l: 'Active Programs',    v: n.activePrograms,     c: '#5C1A1A' },
              ].map(item => (
                <View key={item.l} style={s.perfCard}>
                  <View style={[s.perfAccent, { backgroundColor: item.c }]} />
                  <Text style={s.perfVal}>{item.v}</Text>
                  <Text style={s.perfLbl}>{item.l}</Text>
                </View>
              ))}
            </View>
          </DSec>
        )}
        {tab === 'Account' && (
          <>
            <DSec title="🔐 Account">
              {[['Status', n.status], ['Registration Date', n.registeredOn], ['Last Login', n.lastLogin]
              ].map(([l,v]) => <IR key={l} label={l} value={v} />)}
            </DSec>
            <DSec title="🛡️ Admin Actions">
              {[
                { label: 'Approve / Verify NGO', color: '#dcfce7', txt: '#166534' },
                { label: 'Edit NGO Profile',     color: '#dbeafe', txt: '#1e40af' },
                { label: 'Reject Application',   color: '#fef3c7', txt: '#92400e' },
                { label: 'Suspend NGO',          color: '#fef3c7', txt: '#92400e' },
                { label: 'Delete NGO',           color: '#fee2e2', txt: '#991b1b' },
              ].map(btn => (
                <TouchableOpacity key={btn.label} style={[s.bigBtn, { backgroundColor: btn.color }]}>
                  <Text style={[s.bigBtnTxt, { color: btn.txt }]}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
            </DSec>
          </>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DSec({ title, children }) {
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#ece9e4' }}>
      <Text style={{ fontSize: 13, fontWeight: '800', color: '#1a1a1a', marginBottom: 12 }}>{title}</Text>
      {children}
    </View>
  );
}
function IR({ label, value }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#f5f3f0' }}>
      <Text style={{ fontSize: 12, color: '#888', fontWeight: '500', flex: 1 }}>{label}</Text>
      <Text style={{ fontSize: 12, color: '#1a1a1a', fontWeight: '700', flex: 1.4, textAlign: 'right' }}>{String(value ?? '—')}</Text>
    </View>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function NGOManagement() {
  const router = useRouter();
  const [data, setData]         = useState(NGOS);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('All');
  const [type, setType]         = useState('All');
  const [sort, setSort]         = useState('Name ↑');
  const [showSort, setShowSort] = useState(false);
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState([]);
  const [detail, setDetail]     = useState(null);

  let filtered = data.filter(n => {
    const q = search.toLowerCase();
    const matchQ = n.name.toLowerCase().includes(q) ||
      n.registrationNo.toLowerCase().includes(q) ||
      n.city.toLowerCase().includes(q) || n.id.toLowerCase().includes(q);
    return matchQ && (status === 'All' || n.status === status) && (type === 'All' || n.type === type);
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'Name ↑') return a.name.localeCompare(b.name);
    if (sort === 'Name ↓') return b.name.localeCompare(a.name);
    if (sort === 'Cases ↓') return b.totalCases - a.totalCases;
    if (sort === 'Beneficiaries ↓') return b.totalBeneficiaries - a.totalBeneficiaries;
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const reset      = () => setPage(1);

  const handleDelete  = id => setData(p => p.filter(n => n.id !== id));
  const handleSuspend = id => setData(p => p.map(n => n.id===id ? { ...n, status: 'Suspended' } : n));
  const handleVerify  = id => setData(p => p.map(n => n.id===id ? { ...n, verificationStatus: 'Verified', status: 'Active' } : n));

  const toggleSel = id => setSelected(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  const bulkDel   = () => { setData(p => p.filter(n => !selected.includes(n.id))); setSelected([]); };
  const bulkSusp  = () => { setData(p => p.map(n => selected.includes(n.id) ? { ...n, status: 'Suspended' } : n)); setSelected([]); };

  if (detail) return <NGODetail ngo={detail} onBack={() => setDetail(null)} />;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0533" />

      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={s.backText}>← Back</Text></TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.headerTitle}>NGO Management</Text>
          <Text style={s.headerSub}>{data.length} NGOs registered</Text>
        </View>
        <View style={[s.statusBadge, { backgroundColor: '#dbeafe' }]}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#1e40af' }}>
            {data.filter(n=>n.verificationStatus==='Pending').length} Pending
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 14 }} showsVerticalScrollIndicator={false}>

        <View style={s.searchBox}>
          <Text>🔍</Text>
          <TextInput style={s.searchInput} placeholderTextColor="#bbb"
            placeholder="Search NGO name, ID, city..."
            value={search} onChangeText={t => { setSearch(t); reset(); }} />
          {search ? <TouchableOpacity onPress={() => { setSearch(''); reset(); }}><Text style={s.clearX}>✕</Text></TouchableOpacity> : null}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow}>
          {STATUSES.map(st => (
            <TouchableOpacity key={st} style={[s.chip, status===st && s.chipActive]} onPress={() => { setStatus(st); reset(); }}>
              <Text style={[s.chipTxt, status===st && s.chipTxtActive]}>{st}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[s.filterRow, { marginTop: 4 }]}>
          {TYPES.map(t => (
            <TouchableOpacity key={t} style={[s.chip, type===t && s.chipType]} onPress={() => { setType(t); reset(); }}>
              <Text style={[s.chipTxt, type===t && s.chipTxtActive]}>🏢 {t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={s.toolRow}>
          <Text style={s.resultCount}>{filtered.length} results</Text>
          <TouchableOpacity style={s.sortBtn} onPress={() => setShowSort(p=>!p)}>
            <Text style={s.sortBtnTxt}>Sort: {sort} ▾</Text>
          </TouchableOpacity>
        </View>
        {showSort && (
          <View style={s.sortMenu}>
            {SORT_OPTIONS.map(o => (
              <TouchableOpacity key={o} style={s.sortOpt} onPress={() => { setSort(o); setShowSort(false); }}>
                <Text style={[s.sortOptTxt, sort===o && { color: '#1A0533', fontWeight: '800' }]}>{o}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selected.length > 0 && (
          <View style={s.bulkBar}>
            <Text style={s.bulkCount}>{selected.length} selected</Text>
            <TouchableOpacity style={s.bulkBtn} onPress={bulkSusp}><Text style={s.bulkBtnTxt}>Suspend</Text></TouchableOpacity>
            <TouchableOpacity style={[s.bulkBtn, { backgroundColor: '#fee2e2' }]} onPress={bulkDel}>
              <Text style={[s.bulkBtnTxt, { color: '#991b1b' }]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelected([])}><Text style={s.bulkClear}>✕</Text></TouchableOpacity>
          </View>
        )}

        {paginated.length === 0
          ? <View style={s.empty}><Text style={s.emptyTxt}>No NGOs found</Text></View>
          : paginated.map(n => {
            const sc  = statusColors[n.status]             || { bg: '#f3f4f6', text: '#374151' };
            const vc  = statusColors[n.verificationStatus] || { bg: '#f3f4f6', text: '#374151' };
            const sel = selected.includes(n.id);
            const ini = n.name.split(' ').map(w=>w[0]).join('').slice(0,2);
            return (
              <View key={n.id} style={[s.card, sel && s.cardSel]}>
                <View style={s.cardTop}>
                  <TouchableOpacity onPress={() => toggleSel(n.id)} style={{ marginRight: 8, marginTop: 2 }}>
                    <Text style={{ fontSize: 16 }}>{sel ? '☑' : '☐'}</Text>
                  </TouchableOpacity>
                  <View style={s.avatar}>
                    <Text style={s.avatarTxt}>{ini}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardName}>{n.name}</Text>
                    <Text style={s.cardSub}>{n.id} · {n.type}</Text>
                    <Text style={s.cardSub}>📍 {n.city}</Text>
                  </View>
                  <View style={{ gap: 4, alignItems: 'flex-end' }}>
                    <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
                      <Text style={[s.statusTxt, { color: sc.text }]}>{n.status}</Text>
                    </View>
                    <View style={[s.statusBadge, { backgroundColor: vc.bg }]}>
                      <Text style={[s.statusTxt, { color: vc.text }]}>{n.verificationStatus}</Text>
                    </View>
                  </View>
                </View>

                <View style={s.statsRow}>
                  {[
                    { l: 'Cases',    v: n.totalCases },
                    { l: 'People',   v: n.totalBeneficiaries },
                    { l: 'Lawyers',  v: n.totalLawyers },
                    { l: 'Programs', v: n.activePrograms },
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

                <View style={s.actions}>
                  <TouchableOpacity style={s.actView} onPress={() => setDetail(n)}>
                    <Text style={s.actViewTxt}>View</Text>
                  </TouchableOpacity>
                  {n.verificationStatus !== 'Verified' && (
                    <TouchableOpacity style={s.actVerify} onPress={() => handleVerify(n.id)}>
                      <Text style={s.actVerifyTxt}>✓ Verify</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={s.actSuspend} onPress={() => handleSuspend(n.id)}>
                    <Text style={s.actSuspendTxt}>Suspend</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actDelete} onPress={() => handleDelete(n.id)}>
                    <Text style={s.actDeleteTxt}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        }

        {totalPages > 1 && (
          <View style={s.pager}>
            <TouchableOpacity style={[s.pageBtn, page===1 && s.pageDis]} disabled={page===1} onPress={() => setPage(p=>p-1)}>
              <Text style={s.pageBtnTxt}>← Prev</Text>
            </TouchableOpacity>
            {Array.from({ length: totalPages }, (_,i) => i+1).map(pg => (
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

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#f5f3ef' },
  header:       { backgroundColor: '#1A0533', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' },
  backText:     { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  headerTitle:  { fontSize: 15, fontWeight: '800', color: '#fff' },
  headerSub:    { fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  statusBadge:  { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusTxt:    { fontSize: 10, fontWeight: '700' },
  searchBox:    { backgroundColor: '#fff', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 12, borderWidth: 1, borderColor: '#ece9e4' },
  searchInput:  { flex: 1, fontSize: 13, color: '#1a1a1a', paddingVertical: 12, marginLeft: 8 },
  clearX:       { fontSize: 14, color: '#bbb', paddingLeft: 8 },
  filterRow:    { marginBottom: 8 },
  chip:         { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8, borderWidth: 1, borderColor: '#ece9e4' },
  chipActive:   { backgroundColor: '#1A0533', borderColor: '#1A0533' },
  chipType:     { backgroundColor: '#0F2744', borderColor: '#0F2744' },
  chipTxt:      { fontSize: 12, fontWeight: '600', color: '#666' },
  chipTxtActive:{ color: '#fff' },
  toolRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  resultCount:  { fontSize: 11, color: '#999' },
  sortBtn:      { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#ece9e4' },
  sortBtnTxt:   { fontSize: 12, fontWeight: '600', color: '#1A0533' },
  sortMenu:     { backgroundColor: '#fff', borderRadius: 14, padding: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ece9e4' },
  sortOpt:      { paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f5f3f0' },
  sortOptTxt:   { fontSize: 13, color: '#555' },
  bulkBar:      { backgroundColor: '#1A0533', borderRadius: 14, flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 10, gap: 8 },
  bulkCount:    { color: '#fff', fontSize: 12, fontWeight: '700', flex: 1 },
  bulkBtn:      { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  bulkBtnTxt:   { fontSize: 11, fontWeight: '700', color: '#fff' },
  bulkClear:    { color: 'rgba(255,255,255,0.6)', fontSize: 16 },
  empty:        { alignItems: 'center', padding: 40 },
  emptyTxt:     { color: '#bbb', fontSize: 14 },
  card:         { backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#ece9e4' },
  cardSel:      { borderColor: '#1A0533', borderWidth: 2 },
  cardTop:      { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  avatar:       { width: 42, height: 42, borderRadius: 12, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarTxt:    { fontSize: 13, fontWeight: '800', color: '#0F2744' },
  cardName:     { fontSize: 14, fontWeight: '800', color: '#1a1a1a' },
  cardSub:      { fontSize: 11, color: '#888', marginTop: 2 },
  statsRow:     { flexDirection: 'row', backgroundColor: '#f9f8f6', borderRadius: 12, padding: 10, marginBottom: 12, alignItems: 'center' },
  statItem:     { flex: 1, alignItems: 'center' },
  statVal:      { fontSize: 13, fontWeight: '800', color: '#1a1a1a' },
  statLbl:      { fontSize: 10, color: '#999', marginTop: 2 },
  statDiv:      { width: 1, height: 24, backgroundColor: '#ece9e4' },
  actions:      { flexDirection: 'row', gap: 8 },
  actView:      { flex: 1, backgroundColor: '#f0ece8', borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  actViewTxt:   { fontSize: 12, fontWeight: '700', color: '#5C1A1A' },
  actVerify:    { flex: 1, backgroundColor: '#1A0533', borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  actVerifyTxt: { fontSize: 12, fontWeight: '700', color: '#fff' },
  actSuspend:   { flex: 1, backgroundColor: '#fef3c7', borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  actSuspendTxt:{ fontSize: 12, fontWeight: '700', color: '#92400e' },
  actDelete:    { backgroundColor: '#fee2e2', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center' },
  actDeleteTxt: { fontSize: 14, fontWeight: '800', color: '#991b1b' },
  pager:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginVertical: 16 },
  pageBtn:      { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: '#ece9e4' },
  pageDis:      { opacity: 0.4 },
  pageBtnTxt:   { fontSize: 12, fontWeight: '600', color: '#1A0533' },
  pageNum:      { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ece9e4' },
  pageNumAct:   { backgroundColor: '#1A0533', borderColor: '#1A0533' },
  pageNumTxt:   { fontSize: 12, fontWeight: '700', color: '#666' },
  pageNumActTxt:{ color: '#fff' },
  tabBar:       { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ece9e4' },
  tabItem:      { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive:    { borderBottomWidth: 2, borderBottomColor: '#1A0533' },
  tabTxt:       { fontSize: 11, fontWeight: '600', color: '#bbb' },
  tabTxtActive: { color: '#1A0533' },
  perfGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  perfCard:     { backgroundColor: '#f9f8f6', borderRadius: 14, padding: 14, width: (width - 76) / 2, borderWidth: 1, borderColor: '#ece9e4', overflow: 'hidden' },
  perfAccent:   { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  perfVal:      { fontSize: 22, fontWeight: '800', color: '#1a1a1a', marginTop: 8 },
  perfLbl:      { fontSize: 11, color: '#888', marginTop: 4 },
  bigBtn:       { borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 8 },
  bigBtnTxt:    { fontSize: 13, fontWeight: '700' },
});
