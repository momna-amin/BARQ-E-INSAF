import React, { useState, useEffect } from 'react';
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
import styles from './CaseForm.styles';
import { useMockStore, addCase } from './MockStore';

const sindhCities = {
  Karachi: ['Karachi Central', 'Karachi East', 'Karachi South', 'Karachi West', 'Malir', 'Korangi', 'Keamari'],
  Hyderabad: ['Hyderabad City', 'Latifabad', 'Qasimabad', 'Tando Jam'],
  Sukkur: ['Sukkur City', 'Rohri', 'Pano Aqil', 'Salehpat'],
  Larkana: ['Larkana City', 'Ratodero', 'Dokri', 'Bakrani'],
};

export default function CaseForm() {
  useMockStore();
  const router = useRouter();
  const params = useLocalSearchParams();
  const caseType = params.caseType || 'property';
  
  const navItems = [
    { id: 'home',     label: 'Home'    },
    { id: 'cases',    label: 'Cases'   },
    { id: 'lawyers',  label: 'Lawyers' },
    { id: 'profile',  label: 'Profile' },
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  const [evidenceList, setEvidenceList] = useState([
    { id: '1', type: 'PDF', name: 'Sindh Land Deed.pdf', size: '2.4 MB', date: '2026-08-10' },
  ]);

  useEffect(() => {
    if (params.newFileName && params.newFileType) {
      const newFile = {
        id: String(evidenceList.length + 1),
        type: params.newFileType,
        name: params.newFileName,
        size: '1.2 MB',
        date: new Date().toISOString().split('T')[0]
      };
      setEvidenceList(prev => [...prev, newFile]);
    }
  }, [params.newFileName, params.newFileType]);

  const handleNav = (id) => {
    if (id === 'home')    router.push('/(citizen)/CitizenHome');
    if (id === 'cases')   router.push('/(citizen)/MyCases');
    if (id === 'lawyers') router.push('/(citizen)/FindLawyer');
    if (id === 'profile') router.push('/(citizen)/Profile');
  };

  // Fixed: Get case type name based on the caseType parameter
  const getCaseTypeName = () => {
    if (caseType === 'property') {
      return 'Property Dispute';
    } else if (caseType === 'family') {
      return 'Family Case';
    }
    return 'Property Dispute'; // Default fallback
  };

  const todayDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !selectedCity || !selectedDistrict) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    addCase({
      title: formData.title,
      type: caseType === 'property' ? 'Property' : 'Family',
      description: formData.description,
      district: `${selectedCity} - ${selectedDistrict}`,
      evidence: evidenceList.map(item => item.name),
    });

    Alert.alert('Success', 'Case submitted successfully!');
    router.push('/(citizen)/MyCases');
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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5C1A1A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.brandBadgeRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>BI</Text>
          </View>
          <Text style={styles.headerTitle}>Build Your Case</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.caseTypeBanner}>
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
            placeholder="Describe your case in detail. Include all relevant information."
            placeholderTextColor="#999"
            multiline
            numberOfLines={5}
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
          />
        </View>

        {/* Sindh City Dropdown */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Sindh City *</Text>
          <TouchableOpacity 
            style={styles.dropdownSelector}
            onPress={() => {
              setShowCityDropdown(!showCityDropdown);
              setShowDistrictDropdown(false);
            }}
          >
            <Text style={styles.dropdownValue}>
              {selectedCity || 'Select Sindh City'}
            </Text>
          </TouchableOpacity>
          
          {showCityDropdown && (
            <View style={styles.dropdownList}>
              {Object.keys(sindhCities).map(city => (
                <TouchableOpacity 
                  key={city} 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCity(city);
                    setSelectedDistrict('');
                    setShowCityDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* District Dropdown */}
        {selectedCity !== '' && (
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>District *</Text>
            <TouchableOpacity 
              style={styles.dropdownSelector}
              onPress={() => {
                setShowDistrictDropdown(!showDistrictDropdown);
                setShowCityDropdown(false);
              }}
            >
              <Text style={styles.dropdownValue}>
                {selectedDistrict || 'Select District'}
              </Text>
            </TouchableOpacity>
            
            {showDistrictDropdown && (
              <View style={styles.dropdownList}>
                {sindhCities[selectedCity].map(dist => (
                  <TouchableOpacity 
                    key={dist} 
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedDistrict(dist);
                      setShowDistrictDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{dist}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Uneditable Actual Date */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Filing Date</Text>
          <View style={styles.uneditableField}>
            <Text style={styles.uneditableFieldText}>{todayDate}</Text>
          </View>
        </View>

        {/* Evidence Section */}
        <View style={styles.evidenceSection}>
          <View style={styles.evidenceHeader}>
            <Text style={styles.evidenceTitle}>Secure Evidence Collection</Text>
            <TouchableOpacity 
              style={styles.addEvidenceBtn} 
              onPress={() => router.push({
                pathname: '/(citizen)/AddEvidence',
                params: { caseType }
              })}
            >
              <Text style={styles.addEvidenceBtnText}>+ Add Files</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.evidenceHint}>
            Upload files from your phone explorer. Allowable formats: Photo, Video, PDF.
          </Text>

          {evidenceList.map((item, index) => (
            <View key={index} style={styles.evidenceItem}>
              <View style={styles.evidenceInfo}>
                <Text style={styles.evidenceName}>{item.name}</Text>
                <Text style={styles.evidenceMeta}>{item.type} • {item.size}</Text>
              </View>
              <View style={styles.evidenceActions}>
                <TouchableOpacity onPress={() => handleDeleteEvidence(item.id)} style={styles.deleteBtn}>
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit Case</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => handleNav(item.id)}
          >
            <Text style={styles.navLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}