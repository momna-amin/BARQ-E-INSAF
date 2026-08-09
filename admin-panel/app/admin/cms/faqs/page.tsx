'use client';
import { useState } from 'react';
import { PageShell } from '@/components/shell/DetailShell';
import { Plus, ChevronDown, Pencil, Trash2 } from 'lucide-react';

const FAQS = [
  { id: 'F-01', q: 'How does Barq-e-Insaf work?', a: 'You describe your legal issue, our AI classifies it, and matches you with a verified lawyer.', cat: 'General', published: true },
  { id: 'F-02', q: 'Are the lawyers verified?', a: 'All lawyers go through a strict Bar Council license verification process before being listed.', cat: 'Lawyers', published: true },
  { id: 'F-03', q: 'How are fees determined?', a: 'Each lawyer sets their own fee. A 10% platform fee is added on top.', cat: 'Payments', published: true },
  { id: 'F-04', q: 'Can I get a refund?', a: 'Refunds are available in cases of lawyer non-performance, subject to admin review.', cat: 'Payments', published: false },
];

export default function FAQsPage() {
  const [faqs, setFaqs] = useState(FAQS);
  const [open, setOpen] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editVals, setEditVals] = useState({ q: '', a: '' });

  return (
    <PageShell title="FAQs" subtitle="Frequently asked questions management"
      actions={
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'linear-gradient(135deg, #5C1A1A, #8b2121)' }}>
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      }
    >
      <div className="space-y-2">
        {faqs.map(faq => (
          <div key={faq.id} className="liquid-glass rounded-xl border border-white/[0.07] overflow-hidden">
            <button
              onClick={() => setOpen(open === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40">{faq.cat}</span>
                <span className="text-sm font-medium text-white/80">{faq.q}</span>
                {!faq.published && <span className="text-[10px] badge-draft px-1.5 py-0.5 rounded-full">Draft</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); setEditing(faq.id); setEditVals({ q: faq.q, a: faq.a }); }}
                  className="p-1 rounded text-white/20 hover:text-white/60 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={e => { e.stopPropagation(); setFaqs(prev => prev.filter(f => f.id !== faq.id)); }}
                  className="p-1 rounded text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${open === faq.id ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {open === faq.id && (
              <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
                {editing === faq.id ? (
                  <div className="space-y-3">
                    <textarea value={editVals.q} onChange={e => setEditVals(p => ({ ...p, q: e.target.value }))} rows={2}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none resize-none" />
                    <textarea value={editVals.a} onChange={e => setEditVals(p => ({ ...p, a: e.target.value }))} rows={3}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => { setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, ...editVals } : f)); setEditing(null); }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all">Save</button>
                      <button onClick={() => setEditing(null)} className="px-3 py-1.5 rounded-xl text-xs text-white/40 hover:text-white bg-white/[0.04] transition-all">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-white/50">{faq.a}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
