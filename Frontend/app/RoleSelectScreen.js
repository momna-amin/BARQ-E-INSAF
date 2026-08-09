import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

const roles = [
  {
    id: 'citizen',
    label: 'Citizen',
    subtitle: 'File cases & find lawyers',
    color: '#5C1A1A',
    emoji: '👤',
  },
  {
    id: 'lawyer',
    label: 'Lawyer',
    subtitle: 'Manage cases & clients',
    color: '#0F2744',
    emoji: '⚖️',
  },
  {
    id: 'ngo',
    label: 'NGO / Media',
    subtitle: 'Analytics & reporting',
    color: '#1B4332',
    emoji: '📊',
  },
  {
    id: 'admin',
    label: 'Admin',
    subtitle: 'Platform management',
    color: '#1A0533',
    emoji: '🛡️',
  },
];

export default function RoleSelectScreen() {
  const router = useRouter();

  const handleSelect = (roleId) => {
    router.push({ pathname: '/LoginScreen', params: { role: roleId } });
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Barq-e-Insaf ⚡</Text>
        <Text style={styles.headerSub}>Select your role to continue</Text>
      </View>

      <View style={styles.rolesContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[styles.roleCard, { backgroundColor: role.color }]}
            onPress={() => handleSelect(role.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.roleEmoji}>{role.emoji}</Text>
            <View style={styles.roleText}>
              <Text style={styles.roleLabel}>{role.label}</Text>
              <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3EF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  rolesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 12,
  },
  roleCard: {
    flex: 1,
    borderRadius: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    maxHeight: 110,
  },
  roleEmoji: {
    fontSize: 32,
  },
  roleText: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.3,
  },
  roleSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 3,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 28,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '300',
  },
});