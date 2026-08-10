import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    // After 2.5s, transition smoothly
    const timer = setTimeout(() => {
      router.replace('/StartScreen');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#140505" />
      
      {/* Background Image & Gradient */}
      <Image
        source={require('../assets/images/login-bg.jpeg')}
        style={styles.bgImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(20,5,5,0.4)', 'rgba(20,5,5,0.85)', '#140505']}
        style={styles.gradient}
      />

      {/* Animated Logo & Title */}
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Barq-e-Insaf</Text>
        <Text style={styles.tagline}>AI-Powered Legal Empowerment</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#140505', justifyContent: 'center', alignItems: 'center' },
  bgImage: { position: 'absolute', width: width, height: height, top: 0 },
  gradient: { position: 'absolute', width: width, height: height },
  content: { alignItems: 'center', zIndex: 10 },
  logo: { width: 100, height: 100, marginBottom: 16 },
  appName: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  tagline: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6, fontWeight: '600', letterSpacing: 0.5 },
});