import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, StyleSheet, ActivityIndicator, TextInput, RefreshControl,
} from 'react-native';
import AdminSidebar from './AdminSidebar';
import api from '../../services/api';

const statusColors = {
  active:    { bg: '#dbeafe', text: '#1d4ed8' },
  completed: { bg: '#dcfce7', text: '#15803d' },
  pending:   { bg: '#fef3c7', text: '#92400e' },
  closed:    { bg: '#f1f5f9', text: '#475569' },
};

export default function CasesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchCases = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get('/admin/cases');
      setCases(res.data || []);
    } catch (err) {
      console.error('CasesPage fetch error:', err);
      setError('Cases load nahi ho sake. Dobara try karein.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  const onRefresh = () => { setRefreshing(true); fetchCases(); };

  const STATUSES = ['All', 'active', 'pending', 'completed', 'closed'];

  const filteredCases = cases.filter((c) => {
    const matchStatus = statusFilter === 'All' || (c.status || '').toLowerCase() === statusFilter;
    const searchLower = search.toLowerCase();
    const matchSearch = !search ||
      (c.title || '').toLowerCase().includes(searchLower) ||
      (c.citizen?.name || '').toLowerCase().includes(searchLower) ||
      (c.lawyer?.user?.name || '').toLowerCase().includes(searchLower) ||
      (c.type || '').toLowerCase().includes(searchLower) ||
      (c.district || '').toLowerCase().includes(searchLower) ||
      (c.id || '').toLowerCase().includes(searchLower);
    return matchStatus && matchSearch;
  });

  const statusCount = (s) => s === 'All' ? cases.length : cases.filter(c => (c.status || '').toLowerCase() === s).length;

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ color: '#64748b', marginTop: 12 }}>Loading cases...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="cases" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <ScrollView
          style={styles.mainContent}
          contentContainerStyle={styles.contentPadding}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />}
        >
          {/* HEADER */}
          <View style={styles.headerBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 54 }}>
              <View>
                <Text style={styles.headerTitle}>📁 Cases Management</Text>
                <Text style={styles.headerSub}>
                  {cases.length} total cases — monitor platform legal proceedings
                </Text>
              </View>
            </View>
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={fetchCases}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
            </View>
          )}

          {/* SEARCH */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search by case ID, title, citizen, lawyer, district..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />

          {/* STATUS FILTER */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            {STATUSES.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.filterTab, statusFilter === s && styles.filterTabActive]}
                onPress={() => setStatusFilter(s)}
              >
                <Text style={[styles.filterTabText, statusFilter === s && styles.filterTabTextActive]}>
                  {s === 'All' ? `All (${statusCount('All')})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${statusCount(s)})`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* CASES LIST */}
          <View style={styles.listSection}>
            {filteredCases.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={{ fontSize: 36, marginBottom: 8 }}>📂</Text>
                <Text style={styles.emptyText}>
                  {cases.length === 0 ? 'Koi case abhi tak darj nahi hua.' : 'Is filter mein koi case nahi mila.'}
                </Text>
              </View>
            ) : (
              filteredCases.map((c) => {
                const statusKey = (c.status || 'pending').toLowerCase();
                const sc = statusColors[statusKey] || statusColors.pending;
                return (
                  <View key={c.id} style={styles.card}>
                    <View style={styles.cardTop}>
                      <Text style={styles.monoId} numberOfLines={1}>
                        {c.id ? c.id.slice(0, 8).toUpperCase() + '...' : '—'}
                      </Text>
                      <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                        <Text style={[styles.badgeText, { color: sc.text }]}>
                          {statusKey.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {c.title || c.type || 'Untitled Case'}
                    </Text>

                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>👤 Citizen</Text>
                        <Text style={styles.metaValue}>{c.citizen?.name || '—'}</Text>
                        <Text style={styles.metaEmail}>{c.citizen?.email || '—'}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>⚖️ Lawyer</Text>
                        <Text style={styles.metaValue}>{c.lawyer?.user?.name || 'Unassigned'}</Text>
                        <Text style={styles.metaEmail}>{c.lawyer?.user?.email || '—'}</Text>
                      </View>
                    </View>

                    <View style={styles.tagsRow}>
                      {c.type && (
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>📂 {c.type}</Text>
                        </View>
                      )}
                      {c.district && (
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>📍 {c.district}</Text>
                        </View>
                      )}
                      {c.is_flagged && (
                        <View style={[styles.tag, { backgroundColor: '#fee2e2' }]}>
                          <Text style={[styles.tagText, { color: '#dc2626' }]}>🚩 Flagged</Text>
                        </View>
                      )}
                      {c.created_at && (
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>
                            📅 {new Date(c.created_at).toLocaleDateString('en-PK')}
                          </Text>
                        </View>
                      )}
                    </View>

                    {c.description && (
                      <Text style={styles.descText} numberOfLines={2}>{c.description}</Text>
                    )}
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  layoutRow: { flex: 1, flexDirection: 'row', position: 'relative' },
  mainContent: { flex: 1, backgroundColor: '#f8fafc', width: '100%' },
  contentPadding: { padding: 24, paddingBottom: 40 },
  headerBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0',
  },
  headerTitle: { color: '#0f172a', fontSize: 20, fontWeight: '800' },
  headerSub: { color: '#475569', fontSize: 12, marginTop: 2 },
  errorBanner: {
    backgroundColor: '#fef2f2', borderRadius: 10, padding: 14, marginBottom: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#fca5a5',
  },
  errorText: { color: '#dc2626', fontSize: 13, flex: 1 },
  retryText: { color: '#2563eb', fontWeight: '700', marginLeft: 12 },
  searchInput: {
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 13, color: '#0f172a', marginBottom: 12,
  },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 8,
  },
  filterTabActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  filterTabText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  filterTabTextActive: { color: '#ffffff' },
  listSection: { gap: 12 },
  emptyCard: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 40,
    alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0',
  },
  emptyText: { color: '#64748b', fontSize: 14, textAlign: 'center' },
  card: {
    backgroundColor: '#ffffff', borderRadius: 16, borderLeftWidth: 4,
    borderLeftColor: '#2563eb', padding: 18, marginBottom: 4,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  monoId: { color: '#64748b', fontSize: 11, fontWeight: '700', fontFamily: 'monospace', flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  cardTitle: { color: '#0f172a', fontSize: 15, fontWeight: '800', marginBottom: 12 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  metaItem: { flex: 1 },
  metaLabel: { color: '#64748b', fontSize: 11, fontWeight: '700', marginBottom: 2 },
  metaValue: { color: '#0f172a', fontSize: 13, fontWeight: '700' },
  metaEmail: { color: '#64748b', fontSize: 11 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tag: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { color: '#475569', fontSize: 11, fontWeight: '600' },
  descText: { color: '#64748b', fontSize: 12, fontStyle: 'italic', marginTop: 4 },
});
