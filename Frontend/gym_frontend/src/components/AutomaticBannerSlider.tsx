import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NexusLoader from './NexusLoader';

import bannerAsset from '../assets/Gemini_Generated_Image_ccabcbccabcbccab.png';

interface Banner {
    id: string;
    image: string;
    title?: string;
    link?: string;
}

const AutomaticBannerSlider: React.FC = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const DEFAULT_BANNERS: Banner[] = [
        {
            id: 'default-1',
            image: bannerAsset,
            title: 'Welcome to NEXUS',
            link: '/products'
        },
        {
            id: 'default-2',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2000',
            title: 'Premium Performance',
            link: '/products'
        },
        {
            id: 'default-3',
            image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=2000',
            title: 'Nexus Nutrition',
            link: '/products'
        }
    ];

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/banners`);
                if (response.data && response.data.length > 0) {
                    setBanners(response.data);
                } else {
                    setBanners(DEFAULT_BANNERS);
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
                setBanners(DEFAULT_BANNERS);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % banners.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (loading && banners.length === 0) {
        return (
            <div className="w-screen h-[40vh] md:h-[60vh] lg:h-[75vh] min-h-[300px] flex items-center justify-center bg-[#F2F2F2] -ml-[calc(50vw-50%)] mb-0">
                <NexusLoader />
            </div>
        );
    }

    if (banners.length === 0) return null;

    return (
        <>
        <section className="relative w-screen h-[40vh] md:h-[60vh] lg:h-[75vh] min-h-[300px] overflow-hidden bg-white -ml-[calc(50vw-50%)] mb-0">
            <AnimatePresence mode="wait">
                <motion.div
                    key={banners[currentIndex].id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full bg-brand-warm"
                >
                    <img
                        src={banners[currentIndex].image}
                        alt={banners[currentIndex].title || 'Sales Banner'}
                        className="w-full h-full object-cover md:object-contain bg-brand-warm"
                        loading="eager"
                        fetchPriority="high"
                    />
                    {/* Overlay for contrast if needed */}
                    <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                </motion.div>
            </AnimatePresence>

            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all z-10"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all z-10"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex mb-2 gap-3 z-10">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-brand w-8' : 'bg-brand-warm/50'
                                    }`}
                            />
                        ))}
                    </div> */}
                </>
            )}
        </section>

        {/* HEADLINE: if API-provided banners are present, show their title(s); otherwise render default marquee text */}
        <div className="bg-brand-matte py-2 md:py-3 overflow-hidden border-y border-white/5 relative z-20">
            <div className="flex whitespace-nowrap">
                {/* determine if we're using default fallback banners (default- ids) */}
                {(() => {
                    const DEFAULT_MARQUEE = "ELITE PERFORMANCE • UNCOMPROMISING QUALITY • NEXUS LABORATORY TESTED • BEYOND THE LIMIT • ";
                    const isUsingDefault = banners.length > 0 && String(banners[0].id).startsWith('default-');

                    // Build a single headline string containing all banner titles (title1 • title2 • ...)
                    const titles = (!isUsingDefault && banners.length > 0)
                        ? banners.map(b => b.title).filter(Boolean) as string[]
                        : [];
                    const base = titles.length > 0 ? `${titles.join(' • ')} • ` : DEFAULT_MARQUEE;
                    const marqueeSource = base.repeat(6);

                    // Key the motion div on the joined titles so animation restarts when titles change
                    const key = `headline-${titles.join('|') || 'default'}`;

                    return (
                        <motion.div
                            key={key}
                            initial={{ x: 0 }}
                            animate={{ x: "-50%" }}
                            transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
                            className="flex items-center gap-4 text-white font-black text-xs md:text-sm tracking-[0.4em] uppercase"
                        >
                            <span className="px-6">{marqueeSource}</span>
                            <span className="px-6">{marqueeSource}</span>
                        </motion.div>
                    );
                })()}
            </div>
        </div>
        </>
    );
};

export default AutomaticBannerSlider;
