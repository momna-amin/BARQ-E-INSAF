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

const SINDH_DISTRICTS = [
  'Badin', 'Dadu', 'Ghotki', 'Hyderabad', 'Jacobabad',
  'Jamshoro', 'Karachi Central', 'Karachi East', 'Karachi South',
  'Karachi West', 'Kashmore', 'Khairpur', 'Korangi', 'Larkana',
  'Malir', 'Matiari', 'Mirpur Khas', 'Naushahro Feroze',
  'Qambar Shahdadkot', 'Sanghar', 'Shaheed Benazirabad',
  'Shikarpur', 'Sukkur', 'Tando Allahyar', 'Tando Muhammad Khan',
  'Tharparkar', 'Thatta', 'Umerkot',
];

export default function CaseDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const caseId = params.caseId;

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDesc, setEditedDesc] = useState('');
  const [editedCategory, setEditedCategory] = useState('Property Law');
  const [editedDistrict, setEditedDistrict] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const categories = ['Property Law', 'Family Law', 'Civil Cases', 'Criminal Law'];
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratedStars, setRatedStars] = useState(null);

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
        creationDate: new Date(c.created_at).toLocaleDateString(),
        lastUpdated: c.updated_at ? new Date(c.updated_at).toLocaleDateString() : 'Recently',
        district: c.district || 'Sindh',
        lawyerId: c.lawyer?.id || null,
        lawyerName: c.lawyer?.user?.name || null
      });
      setEditedTitle(c.title);
      setEditedDesc(c.description);
      setEditedCategory(c.type || 'Property Law');
      setEditedDistrict(c.district || '');
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
        description: editedDesc,
        type: editedCategory,
        district: editedDistrict || caseData.district
      });
      const c = res.data;
      setCaseData(prev => ({
        ...prev,
        title: c.title,
        description: c.description,
        type: c.type || prev.type,
        district: c.district || prev.district
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
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.brandBadgeRow}>
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

              {/* Case Category Dropdown */}
              <Text style={styles.editLabel}>Edit Case Category</Text>
              <TouchableOpacity 
                style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ece9e4', padding: 12, marginBottom: 12 }}
                onPress={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowCityDropdown(false);
                  setShowDistrictDropdown(false);
                }}
              >
                <Text style={{ fontSize: 14, color: '#1a1a1a', fontWeight: '600' }}>
                  {editedCategory}
                </Text>
              </TouchableOpacity>
              {showCategoryDropdown && (
                <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ece9e4', padding: 6, marginBottom: 12 }}>
                  {categories.map(cat => (
                    <TouchableOpacity 
                      key={cat} 
                      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
                      onPress={() => {
                        setEditedCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text style={{ fontSize: 13, color: '#334155', fontWeight: '600' }}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* District Dropdown */}
              <Text style={styles.editLabel}>Edit District</Text>
              <TouchableOpacity 
                style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ece9e4', padding: 12, marginBottom: 12 }}
                onPress={() => {
                  setShowDistrictDropdown(!showDistrictDropdown);
                  setShowCategoryDropdown(false);
                }}
              >
                <Text style={{ fontSize: 14, color: '#1a1a1a', fontWeight: '600' }}>
                  {editedDistrict || 'Select District'}
                </Text>
              </TouchableOpacity>
              {showDistrictDropdown && (
                <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ece9e4', padding: 6, marginBottom: 12 }}>
                  {SINDH_DISTRICTS.map(dist => (
                    <TouchableOpacity 
                      key={dist} 
                      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
                      onPress={() => {
                        setEditedDistrict(dist);
                        setShowDistrictDropdown(false);
                      }}
                    >
                      <Text style={{ fontSize: 13, color: '#334155', fontWeight: '600' }}>{dist}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.caseTitle}>{caseData.title}</Text>
          )}

          <View style={styles.caseStatusRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{caseData.status}</Text>
            </View>
            <Text style={styles.caseType}>{caseData.type}</Text>
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
          <Text style={styles.sectionTitle}>Case Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date Created</Text>
            <Text style={styles.infoValue}>{caseData.creationDate}</Text>
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

        {/* ASSIGNED ADVOCATE & RATING */}
        {caseData.lawyerId && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Assigned Advocate</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Advocate Name</Text>
              <Text style={styles.infoValue}>Adv. {caseData.lawyerName}</Text>
            </View>

            {ratedStars ? (
              <View style={{ marginTop: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: '#16a34a', fontWeight: '700' }}>
                  ✅ Thank you! You rated this advocate {ratedStars} stars.
                </Text>
              </View>
            ) : (
              <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: '#ece9e4', paddingTop: 12 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1a1a1a', marginBottom: 8, textAlign: 'center' }}>
                  Rate your experience with this advocate:
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={async () => {
                        try {
                          setSubmittingRating(true);
                          await api.post(`/lawyers/${caseData.lawyerId}/rate`, { rating: star });
                          setRatedStars(star);
                          showAlert('Success 🌟', `Thank you for rating Adv. ${caseData.lawyerName}!`);
                        } catch (err) {
                          showAlert('Error', 'Failed to submit rating. Please try again.');
                        } finally {
                          setSubmittingRating(false);
                        }
                      }}
                      disabled={submittingRating}
                    >
                      <Text style={{ fontSize: 28 }}>⭐</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

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