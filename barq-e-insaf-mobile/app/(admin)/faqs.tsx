import React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';

const FAQS = [
  { q: 'How do I file a case on Barq-e-Insaf?', a: 'You can file a case by using our AI-powered intake chat. The system will guide you through the process.' },
  { q: 'How are lawyers verified?', a: 'Each lawyer must submit their Bar Council license, CNIC, and professional documents. Our verification team reviews within 48 hours.' },
  { q: 'What areas of law does Barq-e-Insaf cover?', a: 'Criminal, Family, Property, Civil, Corporate, and Tax law categories are currently supported.' },
  { q: 'Is my information secure?', a: 'Yes. All data is encrypted and stored securely. We comply with Pakistan data protection regulations.' },
  { q: 'How do I report a lawyer?', a: 'Navigate to the lawyer profile and click the "Report" button. Our moderation team will investigate promptly.' },
];

export default function FAQsScreen() {
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>FAQs</Text>
      <Text style={s.sub}>{FAQS.length} frequently asked questions</Text>
      {FAQS.map((faq, i) => (
        <GlassCard key={i} style={s.card}>
          <Text style={s.q}>{faq.q}</Text>
          <Text style={s.a}>{faq.a}</Text>
        </GlassCard>
      ))}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg }, p: { padding: 16 },
  t: { fontSize: 20, fontWeight: '700', color: '#fff' }, sub: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  card: { marginBottom: 10 },
  q: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  a: { fontSize: 13, color: Colors.textDim, lineHeight: 18 },
});
