import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, Alert } from 'react-native';
import AdminSidebar from './AdminSidebar';

export default function ReviewsModeration() {
  const reviews = [
    { id: 'REV-001', reviewer: 'Muhammad Usman', lawyer: 'Miss Aysha Begum (SBC 20345)', rating: 5, comment: 'Outstanding High Court representation by Miss Aysha Begum.', status: 'Published' },
    { id: 'REV-002', reviewer: 'Rizwan Akhtar', lawyer: 'Mr. Nasrullah (SBC 475)', rating: 5, comment: 'Highly competent senior advocate in Naushahro Feroze.', status: 'Published' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0c0414" />
      <View style={styles.layoutRow}>
        <AdminSidebar activeRoute="reviews" />
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentPadding}>
          <Text style={styles.headerTitle}>⭐ Reviews & Ratings Moderation</Text>
          <Text style={styles.headerSub}>Review advocate ratings, verify client feedback & moderate inappropriate reviews</Text>

          <View style={{ gap: 12, marginTop: 20 }}>
            {reviews.map(r => (
              <View key={r.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.ratingText}>{'⭐'.repeat(r.rating)} ({r.rating}/5)</Text>
                  <View style={styles.badge}><Text style={styles.badgeText}>{r.status}</Text></View>
                </View>
                <Text style={styles.comment}>"{r.comment}"</Text>
                <Text style={styles.meta}>Reviewer: {r.reviewer} · Lawyer: {r.lawyer}</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                  <TouchableOpacity style={styles.btnDanger} onPress={() => Alert.alert('Review Removed', `Review ${r.id} has been removed.`)}>
                    <Text style={styles.btnText}>🗑 Remove Review</Text>
                  </TouchableOpacity>
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
  card: { backgroundColor: '#1e293b', borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#fbbf24', padding: 18 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  ratingText: { fontSize: 14, color: '#fbbf24', fontWeight: '800' },
  badge: { backgroundColor: 'rgba(34,197,94,0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { color: '#4ade80', fontSize: 11, fontWeight: '700' },
  comment: { color: '#f1f5f9', fontSize: 14, fontStyle: 'italic', marginBottom: 8 },
  meta: { color: '#64748b', fontSize: 11 },
  btnDanger: { backgroundColor: '#dc2626', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
