'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, AlertTriangle } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'warning' | 'success';
  requireReason?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
};

export function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = 'Confirm', confirmVariant = 'danger',
  requireReason = false, reasonLabel = 'Reason', reasonPlaceholder = 'Provide a reason...',
}: Props) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  function handleConfirm() {
    if (requireReason && !reason.trim()) {
      setError('Reason is required');
      return;
    }
    onConfirm(reason || undefined);
    setReason('');
    setError('');
    onClose();
  }

  const btnColors: Record<string, string> = {
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    warning: 'bg-amber-500 hover:bg-amber-400 text-black',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md liquid-glass rounded-2xl border border-white/[0.1] p-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3 mb-4">
          <div className={cn('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
            confirmVariant === 'danger' ? 'bg-red-500/20' : confirmVariant === 'warning' ? 'bg-amber-500/20' : 'bg-emerald-500/20'
          )}>
            <AlertTriangle className={cn('w-4.5 h-4.5',
              confirmVariant === 'danger' ? 'text-red-400' : confirmVariant === 'warning' ? 'text-amber-400' : 'text-emerald-400'
            )} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="text-sm text-white/50 mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        {requireReason && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">
              {reasonLabel} <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={e => { setReason(e.target.value); setError(''); }}
              placeholder={reasonPlaceholder}
              rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white/50 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={cn('px-5 py-2 rounded-xl text-sm font-semibold transition-all', btnColors[confirmVariant])}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
