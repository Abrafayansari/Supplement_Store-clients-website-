
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, CheckCircle, Lock, Loader2, Banknote, ChevronRight, MapPin, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import api from '../lib/api';
import { Product } from '@/types';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/StripePaymentForm';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

const stripeAppearance = {
  theme: 'flat' as const,
  variables: {
    colorPrimary: '#7B0F17',
    colorBackground: '#ffffff',
    colorText: '#0E0E0E',
    colorDanger: '#df1b41',
    fontFamily: '"DM Sans", system-ui, sans-serif',
    borderRadius: '0px',
  },
  rules: {
    '.Input': {
      border: '1px solid rgba(14,14,14,0.1)',
      padding: '14px 16px',
      fontSize: '12px',
      letterSpacing: '0.05em',
    },
    '.Input:focus': {
      borderColor: '#7B0F17',
      boxShadow: 'none',
    },
    '.Label': {
      fontSize: '10px',
      fontWeight: '900',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.1em',
    },
  },
};

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
  const { getDeliveryCharge } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [isOrdered, setIsOrdered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<'shipping' | 'payment'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // Stripe state
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [showStripeModal, setShowStripeModal] = useState(false);

  const isSingleItem = !!state?.singleItem;
  const itemsToProcess = isSingleItem ? [state.singleItem!] : cartItems;

  const subtotal = isSingleItem
    ? (state.singleItem?.variant
      ? (state.singleItem.variant.discountPrice || state.singleItem.variant.price)
      : (state.singleItem!.product.discountPrice || state.singleItem!.product.price)) * state.singleItem!.quantity
    : cartTotalPrice;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: PAKISTAN_PROVINCES[0],
    zipCode: '',
    country: 'Pakistan'
  });

  const shipping = subtotal === 0 ? 0 : getDeliveryCharge(formData.state);
  const total = subtotal + shipping;

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

  const buildOrderItems = () =>
    itemsToProcess.map((item: any) => ({
      productId: item.product.id,
      variantId: item.variant?.id || item.variantId || null,
      quantity: item.quantity,
      price: item.variant
        ? (item.variant.discountPrice || item.variant.price)
        : (item.product.discountPrice || item.product.price)
    }));

  const handlePlaceOrder = async (e: React.FormEvent | React.MouseEvent) => {
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
    setError(null);

    try {
      let addressId = selectedAddressId;

      if (showNewAddressForm || !addressId) {
        const addrRes = await api.post('/address', { ...formData, userId: user.id });
        addressId = addrRes.data.address.id;
      }

      const formDataPayload = new FormData();
      formDataPayload.append('userId', user.id);
      formDataPayload.append('addressId', addressId!);
      formDataPayload.append('paymentMethod', paymentMethod);
      formDataPayload.append('items', JSON.stringify(buildOrderItems()));

      if (paymentMethod === 'COD') {
        await api.post('/orders', formDataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setIsOrdered(true);
        if (!isSingleItem) await clearCart();
        setTimeout(() => navigate('/profile'), 5000);
      } else {
        // ONLINE: create order, then create payment intent, then show Stripe form
        const orderRes = await api.post('/orders', formDataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const orderId = orderRes.data.order?.id || orderRes.data.orderId;

        const piRes = await api.post('/create-payment-intent', { orderId });
        const clientSecret = piRes.data.clientSecret;

        setPendingOrderId(orderId);
        setStripeClientSecret(clientSecret);
        setShowStripeModal(true);
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripeSuccess = async (orderId: string) => {
    setShowStripeModal(false);
    if (!isSingleItem) await clearCart();
    navigate('/order-success', { state: { orderId } });
  };

  const handleStripeModalClose = () => {
    setShowStripeModal(false);
    toast.error("Payment cancelled. Your cart has been preserved.");
    setPendingOrderId(null);
    setStripeClientSecret(null);
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
    <>
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
                        className="text-[9px] font-black text-brand-matte/40 uppercase hover:text-brand transition-colors"
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
                          className={`p-6 border cursor-pointer transition-all duration-300 relative group ${selectedAddressId === addr.id ? 'bg-brand-warm border-brand shadow-lg' : 'bg-brand-warm border-brand-matte/5 hover:border-brand-matte/20'}`}
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
                        <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full bg-white border border-brand-matte/10 p-5 outline-none focus:border-brand/40 text-brand-matte transition-all text-xs tracking-widest font-black shadow-sm" />
                      </div>
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">Phone Number</label>
                        <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-white border border-brand-matte/10 p-5 outline-none focus:border-brand/40 text-brand-matte transition-all text-xs tracking-widest font-black shadow-sm" />
                      </div>
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">Street Address</label>
                        <input required name="street" value={formData.street} onChange={handleInputChange} type="text" className="w-full bg-white border border-brand-matte/10 p-5 outline-none focus:border-brand/40 text-brand-matte transition-all text-xs tracking-widest font-black shadow-sm" />
                      </div>
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">City</label>
                        <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full bg-white border border-brand-matte/10 p-5 outline-none focus:border-brand/40 text-brand-matte transition-all text-xs tracking-widest font-black shadow-sm" />
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
                        <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} type="text" className="w-full bg-white border border-brand-matte/10 p-5 outline-none focus:border-brand/40 text-brand-matte transition-all text-xs tracking-widest font-black shadow-sm" />
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

                    {/* Online / Stripe Option */}
                    <div
                      onClick={() => setPaymentMethod('ONLINE')}
                      className={`relative p-8 border cursor-pointer transition-all duration-500 overflow-hidden group shadow-sm ${paymentMethod === 'ONLINE' ? 'bg-white border-brand shadow-lg' : 'bg-white border-brand-matte/5 hover:border-brand-matte/20'}`}
                    >
                      <div className="relative z-10 space-y-4">
                        <div className={`w-12 h-12 flex items-center justify-center border transition-all duration-500 ${paymentMethod === 'ONLINE' ? 'bg-brand border-brand text-white' : 'bg-brand-warm border-brand-matte/5 text-brand-matte/40 group-hover:text-brand-matte/60'}`}>
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-brand-matte uppercase tracking-[0.2em]">Card Payment</p>
                          <p className="text-[9px] text-brand-matte/40 font-black uppercase mt-1 italic">Powered by Stripe</p>
                        </div>
                      </div>
                      {paymentMethod === 'ONLINE' && <CheckCircle className="absolute top-6 right-6 w-5 h-5 text-brand" />}
                    </div>
                  </div>

                  {paymentMethod === 'ONLINE' && (
                    <div className="bg-white border border-brand/20 p-8 space-y-4 animate-in fade-in slide-in-from-top duration-500 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand flex items-center justify-center shrink-0">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-brand-matte uppercase tracking-widest">Stripe Secure Payment</p>
                          <p className="text-[9px] text-brand-matte/40 font-black uppercase mt-1">256-bit SSL encrypted</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-brand-matte/60 font-medium leading-relaxed">
                        Click "Confirm Order" to proceed to the secure card payment form. We accept Visa, Mastercard, and all major debit/credit cards.
                      </p>
                    </div>
                  )}
                </section>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="w-full bg-brand text-white py-6 text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-brand/20 flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
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
            <div className="space-y-8 p-2 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
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

      {/* Stripe Payment Modal */}
      {showStripeModal && stripeClientSecret && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-brand-warm w-full max-w-lg border border-brand-matte/10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-brand-matte/5">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-brand" />
                <h3 className="text-sm font-black text-brand-matte uppercase tracking-[0.3em]">Secure Payment</h3>
              </div>
              <button
                onClick={handleStripeModalClose}
                className="text-brand-matte/40 hover:text-brand-matte transition-colors"
                aria-label="Close payment modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-center text-xs font-black text-brand-matte/40 uppercase tracking-widest">
                Total: Rs. {total.toFixed(2)}
              </p>
              <Elements
                stripe={stripePromise}
                options={{ clientSecret: stripeClientSecret, appearance: stripeAppearance }}
              >
                <StripePaymentForm
                  orderId={pendingOrderId!}
                  total={total}
                  onSuccess={handleStripeSuccess}
                  onError={(msg) => toast.error(msg)}
                  onClose={handleStripeModalClose}
                />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
