'use client';
import { useStore } from '@/lib/store';
import { DataTable, StatusBadge } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { ShieldOff, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function ReportsPage() {
  const { reports, updateReport, updateUser, updateLawyer } = useStore();
  const [confirm, setConfirm] = useState<{ open: boolean; id: string; action: string }>({ open: false, id: '', action: '' });

  function doAction(reason?: string) {
    const { action, id } = confirm;
    const statusMap: Record<string, string> = {
      warn: 'Resolved', restrict: 'Resolved', suspend: 'Resolved', dismiss: 'Dismissed'
    };
    updateReport(id, { status: statusMap[action] as any });
    setConfirm({ open: false, id: '', action: '' });
  }

  return (
    <PageShell title="Reports" subtitle={`${reports.length} reports · ${reports.filter(r => r.status === 'New').length} new`}>
      <DataTable
        data={reports}
        searchKeys={['id', 'type', 'reportedEntity', 'reportedBy']}
        columns={[
          { key: 'id', label: 'ID', render: r => <span className="font-mono text-xs text-white/30">{r.id}</span> },
          { key: 'type', label: 'Type' },
          { key: 'reportedEntity', label: 'Reported', render: r => <span className="font-medium text-white/80">{r.reportedEntity}</span> },
          { key: 'reportedBy', label: 'Reported By' },
          { key: 'reason', label: 'Reason', render: r => <span className="text-xs text-white/50 max-w-xs truncate block">{r.reason}</span> },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
          { key: 'date', label: 'Date', render: r => formatDate(r.date) },
        ]}
        actions={row => row.status === 'New' || row.status === 'Investigating' ? (
          <div className="flex gap-1">
            {[
              { action: 'warn', label: 'Warn', icon: AlertTriangle, cls: 'text-amber-400 hover:bg-amber-500/10' },
              { action: 'restrict', label: 'Restrict', icon: ShieldOff, cls: 'text-orange-400 hover:bg-orange-500/10' },
              { action: 'suspend', label: 'Suspend', icon: XCircle, cls: 'text-red-400 hover:bg-red-500/10' },
              { action: 'dismiss', label: 'Dismiss', icon: CheckCircle, cls: 'text-white/30 hover:text-white hover:bg-white/[0.05]' },
            ].map(btn => (
              <button key={btn.action} onClick={() => setConfirm({ open: true, id: row.id, action: btn.action })}
                title={btn.label}
                className={`p-1.5 rounded-lg transition-all ${btn.cls}`}>
                <btn.icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        ) : null}
      />

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: '', action: '' })}
        onConfirm={doAction}
        title={`Action: ${confirm.action.charAt(0).toUpperCase() + confirm.action.slice(1)}`}
        description={`Confirm "${confirm.action}" action for this report. This will be logged in the audit trail.`}
        confirmLabel={confirm.action.charAt(0).toUpperCase() + confirm.action.slice(1)}
        confirmVariant={confirm.action === 'dismiss' ? 'success' : 'danger'}
        requireReason
        reasonLabel="Notes"
        reasonPlaceholder="Describe the action taken and reasoning..."
      />
    </PageShell>
  );
}
