import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, AlertCircle } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId') || (location.state as any)?.orderId;
  const redirectStatus = params.get('redirect_status');

  const isFailed = redirectStatus && redirectStatus !== 'succeeded' && redirectStatus !== 'processing';

  if (isFailed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-40 text-center bg-brand-warm min-h-screen">
        <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-12">
          <AlertCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-black text-brand-matte uppercase tracking-tighter mb-6">
          Payment <span className="italic text-red-600">Failed</span>
        </h1>
        <p className="text-brand-matte/60 text-lg mb-12 font-light leading-relaxed">
          Your payment could not be processed. Please try again.
        </p>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-brand text-white px-10 py-4 text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-brand/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-40 text-center animate-in fade-in zoom-in duration-700 bg-brand-warm min-h-screen">
      <div className="w-24 h-24 bg-brand rounded-full flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-brand/10">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-5xl font-black text-brand-matte uppercase tracking-tighter mb-6">
        Payment <span className="italic text-brand">Successful</span>
      </h1>
      <p className="text-brand-matte/60 text-lg mb-12 max-w-md mx-auto font-light leading-relaxed">
        Your payment was processed successfully. Your order is being prepared.
      </p>

      {orderId && (
        <div className="bg-white p-8 border border-brand-matte/5 text-left space-y-4 shadow-sm mb-8">
          <h3 className="text-xs font-black text-brand uppercase tracking-widest">Order Reference</h3>
          <p className="text-sm text-brand-matte/60 font-medium font-mono">
            ORD-{orderId.slice(0, 8).toUpperCase()}
          </p>
        </div>
      )}

      <div className="bg-white p-8 border border-brand-matte/5 text-left space-y-4 shadow-sm mb-12">
        <h3 className="text-xs font-black text-brand uppercase tracking-widest">What's Next</h3>
        <p className="text-sm text-brand-matte/60 font-medium">
          Your order is confirmed and being prepared. Expected delivery in 2–4 business days.
        </p>
      </div>

      <button
        onClick={() => navigate('/profile')}
        className="bg-brand text-white px-10 py-4 text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-brand/20 inline-flex items-center gap-3"
      >
        <Package className="w-4 h-4" />
        View My Orders
      </button>
    </div>
  );
};

export default OrderSuccess;
