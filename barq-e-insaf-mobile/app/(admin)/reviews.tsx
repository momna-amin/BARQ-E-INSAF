import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';

export default function ReviewsScreen() {
  const { reviews } = useStore();
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Reviews</Text>
      <Text style={s.sub}>{reviews.length} reviews</Text>
      {reviews.map(r => (
        <GlassCard key={r.id} style={s.card}>
          <View style={s.row}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>{Array.from({length: r.rating}, (_, i) => <Star key={i} size={12} color="#fbbf24" fill="#fbbf24" />)}</View><StatusBadge status={r.status} /></View>
          <Text style={s.snippet}>"{r.snippet}"</Text>
          <View style={s.mr}>
            <View style={s.mi}><Text style={s.ml}>Reviewer</Text><Text style={s.mv}>{r.reviewer}</Text></View>
            <View style={s.mi}><Text style={s.ml}>Lawyer</Text><Text style={s.mv}>{r.lawyer}</Text></View>
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
  snippet: { fontSize: 13, color: Colors.text, fontStyle: 'italic', marginBottom: 10, lineHeight: 18 },
  mr: { flexDirection: 'row', gap: 12 }, mi: { flex: 1 },
  ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
});
