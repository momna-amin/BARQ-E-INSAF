import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from './CaseEvidence.styles';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';
import showAlert from '../../utils/showAlert';

export default function CaseEvidence() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const caseId = params.caseId;

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCaseDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cases/' + caseId);
      const c = res.data;
      setCaseData({
        id: c.id,
        title: c.title,
        evidence: c.evidence || []
      });
    } catch (err) {
      console.log('Error fetching case detail for evidence:', err);
      showAlert('Error', 'Failed to load case details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseId) fetchCaseDetail();
  }, [caseId]);

  const handleNav = (id) => {
    if (id === 'home')    router.push('/(citizen)/CitizenHome');
    if (id === 'cases')   router.push('/(citizen)/MyCases');
    if (id === 'lawyers') router.push('/(citizen)/FindLawyer');
    if (id === 'profile') router.push('/(citizen)/Profile');
  };

  if (loading || !caseData) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#5C1A1A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5C1A1A" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>BI</Text>
          </View>
          <Text style={styles.headerTitle}>Case Evidence</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Secure Evidence Vault</Text>
        <Text style={styles.caseName}>Case: {caseData.title}</Text>
        <Text style={styles.info}>
          These are the verified documents uploaded for legal consultations.
        </Text>

        <TouchableOpacity 
          style={{ backgroundColor: '#5C1A1A', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center', marginBottom: 20, flexDirection: 'row', justifyContent: 'center', gap: 8 }}
          onPress={() => router.push({
            pathname: '/(citizen)/AddEvidence',
            params: { caseId: caseData.id }
          })}
        >
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>+ Add Evidence File</Text>
        </TouchableOpacity>

        <View style={styles.evidenceContainer}>
          {caseData.evidence.length > 0 ? (
            caseData.evidence.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#ece9e4', marginBottom: 10 }}>
                <View style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: '#fbeedb', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, color: '#b45309', fontWeight: '800' }}>{String(item.type || 'FILE').toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: '750', color: '#1a1a1a' }}>{item.name}</Text>
                  <Text style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{item.size} • Uploaded {item.date}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No evidence files added to this case.</Text>
          )}
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.bottomNav}>
        {['Home', 'Cases', 'Lawyers', 'Profile'].map((lbl) => (
          <TouchableOpacity
            key={lbl}
            style={styles.navItem}
            onPress={() => handleNav(lbl.toLowerCase())}
          >
            <Text style={styles.navLabel}>{lbl}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}