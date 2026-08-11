import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusColors, defaultStatus } from '@/lib/theme';

type Props = {
  status: string;
};

export function StatusBadge({ status }: Props) {
  const colors = StatusColors[status] || defaultStatus;
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
