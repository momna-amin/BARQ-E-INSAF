import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';

type Variant = 'danger' | 'warning' | 'success' | 'ghost' | 'primary';
const variants: Record<Variant, { bg: string; fg: string }> = {
  danger:  { bg: '#dc2626', fg: '#fff' },
  warning: { bg: '#f59e0b', fg: '#000' },
  success: { bg: '#059669', fg: '#fff' },
  primary: { bg: '#5C1A1A', fg: '#fff' },
  ghost:   { bg: 'rgba(255,255,255,0.04)', fg: 'rgba(255,255,255,0.5)' },
};

export function Button({ label, onPress, variant = 'primary', loading, disabled }: {
  label: string; onPress: () => void; variant?: Variant; loading?: boolean; disabled?: boolean;
}) {
  const v = variants[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: v.bg, opacity: pressed || disabled ? 0.7 : 1,
        paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center', flexDirection: 'row' as const, gap: 6,
      })}
    >
      {loading ? <ActivityIndicator color={v.fg} size="small" /> : null}
      <Text style={{ color: v.fg, fontWeight: '600', fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}
