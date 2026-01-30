import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishlistItem } from '@/types';
import api from '../lib/api';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface WishlistContextType {
    items: WishlistItem[];
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    checkIfWishlisted: (productId: string) => Promise<boolean>;
    showWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const { user } = useAuth();

    const showWishlist = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setItems([]);
            return;
        }
        try {
            const res = await api.get('/wishlist');
            setItems(res.data.wishlist);
        } catch (err) {
            console.error("Failed to fetch wishlist", err);
        }
    };

    const addToWishlist = async (productId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to add items to wishlist.");
                return;
            }
            await api.post('/wishlist', { productId });
            showWishlist();
        } catch (err: any) {
            console.error("Add to wishlist error:", err);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await api.delete(`/wishlist/${productId}`);

            setItems(prev => prev.filter(item => item.productId !== productId && item.product.id !== productId));
        } catch (err: any) {
            console.error("Remove from wishlist error:", err);
        }
    };

    const checkIfWishlisted = async (productId: string) => {
        const token = localStorage.getItem("token");
        if (!token) return false;
        try {
            const res = await api.get(`/wishlist/exists/${productId}`);
            return res.data.exists;
        } catch (err) {
            return false;
        }
    }

    useEffect(() => {
        showWishlist();
    }, [user]);

    return (
        <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, showWishlist, checkIfWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within WishlistProvider');
    return context;
};
