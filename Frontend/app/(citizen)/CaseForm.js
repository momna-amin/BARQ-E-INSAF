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
import showAlert from '../../utils/showAlert';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from './CaseForm.styles';
import api from '../../services/api';

const sindhCities = {
  Karachi: ['Karachi Central', 'Karachi East', 'Karachi South', 'Karachi West', 'Malir', 'Korangi', 'Keamari'],
  Hyderabad: ['Hyderabad City', 'Latifabad', 'Qasimabad', 'Tando Jam', 'Badin', 'Dadu', 'Jamshoro', 'Matiari', 'Tando Allahyar', 'Tando Muhammad Khan', 'Thatta', 'Sujawal'],
  Sukkur: ['Sukkur City', 'Rohri', 'Pano Aqil', 'Salehpat', 'Ghotki', 'Khairpur'],
  Larkana: ['Larkana City', 'Ratodero', 'Dokri', 'Bakrani', 'Jacobabad', 'Kashmore', 'Qambar Shahdadkot', 'Shikarpur'],
  Mirpurkhas: ['Mirpur Khas', 'Umerkot', 'Tharparkar'],
  'Shaheed Benazirabad': ['Naushahro Feroze', 'Sanghar', 'Nawabshah']
};

export default function CaseForm() {
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
  const [loading, setLoading] = useState(false);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(caseType === 'family' ? 'Family Law' : 'Property Law');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categories = ['Property Law', 'Family Law', 'Civil Cases', 'Criminal Law'];

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

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !selectedCity || !selectedDistrict) {
      showAlert('Error', 'Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      await api.post('/cases', {
        title: formData.title,
        type: selectedCategory,
        description: formData.description,
        district: `${selectedCity} - ${selectedDistrict}`,
        evidence: evidenceList,
      });

      showAlert('Success', 'Case submitted successfully!');
      router.push('/(citizen)/MyCases');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to submit case';
      showAlert('Error ⚠️', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvidence = (id) => {
    showAlert(
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
        {/* Case Category Dropdown */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Case Category *</Text>
          <TouchableOpacity 
            style={styles.dropdownSelector}
            onPress={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowCityDropdown(false);
              setShowDistrictDropdown(false);
            }}
          >
            <Text style={styles.dropdownValue}>
              {selectedCategory}
            </Text>
          </TouchableOpacity>
          
          {showCategoryDropdown && (
            <View style={styles.dropdownList}>
              {categories.map(cat => (
                <TouchableOpacity 
                  key={cat} 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setShowCategoryDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
          <Text style={styles.formLabel}>Date Created</Text>
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
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitBtnText}>{loading ? 'Saving...' : 'Save Case'}</Text>
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