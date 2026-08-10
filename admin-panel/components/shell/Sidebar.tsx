'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import {
  LayoutDashboard, BarChart3, Users, Scale, Briefcase, FileText,
  Calendar, CreditCard, AlertTriangle, Flag, Star, Bot, Globe,
  Tag, MapPin, Shield, ClipboardList, Bell, Settings, ChevronRight,
  ChevronDown, X, Menu, Gavel,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
      { href: '/admin/cases', icon: Briefcase, label: 'Cases' },
      { href: '/admin/evidence-moderation', icon: Shield, label: 'Evidence Moderation' },
    ],
  },
  {
    label: 'People',
    items: [
      { href: '/admin/users', icon: Users, label: 'Users (Clients)' },
      { href: '/admin/lawyers', icon: Scale, label: 'Lawyers' },
      { href: '/admin/lawyers/verification-queue', icon: Gavel, label: 'Verification Queue', badge: 'queue' },
    ],
  },
  {
    label: 'Moderation',
    items: [
      { href: '/admin/disputes', icon: AlertTriangle, label: 'Disputes', badge: 'disputes' },
      { href: '/admin/reports', icon: Flag, label: 'Reports', badge: 'reports' },
      { href: '/admin/reviews', icon: Star, label: 'Reviews' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/admin/ai-monitoring', icon: Bot, label: 'AI Monitoring' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/categories', icon: Tag, label: 'Categories' },
      { href: '/admin/locations', icon: MapPin, label: 'Locations' },
      { href: '/admin/cms/pages', icon: Globe, label: 'CMS Pages' },
      { href: '/admin/cms/faqs', icon: Globe, label: 'FAQs' },
      { href: '/admin/cms/legal-resources', icon: Globe, label: 'Legal Resources' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { href: '/admin/admin-users', icon: Shield, label: 'Admin Users' },
      { href: '/admin/roles-permissions', icon: ClipboardList, label: 'Roles & Permissions' },
      { href: '/admin/audit-logs', icon: ClipboardList, label: 'Audit Logs' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/notifications-center', icon: Bell, label: 'Notifications', badge: 'notifications' },
      { href: '/admin/notification-settings', icon: Bell, label: 'Notif. Settings' },
      { href: '/admin/system-settings', icon: Settings, label: 'System Settings' },
    ],
  },
];

export function Sidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { unreadCount, lawyers, disputes, reports } = useStore();
  const pendingLawyers = lawyers.filter(l => l.status === 'Pending' || l.status === 'Under Review').length;
  const openDisputes = disputes.filter(d => d.status === 'Open').length;
  const newReports = reports.filter(r => r.status === 'New').length;

  const badgeMap: Record<string, number> = {
    queue: pendingLawyers,
    disputes: openDisputes,
    reports: newReports,
    notifications: unreadCount,
  };

  return (
    <div className={cn(
      'flex flex-col h-full bg-[#0a0a0a] border-r border-white/[0.06]',
      mobile ? 'w-72' : 'w-64'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #5C1A1A, #8b2121)' }}>
            <span className="text-white font-black text-sm">BI</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-none">Barq-e-Insaf</div>
            <div className="text-white/30 text-[10px] mt-0.5 font-medium">Admin Panel</div>
          </div>
        </div>
        {mobile && (
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-3 px-3">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-4">
            <div className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-widest text-white/25">
              {group.label}
            </div>
            {group.items.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const badge = item.badge ? badgeMap[item.badge] : 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 group',
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                  )}
                >
                  <item.icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-[#A4F4FD]' : 'text-white/30 group-hover:text-white/50')} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {badge > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#5C1A1A] text-white/90 min-w-[18px] text-center">
                      {badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3 h-3 text-white/20" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5C1A1A] to-[#8b2121] flex items-center justify-center">
            <span className="text-white text-xs font-bold">AK</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white/80 text-xs font-semibold truncate">Asad Khan</div>
            <div className="text-white/30 text-[10px] truncate">SUPER_ADMIN</div>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 text-white/60 hover:text-white"
      >
        <Menu className="w-5 h-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 h-full">
            <Sidebar mobile onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
