import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { MapPin, Pencil, Trash2, Plus, X, Check, Building } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStore } from '@/lib/store';
import { generateId } from '@/lib/utils';

type Tab = 'cities' | 'courts';

export default function LocationsScreen() {
  const { cities, courts, updateCity, deleteCity, addCity, updateCourt, deleteCourt, addCourt } = useStore();
  const [tab, setTab] = useState<Tab>('cities');
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newData, setNewData] = useState<any>({});

  // ── CITY FUNCTIONS ─────────────────────────
  function startEditCity(city: typeof cities[0]) {
    setEditId(city.id);
    setEditData({ nameEn: city.nameEn, courts: String(city.courts), lawyers: String(city.lawyers) });
  }

  function saveEditCity() {
    if (editId) {
      updateCity(editId, {
        nameEn: editData.nameEn,
        courts: parseInt(editData.courts) || 0,
        lawyers: parseInt(editData.lawyers) || 0,
      });
      setEditId(null);
      setEditData({});
    }
  }

  function handleDeleteCity(id: string, name: string) {
    Alert.alert('Delete City', `Are you sure you want to delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCity(id) },
    ]);
  }

  function handleAddCity() {
    if (!newData.nameEn?.trim()) return;
    addCity({
      id: generateId('LOC'),
      nameEn: newData.nameEn.trim(),
      province: 'Sindh',
      courts: parseInt(newData.courts) || 0,
      lawyers: parseInt(newData.lawyers) || 0,
    });
    setShowAdd(false);
    setNewData({});
  }

  // ── COURT FUNCTIONS ─────────────────────────
  function startEditCourt(court: typeof courts[0]) {
    setEditId(court.id);
    setEditData({ name: court.name, city: court.city, type: court.type, judges: String(court.judges) });
  }

  function saveEditCourt() {
    if (editId) {
      updateCourt(editId, {
        name: editData.name,
        city: editData.city,
        type: editData.type,
        judges: parseInt(editData.judges) || 0,
      });
      setEditId(null);
      setEditData({});
    }
  }

  function handleDeleteCourt(id: string, name: string) {
    Alert.alert('Delete Court', `Are you sure you want to delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCourt(id) },
    ]);
  }

  function handleAddCourt() {
    if (!newData.name?.trim()) return;
    addCourt({
      id: generateId('CRT'),
      name: newData.name.trim(),
      city: newData.city?.trim() || 'Karachi',
      type: newData.type?.trim() || 'District Court',
      judges: parseInt(newData.judges) || 0,
    });
    setShowAdd(false);
    setNewData({});
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Locations</Text>
          <Text style={styles.subtitle}>Province Sindh — Cities & Courts</Text>
        </View>
        <TouchableOpacity onPress={() => { setShowAdd(true); setNewData({}); }} style={styles.addBtn}>
          <Plus size={16} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setTab('cities')} style={[styles.tab, tab === 'cities' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'cities' && styles.tabTextActive]}>Cities & Districts</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('courts')} style={[styles.tab, tab === 'courts' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'courts' && styles.tabTextActive]}>Courts</Text>
        </TouchableOpacity>
      </View>

      {/* Province badge */}
      <View style={styles.provinceBadge}>
        <MapPin size={12} color={Colors.glow} />
        <Text style={styles.provinceBadgeText}>Province: Sindh</Text>
      </View>

      {/* CITIES TAB */}
      {tab === 'cities' && cities.map(city => (
        <GlassCard key={city.id} style={styles.card}>
          {editId === city.id ? (
            <View>
              <Text style={styles.editLabel}>City Name</Text>
              <TextInput value={editData.nameEn} onChangeText={v => setEditData((p: any) => ({ ...p, nameEn: v }))} style={styles.editInput} placeholderTextColor={Colors.textGhost} />
              <View style={styles.editRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.editLabel}>Courts</Text>
                  <TextInput value={editData.courts} onChangeText={v => setEditData((p: any) => ({ ...p, courts: v }))} style={styles.editInput} keyboardType="numeric" placeholderTextColor={Colors.textGhost} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.editLabel}>Lawyers</Text>
                  <TextInput value={editData.lawyers} onChangeText={v => setEditData((p: any) => ({ ...p, lawyers: v }))} style={styles.editInput} keyboardType="numeric" placeholderTextColor={Colors.textGhost} />
                </View>
              </View>
              <View style={styles.editActions}>
                <TouchableOpacity onPress={saveEditCity} style={styles.saveBtn}>
                  <Check size={14} color="#fff" />
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditId(null)} style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.cardHeader}>
                <Text style={styles.cityName}>{city.nameEn}</Text>
                <View style={styles.actionBtns}>
                  <TouchableOpacity onPress={() => startEditCity(city)} style={styles.iconBtn}>
                    <Pencil size={14} color={Colors.textDimmer} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteCity(city.id, city.nameEn)} style={styles.iconBtnDanger}>
                    <Trash2 size={14} color={Colors.red} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Province</Text>
                  <Text style={styles.metaValue}>Sindh</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Active Courts</Text>
                  <Text style={styles.metaValue}>{city.courts}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Lawyers</Text>
                  <Text style={styles.metaValue}>{city.lawyers}</Text>
                </View>
              </View>
            </View>
          )}
        </GlassCard>
      ))}

      {/* COURTS TAB */}
      {tab === 'courts' && courts.map(court => (
        <GlassCard key={court.id} style={styles.card}>
          {editId === court.id ? (
            <View>
              <Text style={styles.editLabel}>Court Name</Text>
              <TextInput value={editData.name} onChangeText={v => setEditData((p: any) => ({ ...p, name: v }))} style={styles.editInput} placeholderTextColor={Colors.textGhost} />
              <View style={styles.editRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.editLabel}>City</Text>
                  <TextInput value={editData.city} onChangeText={v => setEditData((p: any) => ({ ...p, city: v }))} style={styles.editInput} placeholderTextColor={Colors.textGhost} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.editLabel}>Type</Text>
                  <TextInput value={editData.type} onChangeText={v => setEditData((p: any) => ({ ...p, type: v }))} style={styles.editInput} placeholderTextColor={Colors.textGhost} />
                </View>
              </View>
              <Text style={styles.editLabel}>Judges</Text>
              <TextInput value={editData.judges} onChangeText={v => setEditData((p: any) => ({ ...p, judges: v }))} style={styles.editInput} keyboardType="numeric" placeholderTextColor={Colors.textGhost} />
              <View style={styles.editActions}>
                <TouchableOpacity onPress={saveEditCourt} style={styles.saveBtn}>
                  <Check size={14} color="#fff" />
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditId(null)} style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.cityName} numberOfLines={1}>{court.name}</Text>
                  <Text style={styles.courtCity}>{court.city} · {court.type}</Text>
                </View>
                <View style={styles.actionBtns}>
                  <TouchableOpacity onPress={() => startEditCourt(court)} style={styles.iconBtn}>
                    <Pencil size={14} color={Colors.textDimmer} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteCourt(court.id, court.name)} style={styles.iconBtnDanger}>
                    <Trash2 size={14} color={Colors.red} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Judges</Text>
                  <Text style={styles.metaValue}>{court.judges || '-'}</Text>
                </View>
              </View>
            </View>
          )}
        </GlassCard>
      ))}

      {/* Add Modal */}
      <Modal visible={showAdd} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add {tab === 'cities' ? 'City' : 'Court'}</Text>
              <TouchableOpacity onPress={() => setShowAdd(false)}>
                <X size={18} color={Colors.textDimmer} />
              </TouchableOpacity>
            </View>
            {tab === 'cities' ? (
              <>
                <Text style={styles.editLabel}>City Name</Text>
                <TextInput value={newData.nameEn || ''} onChangeText={v => setNewData((p: any) => ({ ...p, nameEn: v }))} style={styles.editInput} placeholder="e.g. Kandhkot" placeholderTextColor={Colors.textGhost} />
                <View style={styles.editRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.editLabel}>Courts</Text>
                    <TextInput value={newData.courts || ''} onChangeText={v => setNewData((p: any) => ({ ...p, courts: v }))} style={styles.editInput} keyboardType="numeric" placeholder="0" placeholderTextColor={Colors.textGhost} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.editLabel}>Lawyers</Text>
                    <TextInput value={newData.lawyers || ''} onChangeText={v => setNewData((p: any) => ({ ...p, lawyers: v }))} style={styles.editInput} keyboardType="numeric" placeholder="0" placeholderTextColor={Colors.textGhost} />
                  </View>
                </View>
                <TouchableOpacity onPress={handleAddCity} style={styles.saveBtn}>
                  <Plus size={14} color="#fff" />
                  <Text style={styles.saveBtnText}>Add City</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.editLabel}>Court Name</Text>
                <TextInput value={newData.name || ''} onChangeText={v => setNewData((p: any) => ({ ...p, name: v }))} style={styles.editInput} placeholder="e.g. District Court" placeholderTextColor={Colors.textGhost} />
                <View style={styles.editRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.editLabel}>City</Text>
                    <TextInput value={newData.city || ''} onChangeText={v => setNewData((p: any) => ({ ...p, city: v }))} style={styles.editInput} placeholder="Karachi" placeholderTextColor={Colors.textGhost} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.editLabel}>Type</Text>
                    <TextInput value={newData.type || ''} onChangeText={v => setNewData((p: any) => ({ ...p, type: v }))} style={styles.editInput} placeholder="District Court" placeholderTextColor={Colors.textGhost} />
                  </View>
                </View>
                <Text style={styles.editLabel}>Judges</Text>
                <TextInput value={newData.judges || ''} onChangeText={v => setNewData((p: any) => ({ ...p, judges: v }))} style={styles.editInput} keyboardType="numeric" placeholder="0" placeholderTextColor={Colors.textGhost} />
                <TouchableOpacity onPress={handleAddCourt} style={styles.saveBtn}>
                  <Plus size={14} color="#fff" />
                  <Text style={styles.saveBtnText}>Add Court</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: Colors.textDim, marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.brand, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  addBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  tabRow: { flexDirection: 'row', gap: 4, backgroundColor: Colors.bgInput, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: 'rgba(255,255,255,0.1)' },
  tabText: { fontSize: 12, fontWeight: '600', color: Colors.textDim },
  tabTextActive: { color: '#fff' },
  provinceBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.cyanDim, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 12, alignSelf: 'flex-start' },
  provinceBadgeText: { fontSize: 11, color: Colors.glow, fontWeight: '600' },
  card: { marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cityName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  courtCity: { fontSize: 12, color: Colors.textDimmer, marginTop: 2 },
  actionBtns: { flexDirection: 'row', gap: 4 },
  iconBtn: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)' },
  iconBtnDanger: { padding: 8, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.08)' },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  metaItem: { flex: 1 },
  metaLabel: { fontSize: 10, color: Colors.textDimmest, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  editLabel: { fontSize: 10, color: Colors.textDim, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, marginTop: 8 },
  editInput: { backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#fff' },
  editRow: { flexDirection: 'row', gap: 10 },
  editActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#059669', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  saveBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)' },
  cancelBtnText: { fontSize: 13, color: Colors.textDim },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#111', borderRadius: 20, borderWidth: 1, borderColor: Colors.border, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
