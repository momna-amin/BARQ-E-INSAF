import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import showAlert from '../../utils/showAlert';
import api from '../../services/api';

export default function CaseDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const caseId = params.caseId;
  
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showContactModal, setShowContactModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [scheduledMessage, setScheduledMessage] = useState('Assalam-o-Alaikum, I have reviewed your case details and will contact you for a formal consultation.');
  const [messageSent, setMessageSent] = useState(false);
  
  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/cases/${caseId}`);
        const c = res.data;
        setCaseData({
          id: c.id,
          title: c.title,
          clientName: c.citizen?.name || c.users?.name || 'Client',
          phone: c.citizen?.phone || c.users?.phone || '03001234567',
          email: c.citizen?.email || c.users?.email || 'client@barqeinsaf.pk',
          district: c.citizen?.district || c.users?.district || c.district || 'Sindh',
          spec: c.type || 'General Case',
          court: c.court || 'Sindh Court',
          problemStatement: c.description || 'No description provided.',
          evidence: c.evidence || []
        });
      } catch (err) {
        console.log('Error fetching case detail:', err);
      } finally {
        setLoading(false);
      }
    };
    if (caseId) fetchCase();
  }, [caseId]);

  const handleSendMessage = () => {
    setMessageSent(true);
    setTimeout(() => {
      setShowContactModal(false);
      setMessageSent(false);
      showAlert('Message Sent ✅', 'Your message and consultation schedule notice has been sent to the client.');
    }, 600);
  };

  if (loading || !caseData) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Case Details</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Case Information</Text>
          <Text style={styles.detailText}><Text style={styles.label}>Case:</Text> {caseData.title}</Text>
          <Text style={styles.detailText}><Text style={styles.label}>Client:</Text> {caseData.clientName}</Text>
          <Text style={styles.detailText}><Text style={styles.label}>Category:</Text> {caseData.spec}</Text>
          <Text style={styles.detailText}><Text style={styles.label}>Jurisdiction:</Text> {caseData.district}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Problem Statement</Text>
          <Text style={styles.descriptionText}>{caseData.problemStatement}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Contact Information</Text>
          <TouchableOpacity style={styles.contactBtn} onPress={() => setShowContactModal(true)}>
            <Text style={styles.contactBtnText}>📞 View Client Contact & Message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Evidence Vault</Text>
          {caseData.evidence && caseData.evidence.length > 0 ? (
            <TouchableOpacity style={styles.evidenceBtn} onPress={() => setShowEvidenceModal(true)}>
              <Text style={styles.evidenceBtnText}>📁 View Evidence Files ({caseData.evidence.length})</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.emptyEvidence}>
              <Text style={styles.emptyEvidenceText}>No evidence documents attached to this case yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── CLIENT CONTACT & MESSAGE MODAL ── */}
      <Modal
        visible={showContactModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Header with Close Cross Button */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Client Contact & Scheduling</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowContactModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Client Info Grid */}
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Client Name:</Text>
                <Text style={styles.infoVal}>{caseData.clientName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone Number:</Text>
                <Text style={styles.infoVal}>{caseData.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoVal}>{caseData.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>District:</Text>
                <Text style={styles.infoVal}>{caseData.district}</Text>
              </View>
            </View>

            {/* Lawyer Message Box */}
            <Text style={styles.messageHeading}>Send Message / Schedule Consultation Time:</Text>
            <TextInput
              style={styles.messageInput}
              multiline
              numberOfLines={3}
              value={scheduledMessage}
              onChangeText={setScheduledMessage}
              placeholder="Write your consultation time or message to the client..."
            />

            {/* Action Buttons */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setShowContactModal(false)}>
                <Text style={styles.secondaryBtnText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleSendMessage}>
                <Text style={styles.primaryBtnText}>{messageSent ? 'Sending...' : 'Send Message'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── EVIDENCE FILES MODAL ── */}
      <Modal
        visible={showEvidenceModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEvidenceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Attached Evidence Files</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowEvidenceModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 280, marginVertical: 12 }}>
              {caseData.evidence && caseData.evidence.map((f, i) => (
                <View key={i} style={styles.evidenceItem}>
                  <View style={styles.fileIconBadge}>
                    <Text style={styles.fileIconText}>{String(f.type || 'FILE').toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.fileNameText}>{f.name}</Text>
                    <Text style={styles.fileMetaText}>{f.size} • Uploaded {f.date}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowEvidenceModal(false)}>
              <Text style={styles.primaryBtnText}>Close Vault</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F2744' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: { marginRight: 16, padding: 4 },
  backText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  scroll: { flex: 1, backgroundColor: '#F5F3EF' },
  scrollContent: { padding: 20, gap: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ece9e4',
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F2744',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 6,
  },
  detailText: { fontSize: 14, color: '#334155', marginBottom: 6 },
  label: { fontWeight: '700', color: '#64748b' },
  descriptionText: { fontSize: 14, color: '#334155', lineHeight: 22 },
  contactBtn: {
    backgroundColor: '#0F2744',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  contactBtnText: { color: '#fff', fontSize: 14, fontWeight: '750' },
  evidenceBtn: {
    backgroundColor: '#b45309',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  evidenceBtnText: { color: '#fff', fontSize: 14, fontWeight: '750' },
  emptyEvidence: { padding: 12, alignItems: 'center' },
  emptyEvidenceText: { fontSize: 13, color: '#64748b' },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '100%',
    maxWidth: 440,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#0F2744' },
  modalCloseBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  modalCloseText: { fontSize: 14, fontWeight: '800', color: '#64748b' },
  infoBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  infoVal: { fontSize: 13, color: '#0f172a', fontWeight: '750' },
  messageHeading: { fontSize: 12, fontWeight: '800', color: '#0F2744', marginBottom: 6, textTransform: 'uppercase' },
  messageInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: '#0f172a',
    height: 70,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  modalActionRow: { flexDirection: 'row', gap: 12 },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#0F2744',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#475569', fontSize: 14, fontWeight: '700' },

  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  fileIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileIconText: { fontSize: 9, fontWeight: '800', color: '#b45309' },
  fileNameText: { fontSize: 13, fontWeight: '750', color: '#0f172a' },
  fileMetaText: { fontSize: 11, color: '#64748b', marginTop: 2 },
});
