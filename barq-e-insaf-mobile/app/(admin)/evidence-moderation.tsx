import React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';

export default function EvidenceModerationScreen() {
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Evidence Moderation</Text>
      <Text style={s.sub}>Review and moderate submitted evidence</Text>
      <GlassCard><Text style={s.empty}>No evidence pending moderation</Text></GlassCard>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg }, p: { padding: 16 },
  t: { fontSize: 20, fontWeight: '700', color: '#fff' }, sub: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  empty: { color: Colors.textDimmer, textAlign: 'center', paddingVertical: 24, fontSize: 14 },
});
