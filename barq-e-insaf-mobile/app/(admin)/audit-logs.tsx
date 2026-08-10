import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStore } from '@/lib/store';
import { timeAgo } from '@/lib/utils';

export default function AuditLogsScreen() {
  const { auditLogs } = useStore();
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Audit Logs</Text>
      <Text style={s.sub}>{auditLogs.length} log entries</Text>
      {auditLogs.map(log => (
        <GlassCard key={log.id} style={s.card}>
          <View style={s.row}>
            <Text style={s.mono}>{log.id}</Text>
            <Text style={s.time}>{timeAgo(log.timestamp)}</Text>
          </View>
          <View style={s.mr}>
            <View style={s.mi}><Text style={s.ml}>Actor</Text><Text style={s.mv}>{log.actor}</Text></View>
            <View style={s.mi}><Text style={s.ml}>Action</Text><Text style={[s.mv, { color: Colors.glow }]}>{log.action}</Text></View>
          </View>
          <View style={s.mr}>
            <View style={s.mi}><Text style={s.ml}>Entity</Text><Text style={s.mv}>{log.entityType} #{log.entityId}</Text></View>
            <View style={s.mi}><Text style={s.ml}>IP</Text><Text style={s.mv}>{log.ip}</Text></View>
          </View>
          <Text style={s.details}>{log.details}</Text>
        </GlassCard>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg }, p: { padding: 16 },
  t: { fontSize: 20, fontWeight: '700', color: '#fff' }, sub: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  card: { marginBottom: 10 }, row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mono: { fontSize: 11, fontWeight: '600', color: Colors.textDimmer, fontFamily: 'monospace' },
  time: { fontSize: 10, color: Colors.textDimmest },
  mr: { flexDirection: 'row', gap: 12, marginTop: 4 }, mi: { flex: 1 },
  ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  details: { fontSize: 12, color: Colors.textDim, marginTop: 8, lineHeight: 16, fontStyle: 'italic' },
});
