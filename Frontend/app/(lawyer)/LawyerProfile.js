import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Switch, 
  SafeAreaView, 
  StatusBar,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import showAlert from '../../utils/showAlert';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import { clearTokens, getUser, saveUser } from '../../services/authStorage';

export default function LawyerProfile() {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [showDPMenu, setShowDPMenu] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  
  // Real User State
  const [realUser, setRealUser] = useState({ name: 'Lawyer', email: '', phone: '', district: '', cnic: '', role: 'lawyer', joinedDate: 'Recently', dp: 'L' });

  // Local state for editing
  const [editedData, setEditedData] = useState({
    name: '',
    spec: '',
    address: '',
    bio: '',
    email: '',
    phone: '',
    district: '',
    isAvailable: true,
    experience: '',
    education: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const stored = await getUser();
        if (stored) {
          setRealUser(prev => ({
            ...prev,
            ...stored,
            dp: (stored.name || 'L').substring(0, 2).toUpperCase()
          }));
          setEditedData(prev => ({
            ...prev,
            name: stored.name || '',
            email: stored.email || ''
          }));
        }

        const res = await api.get('/auth/me');
        if (res?.data) {
          const user = res.data;
          const lp = user.lawyer_profile || {};
          setRealUser({
            ...user,
            dp: (user.name || 'L').substring(0, 2).toUpperCase()
          });
          setEditedData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            district: user.district || '',
            spec: lp.specialty || '',
            address: lp.office_address || '',
            bio: lp.bio || '',
            experience: lp.experience || '5 Years',
            education: lp.education || 'LL.B, University of Karachi',
            isAvailable: lp.is_available !== false
          });
        }
      } catch (err) {
        console.log('Error loading lawyer profile:', err);
      }
    })();
  }, []);

  // Password state
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNav = (lbl) => {
    if (lbl === 'home') router.push('/(lawyer)/LawyerHome');
    if (lbl === 'requests') router.push('/(lawyer)/IncomingRequests');
    if (lbl === 'cases') router.push('/(lawyer)/MyCases');
    if (lbl === 'schedule') router.push('/(lawyer)/Schedule');
    if (lbl === 'profile') router.push('/(lawyer)/LawyerProfile');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await api.put('/auth/profile', {
        name: editedData.name,
        phone: editedData.phone,
        district: editedData.district || 'Karachi',
        specialty: editedData.spec,
        office_address: editedData.address,
        bio: editedData.bio,
      });

      const updated = res.data;
      setRealUser({
        ...updated,
        dp: (updated.name || 'L').substring(0, 2).toUpperCase()
      });

      const stored = await getUser();
      if (stored) {
        await saveUser({ ...stored, name: updated.name });
      }

      setEditMode(false);
      showAlert('Success', 'Lawyer profile details updated!');
    } catch (err) {
      showAlert('Error ⚠️', err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currPassword || !newPassword) {
      showAlert('Error', 'Please enter current and new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert('Error', 'New passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await api.put('/auth/change-password', {
        email: realUser.email,
        oldPassword: currPassword,
        newPassword,
      });

      setLoading(false);
      setShowPwModal(false);
      setCurrPassword('');
      setNewPassword('');
      setConfirmPassword('');

      showAlert('Success', 'Password has been changed successfully!');
    } catch (err) {
      setLoading(false);
      const msg = err?.response?.data?.message || 'Password change nahi ho saka. Dobara koshish karein.';
      showAlert('Password Change Failed ⚠️', msg);
    }
  };

  const doLogout = async () => {
    await clearTokens();
    router.replace('/RoleSelectScreen');
  };

  const handleLogout = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Are you sure you want to log out of Barq-e-Insaf Advocate Portal?')) {
        doLogout();
      }
    } else {
      showAlert(
        'Confirm Logout 🚪',
        'Are you sure you want to log out of Barq-e-Insaf Advocate Portal?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: doLogout },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Advocate Profile</Text>
        <TouchableOpacity style={styles.editToggle} onPress={() => setEditMode(!editMode)}>
          <Text style={styles.editToggleText}>{editMode ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        
        {/* Profile Picture */}
        <View style={styles.profilePicSection}>
          <TouchableOpacity 
            style={styles.profilePicContainer}
            onPress={() => setShowDPMenu(true)}
          >
            {realUser.dp ? (
              <View style={[styles.profilePic, { backgroundColor: '#0F2744' }]}>
                <Text style={styles.profilePicText}>{realUser.dp}</Text>
              </View>
            ) : (
              <View style={[styles.profilePic, { backgroundColor: '#0F2744' }]}>
                <Text style={styles.profilePicText}>L</Text>
              </View>
            )}
            <View style={styles.dpBadge}>
              <Text style={styles.dpBadgeText}>Edit</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{realUser.name}</Text>
          <Text style={styles.profileSpec}>{realUser.lawyer_profile?.specialty || 'General Practice'} · SBC {realUser.lawyer_profile?.sbc_number || 'SBC-Verified'}</Text>
        </View>

        {/* Availability Toggle */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.cardTitle}>Accepting New Clients</Text>
              <Text style={styles.cardSub}>Toggle whether clients can hire you</Text>
            </View>
            <Switch
              value={editMode ? editedData.isAvailable : (realUser.lawyer_profile?.is_available !== false)}
              onValueChange={async (value) => {
                if (editMode) {
                  setEditedData({...editedData, isAvailable: value});
                } else {
                  try {
                    await api.put('/auth/profile', { is_available: value });
                    setRealUser(prev => ({
                      ...prev,
                      lawyer_profile: {
                        ...(prev.lawyer_profile || {}),
                        is_available: value
                      }
                    }));
                  } catch (err) {
                    console.log('Error toggling availability:', err);
                  }
                }
              }}
              trackColor={{ false: '#767577', true: '#1B4332' }}
              thumbColor={editMode ? (editedData.isAvailable ? '#4ade80' : '#f4f3f4') : ((realUser.lawyer_profile?.is_available !== false) ? '#4ade80' : '#f4f3f4')}
            />
          </View>
        </View>

        {/* ACCOUNT SECURITY & ACTION BUTTONS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔑 Security & Account Actions</Text>
          <TouchableOpacity
            style={[styles.actionRowBtn, { backgroundColor: '#0F2744', marginTop: 12 }]}
            onPress={() => setShowPwModal(true)}
          >
            <Text style={styles.actionRowBtnText}>🔑 Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRowBtn, { backgroundColor: '#dc2626', marginTop: 10 }]}
            onPress={handleLogout}
          >
            <Text style={styles.actionRowBtnText}>🚪 Logout Account</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Fields */}
        <Text style={styles.label}>Full Name</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={editedData.name}
            onChangeText={(text) => setEditedData({...editedData, name: text})}
          />
        ) : (
          <View style={styles.detailCard}>
            <Text style={styles.detailValue}>{realUser.name}</Text>
          </View>
        )}

        <Text style={styles.label}>Specialty</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={editedData.spec}
            onChangeText={(text) => setEditedData({...editedData, spec: text})}
          />
        ) : (
          <View style={styles.detailCard}>
            <Text style={styles.detailValue}>{realUser.lawyer_profile?.specialty || 'General Practice'}</Text>
          </View>
        )}

        <Text style={styles.label}>Email</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={editedData.email}
            onChangeText={(text) => setEditedData({...editedData, email: text})}
            keyboardType="email-address"
          />
        ) : (
          <View style={styles.detailCard}>
            <Text style={styles.detailValue}>{realUser.email}</Text>
          </View>
        )}

        <Text style={styles.label}>Phone</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={editedData.phone}
            onChangeText={(text) => setEditedData({...editedData, phone: text})}
            keyboardType="phone-pad"
          />
        ) : (
          <View style={styles.detailCard}>
            <Text style={styles.detailValue}>{realUser.phone || 'N/A'}</Text>
          </View>
        )}

        <Text style={styles.label}>Experience</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={editedData.experience}
            onChangeText={(text) => setEditedData({...editedData, experience: text})}
          />
        ) : (
          <View style={styles.detailCard}>
            <Text style={styles.detailValue}>{realUser.lawyer_profile?.experience || '5 Years'}</Text>
          </View>
        )}

        <Text style={styles.label}>Education</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={editedData.education}
            onChangeText={(text) => setEditedData({...editedData, education: text})}
          />
        ) : (
          <View style={styles.detailCard}>
            <Text style={styles.detailValue}>{realUser.lawyer_profile?.education || 'LL.B, University of Karachi'}</Text>
          </View>
        )}

        <Text style={styles.label}>Office Address</Text>
        {editMode ? (
          <TextInput
            style={[styles.input, styles.textArea]}
            value={editedData.address}
            onChangeText={(text) => setEditedData({...editedData, address: text})}
            multiline
            numberOfLines={3}
          />
        ) : (
          <View style={styles.detailCard}>
            <Text style={styles.detailValue}>{realUser.lawyer_profile?.office_address || 'Sindh Court, Karachi'}</Text>
          </View>
        )}

        {/* Save Button - Only show in edit mode */}
        {editMode && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>SAVE CHANGES</Text>
          </TouchableOpacity>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#fee2e2',
            borderWidth: 1.5,
            borderColor: '#fca5a5',
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
            marginTop: 16,
            marginBottom: 30,
          }}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#dc2626', fontSize: 14, fontWeight: '800', letterSpacing: 0.5 }}>
            🚪 LOGOUT ADVOCATE ACCOUNT
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* CHANGE PASSWORD MODAL */}
      <Modal visible={showPwModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.dpMenu, { padding: 24, width: '90%', maxWidth: 420 }]}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 4 }}>🔑 Change Password</Text>
            <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Update Advocate Account Password (Saved to DB)</Text>

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 6 }}>CURRENT PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 12 }}
              value={currPassword}
              onChangeText={setCurrPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
            />

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 6 }}>NEW PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 12 }}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
            />

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 6 }}>CONFIRM NEW PASSWORD</Text>
            <TextInput
              style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 16 }}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPw}
              placeholder="••••••••"
            />

            <TouchableOpacity style={{ marginBottom: 16 }} onPress={() => setShowPw(v => !v)}>
              <Text style={{ fontSize: 13, color: '#2563eb', fontWeight: '700' }}>{showPw ? '👁️ Hide Passwords' : '👁️‍🗨️ View Passwords'}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#0F2744', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text style={{ color: '#fff', fontWeight: '800' }}>{loading ? 'Updating...' : '💾 Save Password'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, backgroundColor: '#f1f5f9' }}
                onPress={() => setShowPwModal(false)}
              >
                <Text style={{ color: '#475569', fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* FOOTER */}
      <View style={styles.bottomNav}>
        {['Dashboard', 'Requests', 'Cases', 'Schedule', 'Profile'].map((lbl, idx) => {
          const ids = ['home', 'requests', 'cases', 'schedule', 'profile'];
          return (
            <TouchableOpacity
              key={lbl}
              style={styles.navItem}
              onPress={() => handleNav(ids[idx])}
            >
              <Text style={[styles.navLabel, ids[idx] === 'profile' && styles.navLabelActive]}>{lbl}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F2744' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#0F2744',
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center', alignItems: 'center',
  },
  backText: { color: '#fff', fontSize: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  editToggle: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editToggleText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  scroll: { flex: 1, backgroundColor: '#F5F3EF' },
  content: { padding: 20, paddingBottom: 100 },
  
  profilePicSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicContainer: {
    position: 'relative',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0F2744',
  },
  profilePicText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
  },
  dpBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0F2744',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  dpBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 8,
  },
  profileSpec: {
    fontSize: 14,
    color: '#888',
  },
  
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    elevation: 3,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  cardSub: { fontSize: 12, color: '#888', marginTop: 2 },
  
  actionRowBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionRowBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },

  label: { fontSize: 11, fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 10, marginBottom: 4 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  textArea: { textAlignVertical: 'top', minHeight: 80 },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  detailValue: { fontSize: 14, color: '#1a1a1a' },
  
  saveBtn: {
    backgroundColor: '#0F2744',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  saveText: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpMenu: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '80%',
    maxWidth: 320,
    padding: 8,
  },
  
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ece9e4',
    flexDirection: 'row',
    height: 80,
    paddingBottom: 24,
    paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: { fontSize: 11, fontWeight: '600', color: '#bbb' },
  navLabelActive: { color: '#0F2744' },
});