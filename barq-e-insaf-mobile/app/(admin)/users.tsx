import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';
import { formatDate, timeAgo } from '@/lib/utils';

export default function UsersScreen() {
  const { users } = useStore();
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Users (Clients)</Text>
      <Text style={styles.subtitle}>{users.length} registered users</Text>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={14} color={Colors.textDimmest} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search users..."
            placeholderTextColor={Colors.textGhost}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Cards */}
      {filtered.map(user => (
        <GlassCard key={user.id} style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
              <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
            </View>
            <StatusBadge status={user.status} />
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>City</Text>
              <Text style={styles.metaValue}>{user.city}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Cases</Text>
              <Text style={styles.metaValue}>{user.cases}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Last Login</Text>
              <Text style={styles.metaValue}>{timeAgo(user.lastLogin)}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Phone</Text>
              <Text style={styles.metaValue}>{user.phone}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>CNIC</Text>
              <Text style={styles.metaValue}>{user.cnic}</Text>
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
  searchRow: { marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#fff' },
  card: { marginBottom: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.brand, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  userName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  userEmail: { fontSize: 12, color: Colors.textDimmer },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  metaItem: { flex: 1 },
  metaLabel: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
});
