import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  TextInput,
  Modal,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMockStore, timingSlots, addTimingSlot, deleteTimingSlot, editTimingSlot } from './MockStore';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Schedule() {
  useMockStore();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [newDay, setNewDay] = useState('Monday');
  const [newTime, setNewTime] = useState('');
  const [showDayDropdown, setShowDayDropdown] = useState(false);

  const handleAddSlot = () => {
    if (!newTime) {
      Alert.alert('Error', 'Please enter a time');
      return;
    }
    addTimingSlot(newDay, newTime);
    setNewDay('Monday');
    setNewTime('');
    setShowAddModal(false);
    Alert.alert('Success', 'Time slot added successfully');
  };

  const handleDeleteSlot = (id) => {
    Alert.alert(
      'Delete Slot',
      'Are you sure you want to delete this time slot?',
      [
        { text: 'Yes', onPress: () => deleteTimingSlot(id) },
        { text: 'No', style: 'cancel' }
      ]
    );
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setNewDay(slot.day);
    setNewTime(slot.time);
    setShowEditModal(true);
  };

  const handleUpdateSlot = () => {
    if (!newTime) {
      Alert.alert('Error', 'Please enter a time');
      return;
    }
    editTimingSlot(editingSlot.id, newDay, newTime);
    setShowEditModal(false);
    setEditingSlot(null);
    setNewDay('Monday');
    setNewTime('');
    Alert.alert('Success', 'Time slot updated successfully');
  };

  const handleNav = (lbl) => {
    if (lbl === 'home') router.push('/(lawyer)/LawyerHome');
    if (lbl === 'requests') router.push('/(lawyer)/CaseRequests');
    if (lbl === 'cases') router.push('/(lawyer)/MyCases');
    if (lbl === 'schedule') router.push('/(lawyer)/Schedule');
    if (lbl === 'profile') router.push('/(lawyer)/LawyerProfile');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>BI</Text>
          </View>
          <Text style={styles.headerTitle}>My Schedule</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Office Hours</Text>
        <Text style={styles.sectionSub}>Set your available consultation hours</Text>

        {timingSlots.length > 0 ? (
          timingSlots.map((slot, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.dayText}>{slot.day}</Text>
                  <Text style={styles.timeText}>⏰ {slot.time}</Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={styles.editBtn} 
                    onPress={() => handleEditSlot(slot)}
                  >
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteBtn} 
                    onPress={() => handleDeleteSlot(slot.id)}
                  >
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No time slots added yet</Text>
            <Text style={styles.emptySub}>Tap + Add to set your available hours</Text>
          </View>
        )}
      </ScrollView>

      {/* ADD MODAL */}
      <Modal
        transparent={true}
        visible={showAddModal}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Time Slot</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Day</Text>
            <TouchableOpacity 
              style={styles.dropdownSelector}
              onPress={() => setShowDayDropdown(!showDayDropdown)}
            >
              <Text style={styles.dropdownValue}>{newDay}</Text>
            </TouchableOpacity>

            {showDayDropdown && (
              <View style={styles.dropdownList}>
                {daysOfWeek.map(day => (
                  <TouchableOpacity 
                    key={day} 
                    style={styles.dropdownItem}
                    onPress={() => {
                      setNewDay(day);
                      setShowDayDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.modalLabel}>Time</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 02:00 PM - 05:00 PM"
              value={newTime}
              onChangeText={setNewTime}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleAddSlot}>
              <Text style={styles.saveBtnText}>Add Slot</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        transparent={true}
        visible={showEditModal}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Time Slot</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Day</Text>
            <TouchableOpacity 
              style={styles.dropdownSelector}
              onPress={() => setShowDayDropdown(!showDayDropdown)}
            >
              <Text style={styles.dropdownValue}>{newDay}</Text>
            </TouchableOpacity>

            {showDayDropdown && (
              <View style={styles.dropdownList}>
                {daysOfWeek.map(day => (
                  <TouchableOpacity 
                    key={day} 
                    style={styles.dropdownItem}
                    onPress={() => {
                      setNewDay(day);
                      setShowDayDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.modalLabel}>Time</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 02:00 PM - 05:00 PM"
              value={newTime}
              onChangeText={setNewTime}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateSlot}>
              <Text style={styles.saveBtnText}>Update Slot</Text>
            </TouchableOpacity>
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
              <Text style={[styles.navLabel, ids[idx] === 'schedule' && styles.navLabelActive]}>{lbl}</Text>
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
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: '#0F2744',
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center', alignItems: 'center',
  },
  backText: { color: '#fff', fontSize: 16 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, marginLeft: 8 },
  logoBadge: {
    backgroundColor: '#fff', width: 32, height: 32, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  logoBadgeText: { color: '#0F2744', fontSize: 14, fontWeight: '800' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  addBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#0F2744',
    fontSize: 12,
    fontWeight: '700',
  },
  scroll: { flex: 1, backgroundColor: '#F5F3EF' },
  content: { padding: 20, gap: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#0F2744' },
  sectionSub: { fontSize: 12, color: '#888', marginBottom: 4 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#ece9e4', elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayText: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  timeText: { fontSize: 13, color: '#666', marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 8 },
  editBtn: {
    backgroundColor: '#e0ebf5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  editBtnText: { color: '#0F2744', fontSize: 11, fontWeight: '700' },
  deleteBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  deleteBtnText: { color: '#991b1b', fontSize: 11, fontWeight: '700' },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    borderWidth: 1,
    borderColor: '#ece9e4',
    alignItems: 'center',
  },
  emptyText: { fontSize: 16, color: '#666', fontWeight: '600' },
  emptySub: { fontSize: 13, color: '#999', marginTop: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  modalClose: { fontSize: 28, color: '#666', fontWeight: '300' },
  modalLabel: { fontSize: 12, fontWeight: '700', color: '#aaa', textTransform: 'uppercase', marginBottom: 6, marginTop: 12 },
  modalInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownSelector: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
  },
  dropdownValue: { fontSize: 14, color: '#1a1a1a' },
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ece9e4',
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f3f0',
  },
  dropdownItemText: { fontSize: 14, color: '#333' },
  saveBtn: {
    backgroundColor: '#0F2744',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
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