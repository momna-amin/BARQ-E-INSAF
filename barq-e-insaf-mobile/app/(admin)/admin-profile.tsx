import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { User, Shield, Key, Mail, Clock, Check } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStore } from '@/lib/store';
import { timeAgo } from '@/lib/utils';

export default function AdminProfileScreen() {
  const { adminUsers, updateAdmin } = useStore();
  const admin = adminUsers[0]; // Single admin only

  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPw, setEditingPw] = useState(false);
  const [name, setName] = useState(admin.name);
  const [email, setEmail] = useState(admin.email);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  function saveName() {
    if (!name.trim()) return;
    updateAdmin(admin.id, { name: name.trim() });
    setEditingName(false);
    Alert.alert('Success', 'Name updated successfully');
  }

  function saveEmail() {
    if (!email.trim() || !email.includes('@')) return;
    updateAdmin(admin.id, { email: email.trim() });
    setEditingEmail(false);
    Alert.alert('Success', 'Email updated successfully');
  }

  function savePassword() {
    if (currentPw !== 'Admin@123') {
      Alert.alert('Error', 'Current password is incorrect');
      return;
    }
    if (newPw.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setEditingPw(false);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    Alert.alert('Success', 'Password changed successfully');
  }

  function toggle2FA() {
    const newVal = !admin.twoFA;
    updateAdmin(admin.id, { twoFA: newVal });
    Alert.alert('2FA ' + (newVal ? 'Enabled' : 'Disabled'), newVal ? 'Two-factor authentication is now active.' : 'Two-factor authentication has been disabled.');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Admin Profile</Text>
      <Text style={styles.subtitle}>Single administrator account</Text>

      {/* Profile Card */}
      <GlassCard style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{admin.name.charAt(0)}{admin.name.split(' ')[1]?.charAt(0) || ''}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminName}>{admin.name}</Text>
            <Text style={styles.adminEmail}>{admin.email}</Text>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>{admin.status}</Text>
            </View>
          </View>
        </View>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Last Login</Text>
            <Text style={styles.infoValue}>{timeAgo(admin.lastLogin)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>2FA Status</Text>
            <Text style={[styles.infoValue, { color: admin.twoFA ? Colors.green : Colors.red }]}>
              {admin.twoFA ? '✓ Enabled' : 'Disabled'}
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* Edit Name */}
      <GlassCard style={styles.section}>
        <View style={styles.sectionHeader}>
          <User size={16} color={Colors.glow} />
          <Text style={styles.sectionTitle}>Name</Text>
          {!editingName && (
            <TouchableOpacity onPress={() => setEditingName(true)} style={styles.editLink}>
              <Text style={styles.editLinkText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        {editingName ? (
          <View>
            <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor={Colors.textGhost} />
            <View style={styles.editActions}>
              <TouchableOpacity onPress={saveName} style={styles.saveBtn}>
                <Check size={14} color="#fff" />
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setEditingName(false); setName(admin.name); }} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.fieldValue}>{admin.name}</Text>
        )}
      </GlassCard>

      {/* Edit Email */}
      <GlassCard style={styles.section}>
        <View style={styles.sectionHeader}>
          <Mail size={16} color={Colors.glow} />
          <Text style={styles.sectionTitle}>Email</Text>
          {!editingEmail && (
            <TouchableOpacity onPress={() => setEditingEmail(true)} style={styles.editLink}>
              <Text style={styles.editLinkText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        {editingEmail ? (
          <View>
            <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={Colors.textGhost} />
            <View style={styles.editActions}>
              <TouchableOpacity onPress={saveEmail} style={styles.saveBtn}>
                <Check size={14} color="#fff" />
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setEditingEmail(false); setEmail(admin.email); }} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.fieldValue}>{admin.email}</Text>
        )}
      </GlassCard>

      {/* Change Password */}
      <GlassCard style={styles.section}>
        <View style={styles.sectionHeader}>
          <Key size={16} color={Colors.glow} />
          <Text style={styles.sectionTitle}>Password</Text>
          {!editingPw && (
            <TouchableOpacity onPress={() => setEditingPw(true)} style={styles.editLink}>
              <Text style={styles.editLinkText}>Change</Text>
            </TouchableOpacity>
          )}
        </View>
        {editingPw ? (
          <View>
            <Text style={styles.inputLabel}>Current Password</Text>
            <TextInput value={currentPw} onChangeText={setCurrentPw} secureTextEntry style={styles.input} placeholder="Enter current password" placeholderTextColor={Colors.textGhost} />
            <Text style={styles.inputLabel}>New Password</Text>
            <TextInput value={newPw} onChangeText={setNewPw} secureTextEntry style={styles.input} placeholder="Enter new password" placeholderTextColor={Colors.textGhost} />
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput value={confirmPw} onChangeText={setConfirmPw} secureTextEntry style={styles.input} placeholder="Re-enter new password" placeholderTextColor={Colors.textGhost} />
            <View style={styles.editActions}>
              <TouchableOpacity onPress={savePassword} style={styles.saveBtn}>
                <Check size={14} color="#fff" />
                <Text style={styles.saveBtnText}>Update Password</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setEditingPw(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.fieldValue}>••••••••</Text>
        )}
      </GlassCard>

      {/* 2FA Toggle */}
      <GlassCard style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={16} color={Colors.glow} />
          <Text style={styles.sectionTitle}>Two-Factor Authentication</Text>
        </View>
        <Text style={styles.fieldDesc}>Add an extra layer of security to your account</Text>
        <TouchableOpacity onPress={toggle2FA} style={[styles.toggleBtn, admin.twoFA ? styles.toggleBtnOn : styles.toggleBtnOff]}>
          <Text style={styles.toggleBtnText}>{admin.twoFA ? 'Disable 2FA' : 'Enable 2FA'}</Text>
        </TouchableOpacity>
      </GlassCard>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: Colors.textDim, marginTop: 2, marginBottom: 16 },
  profileCard: { marginBottom: 12 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.brand, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  adminName: { fontSize: 18, fontWeight: '700', color: '#fff' },
  adminEmail: { fontSize: 13, color: Colors.textDimmer, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.green },
  statusText: { fontSize: 11, color: Colors.green, fontWeight: '600' },
  infoGrid: { flexDirection: 'row', gap: 16 },
  infoItem: { flex: 1 },
  infoLabel: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  infoValue: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  section: { marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: '#fff' },
  editLink: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: Colors.cyanDim },
  editLinkText: { fontSize: 11, color: Colors.glow, fontWeight: '600' },
  fieldValue: { fontSize: 14, color: Colors.textMuted },
  fieldDesc: { fontSize: 12, color: Colors.textDim, marginBottom: 10 },
  inputLabel: { fontSize: 10, color: Colors.textDim, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#fff' },
  editActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#059669', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  saveBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)' },
  cancelBtnText: { fontSize: 13, color: Colors.textDim },
  toggleBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, alignSelf: 'flex-start' },
  toggleBtnOn: { backgroundColor: Colors.redDim },
  toggleBtnOff: { backgroundColor: Colors.emeraldDim },
  toggleBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});
