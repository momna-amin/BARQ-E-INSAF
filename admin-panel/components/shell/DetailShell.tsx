'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Tab = { label: string; key: string };

type Props = {
  title: string;
  subtitle?: string;
  status?: string;
  statusVariant?: string;
  tabs: Tab[];
  actions?: React.ReactNode;
  children: (activeTab: string) => React.ReactNode;
  onBack?: () => void;
};

export function DetailShell({ title, subtitle, status, statusVariant, tabs, actions, children, onBack }: Props) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? '');

  const badgeColors: Record<string, string> = {
    Active: 'badge-active', Verified: 'badge-verified', Completed: 'badge-completed',
    Pending: 'badge-pending', 'Under Review': 'badge-pending',
    Suspended: 'badge-suspended', Rejected: 'badge-rejected',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            {onBack && (
              <button onClick={onBack} className="mt-0.5 p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg font-bold text-white">{title}</h1>
                {status && (
                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold',
                    badgeColors[status] ?? 'badge-draft'
                  )}>
                    {status}
                  </span>
                )}
              </div>
              {subtitle && <p className="text-sm text-white/40 mt-1">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
        </div>

        {/* Tab Strip */}
        <div className="flex gap-0.5 mt-5 border-b border-white/[0.06] -mb-5 pb-px overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px',
                activeTab === tab.key
                  ? 'text-white border-[#A4F4FD]'
                  : 'text-white/40 border-transparent hover:text-white/70'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>{children(activeTab)}</div>
    </div>
  );
}

// ─── Page Shell ───────────────────────────────────────────────────────────────
export function PageShell({
  title, subtitle, actions, children
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-white/40 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
