import { Category, getCategories, fetchProducts } from '@/src/data/Product';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Fallback high-quality images for categories
const fallbackImages: Record<string, string> = {
  protein: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=800',
  'pre-workout': 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&q=80&w=800',
  creatine: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=800',
  bcaa: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
  'mass-gainer': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
  vitamins: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=800',
  omega: 'https://images.unsplash.com/photo-1591195855210-5e8b3b0c17e2?auto=format&fit=crop&q=80&w=800',
  energy: 'https://images.unsplash.com/photo-1580910051070-16c34d7fdd18?auto=format&fit=crop&q=80&w=800',
  snacks: 'https://images.unsplash.com/photo-1601050695535-4c029d6110cf?auto=format&fit=crop&q=80&w=800',
  accessories: 'https://images.unsplash.com/photo-1599058917212-5da0c4485f5c?auto=format&fit=crop&q=80&w=800',
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          getCategories(),
          fetchProducts({ limit: 100 })
        ]);
        setCategories(catsRes);
        setProducts(prodsRes.products);
      } catch (error) {
        console.error('Failed to load category data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth / 2
        : scrollLeft + clientWidth / 2;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-12 h-12 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
    </div>
  );

  if (!categories.length) return null;

  return (
    <div className="relative group/slider">
      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -left-4 md:-left-8 -translate-y-1/2 z-30 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hidden lg:block">
        <button
          onClick={() => scroll('left')}
          className="w-14 h-14 bg-brand-gold text-brand-matte flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 rounded-none"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      </div>

      <div className="absolute top-1/2 -right-4 md:-right-8 -translate-y-1/2 z-30 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hidden lg:block">
        <button
          onClick={() => scroll('right')}
          className="w-14 h-14 bg-brand-gold text-brand-matte flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 rounded-none"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Horizontal Scroll Area */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-8 pb-12 transition-all no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {categories.map((category, index) => {
          const categoryProduct = products.find(p => p.category === category.name);
          const productImage = categoryProduct?.images?.[0];
          const imageKey = category.name.toLowerCase().replace(/\s+/g, '-');
          const displayImage = productImage || fallbackImages[imageKey] || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800';

          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-[200px] md:min-w-[260px] lg:min-w-[300px] aspect-[4/5] scroll-snap-align-start select-none"
              style={{ scrollSnapAlign: 'start' }}
            >
              <Link
                to={`/products?category=${category.name}`}
                className="group relative block w-full h-full overflow-hidden bg-brand-matte border border-white/5 shadow-2xl transition-all duration-700 active:scale-[0.98]"
              >
                {/* Image with overlay */}
                <img
                  src={displayImage}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 pointer-events-none"
                />

                {/* Gradient Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-matte via-brand-matte/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

                {/* Decorative Frame */}
                <div className="absolute inset-4 border border-white/0 group-hover:border-white/10 transition-all duration-700 pointer-events-none" />

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end items-center text-center">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out w-full">
                    <span className="text-brand-gold text-[9px] font-black uppercase tracking-[0.4em] mb-3 block opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      Explore Now
                    </span>

                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-4 italic leading-[1.1] group-hover:text-brand-gold transition-colors duration-500 px-2" title={category.name}>
                      {category.name.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                    </h3>

                    <div className="w-16 h-1 bg-brand-gold mx-auto scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
                  </div>

                  {/* Quick Action Icon */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-x-6 group-hover:translate-x-0">
                    <div className="w-10 h-10 bg-white text-brand-matte flex items-center justify-center shadow-2xl hover:bg-brand-gold transition-colors group/btn">
                      <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute -inset-24 bg-brand-gold/10 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full -z-10 pointer-events-none" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Scroll indicator */}
      {/* <div className="flex justify-center items-center gap-3 mt-8">
        {categories.map((_, i) => (
          <div
            key={i}
            className="h-1 bg-white/10 transition-all duration-500 rounded-full"
            style={{
              width: categories.length > 5 ? '12px' : '20px',
              backgroundColor: i === 0 ? 'rgba(201, 162, 119, 0.8)' : 'rgba(255, 255, 255, 0.1)'
            }}
          />
        ))}
      </div> */}
    </div>
  );
};

export default Categories;
