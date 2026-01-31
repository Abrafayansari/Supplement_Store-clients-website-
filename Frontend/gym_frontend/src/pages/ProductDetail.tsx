import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Star,
    Minus,
    Plus,
    ShoppingBag,
    ArrowLeft,
    ShieldCheck,
    Zap,
    Beaker,
    Heart,
    Target,
    AlertTriangle,
    Loader2,
    Maximize2,
    ChevronRight,
    Award,
    CheckCircle2,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts, fetchProductById } from '../data/Product.tsx';
import { useCart } from '../contexts/CartContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Product } from '@/types.ts';
import api from '../lib/api';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge.tsx';
import NexusLoader from '../components/NexusLoader';

const ProductDetail: React.FC = () => {
    const [initialProducts, setInitialProducts] = useState<Array<any>>([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'details' | 'warnings' | 'directions' | 'reviews'>('details');
    const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedFlavor, setSelectedFlavor] = useState<string>('');
    const [activeImageIdx, setActiveImageIdx] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const { user, isAuthenticated } = useAuth();
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const refreshProduct = async () => {
        if (id) {
            const fetchedProduct = await fetchProductById(id);
            setProduct(fetchedProduct);
        }
    };

    useEffect(() => {
        const found = async () => {
            setFetching(true);
            try {
                if (id) {
                    const fetchedProduct = await fetchProductById(id);
                    setProduct(fetchedProduct);

                    if (fetchedProduct?.variants && fetchedProduct.variants.length > 0) {
                        const first = fetchedProduct.variants[0];
                        setSelectedSize(first.size);
                        setSelectedFlavor(first.flavor || '');
                        setSelectedVariant(first);
                    }
                }
                const { products: relatedProducts } = await fetchProducts({ sort: 'newest', limit: 4 });
                setInitialProducts(relatedProducts);
            } catch (err) {
                console.error(err);
            } finally {
                setFetching(false);
            }
        };
        found();
    }, [id]);

    useEffect(() => {
        if (product && selectedSize) {
            const variantsOfSize = product.variants.filter(v => v.size === selectedSize);
            if (variantsOfSize.length > 0) {
                // Try to find a variant with the current flavor, otherwise pick the first available variant of this size
                const match = variantsOfSize.find(v => v.flavor === selectedFlavor) || variantsOfSize[0];

                if (match.id !== selectedVariant?.id) {
                    setSelectedVariant(match);
                }

                // Keep selectedFlavor in sync - but only if it actually needs to change to avoid loops
                if (match.flavor !== selectedFlavor) {
                    setSelectedFlavor(match.flavor || '');
                }
            }
        }
    }, [selectedSize, selectedFlavor, product]);

    const uniqueSizes = Array.from(new Set(product?.variants?.map(v => v.size) || []));
    const availableFlavors = Array.from(new Set(product?.variants?.filter(v => v.size === selectedSize).map(v => v.flavor).filter(Boolean) || []));

    if (fetching) return (
        <div className="min-h-screen flex items-center justify-center bg-brand-matte">
            <NexusLoader />
        </div>
    );

    if (!product) return null;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (product.variants && product.variants.length > 0 && !selectedVariant) {
            toast.error("Please select a product variant");
            return;
        }
        if (!localStorage.getItem("token")) {
            toast.error("Login required");
            return;
        }
        if (loading) return;
        try {
            setLoading(true);
            await addToCart(product, quantity, selectedVariant?.id);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        if (product.variants && product.variants.length > 0 && !selectedVariant) {
            toast.error("Please select a product variant");
            return;
        }
        if (!localStorage.getItem("token")) {
            toast.error("Login required");
            return;
        }
        navigate('/checkout', { state: { singleItem: { product, quantity, variant: selectedVariant, variantId: selectedVariant?.id } } });
    };

    return (
        <div className="min-h-screen bg-brand-warm selection:bg-brand-gold selection:text-brand-matte font-sans text-brand-matte pb-20 mesh-bg">
            <div className="max-w-[1200px] mx-auto px-6 pt-20">

                {/* NAVIGATION */}
                <div className="mb-8 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-brand-matte/40 hover:text-brand-gold transition-luxury group"
                    >
                        <div className="w-8 h-8 rounded-full border border-brand-matte/10 flex items-center justify-center group-hover:border-brand-gold transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to Products
                    </button>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-brand-matte/20">
                        <span>Store</span>
                        <ChevronRight className="w-3 h-3" />
                        <span>{product.category}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-brand-gold">{product.name}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* LEFT: PRODUCT GALLERY (5 COLUMNS) */}
                    <div className="lg:col-span-6 space-y-8">
                        <div className="relative group">
                            {/* Accent Background */}
                            <div className="absolute inset-0 bg-brand/5 blur-3xl rounded-full"></div>

                            <div className="aspect-square glass-panel flex items-center justify-center p-8 border border-brand-matte/5 relative overflow-hidden group-hover:border-brand-matte/10 transition-luxury">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeImageIdx}
                                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                                        transition={{ duration: 0.4 }}
                                        src={product.images[activeImageIdx]}
                                        alt={product.name}
                                        className="max-h-full max-w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                                    />
                                </AnimatePresence>

                                {/* Badge */}
                                <div className="absolute top-8 left-8">
                                    <Badge className="bg-brand text-white font-black rounded-none px-3 py-1 border-none text-[9px] tracking-widest uppercase">
                                        Premium Product
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImageIdx(i)}
                                        className={`w-24 h-24 shrink-0 glass-panel border-2 p-4 transition-luxury relative group ${activeImageIdx === i ? 'border-brand-gold shadow-[0_5px_15px_rgba(201,162,77,0.15)]' : 'border-brand-matte/5 hover:border-brand-matte/20'}`}
                                    >
                                        <img src={img} alt="preview" className={`w-full h-full object-contain transition-all duration-500 ${activeImageIdx === i ? 'scale-110' : 'opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0'}`} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Security/Trust Badges */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-brand-matte/5">
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-12 h-12 rounded-full glass-panel border border-brand-matte/5 flex items-center justify-center text-brand-gold">
                                    <Award className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Lab Tested</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-12 h-12 rounded-full glass-panel border border-brand-matte/5 flex items-center justify-center text-brand-gold">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">100% Original</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-12 h-12 rounded-full glass-panel border border-brand-matte/5 flex items-center justify-center text-brand-gold">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Rapid Effects</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: PRODUCT INFO (7 COLUMNS) */}
                    <div className="lg:col-span-6 space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-brand-gold">
                                <span className="text-[11px] font-black uppercase tracking-[0.4em]">{product.brand}</span>
                                <div className="w-1.5 h-1.5 bg-brand-gold rotate-45"></div>
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-matte/30">SKU: {product.id.slice(-8).toUpperCase()}</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight text-brand-matte">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-6">
                                <div className="flex gap-1 text-brand-gold">
                                    {/* Star colors handled by fill attribute, text-white/10 -> text-brand-matte/10 */}
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-brand-matte/10'}`} />
                                    ))}
                                </div>
                                <span className="text-[11px] font-black text-brand-matte/40 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1 h-1 bg-brand-matte/10"></div>
                                    {product.reviews && product.reviews.length > 0 ? `${product.reviews.length} Customer Reviews` : 'No reviews yet'}
                                </span>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="space-y-2 p-6 glass-panel border border-brand-matte/5 border-l-brand-gold border-l-4">
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-black italic tracking-tighter text-brand-matte">
                                    Rs.{(selectedVariant ? (selectedVariant.discountPrice || selectedVariant.price) : (product.discountPrice || product.price)).toLocaleString()}
                                </span>
                                {((selectedVariant?.discountPrice && selectedVariant.discountPrice < selectedVariant.price) || (product.discountPrice && product.discountPrice < product.price)) && (
                                    <span className="text-xl text-brand-matte/20 line-through font-bold">
                                        Rs.{(selectedVariant?.price || product.price).toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1 bg-brand text-[10px] font-black uppercase tracking-widest">Limited Supply</div>
                                {(selectedVariant?.discountPrice || product.discountPrice) && (
                                    <span className="text-brand-gold text-[10px] font-bold uppercase tracking-widest">
                                        Save {Math.round((((selectedVariant?.price || product.price) - (selectedVariant?.discountPrice || product.discountPrice || 0)) / (selectedVariant?.price || product.price)) * 100)}% Today
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* VARIANT SELECTORS */}
                        <div className="space-y-8">
                            {/* Size Selector */}
                            {uniqueSizes.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-brand-gold rotate-45"></div>
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-matte/60">Select Size</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {uniqueSizes.map((sz: any) => (
                                            <button
                                                key={sz}
                                                onClick={() => setSelectedSize(sz)}
                                                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${selectedSize === sz
                                                    ? 'bg-brand-gold text-white shadow-lg shadow-brand-gold/20'
                                                    : 'bg-white text-brand-matte/60 border border-brand-matte/10 hover:border-brand-gold'
                                                    }`}
                                            >
                                                {sz}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Flavor Selector */}
                            {availableFlavors.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-brand-gold rotate-45"></div>
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-matte/60">Choose Flavor</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {availableFlavors.map((fl: any) => (
                                            <button
                                                key={fl}
                                                onClick={() => setSelectedFlavor(fl)}
                                                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${selectedFlavor === fl
                                                    ? 'bg-brand text-white shadow-lg shadow-brand/20'
                                                    : 'bg-white text-brand-matte/60 border border-brand-matte/10 hover:border-brand-gold'
                                                    }`}
                                            >
                                                {fl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Inventory Status */}
                        <div className="flex items-center gap-4 py-4 px-6 glass-panel border border-brand-matte/5">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-green-600">Ready for Immediate Dispatch</span>
                        </div>

                        {/* ACTIONS */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Quantity */}
                                <div className="flex items-center glass-panel border border-brand-matte/10 h-[54px] px-3 gap-4">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-brand-matte/40 hover:text-brand transition-colors">
                                        <Minus size={14} />
                                    </button>
                                    <div className="w-5 text-center font-black text-base italic">{quantity}</div>
                                    <button onClick={() => setQuantity(quantity + 1)} className="text-brand-matte/40 hover:text-brand transition-colors">
                                        <Plus size={14} />
                                    </button>
                                </div>

                                {/* Add to Cart */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={loading}
                                    className={`flex-grow btn-luxury h-[54px] px-8 group relative overflow-hidden flex items-center justify-center gap-3`}
                                >
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                    <ShoppingBag className="w-5 h-5 relative z-10" />
                                    <span className="relative z-10 uppercase font-black tracking-[0.2em] text-[13px]">Add to Cart</span>
                                    {loading && <Loader2 className="w-4 h-4 animate-spin relative z-10" />}
                                </button>

                                {/* Quick Actions */}
                                <div className="flex gap-3">
                                    <button className="w-[54px] h-[54px] glass-panel border border-brand-matte/10 flex items-center justify-center text-brand-matte hover:text-brand-gold transition-luxury hover:border-brand-gold group">
                                        <Heart className="w-5 h-5 transition-luxury group-hover:scale-110" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleBuyNow}
                                className="w-full h-[54px] border border-brand-matte/10 text-brand-matte/60 flex items-center justify-center font-black uppercase tracking-[0.3em] text-[10px] hover:bg-brand-matte hover:text-white transition-luxury"
                            >
                                Secure Buy It Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* TABS SECTION */}
                <div className="mt-20">
                    <div className="flex flex-wrap gap-6 border-b border-white/5 mb-8 justify-center">
                        {[
                            { id: 'details', label: 'Product Details', icon: Beaker },
                            { id: 'warnings', label: 'Safety Warnings', icon: AlertTriangle },
                            { id: 'directions', label: 'How to Use', icon: Target },
                            { id: 'reviews', label: 'Customer Reviews', icon: FileText }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-luxury relative flex items-center gap-2 ${activeTab === tab.id ? 'text-brand-gold' : 'text-brand-matte/40 hover:text-brand-matte'}`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold shadow-[0_0_10px_rgba(201,162,77,0.5)]" />}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="glass-panel p-8 border border-brand-matte/5 relative overflow-hidden text-brand-matte"
                            >
                                {/* Decorative Gradient */}
                                <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-gold/5 blur-[120px]"></div>

                                {activeTab === 'details' && (
                                    <div className="space-y-12">
                                        <div className="space-y-4">
                                            <h3 className="text-4xl font-black uppercase tracking-tighter italic">Product Description</h3>
                                            <div className="h-1.5 w-24 bg-brand-gold"></div>
                                        </div>
                                        <p className="text-brand-matte/60 leading-[1.8] text-xl font-light">
                                            {product.description || "Experience peak performance with our premium supplement formula."}
                                        </p>
                                        <div className="p-8 border-l border-brand-matte/10 bg-brand-matte/[0.03]">
                                            <h4 className="text-brand-matte/40 font-black uppercase tracking-widest text-[11px] mb-4">Category Details</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between border-b border-brand-matte/5 pb-2">
                                                    <span className="text-[10px] font-bold uppercase text-brand-matte/20">Category</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{product.category}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-brand-matte/5 pb-2">
                                                    <span className="text-[10px] font-bold uppercase text-brand-matte/20">Sub-Category</span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{product.subCategory || 'Premium Series'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'warnings' && (
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-4">
                                            <AlertTriangle className="w-8 h-8 text-brand" />
                                            <h3 className="text-4xl font-black uppercase tracking-tighter italic text-brand">Safety Warnings</h3>
                                        </div>
                                        <div className="bg-brand/5 p-12 border border-brand/20 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-[50px]"></div>
                                            <ul className="space-y-8 relative z-10">
                                                {(product.warnings && product.warnings.length > 0 ? product.warnings : ['Consult a healthcare professional before use.']).map((w, i) => (
                                                    <li key={i} className="flex gap-6 items-start text-brand-matte/80 font-medium text-lg leading-relaxed border-b border-brand-matte/5 pb-6 last:border-0 last:pb-0">
                                                        <div className="w-2 h-2 rounded-full bg-brand mt-2.5"></div>
                                                        {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'directions' && (
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-4">
                                            <Target className="w-8 h-8 text-brand-gold" />
                                            <h3 className="text-4xl font-black uppercase tracking-tighter italic">How to Use</h3>
                                        </div>
                                        <div className="p-12 glass-panel border border-brand-gold/10">
                                            <p className="text-brand-matte font-medium text-2xl leading-relaxed italic opacity-80 border-l-4 border-brand-gold pl-10">
                                                {product.directions || 'Follow the instructions on the label carefully. Store in a cool, dry place.'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'reviews' && (
                                    <div className="space-y-12">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-2">
                                                <h3 className="text-4xl font-black uppercase tracking-tighter italic">Product Reviews</h3>
                                                <div className="h-1.5 w-24 bg-brand-gold"></div>
                                            </div>
                                            {!showReviewForm && (
                                                <button
                                                    onClick={() => {
                                                        if (!isAuthenticated) {
                                                            toast.error("Please login to write a review");
                                                            navigate('/login');
                                                            return;
                                                        }
                                                        setShowReviewForm(true);
                                                    }}
                                                    className="btn-luxury px-8 py-3 text-[10px]"
                                                >
                                                    Write a Review
                                                </button>
                                            )}
                                        </div>

                                        {showReviewForm && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-brand-matte p-10 space-y-8 border-l-4 border-brand-gold relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold opacity-5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>

                                                <div className="flex justify-between items-center relative z-10">
                                                    <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Submit Your Feedback</h4>
                                                    <button onClick={() => setShowReviewForm(false)} className="text-white/40 hover:text-white transition-colors p-2">
                                                        <Plus className="w-5 h-5 rotate-45" />
                                                    </button>
                                                </div>

                                                <div className="space-y-4 relative z-10">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">Select Rating</p>
                                                    <div className="flex gap-4">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => {
                                                                    console.log('Selected Rating:', star);
                                                                    setReviewRating(star);
                                                                }}
                                                                className="transition-transform active:scale-90 hover:scale-110"
                                                            >
                                                                <Star className={`w-10 h-10 ${star <= reviewRating ? 'fill-brand-gold text-brand-gold drop-shadow-sm' : 'text-white/10'}`} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-4 relative z-10">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">Your Comments</p>
                                                    <textarea
                                                        value={reviewComment}
                                                        onChange={(e) => setReviewComment(e.target.value)}
                                                        rows={4}
                                                        className="w-full bg-white/5 border border-white/10 p-5 text-white outline-none focus:border-brand-gold transition-luxury resize-none text-sm placeholder:text-white/20"
                                                        placeholder="Share your experience with Nexus Elite..."
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        console.log('Submitting review:', { rating: reviewRating, comment: reviewComment });
                                                        if (reviewRating === 0) {
                                                            toast.error("Please select a rating");
                                                            return;
                                                        }
                                                        setSubmittingReview(true);
                                                        try {
                                                            const res = await api.post('/givereview', {
                                                                productId: product.id,
                                                                rating: reviewRating,
                                                                comment: reviewComment
                                                            });
                                                            console.log('Review submission success:', res.data);
                                                            toast.success("Thank you! Review posted successfully.");
                                                            setShowReviewForm(false);
                                                            setReviewRating(0);
                                                            setReviewComment('');
                                                            await refreshProduct();
                                                        } catch (err: any) {
                                                            console.error('Review submission error:', err);
                                                            const errorMsg = err.response?.data?.message || err.message || "Failed to submit review";
                                                            toast.error(errorMsg);
                                                        } finally {
                                                            setSubmittingReview(false);
                                                        }
                                                    }}
                                                    disabled={submittingReview}
                                                    className="btn-luxury px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 w-full relative z-10 overflow-hidden group"
                                                >
                                                    <div className="absolute inset-0 bg-brand-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                                    <span className="relative z-10 flex items-center gap-3">
                                                        {submittingReview ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Post Review"}
                                                    </span>
                                                </button>
                                            </motion.div>
                                        )}
                                        {product.reviews && product.reviews.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-8">
                                                {product.reviews.map((review: any, i: number) => (
                                                    <div key={i} className="glass-panel p-10 border border-brand-matte/5 space-y-6 relative group hover:border-brand-gold/30 transition-luxury">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex gap-1 text-brand-gold">
                                                                {[...Array(5)].map((_, stars) => (
                                                                    <Star key={stars} className={`w-4 h-4 ${stars < review.rating ? 'fill-current' : 'text-brand-matte/10'}`} />
                                                                ))}
                                                            </div>
                                                            <span className="text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.2em]">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'RECENT'}</span>
                                                        </div>
                                                        <p className="text-xl text-brand-matte/70 italic font-light leading-relaxed">"{review.comment}"</p>
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold font-black text-[10px]">
                                                                {(review.user?.name || 'V').charAt(0).toUpperCase()}
                                                            </div>
                                                            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-matte underline underline-offset-8 decoration-brand-gold">{review.user?.name || 'Verified Buyer'}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-24 text-center space-y-8 glass-panel border-2 border-dashed border-brand-matte/10">
                                                <FileText className="w-16 h-16 text-brand-matte/10 mx-auto" />
                                                <div className="space-y-2">
                                                    <p className="text-brand-matte/40 font-black uppercase tracking-widest text-xs">No reviews yet for this product.</p>
                                                    <p className="text-brand-matte/20 text-[10px] uppercase font-bold">Be the first to share your experience.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                <div className="mt-20">
                    <div className="flex justify-between items-end mb-8 border-b border-brand-matte/5 pb-6">
                        <div className="space-y-1">
                            <span className="text-brand-gold font-black uppercase tracking-[0.4em] text-[9px]">Recommended</span>
                            <h3 className="text-4xl font-black uppercase tracking-tighter italic">You May Also Like</h3>
                        </div>
                        <button onClick={() => navigate('/products')} className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-matte/40 hover:text-brand-matte border-b border-brand-matte/10 pb-1 transition-luxury">View All Products</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {initialProducts.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                            <div
                                key={p.id}
                                onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}
                                className="glass-panel p-6 group cursor-pointer border border-brand-matte/5 hover:border-brand/30 hover:shadow-xl transition-luxury relative"
                            >
                                <div className="aspect-square flex items-center justify-center p-6 bg-white/5 mb-8 relative group-hover:bg-brand/5 transition-colors">
                                    <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/5 transition-colors duration-700"></div>
                                    <img src={p.image || p.images?.[0]} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-luxury relative z-10 drop-shadow-2xl" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-brand-gold"></div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-matte/30 truncate">{p.category}</h4>
                                    </div>
                                    <h5 className="text-[13px] font-black uppercase tracking-tight text-brand-matte group-hover:text-brand transition-luxury line-clamp-1">{p.name}</h5>
                                    <p className="text-xl font-black italic tracking-tighter text-brand-matte">Rs.{p.price.toLocaleString()}</p>
                                </div>

                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-luxury">
                                    <ChevronRight className="text-brand-gold w-6 h-6" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;