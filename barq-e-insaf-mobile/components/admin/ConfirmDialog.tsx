import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, Modal, StyleSheet,
} from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import { GlassCard } from './GlassCard';
import { Button } from './Button';

type Variant = 'danger' | 'warning' | 'success';

export function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = 'Confirm', confirmVariant = 'danger',
  requireReason = false, reasonLabel = 'Reason', reasonPlaceholder = 'Provide a reason...',
}: {
  open: boolean; onClose: () => void; onConfirm: (reason?: string) => void;
  title: string; description: string; confirmLabel?: string; confirmVariant?: Variant;
  requireReason?: boolean; reasonLabel?: string; reasonPlaceholder?: string;
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  function handleConfirm() {
    if (requireReason && !reason.trim()) { setError('Reason is required'); return; }
    onConfirm(reason || undefined);
    setReason(''); setError(''); onClose();
  }

  const iconBg = ({ danger: 'rgba(239,68,68,0.2)', warning: 'rgba(245,158,11,0.2)', success: 'rgba(16,185,129,0.2)' } as Record<Variant, string>)[confirmVariant];
  const iconFg = ({ danger: '#f87171', warning: '#fbbf24', success: '#34d399' } as Record<Variant, string>)[confirmVariant];

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <View style={styles.centerWrap}>
          <GlassCard style={{ width: '100%', maxWidth: 400 }}>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <X size={16} color="rgba(255,255,255,0.3)" />
            </Pressable>
            <View style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
                <AlertTriangle size={18} color={iconFg} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.desc}>{description}</Text>
              </View>
            </View>

            {requireReason && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>{reasonLabel} *</Text>
                <TextInput
                  value={reason}
                  onChangeText={t => { setReason(t); setError(''); }}
                  placeholder={reasonPlaceholder}
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  multiline numberOfLines={3}
                  style={styles.textarea}
                />
                {!!error && <Text style={styles.error}>{error}</Text>}
              </View>
            )}

            <View style={styles.actions}>
              <Button label="Cancel" variant="ghost" onPress={onClose} />
              <Button label={confirmLabel} variant={confirmVariant} onPress={handleConfirm} />
            </View>
          </GlassCard>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  closeBtn: { position: 'absolute', top: 12, right: 12, zIndex: 1 },
  row: { flexDirection: 'row', gap: 12, marginTop: 4 },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
  desc: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4, lineHeight: 18 },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  textarea: {
    backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 10,
    color: '#fff', fontSize: 13, textAlignVertical: 'top', minHeight: 70,
  },
  error: { color: '#f87171', fontSize: 11, marginTop: 4 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 16 },
});
