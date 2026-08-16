import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from './CaseDetail.styles';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';
import showAlert from '../../utils/showAlert';

export default function CaseDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const caseId = params.caseId;

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDesc, setEditedDesc] = useState('');

  const fetchCaseDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cases/' + caseId);
      const c = res.data;
      setCaseData({
        id: c.id,
        title: c.title,
        status: c.status === 'active' ? 'Active' : c.status === 'pending' ? 'Pending' : 'Closed',
        type: c.type || 'General',
        description: c.description,
        filingDate: new Date(c.created_at).toLocaleDateString(),
        lastUpdated: c.updated_at ? new Date(c.updated_at).toLocaleDateString() : 'Recently',
        district: c.district || 'Sindh'
      });
      setEditedTitle(c.title);
      setEditedDesc(c.description);
    } catch (err) {
      console.log('Error fetching case detail:', err);
      showAlert('Error', 'Failed to load case details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseId) fetchCaseDetail();
  }, [caseId]);

  const handleNav = (id) => {
    if (id === 'home')    router.push('/(citizen)/CitizenHome');
    if (id === 'cases')   router.push('/(citizen)/MyCases');
    if (id === 'lawyers') router.push('/(citizen)/FindLawyer');
    if (id === 'profile') router.push('/(citizen)/Profile');
  };

  const handleSaveChanges = async () => {
    if (!editedTitle || !editedDesc) {
      showAlert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      setLoading(true);
      const res = await api.put('/cases/' + caseId, {
        title: editedTitle,
        description: editedDesc
      });
      const c = res.data;
      setCaseData(prev => ({
        ...prev,
        title: c.title,
        description: c.description
      }));
      setEditMode(false);
      showAlert('Success', 'Case updated successfully!');
    } catch (err) {
      showAlert('Error', err?.response?.data?.message || 'Failed to update case.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !caseData) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#5C1A1A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5C1A1A" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>BI</Text>
          </View>
          <Text style={styles.headerTitle}>Case Details</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.caseHeader}>
          {editMode ? (
            <View style={styles.editForm}>
              <Text style={styles.editLabel}>Edit Case Title</Text>
              <TextInput
                style={styles.editInput}
                value={editedTitle}
                onChangeText={setEditedTitle}
              />
            </View>
          ) : (
            <Text style={styles.caseTitle}>{caseData.title}</Text>
          )}

          <View style={styles.caseStatusRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{caseData.status}</Text>
            </View>
            <Text style={styles.caseType}>{caseData.type} Law</Text>
          </View>
        </View>

        {/* CASE SUMMARY PROFILE */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Case Summary</Text>
          {editMode ? (
            <View style={styles.editForm}>
              <Text style={styles.editLabel}>Edit Summary Description</Text>
              <TextInput
                style={[styles.editInput, styles.editTextArea]}
                multiline
                numberOfLines={4}
                value={editedDesc}
                onChangeText={setEditedDesc}
              />
            </View>
          ) : (
            <Text style={styles.descriptionText}>{caseData.description}</Text>
          )}
        </View>

        {/* METADATA INFO */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Filing Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Filing Date</Text>
            <Text style={styles.infoValue}>{caseData.filingDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated</Text>
            <Text style={styles.infoValue}>{caseData.lastUpdated}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Jurisdiction</Text>
            <Text style={styles.infoValue}>{caseData.district || 'Sindh'}</Text>
          </View>
        </View>

        {/* EVIDENCE BUTTON */}
        <TouchableOpacity 
          style={styles.evidenceVaultBtn}
          onPress={() => router.push({
            pathname: '/(citizen)/CaseEvidence',
            params: { caseId: caseData.id }
          })}
        >
          <Text style={styles.evidenceVaultBtnText}>Open Evidence Vault</Text>
        </TouchableOpacity>

        {/* EDIT TOGGLE CONTROLS */}
        {editMode ? (
          <View style={styles.editActionRow}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveChanges}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => {
              setEditedTitle(caseData.title);
              setEditedDesc(caseData.description);
              setEditMode(false);
            }}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.updateBtn} onPress={() => setEditMode(true)}>
            <Text style={styles.updateBtnText}>Edit Case Details</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.bottomNav}>
        {['Home', 'Cases', 'Lawyers', 'Profile'].map((lbl) => (
          <TouchableOpacity
            key={lbl}
            style={styles.navItem}
            onPress={() => handleNav(lbl.toLowerCase())}
          >
            <Text style={styles.navLabel}>{lbl}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}