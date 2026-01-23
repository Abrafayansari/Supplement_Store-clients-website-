import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { User } from '../../types';

const API_URL = import.meta.env.REACT_APP_API_URL;

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'ADMIN' | 'CUSTOMER') => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      fetchProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (currentToken: string) => {
    try {
      const res = await axios.get(`${API_URL}/getprofile`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      // If token is invalid, logout
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    console.log(res.data);

    setUser(res.data.user);
    setToken(res.data.token);

    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: 'ADMIN' | 'CUSTOMER'
  ) => {
    const res = await axios.post(`${API_URL}/signup`, {
      name,
      email,
      password,
      role
    });
    console.log(res.data);
    setUser(res.data.user);
    setToken(res.data.token);

    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
  };

  const updateProfile = async (name: string, email: string) => {
    const res = await axios.put(`${API_URL}/profile`, { name, email }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setUser(res.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        signup,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
