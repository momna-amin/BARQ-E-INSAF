import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput, Pressable, TouchableOpacity, Alert,
} from 'react-native';
import { Search, XCircle, PauseCircle } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { StaggerIn } from '@/components/admin/StaggerIn';

const STATUS_FILTERS = ['All', 'Active', 'Matching', 'Submitted', 'On Hold', 'Completed', 'Cancelled', 'Disputed'];

export default function CasesScreen() {
  const { cases, updateCase } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [confirm, setConfirm] = useState<{
    open: boolean; caseId: string; action: 'hold' | 'cancel';
  }>({ open: false, caseId: '', action: 'hold' });

  const filtered = cases.filter(c => {
    const matchSearch = !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.client.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function doAction(reason?: string) {
    const sm = { hold: 'On Hold', cancel: 'Cancelled' } as const;
    const newSt = sm[confirm.action];
    updateCase(confirm.caseId, { status: newSt });
    Alert.alert(
      'Case Status Updated',
      `Case "${confirm.caseId}" status changed to ${newSt}.${reason ? '\n\nReason: ' + reason : ''}`
    );
  }

  const configs = {
    hold: { label: 'Put Case On Hold', variant: 'warning' as const, desc: 'Case activity will be paused. Lawyer and client will be notified.' },
    cancel: { label: 'Cancel Case', variant: 'danger' as const, desc: 'Case will be permanently cancelled. This action cannot be undone.' },
  };
  const cfg = configs[confirm.action];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Cases</Text>
      <Text style={s.sub}>
        {cases.length} total · {cases.filter(c => c.status === 'Active').length} active ·{' '}
        {cases.filter(c => c.status === 'Disputed').length} disputed
      </Text>

      <View style={s.searchBox}>
        <Search size={14} color={Colors.textDimmest} />
        <TextInput value={search} onChangeText={setSearch}
          placeholder="Search by ID, client or category..."
          placeholderTextColor={Colors.textGhost}
          style={s.searchInput} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow}>
        {STATUS_FILTERS.map(f => (
          <Pressable key={f} onPress={() => setStatusFilter(f)}
            style={[s.chip, statusFilter === f && s.chipActive]}>
            <Text style={[s.chipText, statusFilter === f && s.chipTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={s.count}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</Text>

      {filtered.map((c, i) => (
        <StaggerIn key={c.id} index={i}>
          <GlassCard style={s.card}>
            <View style={s.row}>
              <Text style={s.mono}>{c.id}</Text>
              <StatusBadge status={c.status} />
            </View>
            <View style={s.metaRow}>
              <View style={s.mi}><Text style={s.ml}>Client</Text><Text style={s.mv}>{c.client}</Text></View>
              <View style={s.mi}><Text style={s.ml}>Lawyer</Text><Text style={s.mv}>{c.lawyer || 'Unassigned'}</Text></View>
            </View>
            <View style={s.metaRow}>
              <View style={s.mi}><Text style={s.ml}>Category</Text><Text style={s.mv}>{c.category} / {c.subcategory}</Text></View>
              <View style={s.mi}><Text style={s.ml}>District</Text><Text style={s.mv}>{c.district}</Text></View>
            </View>
            <View style={s.metaRow}>
              <View style={s.mi}><Text style={s.ml}>Created</Text><Text style={s.mv}>{c.created}</Text></View>
              <View style={s.mi}><Text style={s.ml}>Updated</Text><Text style={s.mv}>{c.updated}</Text></View>
            </View>

            {(c.status === 'Active' || c.status === 'Matching' || c.status === 'Submitted') && (
              <View style={s.actions}>
                <TouchableOpacity style={s.btnWarning} activeOpacity={0.7}
                  onPress={() => setConfirm({ open: true, caseId: c.id, action: 'hold' })}>
                  <PauseCircle size={12} color="#fff" />
                  <Text style={s.btnTxt}>On Hold</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnDanger} activeOpacity={0.7}
                  onPress={() => setConfirm({ open: true, caseId: c.id, action: 'cancel' })}>
                  <XCircle size={12} color="#fff" />
                  <Text style={s.btnTxt}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </GlassCard>
        </StaggerIn>
      ))}

      <View style={{ height: 40 }} />

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm(c => ({ ...c, open: false }))}
        onConfirm={doAction}
        title={cfg.label}
        description={cfg.desc}
        confirmLabel={cfg.label}
        confirmVariant={cfg.variant}
        requireReason={confirm.action === 'cancel'}
        reasonLabel="Cancellation Reason"
        reasonPlaceholder="Provide reason for cancellation..."
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg }, content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff' },
  sub: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#fff' },
  filterRow: { marginBottom: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, marginRight: 8, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  chipText: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  count: { color: Colors.textDimmest, fontSize: 11, fontWeight: '600', marginBottom: 10 },
  card: { marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  mono: { fontSize: 12, fontWeight: '600', color: Colors.textDimmer },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  mi: { flex: 1 },
  ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  btnWarning: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#d97706', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnDanger: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#dc2626', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
