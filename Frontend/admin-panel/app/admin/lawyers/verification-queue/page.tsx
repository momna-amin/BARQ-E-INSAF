'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { StatusBadge } from '@/components/shell/DataTable';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, MessageSquare, Eye, ChevronLeft, AlertCircle, FileText, Star, Award } from 'lucide-react';

type ActionType = 'approve' | 'reject' | 'request-info' | null;

export default function VerificationQueuePage() {
  const { lawyers, updateLawyer, addAuditLog } = useStore();
  const pending = lawyers.filter(l => l.status === 'Pending' || l.status === 'Under Review');
  const [selected, setSelected] = useState(pending[0]?.id ?? null);
  const [confirm, setConfirm] = useState<{ open: boolean; action: ActionType }>({ open: false, action: null });
  const [infoMsg, setInfoMsg] = useState('');
  const [showInfoComposer, setShowInfoComposer] = useState(false);
  const [docView, setDocView] = useState<string | null>(null);

  const lawyer = pending.find(l => l.id === selected);

  function doAction(reason?: string) {
    if (!selected) return;
    if (confirm.action === 'approve') {
      updateLawyer(selected, { status: 'Verified' });
    } else if (confirm.action === 'reject') {
      updateLawyer(selected, { status: 'Rejected' });
    }
    setConfirm({ open: false, action: null });
  }

  function sendRequestInfo() {
    if (!selected || !infoMsg.trim()) return;
    updateLawyer(selected, { status: 'Under Review' });
    addAuditLog({ actor: 'Super Admin', action: 'lawyer.request-info', entityType: 'Lawyer', entityId: selected, ip: '192.168.1.1', timestamp: new Date().toISOString(), details: infoMsg });
    setInfoMsg('');
    setShowInfoComposer(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Verification Queue</h1>
        <p className="text-sm text-white/40 mt-0.5">{pending.length} lawyers awaiting review</p>
      </div>

      {pending.length === 0 ? (
        <div className="liquid-glass rounded-2xl border border-white/[0.07] p-12 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold">Queue Empty!</h3>
          <p className="text-white/40 text-sm mt-1">All lawyer applications have been reviewed.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[280px_1fr] gap-4">
          {/* Left: List */}
          <div className="liquid-glass rounded-2xl border border-white/[0.07] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Pending Applicants</span>
            </div>
            <div className="overflow-y-auto max-h-[70vh]">
              {pending.map(l => (
                <button key={l.id} onClick={() => setSelected(l.id)}
                  className={cn('w-full text-left px-4 py-3 border-b border-white/[0.04] last:border-0 transition-all',
                    selected === l.id ? 'bg-white/[0.07]' : 'hover:bg-white/[0.03]')}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F2744] to-[#1a3d5c] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{l.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white/80 truncate">{l.name}</div>
                      <div className="text-xs text-white/35 truncate">{l.specialty} · {l.city}</div>
                    </div>
                    <StatusBadge status={l.status} />
                  </div>
                  <div className="text-[10px] text-white/25 mt-1.5 pl-10.5">
                    Submitted: {formatDate(l.registeredOn)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Detail Panel */}
          {lawyer ? (
            <div className="space-y-4">
              {/* Info */}
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{lawyer.name}</h2>
                      <StatusBadge status={lawyer.status} />
                    </div>
                    <p className="text-sm text-white/40 mt-0.5">{lawyer.id} · {lawyer.specialty}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Email', val: lawyer.email },
                    { label: 'Phone', val: lawyer.phone },
                    { label: 'City', val: lawyer.city },
                    { label: 'License #', val: lawyer.license },
                    { label: 'Bar Council', val: lawyer.barCouncil },
                    { label: 'Experience', val: `${lawyer.experience} years` },
                    { label: 'Consultation Fee', val: `PKR ${lawyer.fee.toLocaleString()}` },
                    { label: 'Submitted', val: formatDate(lawyer.registeredOn) },
                  ].map(item => (
                    <div key={item.label} className="bg-white/[0.03] rounded-xl p-3">
                      <div className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-0.5">{item.label}</div>
                      <div className="text-sm text-white/70 font-medium">{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-white/30" /> Uploaded Documents
                </h3>
                <div className="space-y-2">
                  {['Bar Council License', 'CNIC (Front)', 'CNIC (Back)', 'Law Degree Certificate'].map(doc => (
                    <div key={doc} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#A4F4FD]" />
                        <span className="text-sm text-white/70">{doc}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">Uploaded</span>
                      </div>
                      <button onClick={() => setDocView(doc)}
                        className="text-xs text-[#A4F4FD] hover:opacity-80 transition-opacity flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              {showInfoComposer && (
                <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
                  <h3 className="text-sm font-bold text-white mb-3">Request More Information</h3>
                  <textarea
                    value={infoMsg}
                    onChange={e => setInfoMsg(e.target.value)}
                    placeholder="Describe what additional information or document is needed..."
                    rows={4}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none"
                  />
                  <div className="flex gap-2 mt-3">
                    <button onClick={sendRequestInfo}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0F2744] text-[#A4F4FD] hover:bg-[#1a3d5c] transition-all">
                      Send Request
                    </button>
                    <button onClick={() => setShowInfoComposer(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white/40 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={() => setConfirm({ open: true, action: 'approve' })}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all">
                  <CheckCircle className="w-4 h-4" /> Approve Lawyer
                </button>
                <button onClick={() => setConfirm({ open: true, action: 'reject' })}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600/80 hover:bg-red-500 text-white transition-all">
                  <XCircle className="w-4 h-4" /> Reject Application
                </button>
                <button onClick={() => setShowInfoComposer(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white transition-all border border-white/[0.08]">
                  <MessageSquare className="w-4 h-4" /> Request More Info
                </button>
              </div>
            </div>
          ) : (
            <div className="liquid-glass rounded-2xl border border-white/[0.07] p-12 text-center text-white/30">
              Select an applicant from the list to review
            </div>
          )}
        </div>
      )}

      {/* Document Preview Modal */}
      {docView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDocView(null)} />
          <div className="relative w-full max-w-lg liquid-glass rounded-2xl border border-white/[0.1] p-6">
            <h3 className="text-white font-bold mb-4">{docView}</h3>
            <div className="bg-white/[0.04] rounded-xl h-48 flex items-center justify-center border border-dashed border-white/[0.1]">
              <div className="text-center">
                <FileText className="w-10 h-10 text-white/20 mx-auto mb-2" />
                <p className="text-white/30 text-sm">Document preview</p>
                <p className="text-white/20 text-xs mt-1">Will display actual file when connected to storage</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.1] transition-all">
                Download
              </button>
              <button onClick={() => setDocView(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white/40 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, action: null })}
        onConfirm={doAction}
        title={confirm.action === 'approve' ? 'Approve Lawyer Verification' : 'Reject Application'}
        description={
          confirm.action === 'approve'
            ? `Approve ${lawyer?.name}? They will receive a verified badge and be listed on the platform.`
            : `Reject ${lawyer?.name}? They will be notified with your reason.`
        }
        confirmLabel={confirm.action === 'approve' ? 'Approve' : 'Reject'}
        confirmVariant={confirm.action === 'approve' ? 'success' : 'danger'}
        requireReason={confirm.action === 'reject'}
        reasonLabel="Rejection Reason"
        reasonPlaceholder="E.g., Invalid bar license number, incomplete documentation..."
      />
    </div>
  );
}
