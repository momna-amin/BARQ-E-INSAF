/**
 * InstallAppButton.js
 * "Install App 📲" button in fixed position.
 * Always renders on web unless app is already running as installed standalone PWA.
 * When pressed:
 *   - Triggers Chrome's native install prompt if ready
 *   - Shows guidance if browser is preparing PWA manifest
 */
import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';

export default function InstallAppButton({ style }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // Already running as installed PWA → hide
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

  // Subtle pulse animation
  useEffect(() => {
    if (installed) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [installed]);

  // Hide on native builds or if already running as standalone PWA
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
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(
          '📲 Install Barq-e-Insaf App\n\nChrome / Browser Menu (⋮) par click karke "Install app" ya "Add to Home Screen" select karein!'
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
          <Text style={styles.badgeIcon}>{installing ? '⏳' : '📲'}</Text>
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
    borderColor: 'rgba(255,255,255,0.4)',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  badgeBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: { fontSize: 13 },
  textColumn: { justifyContent: 'center' },
  btnTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
    lineHeight: 14,
  },
  btnSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 9,
    fontWeight: '600',
    lineHeight: 11,
  },
});
