/**
 * InstallAppButton.js
 * 1-Step PWA Install Button for Chrome on Expo Web (Vercel & Local).
 * ALWAYS VISIBLE on web landing, role selection, & login screens.
 * Pressing it triggers Chrome's native prompt or instant installation guide.
 */
import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, Text, StyleSheet, View, Animated, Alert } from 'react-native';

export default function InstallAppButton({ style }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Only run on web
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // Check if running as installed PWA standalone
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    ) {
      setInstalled(true);
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  // Continuous subtle pulse animation
  useEffect(() => {
    if (installed) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [installed]);

  // Don't show if on native platforms or if already running as installed PWA
  if (Platform.OS !== 'web' || installed) return null;

  const handleInstall = async () => {
    if (installing) return;

    if (deferredPrompt) {
      setInstalling(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setInstalled(true);
      } catch (err) {
        console.warn('Install prompt error:', err);
      } finally {
        setInstalling(false);
        setDeferredPrompt(null);
      }
    } else {
      // Fallback instruction if Chrome prompt hasn't fired yet
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(
          '📱 Install Barq-e-Insaf App:\n\n' +
          '1. Chrome Browser menu (3 dots ⋮ at top right) dabayein.\n' +
          '2. "Install App" ya "Add to Home Screen" select karein.\n\n' +
          'App aap ki Home Screen aur App Drawer mein add ho jayegi!'
        );
      } else {
        Alert.alert(
          'Install App 📱',
          'Chrome menu (3 dots ⋮) -> "Install App" / "Add to Home Screen" dabayein app install karne ke liye.'
        );
      }
    }
  };

  return (
    <Animated.View style={[{ transform: [{ scale: pulseAnim }] }, style]}>
      <TouchableOpacity
        onPress={handleInstall}
        disabled={installing}
        style={styles.btn}
        activeOpacity={0.85}
      >
        <View style={styles.badgeBox}>
          <Text style={styles.badgeIcon}>📲</Text>
        </View>
        <View style={styles.textColumn}>
          <Text style={styles.btnTitle}>{installing ? 'Installing...' : 'Install App'}</Text>
          <Text style={styles.btnSub}>App Drawer / Home Screen</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0b5d3b',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  badgeBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: { fontSize: 13 },
  textColumn: {
    justifyContent: 'center',
  },
  btnTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
    lineHeight: 14,
  },
  btnSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 9,
    fontWeight: '500',
    lineHeight: 11,
  },
});
