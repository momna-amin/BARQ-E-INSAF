import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';

export default function VerificationQueueScreen() {
  const { lawyers } = useStore();
  const pending = lawyers.filter(l => l.status === 'Pending' || l.status === 'Under Review');

  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Verification Queue</Text>
      <Text style={s.sub}>{pending.length} pending verifications</Text>
      {pending.map(l => (
        <GlassCard key={l.id} style={s.card}>
          <View style={s.row}>
            <View style={s.avatar}><Text style={s.avt}>{l.name.charAt(0)}</Text></View>
            <View style={{ flex: 1 }}><Text style={s.name}>{l.name}</Text><Text style={s.email}>{l.email}</Text></View>
            <StatusBadge status={l.status} />
          </View>
          <View style={s.mr}>
            <View style={s.mi}><Text style={s.ml}>Specialty</Text><Text style={s.mv}>{l.specialty}</Text></View>
            <View style={s.mi}><Text style={s.ml}>License</Text><Text style={s.mv}>{l.license}</Text></View>
            <View style={s.mi}><Text style={s.ml}>Exp.</Text><Text style={s.mv}>{l.experience} yrs</Text></View>
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
  card: { marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.brand, justifyContent: 'center', alignItems: 'center' },
  avt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  name: { fontSize: 14, fontWeight: '600', color: Colors.text },
  email: { fontSize: 12, color: Colors.textDimmer },
  mr: { flexDirection: 'row', gap: 12, marginTop: 4 },
  mi: { flex: 1 }, ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
});
