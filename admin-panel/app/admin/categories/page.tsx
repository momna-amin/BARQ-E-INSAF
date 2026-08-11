'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { PageShell } from '@/components/shell/DetailShell';
import { ConfirmDialog } from '@/components/shell/ConfirmDialog';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, GripVertical, Check, X } from 'lucide-react';

export default function CategoriesPage() {
  const { categories } = useStore();
  const [items, setItems] = useState(categories);
  const [editing, setEditing] = useState<string | null>(null);
  const [editVals, setEditVals] = useState({ nameEn: '', nameUr: '', active: true });
  const [adding, setAdding] = useState(false);
  const [newCat, setNewCat] = useState({ nameEn: '', nameUr: '' });
  const [confirm, setConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  function startEdit(item: typeof items[0]) {
    setEditing(item.id);
    setEditVals({ nameEn: item.nameEn, nameUr: item.nameUr, active: item.active });
  }

  function saveEdit(id: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...editVals } : i));
    setEditing(null);
  }

  function addCategory() {
    if (!newCat.nameEn) return;
    const newItem = {
      id: `CAT-${Date.now()}`, ...newCat, slug: newCat.nameEn.toLowerCase().replace(/\s+/g, '-'),
      lawyers: 0, cases: 0, active: true, order: items.length + 1,
    };
    setItems(prev => [...prev, newItem]);
    setNewCat({ nameEn: '', nameUr: '' });
    setAdding(false);
  }

  function deleteCategory(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
    setConfirm({ open: false, id: '' });
  }

  return (
    <PageShell
      title="Categories"
      subtitle="Legal practice area categories"
      actions={
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #5C1A1A, #8b2121)' }}>
          <Plus className="w-4 h-4" /> Add Category
        </button>
      }
    >
      {adding && (
        <div className="liquid-glass rounded-2xl border border-white/[0.1] p-4 flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-48">
            <label className="block text-[10px] text-white/30 uppercase tracking-wide font-semibold mb-1.5">Name (English)</label>
            <input value={newCat.nameEn} onChange={e => setNewCat(p => ({ ...p, nameEn: e.target.value }))}
              placeholder="e.g., Criminal Law"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-[10px] text-white/30 uppercase tracking-wide font-semibold mb-1.5">Name (Urdu)</label>
            <input value={newCat.nameUr} onChange={e => setNewCat(p => ({ ...p, nameUr: e.target.value }))}
              placeholder="فوجداری قانون"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20" />
          </div>
          <div className="flex gap-2">
            <button onClick={addCategory} className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Save
            </button>
            <button onClick={() => setAdding(false)} className="px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="liquid-glass rounded-2xl border border-white/[0.07] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] bg-white/[0.02]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wide w-8">#</th>
              {['Category (EN)', 'Category (UR)', 'Lawyers', 'Cases', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} className="data-table-row border-b border-white/[0.04] last:border-0">
                <td className="px-4 py-3 text-white/20"><GripVertical className="w-4 h-4 cursor-grab" /></td>
                <td className="px-4 py-3">
                  {editing === item.id ? (
                    <input value={editVals.nameEn} onChange={e => setEditVals(p => ({ ...p, nameEn: e.target.value }))}
                      className="bg-white/[0.06] border border-white/[0.1] rounded-lg px-2 py-1 text-sm text-white focus:outline-none" />
                  ) : <span className="font-medium text-white/80">{item.nameEn}</span>}
                </td>
                <td className="px-4 py-3">
                  {editing === item.id ? (
                    <input value={editVals.nameUr} onChange={e => setEditVals(p => ({ ...p, nameUr: e.target.value }))}
                      className="bg-white/[0.06] border border-white/[0.1] rounded-lg px-2 py-1 text-sm text-white focus:outline-none" />
                  ) : <span className="text-white/50 font-urdu">{item.nameUr}</span>}
                </td>
                <td className="px-4 py-3 text-white/50">{item.lawyers}</td>
                <td className="px-4 py-3 text-white/50">{item.cases}</td>
                <td className="px-4 py-3">
                  {editing === item.id ? (
                    <select value={editVals.active ? 'true' : 'false'}
                      onChange={e => setEditVals(p => ({ ...p, active: e.target.value === 'true' }))}
                      className="bg-white/[0.06] border border-white/[0.1] rounded-lg px-2 py-1 text-sm text-white focus:outline-none">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  ) : (
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', item.active ? 'badge-active' : 'badge-draft')}>
                      {item.active ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {editing === item.id ? (
                      <>
                        <button onClick={() => saveEdit(item.id)} className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-all"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"><X className="w-3.5 h-3.5" /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setConfirm({ open: true, id: item.id })} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: '' })}
        onConfirm={() => deleteCategory(confirm.id)}
        title="Delete Category"
        description="This will remove the category. Cases in this category will remain."
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </PageShell>
  );
}
