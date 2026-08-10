import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../constants/api';

const { width, height } = Dimensions.get('window');

const roleConfig = {
  citizen: { label: 'Citizen Portal',     color: '#5C1A1A', topColor: '#7B2020' },
  lawyer:  { label: 'Lawyer Portal',      color: '#0F2744', topColor: '#1A3A5C' },
  ngo:     { label: 'NGO / Media Portal', color: '#1B4332', topColor: '#245C42' },
  admin:   { label: 'Admin Panel',        color: '#1A0533', topColor: '#2D0D52' },
};

const SINDH_DISTRICTS = [
  'Badin', 'Dadu', 'Ghotki', 'Hyderabad', 'Jacobabad',
  'Jamshoro', 'Karachi Central', 'Karachi East', 'Karachi South',
  'Karachi West', 'Kashmore', 'Khairpur', 'Korangi', 'Larkana',
  'Malir', 'Matiari', 'Mirpur Khas', 'Naushahro Feroze',
  'Qambar Shahdadkot', 'Sanghar', 'Shaheed Benazirabad',
  'Shikarpur', 'Sukkur', 'Tando Allahyar', 'Tando Muhammad Khan',
  'Tharparkar', 'Thatta', 'Umerkot',
];

// -- VALIDATION HELPERS -----------------------------------------------------

const validateName = (val) => {
  if (!val) return 'Name is required';
  if (!/^[a-zA-Z\s]+$/.test(val)) return 'Name must contain letters only';
  if (val.trim().length < 3) return 'Name must be at least 3 characters';
  return null;
};

const validateCNIC = (val) => {
  const raw = val.replace(/-/g, '');
  if (!val) return 'CNIC is required';
  if (!/^\d{5}-\d{7}-\d{1}$/.test(val)) return 'Format must be: xxxxx-xxxxxxx-x';
  if (raw.length !== 13) return 'CNIC must be 13 digits';

  const prefix = parseInt(raw.substring(0, 2));
  if (prefix < 41 || prefix > 45) return 'Only Sindh CNICs are accepted';
  return null;
};

const validatePhone = (val) => {
  if (!val) return 'Phone number is required';
  if (!/^\d{11}$/.test(val)) return 'Phone number must be 11 digits';
  return null;
};

const validatePassword = (val) => {
  if (!val) return 'Password is required';
  if (val.length < 8) return 'Password must be at least 8 characters';
  if (!/[a-z]/.test(val)) return 'Must contain at least one lowercase letter';
  if (!/[0-9]/.test(val)) return 'Must contain at least one number';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val)) return 'Must contain at least one special character';
  return null;
};

const validateEmail = (val) => {
  if (!val) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(val)) return 'Please enter a valid email address';
  return null;
};

const getPasswordStrength = (val) => {
  if (!val) return { label: '', color: '#ccc', width: '0%' };
  let score = 0;
  if (val.length >= 8) score++;
  if (/[a-z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val)) score++;
  if (score <= 2) return { label: 'Weak',   color: '#e70b0b', width: '33%' };
  if (score <= 3) return { label: 'Fair',   color: '#f59e0b', width: '60%' };
  if (score <= 4) return { label: 'Good',   color: '#412dfa', width: '80%' };
  return           { label: 'Strong', color: '#09ff00', width: '100%' };
};

