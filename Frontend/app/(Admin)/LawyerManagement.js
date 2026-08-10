import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LawyerManagement() {
  const router = useRouter();
  const lawyers = [
    { id: '1', name: 'Sara Raza', spec: 'Property Law', sbc: 'SBC-4421', status: 'Verified' },
    { id: '2', name: 'M. Karim', spec: 'Family Law', sbc: 'SBC-2389', status: 'Verified' },
    { id: '3', name: 'Imran Baig', spec: 'Criminal Law', sbc: 'SBC-3301', status: 'Pending Verification' },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><Text style={s.backText}>← Back</Text></TouchableOpacity>
        <Text style={s.title}>Lawyer Management</Text>
      </View>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {lawyers.map(l => (
          <View key={l.id} style={s.card}>
            <Text style={s.name}>{l.name}</Text>
            <Text style={s.sub}>{l.spec} · SBC {l.sbc}</Text>
            <Text style={[s.badge, l.status === 'Verified' ? s.badgeActive : s.badgePending]}>{l.status}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1A0533' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 18, backgroundColor: '#1A0533', gap: 12 },
  backBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 },
  backText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  scroll: { flex: 1, backgroundColor: '#F5F3EF' }, content: { padding: 20 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e8e4e0' },
  name: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  sub: { fontSize: 13, color: '#888', marginTop: 2 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, fontSize: 10, fontWeight: '700', marginTop: 8 },
  badgeActive: { backgroundColor: '#dcfce7', color: '#166534' },
  badgePending: { backgroundColor: '#fef3c7', color: '#92400e' },
});
