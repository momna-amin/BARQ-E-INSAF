import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import AdminSidebar from './AdminSidebar';

export default function LocationsPage() {
  const locs = [
    { city: 'Karachi Central', bench: 'District & Sessions Court Karachi Central', lawyers: 142, cases: 284 },
    { city: 'Karachi West', bench: 'District & Sessions Court Karachi West', lawyers: 88, cases: 198 },
    { city: 'Hyderabad', bench: 'Sindh High Court (Hyderabad Circuit Bench)', lawyers: 78, cases: 241 },
    { city: 'Sukkur', bench: 'Sindh High Court (Sukkur Circuit Bench)', lawyers: 52, cases: 167 },
    { city: 'Naushahro Feroze', bench: 'District & Sessions Court Naushahro Feroze', lawyers: 33, cases: 121 },
    { city: 'Larkana', bench: 'District Court Larkana', lawyers: 41, cases: 143 },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0c0414" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="locations" />
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          <Text style={styles.headerTitle}>📍 Sindh Locations & Court Benches</Text>
          <Text style={styles.headerSub}>Manage Sindh High Court benches, circuit courts & district jurisdiction lists</Text>

          <View style={{ gap: 12, marginTop: 20 }}>
            {locs.map((l, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cityName}>📍 {l.city} (Province Sindh)</Text>
                <Text style={styles.benchName}>{l.bench}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.meta}>⚖️ Verified Lawyers: {l.lawyers}</Text>
                  <Text style={styles.meta}>📋 Active Cases: {l.cases}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0c0414' },
  layoutRow: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1, backgroundColor: '#0f172a' },
  contentPadding: { padding: 24 },
  headerTitle: { color: '#f8fafc', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  card: { backgroundColor: '#1e293b', borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#3b82f6', padding: 18 },
  cityName: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
  benchName: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: 20, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#334155' },
  meta: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },
});
