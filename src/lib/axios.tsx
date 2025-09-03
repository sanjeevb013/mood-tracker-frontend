// lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-api.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token before each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// If unauthorized → logout
api.interceptors.response.use(
  (response) => response,

  async (error) => {
      console.log(error,"hhhh")
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
