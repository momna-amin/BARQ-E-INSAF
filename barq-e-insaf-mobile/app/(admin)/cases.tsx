import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';

export default function CasesScreen() {
  const { cases } = useStore();
  const [search, setSearch] = useState('');
  const filtered = cases.filter(c => !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.client.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Cases</Text>
      <Text style={s.sub}>{cases.length} cases total</Text>
      <View style={s.searchBox}><Search size={14} color={Colors.textDimmest} /><TextInput value={search} onChangeText={setSearch} placeholder="Search cases..." placeholderTextColor={Colors.textGhost} style={s.searchInput} /></View>
      {filtered.map(c => (
        <GlassCard key={c.id} style={s.card}>
          <View style={s.row}><Text style={s.mono}>{c.id}</Text><StatusBadge status={c.status} /></View>
          <View style={s.metaRow}>
            <View style={s.mi}><Text style={s.ml}>Client</Text><Text style={s.mv}>{c.client}</Text></View>
            <View style={s.mi}><Text style={s.ml}>Lawyer</Text><Text style={s.mv}>{c.lawyer || 'Unassigned'}</Text></View>
          </View>
          <View style={s.metaRow}>
            <View style={s.mi}><Text style={s.ml}>Category</Text><Text style={s.mv}>{c.category} / {c.subcategory}</Text></View>
            <View style={s.mi}><Text style={s.ml}>District</Text><Text style={s.mv}>{c.district}</Text></View>
          </View>
        </GlassCard>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg }, content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff' }, sub: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, color: '#fff' },
  card: { marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  mono: { fontSize: 12, fontWeight: '600', color: Colors.textDimmer, fontFamily: 'monospace' },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  mi: { flex: 1 },
  ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
});
