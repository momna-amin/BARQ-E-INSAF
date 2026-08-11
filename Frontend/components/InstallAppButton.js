/**
 * InstallAppButton.js
 * Shows Chrome's NATIVE install prompt directly — no manual instructions ever shown.
 * Button is hidden if:
 *   - Not on web
 *   - Already running as installed PWA (standalone)
 *   - Chrome hasn't fired beforeinstallprompt yet (not installable)
 * When pressed: triggers Chrome's own "Install / Cancel" dialog directly.
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

    // Already running as installed PWA → never show
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    ) {
      setInstalled(true);
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();        // capture the event
      setDeferredPrompt(e);      // store it — now button becomes visible
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
    if (installed || !deferredPrompt) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [installed, deferredPrompt]);

  // ── HIDE if: native app, already installed, OR prompt not available yet ──
  if (Platform.OS !== 'web' || installed || !deferredPrompt) return null;

  const handleInstall = async () => {
    if (installing || !deferredPrompt) return;
    setInstalling(true);
    try {
      // Triggers Chrome's own NATIVE "Install / Cancel" dialog — no custom UI
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setInstalled(true);
    } catch (err) {
      console.warn('Install prompt error:', err);
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
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
  textColumn: { justifyContent: 'center' },
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
