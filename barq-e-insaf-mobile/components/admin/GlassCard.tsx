import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme/tokens';

export function GlassCard({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.wrap, style]} {...rest}>
      <View style={styles.innerBorder} pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  innerBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  content: { padding: 16 },
});
