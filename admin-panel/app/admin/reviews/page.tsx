'use client';
import { useStore } from '@/lib/store';
import { DataTable, StatusBadge } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';

export default function ReviewsPage() {
  const { reviews, updateReview } = useStore();
  const [confirm, setConfirm] = useState<{ open: boolean; id: string; action: string }>({ open: false, id: '', action: '' });

  function doAction(reason?: string) {
    updateReview(confirm.id, { status: confirm.action === 'remove' ? 'Removed' : 'Published' });
    setConfirm({ open: false, id: '', action: '' });
  }

  return (
    <PageShell title="Reviews" subtitle={`${reviews.length} reviews · ${reviews.filter(r => r.status === 'Flagged').length} flagged`}>
      <DataTable
        data={reviews}
        searchKeys={['reviewer', 'lawyer', 'snippet']}
        columns={[
          { key: 'id', label: 'ID', render: r => <span className="font-mono text-xs text-white/30">{r.id}</span> },
          { key: 'reviewer', label: 'Reviewer', render: r => <span className="font-medium text-white/80">{r.reviewer}</span> },
          { key: 'lawyer', label: 'Lawyer' },
          { key: 'rating', label: 'Rating', render: r => <span className="text-amber-400">{'⭐'.repeat(r.rating)}</span> },
          { key: 'snippet', label: 'Review', render: r => <span className="text-xs text-white/50 max-w-xs truncate block">{r.snippet}</span> },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
          { key: 'date', label: 'Date', render: r => formatDate(r.date) },
        ]}
        actions={row => (
          <div className="flex gap-1">
            {row.status !== 'Removed' ? (
              <button onClick={() => setConfirm({ open: true, id: row.id, action: 'remove' })}
                className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Remove Review">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button onClick={() => setConfirm({ open: true, id: row.id, action: 'restore' })}
                className="p-1.5 rounded-lg text-white/30 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" title="Restore Review">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      />

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: '', action: '' })}
        onConfirm={doAction}
        title={confirm.action === 'remove' ? 'Remove Review' : 'Restore Review'}
        description={confirm.action === 'remove' ? 'Remove this review? It will be hidden from the lawyer\'s profile.' : 'Restore this review to the lawyer\'s public profile.'}
        confirmLabel={confirm.action === 'remove' ? 'Remove' : 'Restore'}
        confirmVariant={confirm.action === 'remove' ? 'danger' : 'success'}
        requireReason={confirm.action === 'remove'}
        reasonLabel="Removal Reason"
        reasonPlaceholder="E.g., Fake review, violates guidelines..."
      />
    </PageShell>
  );
}
