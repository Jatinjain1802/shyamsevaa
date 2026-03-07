import { createContext, useState, useEffect } from "react";
import { getToken, setToken as setAuthToken, removeToken, setRefreshToken, removeRefreshToken } from "../services/token.service";
import { login as apiLogin } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user data on app load
    const token = getToken();
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      if (response.data.success) {
        const { token, refreshToken, user } = response.data;
        setAuthToken(token);
        if (refreshToken) {
          setRefreshToken(refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        return { success: true, user };
      }
      return { success: false, message: response.data.message || "Login failed" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed"
      };
    }
  };

  const logout = () => {
    removeToken();
    removeRefreshToken();
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
