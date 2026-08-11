import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { StaggerIn } from './StaggerIn';

type KpiItem = {
  label: string;
  value: number | string;
  change?: string;
  color: string;
};

export function KpiCard({ label, value, change, color }: KpiItem) {
  const displayVal = typeof value === 'number' ? value.toLocaleString('en-PK') : value;

  // Simple sparkline bars using views
  const sparkBars = Array.from({ length: 7 }, (_, i) => ({
    height: 8 + (i / 6) * 24 + (Math.random() * 8 - 4),
  }));

  return (
    <GlassCard style={styles.card}>
      <View style={styles.top}>
        <View style={[styles.colorBar, { backgroundColor: color }]} />
        {change && (
          <View style={styles.changePill}>
            <Text style={styles.changeText}>{change}</Text>
          </View>
        )}
      </View>
      <Text style={styles.value}>{displayVal}</Text>
      <Text style={styles.label}>{label}</Text>
      {/* Sparkline */}
      <View style={styles.sparkline}>
        {sparkBars.map((bar, i) => (
          <View
            key={i}
            style={[styles.sparkBar, { height: Math.max(4, bar.height), backgroundColor: color }]}
          />
        ))}
      </View>
    </GlassCard>
  );
}

export function KpiGrid({ items }: { items: KpiItem[] }) {
  return (
    <View style={styles.grid}>
      {items.map((item, i) => (
        <StaggerIn key={item.label} index={i}>
          <View style={styles.gridItem}>
            <KpiCard {...item} />
          </View>
        </StaggerIn>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: { width: '48%', flexGrow: 1 },
  card: { minHeight: 110 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  colorBar: { width: 3, height: 20, borderRadius: 2 },
  changePill: { backgroundColor: 'rgba(16,185,129,0.15)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  changeText: { color: '#34d399', fontSize: 10, fontWeight: '700' },
  value: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 2 },
  label: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '600' },
  sparkline: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 2,
    height: 28, marginTop: 10, overflow: 'hidden',
  },
  sparkBar: { flex: 1, borderRadius: 2, opacity: 0.6 },
});
