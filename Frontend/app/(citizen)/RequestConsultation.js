import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import showAlert from '../../utils/showAlert';
import { ActivityIndicator } from 'react-native';
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

import SendRequestButton from '../../components/SendRequestButton';

export default function RequestConsultation() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [myCases, setMyCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedCaseTitle, setSelectedCaseTitle] = useState('');
  const [showCaseDropdown, setShowCaseDropdown] = useState(false);
  const [loadingCases, setLoadingCases] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingCases(true);
        const res = await api.get('/cases/my');
        setMyCases(res.data || []);
      } catch (err) {
        console.log('Error loading citizen cases:', err);
      } finally {
        setLoadingCases(false);
      }
    })();
  }, []);

  const lawyerId = params.lawyerId;
  const lawyerName = params.lawyerName || 'Advocate';
  const lawyerSpec = params.lawyerSpec || 'SBC Verified Advocate';

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
        <Text style={styles.title}>Request Consultation</Text>
        <Text style={styles.lawyerName}>Adv. {lawyerName}</Text>
        {!!lawyerSpec && <Text style={styles.subtitle}>{lawyerSpec}</Text>}

        {/* Case selector to attach an existing built case */}
        <Text style={styles.formLabel}>Attach Built Case (Optional)</Text>
        {loadingCases ? (
          <ActivityIndicator size="small" color="#5C1A1A" style={{ marginVertical: 12 }} />
        ) : (
          <>
            <TouchableOpacity 
              style={styles.dropdownSelector}
              onPress={() => setShowCaseDropdown(!showCaseDropdown)}
            >
              <Text style={styles.dropdownValue}>
                {selectedCaseTitle || 'Select one of your cases to attach...'}
              </Text>
            </TouchableOpacity>
            
            {showCaseDropdown && (
              <View style={styles.dropdownList}>
                <TouchableOpacity 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCaseId(null);
                    setSelectedCaseTitle('No Case Attached');
                    setShowCaseDropdown(false);
                  }}
                >
                  <Text style={{ fontSize: 13, color: '#ef4444', fontWeight: '800' }}>-- Do Not Attach Case --</Text>
                </TouchableOpacity>
                {myCases.map(c => (
                  <TouchableOpacity 
                    key={c.id} 
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedCaseId(c.id);
                      setSelectedCaseTitle(c.title);
                      setMessage(`Attached Case: ${c.title}\nCategory: ${c.type}\n\nDetails: ${c.description}`);
                      setShowCaseDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{c.title} ({c.type})</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        <Text style={styles.formLabel}>Additional Notes / Questions *</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Describe your legal issue, ask questions, or provide additional case context..."
          placeholderTextColor="#999"
          multiline
          value={message}
          onChangeText={setMessage}
        />

        <SendRequestButton
          lawyerId={lawyerId}
          lawyerName={lawyerName}
          reason={message}
          caseId={selectedCaseId}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
