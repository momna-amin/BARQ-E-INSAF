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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFonts, RacingSansOne_400Regular } from '@expo-google-fonts/racing-sans-one';

const { width, height } = Dimensions.get('window');

export default function StartScreen() {
  const router = useRouter();

  const floatY      = useRef(new Animated.Value(0)).current;
  const floatX      = useRef(new Animated.Value(0)).current;
  const glowScale   = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.5)).current;
  const pulseBtn    = useRef(new Animated.Value(1)).current;
  const orbRotate   = useRef(new Animated.Value(0)).current;
  const blinkAnim   = useRef(new Animated.Value(1)).current;
  const ring2Rotate = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({ RacingSansOne_400Regular });

  const particles = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      anim: new Animated.Value(0),
      x: [width * 0.08, width * 0.82, width * 0.15, width * 0.75, width * 0.35, width * 0.65][i],
      y: [height * 0.08, height * 0.12, height * 0.32, height * 0.28, height * 0.05, height * 0.38][i],
      size: [5, 3, 4, 6, 3, 4][i],
      duration: [3200, 4100, 2800, 3700, 4400, 3000][i],
    }))
  ).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -18, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0,   duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatX, { toValue: 7,  duration: 3600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatX, { toValue: -7, duration: 3600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowScale,   { toValue: 1.15, duration: 2400, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0.15, duration: 2400, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(glowScale,   { toValue: 1,    duration: 2400, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0.45, duration: 2400, useNativeDriver: true }),
        ]),
      ])
    ).start();

    Animated.loop(
      Animated.timing(orbRotate, {
        toValue: 1,
        duration: 11000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const scheduleBlink = () => {
      const delay = 8000 + Math.random() * 5000;
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(blinkAnim, { toValue: 0.06, duration: 90,  useNativeDriver: true }),
          Animated.timing(blinkAnim, { toValue: 1,    duration: 110, useNativeDriver: true }),
        ]).start(() => scheduleBlink());
      }, delay);
    };
    scheduleBlink();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseBtn, { toValue: 1.025, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseBtn, { toValue: 1,     duration: 1400, useNativeDriver: true }),
      ])
    ).start();

    particles.forEach((p) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(p.anim, { toValue: 1, duration: p.duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(p.anim, { toValue: 0, duration: p.duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    });

    Animated.loop(
      Animated.timing(ring2Rotate, {
        toValue: 1,
        duration: 16000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

  }, []);

  const spin = orbRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinReverse = ring2Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#07152e" />

      {/* Background gradient */}
      <LinearGradient
        colors={['#14557a', '#040808', '#141363', '#180669']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Ambient blobs */}
      <View style={[styles.ambientBlob, {
        top: height * 0.02, left: -width * 0.2,
        width: width * 0.65, height: width * 0.65,
        backgroundColor: 'rgba(37,99,235,0.09)',
        borderRadius: width * 0.35,
      }]} />
      <View style={[styles.ambientBlob, {
        top: height * 0.18, right: -width * 0.15,
        width: width * 0.55, height: width * 0.55,
        backgroundColor: 'rgba(99,179,237,0.07)',
        borderRadius: width * 0.3,
      }]} />
      <View style={[styles.ambientBlob, {
        top: height * 0.35, left: width * 0.1,
        width: width * 0.4, height: width * 0.4,
        backgroundColor: 'rgba(14,165,233,0.05)',
        borderRadius: width * 0.22,
      }]} />

      {/* Particles */}
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              opacity: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.55] }),
              transform: [{
                translateY: p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, -14] }),
              }],
            },
          ]}
        />
      ))}

      {/* ── ORB AREA ── */}
      <View style={styles.orbArea}>

        <Animated.View style={[
          styles.outerGlow,
          { transform: [{ scale: glowScale }], opacity: glowOpacity },
        ]} />

        <Animated.View style={[styles.orbitRing1, { transform: [{ rotate: spin }] }]} />
        <Animated.View style={[styles.orbitRing2, { transform: [{ rotate: spinReverse }] }]} />
        <View style={styles.innerRing} />

        {/* Floating orb */}
        <Animated.View style={[
          styles.orbFloat,
          { transform: [{ translateY: floatY }, { translateX: floatX }] },
        ]}>

          <Animated.View style={[styles.hazeRing, { transform: [{ rotate: spin }] }]} />

          {/* Orb body */}
          <LinearGradient
            colors={['#1eb7c2', '#1b45ce', '#1d8cf8', '#07c2b9', '#0661d8']}
            style={styles.orbBody}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
          >
            <View style={styles.orbVignette} />

            <View style={styles.eyesRow}>
              <Animated.View style={[styles.eyeWrap, { transform: [{ scaleY: blinkAnim }] }]}>
                <LinearGradient
                  colors={['#ffffff', '#e0f2fe']}
                  style={styles.eyeInner}
                  start={{ x: 0.3, y: 0 }}
                  end={{ x: 0.7, y: 1 }}
                />
              </Animated.View>
              <Animated.View style={[styles.eyeWrap, { transform: [{ scaleY: blinkAnim }] }]}>
                <LinearGradient
                  colors={['#ffffff', '#e0f2fe']}
                  style={styles.eyeInner}
                  start={{ x: 0.3, y: 0 }}
                  end={{ x: 0.7, y: 1 }}
                />
              </Animated.View>
            </View>

            <View style={styles.orbShine} />
            <View style={styles.orbShine2} />
          </LinearGradient>

          {/* ⚡ Lightning badge */}
          <Text style={styles.lightningIcon}>⚡</Text>

          {/* Drop shadow */}
          <Animated.View style={[
            styles.orbShadow,
            {
              opacity: floatY.interpolate({ inputRange: [-18, 0], outputRange: [0.12, 0.3] }),
              transform: [{
                scaleX: floatY.interpolate({ inputRange: [-18, 0], outputRange: [0.6, 1] }),
              }],
            },
          ]} />
        </Animated.View>

      </View>

      {/* ── BOTTOM CARD ── */}
      <View style={styles.bottomCard}>

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
              onPress={() => router.push('/RoleSelectScreen')}
            >
              <LinearGradient
                colors={['#0232b6', '#2563eb', '#5694f8']}
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
            onPress={() => router.push('/LandingScreen')}
          >
            <Text style={styles.secondaryBtnText}>EXPLORE PROJECT</Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.bottomHint}>Legal assistance for Sindh · English · Urdu · Sindhi</Text>

      </View>
    </SafeAreaView>
  );
}

