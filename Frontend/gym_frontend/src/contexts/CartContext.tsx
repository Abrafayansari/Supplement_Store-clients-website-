import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import api from '../lib/api';
import { toast } from 'sonner';

import { Product, ProductVariant } from '@/types.ts';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string; // Add ID from backend
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  synced?: boolean;
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
  // Initialize from localStorage to avoid hydrate->persist race on mount
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Failed to read cart from localStorage', err);
      return [];
    }
  });
  const { user } = useAuth();

  // When a user logs in (transition from unauthenticated -> authenticated), sync local anonymous cart items to server
  const prevUserRef = useRef<typeof user | null>(null);
  useEffect(() => {
    const syncLocalCartToServer = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return;

      let localItems: CartItem[] = [];
      try {
        localItems = JSON.parse(stored);
      } catch (err) {
        console.error('Failed to parse local cart for sync', err);
        return;
      }

      if (!Array.isArray(localItems) || localItems.length === 0) return;

      try {
        // Fetch server cart to compute correct merges
        const res = await api.get('/showcart');
        const serverItems: any[] = res.data.cartItems || [];

        // Map server items by productId + variantId for quick lookup
        const keyOf = (pId: string, vId?: string) => `${pId}::${vId || ''}`;
        const serverMap = new Map<string, any>();
        for (const si of serverItems) {
          const k = keyOf(si.product.id, si.variant?.id);
          serverMap.set(k, si);
        }

        // Aggregate local items by key
        const localAgg = new Map<string, { productId: string; variantId?: string; qty: number }>();
        for (const li of localItems) {
          const pId = li.product.id;
          const vId = li.variant?.id;
          const k = keyOf(pId, vId);
          const existing = localAgg.get(k);
          if (existing) existing.qty += li.quantity || 0;
          else localAgg.set(k, { productId: pId, variantId: vId, qty: li.quantity || 0 });
        }

        // For each aggregated local item, compute delta relative to server and only apply positive deltas
        for (const [k, ag] of localAgg.entries()) {
          const serverMatch = serverMap.get(k);
          if (serverMatch) {
            const serverQty = serverMatch.quantity || 0;
            const localQty = ag.qty || 0;
            const delta = localQty - serverQty;
            if (delta > 0) {
              const newQty = serverQty + delta;
              // suppress global toasts for these background sync calls
              await api.post('/updatecart', { productId: ag.productId, variantId: ag.variantId, quantity: newQty }, { headers: { 'X-Suppress-Toast': '1' } });
            }
          } else {
            await api.post('/addtocart', { productId: ag.productId, variantId: ag.variantId, quantity: ag.qty }, { headers: { 'X-Suppress-Toast': '1' } });
          }
        }

        // After sync, refresh canonical cart from server and persist locally
        await showCart();
      } catch (err) {
        console.error('Failed to sync local cart to server', err);
      }
    };

    // Only attempt sync when user transitions from not-logged-in -> logged-in
    if (!prevUserRef.current && user) {
      syncLocalCartToServer();
    }
    prevUserRef.current = user;
  }, [user]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = async (product: Product, quantity = 1, variantId?: string) => {
    try {
      const token = localStorage.getItem("token");
      const variant = variantId && product.variants ? product.variants.find(v => v.id === variantId) : null;
      
      if (token) {
        // Suppress backend success toast; show manual toast below
        await api.post('/addtocart', {
          productId: product.id,
          variantId: variantId,
          quantity: quantity
        }, { headers: { 'X-Suppress-Toast': '1' } });
        await showCart(); // Refresh cart from server
      } else {
        // Local add to cart
        setItems(prev => {
          const existing = prev.find(item => item.product.id === product.id && item.variant?.id === variantId);
          if (existing) {
            return prev.map(item => item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item);
          } else {
            return [...prev, { id: Date.now().toString(), product, variant: variant || undefined, quantity }];
          }
        });
      }

      toast.success(`${product.name} ${variant ? `(${variant.size}${variant.flavor ? ` - ${variant.flavor}` : ''})` : ''} added to cart.`);
    } catch (err: any) {
      console.error("Add to cart error:", err);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Suppress toast for background deletion (only show toast on user-initiated add)
        await api.delete(`/removecart/${itemId}`, { headers: { 'X-Suppress-Toast': '1' } });
      }
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err: any) {
      console.error("Remove from cart error:", err);
    }
  };


  const updateQuantity = async (itemId: string, quantity: number, productId: string, variantId?: string) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Suppress toasts for background update operations
        await api.post(
          '/updatecart',
          { productId, variantId, quantity },
          { headers: { 'X-Suppress-Toast': '1' } }
        );
      }

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
      console.error("Update quantity error:", err);
    }
  };


  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await api.delete('/clearcart', { headers: { 'X-Suppress-Toast': '1' } });
      }
      setItems([]);
    } catch (err: any) {
      console.error("Clear cart error:", err);
    }
  };

  // Inside your CartContext.tsx
  const showCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const res = await api.get('/showcart');

      const cartItems: CartItem[] = res.data.cartItems.map((ci: any) => ({
        id: ci.id,
        product: ci.product,
        variant: ci.variant,
        quantity: ci.quantity,
        synced: true,
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
    (sum, item) => {
      const price = item.variant
        ? (item.variant.discountPrice || item.variant.price)
        : (item.product.discountPrice || item.product.price);
      return sum + price * item.quantity;
    },
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