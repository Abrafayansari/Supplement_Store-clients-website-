import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean; 
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'ADMIN' | 'CUSTOMER') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } 
  }, []);

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
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        signup,
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
