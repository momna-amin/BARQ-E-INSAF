/**
 * OtpInput.js
 * Premium 6-box OTP input — exactly like banking/fintech apps.
 *
 * Key design decisions:
 * - ONE hidden TextInput drives the real keyboard (no per-box focus juggling)
 * - 6 visual boxes reflect individual characters (purely display)
 * - Auto-advance: cursor visually moves as user types (active box highlight)
 * - Auto-submit: onComplete fires when all boxes are filled
 * - SMS auto-fill: textContentType="oneTimeCode" (iOS) + autoComplete="sms-otp" (Android)
 * - Backspace naturally works via the single input
 * - Paste works: e.g. copy "123456" → all boxes fill instantly
 */
import React, { useRef, useState } from 'react';
import {
  View, TextInput, Text, TouchableOpacity,
  StyleSheet, Animated, Platform,
} from 'react-native';

const OTP_LENGTH = 6;
const BOX_SIZE = Platform.OS === 'web' ? 52 : 48;

export default function OtpInput({ length = OTP_LENGTH, onComplete, onResend, resendCooldown = 0 }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Shake animation on wrong OTP (call shake() from parent via ref if needed)
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleChange = (text) => {
    // Only digits, max length
    const digits = text.replace(/[^0-9]/g, '').slice(0, length);
    setValue(digits);
    if (digits.length === length) {
      onComplete && onComplete(digits);
    }
  };

  const focusInput = () => inputRef.current?.focus();

  const boxes = Array.from({ length }, (_, i) => {
    const char = value[i] || '';
    const isActive = i === value.length && value.length < length;
    const isFilled = i < value.length;

    return (
      <TouchableOpacity
        key={i}
        onPress={focusInput}
        activeOpacity={0.8}
        style={[
          styles.box,
          isActive && styles.boxActive,
          isFilled && styles.boxFilled,
        ]}
      >
        {/* Cursor line when active and empty */}
        {isActive && !char ? (
          <Animated.View style={styles.cursor} />
        ) : null}
        <Text style={[styles.boxText, isFilled && styles.boxTextFilled]}>
          {char}
        </Text>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.wrapper}>
      {/* Hidden real input — captures keyboard + paste + SMS autofill */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        caretHidden
        textContentType="oneTimeCode"   // iOS auto-fill from SMS/notification
        autoComplete="sms-otp"          // Android auto-fill
        importantForAccessibility="no"
        style={styles.hiddenInput}
      />

      {/* Visual boxes */}
      <Animated.View style={[styles.boxRow, { transform: [{ translateX: shakeAnim }] }]}>
        {boxes}
      </Animated.View>

      {/* Resend OTP row */}
      {onResend && (
        <View style={styles.resendRow}>
          {resendCooldown > 0 ? (
            <Text style={styles.resendCooldown}>
              OTP dobara bhejein ({resendCooldown}s)
            </Text>
          ) : (
            <TouchableOpacity onPress={() => { setValue(''); onResend(); }}>
              <Text style={styles.resendBtn}>OTP Dobara Bhejein</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
    top: 0,
    left: 0,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE + 8,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  boxActive: {
    borderColor: '#0b5d3b',
    borderWidth: 2.5,
    backgroundColor: '#f0faf5',
    shadowColor: '#0b5d3b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  boxFilled: {
    borderColor: '#0b5d3b',
    backgroundColor: '#ffffff',
  },
  boxText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0,
  },
  boxTextFilled: {
    color: '#0b5d3b',
  },
  cursor: {
    width: 2,
    height: 26,
    backgroundColor: '#0b5d3b',
    borderRadius: 1,
    position: 'absolute',
  },
  resendRow: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendBtn: {
    color: '#0b5d3b',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resendCooldown: {
    color: '#9ca3af',
    fontSize: 13,
  },
});
