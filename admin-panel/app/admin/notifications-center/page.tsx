'use client';
import { useStore } from '@/lib/store';
import { PageShell } from '@/components/shell/DetailShell';
import { cn, timeAgo } from '@/lib/utils';
import { useState } from 'react';
import { Bell, Check, CheckCheck, ArrowRight } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  Verification: 'bg-blue-500/15 text-blue-400',
  Dispute: 'bg-red-500/15 text-red-400',
  Cases: 'bg-violet-500/15 text-violet-400',
  Payments: 'bg-emerald-500/15 text-emerald-400',
  System: 'bg-white/10 text-white/40',
};

export default function NotificationsCenterPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useStore();
  const [filter, setFilter] = useState('All');
  const types = ['All', ...Array.from(new Set(notifications.map(n => n.type)))];
  const filtered = filter === 'All' ? notifications : notifications.filter(n => n.type === filter);

  return (
    <PageShell title="Notifications Center" subtitle={`${unreadCount} unread notifications`}
      actions={
        <button onClick={markAllNotificationsRead}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white/50 hover:text-white bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] transition-all">
          <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
        </button>
      }
    >
      {/* Type filters */}
      <div className="flex gap-1.5 flex-wrap">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={cn('px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
              filter === t ? 'bg-white/[0.1] text-white' : 'bg-white/[0.03] text-white/40 hover:text-white/70 border border-white/[0.06]')}>
            {t}
          </button>
        ))}
      </div>

      <div className="liquid-glass rounded-2xl border border-white/[0.07] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-white/25 text-sm">No notifications</div>
        ) : filtered.map(n => (
          <div key={n.id}
            className={cn('flex items-start gap-4 px-5 py-4 border-b border-white/[0.05] last:border-0 transition-all', !n.read ? 'bg-white/[0.02]' : '')}>
            <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', !n.read ? 'bg-[#A4F4FD] pulse-dot' : 'bg-transparent')} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', TYPE_COLORS[n.type] ?? 'bg-white/10 text-white/40')}>
                  {n.type}
                </span>
                <span className="text-sm font-semibold text-white/80">{n.title}</span>
              </div>
              <p className="text-xs text-white/45 mt-1">{n.message}</p>
              <p className="text-[10px] text-white/25 mt-1">{timeAgo(n.createdAt)}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {!n.read && (
                <button onClick={() => markNotificationRead(n.id)}
                  className="p-1.5 rounded-lg text-white/20 hover:text-[#A4F4FD] hover:bg-cyan-500/10 transition-all" title="Mark as read">
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
              {n.entityId && (
                <button className="p-1.5 rounded-lg text-white/20 hover:text-white hover:bg-white/[0.06] transition-all" title="Go to entity">
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
