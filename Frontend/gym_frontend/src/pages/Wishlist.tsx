
import React, { useEffect, useState } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { ShoppingCart, Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const Wishlist: React.FC = () => {
    const { items, showWishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        showWishlist();
    }, []);

    const handleAddToCart = async (product: any) => {
        addToCart(product, 1);
    };

    const handleRemove = async (productId: string) => {
        await removeFromWishlist(productId);
    }

    return (
        <div className="bg-brand-matte min-h-screen pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12">
                    Your <span className="text-brand-gold italic">Wishlist</span>
                </h1>

                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <Heart className="w-16 h-16 text-brand-gold/20 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-white/50 uppercase tracking-widest mb-4">Your wishlist is empty</h2>
                        <Link to="/products" className="inline-block bg-brand hover:bg-brand-gold text-white font-black uppercase tracking-widest py-3 px-8 transition-luxury">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map(item => (
                            <div key={item.id} className="group relative bg-brand-matte/5 border border-brand-matte/10 rounded-none overflow-hidden transition-luxury hover:shadow-2xl flex flex-col h-[440px]">
                                <Link to={`/product/${item.product.id}`} className="block h-[280px] overflow-hidden relative">
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        <span className="bg-brand-gold/90 text-brand-matte text-[10px] font-black px-2 py-1 uppercase tracking-wider backdrop-blur-sm">
                                            Saved
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemove(item.product.id);
                                        }}
                                        className="absolute top-3 right-3 p-2 bg-white/90 text-brand-matte hover:text-red-500 hover:bg-white transition-colors rounded-none shadow-sm z-10"
                                        title="Remove from Wishlist"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleAddToCart(item.product);
                                        }}
                                        className={`absolute bottom-0 left-0 right-0 bg-brand text-white py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${'translate-y-full group-hover:translate-y-0'}`}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        ADD TO CART
                                    </button>
                                </Link>
                                <div className="p-5 flex-grow flex flex-col justify-between bg-white">
                                    <div>
                                        <p className="text-[9px] font-black text-brand-gold uppercase tracking-[0.2em] mb-1">
                                            {item.product.category}
                                        </p>
                                        <Link to={`/product/${item.product.id}`} className="block">
                                            <h3 className="text-sm font-black text-brand-matte uppercase tracking-tight line-clamp-2 leading-tight hover:text-brand transition-colors">
                                                {item.product.name}
                                            </h3>
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-matte/5">
                                        <span className="text-xl font-black text-brand italic tracking-tighter">
                                            Rs. {item.product.price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
