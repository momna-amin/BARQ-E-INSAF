import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from './CaseEvidence.styles';
import { useMockStore, activeCases } from './MockStore';

export default function CaseEvidence() {
  useMockStore();
  const router = useRouter();
  const params = useLocalSearchParams();
  const caseId = params.caseId || '1';

  const caseData = activeCases.find(c => c.id === caseId) || activeCases[0];

  const handleNav = (id) => {
    if (id === 'home')    router.push('/(citizen)/CitizenHome');
    if (id === 'cases')   router.push('/(citizen)/MyCases');
    if (id === 'lawyers') router.push('/(citizen)/FindLawyer');
    if (id === 'profile') router.push('/(citizen)/Profile');
  };

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

        <View style={styles.evidenceContainer}>
          {caseData.evidence.length > 0 ? (
            caseData.evidence.map((item, index) => (
              <View key={index} style={styles.evidenceCard}>
                <View style={styles.bulletBox} />
                <Text style={styles.evidenceText}>{item}</Text>
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