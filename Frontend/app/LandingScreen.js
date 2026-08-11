import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
<<<<<<< HEAD
import { useFonts, RacingSansOne_400Regular } from '@expo-google-fonts/racing-sans-one';

const { width, height } = Dimensions.get('window');
=======

const { width } = Dimensions.get('window');
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 36) : 0;

export default function LandingScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

<<<<<<< HEAD
  const [fontsLoaded] = useFonts({ RacingSansOne_400Regular });

=======
  // Tapping "Ask AI" opens LoginScreen
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
  const handleAskAI = () => {
    router.push('/LoginScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
<<<<<<< HEAD
      <StatusBar barStyle="light-content" backgroundColor="#07152e" translucent />

      {/* ── 1. CLEAN HEADER NAV BAR ── */}
      <LinearGradient
        colors={['#14557a', '#0a1628']}
        style={styles.headerNav}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
=======
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" translucent />

      {/* ── 1. CLEAN HEADER NAV BAR WITH STATUS BAR PADDING ── */}
      <View style={styles.headerNav}>
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
        <View style={styles.brandGroup}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
<<<<<<< HEAD
          <Text 
            style={[
              styles.brandTitle,
              fontsLoaded ? { fontFamily: 'RacingSansOne_400Regular' } : { fontFamily: 'System' }
            ]}
          >
            Barq-e-Insaf
          </Text>
=======
          <Text style={styles.brandTitle}>Barq-e-Insaf</Text>
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
        </View>

        <TouchableOpacity
          style={styles.signInBtn}
          onPress={() => router.push('/LoginScreen')}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
<<<<<<< HEAD
      </LinearGradient>
=======
      </View>
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── 2. HERO LUXURY SECTION ── */}
        <LinearGradient
<<<<<<< HEAD
          colors={['#14557a', '#040808', '#141363', '#180669']}
=======
          colors={['#0F2744', '#140505', '#091526']}
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
          style={styles.heroCard}
        >
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>SMART DECISIONS FOR LEGAL MATTERS</Text>
          </View>

<<<<<<< HEAD
          <Text 
            style={[
              styles.heroTitle,
              fontsLoaded ? { fontFamily: 'RacingSansOne_400Regular' } : { fontFamily: 'System' }
            ]}
          >
            Barq-e-Insaf
          </Text>
=======
          <Text style={styles.heroTitle}>Barq-e-Insaf</Text>
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
          <Text style={styles.heroSubtitle}>
            Pakistan's Premier AI Legal Assistant & Verified Advocate Network
          </Text>
          
          <Text style={styles.heroDesc}>
            Instant AI legal guidance in Urdu & Sindhi for Pakistan Penal Code, Property, and Family laws, paired with Sindh Bar Council verified advocates.
          </Text>

<<<<<<< HEAD
          {/* ── 3. "Ask AI" SEARCH INPUT BAR ── */}
=======
          {/* ── 3. "Ask AI ➔" SEARCH INPUT BAR ── */}
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Ask legal question (PPC Section 302, Divorce, Property)..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.askAiBtn} activeOpacity={0.88} onPress={handleAskAI}>
              <LinearGradient
<<<<<<< HEAD
                colors={['#1d4ed8', '#2563eb', '#3b82f6']}
=======
                colors={['#3b82f6', '#1d4ed8']}
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
                style={styles.askAiGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
<<<<<<< HEAD
                <Text style={styles.askAiText}>Ask AI →</Text>
=======
                <Text style={styles.askAiText}>Ask AI ➔</Text>
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

<<<<<<< HEAD
        {/* ── 4. VISUAL SHOWCASE CAROUSEL ── */}
=======
        {/* ── 4. VISUAL SHOWCASE CAROUSEL (USING YOUR bg2.jpg AND pak falg.jpg IMAGES) ── */}
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
        <View style={styles.showcaseSection}>
          <Text style={styles.sectionHeader}>Explore Legal Access Across Pakistan</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContainer}>
