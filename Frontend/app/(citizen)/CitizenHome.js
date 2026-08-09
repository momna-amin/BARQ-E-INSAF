import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './CitizenHome.styles';

const lawyers = [
  { initials: 'SR', name: 'Sara Raza',  spec: 'Property', color: '#5C1A1A' },
  { initials: 'MK', name: 'M. Karim',   spec: 'Family',   color: '#0F2744' },
  { initials: 'FA', name: 'Fatima A.',  spec: 'Civil',    color: '#1B4332' },
  { initials: 'ZH', name: 'Z. Hassan',  spec: 'Inherit.', color: '#4a148c' },
];

const activeCases = [
  { dot: '#4ade80', title: 'Property Dispute — Hyderabad', sub: 'Lawyer: Sara Raza · Updated 2h ago',    badge: 'Active',  badgeStyle: 'badgeGreen' },
  { dot: '#f59e0b', title: 'Inheritance Claim — Karachi',  sub: 'Lawyer: M. Karim · Hearing pending',    badge: 'Pending', badgeStyle: 'badgeAmber' },
];

const navItems = [
  { id: 'home',     icon: '🏠', label: 'Home'    },
  { id: 'chat',     icon: '💬', label: 'Chat'    },
  { id: 'cases',    icon: '📁', label: 'Cases'   },
  { id: 'lawyers',  icon: '⚖️', label: 'Lawyers' },
  { id: 'profile',  icon: '👤', label: 'Profile' },
];

export default function CitizenHome() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('home');
  const [showCasePopup, setShowCasePopup] = useState(false);

  const handleNav = (id) => {
    setActiveNav(id);
    if (id === 'cases')   router.push('/(citizen)/MyCases');
    if (id === 'lawyers') router.push('/(citizen)/FindLawyer');
    if (id === 'evidence')router.push('/(citizen)/Evidence');
    if (id === 'home')    router.push('/(citizen)/CitizenHome');
    if (id === 'chat')    router.push('/(citizen)/Chat');
    if (id === 'profile') router.push('/(citizen)/Profile');
  };

  const handleBuildCase = () => {
    setShowCasePopup(true);
  };

  const handleCaseTypeSelect = (type) => {
    setShowCasePopup(false);
    router.push({
      pathname: '/(citizen)/CaseForm',
      params: { caseType: type }
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5C1A1A" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.brand}>
            <Text style={styles.brandName}>Barq-e-Insaf ⚡</Text>
            <Text style={styles.brandSub}>Lightning Justice</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn}>
              <Text style={styles.notifIcon}>🔔</Text>
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AK</Text>
            </View>
          </View>
        </View>

        <Text style={styles.greeting}>Asalam-u-Alaikum, Ahmed 👋</Text>

      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* BUILD A CASE BUTTON */}
        <TouchableOpacity style={styles.buildCaseBtn} onPress={handleBuildCase}>
          <Text style={styles.buildCaseBtnText}>⚡ Build a Case</Text>
        </TouchableOpacity>

        {/* VERIFIED LAWYERS */}
        <Text style={styles.sectionLabel}>Verified Lawyers Near You</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.lawyerRow}
        >
          {lawyers.map((l, i) => (
            <TouchableOpacity key={i} style={styles.lawyerBubble}>
              <View style={[styles.lawyerAvatar, { backgroundColor: l.color }]}>
                <Text style={styles.lawyerAvatarText}>{l.initials}</Text>
              </View>
              <Text style={styles.lawyerName}>{l.name}</Text>
              <Text style={styles.lawyerSpec}>{l.spec}</Text>
              <Text style={styles.sbcBadge}>✓ SBC</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ACTIVE CASES */}
        <Text style={styles.sectionLabel}>My Active Cases</Text>
        {activeCases.map((c, i) => (
          <TouchableOpacity
            key={i}
            style={styles.caseItem}
            onPress={() => router.push('/(citizen)/MyCases')}
          >
            <View style={[styles.caseDot, { backgroundColor: c.dot }]} />
            <View style={styles.caseInfo}>
              <Text style={styles.caseTitle}>{c.title}</Text>
              <Text style={styles.caseSub}>{c.sub}</Text>
            </View>
            <Text style={[styles.badge, styles[c.badgeStyle]]}>{c.badge}</Text>
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => handleNav(item.id)}
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

      {/* CASE TYPE POPUP */}
      <Modal
        transparent={true}
        visible={showCasePopup}
        animationType="fade"
        onRequestClose={() => setShowCasePopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Choose Case Type</Text>
            <Text style={styles.popupSubtitle}>
              Select the type of case you want to build. Each type has specific requirements and documentation needs.
            </Text>
            
            <TouchableOpacity 
              style={styles.caseTypeOption}
              onPress={() => handleCaseTypeSelect('property')}
            >
              <Text style={styles.caseTypeIcon}>🏠</Text>
              <View style={styles.caseTypeInfo}>
                <Text style={styles.caseTypeTitle}>Property Dispute</Text>
                <Text style={styles.caseTypeDesc}>
                  For issues related to property ownership, inheritance, tenant disputes, and land matters
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.caseTypeOption}
              onPress={() => handleCaseTypeSelect('family')}
            >
              <Text style={styles.caseTypeIcon}>👨‍👩‍👧</Text>
              <View style={styles.caseTypeInfo}>
                <Text style={styles.caseTypeTitle}>Family Case</Text>
                <Text style={styles.caseTypeDesc}>
                  For divorce proceedings, child custody, maintenance, and other family law matters
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.caseTypeOption}
              onPress={() => handleCaseTypeSelect('civil')}
            >
              <Text style={styles.caseTypeIcon}>⚖️</Text>
              <View style={styles.caseTypeInfo}>
                <Text style={styles.caseTypeTitle}>Civil Case</Text>
                <Text style={styles.caseTypeDesc}>
                  For civil matters including contract disputes, property rights, and other civil claims
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.popupCloseBtn}
              onPress={() => setShowCasePopup(false)}
            >
              <Text style={styles.popupCloseBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}