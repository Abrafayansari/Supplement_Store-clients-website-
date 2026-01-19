import React, { useState } from 'react';
import { X, ShoppingCart, Minus, Plus, ExternalLink, Star, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../contexts/CartContext.tsx';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from './ui/dialog.tsx';
import { Button } from './ui/button.tsx';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart!`);
    setQuantity(1);
    onClose();
  };

  const navigateToDetails = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  // Calculate discount percentage if original price exists (mocking original price logic if not present in type)
  // Assuming 'originalPrice' might be added later or we calculate some dummy discount for 'premium' feel if needed.
  // For now, we will just start with 0 unless we want to hardcode a visual effect.
  // The Product type doesn't have originalPrice, so we'll omit it or simulate it for demo purposes if desired.
  // We'll skip exact discount calc based on undefined props to avoid TS errors.

  const mainImage = product.images?.[0] || 'https://via.placeholder.com/400';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto p-0 bg-transparent border-none shadow-none sm:rounded-[32px]">
        <VisuallyHidden>
          <DialogTitle>{product.name} - Quick View</DialogTitle>
        </VisuallyHidden>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full bg-[#0E0E0E] border border-white/10 shadow-2xl sm:rounded-[32px] overflow-hidden grid lg:grid-cols-2"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/40 flex items-center justify-center transition-all border border-white/5"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Image */}
          <div className="relative h-[300px] sm:h-[400px] lg:h-[600px] bg-gradient-to-br from-[#1a1a1a] to-black flex items-center justify-center p-8 overflow-hidden group">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(201,162,77,0.1),transparent_70%)]"></div>

            <motion.img
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              src={mainImage}
              alt={product.name}
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
              {product.stock < 10 && product.stock > 0 && (
                <span className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  Low Stock
                </span>
              )}
              {product.brand && (
                <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  {product.brand}
                </span>
              )}
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="p-8 lg:p-12 flex flex-col relative bg-[#0E0E0E]">
            <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-[#0E0E0E] to-transparent pointer-events-none lg:hidden"></div>

            <div className="mb-auto space-y-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <div className="flex text-brand-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-white/10'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-white/40">({product.reviewCount || 0} reviews)</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-none mb-2"
                >
                  {product.name}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-baseline gap-4"
                >
                  <span className="text-3xl font-bold text-brand-gold">${product.price.toFixed(2)}</span>
                  {/* Mock original price for visuals if we had it, omitting for now */}
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/60 text-sm leading-relaxed border-l-2 border-brand-gold/30 pl-4"
              >
                {product.description || "Experience peak performance with our scientifically formulated supplement protocol."}
              </motion.p>

              {/* Features Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-3"
              >
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-brand-gold" />
                  <div>
                    <div className="text-[10px] text-white/40 uppercase font-bold">Potency</div>
                    <div className="text-xs font-bold text-white">High Grade</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-gold" />
                  <div>
                    <div className="text-[10px] text-white/40 uppercase font-bold">Lab Tested</div>
                    <div className="text-xs font-bold text-white">Certified</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white/5 rounded-xl border border-white/10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white/5 transition-colors text-white/60 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-white font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-white/5 transition-colors text-white/60 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-brand hover:bg-brand-gold text-white font-black uppercase tracking-widest text-xs py-6 rounded-xl shadow-lg hover:shadow-brand/20 transition-all border-none"
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'} <ShoppingCart className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <button
                onClick={navigateToDetails}
                className="w-full py-3 text-xs font-bold text-white/40 hover:text-brand-gold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group/link"
              >
                View Full Protocol <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;