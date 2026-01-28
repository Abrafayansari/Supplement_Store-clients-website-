
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_URL}/forgotpassword`, { email });
            setSent(true);
            toast.success('Reset link sent to your email!');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-brand-matte font-sans overflow-hidden items-center justify-center relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-lg p-4 relative z-10">
                <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingCart className="w-24 h-24 text-white" />
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                                Reset Password
                            </h1>
                            <p className="text-white/40 text-sm font-medium">Enter your email to receive recovery instructions.</p>
                        </div>

                        {!sent ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2 group/input">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1 group-focus-within/input:text-brand-gold transition-colors">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within/input:text-brand-gold transition-colors" />
                                        <input
                                            required
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-brand-gold/50 text-white font-medium placeholder:text-white/20 hover:bg-white/10 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-brand hover:bg-brand-gold disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-brand/20 active:scale-[0.98] flex items-center justify-center gap-3 group/btn"
                                    >
                                        {loading ? 'Processing...' : (
                                            <>
                                                Send Link
                                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-brand/10 border border-brand/20 p-6 rounded-xl flex flex-col items-center text-center space-y-4">
                                <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white shadow-lg shadow-brand/40">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Check your inbox</h3>
                                    <p className="text-white/40 text-xs leading-relaxed mt-2">We have sent a password reset link to <span className="text-brand-gold">{email}</span></p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-center pt-2">
                            <div className="text-sm font-medium text-white/40">
                                Remember details? <Link to="/login" className="text-brand-gold hover:text-white transition-colors underline-offset-4 hover:underline">Sign in</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
