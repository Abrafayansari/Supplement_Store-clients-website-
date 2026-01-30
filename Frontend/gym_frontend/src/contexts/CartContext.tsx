import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

import { Product, ProductVariant } from '@/types.ts';

interface CartItem {
  id: string; // Add ID from backend
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number, productId: string, variantId?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  showCart: () => Promise<boolean>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'supplement_store_cart';

// Fix: Use React.FC to explicitly define the children prop for the CartProvider component to resolve TS errors during usage.
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = async (product: Product, quantity = 1, variantId?: string) => {
    try {
      const res = await axios.post(`${API_URL}/addtocart`, {
        productId: product.id,
        variantId: variantId,
        quantity: quantity
      }
        , {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const variant = variantId ? product.variants.find(v => v.id === variantId) : null;
      toast.success(`${product.name} ${variant ? `(${variant.size}${variant.flavor ? ` - ${variant.flavor}` : ''})` : ''} added to protocol.`);
      await showCart(); // Refresh cart from server
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please login to add items to cart.");
        return;
      }
      toast.error(err.response?.data?.error || "Failed to add item to cart.");
    }
  };
  const removeFromCart = async (itemId: string) => {
    try {
      await axios.delete(`${API_URL}/removecart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setItems(prev => prev.filter(item => item.id !== itemId));
      toast.success("Item removed from cart");
    } catch (err: any) {
      toast.error("Failed to remove item from cart");
    }
  };


  const updateQuantity = async (itemId: string, quantity: number, productId: string, variantId?: string) => {
    try {
      await axios.post(
        `${API_URL}/updatecart`,
        { productId, variantId, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (quantity <= 0) {
        setItems(prev => prev.filter(item => item.id !== itemId));
      } else {
        setItems(prev =>
          prev.map(item =>
            item.id === itemId
              ? { ...item, quantity }
              : item
          )
        );
      }
    } catch (err: any) {
      toast.error("Failed to update cart");
    }
  };


  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/clearcart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setItems([]);
      toast.success("Cart cleared");
    } catch (err: any) {
      toast.error("Failed to clear cart");
    }
  };

  // Inside your CartContext.tsx
  const showCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const res = await axios.get(`${API_URL}/showcart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cartItems: CartItem[] = res.data.cartItems.map((ci: any) => ({
        id: ci.id,
        product: ci.product,
        variant: ci.variant,
        quantity: ci.quantity,
      }));

      setItems(cartItems);
      return true;
    } catch (err: any) {
      console.error("Failed to fetch cart:", err);
      return false;
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.variant ? item.variant.price : item.product.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      showCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;