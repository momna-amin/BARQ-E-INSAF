/**
 * LoadingOverlay.js
 * Premium loading overlay — a translucent deep-blue tint + centered spinner
 * that sits ON TOP of whatever page is currently mounted underneath it.
 *
 * Requirement it satisfies:
 * "loading blue screen or spinner ky sath hoti hai, ye loading sirf real
 *  page ke upar jo open ho rha hai us ke upar overlay ho, koi solid
 *  background color na ho — premium UX."
 *
 * Usage:
 *   <View style={{ flex: 1 }}>
 *     <RealPageContent />
 *     <LoadingOverlay visible={loading} />
 *   </View>
 *
 * It's absolutely positioned and transparent-ish (rgba, not opaque), so the
 * page behind it stays visible/blurred rather than being replaced by a
 * blank colored screen. Drop it as the LAST child of any screen/layout.
 */
import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Animated, Platform } from 'react-native';

export default function LoadingOverlay({ visible, label }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.overlay, { opacity }]}
    >
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#60a5fa" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // Translucent deep-blue tint over the real page — NOT a solid opaque
    // background, so the underlying screen stays visible beneath it.
    backgroundColor: 'rgba(7, 21, 46, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(3px)' } : null),
  },
  card: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 39, 68, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
});
