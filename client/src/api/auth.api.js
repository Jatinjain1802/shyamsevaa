import api from "../utils/axios";

// Auth
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const refreshToken = (data) => api.post("/auth/refresh", data);

// Forgot Password Flow
export const forgotPassword = (data) =>
  api.post("/auth/forgot-password", data);

export const verifyOtp = (data) =>
  api.post("/auth/verify-otp", data);

export const resetPassword = (data) =>
  api.post("/auth/reset-password", data);
