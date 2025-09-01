// lib/axios.js
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-api.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expired or invalid. Redirecting to login...');
      // Optional: sign out and redirect
      const auth = getAuth();
      await auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
