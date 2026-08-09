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
import { useRouter } from 'expo-router';
import styles from './FindLawyer.styles';

const specialties = ['All', 'Property', 'Family', 'Civil', 'Inheritance'];

const lawyers = [
  { initials: 'SR', name: 'Sara Raza',   spec: 'Property Law', location: 'Karachi',   rating: '4.9 ★', cases: 42, color: '#5C1A1A' },
  { initials: 'MK', name: 'M. Karim',    spec: 'Family Law',   location: 'Hyderabad', rating: '4.7 ★', cases: 31, color: '#0F2744' },
  { initials: 'FA', name: 'Fatima A.',   spec: 'Civil Cases',  location: 'Sukkur',    rating: '4.8 ★', cases: 28, color: '#1B4332' },
  { initials: 'ZH', name: 'Z. Hassan',   spec: 'Inheritance',  location: 'Larkana',   rating: '4.6 ★', cases: 19, color: '#4a148c' },
];

export default function FindLawyer() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = lawyers.filter(l => {
    const matchSpec = activeFilter === 'All' || l.spec.includes(activeFilter);
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchSearch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5C1A1A" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find a Lawyer</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SEARCH */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {specialties.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.filterChip, activeFilter === s && styles.filterChipActive]}
              onPress={() => setActiveFilter(s)}
            >
              <Text style={[styles.filterText, activeFilter === s && styles.filterTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LAWYER CARDS */}
        {filtered.map((l, i) => (
          <View key={i} style={styles.lawyerCard}>
            <View style={[styles.lawyerAvatar, { backgroundColor: l.color }]}>
              <Text style={styles.lawyerAvatarText}>{l.initials}</Text>
            </View>
            <View style={styles.lawyerInfo}>
              <Text style={styles.lawyerName}>{l.name}</Text>
              <Text style={styles.lawyerSpec}>{l.spec} · 📍 {l.location}</Text>
              <View style={styles.lawyerMeta}>
                <Text style={styles.sbcBadge}>✓ SBC Verified</Text>
                <Text style={styles.ratingText}>{l.rating} · {l.cases} cases</Text>
              </View>
              <TouchableOpacity style={styles.contactBtn}>
                <Text style={styles.contactBtnText}>Request Consultation</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}