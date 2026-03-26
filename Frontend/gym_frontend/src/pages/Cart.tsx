import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Minus, Plus, Trash2, Edit2, X, Loader2, MessageCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext.tsx';
import NexusLoader from '../components/NexusLoader.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const { items, showCart, removeFromCart, updateQuantity, totalPrice, addToCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [orderNote, setOrderNote] = useState('');

  // Edit Modal State
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  // Update selected variant when size/flavor changes in modal
  useEffect(() => {
    if (!editingItem || !selectedSize) return;
    const product = editingItem.product;
    const ofSize = product.variants.filter((v: any) => v.size === selectedSize);
    if (!ofSize.length) return;
    
    // Try to find matching flavor, if not found take the first one of that size
    const match = ofSize.find((v: any) => v.flavor === selectedFlavor) || ofSize[0];
    
    if (match.id !== selectedVariant?.id) {
        setSelectedVariant(match);
        if (match.flavor !== selectedFlavor) {
            setSelectedFlavor(match.flavor || '');
        }
    }
  }, [selectedSize, selectedFlavor, editingItem]);

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setSelectedSize(item.variant?.size || '');
    setSelectedFlavor(item.variant?.flavor || '');
    setSelectedVariant(item.variant || null);
  };

  const handleSaveEdit = async () => {
    if (!editingItem || !selectedVariant) return;
    
    // If nothing changed, just close
    if (selectedVariant.id === editingItem.variant?.id) {
      setEditingItem(null);
      return;
    }

    setIsUpdating(true);
    try {
      // Logic: remove old one and add new one with same quantity
      // backend /addtocart handles merging if new variant already exists in cart
      await removeFromCart(editingItem.id);
      await addToCart(editingItem.product, editingItem.quantity, selectedVariant.id);
      
      // Refresh cart to be sure everything is in sync
      await showCart();
      
      toast.success("Item updated successfully");
      setEditingItem(null);
    } catch (err) {
      toast.error("Failed to update item");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-white min-h-screen flex items-center justify-center">
        <NexusLoader />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center bg-white min-h-screen">
        <div className="w-24 h-24 bg-white border border-[#eee] rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-[#7B0F17]" />
        </div>
        <h1 className="text-4xl font-black text-[#111] mb-4 uppercase tracking-tighter" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Your cart is empty</h1>
        <p className="text-[#666] text-lg mb-10 max-w-md mx-auto font-medium">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-[#7B0F17] text-white px-10 py-4 font-black text-[12px] uppercase tracking-widest hover:bg-[#111] transition shadow-xl shadow-brand/10">
          Browse Products <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const uniqueSizes = editingItem ? Array.from(new Set(editingItem.product.variants.map((v: any) => v.size))) : [];
  const availableFlavors = editingItem ? Array.from(new Set(editingItem.product.variants.filter((v: any) => v.size === selectedSize).map((v: any) => v.flavor).filter(Boolean))) : [];

  return (
    <div className="min-h-screen bg-white text-[#111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ══ HEADER BANNER ══ */}
      <div className="w-full bg-[#CC1F20] py-16 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_transparent_70%)] pointer-events-none" />
        <h1 className="text-6xl md:text-8xl font-black italic text-white tracking-[0.1em] uppercase relative z-10" 
            style={{ 
              fontFamily: "'Bebas Neue', sans-serif",
              textShadow: '4px 4px 10px rgba(0,0,0,0.5)',
            }}>
          SHOPPING <span className="opacity-90">CART</span>
        </h1>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-12 pb-32">
        {/* ══ TABLE HEADERS ══ */}
        <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-[#eee] mb-10">
          <div className="col-span-6">
            <span className="text-[14px] uppercase font-black tracking-[0.15em] text-[#111]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PRODUCT</span>
          </div>
          <div className="col-span-2 text-center">
            <span className="text-[14px] uppercase font-black tracking-[0.15em] text-[#111]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PRICE</span>
          </div>
          <div className="col-span-2 text-center">
            <span className="text-[14px] uppercase font-black tracking-[0.15em] text-[#111]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>QUANTITY</span>
          </div>
          <div className="col-span-2 text-right">
            <span className="text-[14px] uppercase font-black tracking-[0.15em] text-[#111]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>TOTAL</span>
          </div>
        </div>

        {/* ══ CART ITEMS ══ */}
        <div className="space-y-12 mb-16">
          {items.map((item: any) => {
            const displayPrice = item.variant ? (item.variant.discountPrice || item.variant.price) : (item.product.discountPrice || item.product.price);
            const totalItemPrice = displayPrice * item.quantity;

            return (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-[#f0f0f0] pb-10 last:border-0 last:pb-0">
                {/* Product Info */}
                <div className="col-span-6 flex gap-8">
                  <div className="w-[140px] h-[140px] bg-white border border-[#eee] p-3 flex items-center justify-center flex-shrink-0 group">
                    <img 
                      src={item.product.images?.[0] || item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <Link to={`/product/${item.product.id}`} className="text-[22px] font-black uppercase tracking-tight hover:text-[#CC1F20] transition-colors leading-none mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <div className="space-y-1 mt-1">
                        <p className="text-[13px] text-[#444] font-medium"><span className="text-[#888] font-normal">Size: </span>{item.variant.size}</p>
                        {item.variant.flavor && (
                          <p className="text-[13px] text-[#444] font-medium"><span className="text-[#888] font-normal">Flavor: </span>{item.variant.flavor}</p>
                        )}
                      </div>
                    )}
                    <div className="flex gap-4 mt-5">
                      <button 
                        onClick={() => handleOpenEdit(item)} 
                        className="p-2 border border-[#eee] text-[#999] hover:text-[#111] hover:border-[#111] transition-all bg-[#fafafa] rounded-sm"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="p-2 border border-[#eee] text-[#999] hover:text-red-600 hover:border-red-600 transition-all bg-[#fafafa] rounded-sm"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-center md:block hidden">
                   <p className="text-lg font-bold text-[#111]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Rs.{displayPrice.toLocaleString()}.00</p>
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex justify-center">
                  <div className="flex items-center border border-[#111] h-10 w-[120px]">
                    <button 
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeFromCart(item.id);
                        } else {
                          updateQuantity(item.id, item.quantity - 1, item.product.id, item.variant?.id);
                        }
                      }}
                      className="w-10 h-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                    >
                      {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                    </button>
                    <span className="flex-1 text-center font-bold text-lg border-x border-[#111] h-full flex items-center justify-center" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.product.id, item.variant?.id)}
                      className="w-10 h-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-2 text-right">
                  <p className="text-[22px] font-black text-[#111]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Rs.{totalItemPrice.toLocaleString()}.00</p>
                  <p className="md:hidden text-xs text-[#999] uppercase font-bold mt-1">Total</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ══ BOTTOM SECTION ══ */}
        <div className="mt-12 pt-12 border-t border-[#eee] grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Notes */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#111] mb-5" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Add Order Note</h3>
            <textarea 
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="How can we help you?"
              className="w-full h-32 p-5 border border-[#eee] bg-white focus:outline-none focus:border-[#CC1F20] transition-colors resize-none text-[15px] text-[#111] font-medium"
            />
          </div>

          {/* Subtotal */}
          <div className="text-right flex flex-col items-end">
            <div className="flex items-baseline gap-8 mb-4">
              <span className="text-[20px] font-black uppercase tracking-[0.1em] text-[#111]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SUBTOTAL:</span>
              <span className="text-4xl font-black text-[#111]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Rs.{totalPrice.toLocaleString()}.00 PKR</span>
            </div>
            
            <p className="text-[12px] text-[#888] max-w-[420px] leading-relaxed mb-10 font-medium">
                All charges are billed in PKR. While the content of your cart is currently displayed in PKR, the checkout will use PKR at the most current exchange rate.
            </p>
            
            <button
              onClick={() => navigate('/checkout')}
              className="group relative w-full md:w-[360px] bg-[#CC1F20] hover:bg-[#111] text-white py-4 px-10 flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 shadow-xl shadow-red-900/10"
            >
              <span className="text-[22px] font-black uppercase tracking-[0.1em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>CHECK OUT</span>
              <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />
            </button>

            <Link to="/products" className="mt-6 text-[13px] font-black uppercase tracking-widest text-[#999] hover:text-[#CC1F20] transition-colors border-b-2 border-transparent hover:border-[#CC1F20] pb-1">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* ══ HELP & WHATSAPP FLOATING ══ */}
      <div className="fixed bottom-10 right-10 z-[50] flex flex-col items-end gap-3 px-4 md:px-0">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 border border-[#eee] shadow-lg rounded-full flex items-center gap-2 mb-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#111]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Need Help? Chat with us</span>
          </div>
          <button 
            onClick={() => window.open('https://wa.me/yournumber', '_blank')}
            className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
          >
              <MessageCircle size={32} fill="white" className="group-hover:rotate-12 transition-transform" />
          </button>
      </div>

      {/* ══ EDIT MODAL ══ */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-xl bg-white shadow-2xl overflow-hidden border-t-8 border-[#CC1F20]"
            >
              <button onClick={() => setEditingItem(null)} className="absolute top-6 right-6 text-[#999] hover:text-[#111] hover:rotate-90 transition-all z-10">
                <X size={24} />
              </button>

              <div className="p-10">
                <div className="flex gap-8 items-start mb-10">
                  <div className="w-28 h-28 bg-[#fafafa] p-3 flex items-center justify-center border border-[#eee] flex-shrink-0">
                    <img src={editingItem.product.images?.[0] || editingItem.product.image} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-[28px] font-black uppercase tracking-tight text-[#111] leading-none mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{editingItem.product.name}</h4>
                    <p className="text-[#CC1F20] uppercase text-sm font-black tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{editingItem.product.brand}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Size Selector */}
                  {uniqueSizes.length > 0 && (
                    <div>
                      <label className="block text-[12px] font-black uppercase tracking-widest text-[#999] mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SELECT SERVING / SIZE</label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSizes.map((sz: any) => (
                          <button 
                            key={sz} 
                            onClick={() => setSelectedSize(sz)}
                            className={`px-6 py-2.5 border-2 font-black uppercase text-sm transition-all
                              ${selectedSize === sz ? 'border-[#111] bg-[#111] text-white' : 'border-[#eee] text-[#999] hover:border-[#111]'}
                            `}
                            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Flavor Selector */}
                  {availableFlavors.length > 0 && (
                    <div>
                      <label className="block text-[12px] font-black uppercase tracking-widest text-[#999] mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>SELECT FLAVOR</label>
                      <div className="flex flex-wrap gap-2">
                        {availableFlavors.map((fl: any) => (
                          <button 
                            key={fl} 
                            onClick={() => setSelectedFlavor(fl)}
                            className={`px-6 py-2.5 border-2 font-black uppercase text-sm transition-all
                              ${selectedFlavor === fl ? 'border-[#CC1F20] bg-[#CC1F20] text-white' : 'border-[#eee] text-[#999] hover:border-[#CC1F20]'}
                            `}
                            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                          >
                            {fl}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Final Update Block */}
                <div className="mt-12 pt-8 border-t border-[#eee] flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-black text-[#999] uppercase tracking-widest mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Price per unit</p>
                    <p className="text-3xl font-black text-[#111]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      Rs.{selectedVariant ? (selectedVariant.discountPrice || selectedVariant.price).toLocaleString() : '---'}
                    </p>
                  </div>
                  <button 
                    onClick={handleSaveEdit}
                    disabled={isUpdating || !selectedVariant}
                    className="bg-[#CC1F20] text-white px-10 py-4 font-black uppercase tracking-[0.1em] text-[18px] hover:bg-[#111] transition-all disabled:opacity-50 flex items-center gap-2 transform active:scale-95"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {isUpdating ? <Loader2 size={24} className="animate-spin" /> : 'CONFIRM CHANGE'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .header-shine::after {
          content: "";
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shine 4s infinite;
        }
      `}</style>
    </div>
  );
};

export default Cart;