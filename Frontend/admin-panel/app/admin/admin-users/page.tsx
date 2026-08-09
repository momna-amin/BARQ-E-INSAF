'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { DataTable, StatusBadge } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { formatDate, timeAgo } from '@/lib/utils';
import { Plus, MoreHorizontal, Shield, ShieldOff, Mail } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  VERIFICATION_ADMIN: 'Verification Admin',
  SUPPORT_ADMIN: 'Support Admin',
  FINANCE_ADMIN: 'Finance Admin',
  CONTENT_ADMIN: 'Content Admin',
  MODERATION_ADMIN: 'Moderation Admin',
  ANALYTICS_ADMIN: 'Analytics Admin',
};

export default function AdminUsersPage() {
  const { adminUsers } = useStore();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('SUPPORT_ADMIN');
  const [menuId, setMenuId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; id: string; action: string }>({ open: false, id: '', action: '' });

  return (
    <PageShell title="Admin Users" subtitle={`${adminUsers.length} admin accounts`}
      actions={
        <button onClick={() => setShowInvite(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'linear-gradient(135deg, #5C1A1A, #8b2121)' }}>
          <Plus className="w-4 h-4" /> Invite Admin
        </button>
      }
    >
      {showInvite && (
        <div className="liquid-glass rounded-2xl border border-white/[0.1] p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Mail className="w-4 h-4 text-[#A4F4FD]" /> Invite New Admin</h3>
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex-1 min-w-48">
              <label className="block text-[10px] text-white/30 uppercase tracking-wide font-semibold mb-1.5">Email Address</label>
              <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} type="email"
                placeholder="admin@barqeinsaf.pk"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
            </div>
            <div className="w-48">
              <label className="block text-[10px] text-white/30 uppercase tracking-wide font-semibold mb-1.5">Role</label>
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all">
                Send Invite
              </button>
              <button onClick={() => setShowInvite(false)} className="px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={adminUsers}
        searchKeys={['name', 'email', 'role']}
        columns={[
          { key: 'id', label: 'ID', render: r => <span className="font-mono text-xs text-white/30">{r.id}</span> },
          { key: 'name', label: 'Name', render: r => (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5C1A1A] to-[#8b2121] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">{r.name.charAt(0)}</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white/80">{r.name}</div>
                <div className="text-xs text-white/30">{r.email}</div>
              </div>
            </div>
          )},
          { key: 'role', label: 'Role', render: r => (
            <span className="text-xs font-mono text-[#A4F4FD]/80 bg-cyan-500/10 px-2 py-0.5 rounded-lg">{ROLE_LABELS[r.role] || r.role}</span>
          )},
          { key: 'twoFA', label: '2FA', render: r => r.twoFA ? <span className="text-emerald-400 text-xs">✓ Enabled</span> : <span className="text-red-400/60 text-xs">Disabled</span> },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
          { key: 'lastLogin', label: 'Last Login', render: r => <span className="text-xs text-white/40">{timeAgo(r.lastLogin)}</span> },
        ]}
        actions={row => (
          <div className="relative inline-block">
            <button onClick={() => setMenuId(menuId === row.id ? null : row.id)}
              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuId === row.id && row.role !== 'SUPER_ADMIN' && (
              <div className="absolute right-0 top-full mt-1 w-44 liquid-glass rounded-xl border border-white/[0.1] overflow-hidden z-20">
                <button onClick={() => { setMenuId(null); setConfirm({ open: true, id: row.id, action: 'suspend' }); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-400/80 hover:text-amber-400 hover:bg-amber-500/5">
                  <ShieldOff className="w-3.5 h-3.5" /> Suspend Access
                </button>
                <button onClick={() => { setMenuId(null); setConfirm({ open: true, id: row.id, action: 'reset' }); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/[0.05]">
                  <Shield className="w-3.5 h-3.5" /> Reset 2FA
                </button>
              </div>
            )}
          </div>
        )}
      />

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: '', action: '' })}
        onConfirm={() => setConfirm({ open: false, id: '', action: '' })}
        title={confirm.action === 'suspend' ? 'Suspend Admin Access' : 'Reset 2FA'}
        description={`Confirm ${confirm.action} for admin user ${confirm.id}.`}
        confirmLabel={confirm.action === 'suspend' ? 'Suspend' : 'Reset 2FA'}
        confirmVariant="danger"
        requireReason={confirm.action === 'suspend'}
      />
    </PageShell>
  );
}
