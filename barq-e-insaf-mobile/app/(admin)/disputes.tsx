import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { CheckCircle, XCircle, ArrowUpCircle } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { StaggerIn } from '@/components/admin/StaggerIn';

const STATUS_FILTERS = ['All', 'Open', 'Under Review', 'Waiting for Info', 'Resolved', 'Rejected', 'Escalated'];

export default function DisputesScreen() {
  const { disputes, updateDispute } = useStore();
  const [statusFilter, setStatusFilter] = useState('All');
  const [confirm, setConfirm] = useState<{
    open: boolean; disputeId: string; action: 'resolve' | 'reject' | 'escalate' | 'review';
  }>({ open: false, disputeId: '', action: 'resolve' });

  const filtered = disputes.filter(d =>
    statusFilter === 'All' || d.status === statusFilter
  );

  function doAction(reason?: string) {
    const statusMap = {
      resolve: 'Resolved', reject: 'Rejected', escalate: 'Escalated', review: 'Under Review',
    } as const;
    updateDispute(confirm.disputeId, { status: statusMap[confirm.action] });
  }

  const configs = {
    resolve: { label: 'Resolve Dispute', variant: 'success' as const, desc: 'This dispute will be marked as Resolved. All parties will be notified.' },
    reject: { label: 'Reject Dispute', variant: 'danger' as const, desc: 'This dispute will be rejected as it does not meet the criteria for platform intervention.' },
    escalate: { label: 'Escalate Dispute', variant: 'warning' as const, desc: 'Dispute will be escalated to senior review team.' },
    review: { label: 'Move to Under Review', variant: 'warning' as const, desc: 'Dispute will be flagged for active investigation.' },
  };
  const cfg = configs[confirm.action];

  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Disputes</Text>
      <Text style={s.sub}>
        {disputes.length} total · {disputes.filter(d => d.status === 'Open').length} open
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterRow}>
        {STATUS_FILTERS.map(f => (
          <Pressable key={f} onPress={() => setStatusFilter(f)}
            style={[s.chip, statusFilter === f && s.chipActive]}>
            <Text style={[s.chipText, statusFilter === f && s.chipTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={s.count}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</Text>

      {filtered.map((d, i) => (
        <StaggerIn key={d.id} index={i}>
          <GlassCard style={s.card}>
            <View style={s.head}>
              <Text style={s.mono}>{d.id}</Text>
              <StatusBadge status={d.status} />
            </View>
            <Text style={s.reason}>{d.reason}</Text>
            <View style={s.mr}>
              <View style={s.mi}><Text style={s.ml}>Case</Text><Text style={s.mv}>{d.caseId}</Text></View>
              <View style={s.mi}><Text style={s.ml}>Raised By</Text><Text style={s.mv}>{d.raisedBy}</Text></View>
              <View style={s.mi}><Text style={s.ml}>Age</Text><Text style={s.mv}>{d.age} days</Text></View>
            </View>

            {(d.status === 'Open' || d.status === 'Under Review' || d.status === 'Waiting for Info') && (
              <View style={s.actions}>
                {d.status === 'Open' && (
                  <TouchableOpacity style={s.btnWarning} activeOpacity={0.7}
                    onPress={() => setConfirm({ open: true, disputeId: d.id, action: 'review' })}>
                    <Text style={s.btnTxt}>Investigate</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={s.btnSuccess} activeOpacity={0.7}
                  onPress={() => setConfirm({ open: true, disputeId: d.id, action: 'resolve' })}>
                  <CheckCircle size={12} color="#fff" />
                  <Text style={s.btnTxt}>Resolve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnDanger} activeOpacity={0.7}
                  onPress={() => setConfirm({ open: true, disputeId: d.id, action: 'reject' })}>
                  <XCircle size={12} color="#fff" />
                  <Text style={s.btnTxt}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnGhost} activeOpacity={0.7}
                  onPress={() => setConfirm({ open: true, disputeId: d.id, action: 'escalate' })}>
                  <ArrowUpCircle size={12} color="rgba(255,255,255,0.5)" />
                  <Text style={s.btnTxtGhost}>Escalate</Text>
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
        requireReason={confirm.action === 'reject' || confirm.action === 'escalate'}
        reasonLabel="Reason"
        reasonPlaceholder="Provide reason..."
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
  mono: { fontSize: 12, fontWeight: '600', color: Colors.textDimmer },
  reason: { fontSize: 13, color: Colors.text, marginBottom: 10, lineHeight: 18 },
  mr: { flexDirection: 'row', gap: 12 }, mi: { flex: 1 },
  ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.borderLight, flexWrap: 'wrap' },
  btnSuccess: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#059669', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnDanger: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#dc2626', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnWarning: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#d97706', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnGhost: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  btnTxtGhost: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700' },
});