<<<<<<< HEAD
            {/* Image 1 */}
=======
            {/* Image 1: Islamabad / Faisal Mosque */}
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
            <View style={styles.imageCard}>
              <Image
                source={require('../assets/images/bg2.jpg')}
                style={styles.cardPhoto}
                resizeMode="cover"
              />
              <LinearGradient colors={['transparent', 'rgba(15,39,68,0.95)']} style={styles.imageGradient}>
                <Text style={styles.cardTag}>24/7 AI LEGAL RESEARCH</Text>
                <Text style={styles.cardTitle}>Pakistan Penal Code & Precedents</Text>
              </LinearGradient>
            </View>

<<<<<<< HEAD
            {/* Image 2 */}
=======
            {/* Image 2: Pakistan Flag */}
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
            <View style={styles.imageCard}>
              <Image
                source={require('../assets/images/pak falg.jpg')}
                style={styles.cardPhoto}
                resizeMode="cover"
              />
              <LinearGradient colors={['transparent', 'rgba(20,5,5,0.95)']} style={styles.imageGradient}>
                <Text style={styles.cardTag}>SBC VERIFIED ADVOCATES</Text>
                <Text style={styles.cardTitle}>Verified Bar Council Advocate Network</Text>
              </LinearGradient>
            </View>

<<<<<<< HEAD
            {/* Image 3 */}
=======
            {/* Image 3: Supreme Court */}
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
            <View style={styles.imageCard}>
              <Image
                source={require('../assets/images/scbg.png')}
                style={styles.cardPhoto}
                resizeMode="cover"
              />
              <LinearGradient colors={['transparent', 'rgba(15,39,68,0.95)']} style={styles.imageGradient}>
                <Text style={styles.cardTag}>BIOMETRIC CONTRACTS</Text>
                <Text style={styles.cardTitle}>Digital Representation Agreements</Text>
              </LinearGradient>
            </View>
          </ScrollView>
        </View>

        {/* ── 5. CORE PLATFORM CAPABILITIES ── */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeader}>Why Barq-e-Insaf?</Text>

          <View style={styles.featureBox}>
            <View style={[styles.featureIconCircle, { backgroundColor: '#EFF6FF' }]}>
<<<<<<< HEAD
              <Image
                source={require('../assets/images/img1.png')}
                style={styles.featureIcon}
                resizeMode="contain"
              />
=======
              <Text style={styles.featureIconSymbol}>⚡</Text>
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
            </View>
            <View style={styles.featureTextGroup}>
              <Text style={styles.featureTitle}>Multilingual AI Legal Research</Text>
              <Text style={styles.featureDesc}>Get instant responses in Urdu, Sindhi, and English for PPC, property disputes, and labor rights.</Text>
            </View>
          </View>

          <View style={styles.featureBox}>
            <View style={[styles.featureIconCircle, { backgroundColor: '#ECFDF5' }]}>
<<<<<<< HEAD
              <Image
                source={require('../assets/images/img2.png')}
                style={styles.featureIcon}
                resizeMode="contain"
              />
=======
              <Text style={styles.featureIconSymbol}>🛡️</Text>
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
            </View>
            <View style={styles.featureTextGroup}>
              <Text style={styles.featureTitle}>SBC Verified Advocate Directory</Text>
              <Text style={styles.featureDesc}>Connect with certified Sindh Bar Council lawyers with transparent client ratings and misconduct reporting.</Text>
            </View>
          </View>

          <View style={styles.featureBox}>
            <View style={[styles.featureIconCircle, { backgroundColor: '#FEF3C7' }]}>
<<<<<<< HEAD
              <Image
                source={require('../assets/images/img3.png')}
                style={styles.featureIcon}
                resizeMode="contain"
              />
