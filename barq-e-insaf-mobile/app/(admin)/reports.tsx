import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';

export default function ReportsScreen() {
  const { reports } = useStore();
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Reports</Text>
      <Text style={s.sub}>{reports.length} reports</Text>
      {reports.map(r => (
        <GlassCard key={r.id} style={s.card}>
          <View style={s.row}><Text style={s.mono}>{r.id}</Text><StatusBadge status={r.status} /></View>
          <Text style={s.reason}>{r.reason}</Text>
          <View style={s.mr}>
            <View style={s.mi}><Text style={s.ml}>Type</Text><Text style={s.mv}>{r.type}</Text></View>
            <View style={s.mi}><Text style={s.ml}>Reported</Text><Text style={s.mv}>{r.reportedEntity}</Text></View>
            <View style={s.mi}><Text style={s.ml}>By</Text><Text style={s.mv}>{r.reportedBy}</Text></View>
          </View>
        </GlassCard>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg }, p: { padding: 16 },
  t: { fontSize: 20, fontWeight: '700', color: '#fff' }, sub: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  card: { marginBottom: 10 }, row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mono: { fontSize: 12, fontWeight: '600', color: Colors.textDimmer, fontFamily: 'monospace' },
  reason: { fontSize: 13, color: Colors.text, marginBottom: 10, lineHeight: 18 },
  mr: { flexDirection: 'row', gap: 12 }, mi: { flex: 1 },
  ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
});
