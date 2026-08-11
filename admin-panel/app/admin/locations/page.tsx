'use client';
import { useState } from 'react';
import { PageShell } from '@/components/shell/DetailShell';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const CITIES_DATA = [
  { id: 'LOC-01', nameEn: 'Karachi', province: 'Sindh', courts: 12, lawyers: 142 },
  { id: 'LOC-02', nameEn: 'Lahore', province: 'Punjab', courts: 10, lawyers: 98 },
  { id: 'LOC-03', nameEn: 'Islamabad', province: 'Federal', courts: 6, lawyers: 64 },
  { id: 'LOC-04', nameEn: 'Rawalpindi', province: 'Punjab', courts: 5, lawyers: 41 },
  { id: 'LOC-05', nameEn: 'Peshawar', province: 'KPK', courts: 7, lawyers: 52 },
  { id: 'LOC-06', nameEn: 'Quetta', province: 'Balochistan', courts: 4, lawyers: 29 },
  { id: 'LOC-07', nameEn: 'Multan', province: 'Punjab', courts: 5, lawyers: 33 },
  { id: 'LOC-08', nameEn: 'Faisalabad', province: 'Punjab', courts: 5, lawyers: 38 },
];

const COURTS_DATA = [
  { id: 'CRT-01', name: 'Karachi High Court', city: 'Karachi', type: 'High Court', judges: 22 },
  { id: 'CRT-02', name: 'Lahore High Court', city: 'Lahore', type: 'High Court', judges: 28 },
  { id: 'CRT-03', name: 'Supreme Court of Pakistan', city: 'Islamabad', type: 'Supreme Court', judges: 17 },
  { id: 'CRT-04', name: 'Federal Shariat Court', city: 'Islamabad', type: 'Shariat Court', judges: 8 },
  { id: 'CRT-05', name: 'Sindh Judicial Academy', city: 'Karachi', type: 'Training', judges: 0 },
];

const TABS = ['Cities & Districts', 'Courts'];

export default function LocationsPage() {
  const [tab, setTab] = useState('Cities & Districts');

  return (
    <PageShell title="Locations" subtitle="Cities, districts, and court management"
      actions={
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #5C1A1A, #8b2121)' }}>
          <Plus className="w-4 h-4" /> Add Location
        </button>
      }
    >
      <div className="flex gap-0.5 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
              tab === t ? 'bg-white/[0.1] text-white' : 'text-white/40 hover:text-white/70')}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Cities & Districts' && (
        <div className="liquid-glass rounded-2xl border border-white/[0.07] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                {['City', 'Province', 'Active Courts', 'Lawyers', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CITIES_DATA.map(city => (
                <tr key={city.id} className="data-table-row border-b border-white/[0.04] last:border-0">
                  <td className="px-4 py-3 font-medium text-white/80">{city.nameEn}</td>
                  <td className="px-4 py-3 text-white/50">{city.province}</td>
                  <td className="px-4 py-3 text-white/50">{city.courts}</td>
                  <td className="px-4 py-3 text-white/50">{city.lawyers}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Courts' && (
        <div className="liquid-glass rounded-2xl border border-white/[0.07] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                {['Court Name', 'City', 'Type', 'Judges', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COURTS_DATA.map(court => (
                <tr key={court.id} className="data-table-row border-b border-white/[0.04] last:border-0">
                  <td className="px-4 py-3 font-medium text-white/80">{court.name}</td>
                  <td className="px-4 py-3 text-white/50">{court.city}</td>
                  <td className="px-4 py-3 text-white/50">{court.type}</td>
                  <td className="px-4 py-3 text-white/50">{court.judges || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
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
