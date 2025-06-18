import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
         
    }
});
axiosClient.interceptors.request.use(
  (config) => {
    try {
      const sessionStr = localStorage.getItem('session');
      if (!sessionStr) return config;

      const session = JSON.parse(sessionStr);
      const token = session?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token attached:', token); // Debug token
      } else {
        console.warn('⚠️ No token found in session');
      }
    } catch (err) {
      console.error('❌ Error parsing session from localStorage:', err);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;