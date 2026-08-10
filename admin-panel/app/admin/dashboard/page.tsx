'use client';
import { motion } from 'motion/react';
import { Users, Scale, CheckCircle, Briefcase, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { cn, timeAgo } from '@/lib/utils';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { DASHBOARD_KPI, LAWYER_VERIFICATION_FUNNEL } from '@/lib/mock-data';

const KPI_CARDS = [
  { label: 'Total Users', key: 'totalUsers', change: '+142', icon: Users, color: '#3b82f6', grad: 'from-blue-500/20 to-transparent' },
  { label: 'Total Lawyers', key: 'totalLawyers', change: '+12 pending', icon: Scale, color: '#f59e0b', grad: 'from-amber-500/20 to-transparent' },
  { label: 'Verified Lawyers', key: 'verifiedLawyers', change: '76% verified', icon: CheckCircle, color: '#10b981', grad: 'from-emerald-500/20 to-transparent' },
  { label: 'Active Cases', key: 'activeCases', change: '+88 this month', icon: Briefcase, color: '#8b5cf6', grad: 'from-violet-500/20 to-transparent' },
  { label: 'Completed Cases', key: 'completedCases', change: '+156 this month', icon: TrendingUp, color: '#A4F4FD', grad: 'from-cyan-500/20 to-transparent' },
];

function KPICard({ label, value, change, icon: Icon, color, grad }: {
  label: string; value: number; change: string; icon: typeof Users; color: string; grad: string;
}) {
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
          {value.toLocaleString('en-PK')}
        </div>
        <div className="text-xs text-white/40 font-medium">{label}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { auditLogs, lawyers, disputes, reports } = useStore();

  const pendingLawyers = lawyers.filter(l => l.status === 'Pending' || l.status === 'Under Review').length;
  const openDisputes = disputes.filter(d => d.status === 'Open').length;
  const newReports = reports.filter(r => r.status === 'New').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5">Platform health at a glance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {KPI_CARDS.map((card, i) => (
          <motion.div key={card.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <KPICard
              label={card.label}
              value={(DASHBOARD_KPI as any)[card.key]}
              change={card.change}
              icon={card.icon}
              color={card.color}
              grad={card.grad}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Lawyers Awaiting Verification', count: pendingLawyers, color: 'text-amber-400', href: '/admin/lawyers/verification-queue', bg: 'bg-amber-500/10' },
            { label: 'Open Disputes', count: openDisputes, color: 'text-red-400', href: '/admin/disputes', bg: 'bg-red-500/10' },
            { label: 'New Reports', count: newReports, color: 'text-orange-400', href: '/admin/reports', bg: 'bg-orange-500/10' },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className={cn('rounded-xl p-3 flex items-center justify-between hover:brightness-110 transition-all', item.bg)}>
              <span className="text-xs text-white/50 flex-1 pr-2">{item.label}</span>
              <span className={cn('text-xl font-bold', item.color)}>{item.count}</span>
            </Link>
          ))}
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
