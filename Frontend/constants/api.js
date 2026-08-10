import axios from 'axios';
import Constants from 'expo-constants';

// Detect laptop IP or use environment API URL
const debuggerHost = Constants.expoConfig?.hostUri;
const laptopIp = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${laptopIp}:5000/api`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;