import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  ImageBackground,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFonts, RacingSansOne_400Regular } from '@expo-google-fonts/racing-sans-one';
import InstallAppButton from '../components/InstallAppButton';

const { width, height } = Dimensions.get('window');

export default function StartScreen() {
  const router = useRouter();

  const pulseBtn   = useRef(new Animated.Value(1)).current;
  const fadeIn     = useRef(new Animated.Value(0)).current;
  const cardSlide  = useRef(new Animated.Value(30)).current;

  const [fontsLoaded] = useFonts({ RacingSansOne_400Regular });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(cardSlide, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseBtn, { toValue: 1.025, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseBtn, { toValue: 1,     duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e1a" />

      <ImageBackground
        source={require('../assets/images/bgimg.png')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        {/* Gradient overlay — navy blue up top blending into deep maroon toward the card, ties both palettes together */}
        <LinearGradient
          colors={['rgba(8,12,28,0.75)', 'rgba(20,25,55,0.35)', 'rgba(60,15,25,0.45)', 'rgba(15,6,10,0.92)']}
          locations={[0, 0.35, 0.68, 1]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(153,27,27,0.25)']}
          style={styles.cornerTintBottom}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Floating Fixed Top Right Install App Button */}
        <View style={{
          position: Platform.OS === 'web' ? 'fixed' : 'absolute',
          top: Platform.OS === 'ios' ? 52 : 20,
          right: 20,
          zIndex: 99999,
        }}>
          <InstallAppButton />
        </View>

     {/* ── HERO AREA ── */}
     <Animated.View style={[styles.heroArea, { opacity: fadeIn }]} />

        {/* ── BOTTOM CARD ── */}
        <Animated.View style={[
          styles.bottomCard,
          { transform: [{ translateY: cardSlide }], opacity: fadeIn },
        ]}>

          <View style={styles.cardHandle} />

          <Text
            style={[
              styles.mainTitle,
              fontsLoaded ? { fontFamily: 'RacingSansOne_400Regular' } : { fontFamily: 'System' }
            ]}
          >
            Barq-e-Insaf
          </Text>

          <Text style={styles.tagSubtext}>Smart decisions for legal matters</Text>

          {/* Poetry */}
          <View style={styles.poetryWrap}>
            <Text style={styles.urduPoetryLine}>اندھیری رات میں امید کا اک دیپ جلے،</Text>
            <Text style={styles.urduPoetryLine}>وکیلِ حق جو ملے تو ہر مسافر چلے۔</Text>
          </View>

          {/* Buttons */}
          <View style={styles.btnStack}>

            <Animated.View style={[styles.btnFull, { transform: [{ scale: pulseBtn }] }]}>
              <TouchableOpacity
                style={styles.btnFull}
                activeOpacity={0.86}
                onPress={() => {
                  if (Platform.OS === 'web' && typeof window !== 'undefined') {
                    window.location.href = '/RoleSelectScreen';
                  } else {
                    router.push('/RoleSelectScreen');
                  }
                }}
              >
                <LinearGradient
                  colors={['#1e3a8a', '#6d1530', '#b91c1c']}
                  style={styles.primaryBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.primaryBtnText}>GET STARTED</Text>
                  <View style={styles.primaryBtnArrowBox}>
                    <Text style={styles.primaryBtnArrow}>ᯓ➤</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.8}
              onPress={() => {
                if (Platform.OS === 'web' && typeof window !== 'undefined') {
                  window.location.href = '/LandingScreen';
                } else {
                  router.push('/LandingScreen');
                }
              }}
            >
              <Text style={styles.secondaryBtnText}>EXPLORE PROJECT</Text>
            </TouchableOpacity>

          </View>

          <Text style={styles.bottomHint}>Legal assistance for Sindh · English · Urdu · Sindhi</Text>

        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a',
  },
  bgImage: {
    flex: 1,
    width,
    height,
  },
  cornerTintTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.75,
    height: height * 0.4,
  },
  cornerTintBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: width * 0.75,
    height: height * 0.35,
  },

  // ── HERO AREA ──
  heroArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 18,
  },
  heroKicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(226,232,255,0.85)',
  },

  // ── BOTTOM CARD ──
  bottomCard: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 50,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 20,
  },
  cardHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDE3F5',
    marginBottom: 14,
  },
  mainTitle: {
    fontSize: 35,
    color: '#1E2A5F',
    letterSpacing: -0.5,
  },
  tagSubtext: {
    fontSize: 12,
    color: '#7C2D2D',
    fontWeight: '700',
    marginTop: -7,
    marginBottom: 10,
  },
  poetryWrap: {
    alignItems: 'center',
    marginBottom: 30,
    gap: 1,
  },
  urduPoetryLine: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2A2A5A',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.3,
  },

  // Buttons
  btnStack: {
    width: '100%',
    gap: 10,
    marginBottom: 12,
  },
  btnFull: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryBtn: {
    paddingVertical: 17,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  primaryBtnArrow: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 20,
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#C7CFEA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F5FB',
  },
  secondaryBtnText: {
    color: '#243B8F',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  bottomHint: {
    fontSize: 10,
    color: '#cad1ec',
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});