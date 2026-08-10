import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from './AddEvidence.styles';

const mockExplorerFiles = [
  { name: 'property_deed_sindh.pdf', type: 'PDF', size: '2.5 MB' },
  { name: 'house_boundary_photo.jpg', type: 'Photo', size: '1.8 MB' },
  { name: 'incident_video_clip.mp4', type: 'Video', size: '15.4 MB' },
  { name: 'witness_affidavit.pdf', type: 'PDF', size: '940 KB' },
  { name: 'eviction_notice.pdf', type: 'PDF', size: '1.1 MB' },
];

export default function AddEvidence() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const caseType = params.caseType || 'property';

  const handleNav = (id) => {
    if (id === 'home')    router.push('/(citizen)/CitizenHome');
    if (id === 'cases')   router.push('/(citizen)/MyCases');
    if (id === 'lawyers') router.push('/(citizen)/FindLawyer');
    if (id === 'profile') router.push('/(citizen)/Profile');
  };

  const handleSelectFile = (file) => {
    router.push({
      pathname: '/(citizen)/CaseForm',
      params: { 
        caseType, 
        newFileName: file.name, 
        newFileType: file.type 
      }
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5C1A1A" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>BI</Text>
          </View>
          <Text style={styles.headerTitle}>Upload Evidence</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Select File from Phone Explorer</Text>
        <Text style={styles.subtitle}>Select the file you want to upload to your secure vault.</Text>

        <View style={styles.explorerBox}>
          <Text style={styles.explorerHeader}>Phone File Explorer</Text>
          
          {mockExplorerFiles.map((file, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.fileRow}
              onPress={() => handleSelectFile(file)}
            >
              <View style={styles.fileIconBox}>
                <Text style={styles.fileIconText}>{file.type}</Text>
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{file.name}</Text>
                <Text style={styles.fileSize}>{file.size}</Text>
              </View>
              <Text style={styles.importText}>Select</Text>
            </TouchableOpacity>
          ))}
        </View>
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