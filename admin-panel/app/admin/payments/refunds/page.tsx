'use client';
import { useStore } from '@/lib/store';
import { DataTable, StatusBadge } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { formatDate, formatPKR } from '@/lib/utils';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function RefundsPage() {
  const { refunds, updateRefund } = useStore();
  const [confirm, setConfirm] = useState<{ open: boolean; id: string; action: string }>({ open: false, id: '', action: '' });

  function doAction(reason?: string) {
    updateRefund(confirm.id, { status: confirm.action === 'approve' ? 'Processed' : 'Rejected' });
    setConfirm({ open: false, id: '', action: '' });
  }

  return (
    <PageShell title="Refunds" subtitle="Client refund requests">
      <DataTable
        data={refunds}
        searchKeys={['id', 'txnId', 'client', 'caseId']}
        columns={[
          { key: 'id', label: 'Refund ID', render: r => <span className="font-mono text-xs text-white/30">{r.id}</span> },
          { key: 'txnId', label: 'Txn ID' },
          { key: 'client', label: 'Client', render: r => <span className="font-medium text-white/80">{r.client}</span> },
          { key: 'amount', label: 'Amount', render: r => formatPKR(r.amount) },
          { key: 'reason', label: 'Reason', render: r => <span className="text-xs text-white/50 max-w-xs truncate">{r.reason}</span> },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
          { key: 'requestedOn', label: 'Requested', render: r => formatDate(r.requestedOn) },
        ]}
        actions={row => row.status === 'Approved' ? (
          <div className="flex gap-1.5">
            <button onClick={() => setConfirm({ open: true, id: row.id, action: 'approve' })}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
              <CheckCircle className="w-3 h-3" /> Process
            </button>
            <button onClick={() => setConfirm({ open: true, id: row.id, action: 'reject' })}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
              <XCircle className="w-3 h-3" /> Reject
            </button>
          </div>
        ) : null}
      />

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: '', action: '' })}
        onConfirm={doAction}
        title={confirm.action === 'approve' ? 'Process Refund' : 'Reject Refund'}
        description={confirm.action === 'approve' ? 'This will initiate the refund transfer to the client.' : 'Rejection reason will be sent to the client.'}
        confirmLabel={confirm.action === 'approve' ? 'Process Refund' : 'Reject'}
        confirmVariant={confirm.action === 'approve' ? 'success' : 'danger'}
        requireReason={confirm.action === 'reject'}
        reasonLabel="Rejection reason"
      />
    </PageShell>
  );
}
