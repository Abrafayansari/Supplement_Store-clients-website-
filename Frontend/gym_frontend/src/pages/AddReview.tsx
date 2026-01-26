import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ArrowLeft } from 'lucide-react';
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
        <div className="min-h-screen bg-brand-warm pt-32 pb-40 px-6">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-brand-matte/40 hover:text-brand transition-luxury mb-12"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Product
                </button>

                <div className="bg-white p-12 shadow-2xl border border-brand-matte/5">
                    <h1 className="text-3xl font-black text-brand-matte uppercase tracking-tighter mb-8">Deploy Report</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-matte">Efficiency Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-matte/10'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-matte">Operational Log</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={5}
                                className="w-full bg-brand-warm border border-brand-matte/10 p-6 text-brand-matte focus:outline-none focus:border-brand-gold transition-colors font-medium text-sm text-brand-matte/80 resize-none"
                                placeholder="Share your experience with this protocol..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-luxury py-4 text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                        >
                            {loading ? 'Transmitting...' : 'Submit Report'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddReview;
