import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, Pressable, FlatList, StyleSheet,
} from 'react-native';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react-native';
import { colors } from '../../theme/tokens';
import { GlassCard } from './GlassCard';

type Column<T> = {
  key: keyof T & string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

export function DataList<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  searchKeys = [],
  emptyMessage = 'No records found',
  onRowPress,
  idKey = 'id',
}: {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
  onRowPress?: (row: T) => void;
  idKey?: keyof T;
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Identical filter/sort logic to DataTable.tsx
  const filtered = useMemo(() => {
    let rows = [...data];
    if (search && searchKeys.length) {
      const q = search.toLowerCase();
      rows = rows.filter(row => searchKeys.some(k => String(row[k] ?? '').toLowerCase().includes(q)));
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const av = String(a[sortKey] ?? '');
        const bv = String(b[sortKey] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [data, search, sortKey, sortDir, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  }

  return (
    <View style={{ gap: 10 }}>
      {searchKeys.length > 0 && (
        <View style={styles.searchWrap}>
          <Search size={14} color="rgba(255,255,255,0.3)" />
          <TextInput
            value={search}
            onChangeText={t => { setSearch(t); setPage(1); }}
            placeholder="Search..."
            placeholderTextColor="rgba(255,255,255,0.25)"
            style={styles.searchInput}
          />
        </View>
      )}

      {columns.some(c => c.sortable) && (
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          {columns.filter(c => c.sortable).map(c => (
            <Pressable key={c.key} onPress={() => toggleSort(c.key)} style={styles.sortChip}>
              <Text style={[styles.sortChipText, sortKey === c.key && { color: colors.glow }]}>{c.label}</Text>
              <ArrowUpDown size={11} color={sortKey === c.key ? colors.glow : 'rgba(255,255,255,0.3)'} />
            </Pressable>
          ))}
        </View>
      )}

      <Text style={styles.countText}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</Text>

      <FlatList
        data={paginated}
        keyExtractor={row => String(row[idKey])}
        scrollEnabled={false}
        ListEmptyComponent={<Text style={styles.empty}>{emptyMessage}</Text>}
        renderItem={({ item: row }) => (
          <Pressable onPress={() => onRowPress?.(row)}>
            <GlassCard style={{ marginBottom: 8 }}>
              {columns.map(col => (
                <View key={col.key} style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>{col.label}</Text>
                  <View style={{ maxWidth: '60%', alignItems: 'flex-end' }}>
                    {col.render
                      ? col.render(row)
                      : <Text style={styles.fieldValue}>{String(row[col.key] ?? '—')}</Text>
                    }
                  </View>
                </View>
              ))}
              {onRowPress && (
                <Text style={styles.tapHint}>Tap to view details →</Text>
              )}
            </GlassCard>
          </Pressable>
        )}
      />

      {totalPages > 1 && (
        <View style={styles.pager}>
          <Pressable disabled={page <= 1} onPress={() => setPage(p => p - 1)} style={styles.pageBtn}>
            <ChevronLeft size={14} color={page <= 1 ? 'rgba(255,255,255,0.15)' : '#fff'} />
          </Pressable>
          <Text style={styles.pageText}>Page {page} of {totalPages}</Text>
          <Pressable disabled={page >= totalPages} onPress={() => setPage(p => p + 1)} style={styles.pageBtn}>
            <ChevronRight size={14} color={page >= totalPages ? 'rgba(255,255,255,0.15)' : '#fff'} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1,
    borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, height: 40,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 13 },
  sortRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  sortLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '600' },
  sortChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  sortChipText: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600' },
  countText: { color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: '600' },
  empty: { color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingVertical: 24, fontSize: 13 },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  fieldLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 11, flex: 1 },
  fieldValue: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600', textAlign: 'right' },
  tapHint: { color: 'rgba(255,255,255,0.2)', fontSize: 10, textAlign: 'right', marginTop: 6 },
  pager: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, paddingVertical: 8 },
  pageBtn: { padding: 6 },
  pageText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600' },
});
