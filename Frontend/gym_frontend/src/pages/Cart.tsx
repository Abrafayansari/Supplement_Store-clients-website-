import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext.tsx';
import ProductCard from '../components/ProductCard.tsx';
import NexusLoader from '../components/NexusLoader.tsx';

const Cart: React.FC = () => {
  const { items, showCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        await showCart();
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-brand-warm min-h-screen flex items-center justify-center">
        <NexusLoader />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center bg-brand-warm min-h-screen">
        <div className="w-24 h-24 bg-white border border-brand-matte/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-brand" />
        </div>
        <h1 className="text-4xl font-black text-brand-matte mb-4 uppercase tracking-tighter">Your cart is empty</h1>
        <p className="text-brand-matte/60 text-lg mb-10 max-w-md mx-auto italic font-light">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-brand text-white px-10 py-4 font-black text-[12px] uppercase tracking-widest hover:bg-brand-matte transition shadow-xl shadow-brand/10">
          Browse Products <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-brand-warm min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <h1 className="text-5xl font-black text-brand-matte uppercase tracking-tighter">YOUR <span className="text-brand italic">CART</span></h1>
          <p className="text-brand-matte/40 font-black uppercase tracking-widest text-[10px] mt-2 italic">Standard checkout process for each order.</p>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-brand text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-brand-matte transition-all shadow-xl shadow-brand/10"
        >
          Checkout All Products
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map(item => (
          <ProductCard
            key={item.id}
            product={item.product}
            variant={item.variant}
            mode="buyNow"
          />
        ))}
      </div>
    </div>
  );
};

export default Cart;