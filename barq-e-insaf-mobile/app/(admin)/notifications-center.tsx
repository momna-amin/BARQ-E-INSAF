import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStore } from '@/lib/store';
import { timeAgo } from '@/lib/utils';

export default function NotificationsCenterScreen() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useStore();
  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <View style={s.header}>
        <View><Text style={s.t}>Notifications</Text><Text style={s.sub}>{unreadCount} unread</Text></View>
        <TouchableOpacity onPress={markAllNotificationsRead} style={s.markBtn}><Text style={s.markBtnText}>Mark all read</Text></TouchableOpacity>
      </View>
      {notifications.map(n => (
        <TouchableOpacity key={n.id} onPress={() => markNotificationRead(n.id)} activeOpacity={0.7}>
          <GlassCard style={[s.card, !n.read && s.unread]}>
            <View style={s.row}>
              {!n.read && <View style={s.dot} />}
              <View style={{ flex: 1 }}>
                <Text style={s.nTitle}>{n.title}</Text>
                <Text style={s.nMsg}>{n.message}</Text>
                <Text style={s.nTime}>{timeAgo(n.createdAt)}</Text>
              </View>
            </View>
          </GlassCard>
        </TouchableOpacity>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: Colors.bg }, p: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  t: { fontSize: 20, fontWeight: '700', color: '#fff' }, sub: { fontSize: 13, color: Colors.textDim, marginTop: 2 },
  markBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.bgInput },
  markBtnText: { fontSize: 12, color: Colors.textDim },
  card: { marginBottom: 8 }, unread: { borderColor: 'rgba(164,244,253,0.2)' },
  row: { flexDirection: 'row', gap: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.glow, marginTop: 6 },
  nTitle: { fontSize: 13, fontWeight: '600', color: Colors.text },
  nMsg: { fontSize: 12, color: Colors.textDim, marginTop: 2, lineHeight: 16 },
  nTime: { fontSize: 10, color: Colors.textDimmest, marginTop: 4 },
});
