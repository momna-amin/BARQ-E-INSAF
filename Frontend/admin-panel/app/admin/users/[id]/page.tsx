'use client';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { DetailShell } from '@/components/shell/DetailShell';
import { StatusBadge, DataTable } from '@/components/shell/DataTable';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { useState } from 'react';
import { formatDate, formatDateTime, timeAgo } from '@/lib/utils';
import { ShieldOff, ShieldCheck, Trash2, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'cases', label: 'Cases' },
  { key: 'payments', label: 'Payments' },
  { key: 'reviews', label: 'Reviews Given' },
  { key: 'reports', label: 'Reports' },
  { key: 'activity', label: 'Activity Log' },
];

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { users, cases, transactions, reviews, reports, auditLogs, updateUser } = useStore();
  const user = users.find(u => u.id === id);
  const [confirm, setConfirm] = useState<{ open: boolean; action: string }>({ open: false, action: '' });

  if (!user) return (
    <div className="text-center py-20 text-white/30">User not found. <button onClick={() => router.back()} className="text-[#A4F4FD] hover:opacity-80">← Back</button></div>
  );

  const userCases = cases.filter(c => c.clientId === id);
  const userTxns = transactions.filter(t => t.client === user.name);
  const userReviews = reviews.filter(r => r.reviewer === user.name);
  const userReports = reports.filter(r => r.reportedBy === user.name || r.reportedEntity === user.name);
  const userLogs = auditLogs.filter(l => l.entityId === id);

  function doAction(reason?: string) {
    if (confirm.action === 'suspend') updateUser(id, { status: 'Suspended' });
    if (confirm.action === 'activate') updateUser(id, { status: 'Active' });
    if (confirm.action === 'delete') updateUser(id, { status: 'Deleted' });
    setConfirm({ open: false, action: '' });
  }

  return (
    <>
      <DetailShell
        title={user.name}
        subtitle={`${user.id} · Registered ${formatDate(user.registeredOn)}`}
        status={user.status}
        tabs={TABS}
        onBack={() => router.push('/admin/users')}
        actions={
          <div className="flex gap-2">
            {user.status !== 'Suspended' ? (
              <button onClick={() => setConfirm({ open: true, action: 'suspend' })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                <ShieldOff className="w-3.5 h-3.5" /> Suspend
              </button>
            ) : (
              <button onClick={() => setConfirm({ open: true, action: 'activate' })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                <ShieldCheck className="w-3.5 h-3.5" /> Reactivate
              </button>
            )}
            <button onClick={() => setConfirm({ open: true, action: 'delete' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        }
      >
        {(activeTab) => (
          <div>
            {activeTab === 'profile' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">Personal Information</h3>
                  {[
                    { icon: Mail, label: 'Email', value: user.email },
                    { icon: Phone, label: 'Phone', value: user.phone },
                    { icon: MapPin, label: 'City', value: `${user.city}, ${user.province}` },
                    { icon: Calendar, label: 'Registered', value: formatDate(user.registeredOn) },
                    { icon: Calendar, label: 'Last Login', value: timeAgo(user.lastLogin) },
                    { icon: Briefcase, label: 'CNIC', value: user.cnic },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-white/20 flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-white/30 uppercase tracking-wide font-semibold">{item.label}</div>
                        <div className="text-sm text-white/70">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">Activity Stats</h3>
                  {[
                    { label: 'Total Cases', value: user.cases },
                    { label: 'Status', value: <StatusBadge status={user.status} /> },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/[0.05]">
                      <span className="text-xs text-white/40">{item.label}</span>
                      <span className="text-sm text-white/70">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'cases' && (
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-4">
                <DataTable data={userCases as any[]} columns={[
                  { key: 'id', label: 'Case ID' },
                  { key: 'category', label: 'Category' },
                  { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
                  { key: 'created', label: 'Created', render: r => formatDate(r.created) },
                ]} emptyMessage="No cases found for this user." />
              </div>
            )}
            {activeTab === 'payments' && (
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-4">
                <DataTable data={userTxns as any[]} columns={[
                  { key: 'id', label: 'Txn ID' },
                  { key: 'amount', label: 'Amount', render: r => `PKR ${r.amount.toLocaleString()}` },
                  { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
                  { key: 'date', label: 'Date', render: r => formatDate(r.date) },
                ]} emptyMessage="No transactions found." />
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-4">
                <DataTable data={userReviews as any[]} columns={[
                  { key: 'lawyer', label: 'Lawyer' },
                  { key: 'rating', label: 'Rating', render: r => `⭐ ${r.rating}` },
                  { key: 'snippet', label: 'Review' },
                  { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
                ]} emptyMessage="No reviews given." />
              </div>
            )}
            {activeTab === 'reports' && (
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-4">
                <DataTable data={userReports as any[]} columns={[
                  { key: 'id', label: 'Report ID' },
                  { key: 'type', label: 'Type' },
                  { key: 'reason', label: 'Reason' },
                  { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
                ]} emptyMessage="No reports found." />
              </div>
            )}
            {activeTab === 'activity' && (
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-4">
                <DataTable data={userLogs as any[]} columns={[
                  { key: 'timestamp', label: 'Time', render: r => formatDateTime(r.timestamp) },
                  { key: 'actor', label: 'Actor' },
                  { key: 'action', label: 'Action' },
                  { key: 'details', label: 'Details' },
                ]} emptyMessage="No activity logs found." />
              </div>
            )}
          </div>
        )}
      </DetailShell>

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, action: '' })}
        onConfirm={doAction}
        title={confirm.action === 'suspend' ? 'Suspend User' : confirm.action === 'delete' ? 'Delete Account' : 'Reactivate User'}
        description={confirm.action === 'suspend' ? `Suspend ${user.name}? They will lose platform access.` : confirm.action === 'delete' ? `Permanently soft-delete ${user.name}?` : `Restore ${user.name}'s access?`}
        confirmLabel={confirm.action === 'activate' ? 'Reactivate' : confirm.action === 'delete' ? 'Delete' : 'Suspend'}
        confirmVariant={confirm.action === 'activate' ? 'success' : 'danger'}
        requireReason={confirm.action !== 'activate'}
      />
    </>
  );
}
