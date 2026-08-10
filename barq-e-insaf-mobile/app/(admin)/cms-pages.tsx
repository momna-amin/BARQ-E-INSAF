import React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';

const PAGES = [
  { title: 'Terms of Service', slug: '/terms', status: 'Published', updated: '2026-06-15' },
  { title: 'Privacy Policy', slug: '/privacy', status: 'Published', updated: '2026-06-15' },
  { title: 'About Barq-e-Insaf', slug: '/about', status: 'Published', updated: '2026-05-20' },
  { title: 'Lawyer Agreement', slug: '/lawyer-agreement', status: 'Draft', updated: '2026-07-01' },
  { title: 'Contact Us', slug: '/contact', status: 'Published', updated: '2026-04-10' },
];

export default function CMSPagesScreen() {
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>CMS Pages</Text>
      <Text style={s.sub}>{PAGES.length} pages</Text>
      {PAGES.map(p => (
        <GlassCard key={p.slug} style={s.card}>
          <Text style={s.name}>{p.title}</Text>
          <Text style={s.slug}>{p.slug}</Text>
          <Text style={s.meta}>{p.status} · Updated: {p.updated}</Text>
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
  slug: { fontSize: 12, color: Colors.glow, marginTop: 2, fontFamily: 'monospace' },
  meta: { fontSize: 11, color: Colors.textDimmer, marginTop: 6 },
});
