
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, CheckCircle, ArrowLeft, Lock, Loader2, Banknote, QrCode, UploadCloud, ChevronRight, PlusCircle, MapPin } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Product } from '@/types';
import { toast } from 'sonner';

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
    variant?: any;
    variantId?: string;
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
  const [activeStep, setActiveStep] = useState<'shipping' | 'payment'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const isSingleItem = !!state?.singleItem;
  const itemsToProcess = isSingleItem ? [state.singleItem!] : cartItems;

  const subtotal = isSingleItem
    ? (state.singleItem?.variant
      ? (state.singleItem.variant.discountPrice || state.singleItem.variant.price)
      : (state.singleItem!.product.discountPrice || state.singleItem!.product.price)) * state.singleItem!.quantity
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
    const fetchAddresses = async () => {
      try {
        const res = await api.get('/addresses');
        setAddresses(res.data.addresses);
        if (res.data.addresses.length > 0) {
          setSelectedAddressId(res.data.addresses[0].id);
          setShowNewAddressForm(false);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      }
    };

    if (token) {
      fetchAddresses();
    }
  }, [token]);

  useEffect(() => {
    if (selectedAddressId) {
      const addr = addresses.find(a => a.id === selectedAddressId);
      if (addr) {
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
    }
  }, [selectedAddressId, addresses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    if (itemsToProcess.length === 0) {
      toast.error("Your cart is empty. Add items to checkout.");
      return;
    }

    setIsLoading(true);

    try {
      let addressId = selectedAddressId;

      // 1. Create or Update Address if new form is shown
      if (showNewAddressForm || !addressId) {
        const addrRes = await api.post('/address', {
          ...formData,
          userId: user.id
        });
        addressId = addrRes.data.address.id;
      }

      // 2. Create Order using FormData for file upload
      const orderItems = itemsToProcess.map((item: any) => ({
        productId: item.product.id,
        variantId: item.variant?.id || item.variantId || null,
        quantity: item.quantity,
        price: item.variant
          ? (item.variant.discountPrice || item.variant.price)
          : (item.product.discountPrice || item.product.price)
      }));

      const formDataPayload = new FormData();
      formDataPayload.append('userId', user.id);
      formDataPayload.append('addressId', addressId);
      formDataPayload.append('paymentMethod', paymentMethod);
      formDataPayload.append('items', JSON.stringify(orderItems));
      if (receiptFile) {
        formDataPayload.append('receipt', receiptFile);
      }

      await api.post('/orders', formDataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
    } finally {
      setIsLoading(false);
    }
  };


  if (isOrdered) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-40 text-center animate-in fade-in zoom-in duration-700 bg-brand-warm min-h-screen">
        <div className="w-24 h-24 bg-brand rounded-full flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-brand/10">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-black text-brand-matte uppercase tracking-tighter mb-6">Order <span className="italic text-brand">Confirmed</span></h1>
        <p className="text-brand-matte/60 text-lg mb-12 max-w-md mx-auto font-light leading-relaxed">Your order is being prepared. You can track your order status in your profile.</p>
        <div className="bg-white p-8 border border-brand-matte/5 text-left space-y-4 shadow-sm">
          <h3 className="text-xs font-black text-brand uppercase tracking-widest">Order Processing</h3>
          <p className="text-sm text-brand-matte/60 font-medium">Shipping address confirmed. ETA 2-4 business days. Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-brand-warm min-h-screen pt-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-brand-matte uppercase tracking-tighter">
                Check <span className="italic text-brand">{activeStep === 'shipping' ? 'Shipping' : 'Payment'}</span>
              </h1>
              <div className="flex items-center gap-4">
                <div className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${activeStep === 'shipping' ? 'bg-brand text-white border-brand' : 'bg-transparent text-brand-matte/20 border-brand-matte/10'}`}>01 Shipping</div>
                <ChevronRight className="w-3 h-3 text-brand-matte/10" />
                <div className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${activeStep === 'payment' ? 'bg-brand text-white border-brand' : 'bg-transparent text-brand-matte/20 border-brand-matte/10'}`}>02 Payment</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-950/30 border border-red-500/50 p-4 text-red-500 text-xs font-bold uppercase tracking-widest">
              Error: {error}
            </div>
          )}

          {activeStep === 'shipping' ? (
            <form onSubmit={(e) => { e.preventDefault(); setActiveStep('payment'); }} className="space-y-12 animate-in slide-in-from-left duration-500">
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-brand">
                    <Truck className="w-5 h-5" /> Shipping Address
                  </div>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                      className="text-[9px] font-black text-brand-gold uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors"
                    >
                      {showNewAddressForm ? 'Select Saved' : '+ New Address'}
                    </button>
                  )}
                </div>

                {!showNewAddressForm && addresses.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-6 border cursor-pointer transition-all duration-300 relative group ${selectedAddressId === addr.id ? 'bg-white border-brand shadow-lg' : 'bg-white border-brand-matte/5 hover:border-brand-matte/20'}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 flex items-center justify-center border transition-all ${selectedAddressId === addr.id ? 'bg-brand border-brand text-white' : 'bg-brand-warm border-brand-matte/5 text-brand-matte/40'}`}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[11px] font-black text-brand-matte uppercase tracking-widest">{addr.fullName}</p>
                            <p className="text-[10px] text-brand-matte/40 font-bold uppercase tracking-widest truncate max-w-[250px]">{addr.street}, {addr.city}</p>
                            <p className="text-[9px] text-brand-matte/60 font-black uppercase">{addr.phone}</p>
                          </div>
                        </div>
                        {selectedAddressId === addr.id && <CheckCircle className="absolute top-6 right-6 w-4 h-4 text-brand" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top duration-500">
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">Full Name</label>
                      <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full bg-white border border-brand-matte/10 p-5 outline-none focus:border-brand/40 text-brand-matte transition-all uppercase text-xs tracking-widest font-black shadow-sm" />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">Phone Number</label>
                      <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-white border border-brand-matte/10 p-5 outline-none focus:border-brand/40 text-brand-matte transition-all uppercase text-xs tracking-widest font-black shadow-sm" />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">Street Address</label>
                      <input required name="street" value={formData.street} onChange={handleInputChange} type="text" className="w-full bg-white border border-brand-matte/10 p-5 outline-none focus:border-brand/40 text-brand-matte transition-all uppercase text-xs tracking-widest font-black shadow-sm" />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">City</label>
                      <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full bg-white border border-brand-matte/10 p-5 outline-none focus:border-brand/40 text-brand-matte transition-all uppercase text-xs tracking-widest font-black shadow-sm" />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">Province (State)</label>
                      <select
                        required
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-brand-matte/10 p-5 outline-none focus:border-brand/40 text-brand-matte transition-all uppercase text-xs tracking-widest font-black shadow-sm appearance-none cursor-pointer"
                      >
                        {PAKISTAN_PROVINCES.map(province => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">Zip Code</label>
                      <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} type="text" className="w-full bg-white border border-brand-matte/10 p-5 outline-none focus:border-brand/40 text-brand-matte transition-all uppercase text-xs tracking-widest font-black shadow-sm" />
                    </div>
                  </div>
                )}
              </section>

              <button
                type="submit"
                className="w-full bg-brand text-white py-6 text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-brand/20 flex items-center justify-center gap-3"
              >
                Continue to Payment <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-brand">
                    <CreditCard className="w-5 h-5" /> Payment Method
                  </div>
                  <button onClick={() => setActiveStep('shipping')} className="text-[9px] font-black text-brand-matte/40 uppercase hover:text-brand transition-colors">Edit Shipping</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* COD Option */}
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`relative p-8 border cursor-pointer transition-all duration-500 overflow-hidden group shadow-sm ${paymentMethod === 'COD' ? 'bg-white border-brand shadow-lg' : 'bg-white border-brand-matte/5 hover:border-brand-matte/20'}`}
                  >
                    <div className="relative z-10 space-y-4">
                      <div className={`w-12 h-12 flex items-center justify-center border transition-all duration-500 ${paymentMethod === 'COD' ? 'bg-brand border-brand text-white' : 'bg-brand-warm border-brand-matte/5 text-brand-matte/40 group-hover:text-brand-matte/60'}`}>
                        <Banknote className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-brand-matte uppercase tracking-[0.2em]">Cash on Delivery</p>
                        <p className="text-[9px] text-brand-matte/40 font-black uppercase mt-1 italic">Payment at doorstep</p>
                      </div>
                    </div>
                    {paymentMethod === 'COD' && <CheckCircle className="absolute top-6 right-6 w-5 h-5 text-brand" />}
                  </div>

                  {/* Online Option */}
                  <div
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`relative p-8 border cursor-pointer transition-all duration-500 overflow-hidden group shadow-sm ${paymentMethod === 'ONLINE' ? 'bg-white border-brand shadow-lg' : 'bg-white border-brand-matte/5 hover:border-brand-matte/20'}`}
                  >
                    <div className="relative z-10 space-y-4">
                      <div className={`w-12 h-12 flex items-center justify-center border transition-all duration-500 ${paymentMethod === 'ONLINE' ? 'bg-brand border-brand text-white' : 'bg-brand-warm border-brand-matte/5 text-brand-matte/40 group-hover:text-brand-matte/60'}`}>
                        <QrCode className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-brand-matte uppercase tracking-[0.2em]">Online Payment</p>
                        <p className="text-[9px] text-brand-matte/40 font-black uppercase mt-1 italic">Bank Transfer / EasyPaisa</p>
                      </div>
                    </div>
                    {paymentMethod === 'ONLINE' && <CheckCircle className="absolute top-6 right-6 w-5 h-5 text-brand" />}
                  </div>
                </div>

                {paymentMethod === 'ONLINE' && (
                  <div className="bg-white border border-brand/20 p-8 space-y-6 animate-in fade-in slide-in-from-top duration-500 shadow-sm">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-brand uppercase tracking-widest">Payment Account</h4>
                      <div className="bg-brand-warm p-4 border border-brand-matte/5">
                        <p className="text-xs text-brand-matte font-black tracking-widest">IBAN: PK64 NEXUS 0000 9238 4721 00</p>
                        <p className="text-[10px] text-brand-matte/40 mt-1 uppercase font-black tracking-widest italic">Bank: Nexus Elite Finance</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">Payment Receipt</p>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-brand-matte/10 hover:border-brand/40 transition-colors cursor-pointer group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 text-brand-matte/20 group-hover:text-brand transition-colors mb-2" />
                          <p className="text-[10px] font-black text-brand-matte/20 group-hover:text-brand transition-colors uppercase tracking-widest">{receiptImage ? 'Receipt Uploaded' : 'Upload Transfer Receipt'}</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setReceiptFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => setReceiptImage(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                      {receiptImage && (
                        <div className="relative w-24 h-24 border border-brand/40 shadow-lg">
                          <img src={receiptImage} alt="receipt" className="w-full h-full object-cover" />
                          <button onClick={() => { setReceiptImage(null); setReceiptFile(null); }} className="absolute -top-2 -right-2 bg-brand text-white rounded-full p-0.5 shadow-md"><X className="w-3 h-3" /></button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading || (paymentMethod === 'ONLINE' && !receiptImage)}
                className="w-full bg-brand text-white py-6 text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-brand/20 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  `Confirm Order: Rs. ${total.toFixed(2)}`
                )}
              </button>

              <p className="flex items-center justify-center gap-3 text-[9px] text-brand-matte/40 font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Secure SSL Encryption
              </p>
            </div>
          )}
        </div>

        <aside className="bg-white border border-brand-matte/5 p-10 shadow-2xl sticky top-32">
          <h2 className="text-2xl font-black text-brand-matte uppercase tracking-tighter mb-10">Order Summary</h2>
          <div className="space-y-8 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            {itemsToProcess.map(item => (
              <div key={item.product.id} className="flex gap-6 items-center">
                <div className="w-20 h-20 bg-brand-warm border border-brand-matte/5 p-3 shrink-0 relative">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" />
                  <span className="absolute -top-3 -right-3 bg-brand text-white text-[10px] font-black w-6 h-6 rounded-none flex items-center justify-center border border-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-[11px] font-black text-brand-matte uppercase tracking-widest truncate">{item.product.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[9px] text-brand-matte/40 font-black uppercase italic">{item.product.category}</p>
                    {item.variant && (
                      <>
                        <span className="w-1 h-1 bg-brand rounded-full"></span>
                        <p className="text-[9px] text-brand-gold font-black uppercase tracking-widest">
                          {item.variant.size} {item.variant.flavor && ` / ${item.variant.flavor}`}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-black text-brand italic">
                  Rs. {((item.variant
                    ? (item.variant.discountPrice || item.variant.price)
                    : (item.product.discountPrice || item.product.price)) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-brand-matte/5 pt-8">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-brand-matte/40">
              <span>Subtotal</span>
              <span className="text-brand-matte">Rs. {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-brand-matte/40">
              <span>Shipping</span>
              <span className="text-brand-matte">{shipping === 0 ? 'FREE' : `Rs. ${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-3xl font-black text-brand-matte pt-8 border-t border-brand-matte/5 italic tracking-tighter">
              <span>Total</span>
              <span className="text-brand">Rs. {total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
