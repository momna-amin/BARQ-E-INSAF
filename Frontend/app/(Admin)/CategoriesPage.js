import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import AdminSidebar from './AdminSidebar';

export default function CategoriesPage() {
  const cats = [
    { nameEn: 'Criminal Law', nameUr: 'فوجداری قانون', lawyers: 84, cases: 412, icon: '⚔️' },
    { nameEn: 'Family Law', nameUr: 'خاندانی قانون', lawyers: 62, cases: 338, icon: '👨‍👩‍👧' },
    { nameEn: 'Property Law', nameUr: 'جائیداد کا قانون', lawyers: 71, cases: 290, icon: '🏡' },
    { nameEn: 'Civil Law', nameUr: 'سول قانون', lawyers: 55, cases: 201, icon: '📜' },
    { nameEn: 'Corporate Law', nameUr: 'کارپوریٹ قانون', lawyers: 28, cases: 89, icon: '🏢' },
    { nameEn: 'Tax Law', nameUr: 'ٹیکس قانون', lawyers: 19, cases: 67, icon: '💰' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0c0414" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="categories" />
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          <Text style={styles.headerTitle}>🏷️ Legal Categories & Practice Areas</Text>
          <Text style={styles.headerSub}>Manage legal practice classifications across Sindh High Court & District Courts</Text>

          <View style={styles.grid}>
            {cats.map((c, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.icon}>{c.icon}</Text>
                <Text style={styles.nameEn}>{c.nameEn}</Text>
                <Text style={styles.nameUr}>{c.nameUr}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.meta}>⚖️ {c.lawyers} Lawyers</Text>
                  <Text style={styles.meta}>📋 {c.cases} Cases</Text>
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
  grid: { flexDirection: 'row', gap: 14, flexWrap: 'wrap', marginTop: 20 },
  card: { width: '31%', minWidth: 200, backgroundColor: '#1e293b', borderRadius: 16, padding: 18, borderLeftWidth: 4, borderLeftColor: '#3b82f6' },
  icon: { fontSize: 28, marginBottom: 8 },
  nameEn: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
  nameUr: { color: '#fbbf24', fontSize: 14, marginTop: 2, fontWeight: '600' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#334155' },
  meta: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
});
