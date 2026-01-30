import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingBag, ArrowLeft, ShieldCheck, Zap, Beaker, FileText, Share2, Heart, FlaskConical, Target, Droplets, AlertTriangle, PlayCircle, CreditCard } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState<'details' | 'usage' | 'reviews'>('details');
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
        <div className="min-h-screen flex items-center justify-center bg-brand-warm">
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
        <div className="min-h-screen bg-brand-warm pb-40 selection:bg-brand selection:text-white">
            <div className="max-w-[1440px] mx-auto px-6 pt-32">

                {/* HEADER / BREADCRUMB */}
                <div className="flex justify-between items-center mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-brand-matte/40 hover:text-brand transition-luxury group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-luxury" /> Return to Archive
                    </button>
                    <div className="flex gap-4">
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-brand-matte/5 hover:bg-brand hover:text-white hover:border-brand transition-luxury shadow-sm">
                            <Heart className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-brand-matte/5 hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-luxury shadow-sm">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 items-start">

                    {/* LEFT: DARK IMAGE CHAMBER */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-6"
                    >
                        {/* Thumbnails */}
                        <div className="flex md:flex-col gap-3 justify-center md:justify-start">
                            {product.images?.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImageIdx(i)}
                                    className={`w-20 h-20 p-2 transition-all duration-300 ${activeImageIdx === i ? 'bg-brand-matte border-brand-gold border shadow-lg' : 'bg-white border-brand-matte/5 border hover:border-brand-gold/30'}`}
                                >
                                    <img src={img} alt="preview" className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>

                        {/* Main Viewport */}
                        <div className="flex-grow aspect-square bg-brand-matte relative overflow-hidden group shadow-2xl flex items-center justify-center p-12 lg:p-20">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>

                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImageIdx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                    src={product.images[activeImageIdx]}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain drop-shadow-2xl relative z-10"
                                />
                            </AnimatePresence>

                            <div className="absolute top-8 left-8 flex flex-col gap-2 z-20">
                                <Badge className="bg-brand-gold text-brand-matte px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-none shadow-lg border-none">ISO CERTIFIED</Badge>
                                {isNew(product) && <Badge className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 rounded-none">V-77 NEW</Badge>}
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: LIGHT INFO PANEL */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 space-y-10"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-brand"></div>
                                <span className="text-[13px] font-black uppercase tracking-[0.6em] text-brand">{product.brand}</span>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl font-black text-brand-matte uppercase tracking-tighter leading-[0.9]">{product.name}</h1>
                                <div className="flex items-center gap-4">
                                    <div className="flex text-brand-gold">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-brand-matte/10'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[11px] font-black text-brand-matte/30 uppercase tracking-widest">{product.reviews} Certified Reviews</span>
                                </div>
                            </div>

                            <div className="flex items-end gap-6 border-b border-brand-matte/5 pb-8">
                                <p className="text-5xl font-black text-brand italic tracking-tighter leading-none">
                                    ${(selectedVariant ? selectedVariant.price : product.price).toFixed(2)}
                                </p>
                                {selectedVariant && (
                                    <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mb-2">
                                        / PROTOCOL: {selectedVariant.size} {selectedVariant.flavor && `- ${selectedVariant.flavor}`}
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-lg text-brand-matte/60 font-medium leading-relaxed italic border-l-4 border-brand-gold/50 pl-6">
                            {product.description}
                        </p>

                        {/* SELECTOR CARD */}
                        <div className="bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-brand-matte/5 space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand"></div>

                            {product.variants && product.variants.length > 0 && (
                                <div className="space-y-6">
                                    {/* Primary Attribute Selector */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-matte">{product.variantType || 'Protocol Variant'}</h4>
                                            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Archive Selection</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {uniqueSizes.map((sz: any) => (
                                                <button
                                                    key={sz}
                                                    onClick={() => setSelectedSize(sz)}
                                                    className={`px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] border transition-all
                                                        ${selectedSize === sz
                                                            ? 'bg-brand-matte text-white border-brand-matte'
                                                            : 'bg-brand-warm text-brand-matte/60 border-brand-matte/5 hover:border-brand-gold'
                                                        }`}
                                                >
                                                    {sz}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Secondary Attribute Selector (Flavor/Color) */}
                                    {availableFlavors.length > 0 && (
                                        <div className="space-y-4 animate-in fade-in duration-500">
                                            <div className="flex justify-between">
                                                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-matte">{product.secondaryVariantName || 'Flavor Matrix'}</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {availableFlavors.map((fl: any) => (
                                                    <button
                                                        key={fl}
                                                        onClick={() => setSelectedFlavor(fl)}
                                                        className={`px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] border transition-all
                                                            ${selectedFlavor === fl
                                                                ? 'bg-brand-gold text-brand-matte border-brand-gold'
                                                                : 'bg-brand-warm text-brand-matte/60 border-brand-matte/5 hover:border-brand-gold'
                                                            }`}
                                                    >
                                                        {fl}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center bg-brand-warm border border-brand-matte/10 shrink-0">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-4 hover:text-brand transition-all"><Minus size={14} /></button>
                                    <span className="w-10 text-center font-black text-lg tabular-nums text-brand-matte">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="px-5 py-4 hover:text-brand transition-all"><Plus size={14} /></button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-grow bg-brand-matte text-white py-4 px-6 text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl hover:bg-white hover:text-black transition-all"
                                >
                                    <ShoppingBag className="w-4 h-4" /> Add Protocol
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    className="flex-grow bg-brand-gold text-brand-matte py-4 px-6 text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl hover:bg-brand-matte hover:text-brand-gold transition-all"
                                >
                                    <CreditCard className="w-4 h-4" /> Buy Now
                                </button>
                            </div>

                            <div className="flex items-center gap-2 pt-2 text-[9px] font-bold text-brand-matte/30 uppercase tracking-widest justify-center sm:justify-start">
                                <ShieldCheck className="w-3.5 h-3.5 text-brand" /> 100% Authentic Guarantee
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* SPECS SECTION - MIXED THEME */}
            <section className="mt-32 border-t border-brand-matte/5 bg-white">
                <div className="max-w-[1440px] mx-auto">
                    <div className="flex flex-col lg:flex-row">

                        {/* DARK SIDEBAR */}
                        <aside className="lg:w-1/3 bg-brand-matte text-white p-12 lg:p-20 space-y-12">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Technical <br />Analysis</h3>
                                <div className="h-1 w-14 bg-brand-gold"></div>
                            </div>
                            <div className="space-y-0.5">
                                {[
                                    { label: 'Category', val: product.category },
                                    { label: 'Series ID', val: product.subCategory || 'Master' },
                                    { label: 'Deployment', val: product.stock > 0 ? 'ACTIVE' : 'DEPLETED' },
                                ].map((spec, i) => (
                                    <div key={i} className="flex justify-between py-4 border-b border-white/10 text-[11px] font-bold uppercase tracking-widest">
                                        <span className="text-white/40">{spec.label}</span>
                                        <span className={`font-black ${spec.val === 'ACTIVE' ? 'text-brand-gold' : 'text-white'}`}>{spec.val}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 space-y-4 backdrop-blur-sm">
                                <FileText className="w-8 h-8 text-brand-gold" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Batch COA Available</p>
                                    <p className="text-white/40 text-[9px] leading-relaxed uppercase font-bold tracking-widest mt-1">Full spectrographic analysis report.</p>
                                </div>
                            </div>
                        </aside>

                        {/* LIGHT CONTENT */}
                        <main className="lg:w-2/3 p-12 lg:p-20 bg-brand-warm/30">
                            <div className="flex gap-10 border-b border-brand-matte/10 mb-12">
                                {['details', 'usage', 'reviews'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`pb-5 text-[12px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === tab ? 'text-brand' : 'text-brand-matte/30 hover:text-brand-matte'}`}
                                    >
                                        {tab}
                                        {activeTab === tab && <motion.div layoutId="tab-underline-spec" className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand" />}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[300px]">
                                {activeTab === 'details' && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <p className="text-2xl md:text-3xl text-brand-matte/60 leading-snug italic font-light">
                                            Optimized biological availability. This formula bypasses traditional metabolic resistance to deliver primary compounds directly to your cellular architecture.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4 p-8 bg-white shadow-sm border border-brand-matte/5">
                                                <div className="flex items-center gap-3 text-brand">
                                                    <AlertTriangle className="w-5 h-5" />
                                                    <h4 className="text-sm font-black uppercase tracking-widest">Safety Warnings</h4>
                                                </div>
                                                <ul className="space-y-2">
                                                    {(product.warnings && product.warnings.length > 0 ? product.warnings : ['Consult professional advice before use']).map((w, i) => (
                                                        <li key={i} className="text-[11px] font-bold text-brand-matte/50 uppercase tracking-widest list-disc ml-4">{w}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="space-y-4 p-8 bg-white shadow-sm border border-brand-matte/5">
                                                <div className="flex items-center gap-3 text-brand-gold">
                                                    <FlaskConical className="w-5 h-5" />
                                                    <h4 className="text-sm font-black uppercase tracking-widest">Molecular Integrity</h4>
                                                </div>
                                                <p className="text-[11px] font-bold text-brand-matte/50 uppercase tracking-widest leading-loose">
                                                    Strict adherence to cGMP standards ensures no cross-contamination or unlabeled biological fillers.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'usage' && (
                                    <div className="space-y-8 bg-white p-10 border-l-4 border-brand-gold shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center gap-4">
                                            <PlayCircle className="text-brand-gold w-8 h-8" />
                                            <h4 className="text-2xl font-black uppercase tracking-tighter text-brand-matte">Operational Directions</h4>
                                        </div>
                                        <p className="text-lg text-brand-matte/60 leading-relaxed font-medium italic pl-12">
                                            {product.directions || 'No specific directions provided. Consult label.'}
                                        </p>
                                    </div>
                                )}
                                {activeTab === 'reviews' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {product.reviews && product.reviews.length > 0 ? (
                                            <div className="space-y-6">
                                                {product.reviews.map((review: any, i: number) => (
                                                    <div key={i} className="border-b border-brand-matte/10 pb-6">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="flex text-brand-gold">
                                                                {[...Array(5)].map((_, stars) => (
                                                                    <Star key={stars} className={`w-3 h-3 ${stars < review.rating ? 'fill-current' : 'text-brand-matte/10'}`} />
                                                                ))}
                                                            </div>
                                                            <span className="text-[10px] font-bold uppercase text-brand-matte/40">{new Date(review.createdAt || Date.now()).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-brand-matte/80 italic">"{review.comment}"</p>
                                                        {review.user && <p className="text-[10px] font-black uppercase tracking-widest text-brand-matte mt-2">- {review.user.name || 'Verified User'}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-20 border-2 border-dashed border-brand-matte/10 text-center space-y-6 bg-white">
                                                <Beaker className="w-12 h-12 text-brand-matte/10 mx-auto" />
                                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-matte/30">Registry Intelligence Pending Verification</p>
                                                <button onClick={() => navigate(`/product/${product.id}/review`)} className="text-brand font-black uppercase tracking-widest text-[11px] border-b-2 border-brand pb-2 hover:text-brand-gold hover:border-brand-gold transition-colors">Submit Deployment Log</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </section>

            {/* RELATED PRODUCTS */}
            <section className="mt-32 max-w-[1440px] mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-2">
                        <span className="text-brand font-black uppercase tracking-[0.5em] text-[11px]">Recommended Protocols</span>
                        <h3 className="text-4xl font-black text-brand-matte uppercase tracking-tighter">Complementary Stacks</h3>
                    </div>
                    <button onClick={() => navigate('/products')} className="text-[11px] font-black uppercase tracking-widest border-b-2 border-brand-gold/40 text-brand-matte/60 pb-2 hover:border-brand hover:text-brand transition-all">Full Archive</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {initialProducts.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                        <div
                            key={p.id}
                            onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}
                            className="bg-white p-8 text-center space-y-6 group cursor-pointer hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-luxury border border-transparent hover:border-brand-matte/5"
                        >
                            <div className="h-52 flex items-center justify-center p-6 bg-brand-warm overflow-hidden mix-blend-multiply">
                                <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-matte group-hover:text-brand leading-tight truncate transition-colors">{p.name}</h4>
                                <p className="text-xl font-black text-brand italic tracking-tighter">${p.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default ProductDetail;