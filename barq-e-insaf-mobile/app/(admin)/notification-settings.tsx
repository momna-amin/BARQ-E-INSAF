import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';

const CHANNELS = [
  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
  { key: 'push', label: 'Push Notifications', desc: 'Mobile push alerts' },
  { key: 'sms', label: 'SMS Alerts', desc: 'Critical alerts via SMS' },
];

const EVENTS = [
  { key: 'newLawyer', label: 'New Lawyer Registration' },
  { key: 'dispute', label: 'New Dispute Opened' },
  { key: 'report', label: 'New Report Filed' },
  { key: 'caseStatus', label: 'Case Status Changes' },
  { key: 'system', label: 'System Health Alerts' },
];

export default function NotificationSettingsScreen() {
  const [channels, setChannels] = useState<Record<string, boolean>>({ email: true, push: true, sms: false });
  const [events, setEvents] = useState<Record<string, boolean>>({ newLawyer: true, dispute: true, report: true, caseStatus: false, system: true });

  return (
    <ScrollView style={s.c} contentContainerStyle={s.p}>
      <Text style={s.t}>Notification Settings</Text>
      <Text style={s.sub}>Configure alert preferences</Text>

      <GlassCard style={s.section}>
        <Text style={s.st}>Channels</Text>
        {CHANNELS.map(ch => (
          <View key={ch.key} style={s.switchRow}>
            <View style={{ flex: 1 }}><Text style={s.switchTitle}>{ch.label}</Text><Text style={s.switchDesc}>{ch.desc}</Text></View>
            <Switch value={channels[ch.key]} onValueChange={v => setChannels(p => ({ ...p, [ch.key]: v }))} trackColor={{ false: 'rgba(255,255,255,0.1)', true: Colors.brand }} thumbColor="#fff" />
          </View>
        ))}
      </GlassCard>

      <GlassCard style={s.section}>
        <Text style={s.st}>Events</Text>
        {EVENTS.map(ev => (
          <View key={ev.key} style={s.switchRow}>
            <Text style={[s.switchTitle, { flex: 1 }]}>{ev.label}</Text>
            <Switch value={events[ev.key]} onValueChange={v => setEvents(p => ({ ...p, [ev.key]: v }))} trackColor={{ false: 'rgba(255,255,255,0.1)', true: Colors.brand }} thumbColor="#fff" />
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
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  switchTitle: { fontSize: 14, fontWeight: '500', color: Colors.text },
  switchDesc: { fontSize: 12, color: Colors.textDimmer, marginTop: 2 },
});
