/**
 * InstallAppButton.js
 * One-step PWA install button for Chrome on Expo Web (Vercel deploy).
 *
 * How it works:
 * 1. Chrome fires `beforeinstallprompt` when the page qualifies as installable PWA
 *    (valid manifest.json + service worker + HTTPS — Vercel gives all 3 ✅)
 * 2. We capture and suppress Chrome's default mini-infobar
 * 3. On button press: call deferredPrompt.prompt() → Chrome's native install dialog
 * 4. One user tap → icon on Home Screen / App Drawer + listed in Chrome Apps
 *
 * Button only renders on web and only when Chrome says the PWA is installable.
 * If already installed (standalone mode), button is hidden.
 */
import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';

export default function InstallAppButton({ style }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Only run on web
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // Already running as installed PWA?
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault(); // prevent Chrome's auto mini-infobar
      setDeferredPrompt(e); // save — will trigger manually on button press
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

  // Pulse animation when button is visible
  useEffect(() => {
    if (!deferredPrompt || installed) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [deferredPrompt, installed]);

  // Hide on native, when installed, or when prompt not captured yet
  if (Platform.OS !== 'web' || installed || !deferredPrompt) return null;

  const handleInstall = async () => {
    if (!deferredPrompt || installing) return;
    setInstalling(true);
    try {
      deferredPrompt.prompt(); // Chrome's native "Install app?" dialog opens
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setInstalled(true);
    } catch (err) {
      console.warn('Install prompt error:', err);
    } finally {
      setInstalling(false);
      setDeferredPrompt(null); // one-time use
    }
  };

  return (
    <Animated.View style={[{ transform: [{ scale: pulseAnim }] }, style]}>
      <TouchableOpacity
        onPress={handleInstall}
        disabled={installing}
        style={styles.btn}
        activeOpacity={0.88}
      >
        <Text style={styles.icon}>📲</Text>
        <View>
          <Text style={styles.btnTitle}>{installing ? 'Install Ho Raha Hai...' : 'App Install Karein'}</Text>
          <Text style={styles.btnSub}>Home Screen pe add karein</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#0b5d3b',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    shadowColor: '#0b5d3b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: { fontSize: 26 },
  btnTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  btnSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 1,
  },
});
