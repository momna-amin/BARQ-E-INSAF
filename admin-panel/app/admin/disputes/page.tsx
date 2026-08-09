'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { DataTable, StatusBadge } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { formatDate, timeAgo } from '@/lib/utils';
import { Eye, X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function DisputesPage() {
  const { disputes, updateDispute, addAuditLog } = useStore();
  const [drawer, setDrawer] = useState<typeof disputes[0] | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; id: string; action: string }>({ open: false, id: '', action: '' });

  function doAction(reason?: string) {
    const { action, id } = confirm;
    const statusMap: Record<string, string> = { resolve: 'Resolved', reject: 'Rejected', escalate: 'Escalated' };
    updateDispute(id, { status: statusMap[action] as any });
    addAuditLog({ actor: 'Super Admin', action: `dispute.${action}`, entityType: 'Dispute', entityId: id, ip: '192.168.1.1', timestamp: new Date().toISOString(), details: reason || action });
    setConfirm({ open: false, id: '', action: '' });
  }

  const open = disputes.filter(d => d.status === 'Open').length;

  return (
    <PageShell title="Disputes" subtitle={`${disputes.length} disputes · ${open} open`}>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Open', val: disputes.filter(d => d.status === 'Open').length, color: 'text-red-400' },
          { label: 'Under Review', val: disputes.filter(d => d.status === 'Under Review').length, color: 'text-amber-400' },
          { label: 'Resolved', val: disputes.filter(d => d.status === 'Resolved').length, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="liquid-glass rounded-xl border border-white/[0.07] p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <DataTable
        data={disputes}
        searchKeys={['id', 'caseId', 'raisedBy', 'reason']}
        columns={[
          { key: 'id', label: 'Dispute ID', render: r => <span className="font-mono text-xs text-white/30">{r.id}</span> },
          { key: 'caseId', label: 'Case' },
          { key: 'raisedBy', label: 'Raised By' },
          { key: 'reason', label: 'Reason', render: r => <span className="text-xs text-white/50 max-w-xs truncate block">{r.reason}</span> },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
          { key: 'opened', label: 'Opened', render: r => formatDate(r.opened) },
          { key: 'age', label: 'Age (days)' },
        ]}
        actions={row => (
          <div className="flex gap-1">
            <button onClick={() => setDrawer(row as any)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      />

      {/* Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawer(null)} />
          <div className="relative w-full max-w-sm h-full liquid-glass border-l border-white/[0.1] p-6 overflow-y-auto">
            <button onClick={() => setDrawer(null)} className="absolute top-4 right-4 text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-white font-bold">{drawer.id}</h3>
              <StatusBadge status={drawer.status} />
            </div>
            {[
              { label: 'Case', val: drawer.caseId },
              { label: 'Raised By', val: drawer.raisedBy },
              { label: 'Reason', val: drawer.reason },
              { label: 'Status', val: <StatusBadge status={drawer.status} /> },
              { label: 'Opened', val: formatDate(drawer.opened) },
              { label: 'Age', val: `${drawer.age} days` },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-start py-2.5 border-b border-white/[0.06] gap-2">
                <span className="text-xs text-white/40 flex-shrink-0">{item.label}</span>
                <span className="text-sm text-white/70 text-right">{item.val}</span>
              </div>
            ))}
            {(drawer.status === 'Open' || drawer.status === 'Under Review') && (
              <div className="space-y-2 mt-5">
                <button onClick={() => { setDrawer(null); setConfirm({ open: true, id: drawer.id, action: 'resolve' }); }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                  <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                </button>
                <button onClick={() => { setDrawer(null); setConfirm({ open: true, id: drawer.id, action: 'reject' }); }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                  <XCircle className="w-3.5 h-3.5" /> Reject Dispute
                </button>
                <button onClick={() => { setDrawer(null); setConfirm({ open: true, id: drawer.id, action: 'escalate' }); }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                  <AlertTriangle className="w-3.5 h-3.5" /> Escalate
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: '', action: '' })}
        onConfirm={doAction}
        title={confirm.action === 'resolve' ? 'Resolve Dispute' : confirm.action === 'reject' ? 'Reject Dispute' : 'Escalate Dispute'}
        description={`Confirm ${confirm.action} action for dispute ${confirm.id}.`}
        confirmLabel={confirm.action === 'resolve' ? 'Resolve' : confirm.action === 'reject' ? 'Reject' : 'Escalate'}
        confirmVariant={confirm.action === 'resolve' ? 'success' : 'danger'}
        requireReason
        reasonLabel="Resolution Notes"
        reasonPlaceholder="Describe the outcome or next steps..."
      />
    </PageShell>
  );
}
