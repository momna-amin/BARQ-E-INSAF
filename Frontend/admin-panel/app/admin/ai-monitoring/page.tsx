'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { DataTable, StatusBadge } from '@/components/shell/DataTable';
import { PageShell } from '@/components/shell/DetailShell';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Bot, BarChart3, AlertTriangle, DollarSign } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const TABS = ['Sessions', 'Accuracy', 'Flagged Responses', 'Usage & Cost'];

const ACCURACY_DATA = [
  { category: 'Criminal', actual: 412, predicted: 398, accuracy: 96.6 },
  { category: 'Family', actual: 338, predicted: 325, accuracy: 96.2 },
  { category: 'Property', actual: 290, predicted: 278, accuracy: 95.9 },
  { category: 'Civil', actual: 201, predicted: 188, accuracy: 93.5 },
  { category: 'Corporate', actual: 89, predicted: 84, accuracy: 94.4 },
  { category: 'Tax', actual: 67, predicted: 62, accuracy: 92.5 },
];

const FLAGGED_RESPONSES = [
  { id: 'AIR-001', sessionId: 'AIS-002', trigger: 'Gave incorrect procedural advice', severity: 'High', response: 'User should file an FIR within 24 hours...', reviewed: false },
  { id: 'AIR-002', sessionId: 'AIS-003', trigger: 'Hallucinated case law reference', severity: 'Medium', response: 'Under Section 302 PPC (2019 amendment)...', reviewed: true },
];

const USAGE_DATA = [
  { month: 'Jan', sessions: 412, cost: 21 },
  { month: 'Feb', sessions: 489, cost: 25 },
  { month: 'Mar', sessions: 520, cost: 27 },
  { month: 'Apr', sessions: 498, cost: 26 },
  { month: 'May', sessions: 555, cost: 29 },
  { month: 'Jun', sessions: 612, cost: 32 },
  { month: 'Jul', sessions: 650, cost: 34 },
  { month: 'Aug', sessions: 683, cost: 36 },
];

export default function AIMonitoringPage() {
  const { aiSessions } = useStore();
  const [tab, setTab] = useState('Sessions');

  return (
    <PageShell title="AI Monitoring" subtitle="Track AI assistant performance and usage">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Sessions', val: '4,825', icon: Bot, color: '#A4F4FD' },
          { label: 'Avg Classification Accuracy', val: '94.9%', icon: BarChart3, color: '#10b981' },
          { label: 'Flagged Responses', val: '12', icon: AlertTriangle, color: '#f59e0b' },
          { label: 'Est. Monthly Cost', val: '$36 USD', icon: DollarSign, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="liquid-glass rounded-xl border border-white/[0.07] p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
              <span className="text-xs text-white/40">{s.label}</span>
            </div>
            <div className="text-xl font-bold text-white">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Tab strip */}
      <div className="flex gap-0.5 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
              tab === t ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white/70')}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Sessions' && (
        <DataTable
          data={aiSessions}
          searchKeys={['id', 'user', 'caseCreated']}
          columns={[
            { key: 'id', label: 'Session ID', render: r => <span className="font-mono text-xs text-white/30">{r.id}</span> },
            { key: 'user', label: 'User' },
            { key: 'messages', label: 'Messages' },
            { key: 'outcome', label: 'Outcome', render: r => <StatusBadge status={r.outcome} /> },
            { key: 'caseCreated', label: 'Case Created', render: r => r.caseCreated ?? <span className="text-white/20">-</span> },
            { key: 'started', label: 'Started', render: r => formatDateTime(r.started) },
          ]}
        />
      )}

      {tab === 'Accuracy' && (
        <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
          <h3 className="text-sm font-bold text-white mb-4">Classification Accuracy by Category</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['Category', 'Actual Cases', 'AI Predicted', 'Accuracy'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACCURACY_DATA.map(row => (
                <tr key={row.category} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-3 py-2.5 text-white/80 font-medium">{row.category}</td>
                  <td className="px-3 py-2.5 text-white/50">{row.actual}</td>
                  <td className="px-3 py-2.5 text-white/50">{row.predicted}</td>
                  <td className="px-3 py-2.5">
                    <span className={`font-bold ${row.accuracy >= 95 ? 'text-emerald-400' : row.accuracy >= 93 ? 'text-amber-400' : 'text-red-400'}`}>
                      {row.accuracy}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Flagged Responses' && (
        <div className="space-y-3">
          {FLAGGED_RESPONSES.map(fr => (
            <div key={fr.id} className="liquid-glass rounded-2xl border border-amber-500/20 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${fr.severity === 'High' ? 'text-red-400' : 'text-amber-400'}`} />
                  <span className="text-sm font-semibold text-white/80">{fr.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${fr.severity === 'High' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'}`}>
                    {fr.severity}
                  </span>
                </div>
                <StatusBadge status={fr.reviewed ? 'Completed' : 'Pending'} />
              </div>
              <div className="text-xs text-white/40 mb-2">Trigger: {fr.trigger}</div>
              <div className="bg-white/[0.03] rounded-xl p-3 text-xs text-white/50 italic">"{fr.response}..."</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Usage & Cost' && (
        <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
          <h3 className="text-sm font-bold text-white mb-4">AI Sessions & Estimated Cost (Monthly)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={USAGE_DATA}>
              <XAxis dataKey="month" />
              <YAxis yAxisId="sessions" />
              <YAxis yAxisId="cost" orientation="right" tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
              <Bar yAxisId="sessions" dataKey="sessions" name="Sessions" fill="#5C1A1A" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="cost" dataKey="cost" name="Cost (USD)" fill="#A4F4FD" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </PageShell>
  );
}
