import { createContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-hot-toast";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // logged-in user
  const [loading, setLoading] = useState(true); // for checking localStorage

  // ✅ Runs once when app starts: restores user from localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser && savedUser !== "undefined") {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (data) => {
    try {
      const res = await axios.post("/auth/login", data);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast.success("Logged in successfully!");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed!");
      throw err;
    }
  };

  // Signup function
  const signup = async (data) => {
    try {
      const res = await axios.post("/auth/signup", data);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast.success("Account created successfully!");
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Signup failed!");
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out!");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};