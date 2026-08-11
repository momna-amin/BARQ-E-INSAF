import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';
import { formatDateTime } from '@/lib/utils';

export default function AIMonitoringScreen() {
  const { aiSessions } = useStore();
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>AI Monitoring</Text>
      <Text style={s.sub}>{aiSessions.length} AI chat sessions</Text>
      {aiSessions.map(session => (
        <GlassCard key={session.id} style={s.card}>
          <View style={s.row}><Text style={s.mono}>{session.id}</Text><StatusBadge status={session.outcome} /></View>
          <View style={s.mr}>
            <View style={s.mi}><Text style={s.ml}>User</Text><Text style={s.mv}>{session.user}</Text></View>
            <View style={s.mi}><Text style={s.ml}>Messages</Text><Text style={s.mv}>{session.messages}</Text></View>
          </View>
          <View style={s.mr}>
            <View style={s.mi}><Text style={s.ml}>Started</Text><Text style={s.mv}>{formatDateTime(session.started)}</Text></View>
            <View style={s.mi}><Text style={s.ml}>Case</Text><Text style={s.mv}>{session.caseCreated || 'None'}</Text></View>
          </View>
        </GlassCard>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg }, p: { padding: 16 },
  t: { fontSize: 20, fontWeight: '700', color: '#fff' }, sub: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  card: { marginBottom: 10 }, row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  mono: { fontSize: 12, fontWeight: '600', color: Colors.textDimmer, fontFamily: 'monospace' },
  mr: { flexDirection: 'row', gap: 12, marginTop: 4 }, mi: { flex: 1 },
  ml: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mv: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
});
