import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Loader2, Lock } from 'lucide-react';

interface StripePaymentFormProps {
  orderId: string;
  total: number;
  onSuccess: (orderId: string) => void;
  onError: (message: string) => void;
  onClose: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  orderId,
  total,
  onSuccess,
  onError,
  onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError(null);

    const baseUrl = window.location.href.split('#')[0];
    const returnUrl = `${baseUrl}#/order-success?orderId=${orderId}`;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    });

    if (error) {
      const msg = error.message || 'Payment failed. Please try again.';
      setPaymentError(msg);
      onError(msg);
      setIsProcessing(false);
    } else if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
      onSuccess(orderId);
    } else {
      const msg = 'Unexpected payment state. Please contact support.';
      setPaymentError(msg);
      onError(msg);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {paymentError && (
        <div className="bg-red-950/30 border border-red-500/50 p-4 text-red-400 text-xs font-bold uppercase tracking-widest">
          {paymentError}
        </div>
      )}

      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1 border border-brand-matte/20 text-brand-matte py-4 text-[11px] font-black uppercase tracking-[0.3em] hover:border-brand-matte/40 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="flex-1 bg-brand text-white py-4 text-[11px] font-black uppercase tracking-[0.3em] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              Pay Rs. {total.toFixed(2)}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StripePaymentForm;
