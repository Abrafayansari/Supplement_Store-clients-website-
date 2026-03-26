import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Star, Minus, Plus, ShoppingBag, ArrowLeft,
    ShieldCheck, Zap, Heart, AlertTriangle, Loader2,
    ChevronRight, Award, FileText, Target, Beaker,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts, fetchProductById } from '../data/Product.tsx';
import { useCart } from '../contexts/CartContext.tsx';
import { useWishlist } from '../contexts/WishlistContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Product } from '@/types.ts';
import api from '../lib/api';
import { toast } from 'sonner';
import NexusLoader from '../components/NexusLoader';

/* ─── minimal global CSS (only what Tailwind can't express) ─── */
const GLOBAL_STYLE = `
  .pd-stock-pulse::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 9999px;
    background: rgba(123,15,23,0.2);
    animation: pdPing 1.5s cubic-bezier(0,0,.2,1) infinite;
  }

  @keyframes pdPing {
    0%,100%{ transform:scale(1); opacity:1 }
    50%    { transform:scale(1.9); opacity:0 }
  }
  /* layoutId anchor for framer tab underline */
  .pd-tab-line {
    position: absolute;
    bottom: -2px; left: 0; right: 0;
    height: 3px;
    background: var(--brand);
    border-radius: 9999px;
  }

`;

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const ProductDetail: React.FC = () => {
    const [initialProducts, setInitialProducts] = useState<Array<any>>([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'details' | 'warnings' | 'directions' | 'reviews'>('details');
    const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedFlavor, setSelectedFlavor] = useState('');
    const [activeImageIdx, setActiveImageIdx] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const { addToWishlist, removeFromWishlist, checkIfWishlisted } = useWishlist();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { isAuthenticated } = useAuth();
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const refreshProduct = async () => {
        if (id) setProduct(await fetchProductById(id));
    };

    useEffect(() => {
        const load = async () => {
            setFetching(true);
            try {
                if (id) {
                    const p = await fetchProductById(id);
                    setProduct(p);
                    if (p?.variants?.length > 0) {
                        const first = p.variants[0];
                        setSelectedSize(first.size);
                        setSelectedFlavor(first.flavor || '');
                        setSelectedVariant(first);
                    }
                    if (p?.id) setIsWishlisted(await checkIfWishlisted(p.id));
                }
                const { products: rel } = await fetchProducts({ sort: 'newest', limit: 5 });
                setInitialProducts(rel);
            } catch (e) { console.error(e); }
            finally { setFetching(false); }
        };
        load();
    }, [id]);

    useEffect(() => {
        if (!product || !selectedSize) return;
        const ofSize = product.variants.filter((v: any) => v.size === selectedSize);
        if (!ofSize.length) return;
        const match = ofSize.find((v: any) => v.flavor === selectedFlavor) || ofSize[0];
        if (match.id !== selectedVariant?.id) setSelectedVariant(match);
        if (match.flavor !== selectedFlavor) setSelectedFlavor(match.flavor || '');
    }, [selectedSize, selectedFlavor, product]);

    if (fetching) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <NexusLoader />
        </div>
    );
    if (!product) return null;

    const uniqueSizes = Array.from(new Set(product.variants?.map((v: any) => v.size) || []));
    const availableFlavors = Array.from(new Set(
        product.variants?.filter((v: any) => v.size === selectedSize).map((v: any) => v.flavor).filter(Boolean) || []
    ));

    const displayPrice = selectedVariant ? (selectedVariant.discountPrice || selectedVariant.price) : (product.discountPrice || product.price);
    const originalPrice = selectedVariant ? selectedVariant.price : product.price;
    const hasDiscount = displayPrice < originalPrice;
    const savePercent = hasDiscount ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

    const BRAND_COLOR = (typeof window !== 'undefined'
        ? getComputedStyle(document.documentElement).getPropertyValue('--brand')?.trim()
        : '#7B0F17');


    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (product.variants?.length > 0 && !selectedVariant) { toast.error("Please select a variant"); return; }
        if (loading) return;
        try { setLoading(true); await addToCart(product, quantity, selectedVariant?.id); }
        finally { setLoading(false); }
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        if (product.variants?.length > 0 && !selectedVariant) { toast.error("Please select a variant"); return; }
        if (!localStorage.getItem('token')) { navigate('/login'); return; }
        navigate('/checkout', { state: { singleItem: { product, quantity, variant: selectedVariant, variantId: selectedVariant?.id } } });
    };

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!localStorage.getItem('token') && !isWishlisted) { toast.error("Please login first"); navigate('/login'); return; }
        try {
            if (isWishlisted) { await removeFromWishlist(product.id); setIsWishlisted(false); }
            else { await addToWishlist(product); setIsWishlisted(true); }
        } catch (err) { console.error(err); }
    };

    const TABS = [
        { id: 'details', label: 'Description', icon: Beaker },
        { id: 'warnings', label: 'Warnings', icon: AlertTriangle },
        { id: 'directions', label: 'Directions', icon: Target },
        { id: 'reviews', label: 'Reviews', icon: FileText },
    ];

    /* ─── shared Tailwind snippets ─── */
    const variantBase = 'px-5 py-[10px] border-2 font-display text-base tracking-widest uppercase transition-all duration-150 cursor-pointer';
    const infoKeyClass = 'w-44 flex-shrink-0 px-5 py-3 bg-[#f5f5f5] font-display text-sm tracking-widest uppercase text-[#888]';
    const infoValClass = 'px-5 py-3 font-display text-base text-[#111] uppercase tracking-wide';

    return (
        <div className="min-h-screen bg-white text-[#111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{GLOBAL_STYLE}</style>

            {/* ══ BACK BUTTON ══ */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-brand-matte hover:bg-brand text-white px-6 py-[14px] transition-colors duration-150"

                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: '0.12em' }}
            >
                <ArrowLeft size={15} /> BACK TO PRODUCTS
            </button>

            {/* ══ BREADCRUMB ══ */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-[#e0e0e0] text-[#888] text-sm"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>
                <span>STORE</span>
                <ChevronRight size={12} />
                <span className="uppercase">{product.category}</span>
                <ChevronRight size={12} />
                <span className="text-[#111] font-semibold truncate max-w-[260px]">{product.name.toUpperCase()}</span>
            </div>

            {/* ══════════════════════════════════════════
                MAIN GRID
            ══════════════════════════════════════════ */}
            <div className="max-w-[1280px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* ─── LEFT · GALLERY ─── */}
                <div>
                    {/* Main image – aspect-square, image fills 90% of box */}
                    <div className="relative bg-[#f5f5f5] border border-[#e0e0e0] overflow-hidden flex items-center justify-center"
                        style={{ aspectRatio: '1 / 1' }}>

                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeImageIdx}
                                src={product.images[activeImageIdx]}
                                alt={product.name}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.03 }}
                                transition={{ duration: 0.22 }}
                                className="object-contain drop-shadow-xl"
                                style={{ width: '90%', height: '90%' }}
                            />
                        </AnimatePresence>

                        {/* removed premium badge as requested */}
                    </div>

                    {/* Thumbnails */}
                    {product.images?.length > 1 && (
                        <div className="flex gap-3 mt-3 flex-wrap">
                            {product.images.map((img: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImageIdx(i)}
                                    className={`w-[82px] h-[82px] flex items-center justify-center p-2 border-2 bg-[#f5f5f5] transition-all duration-150
                                        ${activeImageIdx === i ? 'border-[#e8222e]' : 'border-[#e0e0e0] hover:border-[#111]'}`}
                                >
                                    <img src={img} alt={`view ${i + 1}`}
                                        className={`w-full h-full object-contain transition-all duration-200
                                            ${activeImageIdx === i ? '' : ' '}`} />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Trust row */}
                    <div className="flex items-center gap-8 mt-6 pt-5 border-t border-[#e0e0e0] flex-wrap">
                        {[
                            { icon: Award, label: 'LAB TESTED' },
                            { icon: ShieldCheck, label: '100% ORIGINAL' },
                            { icon: Zap, label: 'FAST DISPATCH' },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-2 text-[#666] text-sm"
                                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }}>
                                <Icon size={17} className="text-[#111]" />
                                {label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── RIGHT · INFO ─── */}
                <div className="lg:pl-2">

                    {/* Brand / SKU */}
                    <p className="text-sm text-[#999] mb-2 uppercase"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.14em' }}>
                        BY {product.brand}
                        <span className="mx-2 opacity-40">·</span>
                        SKU: {product.id.slice(-8).toUpperCase()}
                    </p>

                    {/* Product title */}
                    <h1 className="leading-[1.0] uppercase text-[#111] mb-5"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 5vw, 54px)', letterSpacing: '0.02em' }}>
                        {product.name}
                    </h1>

                    {/* Stars */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={17}
                                    style={{
                                        fill: i < Math.floor(product.rating || 0) ? BRAND_COLOR : 'none',
                                        color: i < Math.floor(product.rating || 0) ? BRAND_COLOR : '#ddd'
                                    }} />
                            ))}
                        </div>
                        <span className="text-sm text-[#999]"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
                            {product.reviews?.length > 0 ? `${product.reviews.length} REVIEWS` : 'NO REVIEWS YET'}
                        </span>
                    </div>

                    {/* Price block: show original (struck) first when discounted */}
                    <div className="border-t-2 border-[#111] border-b border-[#e0e0e0] py-5 mb-6 flex items-baseline flex-wrap gap-4">
                        {hasDiscount ? (
                            <>
                                <span className="text-[#bbb] line-through"
                                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26 }}>
                                    Rs.{originalPrice.toLocaleString()}
                                </span>
                                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, lineHeight: 1 }}>
                                    Rs.{displayPrice.toLocaleString()}
                                </span>
                                <span className="text-white text-sm px-3 py-1 uppercase"
                                    style={{ background: BRAND_COLOR, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
                                    SAVE {savePercent}%
                                </span>
                            </>
                        ) : (
                            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, lineHeight: 1 }}>
                                Rs.{displayPrice.toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Size selector */}
                    {uniqueSizes.length > 0 && (
                        <div className="mb-5">
                            <p className="text-sm text-[#999] mb-3 uppercase"
                                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em' }}>
                                SIZE: <span className="text-[#111]">{selectedSize}</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {uniqueSizes.map((sz: any) => (
                                    <button key={sz} onClick={() => setSelectedSize(sz)}
                                        className={`${variantBase} ${selectedSize === sz
                                            ? 'border-[#111] bg-[#111] text-white'
                                            : 'border-[#e0e0e0] text-[#555] hover:border-[#111]'}`}
                                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                        {sz}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Flavour selector */}
                    {availableFlavors.length > 0 && (
                        <div className="mb-5">
                            <p className="text-sm text-[#999] mb-3 uppercase"
                                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.12em' }}>
                                FLAVOUR: <span className="text-[#111]">{selectedFlavor}</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {availableFlavors.map((fl: any) => (
                                    <button key={fl} onClick={() => setSelectedFlavor(fl)}
                                        className={`${variantBase} ${selectedFlavor === fl
                                            ? 'border-[#e8222e] bg-[#e8222e] text-white'
                                            : 'border-[#e0e0e0] text-[#555] hover:border-[#e8222e]'}`}
                                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                        {fl}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stock */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="relative w-3 h-3 flex-shrink-0">
                            <span className="pd-stock-pulse absolute inset-0 rounded-full bg-brand opacity-80" />

                        </span>
                        <span className="text-brand uppercase text-sm"

                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
                            READY FOR IMMEDIATE DISPATCH
                        </span>
                    </div>

                    {/* Add to cart row */}
                    <div className="flex gap-3 mb-3 items-stretch">
                        {/* Qty stepper */}
                        <div className="flex items-center border-2 border-[#e0e0e0] min-w-[112px]">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 min-h-[52px] flex items-center justify-center text-[#999] hover:text-[#111] transition-colors">
                                <Minus size={15} />
                            </button>
                            <span className="flex-1 text-center text-xl text-[#111]"
                                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                {quantity}
                            </span>
                            <button onClick={() => setQuantity(quantity + 1)}
                                className="w-10 flex items-center justify-center text-[#999] hover:text-[#111] transition-colors">
                                <Plus size={15} />
                            </button>
                        </div>

                        {/* Add to cart */}
                        <button onClick={handleAddToCart} disabled={loading}
                            className="flex-1 text-white flex items-center justify-center gap-2 px-6 min-h-[52px] uppercase transition-colors duration-150 disabled:opacity-60"
                            style={{
                                background: loading ? '#7B0F17' : '#7B0F17', fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: 17, letterSpacing: '0.1em'
                            }}
                            onMouseOver={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#3b0407ff'; }}
                            onMouseOut={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#7B0F17'; }}>
                            <ShoppingBag size={18} />
                            ADD TO CART
                            {loading && <Loader2 size={15} className="animate-spin" />}
                        </button>

                        {/* Wishlist */}
                        <button onClick={handleWishlistToggle}
                            className={`w-[52px] min-h-[52px] border-2 flex items-center justify-center transition-all duration-150
                                ${isWishlisted
                                    ? 'border-[#e8222e] text-[#e8222e]'
                                    : 'border-[#e0e0e0] text-[#aaa] hover:border-[#e8222e] hover:text-[#e8222e]'}`}>
                            <Heart size={19} fill={isWishlisted ? 'currentColor' : 'none'} />
                        </button>
                    </div>

                    {/* Buy now */}
                    <button onClick={handleBuyNow}
                        className="w-full border-2 border-[#111] bg-white hover:bg-[#111] hover:text-white text-[#111] uppercase py-[14px] transition-all duration-150"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: '0.1em' }}>
                        BUY IT NOW
                    </button>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                TABS
            ══════════════════════════════════════════ */}
            <div className="max-w-[1280px] mx-auto px-6 pb-16">

                {/* Tab nav */}
                <div className="flex flex-wrap border-b-2 border-[#e0e0e0]">
                    {TABS.map(tab => (
                        <button key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`relative flex items-center gap-2 px-7 py-[16px] uppercase transition-colors duration-150
                                ${activeTab === tab.id ? 'text-[#111]' : 'text-[#bbb] hover:text-[#666]'}`}
                            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: '0.1em' }}>
                            <tab.icon size={15} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div layoutId="pd-tab-line" className="pd-tab-line" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab panels */}
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.18 }}
                        className="py-10 border-b border-[#e0e0e0]">

                        {/* ── DESCRIPTION ── */}
                        {activeTab === 'details' && (
                            <div>
                                <h3 className="uppercase mb-1"
                                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: BRAND_COLOR }}>
                                    Product Overview.
                                </h3>
                                <div className="w-20 h-[3px] mb-7" style={{ background: BRAND_COLOR }} />

                                <p className="text-lg leading-[1.85] text-[#444] max-w-3xl mb-8"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    {product.description || 'Experience peak performance with our premium supplement formula.'}
                                </p>

                                {/* Info table */}
                                <div className="border border-[#e0e0e0] max-w-lg text-base">
                                    {[
                                        ['Category', product.category],
                                        ['Sub-Category', product.subCategory || 'Premium Series'],
                                        ['Brand', product.brand],
                                    ].map(([key, val], idx, arr) => (
                                        <div key={key as string}
                                            className={`flex ${idx < arr.length - 1 ? 'border-b border-[#e0e0e0]' : ''}`}>
                                            <div className={infoKeyClass}>{key}</div>
                                            <div className={infoValClass}>{val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── WARNINGS ── */}
                        {activeTab === 'warnings' && (
                            <div>
                                <h3 className="uppercase mb-1"
                                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: BRAND_COLOR }}>
                                    Safety Warnings
                                </h3>
                                <div className="w-20 h-[3px] mb-7" style={{ background: BRAND_COLOR }} />
                                <div className="max-w-3xl space-y-4">
                                    {(product.warnings?.length > 0
                                        ? product.warnings
                                        : ['Consult a healthcare professional before use.']
                                    ).map((w: string, i: number) => (
                                        <div key={i} className="flex gap-4 items-start pb-4 border-b border-[#eee] last:border-0">
                                            <span className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                                                style={{ background: BRAND_COLOR }} />
                                            <p className="text-lg leading-relaxed text-[#333]"
                                                style={{ fontFamily: "'DM Sans', sans-serif" }}>{w}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── DIRECTIONS ── */}
                        {activeTab === 'directions' && (
                            <div>
                                <h3 className="uppercase mb-1"
                                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: BRAND_COLOR }}>
                                    Directions for Use
                                </h3>
                                <div className="w-20 h-[3px] mb-7" style={{ background: BRAND_COLOR }} />
                                <div className="max-w-3xl border-l-4 pl-8 py-2"
                                    style={{ borderColor: BRAND_COLOR }}>
                                    <p className="text-xl leading-relaxed text-[#333] italic"
                                        style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        {product.directions || 'Follow the instructions on the label carefully. Store in a cool, dry place.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── REVIEWS ── */}
                        {activeTab === 'reviews' && (
                            <div>
                                {/* Header */}
                                <div className="flex items-start justify-between mb-7 flex-wrap gap-4">
                                    <div>
                                        <h3 className="uppercase mb-1"
                                            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: BRAND_COLOR }}>
                                            Customer Reviews
                                        </h3>
                                        <div className="w-20 h-[3px]" style={{ background: BRAND_COLOR }} />
                                    </div>
                                    {!showReviewForm && (
                                        <button
                                            onClick={() => {
                                                if (!isAuthenticated) { toast.error("Please login to write a review"); navigate('/login'); return; }
                                                setShowReviewForm(true);
                                            }}
                                            className="text-white px-6 py-3 uppercase transition-colors duration-150"
                                            style={{
                                                background: '#111', fontFamily: "'Bebas Neue', sans-serif",
                                                fontSize: 15, letterSpacing: '0.1em'
                                            }}
                                            onMouseOver={e => (e.currentTarget.style.background = BRAND_COLOR)}
                                            onMouseOut={e => (e.currentTarget.style.background = '#111')}>
                                            WRITE A REVIEW
                                        </button>
                                    )}
                                </div>

                                {/* Review form */}
                                {showReviewForm && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                        className="bg-[#111] p-8 mb-8 text-white">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="uppercase text-white"
                                                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: '0.08em' }}>
                                                SUBMIT YOUR FEEDBACK
                                            </h4>
                                            <button onClick={() => setShowReviewForm(false)}
                                                className="text-white/40 hover:text-white transition-colors">
                                                <Plus size={18} style={{ transform: 'rotate(45deg)' }} />
                                            </button>
                                        </div>

                                        <p className="text-white/50 text-sm mb-3 uppercase"
                                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.14em' }}>
                                            SELECT RATING
                                        </p>
                                        <div className="flex gap-3 mb-6">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button key={star} onClick={() => setReviewRating(star)}
                                                    className="hover:scale-110 active:scale-90 transition-transform">
                                                    <Star size={34}
                                                        style={{
                                                            fill: star <= reviewRating ? BRAND_COLOR : 'none',
                                                            color: star <= reviewRating ? BRAND_COLOR : 'rgba(255,255,255,0.2)'
                                                        }} />
                                                </button>
                                            ))}
                                        </div>

                                        <p className="text-white/50 text-sm mb-3 uppercase"
                                            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.14em' }}>
                                            YOUR COMMENTS
                                        </p>
                                        <textarea rows={4} value={reviewComment}
                                            onChange={e => setReviewComment(e.target.value)}
                                            placeholder="Share your experience with this product..."
                                            className="w-full p-4 text-base text-white resize-none outline-none transition-colors box-border placeholder:text-white/25"
                                            style={{
                                                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                                                fontFamily: "'DM Sans', sans-serif"
                                            }}
                                            onFocus={e => (e.currentTarget.style.borderColor = BRAND_COLOR)}
                                            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')} />

                                        <button disabled={submittingReview}
                                            onClick={async () => {
                                                if (reviewRating === 0) { toast.error("Please select a rating"); return; }
                                                setSubmittingReview(true);
                                                try {
                                                    await api.post('/givereview', { productId: product.id, rating: reviewRating, comment: reviewComment });
                                                    toast.success("Review posted!");
                                                    setShowReviewForm(false); setReviewRating(0); setReviewComment('');
                                                    await refreshProduct();
                                                } catch (err: any) {
                                                    toast.error(err.response?.data?.message || "Failed to submit");
                                                } finally { setSubmittingReview(false); }
                                            }}
                                            className="mt-5 text-white flex items-center gap-3 px-10 py-[14px] uppercase transition-colors duration-150 disabled:opacity-60"
                                            style={{
                                                background: BRAND_COLOR, fontFamily: "'Bebas Neue', sans-serif",
                                                fontSize: 16, letterSpacing: '0.1em'
                                            }}>
                                            {submittingReview
                                                ? <Loader2 size={16} className="animate-spin" />
                                                : 'POST REVIEW'}
                                        </button>
                                    </motion.div>
                                )}

                                {/* Review list */}
                                {product.reviews?.length > 0 ? (
                                    <div className="space-y-4">
                                        {product.reviews.map((review: any, i: number) => (
                                            <div key={i}
                                                className="border border-[#e0e0e0] hover:border-[#e8222e] p-6 transition-colors duration-150">
                                                <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                                                    <div>
                                                        <p className="uppercase text-[#111]"
                                                            style={{
                                                                fontFamily: "'Bebas Neue', sans-serif",
                                                                fontSize: 17, letterSpacing: '0.08em'
                                                            }}>
                                                            {review.user?.name || 'Verified Buyer'}
                                                        </p>
                                                        <div className="flex gap-1 mt-1">
                                                            {[...Array(5)].map((_, s) => (
                                                                <Star key={s} size={14}
                                                                    style={{
                                                                        fill: s < review.rating ? BRAND_COLOR : 'none',
                                                                        color: s < review.rating ? BRAND_COLOR : '#ccc'
                                                                    }} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-[#bbb] text-sm"
                                                        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.06em' }}>
                                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'RECENT'}
                                                    </span>
                                                </div>
                                                <p className="text-lg text-[#555] italic leading-relaxed"
                                                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                    "{review.comment}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 border-2 border-dashed border-[#e0e0e0]">
                                        <FileText size={38} className="mx-auto mb-4 text-[#ddd]" />
                                        <p className="uppercase text-[#bbb]"
                                            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.1em' }}>
                                            No reviews yet.
                                        </p>
                                        <p className="uppercase text-[#ccc] mt-1"
                                            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: '0.08em' }}>
                                            Be the first to share your experience.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ══════════════════════════════════════════
                RELATED PRODUCTS
            ══════════════════════════════════════════ */}
            <div className="max-w-[1280px] mx-auto px-6 pb-20">
                <div className="flex items-end justify-between border-b-2 border-[#111] pb-4 mb-6 flex-wrap gap-3">
                    <div>
                        <p className="text-sm uppercase mb-1"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", color: BRAND_COLOR, letterSpacing: '0.18em' }}>
                            RECOMMENDED
                        </p>
                        <h3 className="uppercase text-[#111]"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38 }}>
                            You May Also Like
                        </h3>
                    </div>
                    <button onClick={() => navigate('/products')}
                        className="flex items-center gap-1 text-sm text-[#999] hover:text-[#e8222e] uppercase transition-colors"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
                        VIEW ALL <ChevronRight size={13} />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {initialProducts.filter((p: any) => p.id !== product.id).slice(0, 4).map((p: any) => (
                        <div key={p.id}
                            onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}
                            className="cursor-pointer border border-[#e0e0e0] hover:border-[#111] hover:shadow-lg transition-all duration-150 group overflow-hidden">
                            <div className="bg-[#f5f5f5] aspect-square flex items-center justify-center p-4">
                                <img src={p.image || p.images?.[0]} alt={p.name}
                                    className="w-[82%] h-[82%] object-contain group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-[#bbb] uppercase mb-1"
                                    style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}>
                                    {p.category}
                                </p>
                                <p className="uppercase text-[#111] leading-tight mb-2 line-clamp-2 group-hover:text-[#e8222e] transition-colors"
                                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.04em' }}>
                                    {p.name}
                                </p>
                                <p className="text-[#111]"
                                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20 }}>
                                    Rs.{p.price.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;