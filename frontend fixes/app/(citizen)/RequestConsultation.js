import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from './RequestConsultation.styles';
import { lawyers } from './MockStore';
import SendRequestButton from '../../components/SendRequestButton';

export default function RequestConsultation() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState('');

  const lawyerId = params.lawyerId;
  const lawyer = lawyers.find((l) => String(l.id) === String(lawyerId));
  const lawyerName = lawyer?.name || params.lawyerName || 'Advocate';
  const lawyerSpec = lawyer
    ? `${lawyer.spec} · ${lawyer.location}`
    : '';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5C1A1A" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>BI</Text>
          </View>
          <Text style={styles.headerTitle}>Request Consultation</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.title}>Consultation Request Bhejein</Text>
        <Text style={styles.lawyerName}>{lawyerName}</Text>
        {!!lawyerSpec && <Text style={styles.subtitle}>{lawyerSpec}</Text>}

        <Text style={styles.subtitle}>
          Apna case ya masla mukhtasar likhein — advocate ko yehi tafseel email par bhi bheji jayegi
          taake wo behtar rehnumai kar sakein.
        </Text>

        <TextInput
          style={styles.messageInput}
          placeholder="Apna case ya sawal yahan likhein... (e.g. Property dispute Hyderabad mein)"
          placeholderTextColor="#999"
          multiline
          value={message}
          onChangeText={setMessage}
        />

        <SendRequestButton
          lawyerId={lawyerId}
          lawyerName={lawyerName}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
