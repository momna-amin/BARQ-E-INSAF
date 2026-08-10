import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

// Sample reviews left by citizens
const reviewsList = [
  {
    clientName: 'Ahmed Raza',
    rating: '★★★★★',
    score: '5.0',
    caseType: 'Property Dispute · Hyderabad',
    date: '2 weeks ago',
    comment: 'Advocate Sara handled our boundary wall land dispute with great professionalism. She explained Sindh property laws clearly and reached a quick settlement.'
  },
  {
    clientName: 'Zara Memon',
    rating: '★★★★★',
    score: '5.0',
    caseType: 'Child Custody · Karachi Family Court',
    date: '1 month ago',
    comment: 'Very empathetic and knowledgeable regarding family court procedures in Karachi. Strongly recommended for family matters.'
  },
  {
    clientName: 'Bilal Khan',
    rating: '★★★★☆',
    score: '4.0',
    caseType: 'Inheritance Distribution · Sukkur',
    date: '2 months ago',
    comment: 'Good communication throughout our inheritance division proceedings. Provided honest legal guidance.'
  }
];

export default function LawyerReviews() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Client Reviews & Ratings</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        
        {/* Rating Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryScore}>4.9</Text>
          <Text style={styles.summaryStars}>★★★★★</Text>
          <Text style={styles.summarySub}>Based on 28 verified client reviews</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified by Barq-e-Insaf</Text>
          </View>
        </View>

        {/* Reviews List Header */}
        <Text style={styles.sectionTitle}>Recent Client Feedback</Text>

        {/* Render Review Cards */}
        {reviewsList.map((item, index) => (
          <View key={index} style={styles.reviewCard}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.clientName}>{item.clientName}</Text>
                <Text style={styles.caseType}>{item.caseType}</Text>
              </View>
              <View style={styles.scorePill}>
                <Text style={styles.scoreText}>⭐ {item.score}</Text>
              </View>
            </View>

            <Text style={styles.stars}>{item.rating}</Text>
            <Text style={styles.comment}>{item.comment}</Text>
            <Text style={styles.dateText}>Posted {item.date}</Text>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F2744' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 18 },
  backBtn: { marginRight: 16 },
  backText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  scroll: { flex: 1, backgroundColor: '#F5F3EF' },
  content: { padding: 20, gap: 16 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', elevation: 3 },
  summaryScore: { fontSize: 44, fontWeight: '900', color: '#0F2744' },
  summaryStars: { color: '#fbbf24', fontSize: 20, marginVertical: 4 },
  summarySub: { fontSize: 12, color: '#666', fontWeight: '500' },
  verifiedBadge: { backgroundColor: '#dcfce7', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 50, marginTop: 12 },
  verifiedText: { color: '#166534', fontSize: 11, fontWeight: '800' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#0F2744', marginTop: 8 },
  reviewCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, elevation: 2, borderWidth: 1, borderColor: '#ece9e4' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  clientName: { fontSize: 15, fontWeight: '800', color: '#1a1a1a' },
  caseType: { fontSize: 11, color: '#888', marginTop: 2, fontWeight: '500' },
  scorePill: { backgroundColor: '#fef3c7', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  scoreText: { color: '#92400e', fontSize: 11, fontWeight: '800' },
  stars: { color: '#fbbf24', fontSize: 14, marginBottom: 8 },
  comment: { fontSize: 13, color: '#444', lineHeight: 18, marginBottom: 10 },
  dateText: { fontSize: 10, color: '#aaa', fontStyle: 'italic' },
});
