import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MOCK_PRODUCTS } from '../mockData.ts';
import { Product } from '@/types.ts';

interface SliderProps {
  products?: Product[];
  loading?: boolean;
}

const Slider: React.FC<SliderProps> = ({ products, loading }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Use provided products or fallback to MOCK_PRODUCTS if none provided or still loading
  const displayProducts = (products && products.length > 0) ? products : MOCK_PRODUCTS;
  const sliderProducts = displayProducts.slice(0, 8);
  const duplicatedProducts = [...sliderProducts, ...sliderProducts, ...sliderProducts];

  const duration1 = isHovered ? 180 : 70;
  const duration2 = isHovered ? 160 : 60;

  if (loading && (!products || products.length === 0)) {
    return (
      <div className="w-full max-w-[480px] ml-auto h-[800px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative w-full max-w-[480px] ml-auto h-[800px] overflow-hidden hidden lg:flex gap-6 pr-4 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ scale: isHovered ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 70, damping: 25 }}
    >
      {/* Edge Fades - Changed from black to white */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-white via-white/80 to-transparent z-20 pointer-events-none"></div>
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none"></div>

      {/* Column 1: Downward */}
      <div className="flex-1">
        <motion.div
          animate={{ y: ["-33.33%", "0%"] }}
          transition={{ duration: duration1, ease: "linear", repeat: Infinity }}
          className="flex flex-col gap-6"
        >
          {duplicatedProducts.map((product, idx) => (
            <Link to={`/product/${product.id}`} key={`${idx}-col1`}>
              <motion.div
                whileHover={{ y: -5, borderColor: "rgba(123, 15, 23, 0.2)", backgroundColor: "rgba(123, 15, 23, 0.02)" }}
                className={`w-full ${idx % 3 === 0 ? 'aspect-square' : 'aspect-[4/5]'} bg-brand-warm/50 border border-black/5 rounded-none p-6 flex items-center justify-center transition-all duration-300 relative group/item overflow-hidden shadow-sm`}
              >
                {/* Product Name Label - Light Theme */}
                <span className="absolute bottom-4 left-0 right-0 text-center text-[8px] font-black text-brand-matte/20 uppercase tracking-[0.3em] z-30 opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap px-2 overflow-hidden text-ellipsis">
                  {product.name}
                </span>

                <img
                  src={product.images && product.images.length > 0 ? product.images[0] : (product as any).image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-all duration-700 scale-[0.9] group-hover/item:scale-105 group-hover/item:grayscale-0 grayscale-[0.5]"
                />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Column 2: Upward */}
      <div className="flex-1 pt-32">
        <motion.div
          animate={{ y: ["0%", "-33.33%"] }}
          transition={{ duration: duration2, ease: "linear", repeat: Infinity }}
          className="flex flex-col gap-6"
        >
          {duplicatedProducts.map((product, idx) => (
            <Link to={`/product/${product.id}`} key={`${idx}-col2`}>
              <motion.div
                whileHover={{ y: -5, borderColor: "rgba(123, 15, 23, 0.2)", backgroundColor: "rgba(123, 15, 23, 0.02)" }}
                className={`w-full ${idx % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'} bg-brand-warm/50 border border-black/5 rounded-none p-6 flex items-center justify-center transition-all duration-300 relative group/item overflow-hidden shadow-sm`}
              >
                <span className="absolute bottom-4 left-0 right-0 text-center text-[8px] font-black text-brand-matte/20 uppercase tracking-[0.3em] z-30 opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap px-2 overflow-hidden text-ellipsis">
                  {product.name}
                </span>

                <img
                  src={product.images && product.images.length > 0 ? product.images[0] : (product as any).image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-all duration-700 scale-[0.9] group-hover/item:scale-105 group-hover/item:grayscale-0 grayscale-[0.5]"
                />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Slider;
