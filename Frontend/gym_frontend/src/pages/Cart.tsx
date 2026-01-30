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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-black min-h-screen flex items-center justify-center">
        <NexusLoader />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center bg-black min-h-screen">
        <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-12 h-12 text-brand" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Your cart is empty</h1>
        <p className="text-zinc-500 text-lg mb-10 max-w-md mx-auto italic">Looks like you haven't added anything to your protocol yet.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-brand text-white px-10 py-4 font-black text-lg hover:bg-white hover:text-black transition shadow-xl shadow-brand/20">
          Browse Supplements <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-black min-h-screen">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight">CART <span className="text-brand">ARCHIVE</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">Individual deployment authorization required for each protocol.</p>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-brand text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-brand/20"
        >
          Checkout All Protocols
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