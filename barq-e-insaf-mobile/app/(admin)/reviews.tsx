import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable, Alert } from 'react-native';
import { Star, Trash2, Flag } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { StaggerIn } from '@/components/admin/StaggerIn';

const STATUS_FILTERS = ['All', 'Published', 'Flagged'];

export default function ReviewsScreen() {
  const { reviews, updateReview } = useStore();
  const [filter, setFilter] = useState('All');
  const [confirm, setConfirm] = useState<{
    open: boolean; reviewId: string; action: 'remove' | 'flag' | 'unflag';
  }>({ open: false, reviewId: '', action: 'remove' });

  const filtered = reviews.filter(r => filter === 'All' || r.status === filter);

  function doAction(reason?: string) {
    const sm = { remove: 'Removed', flag: 'Flagged', unflag: 'Published' } as const;
    const newSt = sm[confirm.action];
    updateReview(confirm.reviewId, { status: newSt });
    Alert.alert(
      'Review Updated',
      `Review "${confirm.reviewId}" has been set to ${newSt}.${reason ? '\n\nReason: ' + reason : ''}`
    );
  }

  const configs = {
    remove: { label: 'Remove Review', variant: 'danger' as const, desc: 'This review will be permanently removed from the platform.' },
    flag: { label: 'Flag Review', variant: 'warning' as const, desc: 'Review will be flagged for further investigation.' },
    unflag: { label: 'Unflag Review', variant: 'success' as const, desc: 'Review will be restored to Published status.' },
  };
  const cfg = configs[confirm.action];

  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Reviews</Text>
      <Text style={s.sub}>
        {reviews.length} total · {reviews.filter(r => r.status === 'Flagged').length} flagged
      </Text>

      <View style={s.filterRow}>
        {STATUS_FILTERS.map(f => (
          <Pressable key={f} onPress={() => setFilter(f)}
            style={[s.chip, filter === f && s.chipActive]}>
            <Text style={[s.chipText, filter === f && s.chipTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      {filtered.map((r, i) => (
        <StaggerIn key={r.id} index={i}>
          <GlassCard style={s.card}>
            <View style={s.row}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                {Array.from({ length: 5 }, (_, j) => (
                  <Star key={j} size={12}
                    color={j < r.rating ? '#fbbf24' : 'rgba(255,255,255,0.1)'}
                    fill={j < r.rating ? '#fbbf24' : 'transparent'} />
                ))}
                <Text style={s.ratingText}>{r.rating}/5</Text>
              </View>
              <StatusBadge status={r.status} />
            </View>
            <Text style={s.snippet}>"{r.snippet}"</Text>
            <View style={s.mr}>
              <View style={s.mi}><Text style={s.ml}>Reviewer</Text><Text style={s.mv}>{r.reviewer}</Text></View>
              <View style={s.mi}><Text style={s.ml}>Lawyer</Text><Text style={s.mv}>{r.lawyer}</Text></View>
              <View style={s.mi}><Text style={s.ml}>Date</Text><Text style={s.mv}>{r.date}</Text></View>
            </View>

            <View style={s.actions}>
              {r.status === 'Published' && (
                <TouchableOpacity style={s.btnWarning} activeOpacity={0.7}
                  onPress={() => setConfirm({ open: true, reviewId: r.id, action: 'flag' })}>
                  <Flag size={12} color="#fff" />
                  <Text style={s.btnTxt}>Flag</Text>
                </TouchableOpacity>
              )}
              {r.status === 'Flagged' && (
                <TouchableOpacity style={s.btnSuccess} activeOpacity={0.7}
                  onPress={() => setConfirm({ open: true, reviewId: r.id, action: 'unflag' })}>
                  <Text style={s.btnTxt}>Restore</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={s.btnDanger} activeOpacity={0.7}
                onPress={() => setConfirm({ open: true, reviewId: r.id, action: 'remove' })}>
                <Trash2 size={12} color="#fff" />
                <Text style={s.btnTxt}>Remove</Text>
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
        requireReason={confirm.action === 'remove'}
        reasonLabel="Removal Reason"
        reasonPlaceholder="Explain why this review is being removed..."
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg }, p: { padding: 16 },
  t: { fontSize: 20, fontWeight: '700', color: '#fff' },
  sub: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  chipText: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  card: { marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ratingText: { color: Colors.textDimmer, fontSize: 11, marginLeft: 4 },
  snippet: { fontSize: 13, color: Colors.text, fontStyle: 'italic', marginBottom: 10, lineHeight: 18 },
  mr: { flexDirection: 'row', gap: 12 }, mi: { flex: 1 },
  ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  btnSuccess: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#059669', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnDanger: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#dc2626', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnWarning: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#d97706', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
