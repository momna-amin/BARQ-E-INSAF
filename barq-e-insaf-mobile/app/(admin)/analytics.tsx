import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { PLATFORM_GROWTH, CASES_BY_DISTRICT, CASES_BY_CATEGORY } from '@/lib/mock-data';

export default function AnalyticsScreen() {
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Analytics</Text>
      <Text style={s.sub}>Platform performance metrics</Text>

      <GlassCard style={s.section}>
        <Text style={s.st}>Growth Trend (Users)</Text>
        <View style={s.growthGrid}>
          {PLATFORM_GROWTH.map(m => (
            <View key={m.month} style={s.growthCol}>
              <View style={[s.growthBar, { height: (m.users / 3000) * 80 }]} />
              <Text style={s.growthLabel}>{m.month}</Text>
              <Text style={s.growthVal}>{m.users}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard style={s.section}>
        <Text style={s.st}>Top Districts (Cases)</Text>
        {CASES_BY_DISTRICT.map(d => {
          const max = Math.max(...CASES_BY_DISTRICT.map(x => x.cases));
          return (
            <View key={d.district} style={s.barRow}>
              <Text style={s.barLabel}>{d.district}</Text>
              <View style={s.barTrack}><View style={[s.barFill, { width: `${(d.cases / max) * 100}%` }]} /></View>
              <Text style={s.barVal}>{d.cases}</Text>
            </View>
          );
        })}
      </GlassCard>

      <GlassCard style={s.section}>
        <Text style={s.st}>Cases by Category</Text>
        {CASES_BY_CATEGORY.map(c => (
          <View key={c.name} style={s.catRow}>
            <View style={[s.catDot, { backgroundColor: c.color }]} />
            <Text style={s.catName}>{c.name}</Text>
            <Text style={s.catVal}>{c.value}</Text>
          </View>
        ))}
      </GlassCard>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg }, p: { padding: 16 },
  t: { fontSize: 20, fontWeight: '700', color: '#fff' }, sub: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  section: { marginBottom: 12 }, st: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 12 },
  growthGrid: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 100 },
  growthCol: { flex: 1, alignItems: 'center' },
  growthBar: { width: '100%', borderRadius: 4, backgroundColor: '#3b82f644', minHeight: 4 },
  growthLabel: { fontSize: 9, color: Colors.textDimmest, marginTop: 4, fontWeight: '600' },
  growthVal: { fontSize: 8, color: Colors.textDimmer },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  barLabel: { width: 90, fontSize: 11, color: Colors.textMuted },
  barTrack: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, backgroundColor: Colors.glow + '66' },
  barVal: { width: 30, fontSize: 11, color: Colors.textDim, textAlign: 'right' },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catName: { flex: 1, fontSize: 13, color: Colors.textMuted },
  catVal: { fontSize: 13, fontWeight: '600', color: Colors.text },
});