=======
              <Text style={styles.featureIconSymbol}>📜</Text>
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
            </View>
            <View style={styles.featureTextGroup}>
              <Text style={styles.featureTitle}>Biometric Contract Signing</Text>
              <Text style={styles.featureDesc}>Sign Vakalatnama representation agreements securely with simulated biometric fingerprint verification.</Text>
            </View>
          </View>
        </View>

        {/* ── 6. GET STARTED CTA CARD ── */}
        <View style={styles.ctaCard}>
<<<<<<< HEAD
          <LinearGradient 
            colors={['#14557a', '#0a1628', '#141363']} 
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
=======
          <LinearGradient colors={['#0F2744', '#1e3a8a']} style={styles.ctaGradient}>
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
            <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
            <Text style={styles.ctaSubtitle}>Select your portal to log in as a Citizen, Verified Lawyer, or NGO Administrator.</Text>
            
            <TouchableOpacity
              style={styles.ctaBtn}
              activeOpacity={0.88}
              onPress={() => router.push('/RoleSelectScreen')}
            >
<<<<<<< HEAD
              <LinearGradient
                colors={['#1d4ed8', '#2563eb', '#3b82f6']}
                style={styles.ctaBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaBtnText}>GET STARTED →</Text>
              </LinearGradient>
=======
              <Text style={styles.ctaBtnText}>GET STARTED ➔</Text>
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
            </TouchableOpacity>
          </LinearGradient>
        </View>

<<<<<<< HEAD
        <View style={{ height: 30 }} />
=======
        <View style={{ height: 40 }} />
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
<<<<<<< HEAD
  
  // ── HEADER ──
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: STATUSBAR_HEIGHT + 8,
    paddingBottom: 12,
  },
  brandGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoImage: { width: 28, height: 28 },
  brandTitle: { 
    fontSize: 18, 
    color: '#fff', 
    letterSpacing: -0.3 
  },
  signInBtn: { 
    paddingHorizontal: 14, 
    paddingVertical: 6, 
    borderRadius: 16, 
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  signInText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  
  // ── SCROLL ──
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  
  // ── HERO ──
  heroCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  badgePill: {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderWidth: 1,
    borderColor: '#fbbf24',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 40,
    marginBottom: 8,
  },
  badgePillText: { color: '#fbbf24', fontSize: 8, fontWeight: '800', letterSpacing: 0.6 },
  heroTitle: { 
    fontSize: 28, 
    color: '#fff', 
    letterSpacing: -0.5, 
    textAlign: 'center' 
  },
  heroSubtitle: { 
    fontSize: 12, 
    color: '#3b82f6', 
    fontWeight: '700', 
    marginTop: 3, 
    textAlign: 'center' 
  },
  heroDesc: { 
    fontSize: 12, 
    color: 'rgba(255, 255, 255, 0.7)', 
    textAlign: 'center', 
    marginTop: 8, 
    lineHeight: 18, 
    fontWeight: '500' 
  },
  
  // ── SEARCH ──
=======
  headerNav: {
    flexDirection: 'row',
    justify: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: STATUSBAR_HEIGHT + 12,
    paddingBottom: 14,
    backgroundColor: '#0F2744',
  },
  brandGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoImage: { width: 32, height: 32 },
  brandTitle: { fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: -0.3 },
  signInBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.15)' },
  signInText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  heroCard: {
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
  },
  badgePill: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    borderWidth: 1,
    borderColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    marginBottom: 12,
  },
  badgePillText: { color: '#fbbf24', fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -0.5, textAlign: 'center' },
  heroSubtitle: { fontSize: 14, color: '#3b82f6', fontWeight: '700', marginTop: 4, textAlign: 'center' },
  heroDesc: { fontSize: 13, color: 'rgba(255, 255, 255, 0.75)', textAlign: 'center', marginTop: 10, lineHeight: 20, fontWeight: '500' },
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
<<<<<<< HEAD
    borderRadius: 14,
    padding: 5,
    marginTop: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  searchInput: { 
    flex: 1, 
    paddingHorizontal: 12, 
    paddingVertical: 8,
    fontSize: 12, 
    color: '#0f172a' 
  },
  askAiBtn: { borderRadius: 12, overflow: 'hidden' },
  askAiGradient: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
  askAiText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  
  // ── SHOWCASE ──
  showcaseSection: { marginBottom: 14 },
  sectionHeader: { 
    fontSize: 16, 
    fontWeight: '900', 
    color: '#0F2744', 
    marginBottom: 10 
  },
  carouselContainer: { gap: 10 },
  imageCard: {
    width: width * 0.7,
    height: 160,
    borderRadius: 16,
=======
    borderRadius: 18,
    padding: 6,
    marginTop: 22,
    elevation: 4,
  },
  searchInput: { flex: 1, paddingHorizontal: 14, fontSize: 13, color: '#0f172a' },
  askAiBtn: { borderRadius: 14, overflow: 'hidden' },
  askAiGradient: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14 },
  askAiText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  showcaseSection: { marginBottom: 20 },
  sectionHeader: { fontSize: 18, fontWeight: '900', color: '#0F2744', marginBottom: 14 },
  carouselContainer: { gap: 14 },
  imageCard: {
    width: width * 0.76,
    height: 190,
    borderRadius: 20,
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
    overflow: 'hidden',
    backgroundColor: '#0F2744',
    position: 'relative',
  },
  cardPhoto: { width: '100%', height: '100%' },
