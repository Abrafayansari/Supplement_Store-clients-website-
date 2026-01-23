import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishlistItem } from '@/types';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.REACT_APP_API_URL;

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
            const res = await axios.get(`${API_URL}/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
            await axios.post(`${API_URL}/wishlist`,
                { productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Added to wishlist");
            showWishlist();
        } catch (err: any) {
            if (err.response?.status === 400 && err.response?.data?.message === "Product already in wishlist") {
                toast.info("Product already in wishlist");
            } else {
                toast.error("Failed to add to wishlist");
            }
        }
    };

    const removeFromWishlist = async (productId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await axios.delete(`${API_URL}/wishlist/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setItems(prev => prev.filter(item => item.productId !== productId && item.product.id !== productId));
            toast.success("Removed from wishlist");
        } catch (err: any) {
            toast.error("Failed to remove from wishlist");
        }
    };

    const checkIfWishlisted = async (productId: string) => {
        const token = localStorage.getItem("token");
        if (!token) return false;
        try {
            const res = await axios.get(`${API_URL}/wishlist/exists/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
