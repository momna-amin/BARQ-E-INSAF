/**
 * ForgotPassword.js
 * 3-step forgot password flow:
 *   Step 1 → Email entry
 *   Step 2 → 6-box OTP (retry until correct, 5-attempt limit, 10min expiry)
 *   Step 3 → New password + confirm
 *
 * Design: Barq-e-Insaf dark green theme, matching existing LoginScreen style
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
  Alert, Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import api from '../services/api';
import OtpInput from '../components/OtpInput';
import LoadingOverlay from '../components/LoadingOverlay';
import showAlert from '../utils/showAlert';

const { width, height } = Dimensions.get('window');
const RESEND_DELAY = 60; // seconds

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 | 2 | 3
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Step indicator slide animation
  const slideX = useRef(new Animated.Value(0)).current;

  const slideToStep = (s) => {
    Animated.timing(slideX, {
      toValue: -(s - 1) * width,
      duration: 320,
      useNativeDriver: true,
    }).start();
    setStep(s);
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showAlert('⚠️ Error', 'Sahi email address darj karein');
      return;
    }
    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email: cleanEmail });
      setEmail(cleanEmail);
      setCooldown(RESEND_DELAY);
      setOtpError('');
      slideToStep(2);
    } catch (err) {
      showAlert('Error', err?.response?.data?.message || 'Kuch masla ho gaya — dobara koshish karein');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (otp) => {
    setOtpError('');
    try {
      setLoading(true);
      const res = await api.post('/auth/verify-otp', { email, otp });
      setResetToken(res.data.resetToken);
      slideToStep(3);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Galat OTP — dobara darj karein';
      setOtpError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      setCooldown(RESEND_DELAY);
      setOtpError('');
      showAlert('✅', 'Naya OTP email pe bhej diya gaya');
    } catch (err) {
      showAlert('Error', err?.response?.data?.message || 'OTP dubara nahi bheja ja saka');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────────────────
  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      showAlert('⚠️ Error', 'Password kam az kam 8 characters ka hona chahiye');
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert('⚠️ Error', 'Dono passwords ek jaise nahi hain');
      return;
    }
    try {
      setLoading(true);
      await api.post('/auth/reset-password', { resetToken, newPassword });
      showAlert(
        '✅ Password Reset Ho Gaya',
        'Ab aap apne naye password se login kar sakte hain.',
        [{ text: 'Login Karein', onPress: () => router.back() }]
      );
    } catch (err) {
      showAlert('Error', err?.response?.data?.message || 'Password reset fail — dobara koshish karein');
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Email', 'OTP', 'Password'];

  return (
    <LinearGradient colors={['#0b5d3b', '#1a7d55', '#0d3d27']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Wapis</Text>
          </TouchableOpacity>

          <View style={styles.logoBox}>
            <Text style={styles.logoText}>⚡</Text>
            <Text style={styles.logoTitle}>Barq-e-Insaf</Text>
            <Text style={styles.logoSub}>Password Reset</Text>
          </View>

          {/* Step indicator */}
          <View style={styles.stepRow}>
            {stepLabels.map((label, i) => {
              const num = i + 1;
              const done = step > num;
              const active = step === num;
              return (
                <View key={num} style={styles.stepItem}>
                  <View style={[styles.stepCircle, active && styles.stepCircleActive, done && styles.stepCircleDone]}>
                    <Text style={[styles.stepNum, (active || done) && styles.stepNumActive]}>
                      {done ? '✓' : num}
                    </Text>
                  </View>
                  <Text style={[styles.stepLabel, (active || done) && styles.stepLabelActive]}>{label}</Text>
                  {i < stepLabels.length - 1 && (
                    <View style={[styles.stepLine, done && styles.stepLineDone]} />
                  )}
                </View>
              );
            })}
          </View>

          {/* Steps Card */}
          <View style={styles.card}>

            {/* ── STEP 1: Email ──────────────────────────────────────── */}
            {step === 1 && (
              <>
                <Text style={styles.cardTitle}>Email Darj Karein</Text>
                <Text style={styles.cardSub}>
                  Aapki registered Gmail pe ek 6-digit code bheja jayega
                </Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Gmail Address</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="yourname@gmail.com"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                  onPress={handleSendOtp}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.primaryBtnText}>OTP Bhejein →</Text>}
                </TouchableOpacity>
              </>
            )}

            {/* ── STEP 2: OTP ────────────────────────────────────────── */}
            {step === 2 && (
              <>
                <Text style={styles.cardTitle}>Code Darj Karein</Text>
                <Text style={styles.cardSub}>
                  <Text style={styles.emailHighlight}>{email}</Text>
                  {' '}pe 6-digit code bheja gaya hai
                </Text>

                {loading && (
                  <ActivityIndicator color="#0b5d3b" size="small" style={{ marginBottom: 16 }} />
                )}

                <OtpInput
                  length={6}
                  onComplete={handleVerifyOtp}
                  onResend={handleResend}
                  resendCooldown={cooldown}
                />

                {otpError ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>⚠️ {otpError}</Text>
                  </View>
                ) : null}

                <Text style={styles.otpHint}>
                  OTP 10 minute mein expire ho jata hai. Spam folder bhi check karein.
                </Text>
              </>
            )}

            {/* ── STEP 3: New Password ────────────────────────────────── */}
            {step === 3 && (
              <>
                <Text style={styles.cardTitle}>Naya Password</Text>
                <Text style={styles.cardSub}>
                  Ek mazboot password set karein (kam az kam 8 characters)
                </Text>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Naya Password</Text>
                  <View style={styles.pwRow}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginBottom: 0 }]}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Naya password darj karein"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showPw}
                    />
                    <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                      <Text style={styles.eyeIcon}>{showPw ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Password Dobara Likhen</Text>
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Password confirm karein"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPw}
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <Text style={styles.mismatch}>⚠️ Passwords match nahi kar rahe</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.primaryBtnText}>✅ Password Reset Karein</Text>}
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
        <LoadingOverlay visible={loading} />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 40, paddingTop: Platform.OS === 'ios' ? 60 : 40 },

  backBtn: { marginBottom: 12 },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '500' },

  logoBox: { alignItems: 'center', marginBottom: 28 },
  logoText: { fontSize: 40, marginBottom: 4 },
  logoTitle: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: 1 },
  logoSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },

  // Step Indicator
  stepRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  stepCircleActive: { borderColor: '#fff', backgroundColor: '#0b5d3b' },
  stepCircleDone: { borderColor: '#4ade80', backgroundColor: '#166534' },
  stepNum: { color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: 13 },
  stepNumActive: { color: '#fff' },
  stepLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginLeft: 4 },
  stepLabelActive: { color: '#fff', fontWeight: '600' },
  stepLine: { width: 24, height: 2, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 4 },
  stepLineDone: { backgroundColor: '#4ade80' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 6 },
  cardSub: { fontSize: 13, color: '#6b7280', lineHeight: 19, marginBottom: 24 },
  emailHighlight: { fontWeight: '700', color: '#0b5d3b' },

  inputWrapper: { marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 6, letterSpacing: 0.5 },
  input: {
    borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10, padding: 14,
    fontSize: 15, color: '#111827', backgroundColor: '#f9fafb', marginBottom: 4,
  },
  pwRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 10 },
  eyeIcon: { fontSize: 18 },
  mismatch: { color: '#dc2626', fontSize: 12, marginTop: 4 },

  primaryBtn: {
    backgroundColor: '#0b5d3b', borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 8,
    shadowColor: '#0b5d3b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  primaryBtnDisabled: { opacity: 0.65 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  errorBox: { backgroundColor: '#fef2f2', borderRadius: 8, padding: 12, marginTop: 16, borderLeftWidth: 4, borderLeftColor: '#dc2626' },
  errorText: { color: '#dc2626', fontSize: 13, fontWeight: '600' },
  otpHint: { color: '#9ca3af', fontSize: 12, textAlign: 'center', marginTop: 20 },
});
