import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";
import LoadingScreen from "../components/LoadingScreen";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (token) {
        try {
          const response = await api.get("api/auth/myprofile");
          setUser({
            id: response.data.userId,
            username: response.data.username,
            email: response.data.email,
            role: response.data.role,
            profilePictureUrl: response.data.profilePictureUrl,
          });
        } catch (error) {
          if (
            error.response?.status === 404 ||
            error.response?.status === 401
          ) {
            console.warn("Sesiune expirată sau user inexistent.");
          }
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const googleLogin = async (googleAccessToken) => {
    try {
      const response = await api.post("api/auth/google", {
        idToken: googleAccessToken,
      });
      const { token } = response.data;

      localStorage.setItem("token", token);

      const meResponse = await api.get("api/auth/myprofile");
      const userData = meResponse.data;

      setUser({
        id: userData.userId,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        profilePictureUrl: userData.profilePictureUrl,
      });

      localStorage.setItem("user", JSON.stringify(userData));

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    const response = await api.post("api/auth/login", { email, password });
    const { token } = response.data;

    localStorage.setItem("token", token);

    const meResponse = await api.get("api/auth/myprofile");
    const userData = meResponse.data;

    setUser({
      id: userData.userId,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      profilePictureUrl: userData.profilePictureUrl,
    });

    localStorage.setItem("user", JSON.stringify(userData));
    return response.data;
  };

  const register = async (email, username, password) => {
    const response = await api.post("api/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  };

  const cancelRegister = async (email) => {
    const response = await api.post("api/auth/cancel", { email });
    return response.data;
  };

  const resetPassword = async (email) => {
    const response = await api.post("api/auth/reset", { email });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        googleLogin,
        cancelRegister,
        resetPassword,
      }}
    >
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
