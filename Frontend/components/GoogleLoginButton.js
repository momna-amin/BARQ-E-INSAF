/**
 * GoogleLoginButton.js
 * "Continue with Google" button — works on iOS, Android, and Expo Web (PWA).
 * Uses expo-auth-session/providers/google cross-platform.
 *
 * CRASH-PROOF GUARANTEE: Passes a valid placeholder webClientId format
 * to prevent expo-auth-session from throwing "webClientId must be defined"
 * React runtime crash when EXPO_PUBLIC_GOOGLE_CLIENT_ID is unconfigured on Vercel.
 */
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import api from '../services/api';

// Complete auth session setup on web
try {
  WebBrowser.maybeCompleteAuthSession();
} catch {
  /* noop */
}

const HARDCODED_CLIENT_ID = '350642767663-tlq3bnh9rimtbo1ai7v15armceq6qj9r.apps.googleusercontent.com';
const rawClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || HARDCODED_CLIENT_ID;
const isConfigured = Boolean(rawClientId && !rawClientId.includes('dummyclientid'));

const GOOGLE_CONFIG = {
  webClientId: isConfigured ? rawClientId : HARDCODED_CLIENT_ID,
  androidClientId: isConfigured ? rawClientId : HARDCODED_CLIENT_ID,
  iosClientId: isConfigured ? rawClientId : HARDCODED_CLIENT_ID,
};

export default function GoogleLoginButton({ role = 'citizen', onSuccess, onError, style }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_CONFIG.webClientId,
    androidClientId: GOOGLE_CONFIG.androidClientId,
    iosClientId: GOOGLE_CONFIG.iosClientId,
  });

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (!isConfigured) return;
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        handleGoogleToken(idToken);
      } else {
        onError && onError('Google token missing');
      }
    } else if (response?.type === 'error') {
      onError && onError(response.error?.message || 'Google authentication failed');
    }
  }, [response]);

  const handlePress = () => {
    if (!isConfigured) {
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(
          'Google Login Notice 🔑\n\nGoogle OAuth Client ID is not configured yet in Vercel.\n\nPlease login using Email & Password below.'
        );
      } else {
        Alert.alert(
          'Google Login Notice 🔑',
          'Google OAuth Client ID is not configured yet in Vercel.\n\nPlease login using Email & Password below.',
          [{ text: 'OK' }]
        );
      }
      return;
    }
    if (promptAsync) promptAsync();
  };

  const handleGoogleToken = async (idToken) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/google', { idToken, role });
      onSuccess && onSuccess(res.data);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Google login failed';
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
          <View style={styles.googleLogoBox}>
            <Text style={styles.googleLogoText}>G</Text>
          </View>
          <Text style={styles.btnText}>Continue with Google</Text>
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
