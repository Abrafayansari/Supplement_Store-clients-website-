import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingBag, ArrowLeft, ShieldCheck, Zap, Beaker, FileText, Share2, Heart, FlaskConical, Target, Droplets, AlertTriangle, PlayCircle, CreditCard, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts, fetchProductById } from '../data/Product.tsx';
import { useCart } from '../contexts/CartContext.tsx';
import { Product } from '@/types.ts';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge.tsx';
import axios from 'axios';
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
                // Fetch related products separately
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
            const matches = product.variants.filter(v => v.size === selectedSize && (v.flavor === selectedFlavor || !v.flavor));
            if (matches.length > 0) {
                // If current flavor doesn't exist for new size, pick first available
                if (selectedFlavor && !matches.some(m => m.flavor === selectedFlavor)) {
                    setSelectedFlavor(matches[0].flavor || '');
                    setSelectedVariant(matches[0]);
                } else {
                    setSelectedVariant(matches.find(m => m.flavor === selectedFlavor) || matches[0]);
                }
            }
        }
    }, [selectedSize, selectedFlavor, product]);

    // Helper to get unique sizes and flavors for filtering
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
        e.stopPropagation();

        if (product.variants && product.variants.length > 0 && !selectedVariant) {
            toast.error("Please select a protocol variant");
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
        e.stopPropagation();

        if (product.variants && product.variants.length > 0 && !selectedVariant) {
            toast.error("Please select a protocol variant");
            return;
        }

        if (!localStorage.getItem("token")) {
            toast.error("Login required");
            return;
        }
        navigate('/checkout', { state: { singleItem: { product, quantity, variant: selectedVariant, variantId: selectedVariant?.id } } });
    };

    const isNew = (product: Product) => {
        const now = new Date();
        const createdAt = new Date(product.createdAt);
        const diffInDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return diffInDays <= 30;
    };


    return (
        <div className="min-h-screen bg-brand-warm selection:bg-brand selection:text-white font-sans text-brand-matte pb-20">
            <div className="max-w-[1200px] mx-auto px-6 pt-32">
                
                {/* BREADCRUMB */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-zinc-400 hover:text-brand transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Products
                    </button>
                </div>

                <div className="bg-white p-8 md:p-12 shadow-sm border border-zinc-100 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {/* LEFT: PRODUCT IMAGE */}
                    <div className="space-y-6">
                        <div className="aspect-square bg-white flex items-center justify-center p-4 border border-zinc-100 relative group overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImageIdx}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    src={product.images[activeImageIdx]}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </AnimatePresence>
                        </div>
                        
                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImageIdx(i)}
                                        className={`w-20 h-20 shrink-0 border-2 p-2 transition-all ${activeImageIdx === i ? 'border-brand' : 'border-zinc-100'}`}
                                    >
                                        <img src={img} alt="preview" className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: PRODUCT INFO */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-matte leading-tight">
                                {product.name}
                            </h1>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex text-brand-gold">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-zinc-200'}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-zinc-500">
                                    {product.reviews && product.reviews.length > 0 ? `${product.reviews.length} reviews` : 'No reviews'}
                                </span>
                            </div>

                            <div className="text-[13px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <span>BY {product.brand}</span>
                                <span className="text-zinc-200">|</span>
                                <span>SKU: {product.id.slice(-8).toUpperCase()}</span>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="text-2xl font-extrabold text-brand-matte">
                            {product.variants && product.variants.length > 0 ? (
                                <>
                                    Rs.{(Math.min(...product.variants.map(v => v.price))).toLocaleString()} - Rs.{(Math.max(...product.variants.map(v => v.price))).toLocaleString()}
                                </>
                            ) : (
                                <>Rs.{product.price.toLocaleString()}</>
                            )}
                        </div>

                        {/* VARIANT SELECTORS */}
                        <div className="space-y-6">
                            {/* Size Selector */}
                            {uniqueSizes.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-[12px] font-extrabold uppercase tracking-widest text-brand-matte">SIZE: {selectedSize}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {uniqueSizes.map((sz: any) => (
                                            <button
                                                key={sz}
                                                onClick={() => setSelectedSize(sz)}
                                                className={`px-6 py-2.5 text-[13px] font-bold border transition-all ${
                                                    selectedSize === sz
                                                        ? 'bg-brand-matte text-white border-brand-matte'
                                                        : 'bg-white text-zinc-400 border-zinc-200 hover:border-brand-matte'
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
                                <div className="space-y-3">
                                    <h4 className="text-[12px] font-extrabold uppercase tracking-widest text-brand-matte">FLAVOUR: {selectedFlavor}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {availableFlavors.map((fl: any) => (
                                            <button
                                                key={fl}
                                                onClick={() => setSelectedFlavor(fl)}
                                                className={`px-6 py-2.5 text-[13px] font-bold border transition-all ${
                                                    selectedFlavor === fl
                                                        ? 'bg-brand-matte text-white border-brand-matte'
                                                        : 'bg-white text-zinc-400 border-zinc-200 hover:border-brand-matte'
                                                }`}
                                            >
                                                {fl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Selected Price */}
                        <div className="text-3xl font-extrabold text-brand-matte pt-4">
                            Rs.{(selectedVariant ? selectedVariant.price : product.price).toLocaleString()}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Quantity */}
                            <div className="flex items-center border border-zinc-200 h-[52px]">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center hover:bg-zinc-50 transition-all border-r border-zinc-200">
                                    <Minus size={16} />
                                </button>
                                <div className="w-14 text-center font-bold text-lg">{quantity}</div>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center hover:bg-zinc-50 transition-all border-l border-zinc-200">
                                    <Plus size={16} />
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                disabled={loading}
                                className={`flex-grow bg-brand text-white h-[52px] px-8 text-[13px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-brand-matte transition-all disabled:opacity-50`}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingBag className="w-4 h-4" /> ADD TO CART</>}
                            </button>

                            {/* Icons */}
                            <div className="flex gap-2">
                                <button className="w-[52px] h-[52px] flex items-center justify-center border border-zinc-200 hover:bg-brand hover:text-white hover:border-brand transition-all group">
                                    <Heart className="w-5 h-5 group-hover:fill-current" />
                                </button>
                                <button className="w-[52px] h-[52px] flex items-center justify-center border border-zinc-200 hover:bg-brand hover:text-white hover:border-brand transition-all">
                                    <Zap className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Extra Buttons (Buy Now) */}
                        <button
                            onClick={handleBuyNow}
                            className="w-full border-2 border-brand-matte text-brand-matte h-[52px] text-[13px] font-black uppercase tracking-[0.2em] hover:bg-brand-matte hover:text-white transition-all"
                        >
                            Express Checkout
                        </button>
                    </div>
                </div>

                {/* TABS SECTION */}
                <div className="mt-20">
                    <div className="flex flex-wrap gap-8 border-b border-zinc-200 mb-10">
                        {['details', 'warnings', 'directions', 'reviews'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-4 text-[13px] font-extrabold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-brand' : 'text-zinc-400 hover:text-brand-matte'}`}
                            >
                                {tab}
                                {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand" />}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[300px] bg-white p-8 md:p-12 border border-zinc-100 shadow-sm">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'details' && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-black uppercase tracking-tight">Product Information</h3>
                                            <div className="h-1 w-12 bg-brand"></div>
                                        </div>
                                        <p className="text-zinc-600 leading-relaxed text-lg">
                                            {product.description}
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                            <div className="bg-zinc-50 p-6 border border-zinc-100">
                                                <div className="flex items-center gap-3 text-brand mb-4">
                                                    <ShieldCheck className="w-5 h-5" />
                                                    <h4 className="font-extrabold uppercase tracking-widest text-sm">Quality Assurance</h4>
                                                </div>
                                                <p className="text-sm text-zinc-500 leading-relaxed">
                                                    Manufactured in a certified facility. Every batch is tested for purity and potency to ensure maximum results.
                                                </p>
                                            </div>
                                            <div className="bg-zinc-50 p-6 border border-zinc-100">
                                                <div className="flex items-center gap-3 text-brand mb-4">
                                                    <Target className="w-5 h-5" />
                                                    <h4 className="font-extrabold uppercase tracking-widest text-sm">Product Meta</h4>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                        <span>Category</span>
                                                        <span className="text-brand-matte">{product.category}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                        <span>Sub-Category</span>
                                                        <span className="text-brand-matte">{product.subCategory || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'warnings' && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-black uppercase tracking-tight text-brand">Safety Warnings</h3>
                                            <div className="h-1 w-12 bg-brand"></div>
                                        </div>
                                        <div className="bg-red-50 p-8 border-l-4 border-brand">
                                            <ul className="space-y-4">
                                                {(product.warnings && product.warnings.length > 0 ? product.warnings : ['Consult a healthcare professional before using this product.']).map((w, i) => (
                                                    <li key={i} className="flex gap-4 items-start text-brand-matte/80 font-medium">
                                                        <AlertTriangle className="w-5 h-5 text-brand shrink-0" />
                                                        {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'directions' && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-black uppercase tracking-tight">Directions for Use</h3>
                                            <div className="h-1 w-12 bg-brand"></div>
                                        </div>
                                        <div className="bg-zinc-50 p-8 border-l-4 border-brand-matte">
                                            <p className="text-zinc-600 leading-relaxed italic">
                                                {product.directions || 'Follow the dosage instructions on the product label. Store in a cool, dry place.'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'reviews' && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-black uppercase tracking-tight">Customer Reviews</h3>
                                            <div className="h-1 w-12 bg-brand"></div>
                                        </div>
                                        {product.reviews && product.reviews.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {product.reviews.map((review: any, i: number) => (
                                                    <div key={i} className="bg-zinc-50 p-6 border border-zinc-100 space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex text-brand-gold">
                                                                {[...Array(5)].map((_, stars) => (
                                                                    <Star key={stars} className={`w-3.5 h-3.5 ${stars < review.rating ? 'fill-current' : 'text-zinc-200'}`} />
                                                                ))}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-zinc-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-zinc-600 italic">"{review.comment}"</p>
                                                        <p className="text-[11px] font-black uppercase tracking-widest text-brand">{review.user?.name || 'Verified User'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-20 text-center space-y-4 border-2 border-dashed border-zinc-100">
                                                <Beaker className="w-10 h-10 text-zinc-200 mx-auto" />
                                                <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">No reviews yet. Be the first to share your experience!</p>
                                                <button onClick={() => navigate(`/product/${product.id}/review`)} className="text-brand font-black uppercase tracking-widest text-[11px] border-b-2 border-brand pb-1">Write a Review</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                <div className="mt-32">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <span className="text-brand font-black uppercase tracking-widest text-xs">Recommended</span>
                            <h3 className="text-3xl font-black uppercase tracking-tight">You May Also Like</h3>
                        </div>
                        <button onClick={() => navigate('/products')} className="text-xs font-black uppercase tracking-widest border-b-2 border-zinc-200 pb-1 hover:border-brand transition-all">View All</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {initialProducts.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                            <div
                                key={p.id}
                                onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}
                                className="bg-white p-6 group cursor-pointer border border-zinc-100 hover:shadow-md transition-all"
                            >
                                <div className="aspect-square flex items-center justify-center p-4 bg-zinc-50 overflow-hidden mb-4">
                                    <img src={p.image || p.images?.[0]} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-all duration-500" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 truncate">{p.name}</h4>
                                    <p className="text-lg font-black text-brand-matte">Rs.{p.price.toLocaleString()}</p>
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