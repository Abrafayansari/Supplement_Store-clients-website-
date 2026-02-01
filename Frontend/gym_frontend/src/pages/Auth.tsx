import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Lock, Mail, User, ShieldCheck, Zap, Activity, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthProps {
    mode: 'login' | 'signup' | 'admin-login';
}

const Auth: React.FC<AuthProps> = ({ mode }) => {
    const { login, signup, user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role] = useState<'ADMIN' | 'CUSTOMER'>(
        mode === 'admin-login' ? 'ADMIN' : 'CUSTOMER'
    );

    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') navigate('/admin');
            else navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'signup') {
                await signup(name, email, password, role);
            } else {
                await login(email, password);
            }
        } catch (error: any) {
            console.error('Authentication error:', error);
        } finally {
            setLoading(false);
        }
    };

    const title = mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Admin Login';
    const subtitle = mode === 'login'
        ? 'Sign in to access your account'
        : mode === 'signup'
            ? 'Start your shopping journey with us'
            : 'Access the administrative dashboard';

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans overflow-x-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />

            {/* Left Side: Brand & Features */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] p-12 flex-col justify-between relative overflow-hidden bg-brand-warm border-r border-black/5">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(123,15,23,0.05),transparent_70%)]" />
                </div>

                <Link to="/" className="flex items-center gap-4 relative z-10 group">
                    <div className="w-12 h-12 bg-white flex items-center justify-center rounded-none border border-black/10 group-hover:border-brand-gold/50 transition-colors shadow-sm">
                        <ShoppingCart className="w-6 h-6 text-brand" />
                    </div>
                    <span className="text-2xl font-black text-brand-matte tracking-widest uppercase">NEXUS</span>
                </Link>

                <div className="relative z-10 max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-7xl xl:text-8xl font-black text-brand-matte leading-[0.85] tracking-tighter mb-8 uppercase">
                            Fuel Your <br />
                            <span className="text-brand italic font-brand">Lifestyle</span>
                        </h2>
                        <div className="space-y-8">
                            {[
                                { icon: <Zap className="w-5 h-5" />, title: "Premium Quality", desc: "Highest grade supplements for your daily needs." },
                                { icon: <ShieldCheck className="w-5 h-5" />, title: "Trusted Brand", desc: "Rigorously tested products for total safety." },
                                { icon: <Activity className="w-5 h-5" />, title: "Better Results", desc: "Formulas optimized for your personal goals." }
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="w-12 h-12 shrink-0 bg-white border border-black/5 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-brand-matte font-black uppercase text-sm tracking-widest mb-1">{feature.title}</h4>
                                        <p className="text-brand-matte/50 text-sm leading-relaxed max-w-xs">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="text-[10px] font-bold text-brand-matte/20 uppercase tracking-[0.4em] relative z-10">
                    © {new Date().getFullYear()} NEXUS · PREMIUM E-COMMERCE
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-16 relative z-10 bg-white">
                <Link to="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-brand-matte/40 hover:text-brand transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Store</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[480px]"
                >
                    <div className="text-center lg:text-left mb-12">
                        <h1 className="text-4xl lg:text-5xl font-black text-brand-matte uppercase tracking-tighter mb-3 leading-none italic">
                            {title}
                        </h1>
                        <p className="text-brand-matte/30 text-xs font-bold uppercase tracking-[0.2em]">{subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {mode === 'signup' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.2em] pl-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-matte/10 group-focus-within:text-brand transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Your Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-brand-warm/50 border border-black/5 px-14 py-5 text-brand-matte text-sm font-bold uppercase tracking-widest outline-none focus:border-brand-gold/30 hover:bg-brand-warm transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

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
                                    className="w-full bg-brand-warm/50 border border-black/5 px-14 py-5 text-brand-matte text-sm font-bold tracking-widest outline-none focus:border-brand-gold/30 hover:bg-brand-warm transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center pr-1">
                                <label className="text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.2em]">Password</label>
                                {mode !== 'signup' && (
                                    <Link to="/forgot-password" size="sm" className="text-[9px] font-black text-brand-gold hover:text-brand transition-colors uppercase tracking-widest">
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-matte/10 group-focus-within:text-brand transition-colors" />
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-brand-warm/50 border border-black/5 px-14 py-5 text-brand-matte text-sm font-bold tracking-widest outline-none focus:border-brand-gold/30 hover:bg-brand-warm transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-black text-brand-matte/20 hover:text-brand-matte uppercase tracking-widest"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
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
                                        {mode === 'signup' ? 'Create Account' : 'Sign In'}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center pt-8 border-t border-black/5">
                            <div className="text-[10px] font-bold text-brand-matte/20 uppercase tracking-widest">
                                {mode === 'login' || mode === 'admin-login' ? (
                                    <>
                                        Don't have an account?{" "}
                                        <Link to="/signup" className="text-brand-gold hover:text-brand transition-colors">Sign Up</Link>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{" "}
                                        <Link to="/login" className="text-brand-gold hover:text-brand transition-colors">Sign In</Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {mode === 'login' && (
                            <div className="mt-8 bg-brand-warm/50 border border-black/5 p-5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 bg-brand-gold text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest">Demo Account</div>
                                <p className="text-[9px] font-black text-brand-matte/30 uppercase mb-3 tracking-widest">Use these credentials to test</p>
                                <div className="flex flex-col sm:flex-row justify-between gap-2 text-[10px] text-brand-matte/60 font-mono tracking-widest">
                                    <span className="group-hover:text-brand-matte transition-colors">EMAIL: test@gmail.com</span>
                                    <span className="hidden sm:inline text-black/10">|</span>
                                    <span className="group-hover:text-brand-matte transition-colors">PASS: test4321</span>
                                </div>
                            </div>
                        )}
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;


