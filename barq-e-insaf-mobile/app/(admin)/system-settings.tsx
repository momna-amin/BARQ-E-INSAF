import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { Save, Check } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';

const TABS = ['General', 'Legal & Terms'] as const;

export default function SystemSettingsScreen() {
  const [tab, setTab] = useState<typeof TABS[number]>('General');
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    platformName: 'Barq-e-Insaf',
    supportEmail: 'support@barqeinsaf.pk',
    contactPhone: '+92 300 0000000',
    maintenanceMode: false,
  });

  function save() {
    setSaved(true);
    Alert.alert('Settings Saved', 'Your settings have been saved successfully.');
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>System Settings</Text>
          <Text style={styles.subtitle}>Global platform configuration</Text>
        </View>
        <TouchableOpacity onPress={save} activeOpacity={0.8}>
          <LinearGradient
            colors={saved ? ['#059669', '#059669'] : [Colors.brand, Colors.brandLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveBtn}
          >
            {saved ? <Check size={16} color="#fff" /> : <Save size={16} color="#fff" />}
            <Text style={styles.saveBtnText}>{saved ? 'Saved!' : 'Save'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'General' && (
        <GlassCard>
          <Text style={styles.sectionTitle}>Platform Identity</Text>

          <Text style={styles.label}>Platform Name</Text>
          <TextInput
            value={general.platformName}
            onChangeText={v => setGeneral(p => ({ ...p, platformName: v }))}
            style={styles.input}
            placeholderTextColor={Colors.textGhost}
          />

          <Text style={styles.label}>Support Email</Text>
          <TextInput
            value={general.supportEmail}
            onChangeText={v => setGeneral(p => ({ ...p, supportEmail: v }))}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.textGhost}
          />

          <Text style={styles.label}>Helpline Phone</Text>
          <TextInput
            value={general.contactPhone}
            onChangeText={v => setGeneral(p => ({ ...p, contactPhone: v }))}
            style={styles.input}
            keyboardType="phone-pad"
            placeholderTextColor={Colors.textGhost}
          />

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Maintenance Mode</Text>
              <Text style={styles.switchDesc}>Temporarily disable client & lawyer portal access</Text>
            </View>
            <Switch
              value={general.maintenanceMode}
              onValueChange={v => setGeneral(p => ({ ...p, maintenanceMode: v }))}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: Colors.brand }}
              thumbColor="#fff"
            />
          </View>
        </GlassCard>
      )}

      {tab === 'Legal & Terms' && (
        <GlassCard>
          <Text style={styles.sectionTitle}>Platform Policies</Text>
          <Text style={styles.policyDesc}>
            Terms of service, privacy policy, and lawyer agreement terms are managed in the CMS Pages section.
          </Text>
          <View style={styles.jurisdictionCard}>
            <Text style={styles.jurisdictionTitle}>Legal Jurisdiction</Text>
            <Text style={styles.jurisdictionText}>
              Islamic Republic of Pakistan (High Courts of Sindh)
            </Text>
          </View>
        </GlassCard>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: Colors.textDim, marginTop: 2 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  saveBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  tabRow: { flexDirection: 'row', gap: 4, backgroundColor: Colors.bgInput, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: 'rgba(255,255,255,0.1)' },
  tabText: { fontSize: 12, fontWeight: '600', color: Colors.textDim },
  tabTextActive: { color: '#fff' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 16 },
  label: { fontSize: 10, color: Colors.textDim, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, color: '#fff' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.border },
  switchTitle: { fontSize: 14, fontWeight: '600', color: Colors.text },
  switchDesc: { fontSize: 12, color: Colors.textDimmer, marginTop: 2 },
  policyDesc: { fontSize: 13, color: Colors.textDim, lineHeight: 20, marginBottom: 16 },
  jurisdictionCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12 },
  jurisdictionTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  jurisdictionText: { fontSize: 12, color: Colors.textDim },
});