// ── STYLES ──────────────────────────────────────────────────────
const ORB = width * 0.55;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  gradient: {
    position: 'absolute',
    width,
    height,
  },
  ambientBlob: {
    position: 'absolute',
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#93C5FD',
    zIndex: 1,
  },

  // ── ORB AREA ──
  orbArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  outerGlow: {
    position: 'absolute',
    width: ORB + 120,
    height: ORB + 120,
    borderRadius: (ORB + 120) / 2,
    backgroundColor: 'rgba(96,165,250,0.14)',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
  },
  orbitRing1: {
    position: 'absolute',
    width: ORB + 66,
    height: ORB + 66,
    borderRadius: (ORB + 66) / 2,
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.3)',
    borderStyle: 'dashed',
  },
  orbitRing2: {
    position: 'absolute',
    width: ORB + 44,
    height: ORB + 44,
    borderRadius: (ORB + 44) / 2,
    borderWidth: 1,
    borderColor: 'rgba(186,230,253,0.18)',
    borderStyle: 'dashed',
  },
  innerRing: {
    position: 'absolute',
    width: ORB + 20,
    height: ORB + 20,
    borderRadius: (ORB + 20) / 2,
    borderWidth: 1,
    borderColor: 'rgba(186,230,253,0.12)',
  },
  orbFloat: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hazeRing: {
    position: 'absolute',
    width: ORB + 28,
    height: ORB + 28,
    borderRadius: (ORB + 28) / 2,
    borderWidth: 20,
    borderColor: 'transparent',
    borderTopColor:    'rgba(96,165,250,0.16)',
    borderRightColor:  'rgba(56,189,248,0.12)',
    borderBottomColor: 'rgba(147,197,253,0.09)',
    borderLeftColor:   'rgba(96,165,250,0.07)',
  },
  orbBody: {
    width: ORB,
    height: ORB,
    borderRadius: ORB / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.45,
    shadowRadius: 36,
    elevation: 24,
  },
  orbVignette: {
    position: 'absolute',
    width: ORB,
    height: ORB,
    borderRadius: ORB / 2,
    borderWidth: 32,
    borderColor: 'rgba(8,8,8,0.15)',
  },
  eyesRow: {
    flexDirection: 'row',
    gap: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  eyeWrap: {
    width: 16,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
  eyeInner: {
    width: '100%',
    height: '100%',
  },
  orbShine: {
    position: 'absolute',
    top: ORB * 0.11,
    left: ORB * 0.17,
    width: ORB * 0.2,
    height: ORB * 0.09,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.28)',
    transform: [{ rotate: '-28deg' }],
  },
  orbShine2: {
    position: 'absolute',
    top: ORB * 0.22,
    left: ORB * 0.58,
    width: ORB * 0.08,
    height: ORB * 0.08,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },

  lightningIcon: {
    position: 'absolute',
    bottom: 7,
    right: -20,
    fontSize: 80,
    color: '#FFD700',
  },

  orbShadow: {
    marginTop: 10,
    width: ORB * 0.68,
    height: 14,
    borderRadius: 50,
    backgroundColor: 'rgba(96,165,250,0.25)',
    alignSelf: 'center',
  },

  // ── BOTTOM CARD ──
  bottomCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 50,
    alignItems: 'center',
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 20,
  },
  cardHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DBEAFE',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 35,
    color: '#1E3A5F',
    letterSpacing: -0.5,
  },
  tagSubtext: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '700',
    marginTop: -7,
    marginBottom: 10,
  },
  poetryWrap: {
    alignItems: 'center',
    marginBottom: 35,
    gap: 1,
  },
  urduPoetryLine: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E40AF',
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
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
  },
  secondaryBtnText: {
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  bottomHint: {
    fontSize: 10,
    color: '#93C5FD',
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});