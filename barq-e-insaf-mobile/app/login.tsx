import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Zap, Shield } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { LinearGradient } from 'expo-linear-gradient';

const ADMIN_EMAIL = 'admin@barqeinsaf.pk';
const ADMIN_PASSWORD = 'SuperAdmin@Barq2026!';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      router.replace('/(admin)/dashboard');
    } else {
      setError('Authentication failed. Invalid Admin email or password.');
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoBox}>
          <Image
            source={require('@/assets/images/barq-e-insaf.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>Barq-e-Insaf</Text>
          <Text style={styles.subtitle}>Administrative Control Panel</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <View style={styles.secureRow}>
            <Shield size={16} color={Colors.glow} />
            <Text style={styles.secureText}>Super Admin Database Authentication</Text>
          </View>

          {/* Email */}
          <Text style={styles.label}>SUPER ADMIN EMAIL</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="admin@barqeinsaf.pk"
            placeholderTextColor={Colors.textGhost}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          {/* Password */}
          <Text style={styles.label}>AUTHENTICATION PASSWORD</Text>
          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={Colors.textGhost}
              secureTextEntry={!showPw}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />
            <TouchableOpacity
              onPress={() => setShowPw(v => !v)}
              style={styles.eyeBtn}
            >
              {showPw
                ? <EyeOff size={18} color={Colors.textDimmer} />
                : <Eye size={18} color={Colors.textDimmer} />
              }
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.brand, Colors.brandLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginBtn}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Zap size={18} color="#fff" />
                  <Text style={styles.loginBtnText}>Authenticate & Launch Panel</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Quick fill */}
          <View style={styles.demoSection}>
            <Text style={styles.demoLabel}>AUTHORIZED CREDENTIAL</Text>
            <TouchableOpacity
              onPress={() => { setEmail(ADMIN_EMAIL); setPassword(ADMIN_PASSWORD); }}
              style={styles.demoBtn}
            >
              <Text style={styles.demoBtnText}>Super Admin</Text>
              <Text style={styles.demoBtnEmail}>{ADMIN_EMAIL}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>⚡ Barq-e-Insaf — Sindh Legal Access Platform © 2026</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 72,
    height: 72,
    borderRadius: 18,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textDim,
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.bgCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 28,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  secureText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textDim,
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: Colors.red,
  },
  loginBtn: {
    borderRadius: 99,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  loginBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  demoSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  demoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textDimmest,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  demoBtn: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoBtnText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  demoBtnEmail: {
    fontSize: 10,
    color: Colors.textDimmest,
  },
  footer: {
    fontSize: 11,
    color: Colors.textGhost,
    marginTop: 24,
    textAlign: 'center',
  },
});
