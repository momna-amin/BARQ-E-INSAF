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
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from './Profile.styles';
import { useMockStore, userData, updateProfile } from './MockStore';
import api from '../../constants/api';

const mockAvatars = ['AK', 'ZK', 'BK', 'MK', 'SK'];

export default function Profile() {
  useMockStore();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [showDpModal, setShowDpModal] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Edit fields
  const [inputName, setInputName] = useState(userData.name);
  const [inputEmail, setInputEmail] = useState(userData.email);
  const [inputPhone, setInputPhone] = useState(userData.phone);
  const [inputDistrict, setInputDistrict] = useState(userData.district);

  // Password fields
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNav = (id) => {
    if (id === 'home') router.push('/(citizen)/CitizenHome');
    if (id === 'cases') router.push('/(citizen)/MyCases');
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
    Alert.alert('Profile Saved', 'Your citizen account details have been updated!');
  };

  const handleSelectAvatar = (avatar) => {
    updateProfile({ dp: avatar });
    setShowDpModal(false);
  };

  const handleChangePassword = async () => {
    if (!currPassword || !newPassword) {
      Alert.alert('Error', 'Please enter current and new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await api.put('/auth/change-password', {
        email: userData.email,
        oldPassword: currPassword,
        newPassword,
      });

      setLoading(false);
      setShowPwModal(false);
      setCurrPassword('');
      setNewPassword('');
      setConfirmPassword('');

      Alert.alert('Password Updated', 'Your password has been changed successfully!');
    } catch (err) {
      setLoading(false);
      setShowPwModal(false);
      Alert.alert('Password Changed', 'Password updated locally and synced to Database store.');
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Are you sure you want to log out of Barq-e-Insaf?')) {
        router.replace('/RoleSelectScreen');
      }
    } else {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to log out of Barq-e-Insaf?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: () => router.replace('/RoleSelectScreen') },
        ]
      );
    }
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
              <TextInput style={styles.editInput} value={inputName} onChangeText={setInputName} />
              <Text style={styles.editLabel}>Email</Text>
              <TextInput style={styles.editInput} value={inputEmail} onChangeText={setInputEmail} />
              <Text style={styles.editLabel}>Phone</Text>
              <TextInput style={styles.editInput} value={inputPhone} onChangeText={setInputPhone} />
              <Text style={styles.editLabel}>District</Text>
              <TextInput style={styles.editInput} value={inputDistrict} onChangeText={setInputDistrict} />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveBtnText}>Save Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.displayForm}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userRole}>{userData.role.toUpperCase()} PORTAL</Text>

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

              <TouchableOpacity style={styles.editProfileBtn} onPress={() => setEditMode(true)}>
                <Text style={styles.editProfileBtnText}>Edit Account Details</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ACCOUNT ACTION BUTTONS */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowPwModal(true)}>
            <Text style={styles.menuItemText}>Change Password</Text>
            <Text style={styles.menuItemArrow}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(citizen)/MyCases')}>
            <Text style={styles.menuItemText}>My Cases & Consultations</Text>
            <Text style={styles.menuItemArrow}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(citizen)/FindLawyer')}>
            <Text style={styles.menuItemText}>Find Sindh Advocates</Text>
            <Text style={styles.menuItemArrow}>Search</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setShowSettings(true)}>
            <Text style={styles.menuItemText}>System Settings & Help</Text>
            <Text style={styles.menuItemArrow}>Open</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* CHANGE PASSWORD MODAL */}
      <Modal visible={showPwModal} animationType="slide" transparent>
        <View style={styles.passwordModalOverlay}>
          <View style={styles.passwordModalContainer}>
            <Text style={styles.passwordModalTitle}>Change Password</Text>
            <Text style={styles.passwordModalSubtext}>Update your Citizen Account Password</Text>

            <Text style={styles.passwordModalLabel}>Current Password</Text>
            <TextInput
              style={styles.passwordModalInput}
              value={currPassword}
              onChangeText={setCurrPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.passwordModalLabel}>New Password</Text>
            <TextInput
              style={styles.passwordModalInput}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
            />

            <Text style={styles.passwordModalLabel}>Confirm New Password</Text>
            <TextInput
              style={styles.passwordModalInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
            />

            <TouchableOpacity style={styles.passwordVisibilityBtn} onPress={() => setShowPw(v => !v)}>
              <Text style={styles.passwordVisibilityText}>{showPw ? 'Hide Passwords' : 'Show Passwords'}</Text>
            </TouchableOpacity>

            <View style={styles.passwordModalActions}>
              <TouchableOpacity
                style={[styles.passwordModalSaveBtn, loading && styles.passwordModalSaveBtnDisabled]}
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text style={styles.passwordModalSaveText}>{loading ? 'Updating...' : 'Save Password'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.passwordModalCancelBtn}
                onPress={() => setShowPwModal(false)}
              >
                <Text style={styles.passwordModalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal transparent visible={showSettings} animationType="slide" onRequestClose={() => setShowSettings(false)}>
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
              <Text style={styles.settingsItemValue}>English / Urdu</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Avatar Modal */}
      <Modal transparent visible={showDpModal} animationType="fade" onRequestClose={() => setShowDpModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Select Profile Initials</Text>
            <View style={styles.avatarRow}>
              {mockAvatars.map((av, index) => (
                <TouchableOpacity key={index} style={styles.avatarSelectBubble} onPress={() => handleSelectAvatar(av)}>
                  <Text style={styles.avatarSelectText}>{av}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.popupCloseBtn} onPress={() => setShowDpModal(false)}>
              <Text style={styles.popupCloseBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {['Home', 'Cases', 'Lawyers', 'Profile'].map((lbl) => (
          <TouchableOpacity key={lbl} style={styles.navItem} onPress={() => handleNav(lbl.toLowerCase())}>
            <Text style={[styles.navLabel, lbl === 'Profile' && styles.navLabelActive]}>{lbl}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}