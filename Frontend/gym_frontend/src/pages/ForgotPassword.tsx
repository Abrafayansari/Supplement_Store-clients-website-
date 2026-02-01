
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShoppingCart, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const storedToken = localStorage.getItem('token');

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_URL}/forgotpassword`, { email },
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                }
            );
            setSent(true);
            toast.success('Reset link sent to your email!');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to send reset link');
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
                        Reset Password
                    </h1>
                    <p className="text-brand-matte/30 text-xs font-bold uppercase tracking-[0.2em]">
                        Enter your email to receive recovery instructions
                    </p>
                </div>

                {!sent ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.2em] pl-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-matte/10 group-focus-within:text-brand transition-colors" />
                                <input
                                    required
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                        Send Reset Link
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-brand-warm/50 border border-black/5 p-8 text-center space-y-6"
                    >
                        <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-brand/20">
                            <Mail className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-brand-matte font-black uppercase text-lg tracking-widest">Check your inbox</h3>
                            <p className="text-brand-matte/50 text-xs leading-relaxed mt-4 uppercase font-bold tracking-widest">
                                We have sent a password reset link to <br />
                                <span className="text-brand group-hover:text-brand-gold transition-colors">{email}</span>
                            </p>
                        </div>
                        <div className="pt-4">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-brand transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back to Login
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
