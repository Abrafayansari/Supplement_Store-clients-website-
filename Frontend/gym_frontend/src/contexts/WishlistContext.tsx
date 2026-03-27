import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishlistItem } from '@/types';
import api from '../lib/api';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface WishlistContextType {
    items: WishlistItem[];
    addToWishlist: (product: any) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    checkIfWishlisted: (productId: string) => Promise<boolean>;
    showWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize from localStorage to avoid hydrate->persist race on mount
    const [items, setItems] = useState<WishlistItem[]>(() => {
        try {
            const stored = localStorage.getItem('nexus_wishlist_local');
            return stored ? JSON.parse(stored) : [];
        } catch (err) {
            console.error('Failed to read wishlist from localStorage', err);
            return [];
        }
    });
    const { user } = useAuth();

    const WISHLIST_STORAGE_KEY = 'nexus_wishlist_local';

    // Persist wishlist to localStorage so it stays available across sessions

    // Always persist wishlist to localStorage so it stays available across sessions
    useEffect(() => {
        try {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
        } catch (err) {
            console.error('Failed to persist wishlist to localStorage', err);
        }
    }, [items]);

    const showWishlist = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            // Already handled by local storage effect
            const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
            if (stored) setItems(JSON.parse(stored));
            return;
        }
        try {
            const res = await api.get('/wishlist');
            setItems(res.data.wishlist);
        } catch (err) {
            console.error("Failed to fetch wishlist", err);
        }
    };

    const addToWishlist = async (product: any) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                let added = false;
                setItems(prev => {
                    if (prev.find(item => item.product.id === product.id)) return prev;
                    added = true;
                    return [...prev, { id: Date.now().toString(), product: product, productId: product.id, user: 'local', createdAt: new Date().toISOString() } as any];
                });
                if (added) toast.success("Added to wishlist.");
                return;
            }
            // Suppress backend success toast; show manual toast only if created
            try {
                const res = await api.post('/wishlist', { productId: product.id }, { headers: { 'X-Suppress-Toast': '1' } });
                if (res && (res.status === 201 || res.status === 200)) {
                    toast.success("Added to wishlist.");
                }
            } catch (err: any) {
                // If backend says item already exists, suppress message
                if (err.response?.status === 400 && typeof err.response.data?.message === 'string' && err.response.data.message.toLowerCase().includes('already')) {
                    // do nothing
                } else {
                    console.error('Add to wishlist error (server):', err);
                }
            }
            await showWishlist();
        } catch (err: any) {
            console.error("Add to wishlist error:", err);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setItems(prev => prev.filter(item => item.productId !== productId && item.product.id !== productId));
                return;
            }

            await api.delete(`/wishlist/${productId}`, { headers: { 'X-Suppress-Toast': '1' } });

            setItems(prev => prev.filter(item => item.productId !== productId && item.product.id !== productId));
        } catch (err: any) {
            console.error("Remove from wishlist error:", err);
        }
    };

    const checkIfWishlisted = async (productId: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return items.some(item => item.product.id === productId);
        }
        try {
            const res = await api.get(`/wishlist/exists/${productId}`);
            return res.data.exists;
        } catch (err) {
            return false;
        }
    }

    useEffect(() => {
        const syncAndLoad = async () => {
            const token = localStorage.getItem('token');
            // If user just logged in, push local wishlist items to server first
            if (token) {
                const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
                if (stored) {
                    try {
                        const localItems: WishlistItem[] = JSON.parse(stored);
                        const productIds = Array.from(new Set(localItems.map(i => i.productId || i.product?.id)));
                        for (const pid of productIds) {
                            if (!pid) continue;
                            try {
                                await api.post('/wishlist', { productId: pid }, { headers: { 'X-Suppress-Toast': '1' } });
                            } catch (e) {
                                // ignore individual failures
                            }
                        }
                    } catch (err) {
                        console.error('Failed parsing local wishlist for sync', err);
                    }
                }
            }

            await showWishlist();
        };

        syncAndLoad();
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
