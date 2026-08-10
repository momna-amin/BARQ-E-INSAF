import axios from 'axios';
import Constants from 'expo-constants';

// Automatically detect the laptop's Wi-Fi IP address!
const debuggerHost = Constants.expoConfig?.hostUri;
const laptopIp = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

const BASE_URL = `http://${laptopIp}:5000/api`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;