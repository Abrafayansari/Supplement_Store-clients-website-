import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useStore } from '../StoreContext.tsx';
import { useCart } from '../contexts/CartContext.tsx';
import { CartItem } from '@/types.ts';

const Cart: React.FC = () => {
  const { items, showCart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    showCart();
    console.log(items)
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-black min-h-screen">
      <h1 className="text-4xl font-black text-white mb-12 uppercase tracking-tight">Shopping <span className="text-brand">Protocol</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {items.map(item => (
            <div key={`${item.product.id}-${item.product.variants.join('-')}-${item.product.size}`} className="flex flex-col sm:flex-row gap-8 bg-zinc-900 p-6 border border-zinc-800 hover:border-zinc-700 transition">
              <div className="w-full sm:w-40 h-40 bg-zinc-950 p-4 shrink-0 overflow-hidden border border-zinc-800">
                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain opacity-100" />
              </div>
              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white hover:text-brand transition cursor-pointer">
                      <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                    </h3>
                    <p className="text-sm text-zinc-500 font-medium mt-1 uppercase tracking-widest">
                      {item.product.variants.join(' • ')}
                    </p>

                  </div>
                  <span className="text-xl font-black text-brand">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-zinc-950 border border-zinc-800 p-1">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-zinc-800 transition text-zinc-400">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-zinc-800 transition text-zinc-400">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-zinc-600 hover:text-brand flex items-center gap-1.5 text-sm font-bold transition">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-8">
          <div className="bg-zinc-950 border border-brand/20 text-white p-8 space-y-6 shadow-2xl">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Order Summary</h2>

            <div className="space-y-4 border-b border-zinc-800 pb-6">
              <div className="flex justify-between font-medium text-zinc-500">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-zinc-500">
                <span>Shipping</span>
                <span className="text-white">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-black">
              <span>Total</span>
              <span className="text-brand text-shadow-red">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-brand text-white py-5 font-black text-lg hover:bg-white hover:text-black transition flex items-center justify-center gap-3"
            >
              Checkout Protocol <ArrowRight className="w-6 h-6" />
            </button>

            <p className="text-xs text-center text-zinc-600 font-medium">
              Lab testing and discrete handling included
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;