import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, Star, Zap, Shield, Flame, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import axios from 'axios';
import { Product } from '../../types';

const API_URL = import.meta.env.VITE_API_URL;

interface Bundle {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    products: Product[];
}

const Bundles: React.FC = () => {
    const { addToCart } = useCart();
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [loading, setLoading] = useState(true);
    const [hovered, setHovered] = useState<string | null>(null);

    useEffect(() => {
        const fetchBundles = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/bundles`);
                setBundles(res.data);
            } catch (err) {
                console.error('Failed to fetch bundles:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBundles();
    }, []);

    const handleAddBundle = async (bundle: Bundle) => {
        let addedCount = 0;

        // Add each product to cart sequentially to avoid race conditions and show clear toast sequence
        for (const p of bundle.products) {
            // add first variant of each product if variants exist
            if (p.variants && p.variants.length > 0) {
                await addToCart(p, 1, p.variants[0].id);
                addedCount++;
            }
        }

        if (addedCount > 0) {
            toast.success('Bundle Authorized', {
                description: `${bundle.name} compounds have been added to your procurement queue.`
            });
        } else {
            toast.error('Initialization Failed', {
                description: 'Could not resolve compound variants for this bundle.'
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <Package className="w-6 h-6" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Nexus Logistics</span>
                        </div>
                        <h1 className="text-6xl font-black text-brand tracking-tighter uppercase mb-4 leading-none">
                            Strategic <br /> Bundles
                        </h1>
                        <p className="text-brand-matte/60 uppercase tracking-[0.2em] font-bold text-xs max-w-md">
                            Engineered stacks for maximum physiological impact. Optimized for cost and performance.
                        </p>
                    </div>
                    <div className="hidden lg:block h-px flex-grow mx-12 bg-brand/10"></div>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center p-4 bg-white border border-brand/5 shadow-lg">
                            <span className="text-2xl font-black text-brand tracking-tighter">25%</span>
                            <span className="text-[8px] font-bold text-brand-matte/40 uppercase tracking-widest">Avg Savings</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-white border border-brand/5 shadow-lg">
                            <span className="text-2xl font-black text-brand tracking-tighter">Stack</span>
                            <span className="text-[8px] font-bold text-brand-matte/40 uppercase tracking-widest">Protocol</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-12 h-12 text-brand animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand/40">Accessing Bundle Archives...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {bundles.map((bundle) => (
                            <div
                                key={bundle.id}
                                className="group relative bg-white border border-brand/10 shadow-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full"
                                onMouseEnter={() => setHovered(bundle.id)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <div className={`absolute top-6 left-6 z-10 px-4 py-1 text-[9px] font-black uppercase tracking-widest text-white bg-black`}>
                                    Elite Stack
                                </div>

                                <div className="relative h-72 overflow-hidden bg-gray-200">
                                    <img
                                        src={bundle.image || 'https://images.unsplash.com/photo-1593095191850-2a0bf3a772bf?auto=format&fit=crop&q=80&w=800'}
                                        alt={bundle.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                        <div className="flex gap-4 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                                <Shield className="w-5 h-5" />
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                                <Flame className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-red-500 fill-red-500' : 'text-gray-300 fill-gray-300'}`} />
                                        ))}
                                        <span className="text-[10px] font-bold text-brand-matte/40 ml-2">(4.0)</span>
                                    </div>

                                    <h3 className="text-2xl font-black text-brand uppercase tracking-tighter mb-4 group-hover:text-red-600 transition-colors">
                                        {bundle.name}
                                    </h3>

                                    <p className="text-brand-matte/60 text-sm leading-relaxed mb-8 font-medium">
                                        {bundle.description}
                                    </p>

                                    <div className="space-y-3 mb-8 flex-grow">
                                        {bundle.products?.map((p: any) => (
                                            <div key={p.id} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-brand-matte/80">
                                                <div className="w-1.5 h-1.5 bg-red-600"></div>
                                                {p.name}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-8 border-t border-brand/10 mt-auto">
                                        <div className="flex flex-col">
                                            {bundle.originalPrice && (
                                                <span className="text-xs text-brand-matte/40 font-bold line-through tracking-widest leading-none mb-1">
                                                    ${bundle.originalPrice}
                                                </span>
                                            )}
                                            <span className="text-3xl font-black text-brand tracking-tighter leading-none">
                                                ${bundle.price}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleAddBundle(bundle)}
                                            className="p-5 bg-black text-white hover:bg-red-600 transition-luxury shadow-xl group/btn"
                                        >
                                            <ShoppingCart className="w-6 h-6 transition-transform group-hover/btn:scale-110" />
                                        </button>
                                    </div>
                                </div>

                                <div className={`absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-500 ${hovered === bundle.id ? 'w-full' : 'w-0'}`}></div>
                            </div>
                        ))}
                    </div>
                )}

                {bundles.length === 0 && !loading && (
                    <div className="py-20 text-center">
                        <Package className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-brand uppercase tracking-tighter">No Bundles Deployed</h3>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Strategic archives are currently empty.</p>
                    </div>
                )}

                <div className="mt-20 bg-brand-matte p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600 skew-x-12 translate-x-1/2 opacity-10"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                                Need a Custom Strategy?
                            </h2>
                            <p className="text-white/60 uppercase tracking-widest font-bold text-xs">
                                Contact our elite trainers for a personalised supplementation protocol.
                            </p>
                        </div>
                        <button className="px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[12px] hover:bg-red-600 hover:text-white transition-luxury shadow-2xl">
                            Initialize Consultation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bundles;
