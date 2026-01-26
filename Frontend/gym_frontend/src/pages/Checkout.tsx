
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, CheckCircle, ArrowLeft, Lock, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Product } from '@/types';

const API_URL = import.meta.env.VITE_API_URL

const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan'
];

interface LocationState {
  singleItem?: {
    product: Product;
    quantity: number;
  }
}

const Checkout: React.FC = () => {
  const { items: cartItems, clearCart, totalPrice: cartTotalPrice } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [isOrdered, setIsOrdered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSingleItem = !!state?.singleItem;
  const itemsToProcess = isSingleItem ? [state.singleItem!] : cartItems;

  const subtotal = isSingleItem
    ? state.singleItem!.product.price * state.singleItem!.quantity
    : cartTotalPrice;

  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 300;
  const total = subtotal + shipping;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: PAKISTAN_PROVINCES[0],
    zipCode: '',
    country: 'Pakistan'
  });

  useEffect(() => {
    if (user?.address) {
      const addr = user.address;
      setFormData({
        fullName: addr.fullName,
        phone: addr.phone,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
        country: addr.country
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      setError("You must be logged in to place an order.");
      return;
    }

    if (itemsToProcess.length === 0) {
      setError("Your protocol is empty. Add items to authorize deployment.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let addressId = user.address?.id;

      // 1. Create or Update Address
      if (!addressId) {
        const addrRes = await axios.post(`${API_URL}/address`, {
          ...formData,
          userId: user.id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        addressId = addrRes.data.address.id;
      } else {
        await axios.put(`${API_URL}/address/${user.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // 2. Create Order
      const orderItems = itemsToProcess.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      await axios.post(`${API_URL}/orders`, {
        userId: user.id,
        addressId,
        items: orderItems
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsOrdered(true);
      if (!isSingleItem) {
        await clearCart();
      }
      setTimeout(() => {
        navigate('/profile');
      }, 5000);

    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.response?.data?.error || "Failed to process order. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-40 text-center animate-in fade-in zoom-in duration-700 bg-black min-h-screen">
        <div className="w-24 h-24 bg-brand rounded-full flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-brand/40">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-serif text-white italic mb-6">Sequence Confirmed.</h1>
        <p className="text-zinc-500 text-lg mb-12 max-w-md mx-auto font-light">Your protocol is being prepared for immediate dispatch. View your deployment status in your terminal.</p>
        <div className="bg-zinc-900 p-8 border border-zinc-800 text-left space-y-4">
          <h3 className="text-xs font-black text-brand uppercase tracking-widest">Protocol Initialized</h3>
          <p className="text-sm text-zinc-400">Deployment coordinates confirmed. ETA 2-4 business days. Redirecting to your command center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-black min-h-screen pt-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <div className="space-y-16">
          <div className="space-y-4">
            <h1 className="text-6xl font-serif text-white leading-tight">Authorize <span className="italic text-brand">Deployment</span></h1>
            <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">Verify your logistics and financial credentials.</p>
          </div>

          {error && (
            <div className="bg-red-950/30 border border-red-500/50 p-4 text-red-500 text-xs font-bold uppercase tracking-widest">
              Error: {error}
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-12">
            <section className="space-y-8">
              <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-brand">
                <Truck className="w-5 h-5" /> Logistic Coordinates
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Full Name</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full bg-zinc-900 border border-zinc-800 p-5 outline-none focus:border-brand/40 text-white transition-all uppercase text-xs tracking-widest font-bold" />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Phone Pulse</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-zinc-900 border border-zinc-800 p-5 outline-none focus:border-brand/40 text-white transition-all uppercase text-xs tracking-widest font-bold" />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Archive Street</label>
                  <input required name="street" value={formData.street} onChange={handleInputChange} type="text" className="w-full bg-zinc-900 border border-zinc-800 p-5 outline-none focus:border-brand/40 text-white transition-all uppercase text-xs tracking-widest font-bold" />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Sector (City)</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full bg-zinc-900 border border-zinc-800 p-5 outline-none focus:border-brand/40 text-white transition-all uppercase text-xs tracking-widest font-bold" />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Province (State)</label>
                  <select
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-zinc-800 p-5 outline-none focus:border-brand/40 text-white transition-all uppercase text-xs tracking-widest font-bold appearance-none cursor-pointer"
                  >
                    {PAKISTAN_PROVINCES.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Post Zone (Zip)</label>
                  <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} type="text" className="w-full bg-zinc-900 border border-zinc-800 p-5 outline-none focus:border-brand/40 text-white transition-all uppercase text-xs tracking-widest font-bold" />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Region (Country)</label>
                  <select
                    required
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-zinc-800 p-5 outline-none focus:border-brand/40 text-white transition-all uppercase text-xs tracking-widest font-bold appearance-none cursor-not-allowed"
                    disabled
                  >
                    <option value="Pakistan">Pakistan</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-brand">
                <CreditCard className="w-5 h-5" /> Financial Protocol
              </div>
              <div className="space-y-4">
                <div className="bg-zinc-900 p-6 border border-brand/40 flex items-center justify-between shadow-red-glow">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-black flex items-center justify-center p-2 border border-zinc-800">
                      <Lock className="w-6 h-6 text-brand" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">Vigor-Link Secure Card</p>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">Ends in •••• 4242</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-brand bg-brand flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <button type="button" className="w-full py-5 border-2 border-dashed border-zinc-800 text-zinc-600 font-black uppercase text-[10px] tracking-[0.3em] hover:border-brand/40 hover:text-brand transition-all">
                  + Add New Funding Source
                </button>
              </div>
            </section>

            <button
              type="submit"
              disabled={isLoading || itemsToProcess.length === 0}
              className="w-full bg-brand text-white py-6 text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-brand/20 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Protocol...
                </>
              ) : (
                `Confirm Purchase: $${total.toFixed(2)}`
              )}
            </button>
            <p className="flex items-center justify-center gap-3 text-[9px] text-zinc-700 font-black uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Military Grade Encryption Active
            </p>
          </form>
        </div>

        <aside className="bg-zinc-950 border border-zinc-900 p-10 shadow-3xl sticky top-32">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-10">Archive Summary</h2>
          <div className="space-y-8 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            {itemsToProcess.map(item => (
              <div key={item.product.id} className="flex gap-6 items-center">
                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 p-3 shrink-0 relative">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" />
                  <span className="absolute -top-3 -right-3 bg-brand text-white text-[10px] font-black w-6 h-6 rounded-none flex items-center justify-center border border-black">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest truncate">{item.product.name}</h4>
                  <p className="text-[9px] text-zinc-600 font-black uppercase mt-1 italic">{item.product.category}</p>
                </div>
                <span className="text-[11px] font-black text-brand italic">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-zinc-900 pt-8">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500">
              <span>Subtotal</span>
              <span className="text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500">
              <span>Logistics</span>
              <span className="text-white">{shipping === 0 ? 'WAVIED' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-3xl font-black text-white pt-8 border-t border-zinc-900 italic tracking-tighter">
              <span>Total</span>
              <span className="text-brand text-shadow-red">${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
