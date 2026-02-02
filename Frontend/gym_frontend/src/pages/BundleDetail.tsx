import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ShoppingBag, CreditCard, ArrowLeft, Loader2, Package, CheckCircle2, ChevronRight, Heart, Star, ShieldCheck, Zap, Target } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import api from '../lib/api';
import { Product, Bundle } from '@/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import NexusLoader from '../components/NexusLoader';

const BundleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { addToWishlist, removeFromWishlist, checkIfWishlisted } = useWishlist();

    const [bundle, setBundle] = useState<Bundle | null>(null);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'products'>('details');
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchBundle = async () => {
            try {
                const res = await api.get(`/bundle/${id}`);
                setBundle(res.data);

                // Check if any product in bundle is wishlisted (or just keep it simple)
                // For bundles, maybe we don't have a direct wishlisting yet, but let's assume it works like a product for now
                // Actually, the wishlist context currently works with product IDs. 
                // We'll skip wishlist for the bundle itself unless the backend supports it.
            } catch (err) {
                console.error('Failed to fetch bundle:', err);
                toast.error('Failed to load bundle details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBundle();
    }, [id]);

    const handleAddAllToCart = async () => {
        if (!bundle) return;
        setAddingToCart(true);
        try {
            for (const product of bundle.products) {
                const firstVariantId = product.variants && product.variants.length > 0 ? product.variants[0].id : undefined;
                await addToCart(product, 1, firstVariantId);
            }
            toast.success(`All ${bundle.products.length} items from ${bundle.name} added to cart`);
        } catch (err) {
            toast.error('Failed to add bundle to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!bundle) return;
        if (!isAuthenticated) {
            toast.error("Please login to purchase");
            navigate('/login');
            return;
        }

        // For Buy Now, we add to cart and redirect immediately
        setAddingToCart(true);
        try {
            // Option: Clear cart first? Or just add.
            // Let's just add and navigate.
            for (const product of bundle.products) {
                const firstVariantId = product.variants && product.variants.length > 0 ? product.variants[0].id : undefined;
                await addToCart(product, 1, firstVariantId);
            }
            navigate('/checkout');
        } catch (err) {
            toast.error('Failed to process bundle purchase');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleWishlistAll = async () => {
        if (!bundle) return;
        if (!isAuthenticated) {
            toast.error("Please login to wishlist items");
            navigate('/login');
            return;
        }
        try {
            for (const product of bundle.products) {
                const isItemWishlisted = await checkIfWishlisted(product.id);
                if (!isItemWishlisted) {
                    await addToWishlist(product.id);
                }
            }
            toast.success(`Successfully added items to your wishlist`);
        } catch (err) {
            toast.error('Failed to wishlist items');
        }
    };

    if (loading) return <NexusLoader />;
    if (!bundle) return (
        <div className="min-h-screen pt-40 text-center">
            <h1 className="text-4xl font-black text-brand-matte uppercase">Bundle Not Found</h1>
            <Link to="/bundles" className="text-brand-gold font-black uppercase tracking-widest mt-8 inline-block hover:text-brand">Back to Bundles</Link>
        </div>
    );

    const calculatedOriginalPrice = bundle.products.reduce((sum, p) => sum + p.price, 0);
    const displayOriginalPrice = bundle.originalPrice || calculatedOriginalPrice;
    const discountPercentage = displayOriginalPrice > bundle.price
        ? Math.round(((displayOriginalPrice - bundle.price) / displayOriginalPrice) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-brand-warm pb-32 pt-10">
            {/* Breadcrumbs */}
            <div className="container mx-auto px-6 mb-12">
                <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em]">
                    <Link to="/" className="text-brand-matte/30 hover:text-brand transition-colors">Nexus</Link>
                    <ChevronRight className="w-3 h-3 text-brand-matte/10" />
                    <Link to="/bundles" className="text-brand-matte/30 hover:text-brand transition-colors">Bundles</Link>
                    <ChevronRight className="w-3 h-3 text-brand-matte/10" />
                    <span className="text-brand truncate max-w-[200px]">{bundle.name}</span>
                </nav>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

                    {/* Image Section - Left (5 cols) */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="aspect-square bg-white border border-brand-matte/5 relative group overflow-hidden shadow-2xl"
                        >
                            <img
                                src={bundle.image || (bundle.products[0]?.images?.[0]) || "https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&q=80&w=1200"}
                                alt={bundle.name}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            {discountPercentage > 0 && (
                                <div className="absolute top-8 left-8 bg-brand text-white text-xs font-black px-6 py-2 uppercase tracking-[0.2em] shadow-xl rotate-[-2deg] z-10">
                                    Save {discountPercentage}%
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Info Section - Right (7 cols) */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="bg-brand-gold text-brand-matte text-[9px] font-black px-3 py-1 uppercase tracking-widest">
                                        Exclusive Bundle
                                    </span>
                                    <button
                                        onClick={handleWishlistAll}
                                        className="flex items-center gap-2 text-[9px] font-black uppercase text-brand-matte/40 hover:text-brand transition-colors"
                                    >
                                        <Heart className="w-3 h-3" /> Wishlist Complete Bundle
                                    </button>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-brand-matte uppercase tracking-tighter leading-tight italic">
                                    {bundle.name}
                                </h1>
                            </div>

                            <div className="flex items-end gap-6 border-b border-brand-matte/5 pb-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em]">Bundle Price</p>
                                    <p className="text-5xl font-black text-brand italic tracking-tighter leading-none">
                                        Rs.{bundle.price.toFixed(2)}
                                    </p>
                                </div>
                                {displayOriginalPrice > bundle.price && (
                                    <div className="pb-1">
                                        <p className="text-2xl font-black text-brand-matte/20 line-through tracking-tighter decoration-brand/30">
                                            Rs.{displayOriginalPrice.toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* <p className="text-xl text-brand-matte/60 font-light leading-relaxed max-w-2xl">
                                {bundle.description || "The ultimate performance collection curated for those who demand excellence."}
                            </p> */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                                <button
                                    onClick={handleAddAllToCart}
                                    disabled={addingToCart}
                                    className="btn-luxury py-6 text-sm flex items-center justify-center gap-4 group"
                                >
                                    {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                    Add All To Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={addingToCart}
                                    className="bg-brand-matte text-white py-6 text-sm font-black uppercase tracking-[0.4em] hover:bg-brand transition-all flex items-center justify-center gap-4 group"
                                >
                                    <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Buy Now
                                </button>
                            </div>
                        </motion.div>

                        {/* Tabs Section */}
                        <div className="space-y-8">
                            <div className="flex gap-12 border-b border-brand-matte/5">
                                {['details', 'products'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`pb-4 text-[10px] font-black uppercase tracking-[0.4em] relative transition-all ${activeTab === tab ? 'text-brand' : 'text-brand-matte/30 hover:text-brand-matte'}`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div layoutId="bundle-tab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-brand" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === 'details' ? (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-8 text-brand-matte/60 text-lg font-light leading-loose p-8 border border-brand-matte/5 bg-white/50"
                                    >
                                        <div className="space-y-6">
                                            <p className="font-bold text-brand-matte uppercase text-[10px] tracking-[0.2em] border-l-4 border-brand-gold pl-4">About this bundle</p>
                                            <p>{bundle.description || "This premium bundle has been scientifically curated to provide a comprehensive nutritional foundation. Each product within the set works synergistically to optimize your performance, recovery, and overall wellness."}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-brand-matte/5">
                                            <div className="space-y-3">
                                                <ShieldCheck className="w-8 h-8 text-brand-gold" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-matte">Certified Quality</h4>
                                                <p className="text-[9px] uppercase tracking-widest leading-loose">All products undergo rigorous testing for purity and potency.</p>
                                            </div>
                                            <div className="space-y-3">
                                                <Zap className="w-8 h-8 text-brand" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-matte">Peak Synergy</h4>
                                                <p className="text-[9px] uppercase tracking-widest leading-loose">Formulated to work together for enhanced biological uptake.</p>
                                            </div>
                                            <div className="space-y-3">
                                                <Target className="w-8 h-8 text-white bg-brand-matte p-1.5" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-matte">Result Driven</h4>
                                                <p className="text-[9px] uppercase tracking-widest leading-loose">Guaranteed performance milestones when used as directed.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="products"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                    >
                                        {bundle.products.map((p) => (
                                            <Link
                                                to={`/product/${p.id}`}
                                                key={p.id}
                                                className="flex items-center gap-6 p-4 bg-white border border-brand-matte/5 hover:border-brand-gold/30 transition-all group"
                                            >
                                                <div className="w-20 h-20 bg-brand-warm p-2 shrink-0 overflow-hidden">
                                                    <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div className="space-y-1 overflow-hidden">
                                                    <h4 className="text-[11px] font-black text-brand-matte uppercase tracking-tight truncate leading-tight group-hover:text-brand transition-colors">{p.name}</h4>
                                                    <p className="text-[9px] font-bold text-brand-gold uppercase tracking-widest">{p.category}</p>
                                                    <p className="text-[10px] font-black text-brand-matte italic">Rs.{p.price.toFixed(2)}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BundleDetail;
