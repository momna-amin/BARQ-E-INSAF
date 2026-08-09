'use client';
import { useStore } from '@/lib/store';
import { DataTable, StatusBadge } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { formatDate, formatPKR } from '@/lib/utils';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function PayoutsPage() {
  const { payouts, updatePayout } = useStore();
  const [confirm, setConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  const totalPending = payouts.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amountDue, 0);

  return (
    <PageShell title="Lawyer Payouts" subtitle="Monthly earnings distribution">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Pending Payouts', val: formatPKR(totalPending), color: 'text-amber-400' },
          { label: 'Pending Count', val: payouts.filter(p => p.status === 'Pending').length, color: 'text-amber-400' },
          { label: 'Paid This Month', val: payouts.filter(p => p.status === 'Paid').length, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="liquid-glass rounded-xl border border-white/[0.07] p-4">
            <div className={`text-xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <DataTable
        data={payouts}
        searchKeys={['lawyer', 'id', 'period']}
        columns={[
          { key: 'id', label: 'Payout ID', render: r => <span className="font-mono text-xs text-white/30">{r.id}</span> },
          { key: 'lawyer', label: 'Lawyer', render: r => <span className="font-medium text-white/80">{r.lawyer}</span> },
          { key: 'period', label: 'Period' },
          { key: 'amountDue', label: 'Amount Due', render: r => formatPKR(r.amountDue) },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
          { key: 'paidOn', label: 'Paid On', render: r => r.paidOn ? formatDate(r.paidOn) : '-' },
        ]}
        actions={row => row.status === 'Pending' ? (
          <button onClick={() => setConfirm({ open: true, id: row.id })}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
            <CheckCircle className="w-3.5 h-3.5" /> Mark Paid
          </button>
        ) : null}
      />

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: '' })}
        onConfirm={() => { updatePayout(confirm.id, { status: 'Paid', paidOn: new Date().toISOString().split('T')[0] }); setConfirm({ open: false, id: '' }); }}
        title="Mark Payout as Paid"
        description="Confirm that this payout has been transferred to the lawyer's bank account."
        confirmLabel="Mark as Paid"
        confirmVariant="success"
      />
    </PageShell>
  );
}
