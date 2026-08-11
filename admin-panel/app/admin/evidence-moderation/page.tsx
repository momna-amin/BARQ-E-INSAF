'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { PageShell } from '@/components/shell/DetailShell';
import { StatusBadge } from '@/components/shell/DataTable';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { CheckCircle, Trash2, AlertTriangle, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const FLAGGED_ITEMS = [
  { id: 'MOD-001', name: 'CCTV_Footage.mp4', caseId: 'BI-2026-000103', flagReason: 'Potential malware detected by scan', flaggedBy: 'System', date: '2026-08-08', status: 'Pending' },
  { id: 'MOD-002', name: 'FIR_Copy_edited.pdf', caseId: 'BI-2026-000101', flagReason: 'User reported: document appears tampered', flaggedBy: 'User', date: '2026-08-07', status: 'Pending' },
  { id: 'MOD-003', name: 'Audio_Recording.mp3', caseId: 'BI-2026-000107', flagReason: 'Admin flagged during case review', flaggedBy: 'Admin', date: '2026-08-06', status: 'Approved' },
];

export default function EvidenceModerationPage() {
  const { addAuditLog } = useStore();
  const [items, setItems] = useState(FLAGGED_ITEMS);
  const [confirm, setConfirm] = useState<{ open: boolean; action: string; itemId: string }>({ open: false, action: '', itemId: '' });

  function doAction(reason?: string) {
    const { action, itemId } = confirm;
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, status: action === 'approve' ? 'Approved' : action === 'remove' ? 'Removed' : 'Escalated' } : i));
    addAuditLog({ actor: 'Super Admin', action: `evidence.${action}`, entityType: 'Evidence', entityId: itemId, ip: '192.168.1.1', timestamp: new Date().toISOString(), details: reason || 'Moderation action' });
    setConfirm({ open: false, action: '', itemId: '' });
  }

  const pending = items.filter(i => i.status === 'Pending');

  return (
    <PageShell title="Evidence Moderation" subtitle={`${pending.length} items pending moderation`}>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending', val: items.filter(i => i.status === 'Pending').length, color: 'text-amber-400' },
          { label: 'Approved', val: items.filter(i => i.status === 'Approved').length, color: 'text-emerald-400' },
          { label: 'Removed', val: items.filter(i => i.status === 'Removed').length, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="liquid-glass rounded-xl border border-white/[0.07] p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#A4F4FD] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white/80">{item.name}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="text-xs text-white/40 mt-1">Case: {item.caseId} · {formatDate(item.date)}</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs text-amber-400/80">{item.flagReason}</span>
                    <span className="text-[10px] text-white/25">· Flagged by {item.flaggedBy}</span>
                  </div>
                </div>
              </div>
              {item.status === 'Pending' && (
                <div className="flex gap-2">
                  <button onClick={() => setConfirm({ open: true, action: 'approve', itemId: item.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button onClick={() => setConfirm({ open: true, action: 'remove', itemId: item.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                  <button onClick={() => setConfirm({ open: true, action: 'escalate', itemId: item.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                    <AlertTriangle className="w-3.5 h-3.5" /> Escalate
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, action: '', itemId: '' })}
        onConfirm={doAction}
        title={confirm.action === 'approve' ? 'Approve Evidence' : confirm.action === 'remove' ? 'Remove Evidence' : 'Escalate to Dispute'}
        description={confirm.action === 'remove' ? 'The evidence will be permanently removed from storage. The uploader will be notified.' : `Confirm ${confirm.action} action.`}
        confirmLabel={confirm.action === 'approve' ? 'Approve' : confirm.action === 'remove' ? 'Remove' : 'Escalate'}
        confirmVariant={confirm.action === 'approve' ? 'success' : 'danger'}
        requireReason={confirm.action === 'remove'}
        reasonLabel="Removal reason"
      />
    </PageShell>
  );
}
