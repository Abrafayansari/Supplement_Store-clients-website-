import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types.ts';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

interface CartItem {
  product: Product;
  quantity: number;

}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  showCart: () => void;
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

  const addToCart = async (product: Product, quantity = 1) => {
    try {
      const res = await axios.post(`${API_URL}/addtocart`, {
        productId: product.id,
        quantity: quantity
      }
        , {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      if (res.status === 401) {
        toast.error("Please login to add items to cart.");
        return;
      }
      toast.success(`${product.name} added to protocol.`);

      //setItems(res.data.cartItem)
    }
    catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please login to add items to cart.");
        return;
      }
      toast.error("Failed to add item to cart.");
    }
  };
  const removeFromCart = async (productId: string) => {
    try {
      await axios.delete(`${API_URL}/removecart/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setItems(prev => prev.filter(item => item.product.id !== productId));
      toast.success("Item removed from cart");
    } catch (err: any) {
      toast.error("Failed to remove item from cart");
    }
  };


  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      await axios.post(
        `${API_URL}/updatecart`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      // Optimistic UI update
      if (quantity <= 0) {
        setItems(prev => prev.filter(item => item.product.id !== productId));
      } else {
        setItems(prev =>
          prev.map(item =>
            item.product.id === productId
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
    if (!token) {
      toast.error("Login required to view cart.");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/showcart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Map backend cart items to frontend CartItem structure
      const cartItems: CartItem[] = res.data.cartItems.map((ci: any) => ({
        product: ci.product,
        quantity: ci.quantity,
      }));

      setItems(cartItems);
    } catch (err: any) {
      console.error("Failed to fetch cart:", err);
      toast.error("Failed to load cart");
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
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