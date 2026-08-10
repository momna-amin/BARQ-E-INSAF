import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';

export default function DisputesScreen() {
  const { disputes } = useStore();
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Disputes</Text>
      <Text style={s.sub}>{disputes.length} disputes</Text>
      {disputes.map(d => (
        <GlassCard key={d.id} style={s.card}>
          <View style={s.row}><Text style={s.mono}>{d.id}</Text><StatusBadge status={d.status} /></View>
          <Text style={s.reason}>{d.reason}</Text>
          <View style={s.mr}>
            <View style={s.mi}><Text style={s.ml}>Case</Text><Text style={s.mv}>{d.caseId}</Text></View>
            <View style={s.mi}><Text style={s.ml}>Raised By</Text><Text style={s.mv}>{d.raisedBy}</Text></View>
            <View style={s.mi}><Text style={s.ml}>Age</Text><Text style={s.mv}>{d.age} days</Text></View>
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
