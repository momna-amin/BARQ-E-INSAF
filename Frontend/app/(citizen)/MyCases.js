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
import { useMockStore, activeCases } from './MockStore';

const filters = ['All', 'Active', 'Pending', 'Closed'];

export default function MyCases() {
  useMockStore();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('cases');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? activeCases
    : activeCases.filter(c => c.status === activeFilter);

  const handleNav = (id) => {
    setActiveNav(id);
    if (id === 'home')    router.push('/(citizen)/CitizenHome');
    if (id === 'cases')   router.push('/(citizen)/MyCases');
    if (id === 'lawyers') router.push('/(citizen)/FindLawyer');
    if (id === 'profile') router.push('/(citizen)/Profile');
  };

  const handleCasePress = (caseItem) => {
    router.push({
      pathname: '/(citizen)/CaseDetail',
      params: { caseId: caseItem.id }
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5C1A1A" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>BI</Text>
          </View>
          <Text style={styles.headerTitle}>My Cases</Text>
        </View>
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
          <TouchableOpacity
            key={i}
            style={styles.caseCard}
            onPress={() => handleCasePress(c)}
          >
            <View style={styles.caseCardTop}>
              <View style={styles.caseType}>
                <Text style={styles.caseTitle}>{c.title}</Text>
              </View>
              <Text style={styles.badgeText}>{c.status}</Text>
            </View>
            <Text style={styles.caseMeta}>Filing Date: {c.filingDate}</Text>
            
            {/* NO case description shown here as per prompt details */}
            
            <View style={styles.caseFooter}>
              <Text style={styles.caseFooterText}>Updated {c.lastUpdated}</Text>
              <TouchableOpacity style={styles.viewBtn} onPress={() => handleCasePress(c)}>
                <Text style={styles.viewBtnText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {['Home', 'Cases', 'Lawyers', 'Profile'].map((lbl) => (
          <TouchableOpacity
            key={lbl}
            style={styles.navItem}
            onPress={() => handleNav(lbl.toLowerCase())}
          >
            <Text style={[styles.navLabel, lbl === 'Cases' && styles.navLabelActive]}>{lbl}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}