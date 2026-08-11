import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';

export default function CategoriesScreen() {
  const { categories } = useStore();
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Categories</Text>
      <Text style={s.sub}>{categories.length} law categories</Text>
      {categories.map(cat => (
        <GlassCard key={cat.id} style={s.card}>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{cat.nameEn}</Text>
              <Text style={s.nameUr}>{cat.nameUr}</Text>
            </View>
            <StatusBadge status={cat.active ? 'Active' : 'Inactive'} />
          </View>
          <View style={s.mr}>
            <View style={s.mi}><Text style={s.ml}>Lawyers</Text><Text style={s.mv}>{cat.lawyers}</Text></View>
            <View style={s.mi}><Text style={s.ml}>Cases</Text><Text style={s.mv}>{cat.cases}</Text></View>
            <View style={s.mi}><Text style={s.ml}>Order</Text><Text style={s.mv}>#{cat.order}</Text></View>
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
  name: { fontSize: 15, fontWeight: '600', color: Colors.text },
  nameUr: { fontSize: 13, color: Colors.textDimmer, marginTop: 2 },
  mr: { flexDirection: 'row', gap: 12 }, mi: { flex: 1 },
  ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
});
