import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';
import { formatDateTime } from '@/lib/utils';

export default function AppointmentsScreen() {
  const { appointments } = useStore();
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Appointments</Text>
      <Text style={s.sub}>{appointments.length} appointments</Text>
      {appointments.map(a => (
        <GlassCard key={a.id} style={s.card}>
          <View style={s.row}><Text style={s.mono}>{a.id}</Text><StatusBadge status={a.status} /></View>
          <View style={s.mr}>
            <View style={s.mi}><Text style={s.ml}>Client</Text><Text style={s.mv}>{a.client}</Text></View>
            <View style={s.mi}><Text style={s.ml}>Lawyer</Text><Text style={s.mv}>{a.lawyer}</Text></View>
          </View>
          <View style={s.mr}>
            <View style={s.mi}><Text style={s.ml}>Date</Text><Text style={s.mv}>{formatDateTime(a.date)}</Text></View>
            <View style={s.mi}><Text style={s.ml}>Type</Text><Text style={s.mv}>{a.type}</Text></View>
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
  card: { marginBottom: 10 }, row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  mono: { fontSize: 12, fontWeight: '600', color: Colors.textDimmer, fontFamily: 'monospace' },
  mr: { flexDirection: 'row', gap: 12, marginTop: 6 }, mi: { flex: 1 },
  ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
});
