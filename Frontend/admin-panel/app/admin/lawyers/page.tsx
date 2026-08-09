'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { DataTable, StatusBadge } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Eye, CheckCircle, XCircle, ShieldOff, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LawyersPage() {
  const router = useRouter();
  const { lawyers, updateLawyer } = useStore();
  const [menuId, setMenuId] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [confirm, setConfirm] = useState<{ open: boolean; action: string; lawyerId: string }>({ open: false, action: '', lawyerId: '' });

  const STATUSES = ['All', 'Verified', 'Pending', 'Under Review', 'Suspended', 'Rejected'];
  const filtered = filter === 'All' ? lawyers : lawyers.filter(l => l.status === filter);

  function doAction(reason?: string) {
    const { action, lawyerId } = confirm;
    if (action === 'suspend') updateLawyer(lawyerId, { status: 'Suspended' });
    if (action === 'activate') updateLawyer(lawyerId, { status: 'Verified' });
    if (action === 'approve') updateLawyer(lawyerId, { status: 'Verified' });
    if (action === 'reject') updateLawyer(lawyerId, { status: 'Rejected' });
    setConfirm({ open: false, action: '', lawyerId: '' });
  }

  return (
    <PageShell
      title="Lawyers"
      subtitle={`${lawyers.length} total · ${lawyers.filter(l => l.status === 'Verified').length} verified · ${lawyers.filter(l => l.status === 'Pending').length} pending`}
      actions={
        <Link href="/admin/lawyers/verification-queue"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #5C1A1A, #8b2121)' }}>
          Verification Queue ({lawyers.filter(l => l.status === 'Pending' || l.status === 'Under Review').length})
        </Link>
      }
    >
      {/* Status filter */}
      <div className="flex gap-1.5 flex-wrap">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn('px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
              filter === s ? 'bg-white/[0.1] text-white' : 'bg-white/[0.03] text-white/40 hover:text-white/70 border border-white/[0.06]')}>
            {s}
          </button>
        ))}
      </div>

      <DataTable
        data={filtered}
        searchKeys={['name', 'email', 'license', 'city', 'id']}
        columns={[
          { key: 'id', label: 'ID', render: r => <span className="text-xs text-white/30 font-mono">{r.id}</span> },
          { key: 'name', label: 'Name', sortable: true, render: r => (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0F2744] to-[#1a3d5c] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-bold">{r.name.charAt(0)}</span>
              </div>
              <span className="font-medium text-white/80">{r.name}</span>
            </div>
          )},
          { key: 'specialty', label: 'Specialty' },
          { key: 'city', label: 'City', sortable: true },
          { key: 'license', label: 'License #', render: r => <span className="text-xs font-mono text-white/40">{r.license}</span> },
          { key: 'experience', label: 'Exp (yr)', sortable: true, render: r => <span className="text-white/60">{r.experience}</span> },
          { key: 'rating', label: 'Rating', sortable: true, render: r => r.rating > 0 ? <span className="text-amber-400">⭐ {r.rating}</span> : <span className="text-white/20">-</span> },
          { key: 'cases', label: 'Cases', sortable: true },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
        ]}
        actions={row => (
          <div className="relative inline-block">
            <button onClick={() => setMenuId(menuId === row.id ? null : row.id)}
              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuId === row.id && (
              <div className="absolute right-0 top-full mt-1 w-44 liquid-glass rounded-xl border border-white/[0.1] overflow-hidden z-20">
                <button onClick={() => { setMenuId(null); router.push(`/admin/lawyers/${row.id}`); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/[0.05]">
                  <Eye className="w-3.5 h-3.5" /> View Profile
                </button>
                {(row.status === 'Pending' || row.status === 'Under Review') && (
                  <>
                    <button onClick={() => { setMenuId(null); setConfirm({ open: true, action: 'approve', lawyerId: row.id }); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-emerald-400/80 hover:text-emerald-400 hover:bg-emerald-500/5">
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => { setMenuId(null); setConfirm({ open: true, action: 'reject', lawyerId: row.id }); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400/80 hover:text-red-400 hover:bg-red-500/5">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                )}
                {row.status === 'Verified' && (
                  <button onClick={() => { setMenuId(null); setConfirm({ open: true, action: 'suspend', lawyerId: row.id }); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-400/80 hover:text-amber-400 hover:bg-amber-500/5">
                    <ShieldOff className="w-3.5 h-3.5" /> Suspend
                  </button>
                )}
                {row.status === 'Suspended' && (
                  <button onClick={() => { setMenuId(null); setConfirm({ open: true, action: 'activate', lawyerId: row.id }); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-emerald-400/80 hover:text-emerald-400 hover:bg-emerald-500/5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Reactivate
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      />

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, action: '', lawyerId: '' })}
        onConfirm={doAction}
        title={
          confirm.action === 'approve' ? 'Approve Lawyer' :
          confirm.action === 'reject' ? 'Reject Application' :
          confirm.action === 'suspend' ? 'Suspend Lawyer' : 'Reactivate Lawyer'
        }
        description={
          confirm.action === 'approve' ? 'This will verify the lawyer and enable them to receive cases.' :
          confirm.action === 'reject' ? 'The lawyer will be notified with the rejection reason.' :
          confirm.action === 'suspend' ? 'The lawyer will be hidden from search and matching.' :
          'The lawyer\'s account will be restored.'
        }
        confirmLabel={
          confirm.action === 'approve' ? 'Approve' :
          confirm.action === 'reject' ? 'Reject' :
          confirm.action === 'suspend' ? 'Suspend' : 'Reactivate'
        }
        confirmVariant={confirm.action === 'approve' || confirm.action === 'activate' ? 'success' : 'danger'}
        requireReason={confirm.action !== 'approve' && confirm.action !== 'activate'}
      />
    </PageShell>
  );
}
