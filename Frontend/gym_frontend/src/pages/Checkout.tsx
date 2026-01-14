
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import { useStore } from '../StoreContext';

const Checkout: React.FC = () => {
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    setTimeout(() => {
      clearCart();
      navigate('/');
    }, 3000);
  };

  if (isOrdered) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-40 text-center animate-in fade-in zoom-in duration-700 bg-black min-h-screen">
        <div className="w-24 h-24 bg-brand rounded-full flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-brand/40">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-serif text-white italic mb-6">Sequence Confirmed.</h1>
        <p className="text-zinc-500 text-lg mb-12 max-w-md mx-auto font-light">Your protocol is being prepared for immediate dispatch. A verification email has been sent to your terminal.</p>
        <div className="bg-zinc-900 p-8 border border-zinc-800 text-left space-y-4">
          <h3 className="text-xs font-black text-brand uppercase tracking-widest">Protocol ID: #PV-8829-1022</h3>
          <p className="text-sm text-zinc-400">Deployment coordinates confirmed. ETA 2-4 business days.</p>
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

          <form onSubmit={handlePlaceOrder} className="space-y-12">
            <section className="space-y-8">
              <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-brand">
                <Truck className="w-5 h-5" /> Logistic Coordinates
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">First Name</label>
                  <input required type="text" className="w-full bg-zinc-900 border border-zinc-800 p-5 outline-none focus:border-brand/40 text-white transition-all uppercase text-xs tracking-widest font-bold" />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Last Name</label>
                  <input required type="text" className="w-full bg-zinc-900 border border-zinc-800 p-5 outline-none focus:border-brand/40 text-white transition-all uppercase text-xs tracking-widest font-bold" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Archive Address</label>
                  <input required type="text" className="w-full bg-zinc-900 border border-zinc-800 p-5 outline-none focus:border-brand/40 text-white transition-all uppercase text-xs tracking-widest font-bold" />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Sector (City)</label>
                  <input required type="text" className="w-full bg-zinc-900 border border-zinc-800 p-5 outline-none focus:border-brand/40 text-white transition-all uppercase text-xs tracking-widest font-bold" />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Post Zone</label>
                  <input required type="text" className="w-full bg-zinc-900 border border-zinc-800 p-5 outline-none focus:border-brand/40 text-white transition-all uppercase text-xs tracking-widest font-bold" />
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

            <button type="submit" className="w-full bg-brand text-white py-6 text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-brand/20">
              Confirm Purchase: ${total.toFixed(2)}
            </button>
            <p className="flex items-center justify-center gap-3 text-[9px] text-zinc-700 font-black uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Military Grade Encryption Active
            </p>
          </form>
        </div>

        <aside className="bg-zinc-950 border border-zinc-900 p-10 shadow-3xl sticky top-32">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-10">Archive Summary</h2>
          <div className="space-y-8 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            {cart.map(item => (
              <div key={`${item.id}-${item.selectedFlavor}`} className="flex gap-6 items-center">
                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 p-3 shrink-0 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  <span className="absolute -top-3 -right-3 bg-brand text-white text-[10px] font-black w-6 h-6 rounded-none flex items-center justify-center border border-black">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest truncate">{item.name}</h4>
                  <p className="text-[9px] text-zinc-600 font-black uppercase mt-1 italic">{item.selectedFlavor}</p>
                </div>
                <span className="text-[11px] font-black text-brand italic">${(item.price * item.quantity).toFixed(2)}</span>
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
