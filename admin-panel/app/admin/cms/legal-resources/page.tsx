'use client';
import { useState } from 'react';
import { PageShell } from '@/components/shell/DetailShell';
import { Plus, BookOpen, ExternalLink, Pencil, Trash2 } from 'lucide-react';

const RESOURCES = [
  { id: 'LR-01', title: 'Pakistan Penal Code 1860', category: 'Criminal', type: 'Legislation', url: '#', featured: true },
  { id: 'LR-02', title: 'Family Courts Act 1964', category: 'Family', type: 'Legislation', url: '#', featured: false },
  { id: 'LR-03', title: 'How to File an FIR: Step by Step Guide', category: 'General', type: 'Guide', url: '#', featured: true },
  { id: 'LR-04', title: 'Land Acquisition Act 1894', category: 'Property', type: 'Legislation', url: '#', featured: false },
  { id: 'LR-05', title: 'Understanding Court Hierarchy in Pakistan', category: 'General', type: 'Article', url: '#', featured: false },
];

const TYPES = ['All', 'Legislation', 'Guide', 'Article', 'Form'];

export default function LegalResourcesPage() {
  const [resources, setResources] = useState(RESOURCES);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? resources : resources.filter(r => r.type === filter);

  return (
    <PageShell title="Legal Resources" subtitle="Reference documents and guides for citizens"
      actions={
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: 'linear-gradient(135deg, #5C1A1A, #8b2121)' }}>
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      }
    >
      <div className="flex gap-1.5 flex-wrap">
        {TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === t ? 'bg-white/[0.1] text-white' : 'bg-white/[0.03] text-white/40 hover:text-white/70 border border-white/[0.06]'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map(res => (
          <div key={res.id} className="liquid-glass rounded-xl border border-white/[0.07] p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(164,244,253,0.1)' }}>
              <BookOpen className="w-4 h-4 text-[#A4F4FD]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white/80 truncate">{res.title}</span>
                {res.featured && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400">Featured</span>}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-white/30">{res.category}</span>
                <span className="text-[10px] text-white/20">·</span>
                <span className="text-[10px] text-white/30">{res.type}</span>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button className="p-1.5 rounded-lg text-white/20 hover:text-white hover:bg-white/[0.06] transition-all"><Pencil className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 rounded-lg text-white/20 hover:text-[#A4F4FD] hover:bg-cyan-500/10 transition-all"><ExternalLink className="w-3.5 h-3.5" /></button>
              <button onClick={() => setResources(prev => prev.filter(r => r.id !== res.id))}
                className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
