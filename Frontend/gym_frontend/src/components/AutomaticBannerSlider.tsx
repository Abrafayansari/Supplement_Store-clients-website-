import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import bannerAsset from '../assets/Gemini_Generated_Image_ccabcbccabcbccab.png';

interface Banner {
    id: string;
    /**
     * Desktop / landscape image — shown on md+ screens (≥ 768 px).
     * RECOMMENDED SIZE: 1920 × 700 px  (landscape ~16:4.5)
     */
    image: string;
    /**
     * Mobile portrait/square image — shown on screens < 768 px.
     * If omitted, falls back to `image`.
     * RECOMMENDED SIZE: 750 × 750 px  (square 1:1)
     */
    imageMobile?: string;
    title?: string;
    link?: string;
}

/* ─── FALLBACK BANNERS ────────────────────────────────────────────────────── */
const DEFAULT_BANNERS: Banner[] = [
    {
        id: 'default-1',
        image: bannerAsset,
        title: 'Welcome to NEXUS',
        link: '/products',
    },
    {
        id: 'default-2',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2000',
        title: 'Premium Performance',
        link: '/products',
    },
    {
        id: 'default-3',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=2000',
        title: 'Nexus Nutrition',
        link: '/products',
    },
];

/* ─── HOOK: detect mobile (< 768 px) ─────────────────────────────────────── */
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.innerWidth < 768
    );
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        setIsMobile(mq.matches);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return isMobile;
}

/* ─── COMPONENT ───────────────────────────────────────────────────────────── */
const AutomaticBannerSlider: React.FC = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/banners`);
                setBanners(res.data?.length > 0 ? res.data : DEFAULT_BANNERS);
            } catch {
                setBanners(DEFAULT_BANNERS);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // Fetch public admin settings (headline) so hero marquee/overlay can reflect admin updates
    const [adminHeadline, setAdminHeadline] = useState<string | null>(null);
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/settings`);
                if (res.data?.success && res.data?.data?.headline) {
                    setAdminHeadline(String(res.data.data.headline));
                }
            } catch (err) {
                // ignore — headline is optional
            }
        };
        fetchSettings();
    }, []);

    /* Auto-advance every 5 s */
    useEffect(() => {
        if (banners.length > 1) {
            const t = setInterval(
                () => setCurrentIndex(p => (p + 1) % banners.length),
                5000
            );
            return () => clearInterval(t);
        }
    }, [banners.length]);

    const nextSlide = () => setCurrentIndex(p => (p + 1) % banners.length);
    const prevSlide = () => setCurrentIndex(p => (p - 1 + banners.length) % banners.length);

    /* ── Marquee text ─────────────────────────────────────────────────────── */
    const isDefault = banners.length > 0 && String(banners[0].id).startsWith('default-');
    const titles   = isDefault ? [] : banners.map(b => b.title).filter(Boolean) as string[];
    const BASE_TXT = 'ELITE PERFORMANCE • UNCOMPROMISING QUALITY • NEXUS LABORATORY TESTED • BEYOND THE LIMIT • ';
    // Prefer admin-provided headline if available, otherwise banners' titles, otherwise base text
    const sourceText = adminHeadline ? adminHeadline : (titles.length ? `${titles.join(' • ')}` : BASE_TXT.trim());
    const marqueeText = `${sourceText} • `.repeat(6);
    const marqueeKey  = `mq-${adminHeadline || titles.join('|') || 'default'}`;

    /* ── Loading skeleton ─────────────────────────────────────────────────── */
    if (loading && banners.length === 0) {
        return (
            <>
                {/*
                 * Skeleton mirrors the exact same height logic as the real slider
                 * Mobile → square (pb-[100%] trick), md → 45 vh, lg → 50 vh
                 */}
                <div className="w-screen -ml-[calc(50vw-50%)] mt-0 bg-gray-100 animate-pulse
                                h-0 pb-[100%]
                                md:h-[45vh] md:pb-0
                                lg:h-[50vh]" />
                <div className="w-screen -ml-[calc(50vw-50%)] h-4 md:h-6 bg-white" />
                <div className="w-screen -ml-[calc(50vw-50%)] h-8 md:h-10 bg-gray-200 animate-pulse" />
            </>
        );
    }

    if (banners.length === 0) return null;

    const active = banners[currentIndex];
    /* Use mobile-specific image when available on small screens */
    const src = isMobile && active.imageMobile ? active.imageMobile : active.image;

    const Img = () => (
        <img
            src={src}
            alt={active.title || 'Banner'}
            /*
             * object-cover fills the container completely (same as the reference
             * site). Ensure your banner images have the key content centred so
             * nothing critical is cropped at narrower widths.
             */
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
        />
    );

    return (
        <>
            {/* ── BANNER SLIDER ─────────────────────────────────────────────────
             *
             *  HEIGHT PER BREAKPOINT
             *  ─────────────────────
             *  Mobile  (< 768 px)  →  100 vw  =  square
             *                          Achieved with the padding-top trick:
             *                          h-0 + pb-[100%] = height equals width.
             *  Tablet  (768–1023)  →  45 vh
             *  Desktop (≥ 1024 px) →  50 vh
             *
             *  The section is flush against the navbar (mt-0, no gap above).
             * ──────────────────────────────────────────────────────────────── */}
            <section
                className="relative w-screen overflow-hidden bg-black -ml-[calc(50vw-50%)] mt-0
                           h-0 pb-[100%]
                           md:h-[50vh] md:pb-0
                           lg:h-[65vh]"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${active.id}-${isMobile}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {active.link ? (
                            <Link to={active.link} className="block w-full h-full">
                                <Img />
                            </Link>
                        ) : (
                            <Img />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* ── Nav arrows ── */}
                {banners.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            aria-label="Previous slide"
                            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-10
                                       p-1.5 md:p-2.5 rounded-full
                                       bg-black/25 hover:bg-black/55
                                       text-white backdrop-blur-sm transition-all duration-200"
                        >
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </button>

                        <button
                            onClick={nextSlide}
                            aria-label="Next slide"
                            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-10
                                       p-1.5 md:p-2.5 rounded-full
                                       bg-black/25 hover:bg-black/55
                                       text-white backdrop-blur-sm transition-all duration-200"
                        >
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>

                        {/* ── Dot indicators ── */}
                        <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {banners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    aria-label={`Go to slide ${i + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        i === currentIndex
                                            ? 'w-5 md:w-6 bg-white'
                                            : 'w-1.5 bg-white/40 hover:bg-white/70'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* ── SPACER ──────────────────────────────────────────────────────── */}
            <div className="w-screen -ml-[calc(50vw-50%)] h-4 md:h-6 bg-white" />

            {/* ── MARQUEE HEADLINE ────────────────────────────────────────────── */}
            <div className="w-screen -ml-[calc(50vw-50%)] bg-brand-matte overflow-hidden
                            border-y border-white/5 relative z-20 py-2.5 md:py-3">
                <div className="flex whitespace-nowrap">
                    <motion.div
                        key={marqueeKey}
                        initial={{ x: 0 }}
                        animate={{ x: '-50%' }}
                        transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
                        className="flex items-center gap-4 text-white font-black
                                   text-[10px] sm:text-xs md:text-sm
                                   tracking-[0.3em] sm:tracking-[0.4em] uppercase"
                    >
                        <span className="px-4 sm:px-6">{marqueeText}</span>
                        <span className="px-4 sm:px-6">{marqueeText}</span>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default AutomaticBannerSlider;