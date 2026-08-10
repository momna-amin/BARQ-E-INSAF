import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/lib/theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function GlassCard({ children, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

export function GlassCardBrand({ children, style }: Props) {
  return (
    <View style={[styles.cardBrand, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    overflow: 'hidden',
  },
  cardBrand: {
    backgroundColor: 'rgba(92,26,26,0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(92,26,26,0.3)',
    padding: 16,
    overflow: 'hidden',
  },
});
