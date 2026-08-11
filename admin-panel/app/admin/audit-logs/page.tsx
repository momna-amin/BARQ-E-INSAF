'use client';
import { useStore } from '@/lib/store';
import { DataTable } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { formatDateTime } from '@/lib/utils';
import { Lock } from 'lucide-react';

export default function AuditLogsPage() {
  const { auditLogs } = useStore();

  return (
    <PageShell title="Audit Logs" subtitle={`${auditLogs.length} total events · Immutable record`}>
      <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
        <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <p className="text-sm text-amber-400/80">Audit logs are immutable. No edits or deletions are permitted.</p>
      </div>

      <DataTable
        data={auditLogs}
        searchKeys={['actor', 'action', 'entityType', 'entityId', 'details']}
        columns={[
          { key: 'id', label: 'Log ID', render: r => <span className="font-mono text-xs text-white/25">{r.id}</span> },
          { key: 'timestamp', label: 'Timestamp', sortable: true, render: r => <span className="text-xs text-white/50 font-mono">{formatDateTime(r.timestamp)}</span> },
          { key: 'actor', label: 'Actor', render: r => <span className="font-medium text-white/70">{r.actor}</span> },
          { key: 'action', label: 'Action', render: r => <span className="font-mono text-xs text-[#A4F4FD]/70 bg-cyan-500/10 px-1.5 py-0.5 rounded">{r.action}</span> },
          { key: 'entityType', label: 'Entity' },
          { key: 'entityId', label: 'Entity ID', render: r => <span className="font-mono text-xs text-white/30">{r.entityId}</span> },
          { key: 'ip', label: 'IP', render: r => <span className="font-mono text-xs text-white/25">{r.ip}</span> },
          { key: 'details', label: 'Details', render: r => <span className="text-xs text-white/40 max-w-xs truncate block">{r.details}</span> },
        ]}
        pageSize={15}
      />
    </PageShell>
  );
}
