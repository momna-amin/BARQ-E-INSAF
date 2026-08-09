'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { Users, Scale, CheckCircle, Briefcase, TrendingUp, DollarSign, AlertTriangle, Clock, FileText, Download } from 'lucide-react';
import { cn, formatPKR, timeAgo } from '@/lib/utils';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import {
  DASHBOARD_KPI, CASES_BY_STATUS, CASES_BY_CATEGORY,
  CASES_BY_DISTRICT, LAWYER_VERIFICATION_FUNNEL, PLATFORM_GROWTH
} from '@/lib/mock-data';

const DATE_RANGES = ['Today', '7d', '30d', '90d'] as const;

const KPI_CARDS = [
  { label: 'Total Users', key: 'totalUsers', change: '+142', icon: Users, color: '#3b82f6', grad: 'from-blue-500/20 to-transparent' },
  { label: 'Total Lawyers', key: 'totalLawyers', change: '+12 pending', icon: Scale, color: '#f59e0b', grad: 'from-amber-500/20 to-transparent' },
  { label: 'Verified Lawyers', key: 'verifiedLawyers', change: '76% verified', icon: CheckCircle, color: '#10b981', grad: 'from-emerald-500/20 to-transparent' },
  { label: 'Active Cases', key: 'activeCases', change: '+88 this month', icon: Briefcase, color: '#8b5cf6', grad: 'from-violet-500/20 to-transparent' },
  { label: 'Completed Cases', key: 'completedCases', change: '+156 this month', icon: TrendingUp, color: '#A4F4FD', grad: 'from-cyan-500/20 to-transparent' },
  { label: 'Revenue (Month)', key: 'revenueThisMonth', change: '+23%', icon: DollarSign, color: '#f472b6', grad: 'from-pink-500/20 to-transparent', isPKR: true },
];

const PIE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];

function KPICard({ label, value, change, icon: Icon, color, grad, isPKR }: {
  label: string; value: number; change: string; icon: typeof Users; color: string; grad: string; isPKR?: boolean;
}) {
  const sparkData = Array.from({ length: 7 }, (_, i) => ({ v: Math.max(0, value * (0.7 + 0.04 * i + Math.random() * 0.06)) }));
  return (
    <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5 relative overflow-hidden">
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-30 pointer-events-none', grad)} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + '22' }}>
            <Icon className="w-4.5 h-4.5" style={{ color }} />
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">{change}</span>
        </div>
        <div className="text-2xl font-bold text-white mb-0.5">
          {isPKR ? formatPKR(value) : value.toLocaleString('en-PK')}
        </div>
        <div className="text-xs text-white/40 font-medium">{label}</div>
        {/* Sparkline */}
        <div className="mt-3 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Area type="monotone" dataKey="v" stroke={color} fill={color + '22'} strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { auditLogs, lawyers, disputes, reports } = useStore();
  const [range, setRange] = useState<typeof DATE_RANGES[number]>('30d');

  const pendingLawyers = lawyers.filter(l => l.status === 'Pending' || l.status === 'Under Review').length;
  const openDisputes = disputes.filter(d => d.status === 'Open').length;
  const newReports = reports.filter(r => r.status === 'New').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/40 mt-0.5">Platform health at a glance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/[0.04] border border-white/[0.07] rounded-xl p-1 gap-0.5">
            {DATE_RANGES.map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', range === r ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white/70')}>
                {r}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white/50 hover:text-white bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] transition-all">
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {KPI_CARDS.map((card, i) => (
          <motion.div key={card.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <KPICard
              label={card.label}
              value={(DASHBOARD_KPI as any)[card.key]}
              change={card.change}
              icon={card.icon}
              color={card.color}
              grad={card.grad}
              isPKR={card.isPKR}
            />
          </motion.div>
        ))}
      </div>

      {/* Pending Actions Widget */}
      <div className="liquid-glass rounded-2xl border border-white/[0.07] p-4">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Pending Actions Required
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Lawyers Awaiting Verification', count: pendingLawyers, color: 'text-amber-400', href: '/admin/lawyers/verification-queue', bg: 'bg-amber-500/10' },
            { label: 'Open Disputes', count: openDisputes, color: 'text-red-400', href: '/admin/disputes', bg: 'bg-red-500/10' },
            { label: 'New Reports', count: newReports, color: 'text-orange-400', href: '/admin/reports', bg: 'bg-orange-500/10' },
            { label: 'Pending Refunds', count: 1, color: 'text-purple-400', href: '/admin/payments/refunds', bg: 'bg-purple-500/10' },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className={cn('rounded-xl p-3 flex items-center justify-between hover:brightness-110 transition-all', item.bg)}>
              <span className="text-xs text-white/50 flex-1 pr-2">{item.label}</span>
              <span className={cn('text-xl font-bold', item.color)}>{item.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Platform Growth */}
        <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
          <h3 className="text-sm font-bold text-white mb-4">Platform Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={PLATFORM_GROWTH}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f622" strokeWidth={2} name="Users" />
              <Area type="monotone" dataKey="cases" stroke="#A4F4FD" fill="#A4F4FD22" strokeWidth={2} name="Cases" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cases by Category */}
        <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
          <h3 className="text-sm font-bold text-white mb-4">Cases by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={CASES_BY_CATEGORY} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                {CASES_BY_CATEGORY.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Cases by Status */}
        <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
          <h3 className="text-sm font-bold text-white mb-4">Cases by Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CASES_BY_STATUS} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={70} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
              <Bar dataKey="value" fill="#5C1A1A" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cases by District */}
        <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
          <h3 className="text-sm font-bold text-white mb-4">Top Districts (Cases)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CASES_BY_DISTRICT.slice(0, 6)}>
              <XAxis dataKey="district" tick={{ fontSize: 9 }} />
              <YAxis />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
              <Bar dataKey="cases" fill="#A4F4FD" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lawyer Verification Funnel */}
      <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
        <h3 className="text-sm font-bold text-white mb-4">Lawyer Verification Funnel</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LAWYER_VERIFICATION_FUNNEL.map((item, i) => {
            const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
            return (
              <div key={item.stage} className="text-center p-4 rounded-xl" style={{ background: colors[i] + '15' }}>
                <div className="text-3xl font-bold mb-1" style={{ color: colors[i] }}>{item.count}</div>
                <div className="text-xs text-white/50 font-medium">{item.stage}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/40" />
            Recent Activity
          </h3>
          <Link href="/admin/audit-logs" className="text-xs text-[#A4F4FD] hover:opacity-80 transition-opacity">View all →</Link>
        </div>
        <div className="space-y-2">
          {auditLogs.slice(0, 7).map(log => (
            <div key={log.id} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A4F4FD] mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-white/70 font-medium">{log.actor}</span>
                <span className="text-xs text-white/30 mx-1">·</span>
                <span className="text-xs text-white/50">{log.action}</span>
                <span className="text-xs text-white/25 mx-1">·</span>
                <span className="text-xs text-white/30">{log.entityType} #{log.entityId}</span>
              </div>
              <span className="text-[10px] text-white/25 flex-shrink-0">{timeAgo(log.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
