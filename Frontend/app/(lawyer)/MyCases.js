import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './MyCases.styles';
import api from '../../services/api';

export default function MyCases() {
  const router = useRouter();
  const [activeCases, setActiveCases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const res = await api.get('/cases/my');
        const formatted = (res.data || []).map(c => ({
          id: c.id,
          title: c.title,
          clientName: c.citizen?.name || 'Client',
          description: c.description || 'Legal consultation matter.'
        }));
        setActiveCases(formatted);
      } catch (err) {
        console.log('Error fetching cases:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const handleNav = (lbl) => {
    if (lbl === 'home') router.push('/(lawyer)/LawyerHome');
    if (lbl === 'requests') router.push('/(lawyer)/IncomingRequests');
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
        {loading ? (
          <ActivityIndicator size="large" color="#0F2744" style={{ marginTop: 40 }} />
        ) : activeCases.length === 0 ? (
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 30, alignItems: 'center', marginTop: 20, borderWidth: 1, borderColor: '#ece9e4' }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#666' }}>No active cases found</Text>
            <Text style={{ fontSize: 12, color: '#999', marginTop: 4 }}>You don't have any cases assigned to you.</Text>
          </View>
        ) : (
          activeCases.map((c, i) => (
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
                <Text style={styles.caseDescription} numberOfLines={2}>{c.description}</Text>
              </View>
              
              <View style={styles.caseFooter}>
                <Text style={styles.caseFooterText}>Tap to view case details</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
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