import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable, Alert,
} from 'react-native';
import { CheckCircle, XCircle, Clock } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { StaggerIn } from '@/components/admin/StaggerIn';

export default function VerificationQueueScreen() {
  const { lawyers, updateLawyer } = useStore();
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Under Review'>('all');
  const [confirm, setConfirm] = useState<{
    open: boolean; lawyerId: string; action: 'verify' | 'reject' | 'review';
  }>({ open: false, lawyerId: '', action: 'verify' });

  const queue = lawyers.filter(l =>
    l.status === 'Pending' || l.status === 'Under Review'
  ).filter(l => filter === 'all' || l.status === filter);

  function doAction(reason?: string) {
    const statusMap = { verify: 'Verified', reject: 'Rejected', review: 'Under Review' } as const;
    const newSt = statusMap[confirm.action];
    const target = lawyers.find(l => l.id === confirm.lawyerId);
    updateLawyer(confirm.lawyerId, { status: newSt });
    Alert.alert(
      'Verification Updated',
      `Advocate "${target?.name || confirm.lawyerId}" has been marked as ${newSt}.${reason ? '\n\nReason: ' + reason : ''}`
    );
  }

  const actionConfig = {
    verify: { label: 'Verify Lawyer', variant: 'success' as const, desc: 'Lawyer will be marked Verified and can accept cases on the platform.' },
    reject: { label: 'Reject Application', variant: 'danger' as const, desc: 'Application will be rejected. Lawyer can reapply after providing valid documents.' },
    review: { label: 'Move to Under Review', variant: 'warning' as const, desc: 'Lawyer will be moved to Under Review status for detailed verification.' },
  };
  const cfg = actionConfig[confirm.action];

  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Verification Queue</Text>
      <Text style={s.sub}>
        {lawyers.filter(l => l.status === 'Pending' || l.status === 'Under Review').length} lawyers awaiting review
      </Text>

      {/* Filter chips */}
      <View style={s.filterRow}>
        {(['all', 'Pending', 'Under Review'] as const).map(f => (
          <Pressable key={f} onPress={() => setFilter(f)}
            style={[s.chip, filter === f && s.chipActive]}>
            <Text style={[s.chipText, filter === f && s.chipTextActive]}>
              {f === 'all' ? 'All' : f}
            </Text>
          </Pressable>
        ))}
      </View>

      {queue.length === 0 && (
        <GlassCard style={{ alignItems: 'center', padding: 32, marginTop: 16 }}>
          <CheckCircle size={28} color={Colors.green} />
          <Text style={{ color: Colors.green, fontWeight: '700', fontSize: 16, marginTop: 10 }}>All Clear!</Text>
          <Text style={{ color: Colors.textDim, fontSize: 13, marginTop: 4 }}>No lawyers pending verification</Text>
        </GlassCard>
      )}

      {queue.map((l, i) => (
        <StaggerIn key={l.id} index={i}>
          <GlassCard style={s.card}>
            <View style={s.row}>
              <View style={s.avatar}><Text style={s.avt}>{l.name.charAt(0)}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{l.name}</Text>
                <Text style={s.email}>{l.email}</Text>
              </View>
              <StatusBadge status={l.status} />
            </View>

            <View style={s.mr}>
              <View style={s.mi}>
                <Text style={s.ml}>Specialty</Text>
                <Text style={s.mv}>{l.specialty}</Text>
              </View>
              <View style={s.mi}>
                <Text style={s.ml}>License</Text>
                <Text style={s.mv}>{l.license}</Text>
              </View>
              <View style={s.mi}>
                <Text style={s.ml}>Experience</Text>
                <Text style={s.mv}>{l.experience} yrs</Text>
              </View>
            </View>

            <View style={s.mr}>
              <View style={s.mi}>
                <Text style={s.ml}>City</Text>
                <Text style={s.mv}>{l.city}</Text>
              </View>
              <View style={s.mi}>
                <Text style={s.ml}>Bar Council</Text>
                <Text style={s.mv}>{l.barCouncil}</Text>
              </View>
            </View>

            <View style={s.actions}>
              <TouchableOpacity style={s.btnSuccess} activeOpacity={0.7}
                onPress={() => setConfirm({ open: true, lawyerId: l.id, action: 'verify' })}>
                <CheckCircle size={12} color="#fff" />
                <Text style={s.btnTxt}>Verify</Text>
              </TouchableOpacity>
              {l.status === 'Pending' && (
                <TouchableOpacity style={s.btnWarning} activeOpacity={0.7}
                  onPress={() => setConfirm({ open: true, lawyerId: l.id, action: 'review' })}>
                  <Clock size={12} color="#fff" />
                  <Text style={s.btnTxt}>Under Review</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={s.btnDanger} activeOpacity={0.7}
                onPress={() => setConfirm({ open: true, lawyerId: l.id, action: 'reject' })}>
                <XCircle size={12} color="#fff" />
                <Text style={s.btnTxt}>Reject</Text>
              </TouchableOpacity>
            </View>
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
        requireReason={confirm.action === 'reject'}
        reasonLabel="Rejection Reason"
        reasonPlaceholder="Explain why the application is being rejected..."
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg },
  p: { padding: 16 },
  t: { fontSize: 20, fontWeight: '700', color: '#fff' },
  sub: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  chipText: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.brand, justifyContent: 'center', alignItems: 'center' },
  avt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  name: { fontSize: 14, fontWeight: '600', color: Colors.text },
  email: { fontSize: 12, color: Colors.textDimmer },
  mr: { flexDirection: 'row', gap: 12, marginTop: 8 },
  mi: { flex: 1 },
  ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  btnSuccess: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#059669', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnDanger: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#dc2626', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnWarning: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#d97706', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
