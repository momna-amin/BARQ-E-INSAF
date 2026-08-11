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
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMockStore, lawyerProfile, updateLawyerProfile } from './MockStore';

export default function LawyerProfile() {
  useMockStore();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [showDPMenu, setShowDPMenu] = useState(false);
  
  // Local state for editing
  const [editedData, setEditedData] = useState({
    name: lawyerProfile.name,
    spec: lawyerProfile.spec,
    address: lawyerProfile.address,
    bio: lawyerProfile.about,
    email: lawyerProfile.email,
    phone: lawyerProfile.phone,
    isAvailable: lawyerProfile.isAvailable,
    experience: lawyerProfile.experience,
    education: lawyerProfile.education,
  });

  const handleNav = (lbl) => {
    if (lbl === 'home') router.push('/(lawyer)/LawyerHome');
    if (lbl === 'requests') router.push('/(lawyer)/CaseRequests');
    if (lbl === 'cases') router.push('/(lawyer)/MyCases');
    if (lbl === 'schedule') router.push('/(lawyer)/Schedule');
    if (lbl === 'profile') router.push('/(lawyer)/LawyerProfile');
  };

  const handleSave = () => {
    updateLawyerProfile({
      name: editedData.name,
      spec: editedData.spec,
      address: editedData.address,
      about: editedData.bio,
      email: editedData.email,
      phone: editedData.phone,
      isAvailable: editedData.isAvailable,
      experience: editedData.experience,
      education: editedData.education,
    });
    setEditMode(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleChangeDP = () => {
    setShowDPMenu(false);
    Alert.alert('Change Profile Picture', 'Profile picture upload functionality will be available in the next update.');
  };

  const handleRemoveDP = () => {
    setShowDPMenu(false);
    updateLawyerProfile({ dp: null });
    Alert.alert('Success', 'Profile picture removed');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
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
            {lawyerProfile.dp ? (
              <View style={styles.profilePic} />
            ) : (
              <View style={[styles.profilePic, { backgroundColor: lawyerProfile.color }]}>
                <Text style={styles.profilePicText}>{lawyerProfile.initials}</Text>
              </View>
            )}
            <View style={styles.dpBadge}>
              <Text style={styles.dpBadgeText}>Edit</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{lawyerProfile.name}</Text>
          <Text style={styles.profileSpec}>{lawyerProfile.spec} · SBC {lawyerProfile.sbc}</Text>
        </View>

        {/* Availability Toggle */}
        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.cardTitle}>Accepting New Clients</Text>
              <Text style={styles.cardSub}>Toggle whether clients can hire you</Text>
            </View>
            <Switch
              value={editMode ? editedData.isAvailable : lawyerProfile.isAvailable}
              onValueChange={(value) => {
                if (editMode) {
                  setEditedData({...editedData, isAvailable: value});
                } else {
                  updateLawyerProfile({ isAvailable: value });
                }
              }}
              trackColor={{ false: '#767577', true: '#1B4332' }}
              thumbColor={editMode ? (editedData.isAvailable ? '#4ade80' : '#f4f3f4') : (lawyerProfile.isAvailable ? '#4ade80' : '#f4f3f4')}
            />
          </View>
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
            <Text style={styles.detailValue}>{lawyerProfile.name}</Text>
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
            <Text style={styles.detailValue}>{lawyerProfile.spec}</Text>
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
            <Text style={styles.detailValue}>{lawyerProfile.email}</Text>
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
            <Text style={styles.detailValue}>{lawyerProfile.phone}</Text>
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
            <Text style={styles.detailValue}>{lawyerProfile.experience}</Text>
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
            <Text style={styles.detailValue}>{lawyerProfile.education}</Text>
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
            <Text style={styles.detailValue}>{lawyerProfile.address}</Text>
          </View>
        )}

        <Text style={styles.label}>Professional Biography</Text>
        {editMode ? (
          <TextInput
            style={[styles.input, styles.textArea]}
            value={editedData.bio}
            onChangeText={(text) => setEditedData({...editedData, bio: text})}
            multiline
            numberOfLines={4}
          />
        ) : (
          <View style={styles.detailCard}>
            <Text style={styles.detailValue}>{lawyerProfile.about}</Text>
          </View>
        )}

        {/* Save Button - Only show in edit mode */}
        {editMode && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>SAVE CHANGES</Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      {/* DP Change Modal */}
      <Modal
        transparent={true}
        visible={showDPMenu}
        animationType="fade"
        onRequestClose={() => setShowDPMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDPMenu(false)}
        >
          <View style={styles.dpMenu}>
            <TouchableOpacity style={styles.dpMenuItem} onPress={handleChangeDP}>
              <Text style={styles.dpMenuItemText}>Change Profile Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.dpMenuItem, styles.dpMenuItemDanger]} onPress={handleRemoveDP}>
              <Text style={styles.dpMenuItemDangerText}>Remove Profile Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dpMenuItem} onPress={() => setShowDPMenu(false)}>
              <Text style={styles.dpMenuItemCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
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
  dpMenuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f3f0',
  },
  dpMenuItemDanger: {
    borderBottomWidth: 1,
    borderBottomColor: '#f5f3f0',
  },
  dpMenuItemText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
  },
  dpMenuItemDangerText: {
    fontSize: 15,
    color: '#ef4444',
    textAlign: 'center',
  },
  dpMenuItemCancel: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
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