import React, { useState } from 'react';
import { X, ShoppingCart, Heart, Minus, Plus, ExternalLink, ShieldX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../data/Product.tsx';
import { useCart } from '../contexts/CartContext.tsx';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from './ui/dialog.tsx';
import { Button } from './ui/button.tsx';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} × ${product.name} added to cart!`);
    setQuantity(1);
    onClose();
  };

  const navigateToDetails = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-brand-warm border-none overflow-hidden rounded-none shadow-3xl group/modal">
        <VisuallyHidden>
          <DialogTitle>{product.name} - Quick View</DialogTitle>
        </VisuallyHidden>

        {/* CUSTOM ENHANCED CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[100] w-12 h-12 bg-brand-matte text-white flex items-center justify-center hover:bg-brand-gold transition-luxury group-hover/modal:scale-110"
          title="Cut Protocol Access"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative bg-white aspect-square p-12 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-brand-gold text-brand-matte text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                  NEW
                </span>
              )}
              {discount > 0 && (
                <span className="bg-brand text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                  -{discount}%
                </span>
              )}
            </div>
          </div>

          <div className="p-8 md:p-12 flex flex-col justify-center bg-brand-warm">
            <p className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4">
              {product.category} SERIES
            </p>
            <h2 className="text-4xl font-black text-brand-matte uppercase tracking-tighter leading-none mb-8">
              {product.name}
            </h2>

            <div className="flex items-center gap-6 mb-8">
              <span className="text-4xl font-black text-brand italic tracking-tighter">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-brand-matte/20 line-through text-lg font-black italic">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-brand-matte/60 text-sm italic font-light leading-relaxed mb-10 border-l-2 border-brand-gold pl-6">
              {product.description}
            </p>

            <div className="flex items-center gap-8 mb-12">
              <div className="flex items-center bg-white border border-brand-matte/5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 hover:bg-brand-matte/5 transition-colors"
                >
                  <Minus className="w-4 h-4 text-brand-matte" />
                </button>
                <span className="px-6 py-2 text-brand-matte font-black min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-4 hover:bg-brand-matte/5 transition-colors"
                >
                  <Plus className="w-4 h-4 text-brand-matte" />
                </button>
              </div>
              <span className="text-[10px] font-black text-brand-matte/30 uppercase tracking-widest">
                Authorized stock: {product.stock}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full btn-luxury py-8 text-[11px] font-black uppercase tracking-[0.4em] rounded-none shadow-xl"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Authorize Deployment
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={navigateToDetails}
                    className="w-full py-4 bg-transparent border border-brand-matte/10 text-brand-matte/60 text-[9px] font-black uppercase tracking-[0.3em] hover:border-brand-gold hover:text-brand-matte transition-luxury flex items-center justify-center gap-2"
                  >
                    Details <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={onClose}
                    className="w-full py-4 bg-transparent border border-brand/20 text-brand/60 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-brand hover:text-white transition-luxury flex items-center justify-center gap-2"
                  >
                    Cut Protocol <ShieldX className="w-3.5 h-3.5" />
                  </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;