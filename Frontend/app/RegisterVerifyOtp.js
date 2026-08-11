import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../services/api';
import OtpInput from '../components/OtpInput';
import LoadingOverlay from '../components/LoadingOverlay';
import showAlert from '../utils/showAlert';

const RESEND_DELAY = 60;

export default function RegisterVerifyOtp() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = typeof params?.email === 'string' ? params.email : Array.isArray(params?.email) ? params.email[0] : '';
  const role  = typeof params?.role === 'string' ? params.role : Array.isArray(params?.role) ? params.role[0] : 'citizen';

  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_DELAY);
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (!email) router.replace('/RoleSelectScreen');
  }, [email]);

  const handleVerify = async (otp) => {
    setOtpError('');
    try {
      setLoading(true);
      await api.post('/auth/verify-register-otp', { email, otp });

      showAlert(
        '🎉 Account Created Successfully!',
        'Aapka account verify ho gaya hai. Ab login karein.',
        [{ text: 'OK', onPress: () => router.replace(`/LoginScreen?role=${role}`) }]
      );
    } catch (error) {
      setOtpError(error?.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      setLoading(true);
      await api.post('/auth/send-register-otp', { email, resend: true });
      setCooldown(RESEND_DELAY);
      setOtpError('');
    } catch (err) {
      setOtpError(
        err?.response?.data?.message ||
        'OTP dobara nahi bheja ja saka — please "Back" dabayein aur form dobara submit karein.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0d0d0d', '#1A0533', '#0d0d0d']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Wapis</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>✉️</Text>
            </View>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              6-digit code bheja gaya hai:{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>

            <View style={{ marginTop: 24, width: '100%' }}>
              <OtpInput
                length={6}
                onComplete={handleVerify}
                onResend={handleResend}
                resendCooldown={cooldown}
              />
            </View>

            {otpError ? <Text style={styles.errorText}>⚠️ {otpError}</Text> : null}

            <Text style={styles.hint}>Code 10 minute mein expire ho jata hai. Spam folder bhi check karein.</Text>
          </View>
        </View>

        <LoadingOverlay visible={loading} />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  kav: { flex: 1 },
  content: { flex: 1, padding: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  backBtn: { marginBottom: 20 },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '500' },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#f5e8e8', alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  iconText: { fontSize: 28 },
  title: { fontSize: 20, fontWeight: '800', color: '#1a1a2e', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 19 },
  emailText: { fontWeight: '700', color: '#5C1A1A' },
  errorText: { color: '#dc2626', fontSize: 13, fontWeight: '600', marginTop: 16, textAlign: 'center' },
  hint: { color: '#9ca3af', fontSize: 12, textAlign: 'center', marginTop: 20 },
});
