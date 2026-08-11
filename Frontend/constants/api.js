import axios from 'axios';
import Constants from 'expo-constants';

<<<<<<< HEAD
// Automatically detect the laptop's Wi-Fi IP address!
const debuggerHost = Constants.expoConfig?.hostUri;
const laptopIp = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

const BASE_URL = `http://${laptopIp}:5000/api`;
=======
// Detect laptop IP or use environment API URL
const debuggerHost = Constants.expoConfig?.hostUri;
const laptopIp = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${laptopIp}:5000/api`;
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
<<<<<<< HEAD
=======
  timeout: 10000,
>>>>>>> f06f937636566780e4af62dedd07861ac3eaf169
});

export default api;