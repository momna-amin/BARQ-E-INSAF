'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { DataTable, StatusBadge } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { formatDate } from '@/lib/utils';
import { Flag, Eye, X } from 'lucide-react';

export default function ProposalsPage() {
  const { proposals, updateProposal } = useStore();
  const [drawer, setDrawer] = useState<typeof proposals[0] | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  return (
    <PageShell title="Proposals" subtitle={`${proposals.length} total proposals`}>
      <DataTable
        data={proposals}
        searchKeys={['id', 'caseId', 'lawyer', 'client']}
        columns={[
          { key: 'id', label: 'ID', render: r => <span className="font-mono text-xs text-white/30">{r.id}</span> },
          { key: 'caseId', label: 'Case ID' },
          { key: 'lawyer', label: 'Lawyer', render: r => <span className="font-medium text-white/80">{r.lawyer}</span> },
          { key: 'client', label: 'Client' },
          { key: 'fee', label: 'Fee', render: r => `PKR ${r.fee.toLocaleString()}` },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
          { key: 'flagged', label: 'Flagged', render: r => r.flagged ? <span className="text-red-400 text-xs">⚑ Yes</span> : <span className="text-white/20 text-xs">No</span> },
          { key: 'submitted', label: 'Submitted', render: r => formatDate(r.submitted) },
        ]}
        actions={row => (
          <div className="flex gap-1">
            <button onClick={() => setDrawer(row)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
              <Eye className="w-3.5 h-3.5" />
            </button>
            {!row.flagged && (
              <button onClick={() => setConfirm({ open: true, id: row.id })}
                className="p-1.5 rounded-lg text-white/30 hover:text-amber-400 hover:bg-amber-500/10 transition-all">
                <Flag className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      />

      {/* Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawer(null)} />
          <div className="relative w-full max-w-sm h-full liquid-glass border-l border-white/[0.1] p-6 overflow-y-auto">
            <button onClick={() => setDrawer(null)} className="absolute top-4 right-4 text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
            <h3 className="text-white font-bold mb-4">{drawer.id}</h3>
            {[
              { label: 'Case', val: drawer.caseId },
              { label: 'Lawyer', val: drawer.lawyer },
              { label: 'Client', val: drawer.client },
              { label: 'Fee', val: `PKR ${drawer.fee.toLocaleString()}` },
              { label: 'Status', val: <StatusBadge status={drawer.status} /> },
              { label: 'Submitted', val: formatDate(drawer.submitted) },
              { label: 'Flagged', val: drawer.flagged ? '⚑ Yes' : 'No' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-2.5 border-b border-white/[0.06]">
                <span className="text-xs text-white/40">{item.label}</span>
                <span className="text-sm text-white/70">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: '' })}
        onConfirm={(reason) => { updateProposal(confirm.id, { flagged: true }); setConfirm({ open: false, id: '' }); }}
        title="Flag Proposal"
        description="Flag this proposal for suspicious pricing or terms. It will appear in the Reports queue."
        confirmLabel="Flag Proposal"
        confirmVariant="warning"
        requireReason
        reasonLabel="Flag Reason"
        reasonPlaceholder="E.g., Suspicious pricing — 5x market rate..."
      />
    </PageShell>
  );
}
