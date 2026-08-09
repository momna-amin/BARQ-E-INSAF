'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Scale, Users, HeartHandshake, Zap, ArrowRight } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Client-side fallback redirect to /admin/login
    const timer = setTimeout(() => {
      router.push('/admin/login');
    }, 1200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background video loop */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <video autoPlay loop muted playsInline
          className="w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/50 via-[#0c0c0c]/80 to-[#0c0c0c]" />
      </div>

      <div className="relative z-10 w-full max-w-xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2"
          style={{ background: 'linear-gradient(135deg, #5C1A1A 0%, #8b2121 100%)' }}>
          <Zap className="w-8 h-8 text-white" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Barq-e-Insaf Ecosystem
          </h1>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Legal Access Platform — Redirecting to Admin Control Panel...
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#A4F4FD]">
          <div className="w-4 h-4 border-2 border-[#A4F4FD]/30 border-t-[#A4F4FD] rounded-full animate-spin" />
          <span>Opening Portal...</span>
        </div>

        {/* Manual Links */}
        <div className="pt-6 border-t border-white/[0.08] grid grid-cols-2 gap-3 text-left">
          <Link href="/admin/login" className="liquid-glass rounded-2xl border border-white/[0.1] p-4 hover:bg-white/[0.05] transition-all group">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-[#A4F4FD]" />
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
            </div>
            <div className="text-sm font-bold text-white">Admin Control Room</div>
            <div className="text-[11px] text-white/40 mt-0.5">Master Portal (30+ Pages)</div>
          </Link>

          <Link href="/admin/dashboard" className="liquid-glass rounded-2xl border border-white/[0.1] p-4 hover:bg-white/[0.05] transition-all group">
            <div className="flex items-center justify-between mb-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
            </div>
            <div className="text-sm font-bold text-white">Live Dashboard</div>
            <div className="text-[11px] text-white/40 mt-0.5">Metrics &amp; Analytics</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
