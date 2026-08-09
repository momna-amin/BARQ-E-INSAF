'use client';
import { useState } from 'react';
import { PageShell } from '@/components/shell/DetailShell';
import { Save } from 'lucide-react';

const EVENTS = [
  'New User Registration',
  'Lawyer Verification Request',
  'Lawyer Verified',
  'Lawyer Rejected',
  'Case Created',
  'Case Matched',
  'Proposal Submitted',
  'Proposal Accepted',
  'Payment Received',
  'Payment Failed',
  'Dispute Opened',
  'Dispute Resolved',
  'New Report',
  'Admin Action Required',
];

const CHANNELS = ['Email', 'In-App', 'Push'];

type Matrix = Record<string, Record<string, boolean>>;

const DEFAULT_MATRIX: Matrix = {};
EVENTS.forEach(e => {
  DEFAULT_MATRIX[e] = { Email: e.includes('Admin') || e.includes('Dispute') || e.includes('Verification'), 'In-App': true, Push: false };
});

export default function NotificationSettingsPage() {
  const [matrix, setMatrix] = useState<Matrix>(DEFAULT_MATRIX);
  const [saved, setSaved] = useState(false);

  function toggle(event: string, channel: string) {
    setMatrix(prev => ({ ...prev, [event]: { ...prev[event], [channel]: !prev[event][channel] } }));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <PageShell title="Notification Settings" subtitle="Configure event-to-channel notification matrix"
      actions={
        <button onClick={save}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all ${saved ? 'bg-emerald-600' : ''}`}
          style={!saved ? { background: 'linear-gradient(135deg, #5C1A1A, #8b2121)' } : {}}>
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Settings'}
        </button>
      }
    >
      <div className="liquid-glass rounded-2xl border border-white/[0.07] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wide">Event</th>
                {CHANNELS.map(ch => (
                  <th key={ch} className="px-5 py-3 text-center text-xs font-semibold text-white/40 uppercase tracking-wide">{ch}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EVENTS.map(event => (
                <tr key={event} className="data-table-row border-b border-white/[0.04] last:border-0">
                  <td className="px-5 py-3 text-sm text-white/70 font-medium">{event}</td>
                  {CHANNELS.map(ch => (
                    <td key={ch} className="px-5 py-3 text-center">
                      <label className="inline-flex items-center justify-center cursor-pointer">
                        <div
                          onClick={() => toggle(event, ch)}
                          className={`w-9 h-5 rounded-full transition-all relative cursor-pointer ${matrix[event]?.[ch] ? 'bg-[#5C1A1A]' : 'bg-white/[0.1]'}`}
                        >
                          <div className={`absolute w-3.5 h-3.5 rounded-full bg-white top-0.5 transition-all ${matrix[event]?.[ch] ? 'left-4.5' : 'left-0.5'}`} />
                        </div>
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template editor hint */}
      <div className="liquid-glass rounded-xl border border-white/[0.07] p-4">
        <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">Email Template Editor</p>
        <p className="text-sm text-white/30">Custom email templates for each event can be configured by editing the <code className="text-[#A4F4FD]/60 bg-white/[0.04] px-1 rounded">email-templates/</code> directory in the backend repository.</p>
        <p className="text-xs text-white/20 mt-1">WhatsApp &amp; Gmail OTP templates are out of scope for this sprint.</p>
      </div>
    </PageShell>
  );
}
