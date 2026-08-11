import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { KpiGrid } from '@/components/admin/KpiCard';
import { StaggerIn } from '@/components/admin/StaggerIn';
import {
  PLATFORM_GROWTH, CASES_BY_DISTRICT, CASES_BY_CATEGORY, CASES_BY_STATUS,
  LAWYER_VERIFICATION_FUNNEL,
} from '@/lib/mock-data';

const maxGrowth = Math.max(...PLATFORM_GROWTH.map(m => m.users));
const maxDistrict = Math.max(...CASES_BY_DISTRICT.map(d => d.cases));
const totalCasesByStatus = CASES_BY_STATUS.reduce((s, c) => s + c.value, 0);
const statusColors: Record<string, string> = {
  Active: '#4ade80', Completed: '#34d399', Disputed: '#f59e0b',
  Cancelled: '#ef4444', Submitted: '#60a5fa', Matching: '#c084fc', Draft: '#9ca3af',
};

const kpiItems = [
  { label: 'Total Users', value: 2841, change: '+142', color: '#3b82f6' },
  { label: 'Total Lawyers', value: 284, change: '+12', color: '#f59e0b' },
  { label: 'Verified Lawyers', value: 217, change: '+8', color: '#10b981' },
  { label: 'Active Cases', value: 1094, change: '+88', color: '#8b5cf6' },
  { label: 'Completed Cases', value: 3220, change: '+156', color: '#A4F4FD' },
];

export default function AnalyticsScreen() {
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Analytics</Text>
      <Text style={s.sub}>Platform performance metrics</Text>

      {/* KPI Grid */}
      <KpiGrid items={kpiItems} />

      {/* Growth Chart */}
      <StaggerIn index={1}>
        <GlassCard style={s.section}>
          <Text style={s.st}>Platform Growth Trend</Text>
          <Text style={s.stSub}>Monthly users, lawyers, and cases</Text>

          {/* Users bar chart */}
          <View style={s.chartRow}>
            {PLATFORM_GROWTH.map(m => {
              const heightPct = m.users / maxGrowth;
              return (
                <View key={m.month} style={s.barCol}>
                  <Text style={s.barTopVal}>{m.users}</Text>
                  <View style={s.barTrackV}>
                    <View style={[s.barFillV, { height: `${heightPct * 100}%`, backgroundColor: '#3b82f6' }]} />
                  </View>
                  <Text style={s.barMonthLabel}>{m.month}</Text>
                </View>
              );
            })}
          </View>

          {/* Cases line approximation with horizontal bars */}
          <View style={{ marginTop: 16 }}>
            <Text style={s.legendLabel}>Cases this year</Text>
            {PLATFORM_GROWTH.slice(-4).map(m => (
              <View key={m.month + 'c'} style={s.hBarRow}>
                <Text style={s.hBarLabel}>{m.month}</Text>
                <View style={s.hBarTrack}>
                  <View style={[s.hBarFill, { width: `${(m.cases / 1200) * 100}%`, backgroundColor: '#A4F4FD66' }]} />
                </View>
                <Text style={s.hBarVal}>{m.cases}</Text>
              </View>
            ))}
          </View>
        </GlassCard>
      </StaggerIn>

      {/* Cases by Status donut approximation */}
      <StaggerIn index={2}>
        <GlassCard style={s.section}>
          <Text style={s.st}>Cases by Status</Text>
          {CASES_BY_STATUS.map(c => {
            const pct = (c.value / totalCasesByStatus) * 100;
            const color = statusColors[c.name] ?? '#9ca3af';
            return (
              <View key={c.name} style={s.hBarRow}>
                <View style={[s.statusDot, { backgroundColor: color }]} />
                <Text style={s.hBarLabel}>{c.name}</Text>
                <View style={s.hBarTrack}>
                  <View style={[s.hBarFill, { width: `${pct}%`, backgroundColor: color + '66' }]} />
                </View>
                <Text style={s.hBarVal}>{c.value}</Text>
              </View>
            );
          })}
        </GlassCard>
      </StaggerIn>

      {/* Lawyer Verification Funnel */}
      <StaggerIn index={3}>
        <GlassCard style={s.section}>
          <Text style={s.st}>Lawyer Verification Funnel</Text>
          <View style={s.funnelRow}>
            {LAWYER_VERIFICATION_FUNNEL.map((item, i) => {
              const funnelColors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
              return (
                <View key={item.stage}
                  style={[s.funnelItem, { backgroundColor: funnelColors[i] + '18' }]}>
                  <Text style={[s.funnelCount, { color: funnelColors[i] }]}>{item.count}</Text>
                  <Text style={s.funnelLabel}>{item.stage}</Text>
                </View>
              );
            })}
          </View>
        </GlassCard>
      </StaggerIn>

      {/* Cases by Category */}
      <StaggerIn index={4}>
        <GlassCard style={s.section}>
          <Text style={s.st}>Cases by Category</Text>
          {CASES_BY_CATEGORY.map(c => (
            <View key={c.name} style={s.hBarRow}>
              <View style={[s.statusDot, { backgroundColor: c.color }]} />
              <Text style={s.hBarLabel}>{c.name}</Text>
              <View style={s.hBarTrack}>
                <View style={[s.hBarFill, { width: `${(c.value / 450) * 100}%`, backgroundColor: c.color + '66' }]} />
              </View>
              <Text style={s.hBarVal}>{c.value}</Text>
            </View>
          ))}
        </GlassCard>
      </StaggerIn>

      {/* District cases table */}
      <StaggerIn index={5}>
        <GlassCard style={s.section}>
          <Text style={s.st}>Top Districts by Cases</Text>
          {CASES_BY_DISTRICT.map(d => (
            <View key={d.district} style={s.hBarRow}>
              <Text style={s.hBarLabelWide}>{d.district}</Text>
              <View style={s.hBarTrack}>
                <View style={[s.hBarFill, { width: `${(d.cases / maxDistrict) * 100}%`, backgroundColor: Colors.glow + '55' }]} />
              </View>
              <Text style={s.hBarVal}>{d.cases}</Text>
            </View>
          ))}
        </GlassCard>
      </StaggerIn>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg }, p: { padding: 16, gap: 12 },
  t: { fontSize: 20, fontWeight: '700', color: '#fff' },
  sub: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 4 },
  section: { gap: 0 },
  st: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 4 },
  stSub: { fontSize: 11, color: Colors.textDimmer, marginBottom: 12 },
  legendLabel: { fontSize: 11, color: Colors.textDimmer, marginBottom: 6 },

  // Vertical bar chart
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 4 },
  barCol: { flex: 1, alignItems: 'center' },
  barTopVal: { fontSize: 8, color: Colors.textDimmer, marginBottom: 2 },
  barTrackV: { width: '100%', height: 70, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  barFillV: { width: '100%', borderRadius: 4, opacity: 0.8 },
  barMonthLabel: { fontSize: 9, color: Colors.textDimmest, marginTop: 4, fontWeight: '600' },

  // Horizontal bar
  hBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  hBarLabel: { width: 80, fontSize: 11, color: Colors.textMuted },
  hBarLabelWide: { width: 100, fontSize: 11, color: Colors.textMuted },
  hBarTrack: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' },
  hBarFill: { height: '100%', borderRadius: 4 },
  hBarVal: { width: 36, fontSize: 11, color: Colors.textDim, textAlign: 'right', fontWeight: '600' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },

  // Funnel
  funnelRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  funnelItem: { width: '47%', flexGrow: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  funnelCount: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  funnelLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '500', textAlign: 'center' },
});
