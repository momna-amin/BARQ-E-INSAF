import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Pressable,
} from 'react-native';
import { Search, UserX, UserCheck, Shield, User } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';
import { formatDate, timeAgo } from '@/lib/utils';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { StaggerIn } from '@/components/admin/StaggerIn';

const ALL = 'All';
const STATUS_FILTERS = [ALL, 'Active', 'Suspended', 'Inactive'];

export default function UsersScreen() {
  const { users, updateUser } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [confirm, setConfirm] = useState<{ open: boolean; userId: string; action: 'suspend' | 'activate' }>({
    open: false, userId: '', action: 'suspend',
  });

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === ALL || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function doAction(reason?: string) {
    const newStatus = confirm.action === 'suspend' ? 'Suspended' : 'Active';
    updateUser(confirm.userId, { status: newStatus as any });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Users (Clients)</Text>
      <Text style={styles.subtitle}>{users.length} registered users · {users.filter(u => u.status === 'Active').length} active</Text>

      {/* Search */}
      <View style={styles.searchBox}>
        <Search size={14} color={Colors.textDimmest} />
        <TextInput
          value={search} onChangeText={setSearch}
          placeholder="Search by name, email or city..."
          placeholderTextColor={Colors.textGhost}
          style={styles.searchInput}
        />
      </View>

      {/* Status Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {STATUS_FILTERS.map(f => (
          <Pressable key={f} onPress={() => setStatusFilter(f)}
            style={[styles.filterChip, statusFilter === f && styles.filterChipActive]}>
            <Text style={[styles.filterText, statusFilter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.count}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</Text>

      {filtered.map((user, i) => (
        <StaggerIn key={user.id} index={i}>
          <GlassCard style={styles.card}>
            {/* Top row */}
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

            {/* Meta */}
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
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Registered</Text>
                <Text style={styles.metaValue}>{formatDate(user.registeredOn)}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              {user.status === 'Active' ? (
                <TouchableOpacity
                  style={styles.btnDanger}
                  onPress={() => setConfirm({ open: true, userId: user.id, action: 'suspend' })}
                  activeOpacity={0.7}
                >
                  <UserX size={12} color="#fff" />
                  <Text style={styles.btnText}>Suspend</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.btnSuccess}
                  onPress={() => setConfirm({ open: true, userId: user.id, action: 'activate' })}
                  activeOpacity={0.7}
                >
                  <UserCheck size={12} color="#fff" />
                  <Text style={styles.btnText}>Activate</Text>
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>
        </StaggerIn>
      ))}

      <View style={{ height: 40 }} />

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm(c => ({ ...c, open: false }))}
        onConfirm={doAction}
        title={confirm.action === 'suspend' ? 'Suspend User?' : 'Activate User?'}
        description={confirm.action === 'suspend'
          ? 'The user will lose access to the platform immediately.'
          : 'The user will regain full access to the platform.'
        }
        confirmLabel={confirm.action === 'suspend' ? 'Suspend' : 'Activate'}
        confirmVariant={confirm.action === 'suspend' ? 'danger' : 'success'}
        requireReason={confirm.action === 'suspend'}
        reasonLabel="Suspension Reason"
        reasonPlaceholder="Explain why this user is being suspended..."
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#fff' },
  filterRow: { marginBottom: 10 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  filterText: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  count: { color: Colors.textDimmest, fontSize: 11, fontWeight: '600', marginBottom: 10 },
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
  actions: { flexDirection: 'row', gap: 8, marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  btnDanger: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#dc2626', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnSuccess: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#059669', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
