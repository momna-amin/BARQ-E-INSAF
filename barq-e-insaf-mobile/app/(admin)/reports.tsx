import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { CheckCircle, XCircle } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { StaggerIn } from '@/components/admin/StaggerIn';

const STATUS_FILTERS = ['All', 'New', 'Investigating', 'Resolved', 'Dismissed'];

export default function ReportsScreen() {
  const { reports, updateReport } = useStore();
  const [filter, setFilter] = useState('All');
  const [confirm, setConfirm] = useState<{
    open: boolean; reportId: string; action: 'resolve' | 'dismiss' | 'investigate';
  }>({ open: false, reportId: '', action: 'investigate' });

  const filtered = reports.filter(r => filter === 'All' || r.status === filter);

  function doAction(reason?: string) {
    const sm = { resolve: 'Resolved', dismiss: 'Dismissed', investigate: 'Investigating' } as const;
    updateReport(confirm.reportId, { status: sm[confirm.action] });
  }

  const configs = {
    investigate: { label: 'Start Investigation', variant: 'warning' as const, desc: 'Report will be moved to Investigating status.' },
    resolve: { label: 'Resolve Report', variant: 'success' as const, desc: 'Report will be marked as Resolved and archived.' },
    dismiss: { label: 'Dismiss Report', variant: 'danger' as const, desc: 'Report will be dismissed. Provide reason below.' },
  };
  const cfg = configs[confirm.action];

  const typeColors: Record<string, string> = {
    Lawyer: '#60a5fa', Review: '#f59e0b', Fraud: '#ef4444',
  };

  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Reports</Text>
      <Text style={s.sub}>
        {reports.length} total · {reports.filter(r => r.status === 'New').length} new
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow}>
        {STATUS_FILTERS.map(f => (
          <Pressable key={f} onPress={() => setFilter(f)}
            style={[s.chip, filter === f && s.chipActive]}>
            <Text style={[s.chipText, filter === f && s.chipTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={s.count}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</Text>

      {filtered.map((r, i) => (
        <StaggerIn key={r.id} index={i}>
          <GlassCard style={s.card}>
            <View style={s.head}>
              <View style={[s.typePill, { backgroundColor: (typeColors[r.type] ?? '#9ca3af') + '22' }]}>
                <Text style={[s.typeText, { color: typeColors[r.type] ?? '#9ca3af' }]}>{r.type}</Text>
              </View>
              <StatusBadge status={r.status} />
            </View>
            <Text style={s.mono}>{r.id}</Text>
            <Text style={s.reason}>{r.reason}</Text>
            <View style={s.mr}>
              <View style={s.mi}><Text style={s.ml}>Entity</Text><Text style={s.mv} numberOfLines={1}>{r.reportedEntity}</Text></View>
              <View style={s.mi}><Text style={s.ml}>Reported By</Text><Text style={s.mv} numberOfLines={1}>{r.reportedBy}</Text></View>
              <View style={s.mi}><Text style={s.ml}>Date</Text><Text style={s.mv}>{r.date}</Text></View>
            </View>

            {(r.status === 'New' || r.status === 'Investigating') && (
              <View style={s.actions}>
                {r.status === 'New' && (
                  <TouchableOpacity style={s.btnWarning} activeOpacity={0.7}
                    onPress={() => setConfirm({ open: true, reportId: r.id, action: 'investigate' })}>
                    <Text style={s.btnTxt}>Investigate</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={s.btnSuccess} activeOpacity={0.7}
                  onPress={() => setConfirm({ open: true, reportId: r.id, action: 'resolve' })}>
                  <CheckCircle size={12} color="#fff" />
                  <Text style={s.btnTxt}>Resolve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnDanger} activeOpacity={0.7}
                  onPress={() => setConfirm({ open: true, reportId: r.id, action: 'dismiss' })}>
                  <XCircle size={12} color="#fff" />
                  <Text style={s.btnTxt}>Dismiss</Text>
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
        requireReason={confirm.action === 'dismiss'}
        reasonLabel="Dismissal Reason"
        reasonPlaceholder="Why is this report being dismissed?"
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg }, p: { padding: 16 },
  t: { fontSize: 20, fontWeight: '700', color: '#fff' },
  sub: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  filterRow: { marginBottom: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, marginRight: 8, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  chipText: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  count: { color: Colors.textDimmest, fontSize: 11, fontWeight: '600', marginBottom: 10 },
  card: { marginBottom: 10 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  typeText: { fontSize: 11, fontWeight: '700' },
  mono: { fontSize: 12, fontWeight: '600', color: Colors.textDimmer, marginBottom: 6 },
  reason: { fontSize: 13, color: Colors.text, marginBottom: 10, lineHeight: 18 },
  mr: { flexDirection: 'row', gap: 12 }, mi: { flex: 1 },
  ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.borderLight, flexWrap: 'wrap' },
  btnSuccess: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#059669', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnDanger: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#dc2626', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnWarning: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#d97706', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
