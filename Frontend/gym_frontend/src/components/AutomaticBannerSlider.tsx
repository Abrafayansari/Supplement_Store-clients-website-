import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/banners`);
                setBanners(response.data);
            } catch (error) {
                console.error('Error fetching banners:', error);
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

    if (loading || banners.length === 0) return null;

    return (
        <section className="relative w-full h-[300px] md:h-[500px] overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={banners[currentIndex].id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img
                        src={banners[currentIndex].image}
                        alt={banners[currentIndex].title || 'Sales Banner'}
                        className="w-full h-full object-cover opacity-80"
                    />
                    {(banners[currentIndex].title || banners[currentIndex].link) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-transparent via-black/20 to-black/60">
                            {banners[currentIndex].title && (
                                <motion.h2
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8"
                                >
                                    {banners[currentIndex].title}
                                </motion.h2>
                            )}
                            {banners[currentIndex].link && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Link
                                        to={banners[currentIndex].link || '#'}
                                        className="px-10 py-4 bg-brand text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
                                    >
                                        Shop Now
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all z-10"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all z-10"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-brand w-8' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default AutomaticBannerSlider;
