import React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';

const RESOURCES = [
  { title: 'Pakistan Penal Code (PPC)', desc: 'Complete reference to criminal offenses and penalties under Pakistani law.', category: 'Criminal' },
  { title: 'Code of Civil Procedure (CPC)', desc: 'Procedural law for civil courts in Pakistan.', category: 'Civil' },
  { title: 'Family Courts Act 1964', desc: 'Legal framework for family disputes, divorce, custody and maintenance.', category: 'Family' },
  { title: 'Transfer of Property Act 1882', desc: 'Laws governing transfer and sale of immovable property.', category: 'Property' },
  { title: 'Companies Act 2017', desc: 'Corporate governance and company law in Pakistan.', category: 'Corporate' },
  { title: 'Sindh High Court Rules', desc: 'Practice and procedure rules for the Sindh High Court.', category: 'Procedure' },
];

export default function LegalResourcesScreen() {
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Legal Resources</Text>
      <Text style={s.sub}>{RESOURCES.length} resources available</Text>
      {RESOURCES.map((r, i) => (
        <GlassCard key={i} style={s.card}>
          <Text style={s.name}>{r.title}</Text>
          <Text style={s.cat}>{r.category}</Text>
          <Text style={s.desc}>{r.desc}</Text>
        </GlassCard>
      ))}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg }, p: { padding: 16 },
  t: { fontSize: 20, fontWeight: '700', color: '#fff' }, sub: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  card: { marginBottom: 10 },
  name: { fontSize: 15, fontWeight: '600', color: Colors.text },
  cat: { fontSize: 11, color: Colors.glow, fontWeight: '600', marginTop: 2 },
  desc: { fontSize: 13, color: Colors.textDim, lineHeight: 18, marginTop: 6 },
});
