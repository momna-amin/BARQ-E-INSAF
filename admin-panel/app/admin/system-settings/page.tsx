'use client';
import { useState } from 'react';
import { PageShell } from '@/components/shell/DetailShell';
import { cn } from '@/lib/utils';
import { Save, Shield, Settings, CreditCard, FileText, Check } from 'lucide-react';

const TABS = ['General', 'Integrations', 'Fees & Pricing', 'Legal & Terms'];

export default function SystemSettingsPage() {
  const [tab, setTab] = useState('General');
  const [saved, setSaved] = useState(false);

  // Form states
  const [general, setGeneral] = useState({
    platformName: 'Barq-e-Insaf',
    supportEmail: 'support@barqeinsaf.pk',
    contactPhone: '+92 300 0000000',
    maintenanceMode: false,
  });

  const [fees, setFees] = useState({
    platformFeePct: 10,
    minConsultationFee: 1000,
    maxConsultationFee: 50000,
    payoutCycle: 'Monthly (1st of month)',
  });

  const [integrations, setIntegrations] = useState({
    jazzcashEnabled: true,
    easypaisaEnabled: true,
    stripeEnabled: false,
    aiModel: 'Gemini 1.5 Pro',
    r2StorageConfigured: true,
  });

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <PageShell title="System Settings" subtitle="Global platform configuration"
      actions={
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#A4F4FD] bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">
            View System Status
          </button>
          <button onClick={save}
            className={cn('flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all',
              saved ? 'bg-emerald-600' : '')}
            style={!saved ? { background: 'linear-gradient(135deg, #5C1A1A, #8b2121)' } : {}}>
            <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      }
    >
      {/* Tabs */}
      <div className="flex gap-0.5 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
              tab === t ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white/70')}>
            {t}
          </button>
        ))}
      </div>

      <div className="liquid-glass rounded-2xl border border-white/[0.07] p-6">
        {tab === 'General' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white mb-4">Platform Identity</h3>
            <div>
              <label className="block text-xs text-white/40 font-semibold mb-1.5">Platform Name</label>
              <input value={general.platformName} onChange={e => setGeneral(p => ({ ...p, platformName: e.target.value }))}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20" />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-semibold mb-1.5">Support Email</label>
              <input value={general.supportEmail} onChange={e => setGeneral(p => ({ ...p, supportEmail: e.target.value }))}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20" />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-semibold mb-1.5">Helpline Phone</label>
              <input value={general.contactPhone} onChange={e => setGeneral(p => ({ ...p, contactPhone: e.target.value }))}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20" />
            </div>
            <div className="pt-2 border-t border-white/[0.06]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={general.maintenanceMode} onChange={e => setGeneral(p => ({ ...p, maintenanceMode: e.target.checked }))}
                  className="accent-[#5C1A1A] w-4 h-4" />
                <div>
                  <span className="text-sm font-semibold text-white/80">Maintenance Mode</span>
                  <p className="text-xs text-white/30">Temporarily disable client &amp; lawyer portal access for maintenance</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {tab === 'Integrations' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white mb-4">Payment Gateways &amp; Services</h3>
            {[
              { key: 'jazzcashEnabled', label: 'JazzCash Gateway', desc: 'Enable JazzCash direct payments' },
              { key: 'easypaisaEnabled', label: 'EasyPaisa Gateway', desc: 'Enable EasyPaisa direct payments' },
              { key: 'stripeEnabled', label: 'Stripe (International)', desc: 'Enable credit/debit card processing' },
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.05] cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-white/80">{item.label}</div>
                  <div className="text-xs text-white/30">{item.desc}</div>
                </div>
                <input type="checkbox" checked={(integrations as any)[item.key]}
                  onChange={e => setIntegrations(p => ({ ...p, [item.key]: e.target.checked }))}
                  className="accent-[#5C1A1A] w-4 h-4" />
              </label>
            ))}
            <div className="pt-3 border-t border-white/[0.06] space-y-3">
              <div>
                <label className="block text-xs text-white/40 font-semibold mb-1.5">AI Engine</label>
                <select value={integrations.aiModel} onChange={e => setIntegrations(p => ({ ...p, aiModel: e.target.value }))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                  <option value="Gemini 1.5 Flash">Gemini 1.5 Flash</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {tab === 'Fees & Pricing' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white mb-4">Platform Fee Configuration</h3>
            <div>
              <label className="block text-xs text-white/40 font-semibold mb-1.5">Platform Commission Fee (%)</label>
              <input type="number" value={fees.platformFeePct} onChange={e => setFees(p => ({ ...p, platformFeePct: Number(e.target.value) }))}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none" />
              <p className="text-xs text-white/30 mt-1">Added automatically to all accepted proposals</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/40 font-semibold mb-1.5">Min Fee (PKR)</label>
                <input type="number" value={fees.minConsultationFee} onChange={e => setFees(p => ({ ...p, minConsultationFee: Number(e.target.value) }))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-white/40 font-semibold mb-1.5">Max Fee (PKR)</label>
                <input type="number" value={fees.maxConsultationFee} onChange={e => setFees(p => ({ ...p, maxConsultationFee: Number(e.target.value) }))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
            </div>
          </div>
        )}

        {tab === 'Legal & Terms' && (
          <div className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold text-white mb-4">Platform Policies</h3>
            <p className="text-xs text-white/40">Terms of service, privacy policy, and lawyer agreement terms are managed in the CMS Pages section.</p>
            <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.05] space-y-1">
              <div className="text-sm font-semibold text-white/70">Legal Jurisdiction</div>
              <div className="text-xs text-white/40">Islamic Republic of Pakistan (High Courts of Sindh, Punjab, IHC, KPK, Balochistan)</div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
