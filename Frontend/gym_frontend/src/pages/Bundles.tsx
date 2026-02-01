import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowRight, Package, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import { Product } from '@/types';
import NexusLoader from '../components/NexusLoader';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import api from '../lib/api';

interface Bundle {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string | null;
    products: Product[];
}

const Bundles: React.FC = () => {
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const loadBundles = async () => {
            try {
                const response = await api.get('/bundles');
                setBundles(response.data);
            } catch (error) {
                console.error('Error fetching bundles:', error);
                toast.error('Failed to load bundles');
            } finally {
                setLoading(false);
            }
        };
        loadBundles();
    }, []);

    const handleAddBundleToCart = (bundle: Bundle) => {
        if (bundle.products && bundle.products.length > 0) {
            bundle.products.forEach((product: any) => {
                const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
                addToCart(product, 1, firstVariant);
            });
            toast.success(`${bundle.name} items added to cart`);
        } else {
            toast.error('Bundle contains no products');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-brand-warm flex items-center justify-center">
            <NexusLoader />
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-warm pt-32 pb-40">
            <div className="max-w-[1700px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-px bg-brand"></span>
                            <span className="text-[10px] font-black text-brand uppercase tracking-[0.4em]">Curated Sets</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-brand-matte uppercase tracking-tighter leading-tight">
                            Product <br />
                            <span className="text-brand italic">Bundles</span>
                        </h1>
                    </div>
                    <p className="max-w-md text-brand-matte/50 text-sm font-medium leading-relaxed uppercase tracking-widest italic">
                        Hand-picked product combinations designed for maximum efficiency and value.
                    </p>
                </div>

                {bundles.length === 0 ? (
                    <div className="py-32 text-center bg-white border border-brand-matte/5 p-12 shadow-sm">
                        <Package className="w-16 h-16 text-brand/20 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-brand-matte/50 uppercase tracking-tighter mb-4">No bundles available at the moment</h2>
                        <button onClick={() => navigate('/products')} className="inline-block bg-brand hover:bg-brand-matte text-white font-black uppercase tracking-widest py-4 px-10 transition-all shadow-xl shadow-brand/10 text-[12px]">
                            Explore Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {bundles.map((bundle) => (
                            <div
                                key={bundle.id}
                                className="bg-white group relative overflow-hidden flex flex-col md:flex-row border border-brand-matte/5 hover:shadow-2xl transition-all duration-700 shadow-sm"
                            >
                                {/* Visual Side */}
                                <div className="w-full md:w-2/5 aspect-square md:aspect-auto relative bg-brand-warm/30 overflow-hidden">
                                    <img
                                        src={bundle.image || (bundle.products[0]?.images?.[0]) || "https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&q=80&w=800"}
                                        alt={bundle.name}
                                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-matte/40 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6">
                                        <div className="bg-brand text-white text-[10px] font-black px-4 py-2 uppercase tracking-[0.2em] shadow-lg">
                                            Bundle Offer
                                        </div>
                                    </div>
                                </div>

                                {/* Info Side */}
                                <div className="w-full md:w-3/5 p-10 flex flex-col justify-between relative bg-white">
                                    <div>
                                        <div className="flex justify-between items-start mb-6 gap-4">
                                            <h2 className="text-3xl font-black text-brand-matte uppercase tracking-tight leading-none group-hover:text-brand transition-colors line-clamp-2" title={bundle.name}>
                                                {bundle.name}
                                            </h2>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="text-3xl font-black text-brand italic tracking-tighter">
                                                    Rs.{bundle.price.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-brand-matte/40 text-[11px] font-black uppercase tracking-[0.2em] mb-8 border-b border-brand-matte/5 pb-6 line-clamp-3 min-h-[44px]">
                                            {bundle.description || "Comprehensive package for elite performance."}
                                        </p>

                                        <div className="space-y-4 mb-10 overflow-hidden">
                                            <p className="text-[9px] font-black text-brand-gold uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-4 h-4 rounded-full bg-brand-gold/10 flex items-center justify-center text-[8px] text-brand-gold">✓</span>
                                                Includes {bundle.products.length} Products
                                            </p>
                                            <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto no-scrollbar">
                                                {bundle.products.map((product: any, idx: number) => (
                                                    <Badge
                                                        key={idx}
                                                        className="bg-brand-warm text-brand-matte/60 border-none rounded-none text-[9px] font-black px-3 py-1 uppercase tracking-widest hover:bg-brand hover:text-white transition-colors truncate max-w-[150px]"
                                                        title={product.name}
                                                    >
                                                        {product.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                        <button
                                            onClick={() => handleAddBundleToCart(bundle)}
                                            className="flex-grow bg-brand text-white py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-matte transition-all shadow-xl shadow-brand/10 flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Add Bundle To Cart
                                        </button>
                                        <button
                                            onClick={() => navigate('/products')}
                                            className="bg-brand-matte text-white p-4 hover:bg-brand transition-all shadow-xl shadow-brand-matte/5 active:scale-95"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Custom Bundle CTA */}
                <div className="mt-40 bg-brand-matte p-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-brand skew-x-12 translate-x-1/2 opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                        <div>
                            <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                                Need a <span className="text-brand">Custom</span> <br /> Bundle?
                            </h2>
                            <p className="text-white/40 uppercase tracking-[0.3em] font-black text-[10px]">
                                Our experts can design a personalized set for your specific goals.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/contact')}
                            className="px-12 py-6 bg-brand text-white font-black uppercase tracking-[0.4em] text-[12px] hover:bg-white hover:text-brand-matte transition-all shadow-2xl shadow-brand/20"
                        >
                            Get Consultation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bundles;
