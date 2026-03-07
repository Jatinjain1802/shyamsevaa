import axios from "axios";
import { getToken, getRefreshToken, setToken, removeToken, removeRefreshToken } from "../services/token.service";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops if refresh fails or 401 on refresh endpoint
    if (originalRequest.url.includes("/auth/refresh")) {
       return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      // If user is Admin, auto logout as requested
      if (user?.role === "admin") {
        removeToken();
        removeRefreshToken();
        localStorage.removeItem("user");
        // We use window.location because we are outside the React context here
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // If user is normal user, try refresh
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        removeToken();
        removeRefreshToken();
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Use a clean axios instance to avoid interceptors for the refresh call
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refreshToken,
        });

        const { token } = response.data;
        setToken(token);
        
        // Update the original request and the queue
        originalRequest.headers.Authorization = `Bearer ${token}`;
        processQueue(null, token);
        
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        removeToken();
        removeRefreshToken();
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
