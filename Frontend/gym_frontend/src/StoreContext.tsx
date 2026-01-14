import React, { createContext, useContext, useState } from 'react';
import { CartItem, Product, User } from '../types';
import { MOCK_USERS } from './mockData';

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, flavor?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  user: User | null;
  login: (email: string, role: 'User' | 'Admin') => void;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const addToCart = (product: Product, flavor?: string, size?: string) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedFlavor === flavor && 
        item.selectedSize === size
      );
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedFlavor === flavor && item.selectedSize === size)
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedFlavor: flavor, selectedSize: size }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const login = (email: string, role: 'User' | 'Admin') => {
    const foundUser = MOCK_USERS.find(u => u.email === email && u.role === role) || {
      id: 'temp-user',
      name: 'Authorized Guest',
      email,
      role,
      status: 'Active' as const,
      joinDate: new Date().toISOString()
    };
    setUser(foundUser as User);
  };

  const logout = () => setUser(null);

  return (
    <StoreContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, user, login, logout }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};