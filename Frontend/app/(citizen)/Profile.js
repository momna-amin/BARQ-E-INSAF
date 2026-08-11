import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './Profile.styles';
import { useMockStore, userData, updateProfile } from './MockStore';

const mockAvatars = ['AK', 'ZK', 'BK', 'MK', 'SK'];

export default function Profile() {
  useMockStore();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [showDpModal, setShowDpModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [inputName, setInputName] = useState(userData.name);
  const [inputEmail, setInputEmail] = useState(userData.email);
  const [inputPhone, setInputPhone] = useState(userData.phone);
  const [inputDistrict, setInputDistrict] = useState(userData.district);

  const handleNav = (id) => {
    if (id === 'home')    router.push('/(citizen)/CitizenHome');
    if (id === 'cases')   router.push('/(citizen)/MyCases');
    if (id === 'lawyers') router.push('/(citizen)/FindLawyer');
    if (id === 'profile') router.push('/(citizen)/Profile');
  };

  const handleSaveProfile = () => {
    updateProfile({
      name: inputName,
      email: inputEmail,
      phone: inputPhone,
      district: inputDistrict,
    });
    setEditMode(false);
  };

  const handleSelectAvatar = (avatar) => {
    updateProfile({ dp: avatar });
    setShowDpModal(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5C1A1A" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>BI</Text>
          </View>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{userData.dp}</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn} onPress={() => setShowDpModal(true)}>
              <Text style={styles.editAvatarText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {editMode ? (
            <View style={styles.editForm}>
              <Text style={styles.editLabel}>Name</Text>
              <TextInput
                style={styles.editInput}
                value={inputName}
                onChangeText={setInputName}
              />
              <Text style={styles.editLabel}>Email</Text>
              <TextInput
                style={styles.editInput}
                value={inputEmail}
                onChangeText={setInputEmail}
              />
              <Text style={styles.editLabel}>Phone</Text>
              <TextInput
                style={styles.editInput}
                value={inputPhone}
                onChangeText={setInputPhone}
              />
              <Text style={styles.editLabel}>District</Text>
              <TextInput
                style={styles.editInput}
                value={inputDistrict}
                onChangeText={setInputDistrict}
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveBtnText}>Save Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.displayForm}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userRole}>{userData.role}</Text>

              <View style={styles.infoGrid}>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoGridLabel}>Email</Text>
                  <Text style={styles.infoGridValue}>{userData.email}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoGridLabel}>Phone</Text>
                  <Text style={styles.infoGridValue}>{userData.phone}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoGridLabel}>CNIC</Text>
                  <Text style={styles.infoGridValue}>{userData.cnic}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoGridLabel}>District</Text>
                  <Text style={styles.infoGridValue}>{userData.district}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoGridLabel}>Member Since</Text>
                  <Text style={styles.infoGridValue}>{userData.joinedDate}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.editProfileBtn}
                onPress={() => setEditMode(true)}
              >
                <Text style={styles.editProfileBtnText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/(citizen)/MyCases')}
          >
            <Text style={styles.menuItemText}>My Cases</Text>
            <Text style={styles.menuItemArrow}>View</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/(citizen)/FindLawyer')}
          >
            <Text style={styles.menuItemText}>Find Lawyers</Text>
            <Text style={styles.menuItemArrow}>Search</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setShowSettings(true)}
          >
            <Text style={styles.menuItemText}>Settings</Text>
            <Text style={styles.menuItemArrow}>Open</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        transparent={true}
        visible={showSettings}
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsContainer}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Text style={styles.settingsClose}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingsItem}>
              <Text style={styles.settingsItemLabel}>Notifications</Text>
              <Text style={styles.settingsItemValue}>Enabled</Text>
            </View>
            <View style={styles.settingsItem}>
              <Text style={styles.settingsItemLabel}>Language</Text>
              <Text style={styles.settingsItemValue}>English</Text>
            </View>
            <View style={[styles.settingsItem, styles.settingsItemLast]}>
              <Text style={styles.settingsItemLabel}>Help and Support</Text>
              <Text style={styles.settingsItemValue}>Open</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Avatar Change Modal */}
      <Modal
        transparent={true}
        visible={showDpModal}
        animationType="fade"
        onRequestClose={() => setShowDpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Select Profile Initials</Text>
            <View style={styles.avatarRow}>
              {mockAvatars.map((av, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.avatarSelectBubble}
                  onPress={() => handleSelectAvatar(av)}
                >
                  <Text style={styles.avatarSelectText}>{av}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              style={styles.popupCloseBtn}
              onPress={() => setShowDpModal(false)}
            >
              <Text style={styles.popupCloseBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {['Home', 'Cases', 'Lawyers', 'Profile'].map((lbl) => (
          <TouchableOpacity
            key={lbl}
            style={styles.navItem}
            onPress={() => handleNav(lbl.toLowerCase())}
          >
            <Text style={[styles.navLabel, lbl === 'Profile' && styles.navLabelActive]}>{lbl}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}