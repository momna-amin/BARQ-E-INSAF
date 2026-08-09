import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const roleConfig = {
  citizen: { label: 'Citizen Portal', color: '#5C1A1A' },
  lawyer: { label: 'Lawyer Portal', color: '#0F2744' },
  ngo: { label: 'NGO / Media Portal', color: '#1B4332' },
  admin: { label: 'Admin Panel', color: '#1A0533' },
};

export default function LoginScreen() {
  const { role } = useLocalSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  const config = roleConfig[role] || roleConfig.citizen;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Background image + gradient */}
        <Image
          source={require('../assets/images/login-bg.jpeg')}
          style={styles.bgImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={[
            'rgba(20,5,5,0.15)',
            'rgba(20,5,5,0.5)',
            'rgba(20,5,5,0.92)',
            '#140505',
          ]}
          style={styles.gradient}
        />

        {/* Top: Logo area */}
        <View style={styles.topSection}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Barq-e-Insaf</Text>
          <Text style={styles.portalName}>{config.label}</Text>
        </View>

        {/* Bottom: Form */}
        <ScrollView
          contentContainerStyle={styles.formWrapper}
          keyboardShouldPersistTaps="handled"
        >
          {/* Login / Signup tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'login' && styles.tabActive]}
              onPress={() => setActiveTab('login')}
            >
              <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'signup' && styles.tabActive]}
              onPress={() => setActiveTab('signup')}
            >
              <Text style={[styles.tabText, activeTab === 'signup' && styles.tabTextActive]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Fields */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: config.color }]}
            activeOpacity={0.85}
            onPress={() => {
              if (role === 'admin') router.replace('/(Admin)');
              else if (role === 'lawyer') router.replace('/(lawyer)/LawyerHome');
              else if (role === 'citizen') router.replace('/(citizen)/CitizenHome');
              else if (role === 'ngo') router.replace('/(ngo)/NGOHome');
            }}
          >
            <Text style={styles.loginBtnText}>
              {activeTab === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140505',
  },
  bgImage: {
    position: 'absolute',
    width: width,
    height: height * 0.55,
    top: 0,
  },
  gradient: {
    position: 'absolute',
    width: width,
    height: height,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    flex: 0.48,
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 24,
  },
  backText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.3,
  },
  portalName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  formWrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 48,
    flex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabBtn: {
    flex: 1,
    paddingBottom: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#5C1A1A',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#bbb',
  },
  tabTextActive: {
    color: '#1a1a1a',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 10,
    fontSize: 14,
    color: '#1a1a1a',
  },
  forgotText: {
    color: '#5C1A1A',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'right',
  },
  loginBtn: {
    marginTop: 28,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});