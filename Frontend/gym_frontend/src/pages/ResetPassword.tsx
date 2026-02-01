
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, ArrowRight, ShoppingCart, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword: React.FC = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            await axios.put(`${API_URL}/resetpassword/${token}`, { password });
            toast.success('Password updated! Please login.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center font-sans overflow-x-hidden relative p-6">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />

            <div className="w-full max-w-[480px] relative z-10">
                <Link to="/login" className="absolute -top-12 left-0 flex items-center gap-2 text-brand-matte/40 hover:text-brand transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Login</span>
                </Link>

                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-brand-warm border border-black/5 flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <ShoppingCart className="w-8 h-8 text-brand" />
                    </div>
                    <h1 className="text-4xl font-black text-brand-matte uppercase tracking-tighter mb-3 italic">
                        New Password
                    </h1>
                    <p className="text-brand-matte/30 text-xs font-bold uppercase tracking-[0.2em]">
                        Secure your account with a new password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.2em] pl-1">New Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-matte/10 group-focus-within:text-brand transition-colors" />
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-brand-warm/50 border border-black/5 px-14 py-5 text-brand-matte text-sm font-bold uppercase tracking-widest outline-none focus:border-brand-gold/30 hover:bg-brand-warm transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.2em] pl-1">Confirm Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-matte/10 group-focus-within:text-brand transition-colors" />
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-brand-warm/50 border border-black/5 px-14 py-5 text-brand-matte text-sm font-bold uppercase tracking-widest outline-none focus:border-brand-gold/30 hover:bg-brand-warm transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand hover:bg-brand-matte disabled:opacity-50 text-white py-6 font-black text-xs uppercase tracking-[0.3em] transition-all active:scale-[0.98] flex items-center justify-center gap-4 group shadow-xl hover:shadow-brand/20"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Update Password
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
