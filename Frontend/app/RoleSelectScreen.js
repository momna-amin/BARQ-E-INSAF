import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, RacingSansOne_400Regular } from '@expo-google-fonts/racing-sans-one';

const { width, height } = Dimensions.get('window');

const roles = [
  {
    id: 'citizen',
    label: 'Citizen',
    subtitle: 'File cases & find lawyers',
    accentColor: '#f87171',
    accentLight: 'rgba(248,113,113,0.12)',
    accentBorder: 'rgba(248,113,113,0.22)',
    icon: require('../assets/images/img1.png'),
  },
  {
    id: 'lawyer',
    label: 'Lawyer',
    subtitle: 'Manage cases & clients',
    accentColor: '#60a5fa',
    accentLight: 'rgba(96,165,250,0.12)',
    accentBorder: 'rgba(96,165,250,0.22)',
    icon: require('../assets/images/img1.png'),
  },
  {
    id: 'ngo',
    label: 'NGO / Media',
    subtitle: 'Analytics & reporting',
    accentColor: '#4ade80',
    accentLight: 'rgba(74,222,128,0.12)',
    accentBorder: 'rgba(74,222,128,0.22)',
    icon: require('../assets/images/img1.png'),
  },
  {
    id: 'admin',
    label: 'Admin',
    subtitle: 'Platform management',
    accentColor: '#cbd5e1',
    accentLight: 'rgba(203,213,225,0.08)',
    accentBorder: 'rgba(203,213,225,0.15)',
    icon: require('../assets/images/img1.png'),
  },
];

export default function RoleSelectScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ RacingSansOne_400Regular });

  const handleSelect = (roleId) => {
    router.push({ pathname: '/LoginScreen', params: { role: roleId } });
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#07152e" />

      {/* Background — matches StartScreen exactly */}
      <LinearGradient
        colors={['#14557a', '#040808', '#141363', '#180669']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Ambient blobs — same as StartScreen */}
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
        top: height * 0.45, left: width * 0.1,
        width: width * 0.4, height: width * 0.4,
        backgroundColor: 'rgba(14,165,233,0.05)',
        borderRadius: width * 0.22,
      }]} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={[
            styles.headerTitle,
            fontsLoaded
              ? { fontFamily: 'RacingSansOne_400Regular' }
              : { fontFamily: 'System' },
          ]}>
            Barq-e-Insaf
          </Text>
        </View>
        <Text style={styles.headerSub}>Select your role to continue</Text>
      </View>

      {/* Role cards */}
      <View style={styles.rolesContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            onPress={() => handleSelect(role.id)}
            activeOpacity={0.88}
            style={styles.cardTouch}
          >
            <View style={[styles.roleCard, { borderColor: role.accentBorder }]}>

              {/* Left accent bar */}
              <View style={[styles.accentBar, { backgroundColor: role.accentColor }]} />

              {/* Icon */}
              <View style={[styles.iconWrap, { backgroundColor: role.accentLight }]}>
                <Image
                  source={role.icon}
                  style={[styles.roleIcon, { tintColor: role.accentColor }]}
                  resizeMode="contain"
                />
              </View>

              {/* Text */}
              <View style={styles.roleText}>
                <Text style={styles.roleLabel}>{role.label}</Text>
                <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
              </View>

              {/* Arrow */}
              <LinearGradient
                colors={['#0232b6', '#2563eb', '#5694f8']}
                style={styles.arrowBox}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.arrowText}>ᯓ➤</Text>
              </LinearGradient>

            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Legal assistance for Sindh · English · Urdu · Sindhi
        </Text>
      </View>

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#092d70',
  },
  backgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  ambientBlob: {
    position: 'absolute',
    zIndex: 0,
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    zIndex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  logoImage: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  headerTitle: {
    fontSize: 26,
    color: '#fff',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
    marginLeft: 40,
  },

  // Cards
  rolesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 11,
    justifyContent: 'center',
    zIndex: 1,
  },
  cardTouch: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 16,
    paddingRight: 14,
    paddingLeft: 0,
    gap: 14,
    overflow: 'hidden',
  },

  // Left bar
  accentBar: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginRight: 2,
  },

  // Icon
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleIcon: {
    width: 22,
    height: 22,
  },

  // Text
  roleText: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.2,
  },
  roleSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.38)',
    marginTop: 3,
    fontWeight: '500',
  },

  // Arrow — blue gradient pill matching GET STARTED button
  arrowBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    alignItems: 'center',
    zIndex: 1,
  },
  footerText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.2)',
    fontWeight: '500',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});