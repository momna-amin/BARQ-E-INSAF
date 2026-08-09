import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './MyCases.styles';

const filters = ['All', 'Hearing', 'Docs Needed', 'Active'];

const cases = [
  { title: 'Raza vs. Malik — Property', client: 'Ahmed Raza', court: 'Civil Court Karachi', meta: 'Hearing: 22 Apr', badge: 'Hearing', style: 'badgeBlue' },
  { title: 'Khan Divorce Settlement',    client: 'Bilal Khan', court: 'Family Court Karachi', meta: 'Docs needed · 3 evidence files', badge: 'Docs Needed', style: 'badgeAmber' },
  { title: 'Memon Inheritance — Sukkur', client: 'Nadia Memon', court: 'Civil Court Sukkur', meta: 'Evidence submitted', badge: 'Active', style: 'badgeGreen' },
];

export default function MyCases() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All' ? cases : cases.filter(c => c.badge === activeFilter);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cases</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((f) => (
            <TouchableOpacity key={f} style={[styles.filterChip, activeFilter === f && styles.filterChipActive]} onPress={() => setActiveFilter(f)}>
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.map((c, i) => (
          <View key={i} style={styles.caseCard}>
            <View style={styles.caseTop}>
              <Text style={styles.caseTitle}>{c.title}</Text>
              <Text style={[styles.badge, styles[c.style]]}>{c.badge}</Text>
            </View>
            <Text style={styles.caseMeta}>👤 Client: {c.client}</Text>
            <Text style={styles.caseMeta}>🏛️ {c.court}</Text>
            <Text style={styles.caseMeta}>📅 {c.meta}</Text>
            <View style={styles.caseFooter}>
              <Text style={styles.caseFooterText}>Updated recently</Text>
              <TouchableOpacity style={styles.notesBtn}>
                <Text style={styles.notesBtnText}>Add Notes</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}