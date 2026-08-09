'use client';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsUpDown, Download, Search } from 'lucide-react';

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
};

type Props<T extends Record<string, unknown>> = {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
  onExport?: () => void;
  actions?: (row: T) => React.ReactNode;
  selected?: string[];
  onSelect?: (id: string) => void;
  idKey?: keyof T;
};

export function DataTable<T extends Record<string, unknown>>({
  data, columns, pageSize = 10, searchKeys = [], emptyMessage = 'No records found',
  onExport, actions, selected, onSelect, idKey = 'id' as keyof T,
}: Props<T>) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search && searchKeys.length) {
      const q = search.toLowerCase();
      rows = rows.filter(row =>
        searchKeys.some(k => String(row[k] ?? '').toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const av = String(a[sortKey as keyof T] ?? '');
        const bv = String(b[sortKey as keyof T] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return rows;
  }, [data, search, sortKey, sortDir, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  }

  function exportCSV() {
    const header = columns.map(c => c.label).join(',');
    const rows = filtered.map(row =>
      columns.map(c => {
        const val = row[c.key as keyof T];
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'export.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {searchKeys.length > 0 && (
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search..."
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/15"
            />
          </div>
        )}
        <button
          onClick={onExport ?? exportCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white/50 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02]">
              {onSelect && <th className="w-10 px-4 py-3"><input type="checkbox" className="accent-[#5C1A1A]" onChange={() => {}} /></th>}
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={cn('px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wide whitespace-nowrap', col.className)}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(String(col.key))}
                      className="flex items-center gap-1 hover:text-white/70 transition-colors"
                    >
                      {col.label}
                      <ChevronsUpDown className="w-3 h-3" />
                    </button>
                  ) : col.label}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right text-xs font-semibold text-white/40 uppercase tracking-wide">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0) + (onSelect ? 1 : 0)}
                  className="px-4 py-12 text-center text-white/30 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : paginated.map((row, i) => (
              <tr key={i} className="data-table-row border-b border-white/[0.04] last:border-0 transition-colors">
                {onSelect && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="accent-[#5C1A1A]"
                      checked={selected?.includes(String(row[idKey])) ?? false}
                      onChange={() => onSelect(String(row[idKey]))}
                    />
                  </td>
                )}
                {columns.map(col => (
                  <td key={String(col.key)} className={cn('px-4 py-3 text-white/70', col.className)}>
                    {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '-')}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 text-right">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-white/30">
        <span>{filtered.length} total records · Page {page} of {totalPages}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pg = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
            return (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={cn('w-7 h-7 rounded-lg text-xs transition-all',
                  pg === page ? 'bg-white/[0.1] text-white font-semibold' : 'hover:bg-white/[0.05] text-white/40'
                )}
              >
                {pg}
              </button>
            );
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: 'badge-active', Verified: 'badge-verified', Completed: 'badge-completed', Paid: 'badge-paid',
    Pending: 'badge-pending', 'Under Review': 'badge-pending', Submitted: 'badge-pending', Scheduled: 'badge-pending', New: 'badge-pending', Processing: 'badge-pending', Investigating: 'badge-pending',
    Suspended: 'badge-suspended', Rejected: 'badge-rejected', Failed: 'badge-failed', Cancelled: 'badge-suspended', Dismissed: 'badge-suspended',
    Draft: 'badge-draft', Inactive: 'badge-draft', Abandoned: 'badge-draft', 'No-show': 'badge-draft', Published: 'badge-active', Flagged: 'badge-disputed',
    Disputed: 'badge-disputed', Open: 'badge-disputed', 'Waiting for Info': 'badge-pending', Escalated: 'badge-suspended', Resolved: 'badge-completed',
    Refunded: 'badge-verified', Processed: 'badge-completed', Approved: 'badge-active', Accepted: 'badge-active', Withdrawn: 'badge-draft',
    Success: 'badge-active', Matching: 'badge-pending', 'On Hold': 'badge-pending', 'Case Created': 'badge-completed',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold', map[status] ?? 'badge-draft')}>
      {status}
    </span>
  );
}
