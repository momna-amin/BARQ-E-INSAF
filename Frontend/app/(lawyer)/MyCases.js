import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './MyCases.styles';
import { useMockStore, activeCases } from './MockStore';

export default function MyCases() {
  useMockStore();
  const router = useRouter();

  const handleNav = (lbl) => {
    if (lbl === 'home') router.push('/(lawyer)/LawyerHome');
    if (lbl === 'requests') router.push('/(lawyer)/CaseRequests');
    if (lbl === 'cases') router.push('/(lawyer)/MyCases');
    if (lbl === 'schedule') router.push('/(lawyer)/Schedule');
    if (lbl === 'profile') router.push('/(lawyer)/LawyerProfile');
  };

  const handleCasePress = (caseId) => {
    router.push({
      pathname: '/(lawyer)/CaseDetail',
      params: { caseId: caseId }
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>BI</Text>
          </View>
          <Text style={styles.headerTitle}>My Active Cases</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeCases.map((c, i) => (
          <TouchableOpacity 
            key={i} 
            style={styles.caseCard} 
            onPress={() => handleCasePress(c.id)}
          >
            <View style={styles.caseTop}>
              <Text style={styles.caseTitle}>{c.title}</Text>
              <Text style={styles.activeBadge}>Active</Text>
            </View>
            <Text style={styles.caseMeta}>Client Name: {c.clientName}</Text>
            
            <View style={styles.problemBox}>
              <Text style={styles.problemLabel}>Problem Statement:</Text>
              <Text style={styles.caseDescription} numberOfLines={2}>{c.problemStatement || c.description}</Text>
            </View>
            
            <View style={styles.caseFooter}>
              <Text style={styles.caseFooterText}>Tap to view case details</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.bottomNav}>
        {['Dashboard', 'Requests', 'Cases', 'Schedule', 'Profile'].map((lbl, idx) => {
          const ids = ['home', 'requests', 'cases', 'schedule', 'profile'];
          return (
            <TouchableOpacity
              key={lbl}
              style={styles.navItem}
              onPress={() => handleNav(ids[idx])}
            >
              <Text style={[styles.navLabel, ids[idx] === 'cases' && styles.navLabelActive]}>{lbl}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}