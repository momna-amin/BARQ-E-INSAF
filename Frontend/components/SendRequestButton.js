/**
 * SendRequestButton.js
 * "Send Request" button for the Lawyer Profile screen.
 * - Calls POST /api/requests with lawyerId
 * - Shows loading spinner, success state, error toast
 * - Once sent, stays in "Sent" state (no double send)
 */
import React, { useState } from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator,
  StyleSheet, View, Alert, Animated,
} from 'react-native';
import showAlert from '../utils/showAlert';
import api from '../services/api';

export default function SendRequestButton({ lawyerId, lawyerName, style }) {
  const [status, setStatus] = useState('idle'); // idle | loading | sent | error
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const handleSend = async () => {
    if (status === 'loading' || status === 'sent') return;
    try {
      setStatus('loading');
      await api.post('/requests', { lawyerId });
      setStatus('sent');
      // Success feedback
      showAlert(
        '✅ Request Bhej Di Gayi',
        `Advocate ${lawyerName || 'Sahab'} ko email bhi send kar di gayi hai. Jawab ka intezaar karein.`,
        [{ text: 'Theek Hai', style: 'default' }]
      );
    } catch (err) {
      setStatus('error');
      const msg = err?.response?.data?.message || 'Request nahi bheji ja saki — dobara koshish karein';
      showAlert('⚠️ Error', msg, [
        { text: 'Theek Hai', onPress: () => setStatus('idle') },
      ]);
    }
  };

  const isSent = status === 'sent';
  const isLoading = status === 'loading';

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        disabled={isLoading || isSent}
        onPress={handleSend}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={0.9}
        style={[styles.btn, isSent && styles.btnSent, isLoading && styles.btnLoading]}
      >
        {isLoading ? (
          <View style={styles.row}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.btnText}>Bheja Ja Raha Hai...</Text>
          </View>
        ) : isSent ? (
          <View style={styles.row}>
            <Text style={styles.checkIcon}>✅</Text>
            <Text style={styles.btnText}>Request Bhej Di Gayi</Text>
          </View>
        ) : (
          <View style={styles.row}>
            <Text style={styles.sendIcon}>📨</Text>
            <Text style={styles.btnText}>Request Bhejein</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#0b5d3b',
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0b5d3b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  btnSent: {
    backgroundColor: '#16a34a',
    shadowColor: '#16a34a',
  },
  btnLoading: {
    backgroundColor: '#1a7d55',
    opacity: 0.85,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  checkIcon: { fontSize: 18 },
  sendIcon: { fontSize: 18 },
});
