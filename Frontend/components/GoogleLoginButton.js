/**
 * GoogleLoginButton.js
 * "Continue with Google" button — works on iOS, Android, and Expo Web (PWA).
 * Uses expo-auth-session/providers/google which handles the OAuth flow
 * cross-platform without any extra native modules on web.
 *
 * Usage:
 *   <GoogleLoginButton role="citizen" onSuccess={(data) => handleAuthSuccess(data)} />
 *   role: 'citizen' | 'lawyer' | 'admin'
 */
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import api from '../services/api';

// Required to complete auth session on web
WebBrowser.maybeCompleteAuthSession();

// Google Client IDs — replace with real IDs from console.cloud.google.com
const GOOGLE_CONFIG = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
};

export default function GoogleLoginButton({ role = 'citizen', onSuccess, onError, style }) {
  const isConfigured = Boolean(GOOGLE_CONFIG.webClientId && !GOOGLE_CONFIG.webClientId.includes('000000000000'));

  const [request, response, promptAsync] = Google.useAuthRequest(
    isConfigured
      ? {
          webClientId: GOOGLE_CONFIG.webClientId,
          androidClientId: GOOGLE_CONFIG.androidClientId,
          iosClientId: GOOGLE_CONFIG.iosClientId,
        }
      : {}
  );

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        handleGoogleToken(idToken);
      } else {
        onError && onError('Google se ID token nahi mila');
      }
    } else if (response?.type === 'error') {
      onError && onError(response.error?.message || 'Google sign-in fail ho gaya');
    }
  }, [response]);

  const handlePress = () => {
    if (!isConfigured) {
      Alert.alert(
        'Google Login Notice 🔑',
        'Google OAuth Client ID abhi Google Cloud Console par setup nahi hai.\n\nPlease Email aur Password se Login/Register karein.',
        [{ text: 'OK' }]
      );
      return;
    }
    promptAsync();
  };

  const handleGoogleToken = async (idToken) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/google', { idToken, role });
      onSuccess && onSuccess(res.data);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Google login fail — dobara koshish karein';
      onError && onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.btn, style]}
      onPress={handlePress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color="#333" size="small" />
      ) : (
        <>
          {/* Google "G" logo SVG-like text */}
          <View style={styles.googleLogoBox}>
            <Text style={styles.googleLogoText}>G</Text>
          </View>
          <Text style={styles.btnText}>Google se Jaari Rakhen</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  googleLogoBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  googleLogoText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4285F4',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    letterSpacing: 0.2,
  },
});
