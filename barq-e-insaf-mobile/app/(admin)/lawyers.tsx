import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Pressable,
} from 'react-native';
import { Search, CheckCircle, XCircle, PauseCircle, Star } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { StaggerIn } from '@/components/admin/StaggerIn';

const ALL = 'All';
const STATUS_FILTERS = [ALL, 'Pending', 'Under Review', 'Verified', 'Suspended', 'Rejected'];

export default function LawyersScreen() {
  const { lawyers, updateLawyer } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [confirm, setConfirm] = useState<{
    open: boolean; lawyerId: string;
    action: 'verify' | 'reject' | 'suspend' | 'activate';
  }>({ open: false, lawyerId: '', action: 'verify' });

  const filtered = lawyers.filter(l => {
    const matchSearch = !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.specialty.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === ALL || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function doAction(reason?: string) {
    const statusMap: Record<'verify' | 'reject' | 'suspend' | 'activate', 'Verified' | 'Rejected' | 'Suspended' | 'Pending'> = {
      verify: 'Verified', reject: 'Rejected', suspend: 'Suspended', activate: 'Verified',
    };
    updateLawyer(confirm.lawyerId, { status: statusMap[confirm.action] });
  }

  const actionConfig = {
    verify: { label: 'Verify Lawyer', variant: 'success' as const, desc: 'This lawyer will be marked as Verified and can accept cases.' },
    reject: { label: 'Reject Application', variant: 'danger' as const, desc: 'The lawyer application will be rejected. They can reapply after 30 days.' },
    suspend: { label: 'Suspend Lawyer', variant: 'danger' as const, desc: 'The lawyer will lose access and active cases will be reassigned.' },
    activate: { label: 'Reinstate Lawyer', variant: 'success' as const, desc: 'The lawyer will regain access and can accept new cases.' },
  };

  const cfg = actionConfig[confirm.action];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Lawyers</Text>
      <Text style={styles.subtitle}>
        {lawyers.length} registered · {lawyers.filter(l => l.status === 'Verified').length} verified ·{' '}
        {lawyers.filter(l => l.status === 'Pending' || l.status === 'Under Review').length} pending
      </Text>

      <View style={styles.searchBox}>
        <Search size={14} color={Colors.textDimmest} />
        <TextInput value={search} onChangeText={setSearch}
          placeholder="Search lawyers..."
          placeholderTextColor={Colors.textGhost}
          style={styles.searchInput} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {STATUS_FILTERS.map(f => (
          <Pressable key={f} onPress={() => setStatusFilter(f)}
            style={[styles.filterChip, statusFilter === f && styles.filterChipActive]}>
            <Text style={[styles.filterText, statusFilter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.count}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</Text>

      {filtered.map((lawyer, i) => (
        <StaggerIn key={lawyer.id} index={i}>
          <GlassCard style={styles.card}>
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
                  ) : <Text style={styles.metaValue}>N/A</Text>}
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              {(lawyer.status === 'Pending' || lawyer.status === 'Under Review') && (
                <>
                  <TouchableOpacity style={styles.btnSuccess}
                    onPress={() => setConfirm({ open: true, lawyerId: lawyer.id, action: 'verify' })}
                    activeOpacity={0.7}>
                    <CheckCircle size={12} color="#fff" />
                    <Text style={styles.btnText}>Verify</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnDanger}
                    onPress={() => setConfirm({ open: true, lawyerId: lawyer.id, action: 'reject' })}
                    activeOpacity={0.7}>
                    <XCircle size={12} color="#fff" />
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>
                </>
              )}
              {lawyer.status === 'Verified' && (
                <TouchableOpacity style={styles.btnWarning}
                  onPress={() => setConfirm({ open: true, lawyerId: lawyer.id, action: 'suspend' })}
                  activeOpacity={0.7}>
                  <PauseCircle size={12} color="#fff" />
                  <Text style={styles.btnText}>Suspend</Text>
                </TouchableOpacity>
              )}
              {lawyer.status === 'Suspended' && (
                <TouchableOpacity style={styles.btnSuccess}
                  onPress={() => setConfirm({ open: true, lawyerId: lawyer.id, action: 'activate' })}
                  activeOpacity={0.7}>
                  <CheckCircle size={12} color="#fff" />
                  <Text style={styles.btnText}>Reinstate</Text>
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
        title={cfg.label}
        description={cfg.desc}
        confirmLabel={cfg.label}
        confirmVariant={cfg.variant}
        requireReason={confirm.action === 'reject' || confirm.action === 'suspend'}
        reasonLabel={confirm.action === 'reject' ? 'Rejection Reason' : 'Suspension Reason'}
        reasonPlaceholder={confirm.action === 'reject' ? 'Explain reason for rejection...' : 'Explain reason for suspension...'}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#fff' },
  filterRow: { marginBottom: 10 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, marginRight: 8, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: Colors.border },
  filterChipActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  filterText: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  count: { color: Colors.textDimmest, fontSize: 11, fontWeight: '600', marginBottom: 10 },
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
  actions: { flexDirection: 'row', gap: 8, marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  btnSuccess: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#059669', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnDanger: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#dc2626', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnWarning: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#d97706', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
