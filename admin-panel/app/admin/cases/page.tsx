'use client';
import { useStore } from '@/lib/store';
import { DataTable, StatusBadge } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Eye, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = ['Draft', 'Submitted', 'Matching', 'Active', 'On Hold', 'Completed', 'Cancelled', 'Disputed'];

export default function CasesPage() {
  const router = useRouter();
  const { cases, updateCase } = useStore();
  const [menuId, setMenuId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [confirm, setConfirm] = useState<{ open: boolean; caseId: string; newStatus: string }>({ open: false, caseId: '', newStatus: '' });

  const filtered = statusFilter === 'All' ? cases : cases.filter(c => c.status === statusFilter);

  return (
    <PageShell title="Cases" subtitle={`${cases.length} total cases`}>
      {/* Filter */}
      <div className="flex gap-1.5 flex-wrap">
        {['All', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${statusFilter === s ? 'bg-white/[0.1] text-white' : 'bg-white/[0.03] text-white/40 hover:text-white/70 border border-white/[0.06]'}`}>
            {s}
          </button>
        ))}
      </div>

      <DataTable
        data={filtered}
        searchKeys={['id', 'client', 'category', 'district']}
        columns={[
          { key: 'id', label: 'Case ID', render: r => <span className="font-mono text-xs text-white/40">{r.id}</span> },
          { key: 'client', label: 'Client', render: r => <span className="font-medium text-white/80">{r.client}</span> },
          { key: 'category', label: 'Category' },
          { key: 'district', label: 'District' },
          { key: 'lawyer', label: 'Lawyer', render: r => <span className="text-white/50">{r.lawyer ?? 'Unassigned'}</span> },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
          { key: 'created', label: 'Created', sortable: true, render: r => formatDate(r.created) },
        ]}
        actions={row => (
          <div className="relative inline-block">
            <button onClick={() => setMenuId(menuId === row.id ? null : row.id)}
              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuId === row.id && (
              <div className="absolute right-0 top-full mt-1 w-48 liquid-glass rounded-xl border border-white/[0.1] overflow-hidden z-20">
                <button onClick={() => { setMenuId(null); router.push(`/admin/cases/${row.id}`); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/[0.05]">
                  <Eye className="w-3.5 h-3.5" /> View Case
                </button>
                <div className="border-t border-white/[0.06] px-3 py-1.5">
                  <p className="text-[10px] text-white/25 uppercase tracking-wide font-semibold mb-1">Change Status</p>
                  {['Active', 'Completed', 'On Hold', 'Cancelled', 'Disputed'].map(s => (
                    <button key={s} onClick={() => { setMenuId(null); setConfirm({ open: true, caseId: row.id, newStatus: s }); }}
                      className="w-full text-left px-1 py-1 text-xs text-white/50 hover:text-white transition-colors">
                      → {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      />

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, caseId: '', newStatus: '' })}
        onConfirm={(reason) => { updateCase(confirm.caseId, { status: confirm.newStatus as any }); setConfirm({ open: false, caseId: '', newStatus: '' }); }}
        title={`Change Case Status to "${confirm.newStatus}"`}
        description="Admin override — this action will be logged in the audit trail."
        confirmLabel="Change Status"
        confirmVariant="warning"
        requireReason
        reasonLabel="Reason for status change"
      />
    </PageShell>
  );
}
