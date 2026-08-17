import React, { useState, useRef } from 'react';
import Constants from 'expo-constants';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  PanResponder,
  Animated,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname } from 'expo-router';

import api from '../services/api';
// Import the new global theme
import theme from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Destructure theme values for easier use
const { colors, gradients, gradientDir, orbConfig, shadows } = theme;

export default function AIChatFloatingButton() {
  const pathname = usePathname();

  // SSR / Build-time guard: Return null when pre-rendering HTML on Node server
  if (Platform.OS === 'web' && typeof window === 'undefined') {
    return null;
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: 'السلام علیکم! I am your Barq-e-Insaf AI Legal Assistant. Ask me any Pakistan legal law question in Urdu, Sindhi, or English!',
    },
  ]);

  // DRAGGABLE PAN RESPONDER
  const pan = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH - 84, y: SCREEN_HEIGHT - 170 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const sendMessage = async () => {
    if (inputText.trim() === '' || loading) return;

    const userQuery = inputText.trim();
    const userMsg = { id: Date.now().toString(), sender: 'user', text: userQuery };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.post('/chat', {
        message: userQuery,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3
      });

      const data = res.data;
      const aiResponseText = data.response || data.answer || 'Barq-e-Insaf AI Legal Assistant: Thank you for your legal query. For formal representation in court, connect with a verified advocate on the platform.';

      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText, sources: data.sources }]);
    } catch (error) {
      // Fail-Proof Fallback — Never stop working!
      const fallbackText = `⚡ **Barq-e-Insaf AI Assistant (Offline Legal Guidance):**\n\n` +
        `Regarding your query: "${userQuery}"\n` +
        `• Under the Laws of Pakistan & Constitution 1973, legal rights are protected under Fundamental Rights (Articles 4 & 10A).\n` +
        `• For Family & Property disputes in Sindh, file in relevant District / High Courts via verified advocates.\n` +
        `• You can search and consult verified Sindh Bar Council advocates on the Barq-e-Insaf directory.`;

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: fallbackText,
        sources: [{ source: 'Pakistan Legal Code (Offline)', page: 'Statutes' }]
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Chatbot only allowed on the entry screens (Start + Role Select).
  const normalizedPath = (pathname || '/').replace(/\/+$/, '') || '/';
  const ALLOWED_PATHS = ['/', '/StartScreen', '/RoleSelectScreen'];
  const isAllowed = ALLOWED_PATHS.includes(normalizedPath);
  if (!isAllowed) return null;

  return (
    <>
      {/*  ULTRA-ATTRACTIVE DRAGGABLE ORB FLOATING BUTTON  */}
      <Animated.View
        style={[styles.draggableFab, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity 
          style={styles.orbWrapper} 
          activeOpacity={0.88} 
          onPress={() => setModalVisible(true)}
        >
          {/* Outer Glow */}
          <View style={styles.outerGlow} />

          {/* Orbiting Rings */}
          <View style={styles.ring1} />
          <View style={styles.ring2} />

          {/* Main Orb Body */}
          <LinearGradient
            colors={gradients.orb}
            style={styles.orbBody}
            start={gradientDir.start}
            end={gradientDir.end}
          >
            {/* Inner Vignette */}
            <View style={styles.vignette} />

            {/* Orb Eyes (Blinking animation effect) */}
            <View style={styles.eyeRow}>
              <View style={[styles.eye, { backgroundColor: colors.orbEye1 }]} />
              <View style={[styles.eye, { backgroundColor: colors.orbEye1 }]} />
            </View>

            {/* Orb Shine Highlights */}
            <View style={[styles.shine1, { backgroundColor: colors.orbShine1 }]} />
            <View style={[styles.shine2, { backgroundColor: colors.orbShine2 }]} />
          </LinearGradient>

          {/* Haze Ring Overlay */}
          <View style={[styles.hazeRing, { backgroundColor: colors.orbHaze1 }]} />
        </TouchableOpacity>
      </Animated.View>

      {/* POPUP AI CHAT MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <SafeAreaView style={styles.modalCard}>
            
            {/* Header Bar */}
            <View style={styles.modalHeader}>
              <View style={styles.headerTitleRow}>
                <View style={styles.headerBadge}>
                  <Text style={styles.headerIcon}>⚡</Text>
                </View>
                <View>
                  <Text style={styles.headerTitle}>Barq-e-Insaf AI Assistant</Text>
                  <Text style={styles.headerSub}>Pakistan Penal Code & Legal Guidance</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <ScrollView style={styles.chatScroll} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
              {messages.map((msg) => (
                <View key={msg.id} style={[styles.msgBubble, msg.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                  <Text style={[styles.msgText, msg.sender === 'user' ? styles.userMsgText : styles.aiMsgText]}>{msg.text}</Text>
                  
                  {/* Render Sources if available */}
                  {msg.sources && msg.sources.length > 0 && (
                    <View style={styles.sourcesContainer}>
                      <Text style={styles.sourcesTitle}>Reference Documents:</Text>
                      {msg.sources.map((src, idx) => (
                        <Text key={idx} style={styles.sourceItem}>
                          • {src.source} {src.page && src.page !== 'N/A' ? `(Page ${src.page})` : ''}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
              {loading && (
                <View style={[styles.msgBubble, styles.aiBubble, styles.loadingRow]}>
                  <ActivityIndicator size="small" color={colors.btnBlue2} />
                  <Text style={styles.loadingText}>Searching legal database & statutes...</Text>
                </View>
              )}
            </ScrollView>

            {/* Input Bar */}
            <View style={styles.inputBar}>
              <TextInput
                style={styles.textInput}
                placeholder="Type legal question (Urdu / English)..."
                placeholderTextColor="#94a3b8"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={loading}>
                <Text style={styles.sendBtnText}>➔</Text>
              </TouchableOpacity>
            </View>

          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  draggableFab: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    zIndex: 9999, 
    elevation: 12 
  },

  // --- NEW ORB STYLES ---
  orbWrapper: {
    width: orbConfig.size,
    height: orbConfig.size,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerGlow: {
    position: 'absolute',
    width: orbConfig.outerGlowSize,
    height: orbConfig.outerGlowSize,
    borderRadius: orbConfig.outerGlowSize / 2,
    ...shadows.outerGlow,
  },
  ring1: {
    position: 'absolute',
    width: orbConfig.ring1Size,
    height: orbConfig.ring1Size,
    borderRadius: orbConfig.ring1Size / 2,
    borderWidth: 2,
    borderColor: colors.ring1,
  },
  ring2: {
    position: 'absolute',
    width: orbConfig.ring2Size,
    height: orbConfig.ring2Size,
    borderRadius: orbConfig.ring2Size / 2,
    borderWidth: 1.5,
    borderColor: colors.ring2,
  },
  orbBody: {
    width: orbConfig.size,
    height: orbConfig.size,
    borderRadius: orbConfig.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.orbBody,
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: orbConfig.borderRadius,
    backgroundColor: colors.orbVignette,
    borderWidth: orbConfig.vignetteBorder,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  eyeRow: {
    flexDirection: 'row',
    gap: orbConfig.eyeGap,
    marginTop: -8,
  },
  eye: {
    width: orbConfig.eyeWidth,
    height: orbConfig.eyeHeight,
    borderRadius: orbConfig.eyeBorderRad,
  },
  shine1: {
    position: 'absolute',
    top: orbConfig.shine1.top,
    left: orbConfig.shine1.left,
    width: orbConfig.shine1.width,
    height: orbConfig.shine1.height,
    borderRadius: 12,
  },
  shine2: {
    position: 'absolute',
    top: orbConfig.shine2.top,
    left: orbConfig.shine2.left,
    width: orbConfig.shine2.size,
    height: orbConfig.shine2.size,
    borderRadius: 50,
  },
  hazeRing: {
    position: 'absolute',
    width: orbConfig.hazeRingSize,
    height: orbConfig.hazeRingSize,
    borderRadius: orbConfig.hazeRingSize / 2,
  },

  // --- MODAL STYLES (Kept mostly identical) ---
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.75)', 
    justifyContent: 'flex-end' 
  },
  modalCard: { 
    backgroundColor: '#0F172A', 
    borderTopLeftRadius: 28, 
    borderTopRightRadius: 28, 
    height: SCREEN_HEIGHT * 0.84 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    backgroundColor: '#020617', 
    borderTopLeftRadius: 28, 
    borderTopRightRadius: 28 
  },
  headerTitleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  headerBadge: { 
    width: 38, 
    height: 38, 
    borderRadius: 19, 
    backgroundColor: colors.btnBlue2, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerIcon: { 
    fontSize: 20 
  },
  headerTitle: { 
    color: '#f8fafc', 
    fontSize: 16, 
    fontWeight: '800' 
  },
  headerSub: { 
    color: colors.lightning1, 
    fontSize: 11, 
    fontWeight: '600', 
    marginTop: 1 
  },
  closeBtn: { 
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  closeBtnText: { 
    color: '#f8fafc', 
    fontSize: 16, 
    fontWeight: '800' 
  },
  chatScroll: { 
    flex: 1, 
    backgroundColor: '#0F172A' 
  },
  chatContent: { 
    padding: 18, 
    gap: 12 
  },
  msgBubble: { 
    maxWidth: '84%', 
    padding: 14, 
    borderRadius: 18, 
    marginBottom: 8 
  },
  userBubble: { 
    alignSelf: 'flex-end', 
    backgroundColor: colors.btnBlue2, 
    borderBottomRightRadius: 4 
  },
  aiBubble: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#1E293B', 
    borderBottomLeftRadius: 4, 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  userMsgText: { 
    color: '#ffffff', 
    fontSize: 13, 
    lineHeight: 19 
  },
  aiMsgText: { 
    color: '#e2e8f0', 
    fontSize: 13, 
    lineHeight: 19 
  },
  loadingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  loadingText: { 
    color: '#94a3b8', 
    fontSize: 12, 
    fontStyle: 'italic' 
  },
  inputBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 14, 
    paddingHorizontal: 16, 
    backgroundColor: '#020617', 
    borderTopWidth: 1, 
    borderTopColor: '#1E293B', 
    gap: 10 
  },
  textInput: { 
    flex: 1, 
    backgroundColor: '#1E293B', 
    borderRadius: 24, 
    paddingHorizontal: 18, 
    paddingVertical: 10, 
    fontSize: 13, 
    color: '#f8fafc' 
  },
  sendBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: colors.btnBlue2, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sendBtnText: { 
    color: '#ffffff', 
    fontSize: 18, 
    fontWeight: '800' 
  },
  sourcesContainer: { 
    marginTop: 10, 
    paddingTop: 10, 
    borderTopWidth: 1, 
    borderTopColor: '#334155' 
  },
  sourcesTitle: { 
    color: colors.lightning1, 
    fontSize: 11, 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  sourceItem: { 
    color: '#94a3b8', 
    fontSize: 11, 
    fontStyle: 'italic', 
    marginBottom: 2 
  },
});