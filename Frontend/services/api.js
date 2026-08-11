/**
 * api.js — Upgraded Axios instance with:
 * - Auto token attachment (Authorization: Bearer)
 * - Silent 401 → refresh → retry (keeps session alive for 30 days)
 * - Dev (local Expo) + Production (Vercel) URL auto-detection
 */
import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getTokens, saveTokens, clearTokens } from '../services/authStorage';

// ── Base URL detection ────────────────────────────────────────────────────────
// On Expo dev, hostUri gives you your laptop's local IP automatically.
// On Vercel (production web), use the deployed backend URL.
const PROD_BACKEND = 'https://barq-e-insaf-backend.vercel.app/api';

function getBaseUrl() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // If running on localhost (Expo web dev server), use local
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    // Production PWA on Vercel
    return PROD_BACKEND;
  }
  // Native: auto-detect Expo dev server IP
  const debuggerHost = Constants.expoConfig?.hostUri;
  const laptopIp = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';
  return `http://${laptopIp}:5000/api`;
}

const BASE_URL = getBaseUrl();

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15s timeout
});

// ── Request interceptor: attach access token ──────────────────────────────────
api.interceptors.request.use(async (config) => {
  try {
    const { accessToken } = await getTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } catch { /* noop — auth headers optional */ }
  return config;
});

// ── Response interceptor: 401 → refresh → retry once ─────────────────────────
let isRefreshing = false;
let refreshQueue = []; // pending requests while refresh is in progress

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retried) {
      original._retried = true;

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      isRefreshing = true;
      try {
        const { refreshToken } = await getTokens();
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = res.data;

        await saveTokens(accessToken, newRefresh);

        // Flush queued requests
        refreshQueue.forEach(({ resolve }) => resolve(accessToken));
        refreshQueue = [];

        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        // Refresh failed → clear tokens → app will redirect to login
        await clearTokens();
        refreshQueue.forEach(({ reject }) => reject(error));
        refreshQueue = [];
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
