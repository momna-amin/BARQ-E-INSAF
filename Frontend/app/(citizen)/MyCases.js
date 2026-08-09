import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './MyCases.styles';

const filters = ['All', 'Active', 'Pending', 'Closed'];

const cases = [
  {
    icon: '🏠',
    title: 'Property Dispute — Hyderabad',
    lawyer: 'Sara Raza',
    court: 'Civil Court Hyderabad',
    updated: 'Updated 2 hours ago',
    hearing: 'Next hearing: 24 Apr',
    badge: 'Active',
    badgeStyle: 'badgeGreen',
    dot: '#4ade80',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Inheritance Claim — Karachi',
    lawyer: 'M. Karim',
    court: 'Family Court Karachi',
    updated: 'Updated 1 day ago',
    hearing: 'Hearing pending',
    badge: 'Pending',
    badgeStyle: 'badgeAmber',
    dot: '#f59e0b',
  },
  {
    icon: '📋',
    title: 'Tenant Dispute — Sukkur',
    lawyer: 'Fatima A.',
    court: 'Civil Court Sukkur',
    updated: 'Closed 2 weeks ago',
    hearing: 'Case resolved',
    badge: 'Closed',
    badgeStyle: 'badgeRed',
    dot: '#ef4444',
  },
];

export default function MyCases() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? cases
    : cases.filter(c => c.badge === activeFilter);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5C1A1A" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cases</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FILTER CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* CASE CARDS */}
        {filtered.map((c, i) => (
          <View key={i} style={styles.caseCard}>
            <View style={styles.caseCardTop}>
              <View style={styles.caseType}>
                <Text style={styles.caseTypeIcon}>{c.icon}</Text>
                <Text style={styles.caseTitle}>{c.title}</Text>
              </View>
              <Text style={[styles.badge, styles[c.badgeStyle]]}>{c.badge}</Text>
            </View>
            <Text style={styles.caseMeta}>⚖️ Lawyer: {c.lawyer}</Text>
            <Text style={styles.caseMeta}>🏛️ {c.court}</Text>
            <Text style={styles.caseMeta}>📅 {c.hearing}</Text>
            <View style={styles.caseFooter}>
              <Text style={styles.caseFooterText}>{c.updated}</Text>
              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}