'use client';
import { useState } from 'react';
import { PageShell } from '@/components/shell/DetailShell';
import { cn } from '@/lib/utils';
import { Save } from 'lucide-react';

const ROLES = ['SUPER_ADMIN', 'VERIFICATION_ADMIN', 'SUPPORT_ADMIN', 'FINANCE_ADMIN', 'CONTENT_ADMIN', 'MODERATION_ADMIN', 'ANALYTICS_ADMIN'];

const PERMISSIONS = [
  { key: 'users.view', label: 'View Users' },
  { key: 'users.suspend', label: 'Suspend Users' },
  { key: 'users.delete', label: 'Delete Users' },
  { key: 'lawyers.view', label: 'View Lawyers' },
  { key: 'lawyers.verify', label: 'Verify Lawyers' },
  { key: 'lawyers.suspend', label: 'Suspend Lawyers' },
  { key: 'cases.view', label: 'View Cases' },
  { key: 'cases.manage', label: 'Manage Cases' },
  { key: 'evidence.view', label: 'View Evidence' },
  { key: 'evidence.remove', label: 'Remove Evidence' },
  { key: 'payments.view', label: 'View Payments' },
  { key: 'payments.refund', label: 'Process Refunds' },
  { key: 'payments.payout', label: 'Mark Payouts' },
  { key: 'disputes.manage', label: 'Manage Disputes' },
  { key: 'reports.manage', label: 'Manage Reports' },
  { key: 'reviews.remove', label: 'Remove Reviews' },
  { key: 'analytics.view', label: 'View Analytics' },
  { key: 'ai.view', label: 'View AI Data' },
  { key: 'cms.manage', label: 'Manage CMS' },
  { key: 'admin_users.manage', label: 'Manage Admin Users' },
  { key: 'roles.manage', label: 'Manage Roles' },
  { key: 'audit.view', label: 'View Audit Logs' },
  { key: 'settings.manage', label: 'System Settings' },
];

// Preset permission matrix
const PRESET: Record<string, string[]> = {
  SUPER_ADMIN: PERMISSIONS.map(p => p.key),
  VERIFICATION_ADMIN: ['lawyers.view', 'lawyers.verify', 'cases.view', 'audit.view'],
  SUPPORT_ADMIN: ['users.view', 'users.suspend', 'lawyers.view', 'cases.view', 'disputes.manage', 'reports.manage', 'audit.view'],
  FINANCE_ADMIN: ['payments.view', 'payments.refund', 'payments.payout', 'analytics.view', 'audit.view'],
  CONTENT_ADMIN: ['cms.manage', 'analytics.view'],
  MODERATION_ADMIN: ['evidence.view', 'evidence.remove', 'reviews.remove', 'reports.manage', 'disputes.manage', 'audit.view'],
  ANALYTICS_ADMIN: ['analytics.view', 'ai.view', 'audit.view'],
};

export default function RolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState('SUPPORT_ADMIN');
  const [perms, setPerms] = useState<Record<string, string[]>>(PRESET);
  const [saved, setSaved] = useState(false);

  function togglePerm(role: string, perm: string) {
    if (role === 'SUPER_ADMIN') return; // SUPER_ADMIN immutable
    setPerms(prev => ({
      ...prev,
      [role]: prev[role].includes(perm) ? prev[role].filter(p => p !== perm) : [...prev[role], perm],
    }));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <PageShell title="Roles & Permissions" subtitle="Configure what each admin role can do"
      actions={
        <button onClick={save}
          className={cn('flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all',
            saved ? 'bg-emerald-600' : '')}
          style={!saved ? { background: 'linear-gradient(135deg, #5C1A1A, #8b2121)' } : {}}>
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      }
    >
      {/* Role Selector */}
      <div className="flex gap-1.5 flex-wrap">
        {ROLES.map(r => (
          <button key={r} onClick={() => setSelectedRole(r)}
            className={cn('px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
              selectedRole === r ? 'bg-white/[0.1] text-white' : 'bg-white/[0.03] text-white/40 hover:text-white/70 border border-white/[0.06]')}>
            {r.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {selectedRole === 'SUPER_ADMIN' && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-400">
          ⚠️ SUPER_ADMIN has all permissions and cannot be modified.
        </div>
      )}

      {/* Permission Matrix */}
      <div className="liquid-glass rounded-2xl border border-white/[0.07] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Permissions for: {selectedRole.replace(/_/g, ' ')}</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-0">
          {PERMISSIONS.map((perm, i) => {
            const checked = perms[selectedRole]?.includes(perm.key) ?? false;
            return (
              <label key={perm.key}
                className={cn('flex items-center gap-3 px-5 py-3 border-b border-white/[0.04] last:border-0 cursor-pointer transition-all',
                  selectedRole !== 'SUPER_ADMIN' ? 'hover:bg-white/[0.03]' : 'cursor-not-allowed opacity-60'
                )}>
                <div
                  onClick={() => togglePerm(selectedRole, perm.key)}
                  className={cn('w-4.5 h-4.5 rounded flex items-center justify-center flex-shrink-0 border transition-all',
                    checked ? 'bg-[#5C1A1A] border-[#5C1A1A]' : 'bg-transparent border-white/[0.2]'
                  )}>
                  {checked && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>
                <span className="text-sm text-white/70">{perm.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
