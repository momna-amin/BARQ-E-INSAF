'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Eye, EyeOff, Zap, Shield } from 'lucide-react';

const DEMO_CREDS = [
  { role: 'SUPER_ADMIN', email: 'admin@barqeinsaf.pk', password: 'Admin@123', label: 'Super Admin' },
  { role: 'VERIFICATION_ADMIN', email: 'verification@barqeinsaf.pk', password: 'Admin@123', label: 'Verification Admin' },
  { role: 'SUPPORT_ADMIN', email: 'support@barqeinsaf.pk', password: 'Admin@123', label: 'Support Admin' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@barqeinsaf.pk');
  const [password, setPassword] = useState('Admin@123');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 900));
    const valid = DEMO_CREDS.find(c => c.email === email && c.password === password);
    if (valid) {
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials. Try admin@barqeinsaf.pk / Admin@123');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0c0c0c]">
      {/* Background video */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video autoPlay loop muted playsInline
          className="w-full h-full object-cover pointer-events-none opacity-20"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/40 via-[#0c0c0c]/60 to-[#0c0c0c]" />
      </div>

      {/* SVG noise */}
      <svg className="absolute w-0 h-0">
        <filter id="c3-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </svg>

      {/* Guide lines */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #5C1A1A 0%, #8b2121 100%)' }}>
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{
              backgroundImage: 'linear-gradient(to right, #fff 0%, #A4F4FD 40%, #fff 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Barq-e-Insaf
          </h1>
          <p className="text-white/40 text-sm mt-1 font-medium tracking-wide">Administrative Control Panel</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="liquid-glass rounded-3xl border border-white/[0.1] p-7"
        >
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-4 h-4 text-[#A4F4FD]" />
            <span className="text-sm font-semibold text-white/70">Secure Admin Login</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
                placeholder="admin@barqeinsaf.pk"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-white/40 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #5C1A1A 0%, #8b2121 100%)' }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Launch Control Panel
                </>
              )}
            </button>
          </form>

          {/* Demo creds */}
          <div className="mt-5 pt-5 border-t border-white/[0.06]">
            <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2.5">Quick Login (Demo)</p>
            <div className="space-y-1.5">
              {DEMO_CREDS.map(cred => (
                <button
                  key={cred.role}
                  onClick={() => { setEmail(cred.email); setPassword(cred.password); }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] transition-all"
                >
                  <span className="text-[11px] text-white/60 font-medium">{cred.label}</span>
                  <span className="text-[10px] text-white/25 ml-2">{cred.email}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-[11px] text-white/20 mt-6"
        >
          ⚡ Barq-e-Insaf — Legal Access Platform © 2026
        </motion.p>
      </div>
    </div>
  );
}
