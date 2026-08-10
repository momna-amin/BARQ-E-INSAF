import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Search, Star } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';

export default function LawyersScreen() {
  const { lawyers } = useStore();
  const [search, setSearch] = useState('');

  const filtered = lawyers.filter(l =>
    !search || l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.specialty.toLowerCase().includes(search.toLowerCase()) ||
    l.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Lawyers</Text>
      <Text style={styles.subtitle}>{lawyers.length} lawyers registered</Text>

      <View style={styles.searchBox}>
        <Search size={14} color={Colors.textDimmest} />
        <TextInput value={search} onChangeText={setSearch} placeholder="Search lawyers..." placeholderTextColor={Colors.textGhost} style={styles.searchInput} />
      </View>

      {filtered.map(lawyer => (
        <GlassCard key={lawyer.id} style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{lawyer.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.name} numberOfLines={1}>{lawyer.name}</Text>
              <Text style={styles.email} numberOfLines={1}>{lawyer.email}</Text>
            </View>
            <StatusBadge status={lawyer.status} />
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Specialty</Text>
              <Text style={styles.metaValue}>{lawyer.specialty}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Experience</Text>
              <Text style={styles.metaValue}>{lawyer.experience} yrs</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Cases</Text>
              <Text style={styles.metaValue}>{lawyer.cases}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>City</Text>
              <Text style={styles.metaValue}>{lawyer.city}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>License</Text>
              <Text style={styles.metaValue}>{lawyer.license}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Rating</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {lawyer.rating > 0 ? (
                  <>
                    <Star size={10} color="#fbbf24" fill="#fbbf24" />
                    <Text style={styles.metaValue}>{lawyer.rating}</Text>
                  </>
                ) : (
                  <Text style={styles.metaValue}>N/A</Text>
                )}
              </View>
            </View>
          </View>
        </GlassCard>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, color: '#fff' },
  card: { marginBottom: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.brand, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  name: { fontSize: 14, fontWeight: '600', color: Colors.text },
  email: { fontSize: 12, color: Colors.textDimmer },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  metaItem: { flex: 1 },
  metaLabel: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
});
