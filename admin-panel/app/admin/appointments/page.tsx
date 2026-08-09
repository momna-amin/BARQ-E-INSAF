'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { DataTable, StatusBadge } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { formatDateTime } from '@/lib/utils';
import { Eye, X, XCircle } from 'lucide-react';

export default function AppointmentsPage() {
  const { appointments } = useStore();
  const [items, setItems] = useState(appointments);
  const [drawer, setDrawer] = useState<typeof appointments[0] | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  function cancelAppt(reason?: string) {
    setItems(prev => prev.map(a => a.id === confirm.id ? { ...a, status: 'Cancelled' } : a));
    setConfirm({ open: false, id: '' });
  }

  return (
    <PageShell title="Appointments" subtitle={`${items.length} total appointments`}>
      <DataTable
        data={items}
        searchKeys={['id', 'client', 'lawyer', 'caseId']}
        columns={[
          { key: 'id', label: 'ID', render: r => <span className="font-mono text-xs text-white/30">{r.id}</span> },
          { key: 'caseId', label: 'Case' },
          { key: 'client', label: 'Client', render: r => <span className="font-medium text-white/80">{r.client}</span> },
          { key: 'lawyer', label: 'Lawyer' },
          { key: 'type', label: 'Type' },
          { key: 'date', label: 'Date/Time', render: r => formatDateTime(r.date) },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
        ]}
        actions={row => (
          <div className="flex gap-1">
            <button onClick={() => setDrawer(row as any)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
              <Eye className="w-3.5 h-3.5" />
            </button>
            {row.status === 'Scheduled' && (
              <button onClick={() => setConfirm({ open: true, id: row.id })}
                className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      />

      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawer(null)} />
          <div className="relative w-full max-w-sm h-full liquid-glass border-l border-white/[0.1] p-6 overflow-y-auto">
            <button onClick={() => setDrawer(null)} className="absolute top-4 right-4 text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
            <h3 className="text-white font-bold mb-4">{drawer.id}</h3>
            {[
              { label: 'Case', val: drawer.caseId },
              { label: 'Client', val: drawer.client },
              { label: 'Lawyer', val: drawer.lawyer },
              { label: 'Type', val: drawer.type },
              { label: 'Date/Time', val: formatDateTime(drawer.date) },
              { label: 'Status', val: <StatusBadge status={drawer.status} /> },
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
        onConfirm={cancelAppt}
        title="Cancel Appointment"
        description="Cancel this scheduled appointment? Both client and lawyer will be notified."
        confirmLabel="Cancel Appointment"
        confirmVariant="danger"
        requireReason
        reasonLabel="Cancellation Reason"
        reasonPlaceholder="E.g., Lawyer violated platform terms..."
      />
    </PageShell>
  );
}
