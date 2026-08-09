'use client';
import { useStore } from '@/lib/store';
import { DataTable, StatusBadge } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { formatDate, formatPKR } from '@/lib/utils';
import { Eye, Download } from 'lucide-react';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function TransactionsPage() {
  const { transactions } = useStore();
  const [receipt, setReceipt] = useState<typeof transactions[0] | null>(null);

  const total = transactions.reduce((s, t) => s + (t.status === 'Success' ? t.amount : 0), 0);
  const fees = transactions.reduce((s, t) => s + (t.status === 'Success' ? t.platformFee : 0), 0);

  return (
    <PageShell title="Transactions" subtitle={`${transactions.length} transactions`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Volume', val: formatPKR(total), color: 'text-white' },
          { label: 'Platform Fees', val: formatPKR(fees), color: 'text-emerald-400' },
          { label: 'Successful', val: transactions.filter(t => t.status === 'Success').length, color: 'text-emerald-400' },
          { label: 'Failed / Refunded', val: transactions.filter(t => t.status !== 'Success' && t.status !== 'Pending').length, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="liquid-glass rounded-xl border border-white/[0.07] p-4">
            <div className={`text-lg font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <DataTable
        data={transactions}
        searchKeys={['id', 'client', 'lawyer', 'caseId', 'gatewayRef']}
        columns={[
          { key: 'id', label: 'Txn ID', render: r => <span className="font-mono text-xs text-white/40">{r.id}</span> },
          { key: 'caseId', label: 'Case' },
          { key: 'client', label: 'Client', render: r => <span className="font-medium text-white/80">{r.client}</span> },
          { key: 'lawyer', label: 'Lawyer' },
          { key: 'amount', label: 'Amount', sortable: true, render: r => formatPKR(r.amount) },
          { key: 'platformFee', label: 'Platform Fee', render: r => formatPKR(r.platformFee) },
          { key: 'method', label: 'Method' },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
          { key: 'date', label: 'Date', sortable: true, render: r => formatDate(r.date) },
        ]}
        actions={row => (
          <button onClick={() => setReceipt(row)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
      />

      {/* Receipt Viewer */}
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setReceipt(null)} />
          <div className="relative w-full max-w-md liquid-glass rounded-2xl border border-white/[0.1] p-6">
            <button onClick={() => setReceipt(null)} className="absolute top-4 right-4 text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
            <div className="text-center mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: 'linear-gradient(135deg, #5C1A1A, #8b2121)' }}>
                <span className="text-white font-bold text-xs">BI</span>
              </div>
              <h3 className="text-white font-bold">Payment Receipt</h3>
              <p className="text-white/30 text-xs mt-0.5">{receipt.id}</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Client', val: receipt.client },
                { label: 'Lawyer', val: receipt.lawyer },
                { label: 'Case ID', val: receipt.caseId },
                { label: 'Amount', val: formatPKR(receipt.amount) },
                { label: 'Platform Fee', val: formatPKR(receipt.platformFee) },
                { label: 'Net to Lawyer', val: formatPKR(receipt.amount - receipt.platformFee) },
                { label: 'Payment Method', val: receipt.method },
                { label: 'Gateway Ref', val: receipt.gatewayRef },
                { label: 'Date', val: formatDate(receipt.date) },
                { label: 'Status', val: <StatusBadge status={receipt.status} /> },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/[0.05]">
                  <span className="text-xs text-white/35">{item.label}</span>
                  <span className="text-sm text-white/70">{item.val}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 rounded-xl text-sm font-semibold bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Receipt PDF
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
