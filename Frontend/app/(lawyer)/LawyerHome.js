import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './LawyerHome.styles';

const newRequests = [
  { name: 'Ahmed K. — Property', desc: 'Land dispute in Hyderabad — 2 documents attached' },
  { name: 'Zara M. — Family',    desc: 'Custody case — Karachi courts' },
];

const pipeline = [
  { dot: '#3b82f6', title: 'Raza vs. Malik — Property', sub: 'Hearing: 22 Apr · Civil Court Karachi', badge: 'Hearing', style: 'badgeBlue'  },
  { dot: '#f59e0b', title: 'Khan Divorce Settlement',   sub: 'Docs needed · 3 evidence files',        badge: 'Docs',    style: 'badgeAmber' },
  { dot: '#4ade80', title: 'Memon Inheritance — Sukkur',sub: 'Evidence submitted · Awaiting date',     badge: 'Active',  style: 'badgeGreen' },
];

const quickActions = [
  { icon: '📨', title: 'Case Requests', sub: '3 new requests',   route: '/(lawyer)/CaseRequests' },
  { icon: '📅', title: 'My Schedule',   sub: '2 hearings today', route: '/(lawyer)/Schedule'     },
  { icon: '📁', title: 'My Cases',      sub: 'View & manage',    route: '/(lawyer)/MyCases'      },
  { icon: '💰', title: 'Earnings',      sub: 'View statements',  route: '/(lawyer)/Earnings'     },
];

const navItems = [
  { id: 'home',     icon: '📊', label: 'Dashboard', route: null                      },
  { id: 'requests', icon: '📨', label: 'Requests',  route: '/(lawyer)/CaseRequests'  },
  { id: 'cases',    icon: '📁', label: 'Cases',     route: '/(lawyer)/MyCases'       },
  { id: 'schedule', icon: '📅', label: 'Schedule',  route: '/(lawyer)/Schedule'      },
  { id: 'earnings', icon: '💰', label: 'Earnings',  route: '/(lawyer)/Earnings'      },
];

export default function LawyerHome() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('home');

  const handleNav = (item) => {
    setActiveNav(item.id);
    if (item.route) router.push(item.route);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.brand}>
            <Text style={styles.brandName}>Barq-e-Insaf ⚡</Text>
            <Text style={styles.brandSub}>Lawyer Portal</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn}>
              <Text style={styles.notifIcon}>🔔</Text>
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SR</Text>
            </View>
          </View>
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.lawyerName}>Sara Raza — Advocate, SBC #4421</Text>
          <Text style={styles.stars}>★★★★★</Text>
          <View style={styles.verifiedPill}>
            <Text style={styles.verifiedText}>✓ SBC Verified</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>Active Cases</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>3</Text>
            <Text style={styles.statLabel}>New Requests</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statNum}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── NEW CLIENT REQUESTS ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionLabel, { marginTop: 0, marginBottom: 0 }]}>
            New Client Requests
          </Text>
          <TouchableOpacity onPress={() => router.push('/(lawyer)/CaseRequests')}>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>

        {newRequests.map((r, i) => (
          <TouchableOpacity
            key={i}
            style={styles.reqCard}
            onPress={() => router.push('/(lawyer)/CaseRequests')}
          >
            <View style={styles.reqTop}>
              <Text style={styles.reqName}>{r.name}</Text>
              <Text style={styles.badgeNew}>New</Text>
            </View>
            <Text style={styles.reqDesc}>{r.desc}</Text>
          </TouchableOpacity>
        ))}

        {/* ── CASE PIPELINE ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionLabel, { marginTop: 0, marginBottom: 0 }]}>
            Case Pipeline
          </Text>
          <TouchableOpacity onPress={() => router.push('/(lawyer)/MyCases')}>
            <Text style={styles.seeAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        {pipeline.map((p, i) => (
          <TouchableOpacity
            key={i}
            style={styles.pipeItem}
            onPress={() => router.push('/(lawyer)/MyCases')}
          >
            <View style={styles.pipeTop}>
              <View style={styles.pipeLeft}>
                <View style={[styles.pipeDot, { backgroundColor: p.dot }]} />
                <Text style={styles.pipeTitle}>{p.title}</Text>
              </View>
              <Text style={[styles.statusBadge, styles[p.style]]}>{p.badge}</Text>
            </View>
            <Text style={styles.pipeSub}>{p.sub}</Text>
          </TouchableOpacity>
        ))}

        {/* ── QUICK ACTIONS ── */}
        <Text style={styles.sectionLabel}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {quickActions.map((q, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickCard}
              onPress={() => router.push(q.route)}
            >
              <Text style={styles.quickIcon}>{q.icon}</Text>
              <Text style={styles.quickTitle}>{q.title}</Text>
              <Text style={styles.quickSub}>{q.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => handleNav(item)}
          >
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[
              styles.navLabel,
              activeNav === item.id && styles.navLabelActive,
            ]}>
              {item.label}
            </Text>
            {activeNav === item.id && <View style={styles.navActiveDot} />}
          </TouchableOpacity>
        ))}
      </View>

    </SafeAreaView>
  );
}