import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';
import { colors } from '../../theme/tokens';

type Tab = { label: string; key: string };

export function DetailShell({
  title, subtitle, status, tabs, actions, children, onBack,
}: {
  title: string; subtitle?: string; status?: string; tabs: Tab[];
  actions?: React.ReactNode; children: (activeTab: string) => React.ReactNode; onBack?: () => void;
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? '');

  return (
    <View style={{ gap: 16 }}>
      <GlassCard>
        <View style={styles.headRow}>
          {onBack && (
            <Pressable onPress={onBack} style={styles.backBtn}>
              <ChevronLeft size={16} color="rgba(255,255,255,0.3)" />
            </Pressable>
          )}
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{title}</Text>
              {status && <Badge status={status} />}
            </View>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        {actions && <View style={styles.actionsRow}>{actions}</View>}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabStrip}>
          {tabs.map(tab => {
            const active = activeTab === tab.key;
            return (
              <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, active && styles.tabActive]}>
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </GlassCard>

      {children(activeTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  headRow: { flexDirection: 'row', gap: 10 },
  backBtn: { padding: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  title: { color: '#fff', fontSize: 17, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  tabStrip: { marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 4 },
  tab: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.glow },
  tabText: { color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
});
