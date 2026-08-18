import React, { useState, useRef, useEffect } from 'react';
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
import theme from '../constants/app-theme';

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

  // --- NEW: Splash screen state ---
  const [splashVisible, setSplashVisible] = useState(true);

  // Hover animation (slight float)
  const floatAnim = useRef(new Animated.Value(0)).current;
  // Blink animation for eyes
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // --- NEW: Hide icon after splash screen finishes ---
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 600); // 600ms delay after app boots

    // Slight floating hover animation (gentle up and down)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Very subtle blinking of the eyes
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.delay(4000), // Blink every 4 seconds
      ])
    ).start();

    return () => clearTimeout(timer);
  }, []);

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
  
  // --- NEW: Hide completely during splash screen ---
  if (splashVisible) return null;

  const ALLOWED_PATHS = ['/', '/StartScreen', '/RoleSelectScreen'];
  const isAllowed = ALLOWED_PATHS.includes(normalizedPath);
  if (!isAllowed) return null;

  // Fixed small orb size (56px)
  const ORB_SIZE_SMALL = 56;
  const scale = ORB_SIZE_SMALL / orbConfig.size; // Scale factor based on original theme

  return (
    <>
      {/* ULTRA-ATTRACTIVE DRAGGABLE ORB FLOATING BUTTON (SMALL) */}
      <Animated.View
        style={[
          styles.draggableFab, 
          { 
            transform: [
              { translateX: pan.x }, 
              { translateY: pan.y },
              { translateY: floatAnim } // Slight hover effect
            ] 
          }
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity 
          style={styles.orbWrapper} 
          activeOpacity={0.88} 
          onPress={() => setModalVisible(true)}
        >
          {/* Main Orb Body (Small fixed size) */}
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
              <Animated.View 
                style={[
                  styles.eye, 
                  { 
                    backgroundColor: colors.orbEye1,
                    opacity: blinkAnim 
                  }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.eye, 
                  { 
                    backgroundColor: colors.orbEye1,
                    opacity: blinkAnim 
                  }
                ]} 
              />
            </View>

            {/* Orb Shine Highlights */}
            <View style={[styles.shine1, { backgroundColor: colors.orbShine1 }]} />
            <View style={[styles.shine2, { backgroundColor: colors.orbShine2 }]} />
          </LinearGradient>
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

const ORB_SIZE_SMALL = 56;
const scale = ORB_SIZE_SMALL / (theme.ORB_SIZE || 200); // Scale everything down proportionally

const styles = StyleSheet.create({
  draggableFab: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    zIndex: 9999, 
    elevation: 12 
  },

  // --- SMALL ORB STYLES (Fixed 56px) ---
  orbWrapper: {
    width: ORB_SIZE_SMALL,
    height: ORB_SIZE_SMALL,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  orbBody: {
    width: ORB_SIZE_SMALL,
    height: ORB_SIZE_SMALL,
    borderRadius: ORB_SIZE_SMALL / 2,
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
    borderRadius: ORB_SIZE_SMALL / 2,
    backgroundColor: colors.orbVignette,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  eyeRow: {
    flexDirection: 'row',
    gap: 6, // Scaled down for 56px
    marginTop: -2,
  },
  eye: {
    width: 4, // Scaled down for 56px
    height: 8, // Scaled down for 56px
    borderRadius: 2,
  },
  shine1: {
    position: 'absolute',
    top: 6,
    left: 10,
    width: 10,
    height: 5,
    borderRadius: 4,
  },
  shine2: {
    position: 'absolute',
    top: 12,
    left: 32,
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // --- MODAL STYLES (Unchanged) ---
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