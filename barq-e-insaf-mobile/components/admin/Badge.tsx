import React from 'react';
import { Text, View } from 'react-native';
import { badge, statusToBadge } from '../../theme/tokens';

export function Badge({ status }: { status: string }) {
  const key = statusToBadge[status] ?? 'draft';
  const c = badge[key];
  return (
    <View style={{
      backgroundColor: c.bg, borderColor: c.border, borderWidth: 1,
      borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start',
    }}>
      <Text style={{ color: c.fg, fontSize: 11, fontWeight: '600' }}>{status}</Text>
    </View>
  );
}