<<<<<<< HEAD
  imageGradient: { 
    position: 'absolute', 
    width: '100%', 
    height: '100%', 
    justifyContent: 'flex-end', 
    padding: 12 
  },
  cardTag: { color: '#fbbf24', fontSize: 8, fontWeight: '900', letterSpacing: 0.6 },
  cardTitle: { color: '#fff', fontSize: 12, fontWeight: '800', marginTop: 1 },
  
  // ── FEATURES ──
  featuresSection: { marginBottom: 14 },
  featureBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    backgroundColor: '#fff', 
    padding: 14, 
    borderRadius: 14, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconCircle: { 
    width: 38, 
    height: 38, 
    borderRadius: 19, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  featureIcon: { 
    width: 22, 
    height: 22 
  },
  featureTextGroup: { flex: 1 },
  featureTitle: { fontSize: 13, fontWeight: '800', color: '#0F2744' },
  featureDesc: { fontSize: 11, color: '#64748b', marginTop: 2, lineHeight: 16 },
  
  // ── CTA ──
  ctaCard: { borderRadius: 20, overflow: 'hidden', marginTop: 2 },
  ctaGradient: { padding: 20, alignItems: 'center' },
  ctaTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '900', 
    textAlign: 'center' 
  },
  ctaSubtitle: { 
    color: '#93c5fd', 
    fontSize: 11, 
    textAlign: 'center', 
    marginTop: 4, 
    lineHeight: 16 
  },
  ctaBtn: { 
    marginTop: 14,
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaBtnGradient: { 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaBtnText: { 
    color: '#fff', 
    fontSize: 13, 
    fontWeight: '900', 
    letterSpacing: 0.5 
  },
=======
  imageGradient: { position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end', padding: 14 },
  cardTag: { color: '#fbbf24', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '800', marginTop: 2 },
  featuresSection: { marginBottom: 20 },
  featureBox: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', padding: 16, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  featureIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  featureIconSymbol: { fontSize: 22 },
  featureTextGroup: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '800', color: '#0F2744' },
  featureDesc: { fontSize: 12, color: '#64748b', marginTop: 2, lineHeight: 17 },
  ctaCard: { borderRadius: 24, overflow: 'hidden', marginTop: 6 },
  ctaGradient: { padding: 24, alignItems: 'center' },
  ctaTitle: { color: '#fff', fontSize: 20, fontWeight: '900', textAlign: 'center' },
  ctaSubtitle: { color: '#93c5fd', fontSize: 12, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  ctaBtn: { backgroundColor: '#fbbf24', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14, marginTop: 16 },
  ctaBtnText: { color: '#0F2744', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
});