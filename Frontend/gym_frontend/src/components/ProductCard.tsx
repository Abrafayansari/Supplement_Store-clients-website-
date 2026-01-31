import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, CreditCard, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext.tsx';
import { toast } from 'sonner';
import { Product } from '@/types.ts';
import QuickViewModal from './QuickViewModal.tsx';
import { useWishlist } from '../contexts/WishlistContext.tsx';

interface ProductCardProps {
  product: Product;
  variant?: any;
  mode?: 'default' | 'buyNow';
}

const ProductCard = ({ product, variant, mode = 'default' }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, checkIfWishlisted } = useWishlist();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      const exists = await checkIfWishlisted(product.id);
      setIsWishlisted(exists);
    }
    check();
  }, [product.id, checkIfWishlisted]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!localStorage.getItem("token")) {
      toast.error("Login required");
      return;
    }
    if (loading) return;

    try {
      setLoading(true);
      await addToCart(product, 1);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!localStorage.getItem("token")) {
      toast.error("Login required");
      return;
    }
    navigate('/checkout', { state: { singleItem: { product, quantity: 1, variant, variantId: variant?.id } } });
  };


  const booleanIsNew = (() => {
    const now = new Date();
    const createdAt = new Date(product.createdAt);
    const diffInDays = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 30;
  })();

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!localStorage.getItem("token")) {
      toast.error("Login required");
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
      }
    } catch {
      // errors handled in context
    }
  };



  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();

    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const displayPrice = variant ? (variant.discountPrice || variant.price) : (product.discountPrice || product.price);
  const originalPrice = variant ? (variant.discountPrice ? variant.price : null) : (product.discountPrice ? product.price : null);

  const discount = originalPrice
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  return (
    <>
      <div
        className="group relative bg-white border border-brand-matte/5 rounded-none overflow-hidden transition-all duration-500 hover:shadow-2xl w-full max-w-[320px] flex flex-col shadow-sm"
        style={{ height: '440px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product.id}`} className="flex flex-col h-full">
          <div className="relative h-[260px] md:h-[280px] overflow-hidden bg-brand-warm/30 flex items-center justify-center shrink-0">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1593095191850-2a0bf3a772bf?auto=format&fit=crop&q=80&w=800'}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {booleanIsNew && (
                <span className="bg-brand-gold text-brand-matte text-[10px] font-black px-2 py-1 uppercase tracking-wider shadow-sm">
                  NEW
                </span>
              )}
              {discount > 0 && (
                <span className="bg-brand text-white text-[10px] font-black px-2 py-1 uppercase tracking-wider shadow-sm">
                  SALE {discount}% OFF
                </span>
              )}
            </div>

            <div
              className={`absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 
                opacity-100 translate-x-0
                lg:opacity-0 lg:translate-x-4
                ${isHovered ? 'lg:opacity-100 lg:translate-x-0' : ''}
              `}
            >
              <button
                onClick={handleAddToWishlist}
                className={`w-9 h-9 border rounded-none flex items-center justify-center transition-colors shadow-md
    ${isWishlisted
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-brand-matte border-brand-matte/5 hover:bg-brand-gold'
                  }
  `}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isWishlisted ? 'currentColor' : 'none'}
                />
              </button>


              <button
                onClick={handleQuickView}
                className="w-9 h-9 bg-white border border-brand-matte/5 rounded-none flex items-center justify-center text-brand-matte hover:bg-brand-gold transition-colors shadow-md"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {mode === 'default' ? (
              <button
                onClick={handleAddToCart}
                disabled={loading}
                className={`absolute bottom-0 left-0 right-0 bg-brand-matte text-white py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 
                    translate-y-0
                    lg:translate-y-full
                    ${isHovered ? 'lg:translate-y-0' : ''}
                    ${loading ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:bg-brand'}
                  `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    ADDING...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    ADD TO CART
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleBuyNow}
                className={`absolute bottom-0 left-0 right-0 bg-brand text-white py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 
                  translate-y-0
                  lg:translate-y-full
                  ${isHovered ? 'lg:translate-y-0' : ''}
                  hover:bg-brand-matte
                `}
              >
                <CreditCard className="w-4 h-4" />
                BUY NOW
              </button>
            )}
          </div>

          <div className="p-4 md:p-5 flex-grow flex flex-col justify-between bg-white overflow-hidden">
            <div>
              <p className="text-[9px] font-black text-brand-gold uppercase tracking-[0.2em] mb-1">
                {product.category}
              </p>
              <h3 className="text-xs md:text-sm font-black text-brand-matte uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-brand transition-colors">
                {product.name} {variant && <span className="text-brand-gold">({variant.size})</span>}
              </h3>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-matte/5">
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black text-brand italic tracking-tighter">
                  {!variant && product.variants.length > 1 && <span className="text-[10px] font-bold not-italic mr-1 text-brand-matte/40 uppercase tracking-widest text-shadow-none">From</span>}
                  Rs. {displayPrice.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-[10px] text-brand-matte/30 line-through font-black">
                    Rs. {originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex text-brand-gold">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[10px] md:text-xs">
                    {i < Math.floor(product.rating) ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;