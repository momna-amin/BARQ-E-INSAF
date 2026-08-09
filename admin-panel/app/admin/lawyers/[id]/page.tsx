'use client';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { DetailShell } from '@/components/shell/DetailShell';
import { StatusBadge, DataTable } from '@/components/shell/DataTable';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { ShieldOff, ShieldCheck, AlertTriangle, Mail, Phone, MapPin, Award, Scale } from 'lucide-react';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'verification', label: 'Verification' },
  { key: 'cases', label: 'Cases' },
  { key: 'proposals', label: 'Proposals' },
  { key: 'earnings', label: 'Earnings' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'availability', label: 'Availability' },
];

export default function LawyerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { lawyers, cases, proposals, transactions, reviews, updateLawyer } = useStore();
  const lawyer = lawyers.find(l => l.id === id);
  const [confirm, setConfirm] = useState<{ open: boolean; action: string }>({ open: false, action: '' });

  if (!lawyer) return <div className="text-center py-20 text-white/30">Lawyer not found.</div>;

  const lawyerCases = cases.filter(c => c.lawyerId === id);
  const lawyerProposals = proposals.filter(p => p.lawyer === lawyer.name);
  const lawyerReviews = reviews.filter(r => r.lawyer === lawyer.name);

  function doAction(reason?: string) {
    if (confirm.action === 'suspend') updateLawyer(id, { status: 'Suspended' });
    if (confirm.action === 'activate') updateLawyer(id, { status: 'Verified' });
    if (confirm.action === 'revoke') updateLawyer(id, { status: 'Rejected' });
    setConfirm({ open: false, action: '' });
  }

  return (
    <>
      <DetailShell
        title={lawyer.name}
        subtitle={`${lawyer.id} · ${lawyer.specialty} · ${lawyer.city}`}
        status={lawyer.status}
        tabs={TABS}
        onBack={() => router.push('/admin/lawyers')}
        actions={
          <div className="flex gap-2">
            {lawyer.status === 'Verified' && (
              <>
                <button onClick={() => setConfirm({ open: true, action: 'suspend' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                  <ShieldOff className="w-3.5 h-3.5" /> Suspend
                </button>
                <button onClick={() => setConfirm({ open: true, action: 'revoke' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all">
                  <AlertTriangle className="w-3.5 h-3.5" /> Revoke Verification
                </button>
              </>
            )}
            {lawyer.status === 'Suspended' && (
              <button onClick={() => setConfirm({ open: true, action: 'activate' })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                <ShieldCheck className="w-3.5 h-3.5" /> Reactivate
              </button>
            )}
          </div>
        }
      >
        {activeTab => (
          <div>
            {activeTab === 'profile' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">Professional Info</h3>
                  {[
                    { icon: Mail, label: 'Email', val: lawyer.email },
                    { icon: Phone, label: 'Phone', val: lawyer.phone },
                    { icon: MapPin, label: 'City', val: lawyer.city },
                    { icon: Scale, label: 'Specialty', val: lawyer.specialty },
                    { icon: Award, label: 'Experience', val: `${lawyer.experience} years` },
                    { icon: Award, label: 'License', val: lawyer.license },
                    { icon: Award, label: 'Bar Council', val: lawyer.barCouncil },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-white/20" />
                      <div>
                        <div className="text-[10px] text-white/25 uppercase tracking-wide font-semibold">{item.label}</div>
                        <div className="text-sm text-white/70">{item.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
                  <h3 className="text-sm font-bold text-white mb-4">Performance</h3>
                  {[
                    { label: 'Total Cases', val: lawyer.cases },
                    { label: 'Rating', val: lawyer.rating > 0 ? `⭐ ${lawyer.rating}` : 'Not rated' },
                    { label: 'Consultation Fee', val: `PKR ${lawyer.fee.toLocaleString()}` },
                    { label: 'Registered', val: formatDate(lawyer.registeredOn) },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/[0.05]">
                      <span className="text-xs text-white/40">{item.label}</span>
                      <span className="text-sm text-white/70">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'verification' && (
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
                <h3 className="text-sm font-bold text-white mb-4">Verification Record</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Verification Status', val: <StatusBadge status={lawyer.status} /> },
                    { label: 'License Number', val: lawyer.license },
                    { label: 'Bar Council', val: lawyer.barCouncil },
                    { label: 'Submitted On', val: formatDate(lawyer.registeredOn) },
                    { label: 'Documents', val: 'Bar License ✅ · CNIC ✅ · Degree ✅' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-2.5 border-b border-white/[0.05]">
                      <span className="text-xs text-white/40">{item.label}</span>
                      <span className="text-sm text-white/70">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'cases' && (
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-4">
                <DataTable data={lawyerCases as any[]} columns={[
                  { key: 'id', label: 'Case ID' },
                  { key: 'client', label: 'Client' },
                  { key: 'category', label: 'Category' },
                  { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
                  { key: 'created', label: 'Created', render: r => formatDate(r.created) },
                ]} emptyMessage="No cases found." />
              </div>
            )}
            {activeTab === 'proposals' && (
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-4">
                <DataTable data={lawyerProposals as any[]} columns={[
                  { key: 'id', label: 'Proposal ID' },
                  { key: 'caseId', label: 'Case ID' },
                  { key: 'fee', label: 'Fee', render: r => `PKR ${r.fee.toLocaleString()}` },
                  { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
                ]} emptyMessage="No proposals found." />
              </div>
            )}
            {activeTab === 'earnings' && (
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
                <h3 className="text-sm font-bold text-white mb-4">Earnings Overview</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total Earned', val: `PKR ${(lawyer.fee * lawyer.cases * 0.8).toLocaleString()}`, color: 'text-emerald-400' },
                    { label: 'Pending', val: 'PKR 31,500', color: 'text-amber-400' },
                    { label: 'Platform Fee', val: `PKR ${(lawyer.fee * lawyer.cases * 0.1).toLocaleString()}`, color: 'text-white/50' },
                  ].map(e => (
                    <div key={e.label} className="bg-white/[0.04] rounded-xl p-4 text-center">
                      <div className={`text-xl font-bold ${e.color}`}>{e.val}</div>
                      <div className="text-xs text-white/30 mt-1">{e.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-4">
                <DataTable data={lawyerReviews as any[]} columns={[
                  { key: 'reviewer', label: 'Reviewer' },
                  { key: 'rating', label: 'Rating', render: r => `⭐ ${r.rating}` },
                  { key: 'snippet', label: 'Review' },
                  { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
                  { key: 'date', label: 'Date', render: r => formatDate(r.date) },
                ]} emptyMessage="No reviews yet." />
              </div>
            )}
            {activeTab === 'availability' && (
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
                <h3 className="text-sm font-bold text-white mb-3">Availability Schedule (Read-only)</h3>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={day} className="text-center">
                      <div className="text-xs text-white/40 mb-1.5">{day}</div>
                      <div className={`w-full h-16 rounded-xl flex items-center justify-center text-xs ${i < 5 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.03] text-white/20'}`}>
                        {i < 5 ? '9AM–6PM' : 'Off'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DetailShell>

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, action: '' })}
        onConfirm={doAction}
        title={confirm.action === 'suspend' ? 'Suspend Lawyer' : confirm.action === 'revoke' ? 'Revoke Verification' : 'Reactivate Lawyer'}
        description={confirm.action === 'revoke' ? `This is a severe action. ${lawyer.name} will lose verified status and be removed from listings.` : `Confirm ${confirm.action} for ${lawyer.name}?`}
        confirmLabel={confirm.action === 'activate' ? 'Reactivate' : confirm.action === 'suspend' ? 'Suspend' : 'Revoke'}
        confirmVariant={confirm.action === 'activate' ? 'success' : 'danger'}
        requireReason={confirm.action !== 'activate'}
      />
    </>
  );
}
