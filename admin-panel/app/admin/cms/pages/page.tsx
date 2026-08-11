'use client';
import { useState } from 'react';
import { PageShell } from '@/components/shell/DetailShell';
import { Plus, Pencil, Trash2, Globe } from 'lucide-react';

const PAGES = [
  { id: 'PG-01', title: 'Home', slug: '/', status: 'Published', lastEdited: '2026-08-01' },
  { id: 'PG-02', title: 'About Us', slug: '/about', status: 'Published', lastEdited: '2026-07-20' },
  { id: 'PG-03', title: 'Terms of Service', slug: '/terms', status: 'Published', lastEdited: '2026-06-15' },
  { id: 'PG-04', title: 'Privacy Policy', slug: '/privacy', status: 'Published', lastEdited: '2026-06-15' },
  { id: 'PG-05', title: 'Contact Us', slug: '/contact', status: 'Published', lastEdited: '2026-05-01' },
];

export default function CMSPagesPage() {
  const [pages, setPages] = useState(PAGES);
  const [editing, setEditing] = useState<string | null>(null);
  const [content, setContent] = useState('');

  return (
    <PageShell title="CMS Pages" subtitle="Manage static site pages"
      actions={
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'linear-gradient(135deg, #5C1A1A, #8b2121)' }}>
          <Plus className="w-4 h-4" /> New Page
        </button>
      }
    >
      {editing ? (
        <div className="liquid-glass rounded-2xl border border-white/[0.07] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold">Editing: {pages.find(p => p.id === editing)?.title}</h3>
            <div className="flex gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all">Save Changes</button>
              <button onClick={() => setEditing(null)} className="px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all">Cancel</button>
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3">
            <div className="flex gap-2 mb-2 flex-wrap">
              {['B', 'I', 'H1', 'H2', 'UL', 'OL', 'Link'].map(fmt => (
                <button key={fmt} className="px-2 py-1 rounded bg-white/[0.06] text-white/60 hover:text-white text-xs font-mono transition-all">{fmt}</button>
              ))}
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Page content (supports Markdown / HTML)..."
              rows={14}
              className="w-full bg-transparent text-sm text-white/70 placeholder:text-white/20 focus:outline-none resize-none"
            />
          </div>
        </div>
      ) : (
        <div className="liquid-glass rounded-2xl border border-white/[0.07] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                {['Title', 'Slug', 'Status', 'Last Edited', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id} className="data-table-row border-b border-white/[0.04] last:border-0">
                  <td className="px-4 py-3 font-medium text-white/80">{page.title}</td>
                  <td className="px-4 py-3"><span className="font-mono text-xs text-white/40">{page.slug}</span></td>
                  <td className="px-4 py-3"><span className="badge-active text-[11px] px-2 py-0.5 rounded-full">{page.status}</span></td>
                  <td className="px-4 py-3 text-white/40 text-xs">{page.lastEdited}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setEditing(page.id)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-[#A4F4FD] hover:bg-cyan-500/10 transition-all"><Globe className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}
