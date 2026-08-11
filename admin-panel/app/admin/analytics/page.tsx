'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, FunnelChart, Funnel, LabelList } from 'recharts';
import { PLATFORM_GROWTH, CASES_BY_DISTRICT, MOCK_LAWYERS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';

const TABS = ['Platform Growth', 'Conversion Funnel', 'Lawyer Performance', 'Financial', 'Geo'];

const CONVERSION_DATA = [
  { stage: 'Case Created', count: 4825, fill: '#5C1A1A' },
  { stage: 'Case Matched', count: 3220, fill: '#7c2d2d' },
  { stage: 'Proposal Sent', count: 2100, fill: '#A4F4FD88' },
  { stage: 'Proposal Accepted', count: 1580, fill: '#A4F4FD' },
  { stage: 'Payment Completed', count: 1244, fill: '#00d2ff' },
];

const FINANCIAL_DATA = [
  { month: 'Jan', revenue: 820000, payouts: 630000 },
  { month: 'Feb', revenue: 940000, payouts: 720000 },
  { month: 'Mar', revenue: 1050000, payouts: 810000 },
  { month: 'Apr', revenue: 980000, payouts: 750000 },
  { month: 'May', revenue: 1120000, payouts: 880000 },
  { month: 'Jun', revenue: 1200000, payouts: 920000 },
  { month: 'Jul', revenue: 1260000, payouts: 975000 },
  { month: 'Aug', revenue: 1284000, payouts: 989000 },
];

export default function AnalyticsPage() {
  const [tab, setTab] = useState('Platform Growth');
  const [metric, setMetric] = useState<'users' | 'lawyers' | 'cases'>('users');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-white/40 mt-0.5">Deep platform insights</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white/50 hover:text-white bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] transition-all">
          <Download className="w-3.5 h-3.5" /> Export Report
        </button>
      </div>

      {/* Tab strip */}
      <div className="flex gap-0.5 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0',
              tab === t ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white/70')}>
            {t}
          </button>
        ))}
      </div>

      <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
        {tab === 'Platform Growth' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {(['users', 'lawyers', 'cases'] as const).map(m => (
                <button key={m} onClick={() => setMetric(m)}
                  className={cn('px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all',
                    metric === m ? 'bg-[#5C1A1A] text-white' : 'bg-white/[0.04] text-white/40 hover:text-white/70')}>
                  {m}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={PLATFORM_GROWTH}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Line type="monotone" dataKey={metric} stroke="#A4F4FD" strokeWidth={2.5} dot={{ fill: '#A4F4FD', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === 'Conversion Funnel' && (
          <div className="space-y-4">
            <p className="text-sm text-white/50">Case-to-payment conversion funnel</p>
            <div className="space-y-2">
              {CONVERSION_DATA.map((item, i) => {
                const pct = Math.round((item.count / CONVERSION_DATA[0].count) * 100);
                return (
                  <div key={item.stage}>
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>{item.stage}</span>
                      <span>{item.count.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-9 bg-white/[0.04] rounded-xl overflow-hidden">
                      <div className="h-full rounded-xl transition-all" style={{ width: `${pct}%`, background: item.fill }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'Lawyer Performance' && (
          <div>
            <p className="text-sm text-white/50 mb-4">Sorted by cases handled</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {['Lawyer', 'Specialty', 'City', 'Cases', 'Rating', 'Fee/case'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_LAWYERS.filter(l => l.status === 'Verified').sort((a, b) => b.cases - a.cases).map(l => (
                  <tr key={l.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-3 py-2.5 text-white/80 font-medium">{l.name}</td>
                    <td className="px-3 py-2.5 text-white/50">{l.specialty}</td>
                    <td className="px-3 py-2.5 text-white/50">{l.city}</td>
                    <td className="px-3 py-2.5 text-white/70">{l.cases}</td>
                    <td className="px-3 py-2.5 text-amber-400">{l.rating > 0 ? `⭐ ${l.rating}` : '-'}</td>
                    <td className="px-3 py-2.5 text-white/50">PKR {l.fee.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'Financial' && (
          <div>
            <p className="text-sm text-white/50 mb-4">Platform revenue vs lawyer payouts (PKR)</p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={FINANCIAL_DATA}>
                <XAxis dataKey="month" />
                <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} formatter={(v: number) => `PKR ${v.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#5C1A1A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="payouts" name="Payouts" fill="#A4F4FD" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === 'Geo' && (
          <div>
            <p className="text-sm text-white/50 mb-4">Case volume by district (anonymised aggregates)</p>
            <div className="space-y-2.5">
              {CASES_BY_DISTRICT.map((d, i) => {
                const pct = Math.round((d.cases / CASES_BY_DISTRICT[0].cases) * 100);
                return (
                  <div key={d.district} className="flex items-center gap-3">
                    <span className="text-xs text-white/30 w-4 text-right">{i + 1}</span>
                    <span className="text-xs text-white/60 w-32">{d.district}</span>
                    <div className="flex-1 h-5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #5C1A1A, #A4F4FD)' }} />
                    </div>
                    <span className="text-xs text-white/50 w-10 text-right">{d.cases}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
