import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, GitCompare, Rss } from 'lucide-react';
import { useCart } from '../contexts/CartContext.tsx';
import { toast } from 'react-toast';
import { Product } from '@/types.ts';
import QuickViewModal from './QuickViewModal.tsx';
import axios from 'axios';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart } = useCart();

const handleAddToCart =async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await axios.post("http://localhost:5000/api/addtocart",{
        productId: product.id,
        quantity: 1
      }
    , {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
}
    );
      if (res.status === 401) {
        toast.error("Please login to add items to cart.");
        return;
      }
      console.log(res);
      addToCart(res.data.cartItem, 1);
      toast.success(`${product.name} added to protocol.`);
    } catch (err: any) {
  if (err.response?.status === 401) {
    toast.error("Please login to add items to cart.");
    return;
  }
  toast.error("Failed to add item to cart.");
}
  };

  const booleanIsNew = (() => {
    const now = new Date();
    const createdAt = new Date(product.createdAt);
    const diffInDays = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 30; 
  })();

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();

    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  // const discount = product.originalPrice
  //   ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  //   : 0;

  return (
    <>
      <div
        className="group relative bg-brand-matte/5 border border-brand-matte/10 rounded-none overflow-hidden transition-luxury hover:shadow-2xl w-full max-w-[320px] flex flex-col"
        style={{ height: '440px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product.id}`} className="flex flex-col h-full">
          <div className="relative h-[260px] md:h-[280px] overflow-hidden bg-brand-matte/5 flex items-center justify-center shrink-0">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {booleanIsNew && (
                <span className="bg-brand-gold text-brand-matte text-[10px] font-black px-2 py-1 uppercase tracking-wider">
                  NEW
                </span>
              )}
              {/* {discount > 0 && (
                <span className="bg-brand text-white text-[10px] font-black px-2 py-1 uppercase tracking-wider">
                  -{discount}%
                </span>
              )} */}
            </div>

            <div
              className={`absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
            >
              <button
                onClick={(e) => { e.preventDefault(); }}
                className="w-9 h-9 bg-white border border-brand-matte/5 rounded-none flex items-center justify-center text-brand-matte hover:bg-brand-gold transition-colors shadow-md"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                onClick={handleQuickView}
                className="w-9 h-9 bg-white border border-brand-matte/5 rounded-none flex items-center justify-center text-brand-matte hover:bg-brand-gold transition-colors shadow-md"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`absolute bottom-0 left-0 right-0 bg-brand text-white py-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                isHovered ? 'translate-y-0' : 'translate-y-full'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              ADD TO CART
            </button>
          </div>

          <div className="p-4 md:p-5 flex-grow flex flex-col justify-between bg-white overflow-hidden">
            <div>
              <p className="text-[9px] font-black text-brand-gold uppercase tracking-[0.2em] mb-1">
                {product.category}
              </p>
              <h3 className="text-xs md:text-sm font-black text-brand-matte uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-brand transition-colors">
                {product.name}
              </h3>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-2">
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black text-brand italic tracking-tighter">
                  Rs. {product.price.toFixed(2)}
                </span>
                {/* {product.originalPrice && (
                  <span className="text-[10px] text-brand-matte/30 line-through font-bold">
                    RS{product.originalPrice.toFixed(2)}
                  </span>
                )} */}
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