const formatCNIC = (val) => {
  const digits = val.replace(/[^\d]/g, '');
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0,5)}-${digits.slice(5)}`;
  return `${digits.slice(0,5)}-${digits.slice(5,12)}-${digits.slice(12,13)}`;
};

// -- REUSABLE COMPONENTS ----------------------------------------------------

const PasswordInput = ({ label, value, onChangeText, color }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, { flex: 1, borderBottomWidth: 0 }]}
          placeholder="Password"
          placeholderTextColor="#bbb"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!show}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShow(!show)}
          style={styles.eyeBtn}
        >
          <View style={styles.eyeIcon}>
            {show ? (
              <View>
                <View style={[styles.eyeOutline, styles.eyeOpen]} />
                <View style={styles.eyePupil} />
              </View>
            ) : (
              <View style={styles.eyeOutline}>
                <View style={styles.eyeLine} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.inputUnderline, { backgroundColor: color || '#e8e4e0' }]} />
    </>
  );
};

const DistrictPicker = ({ value, onSelect, color }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={styles.dropdownBtn}
        onPress={() => setOpen(!open)}
      >
        <Text style={[styles.dropdownValue, !value && { color: '#bbb' }]}>
          {value || 'Select District'}
        </Text>
        <Text style={styles.dropdownArrow}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      <View style={[styles.inputUnderline, { backgroundColor: '#e8e4e0' }]} />
      {open && (
        <View style={styles.dropdownList}>
          <ScrollView
            nestedScrollEnabled
            style={{ maxHeight: 200 }}
            showsVerticalScrollIndicator
          >
            {SINDH_DISTRICTS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.dropdownItem,
                  value === d && { backgroundColor: '#f5e8e8' },
                ]}
                onPress={() => { onSelect(d); setOpen(false); }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  value === d && { color: '#5C1A1A', fontWeight: '700' },
                ]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

// -- MAIN COMPONENT ---------------------------------------------------------

export default function LoginScreen() {
  const { role } = useLocalSearchParams();
  const router   = useRouter();
  const config   = roleConfig[role] || roleConfig.citizen;

  const [activeTab,   setActiveTab]   = useState('login');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [retypePass,  setRetypePass]  = useState('');
  const [name,        setName]        = useState('');
  const [phone,       setPhone]       = useState('');
  const [district,    setDistrict]    = useState('');
  const [cnic,        setCnic]        = useState('');
  const [sbcNumber,   setSbcNumber]   = useState('');
  const [specialty,   setSpecialty]   = useState('');
  const [loading,     setLoading]     = useState(false);
  const [errors,      setErrors]      = useState({});

  const strength = getPasswordStrength(password);

  const clearErrors = () => setErrors({});

  // -- LOGIN -----------------------------------------------------------------
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    try {
      setLoading(true);
      const res  = await api.post('/auth/login', { email, password });
      const user = res.data;

      if (user.role !== role) {
        Alert.alert('Wrong Portal', `This account is a ${user.role} account. Please go back and select the correct portal.`);
        return;
      }

      if (user.role === 'citizen') router.replace('/(citizen)/CitizenHome');
      if (user.role === 'lawyer')  router.replace('/(lawyer)/LawyerHome');
      if (user.role === 'admin')   router.replace('/AdminHome');
      if (user.role === 'ngo')     router.replace('/(ngo)/NGOHome');

    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Incorrect email or password.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  // -- SIGNUP ---------------------------------------------------------------
  const handleSignup = async () => {
    const newErrors = {};

    // Common validations
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    
    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (!retypePass) newErrors.retypePass = 'Re-type password';
    if (password !== retypePass) newErrors.retypePass = 'Passwords do not match';

    // Citizen-specific validations
    if (role === 'citizen') {
      const cnicErr  = validateCNIC(cnic);
      const phoneErr = validatePhone(phone);
      if (cnicErr)  newErrors.cnic     = cnicErr;
      if (phoneErr) newErrors.phone    = phoneErr;
      if (!district) newErrors.district = 'Please select your district';
    }

    // Lawyer-specific
    if (role === 'lawyer') {
      const cnicErr = validateCNIC(cnic);
      const phoneErr = validatePhone(phone);
      if (cnicErr) newErrors.cnic = cnicErr;
      if (phoneErr) newErrors.phone = phoneErr;
      if (!district) newErrors.district = 'Please select your district';
      if (!sbcNumber) newErrors.sbcNumber = 'SBC number is required';
      if (!specialty) newErrors.specialty = 'Specialty is required';
    }

    // NGO-specific
    if (role === 'ngo') {
      const cnicErr = validateCNIC(cnic);
      const phoneErr = validatePhone(phone);
      if (cnicErr) newErrors.cnic = cnicErr;
      if (phoneErr) newErrors.phone = phoneErr;
      if (!district) newErrors.district = 'Please select your district';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const body = { name, email, password, role, phone, district, cnic };
      if (role === 'lawyer') {
        body.sbcNumber = sbcNumber;
        body.specialty = specialty;
      }
      const res  = await api.post('/auth/register', body);
      const user = res.data;

      Alert.alert('Success', 'Account created successfully!', [{
        text: 'OK',
        onPress: () => {
          if (user.role === 'citizen') router.replace('/(citizen)/CitizenHome');
          if (user.role === 'lawyer')  router.replace('/(lawyer)/LawyerHome');
          if (user.role === 'admin')   router.replace('/AdminHome');
        },
      }]);
    } catch (error) {
      const msg = error.response?.data?.message || 'Signup failed. Try again.';
      Alert.alert('Signup Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  // -- RENDER ---------------------------------------------------------------
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={[config.topColor, config.color, '#0d0d0d']}
          style={styles.topGradient}
        />
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        {/* TOP SECTION */}
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>⚡</Text>
          </View>
          <Text style={styles.appName}>Barq-e-Insaf</Text>
          <Text style={styles.portalName}>{config.label}</Text>
        </View>

        {/* FORM */}
        <ScrollView
          contentContainerStyle={styles.formWrapper}
          style={styles.formScroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* TABS - Hide signup tab for admin */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'login' && styles.tabActive]}
              onPress={() => { setActiveTab('login'); clearErrors(); }}
            >
              <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>
                Login
              </Text>
            </TouchableOpacity>
            {role !== 'admin' && (
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'signup' && styles.tabActive]}
                onPress={() => { setActiveTab('signup'); clearErrors(); }}
              >
                <Text style={[styles.tabText, activeTab === 'signup' && styles.tabTextActive]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* -- SIGNUP FIELDS -- */}
          {activeTab === 'signup' && role !== 'admin' && (
            <>
              {/* NAME */}
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(v) => {
                  if (/^[a-zA-Z\s]*$/.test(v)) setName(v);
                }}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              {/* PHONE */}
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={(v) => {
                  if (/^\d*$/.test(v) && v.length <= 11) setPhone(v);
                }}
                keyboardType="number-pad"
                maxLength={11}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              {/* CNIC - for all roles */}
              <Text style={styles.inputLabel}>CNIC</Text>
              <TextInput
                style={styles.input}
                value={cnic}
                onChangeText={(v) => {
                  const formatted = formatCNIC(v);
                  if (formatted.length <= 15) setCnic(formatted);
                }}
                keyboardType="number-pad"
                maxLength={15}
              />
              {errors.cnic && <Text style={styles.errorText}>{errors.cnic}</Text>}

              {/* DISTRICT - dropdown for all roles */}
              <Text style={styles.inputLabel}>District</Text>
              <DistrictPicker
                value={district}
                onSelect={setDistrict}
                color={config.color}
              />
              {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}

              {/* LAWYER FIELDS */}
              {role === 'lawyer' && (
                <>
                  <Text style={styles.inputLabel}>SBC Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="SBC-4421"
                    placeholderTextColor="#bbb"
                    value={sbcNumber}
                    onChangeText={setSbcNumber}
                  />
                  {errors.sbcNumber && <Text style={styles.errorText}>{errors.sbcNumber}</Text>}

                  <Text style={styles.inputLabel}>Specialty</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Property / Family"
                    placeholderTextColor="#bbb"
                    value={specialty}
                    onChangeText={setSpecialty}
                  />
                  {errors.specialty && <Text style={styles.errorText}>{errors.specialty}</Text>}
                </>
              )}
            </>
          )}

          {/* -- COMMON FIELDS -- */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* PASSWORD */}
          <PasswordInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            color={config.color}
          />

          {/* PASSWORD STRENGTH - signup only */}
          {activeTab === 'signup' && password.length > 0 && role !== 'admin' && (
            <View style={styles.strengthWrap}>
              <View style={styles.strengthTrack}>
                <View style={[styles.strengthFill, {
                  width: strength.width,
                  backgroundColor: strength.color,
                }]} />
              </View>
              <Text style={[styles.strengthLabel, { color: strength.color }]}>
                {strength.label}
              </Text>
            </View>
          )}

          {/* PASSWORD REQUIREMENTS - signup only */}
          {activeTab === 'signup' && role !== 'admin' && (
            <View style={styles.requirementsBox}>
              <Text style={styles.requirementsTitle}>Password must have:</Text>
              {[
                { label: 'At least 8 characters',        pass: password.length >= 8 },
                { label: 'One lowercase letter (a-z)',    pass: /[a-z]/.test(password) },
                { label: 'One number (0-9)',              pass: /[0-9]/.test(password) },
                { label: 'One special character (!@#...)',pass: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
              ].map((req, i) => (
                <Text key={i} style={[styles.requirementItem, { color: req.pass ? '#22c55e' : '#aaa' }]}>
                  {req.pass ? '✓' : '○'} {req.label}
                </Text>
              ))}
            </View>
          )}

          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* RETYPE PASSWORD - signup only */}
          {activeTab === 'signup' && role !== 'admin' && (
            <>
              <PasswordInput
                label="Re-enter Password"
                value={retypePass}
                onChangeText={setRetypePass}
                color={config.color}
              />
              {retypePass.length > 0 && (
                <Text style={{
                  fontSize: 11, marginTop: 4, fontWeight: '600',
                  color: password === retypePass ? '#22c55e' : '#ef4444',
                }}>
                  {password === retypePass ? '✓ Passwords match' : '✗ Passwords do not match'}
                </Text>
              )}
              {errors.retypePass && <Text style={styles.errorText}>{errors.retypePass}</Text>}
            </>
          )}

          {/* FORGOT PASSWORD */}
          {activeTab === 'login' && (
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* SUBMIT */}
          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: config.color }]}
            activeOpacity={0.85}
            onPress={activeTab === 'login' ? handleLogin : handleSignup}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.loginBtnText}>
                  {activeTab === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
                </Text>
            }
          </TouchableOpacity>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// -- STYLES -----------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#140505',
  },
  topGradient: {
    position: 'absolute',
    width: width,
    height: height * 0.52,
    top: 0,
  },
  circle1: {
    position: 'absolute',
    width: 300, height: 300, borderRadius: 150,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    top: -80, right: -80,
  },
  circle2: {
    position: 'absolute',
    width: 200, height: 200, borderRadius: 100,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    top: 40, left: -60,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 24,
    height: height * 0.38,
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 52, left: 24,
  },
  backText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14, fontWeight: '600',
  },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 14,
  },
  logoEmoji: { fontSize: 30 },
  appName: {
    fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.3,
  },
  portalName: {
    fontSize: 12, color: 'rgba(255,255,255,0.5)',
    marginTop: 4, fontWeight: '500', letterSpacing: 0.5,
  },
  formScroll: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#fff',
  },
  formWrapper: {
    padding: 28,
    paddingBottom: 48,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ece8',
  },
  tabBtn: {
    flex: 1, paddingBottom: 12, alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#5C1A1A',
  },
  tabText: {
    fontSize: 15, fontWeight: '600', color: '#ccc',
  },
  tabTextActive: {
    color: '#1a1a1a',
  },
  inputLabel: {
    fontSize: 11, fontWeight: '700', color: '#aaa',
    letterSpacing: 0.5, textTransform: 'uppercase',
    marginBottom: 6, marginTop: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#e8e4e0',
    paddingVertical: 10,
    fontSize: 14, color: '#1a1a1a',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  inputUnderline: {
    height: 1,
    marginTop: 0,
  },
  eyeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  eyeIcon: {
    width: 24,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeOutline: {
    width: 20,
    height: 14,
    borderWidth: 1.5,
    borderColor: '#888',
    borderRadius: 10,
    position: 'relative',
  },
  eyeOpen: {
    backgroundColor: 'transparent',
  },
  eyePupil: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#888',
    position: 'absolute',
    top: 4,
    left: 7,
  },
  eyeLine: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#888',
    position: 'absolute',
    top: 6,
    transform: [{ rotate: '45deg' }],
  },
  forgotText: {
    color: '#5C1A1A', fontSize: 13, fontWeight: '600',
    marginTop: 14, textAlign: 'right',
  },
  loginBtn: {
    marginTop: 28, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: '#fff', fontSize: 14,
    fontWeight: '800', letterSpacing: 1.5,
  },
  errorText: {
    fontSize: 11, color: '#ef4444',
    marginTop: 4, fontWeight: '600',
  },
  hintText: {
    fontSize: 11, color: '#aaa',
    marginTop: 4, fontWeight: '500',
  },
  strengthWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  strengthTrack: {
    flex: 1, height: 5,
    backgroundColor: '#f0ece8',
    borderRadius: 3, overflow: 'hidden',
  },
  strengthFill: {
    height: '100%', borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 11, fontWeight: '700', width: 50,
  },
  requirementsBox: {
    backgroundColor: '#f9f8f6',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ece9e4',
  },
  requirementsTitle: {
    fontSize: 11, fontWeight: '700',
    color: '#666', marginBottom: 6,
  },
  requirementItem: {
    fontSize: 11, fontWeight: '500',
    marginBottom: 3, lineHeight: 16,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  dropdownValue: {
    fontSize: 14, color: '#1a1a1a', flex: 1,
  },
  dropdownArrow: {
    fontSize: 11, color: '#aaa',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ece9e4',
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 999,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f3f0',
  },
  dropdownItemText: {
    fontSize: 13, color: '#333', fontWeight: '500',
  },
});