import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './CaseRequests.styles';

const requests = [
  { name: 'Ahmed K. — Property',  location: 'Hyderabad', time: '2 hours ago', desc: 'Land dispute — boundary wall conflict with neighbor', attachments: ['Land deed.pdf', 'Photos (4)'] },
  { name: 'Zara M. — Family',     location: 'Karachi',    time: '5 hours ago', desc: 'Custody case — seeking representation for hearing', attachments: ['Marriage cert.pdf'] },
  { name: 'Bilal S. — Property',  location: 'Sukkur',     time: '1 day ago',   desc: 'Inheritance share dispute among siblings', attachments: ['Will copy.pdf', 'ID cards (3)'] },
];

export default function CaseRequests() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Case Requests</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {requests.map((r, i) => (
          <View key={i} style={styles.reqCard}>
            <View style={styles.reqTop}>
              <Text style={styles.reqName}>{r.name}</Text>
              <Text style={styles.badgeNew}>New</Text>
            </View>
            <Text style={styles.reqMeta}>📍 {r.location} · {r.time}</Text>
            <Text style={styles.reqMeta}>{r.desc}</Text>
            <View style={styles.attachRow}>
              {r.attachments.map((a, j) => (
                <View key={j} style={styles.attachPill}>
                  <Text style={styles.attachText}>📎 {a}</Text>
                </View>
              ))}
            </View>
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.acceptBtn}>
                <Text style={styles.acceptText}>Accept Case</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.declineBtn}>
                <Text style={styles.declineText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}