import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Search, Shield } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStore } from '@/lib/store';
import { timeAgo } from '@/lib/utils';
import { StaggerIn } from '@/components/admin/StaggerIn';

const ACTION_COLORS: Record<string, string> = {
  'lawyer.approved': '#4ade80',
  'lawyer.rejected': '#ef4444',
  'lawyer.verified': '#4ade80',
  'user.suspended': '#ef4444',
  'user.status': '#fbbf24',
  'dispute.resolved': '#34d399',
  'review.removed': '#ef4444',
  'location.added': '#60a5fa',
  'dispute.assigned': '#c084fc',
};

function getActionColor(action: string): string {
  for (const key of Object.keys(ACTION_COLORS)) {
    if (action.startsWith(key)) return ACTION_COLORS[key];
  }
  return Colors.glow;
}

export default function AuditLogsScreen() {
  const { auditLogs } = useStore();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return auditLogs;
    const q = search.toLowerCase();
    return auditLogs.filter(l =>
      l.action.toLowerCase().includes(q) ||
      l.actor.toLowerCase().includes(q) ||
      l.entityType.toLowerCase().includes(q) ||
      l.entityId.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q)
    );
  }, [auditLogs, search]);

  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <View style={s.header}>
        <Shield size={18} color={Colors.glow} />
        <View>
          <Text style={s.t}>Audit Logs</Text>
          <Text style={s.sub}>{auditLogs.length} entries · all admin actions tracked</Text>
        </View>
      </View>

      <View style={s.searchBox}>
        <Search size={14} color={Colors.textDimmest} />
        <TextInput
          value={search} onChangeText={setSearch}
          placeholder="Filter by action, actor, entity..."
          placeholderTextColor={Colors.textGhost}
          style={s.searchInput}
        />
      </View>

      <Text style={s.count}>{filtered.length} matching entries</Text>

      {filtered.map((log, i) => (
        <StaggerIn key={log.id} index={i}>
          <GlassCard style={s.card}>
            <View style={s.row}>
              <Text style={s.mono}>{log.id}</Text>
              <Text style={s.time}>{timeAgo(log.timestamp)}</Text>
            </View>

            {/* Action badge */}
            <View style={[s.actionBadge, { backgroundColor: getActionColor(log.action) + '20' }]}>
              <Text style={[s.actionText, { color: getActionColor(log.action) }]}>{log.action}</Text>
            </View>

            <View style={s.mr}>
              <View style={s.mi}>
                <Text style={s.ml}>Actor</Text>
                <Text style={s.mv}>{log.actor}</Text>
              </View>
              <View style={s.mi}>
                <Text style={s.ml}>Entity</Text>
                <Text style={s.mv}>{log.entityType} #{log.entityId}</Text>
              </View>
              <View style={s.mi}>
                <Text style={s.ml}>IP</Text>
                <Text style={s.mv}>{log.ip}</Text>
              </View>
            </View>
            <Text style={s.details}>{log.details}</Text>
          </GlassCard>
        </StaggerIn>
      ))}

      {filtered.length === 0 && (
        <Text style={s.empty}>No audit logs match your search</Text>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg }, p: { padding: 16 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  t: { fontSize: 20, fontWeight: '700', color: '#fff' },
  sub: { fontSize: 13, color: Colors.textDim, marginTop: 2 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#fff' },
  count: { color: Colors.textDimmest, fontSize: 11, fontWeight: '600', marginBottom: 10 },
  card: { marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mono: { fontSize: 11, fontWeight: '600', color: Colors.textDimmer },
  time: { fontSize: 10, color: Colors.textDimmest },
  actionBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, marginBottom: 8 },
  actionText: { fontSize: 11, fontWeight: '700' },
  mr: { flexDirection: 'row', gap: 12, marginTop: 4 }, mi: { flex: 1 },
  ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  details: { fontSize: 12, color: Colors.textDim, marginTop: 8, lineHeight: 16, fontStyle: 'italic' },
  empty: { color: Colors.textDimmer, textAlign: 'center', paddingVertical: 32, fontSize: 13 },
});
