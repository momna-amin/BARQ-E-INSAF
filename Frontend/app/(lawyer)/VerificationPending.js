import React from 'react';
// Import layout components from React Native:
// View: acts like a division/box (similar to <div> in web)
// Text: acts like a text container (similar to <p> or <span> in web)
// StyleSheet: styling helper (similar to CSS in web)
// SafeAreaView: prevents content from rendering behind notches/camera holes on phones
// TouchableOpacity: a clickable button that fades slightly when pressed
// StatusBar: controls the top battery/network bar colors
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router'; // Routing helper

export default function VerificationPending() {
  const router = useRouter(); // Initialize router to change screens

  return (
    <SafeAreaView style={styles.container}>
      {/* Configure phone status bar style */}
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />
      
      {/* Box container holding the text cards */}
      <View style={styles.content}>
        <Text style={styles.badge}>🛡️</Text> {/* Emoji badge */}
        <Text style={styles.title}>Account Under Verification</Text>
        <Text style={styles.desc}>
          Thank you for registering on Barq-e-Insaf. We have received your Sindh Bar Council license credentials.
        </Text>
        <Text style={styles.desc}>
          Our administration team is currently validating your registration details. This process typically takes 12-24 hours. You will receive a notification once verified.
        </Text>
        
        {/* Clickable button that redirects the user back to role selection screen */}
        <TouchableOpacity style={styles.btn} onPress={() => router.replace('/RoleSelectScreen')}>
          <Text style={styles.btnText}>Go Back to Roles</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styling definitions (Stylesheets are similar to CSS)
const styles = StyleSheet.create({
  container: {
    flex: 1, // Tells container to fill the entire height/width of screen
    backgroundColor: '#0F2744', // Dark Navy Blue background
    justifyContent: 'center', // Centers contents vertically
    padding: 24, // Generates padding margins around page edges
  },
  content: {
    backgroundColor: '#fff', // White card panel
    borderRadius: 24, // Rounded corners
    padding: 30, // Spacing inside card
    alignItems: 'center', // Centers child items horizontally
    shadowColor: '#000', // Shadows configuration
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8, // Shadows for Android
  },
  badge: {
    fontSize: 72, // Large emoji size
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800', // Heavy Bold font
    color: '#0F2744',
    textAlign: 'center',
    marginBottom: 16,
  },
  desc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20, // Line heights (spacing between lines of text)
    marginBottom: 16,
  },
  btn: {
    backgroundColor: '#0F2744',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});