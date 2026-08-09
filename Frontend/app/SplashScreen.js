import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/RoleSelectScreen');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splash-bgg.jpg')}
        style={styles.bgImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(60,10,10,0.3)', 'rgba(60,10,10,0.75)', '#3C0A0A']}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.slogan}>Smart Decisions for Legal Matters</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3C0A0A',
  },
  bgImage: {
    position: 'absolute',
    width: width,
    height: height,
  },
  gradient: {
    position: 'absolute',
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: 18,
  },
  slogan: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});