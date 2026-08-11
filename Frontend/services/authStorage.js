/**
 * authStorage.js
 * Token persistence layer — uses expo-secure-store on native (iOS/Android)
 * and localStorage on web (PWA in Chrome).
 * Drop-in replacement: same 3 function API everywhere.
 */
import { Platform } from 'react-native';

// Lazy import so the web bundle doesn't crash (expo-secure-store has no web impl)
let SecureStore = null;
if (Platform.OS !== 'web') {
  SecureStore = require('expo-secure-store');
}

// ── Web helpers (localStorage) ────────────────────────────────────────────────
const webGet = (key) => {
  try { return Promise.resolve(typeof window !== 'undefined' ? localStorage.getItem(key) : null); }
  catch { return Promise.resolve(null); }
};
const webSet = (key, value) => {
  try { if (typeof window !== 'undefined') localStorage.setItem(key, value); }
  catch { /* safari private mode */ }
  return Promise.resolve();
};
const webDel = (key) => {
  try { if (typeof window !== 'undefined') localStorage.removeItem(key); }
  catch { /* noop */ }
  return Promise.resolve();
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Save both tokens after login / token refresh
 */
export const saveTokens = async (accessToken, refreshToken) => {
  if (Platform.OS === 'web') {
    await webSet('accessToken', accessToken);
    await webSet('refreshToken', refreshToken);
  } else {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  }
};

/**
 * Save the full user object for display (name, role etc.)
 */
export const saveUser = async (user) => {
  const str = JSON.stringify(user);
  if (Platform.OS === 'web') await webSet('barq_user', str);
  else await SecureStore.setItemAsync('barq_user', str);
};

/**
 * Retrieve both tokens (returns { accessToken, refreshToken })
 */
export const getTokens = async () => {
  if (Platform.OS === 'web') {
    return {
      accessToken: await webGet('accessToken'),
      refreshToken: await webGet('refreshToken'),
    };
  }
  return {
    accessToken: await SecureStore.getItemAsync('accessToken'),
    refreshToken: await SecureStore.getItemAsync('refreshToken'),
  };
};

/**
 * Retrieve stored user object (or null)
 */
export const getUser = async () => {
  try {
    const str = Platform.OS === 'web'
      ? await webGet('barq_user')
      : await SecureStore.getItemAsync('barq_user');
    return str ? JSON.parse(str) : null;
  } catch { return null; }
};

/**
 * Clear all stored auth data on logout
 */
export const clearTokens = async () => {
  if (Platform.OS === 'web') {
    await webDel('accessToken');
    await webDel('refreshToken');
    await webDel('barq_user');
  } else {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('barq_user');
  }
};
