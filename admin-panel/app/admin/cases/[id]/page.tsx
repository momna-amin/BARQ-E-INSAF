'use client';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { DetailShell } from '@/components/shell/DetailShell';
import { StatusBadge } from '@/components/shell/DataTable';
import { formatDate, formatDateTime } from '@/lib/utils';
import { FileText, Eye, Download, Flag, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'documents', label: 'Documents' },
  { key: 'proposals', label: 'Proposals' },
  { key: 'messages', label: 'Messages' },
  { key: 'payments', label: 'Payments' },
];

const SAMPLE_TIMELINE = [
  { time: '2026-01-15T09:00:00Z', event: 'Case submitted by client', type: 'submit' },
  { time: '2026-01-15T09:05:00Z', event: 'AI classification: Criminal → Theft (94% confidence)', type: 'ai' },
  { time: '2026-01-16T10:00:00Z', event: 'Matched with 3 lawyers', type: 'match' },
  { time: '2026-01-17T14:00:00Z', event: 'Proposal submitted by Ali Hassan', type: 'proposal' },
  { time: '2026-01-18T09:00:00Z', event: 'Proposal accepted by client', type: 'accepted' },
  { time: '2026-01-20T11:00:00Z', event: 'Payment received PKR 25,000', type: 'payment' },
  { time: '2026-01-20T11:05:00Z', event: 'Case status → Active', type: 'status' },
];

const SAMPLE_EVIDENCE = [
  { id: 'EV-001', name: 'FIR_Copy.pdf', type: 'PDF', size: '2.1 MB', uploader: 'Client', date: '2026-01-15', flagged: false },
  { id: 'EV-002', name: 'Witness_Statement.docx', type: 'DOCX', size: '512 KB', uploader: 'Client', date: '2026-01-16', flagged: false },
  { id: 'EV-003', name: 'CCTV_Footage.mp4', type: 'Video', size: '145 MB', uploader: 'Client', date: '2026-01-17', flagged: true },
];

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { cases, proposals, transactions, updateCase, addAuditLog } = useStore();
  const caseData = cases.find(c => c.id === id);
  const [viewEv, setViewEv] = useState<string | null>(null);
  const [justification, setJustification] = useState('');
  const [downloadDlg, setDownloadDlg] = useState<string | null>(null);

  if (!caseData) return <div className="text-center py-20 text-white/30">Case not found.</div>;

  const caseProposals = proposals.filter(p => p.caseId === id);
  const caseTxns = transactions.filter(t => t.caseId === id);

  return (
    <DetailShell
      title={caseData.id}
      subtitle={`${caseData.category} · ${caseData.district} · Client: ${caseData.client}`}
      status={caseData.status}
      tabs={TABS}
      onBack={() => router.push('/admin/cases')}
      actions={
        <div className="flex gap-2">
          <select
            onChange={e => { if (e.target.value) updateCase(id, { status: e.target.value as any }); }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] text-white border border-white/[0.1] focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>Change Status</option>
            {['Active', 'On Hold', 'Completed', 'Cancelled', 'Disputed'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      }
    >
      {activeTab => (
        <div>
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5 space-y-3">
                <h3 className="text-sm font-bold text-white">Case Details</h3>
                {[
                  { label: 'Case ID', val: caseData.id },
                  { label: 'Category', val: caseData.category },
                  { label: 'Subcategory', val: caseData.subcategory },
                  { label: 'District', val: caseData.district },
                  { label: 'Status', val: <StatusBadge status={caseData.status} /> },
                  { label: 'Created', val: formatDate(caseData.created) },
                  { label: 'Last Updated', val: formatDate(caseData.updated) },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
                    <span className="text-xs text-white/35">{item.label}</span>
                    <span className="text-sm text-white/70">{item.val}</span>
                  </div>
                ))}
              </div>
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5 space-y-3">
                <h3 className="text-sm font-bold text-white">Parties</h3>
                {[
                  { label: 'Client', val: caseData.client, id: caseData.clientId },
                  { label: 'Lawyer', val: caseData.lawyer ?? 'Unassigned', id: caseData.lawyerId },
                ].map(p => (
                  <div key={p.label} className="bg-white/[0.03] rounded-xl p-3">
                    <div className="text-[10px] text-white/25 uppercase tracking-wide mb-0.5">{p.label}</div>
                    <div className="text-sm text-white/70 font-medium">{p.val}</div>
                    {p.id && <div className="text-xs text-white/25 mt-0.5 font-mono">{p.id}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/30" /> Case Timeline
              </h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-white/[0.06]" />
                {SAMPLE_TIMELINE.map((ev, i) => (
                  <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center flex-shrink-0 z-10">
                      <Clock className="w-3.5 h-3.5 text-[#A4F4FD]" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm text-white/70">{ev.event}</p>
                      <p className="text-xs text-white/25 mt-0.5">{formatDateTime(ev.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Evidence Files</h3>
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">⚠️ All views are audit-logged</span>
              </div>
              <div className="space-y-2">
                {SAMPLE_EVIDENCE.map(ev => (
                  <div key={ev.id} className={`flex items-center justify-between p-3 rounded-xl border ${ev.flagged ? 'border-red-500/30 bg-red-500/5' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                    <div className="flex items-center gap-3">
                      <FileText className={`w-4 h-4 ${ev.flagged ? 'text-red-400' : 'text-[#A4F4FD]'}`} />
                      <div>
                        <div className="text-sm text-white/70 font-medium">{ev.name}</div>
                        <div className="text-xs text-white/30">{ev.type} · {ev.size} · {ev.uploader} · {formatDate(ev.date)}</div>
                      </div>
                      {ev.flagged && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">Flagged</span>}
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => { setViewEv(ev.id); addAuditLog({ actor: 'Super Admin', action: 'evidence.viewed', entityType: 'Evidence', entityId: ev.id, ip: '192.168.1.1', timestamp: new Date().toISOString(), details: `Admin viewed ${ev.name}` }); }}
                        className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all" title="Preview">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDownloadDlg(ev.id)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all" title="Download (justification required)">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="Flag for moderation">
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'proposals' && (
            <div className="liquid-glass rounded-2xl border border-white/[0.07] p-4">
              {caseProposals.length === 0 ? <p className="text-white/30 text-sm py-8 text-center">No proposals yet.</p> : (
                <div className="space-y-3">
                  {caseProposals.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                      <div>
                        <div className="text-sm font-medium text-white/80">{p.lawyer}</div>
                        <div className="text-xs text-white/40">PKR {p.fee.toLocaleString()} · {formatDate(p.submitted)}</div>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="liquid-glass rounded-2xl border border-red-500/20 p-8 text-center">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold">Restricted Access</h3>
              <p className="text-white/40 text-sm mt-2 max-w-sm mx-auto">Message transcripts are only accessible with explicit moderation justification for dispute investigation.</p>
              <button className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                Request Access (Requires Reason)
              </button>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="liquid-glass rounded-2xl border border-white/[0.07] p-4">
              {caseTxns.length === 0 ? <p className="text-white/30 text-sm py-8 text-center">No payments.</p> : (
                caseTxns.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                    <div>
                      <div className="text-sm font-medium text-white/80">{t.id}</div>
                      <div className="text-xs text-white/40">PKR {t.amount.toLocaleString()} · {t.method} · {formatDate(t.date)}</div>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5 text-center text-white/30 py-12">
              No case documents uploaded yet.
            </div>
          )}
        </div>
      )}
    </DetailShell>
  );
}
