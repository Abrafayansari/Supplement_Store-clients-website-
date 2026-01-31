import React, { useState } from 'react';
import { X, ShoppingCart, Minus, Plus, ExternalLink, Star, ShieldCheck, Zap, Loader2 } from 'lucide-react';
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
  const [selectedVariant, setSelectedVariant] = useState<any>(product?.variants?.[0] || null);
  const [selectedSize, setSelectedSize] = useState<string>(product?.variants?.[0]?.size || '');
  const [selectedFlavor, setSelectedFlavor] = useState<string>(product?.variants?.[0]?.flavor || '');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const uniqueSizes = Array.from(new Set(product?.variants?.map((v: any) => v.size) || []));
  const availableFlavors = Array.from(new Set(product?.variants?.filter((v: any) => v.size === selectedSize).map((v: any) => v.flavor).filter(Boolean) || []));

  React.useEffect(() => {
    if (product?.variants?.length) {
      const matches = product.variants.filter((v: any) => v.size === selectedSize && (v.flavor === selectedFlavor || !v.flavor));
      if (matches.length > 0) {
        if (selectedFlavor && !matches.some((m: any) => m.flavor === selectedFlavor)) {
          setSelectedFlavor(matches[0].flavor || '');
          setSelectedVariant(matches[0]);
        } else {
          setSelectedVariant(matches.find((m: any) => m.flavor === selectedFlavor) || matches[0]);
        }
      }
    }
  }, [selectedSize, selectedFlavor, product]);

  if (!product) return null;

  const handleAddToCart = async () => {
    if (loading) return;
    if (!localStorage.getItem("token")) {
      toast.error("Login required");
      return;
    }

    try {
      setLoading(true);
      await addToCart(product, quantity, selectedVariant?.id);
      setQuantity(1);
      onClose();
    } finally {
      setLoading(false);
    }
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
          className="relative w-full bg-brand-warm border border-brand-matte/5 shadow-2xl sm:rounded-[32px] overflow-hidden grid lg:grid-cols-2"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/40 flex items-center justify-center transition-all border border-white/5"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Image */}
          <div className="relative h-[300px] sm:h-[400px] lg:h-[600px] bg-white flex items-center justify-center p-8 overflow-hidden group">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(201,162,77,0.05),transparent_70%)]"></div>

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
          <div className="p-8 lg:p-12 flex flex-col relative bg-brand-warm border-l border-brand-matte/5">
            <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-brand-warm/80 to-transparent pointer-events-none lg:hidden"></div>

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
                        className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-brand-matte/10'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-brand-matte/30 italic">({product.reviewCount || 0} User Ratings)</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl lg:text-4xl font-black text-brand-matte uppercase tracking-tight leading-none mb-2 italic"
                >
                  {product.name}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4 flex-wrap"
                >
                  <span className="text-3xl font-black text-brand-matte italic tracking-tighter">
                    Rs. {(selectedVariant ? (selectedVariant.discountPrice || selectedVariant.price) : (product.discountPrice || product.price)).toLocaleString()}
                  </span>
                  {(selectedVariant?.discountPrice || product.discountPrice) && (
                    <span className="text-lg text-brand-matte/20 line-through font-bold">
                      Rs. {(selectedVariant ? selectedVariant.price : product.price).toLocaleString()}
                    </span>
                  )}
                  {selectedVariant && (
                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.4em]">
                      / {selectedVariant.size} {selectedVariant.flavor && `- ${selectedVariant.flavor}`}
                    </span>
                  )}
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-brand-matte/60 text-sm font-medium leading-relaxed border-l-4 border-brand-gold pl-6"
              >
                {product.description || "Experience peak performance with our premium supplement range."}
              </motion.p>

              {/* Variant Selection */}
              {product.variants && product.variants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-4"
                >
                  {/* Primary Attribute */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-matte/30">Select {product.variantType || 'Size'}</h4>
                    <div className="flex flex-wrap gap-3">
                      {uniqueSizes.map((sz: any) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-none
                            ${selectedSize === sz
                              ? 'bg-brand text-white shadow-lg shadow-brand/20'
                              : 'bg-white text-brand-matte/60 border border-brand-matte/10 hover:border-brand-gold'
                            }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Secondary Attribute (Flavor) */}
                  {availableFlavors.length > 0 && (
                    <div className="space-y-3 animate-in fade-in duration-500">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-matte/30">Select Flavor</h4>
                      <div className="flex flex-wrap gap-3">
                        {availableFlavors.map((fl: any) => (
                          <button
                            key={fl}
                            onClick={() => setSelectedFlavor(fl)}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-none
                              ${selectedFlavor === fl
                                ? 'bg-brand-gold text-white shadow-lg shadow-brand-gold/20'
                                : 'bg-white text-brand-matte/60 border border-brand-matte/10 hover:border-brand-gold'
                              }`}
                          >
                            {fl}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Features Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="p-4 rounded-none bg-white border border-brand-matte/5 flex items-center gap-4">
                  <Zap className="w-5 h-5 text-brand-gold" />
                  <div>
                    <div className="text-[9px] text-brand-matte/40 uppercase font-black tracking-widest">Quality</div>
                    <div className="text-[11px] font-black text-brand-matte uppercase">Top Quality</div>
                  </div>
                </div>
                <div className="p-4 rounded-none bg-white border border-brand-matte/5 flex items-center gap-4">
                  <ShieldCheck className="w-5 h-5 text-brand-gold" />
                  <div>
                    <div className="text-[9px] text-brand-matte/40 uppercase font-black tracking-widest">Original</div>
                    <div className="text-[11px] font-black text-brand-matte uppercase">Certified</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white border border-brand-matte/10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 hover:bg-brand-gold/10 transition-colors text-brand-matte/40 hover:text-brand-gold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-brand-matte font-black text-lg italic">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant ? selectedVariant.stock : product.stock, quantity + 1))}
                    className="p-4 hover:bg-brand-gold/10 transition-colors text-brand-matte/40 hover:text-brand-gold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || loading}
                  className="flex-1 bg-brand text-white font-black uppercase tracking-[0.3em] text-[10px] py-5 transition-luxury hover:bg-brand-gold shadow-lg hover:shadow-brand/20 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'} <ShoppingCart className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={navigateToDetails}
                className="w-full py-4 text-[10px] font-black text-brand-matte/30 hover:text-brand-gold uppercase tracking-[0.3em] transition-luxury flex items-center justify-center gap-3 border border-brand-matte/5 hover:border-brand-gold/20"
              >
                View Full Details <ExternalLink className="w-3 h-3 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;