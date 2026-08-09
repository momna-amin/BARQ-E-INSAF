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
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from './CaseForm.styles';

export default function CaseForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const caseType = params.caseType || 'property';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    opposingParty: '',
    dateOfIncident: '',
  });
  
  const [evidenceList, setEvidenceList] = useState([
    { id: '1', type: 'image', name: 'Property Document.jpg', size: '2.4 MB', date: '2024-01-15' },
    { id: '2', type: 'video', name: 'Incident Recording.mp4', size: '45 MB', date: '2024-01-14' },
  ]);

  const getCaseTypeIcon = () => {
    switch(caseType) {
      case 'property': return '🏠';
      case 'family': return '👨‍👩‍👧';
      case 'civil': return '⚖️';
      default: return '📋';
    }
  };

  const getCaseTypeName = () => {
    switch(caseType) {
      case 'property': return 'Property Dispute';
      case 'family': return 'Family Case';
      case 'civil': return 'Civil Case';
      default: return 'Case';
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    Alert.alert('Success', 'Case submitted successfully!');
    router.back();
  };

  const handleAddEvidence = () => {
    Alert.alert(
      'Add Evidence',
      'Choose evidence type',
      [
        { text: '📷 Photo', onPress: () => console.log('Add photo') },
        { text: '🎥 Video', onPress: () => console.log('Add video') },
        { text: '📄 Document', onPress: () => console.log('Add document') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleEditEvidence = (item) => {
    Alert.alert('Edit Evidence', `Editing ${item.name}`, [
      { text: 'Update', onPress: () => console.log('Update evidence') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleDeleteEvidence = (id) => {
    Alert.alert(
      'Delete Evidence',
      'Are you sure you want to delete this evidence?',
      [
        { text: 'Yes', onPress: () => setEvidenceList(evidenceList.filter(item => item.id !== id)) },
        { text: 'No', style: 'cancel' },
      ]
    );
  };

  const renderEvidenceItem = ({ item }) => (
    <View style={styles.evidenceItem}>
      <View style={styles.evidenceIcon}>
        <Text style={styles.evidenceIconText}>
          {item.type === 'image' ? '🖼️' : item.type === 'video' ? '🎬' : '📄'}
        </Text>
      </View>
      <View style={styles.evidenceInfo}>
        <Text style={styles.evidenceName}>{item.name}</Text>
        <Text style={styles.evidenceMeta}>{item.size} • {item.date}</Text>
      </View>
      <View style={styles.evidenceActions}>
        <TouchableOpacity onPress={() => handleEditEvidence(item)} style={styles.evidenceActionBtn}>
          <Text style={styles.evidenceActionText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteEvidence(item.id)} style={styles.evidenceActionBtn}>
          <Text style={styles.evidenceActionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5C1A1A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Build Your Case</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.caseTypeBanner}>
          <Text style={styles.caseTypeIcon}>{getCaseTypeIcon()}</Text>
          <Text style={styles.caseTypeName}>{getCaseTypeName()}</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Case Title *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter case title"
            placeholderTextColor="#999"
            value={formData.title}
            onChangeText={(text) => setFormData({...formData, title: text})}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Description *</Text>
          <TextInput
            style={[styles.formInput, styles.formTextArea]}
            placeholder="Describe your case in detail. Include all relevant information, dates, and parties involved."
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Location</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter location (City, District)"
            placeholderTextColor="#999"
            value={formData.location}
            onChangeText={(text) => setFormData({...formData, location: text})}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Opposing Party</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter opposing party name"
            placeholderTextColor="#999"
            value={formData.opposingParty}
            onChangeText={(text) => setFormData({...formData, opposingParty: text})}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Date of Incident</Text>
          <TextInput
            style={styles.formInput}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#999"
            value={formData.dateOfIncident}
            onChangeText={(text) => setFormData({...formData, dateOfIncident: text})}
          />
        </View>

        {/* Evidence Section */}
        <View style={styles.evidenceSection}>
          <View style={styles.evidenceHeader}>
            <Text style={styles.evidenceTitle}>📎 Evidence Collection</Text>
            <TouchableOpacity style={styles.addEvidenceBtn} onPress={handleAddEvidence}>
              <Text style={styles.addEvidenceBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.evidenceHint}>
            Upload files, images, or videos as evidence. You can edit or delete them anytime.
          </Text>

          {evidenceList.length > 0 ? (
            <FlatList
              data={evidenceList}
              renderItem={renderEvidenceItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyEvidence}>
              <Text style={styles.emptyEvidenceText}>No evidence added yet</Text>
              <Text style={styles.emptyEvidenceSub}>Tap "Add" to upload files</Text>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit Case</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}