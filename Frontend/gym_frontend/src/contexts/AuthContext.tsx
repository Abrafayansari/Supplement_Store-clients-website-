import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
import axios from 'axios';

import { User } from '../../types';

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
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setUser(parsedUser);
          setToken(storedToken);
          fetchProfile();
        } else {
          logout();
        }
      } catch (err) {
        console.error('Invalid user in localStorage:', storedUser);
        logout();
      }
    } else {
      setLoading(false);
    }

  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/getprofile');
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
    const res = await api.post('/login', { email, password });
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
    const res = await api.post('/signup', {
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
    const res = await api.put('/profile', { name, email });
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
