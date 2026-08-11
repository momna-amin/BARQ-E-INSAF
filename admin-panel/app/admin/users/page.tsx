'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { DataTable, StatusBadge } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { MoreHorizontal, Eye, ShieldOff, ShieldCheck, Trash2 } from 'lucide-react';
import { formatDate, timeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function UsersPage() {
  const router = useRouter();
  const { users, updateUser } = useStore();
  const [menuId, setMenuId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; action: 'suspend' | 'activate' | 'delete' | null; userId: string }>({ open: false, action: null, userId: '' });

  function handleAction(action: 'suspend' | 'activate' | 'delete', userId: string) {
    setMenuId(null);
    setConfirm({ open: true, action, userId });
  }

  function doAction(reason?: string) {
    const { action, userId } = confirm;
    if (action === 'suspend') updateUser(userId, { status: 'Suspended' });
    if (action === 'activate') updateUser(userId, { status: 'Active' });
    if (action === 'delete') updateUser(userId, { status: 'Deleted' });
    setConfirm({ open: false, action: null, userId: '' });
  }

  const active = users.filter(u => u.status === 'Active').length;
  const suspended = users.filter(u => u.status === 'Suspended').length;

  return (
    <PageShell
      title="Users (Clients)"
      subtitle={`${users.length} total · ${active} active · ${suspended} suspended`}
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', val: users.length, color: 'text-white' },
          { label: 'Active', val: active, color: 'text-emerald-400' },
          { label: 'Suspended', val: suspended, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="liquid-glass rounded-xl border border-white/[0.07] p-4 text-center">
            <div className={cn('text-2xl font-bold', s.color)}>{s.val}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <DataTable
        data={users}
        searchKeys={['name', 'email', 'phone', 'city', 'id']}
        columns={[
          { key: 'id', label: 'ID', render: r => <span className="text-xs text-white/30 font-mono">{r.id}</span> },
          { key: 'name', label: 'Name', sortable: true, render: r => (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5C1A1A] to-[#8b2121] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-bold">{r.name.charAt(0)}</span>
              </div>
              <span className="font-medium text-white/80">{r.name}</span>
            </div>
          )},
          { key: 'email', label: 'Email', render: r => <span className="text-xs text-white/50">{r.email}</span> },
          { key: 'phone', label: 'Phone', render: r => <span className="text-xs text-white/50">{r.phone}</span> },
          { key: 'city', label: 'City', sortable: true },
          { key: 'cases', label: 'Cases', sortable: true, render: r => <span className="text-white/60">{r.cases}</span> },
          { key: 'registeredOn', label: 'Registered', sortable: true, render: r => <span className="text-xs text-white/40">{formatDate(r.registeredOn)}</span> },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
        ]}
        actions={row => (
          <div className="relative inline-block">
            <button
              onClick={() => setMenuId(menuId === row.id ? null : row.id)}
              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuId === row.id && (
              <div className="absolute right-0 top-full mt-1 w-44 liquid-glass rounded-xl border border-white/[0.1] overflow-hidden z-20">
                <button onClick={() => { setMenuId(null); router.push(`/admin/users/${row.id}`); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/[0.05]">
                  <Eye className="w-3.5 h-3.5" /> View Profile
                </button>
                {row.status !== 'Suspended' ? (
                  <button onClick={() => handleAction('suspend', row.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-400/80 hover:text-amber-400 hover:bg-amber-500/5">
                    <ShieldOff className="w-3.5 h-3.5" /> Suspend User
                  </button>
                ) : (
                  <button onClick={() => handleAction('activate', row.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-emerald-400/80 hover:text-emerald-400 hover:bg-emerald-500/5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Reactivate
                  </button>
                )}
                <button onClick={() => handleAction('delete', row.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400/80 hover:text-red-400 hover:bg-red-500/5">
                  <Trash2 className="w-3.5 h-3.5" /> Delete Account
                </button>
              </div>
            )}
          </div>
        )}
      />

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, action: null, userId: '' })}
        onConfirm={doAction}
        title={confirm.action === 'suspend' ? 'Suspend User' : confirm.action === 'delete' ? 'Delete Account' : 'Reactivate User'}
        description={
          confirm.action === 'suspend' ? 'This will prevent the user from accessing the platform.' :
          confirm.action === 'delete' ? 'This will soft-delete the account. The user cannot login. This action is logged.' :
          'This will restore the user\'s access to the platform.'
        }
        confirmLabel={confirm.action === 'suspend' ? 'Suspend' : confirm.action === 'delete' ? 'Delete' : 'Reactivate'}
        confirmVariant={confirm.action === 'activate' ? 'success' : 'danger'}
        requireReason={confirm.action !== 'activate'}
        reasonLabel="Reason for this action"
        reasonPlaceholder="Provide a clear reason (stored in audit log)..."
      />
    </PageShell>
  );
}
