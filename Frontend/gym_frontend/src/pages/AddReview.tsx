import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL

const AddReview: React.FC = () => {
    const { id } = useParams(); // productId
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("You must be logged in to leave a review");
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                `${API_URL}/givereview`,
                { productId: id, rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Review submitted successfully");
            navigate(`/product/${id}`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-warm pt-40 pb-40 px-6">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-brand-matte/40 hover:text-brand transition-all mb-12"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Product
                </button>

                <div className="bg-white p-12 shadow-2xl border border-brand-matte/5">
                    <h1 className="text-4xl font-black text-brand-matte uppercase tracking-tighter mb-4">Write a <span className="text-brand">Review</span></h1>
                    <p className="text-brand-matte/40 text-[10px] font-black uppercase tracking-widest mb-12">Your feedback helps us maintain standard quality.</p>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="space-y-6">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-matte/40 flex items-center gap-4">
                                01. Select Rating <div className="h-px flex-grow bg-brand-matte/5"></div>
                            </label>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="transition-all hover:scale-110 active:scale-90"
                                    >
                                        <Star
                                            className={`w-10 h-10 ${star <= rating ? 'fill-brand-gold text-brand-gold drop-shadow-sm' : 'text-brand-matte/10'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-matte/40 flex items-center gap-4">
                                02. Your Experience <div className="h-px flex-grow bg-brand-matte/5"></div>
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={6}
                                className="w-full bg-brand-warm/50 border border-brand-matte/10 p-8 text-brand-matte focus:outline-none focus:border-brand-gold/50 transition-all font-medium text-sm text-brand-matte/80 resize-none shadow-inner"
                                placeholder="Describe your experience with this product..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand text-white py-6 text-[12px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-3 shadow-2xl shadow-brand/20 hover:bg-brand-matte transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Review'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddReview;
