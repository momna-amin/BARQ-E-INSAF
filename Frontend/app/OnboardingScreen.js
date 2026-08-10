import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    badge: 'LEGAL EMPOWERMENT',
    title: 'Your Justice.\nYour Control.',
    subtitle: 'Bridging the legal access gap across Pakistan with instant AI assistance and certified advocate connection.',
    accentColor: '#3b82f6',
    bgColor: '#EFF6FF',
  },
  {
    id: '2',
    badge: 'MULTILINGUAL AI CHATBOT',
    title: 'Instant Legal Answers\nin Urdu & Sindhi.',
    subtitle: 'Ask legal questions regarding Pakistan Penal Code, Family Laws, and Property rights 24/7.',
    accentColor: '#10b981',
    bgColor: '#ECFDF5',
  },
  {
    id: '3',
    badge: 'SBC VERIFIED ADVOCATES',
    title: 'Verified Lawyers &\nBiometric Security.',
    subtitle: 'Connect directly with Sindh Bar Council advocates and sign representation agreements digitally.',
    accentColor: '#6366f1',
    bgColor: '#EEF2FF',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/RoleSelectScreen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.topRow}>
        <Text style={styles.brandTitle}>Barq-e-Insaf ⚡</Text>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={() => router.replace('/RoleSelectScreen')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={[styles.illustrationCard, { backgroundColor: item.bgColor }]}>
              <View style={[styles.iconCircle, { backgroundColor: item.accentColor }]}>
                <Text style={styles.badgeLetter}>{item.badge.substring(0, 1)}</Text>
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={[styles.badgeText, { color: item.accentColor }]}>{item.badge}</Text>
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.subText}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.bottomSection}>
        <View style={styles.paginationRow}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  { width: dotWidth, opacity, backgroundColor: slides[currentIndex].accentColor },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: slides[currentIndex].accentColor }]}
          activeOpacity={0.88}
          onPress={handleNext}
        >
          <Text style={styles.actionBtnText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  brandTitle: { fontSize: 18, fontWeight: '900', color: '#0F2744', letterSpacing: -0.3 },
  skipText: { fontSize: 14, fontWeight: '700', color: '#888' },
  slide: { width: width, paddingHorizontal: 24, alignItems: 'center' },
  illustrationCard: { width: width - 48, height: height * 0.38, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginTop: 16, marginBottom: 28 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', elevation: 6 },
  badgeLetter: { color: '#fff', fontSize: 32, fontWeight: '900' },
  textContainer: { width: '100%', paddingHorizontal: 8 },
  badgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8 },
  titleText: { fontSize: 28, fontWeight: '900', color: '#0F2744', lineHeight: 34, letterSpacing: -0.5 },
  subText: { fontSize: 14, color: '#666', marginTop: 10, lineHeight: 20, fontWeight: '500' },
  bottomSection: { paddingHorizontal: 24, paddingBottom: 32 },
  paginationRow: { flexDirection: 'row', height: 8, marginBottom: 20, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4, marginRight: 6 },
  actionBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', elevation: 4 },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
});