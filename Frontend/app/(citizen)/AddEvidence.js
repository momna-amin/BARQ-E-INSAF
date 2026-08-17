import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from './AddEvidence.styles';

const mockExplorerFiles = [
  { name: 'property_deed_sindh.pdf', type: 'PDF', size: '2.5 MB' },
  { name: 'house_boundary_photo.jpg', type: 'Photo', size: '1.8 MB' },
  { name: 'incident_video_clip.mp4', type: 'Video', size: '15.4 MB' },
  { name: 'witness_affidavit.pdf', type: 'PDF', size: '940 KB' },
  { name: 'eviction_notice.pdf', type: 'PDF', size: '1.1 MB' },
];

import showAlert from '../../utils/showAlert';
import api from '../../services/api';

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

  const [uploading, setUploading] = useState(false);

  const processAndUploadFile = async (fileName, fileType, fileSize, fileDataUrl) => {
    try {
      setUploading(true);
      const targetCaseId = params.caseId;
      
      if (targetCaseId) {
        // Mode A: Save directly to existing case in DB
        const getRes = await api.get('/cases/' + targetCaseId);
        const currentEvidence = getRes.data.evidence || [];
        
        const newFile = {
          id: String(currentEvidence.length + 1),
          type: fileType,
          name: fileName,
          size: fileSize,
          date: new Date().toISOString().split('T')[0],
          dataUrl: fileDataUrl
        };
        const updatedEvidence = [...currentEvidence, newFile];
        
        await api.put('/cases/' + targetCaseId, {
          evidence: updatedEvidence
        });
        
        showAlert('Success', 'File successfully uploaded to your case vault!');
        router.replace({
          pathname: '/(citizen)/CaseEvidence',
          params: { caseId: targetCaseId }
        });
      } else {
        // Mode B: Pass back to CaseForm via Router params (for new cases)
        router.push({
          pathname: '/(citizen)/CaseForm',
          params: { 
            caseType, 
            newFileName: fileName, 
            newFileType: fileType,
            newFileSize: fileSize,
            newFileDataUrl: fileDataUrl
          }
        });
      }
    } catch (err) {
      showAlert('Upload Error', err?.response?.data?.message || 'Failed to save file.');
    } finally {
      setUploading(false);
    }
  };

  const handleRealFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Convert bytes to readable size
    const bytes = file.size;
    let sizeStr = '0 KB';
    if (bytes < 1024 * 1024) {
      sizeStr = (bytes / 1024).toFixed(1) + ' KB';
    } else {
      sizeStr = (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    // Determine simplified type
    let typeLabel = 'File';
    if (file.type.startsWith('image/')) typeLabel = 'Photo';
    else if (file.type.startsWith('video/')) typeLabel = 'Video';
    else if (file.type === 'application/pdf') typeLabel = 'PDF';

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      processAndUploadFile(file.name, typeLabel, sizeStr, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectFile = async (file) => {
    // Falls back to mock list
    processAndUploadFile(file.name, file.type, file.size, null);
  };
        const updatedEvidence = [...currentEvidence, newFile];
        
        // Save to DB
        await api.put('/cases/' + params.caseId, {
          evidence: updatedEvidence
        });
        
        showAlert('Success', 'File successfully added to case vault!');
        router.replace({
          pathname: '/(citizen)/CaseEvidence',
          params: { caseId: params.caseId }
        });
      } catch (err) {
        showAlert('Error', 'Failed to upload file.');
      } finally {
        setUploading(false);
      }
    } else {
      router.push({
        pathname: '/(citizen)/CaseForm',
        params: { 
          caseType, 
          newFileName: file.name, 
          newFileType: file.type 
        }
      });
    }
  };

  if (uploading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f3ef', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5C1A1A" />
        <Text style={{ marginTop: 12, fontWeight: '700', color: '#5C1A1A' }}>Saving file to secure vault...</Text>
      </SafeAreaView>
    );
  }
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
        <Text style={styles.sectionTitle}>Upload Evidence File</Text>
        <Text style={styles.subtitle}>Upload any real picture, document, or video from your device directly into the database.</Text>

        {/* Real File Input (Hidden, triggered by button) */}
        {Platform.OS === 'web' && (
          <input 
            type="file" 
            id="device-file-picker" 
            style={{ display: 'none' }} 
            onChange={handleRealFileSelect}
            accept="image/*,video/*,application/pdf"
          />
        )}

        <TouchableOpacity 
          style={{ backgroundColor: '#5C1A1A', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 24 }}
          onPress={() => {
            if (Platform.OS === 'web') {
              document.getElementById('device-file-picker').click();
            } else {
              showAlert('Info', 'Real device file upload is supported in browser view.');
            }
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>📁 Choose File from Device</Text>
        </TouchableOpacity>

        <View style={styles.explorerBox}>
          <Text style={styles.explorerHeader}>Or Choose Quick Demo Files:</Text>
          
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