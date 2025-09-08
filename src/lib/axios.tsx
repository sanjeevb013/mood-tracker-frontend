// lib/axios.ts
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-api.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token before each request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError): Promise<never> => Promise.reject(error)
);

// ✅ Handle responses + unauthorized
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<never> => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Clear tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Redirect user to login
        window.location.href = "auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
