'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, ChevronDown, LogOut, User, Key, Settings, Check } from 'lucide-react';
import { cn, timeAgo } from '@/lib/utils';
import { useStore } from '@/lib/store';

export function TopBar() {
  const router = useRouter();
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useStore();
  const [search, setSearch] = useState('');
  const [showBell, setShowBell] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setShowBell(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-14 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center px-4 gap-3 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users, lawyers, cases..."
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/15 focus:bg-white/[0.06] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Bell */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => { setShowBell(v => !v); setShowProfile(false); }}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.05] transition-all"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full pulse-dot" />
            )}
          </button>
          {showBell && (
            <div className="absolute right-0 top-full mt-2 w-80 liquid-glass rounded-2xl border border-white/[0.08] overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <button onClick={markAllNotificationsRead} className="text-xs text-white/40 hover:text-white/70 transition-colors">
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.slice(0, 8).map(n => (
                  <button
                    key={n.id}
                    onClick={() => { markNotificationRead(n.id); router.push('/admin/notifications-center'); setShowBell(false); }}
                    className={cn('w-full text-left px-4 py-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0', !n.read && 'bg-white/[0.02]')}
                  >
                    <div className="flex items-start gap-2.5">
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#A4F4FD] mt-1.5 flex-shrink-0" />}
                      {n.read && <span className="w-1.5 h-1.5 mt-1.5 flex-shrink-0" />}
                      <div>
                        <div className="text-xs font-semibold text-white/80">{n.title}</div>
                        <div className="text-[11px] text-white/40 mt-0.5 line-clamp-2">{n.message}</div>
                        <div className="text-[10px] text-white/25 mt-1">{timeAgo(n.createdAt)}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-white/[0.06]">
                <Link href="/admin/notifications-center" onClick={() => setShowBell(false)} className="text-xs text-[#A4F4FD] hover:opacity-80 transition-opacity">
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile(v => !v); setShowBell(false); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5C1A1A] to-[#8b2121] flex items-center justify-center">
              <span className="text-white text-xs font-bold">AK</span>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-white/80">Asad Khan</div>
              <div className="text-[10px] text-white/30">SUPER_ADMIN</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/30" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-52 liquid-glass rounded-xl border border-white/[0.08] overflow-hidden z-50">
              {[
                { icon: User, label: 'Profile', href: '/admin/system-settings' },
                { icon: Key, label: 'Change Password', href: '/admin/system-settings' },
                { icon: Settings, label: '2FA Settings', href: '/admin/system-settings' },
              ].map(item => (
                <Link key={item.label} href={item.href} onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-all">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-white/[0.06]">
                <Link href="/admin/login"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-all">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
