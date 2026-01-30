import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { toast } from 'sonner';

interface AuthProps {
  mode: 'login' | 'signup' | 'admin-login';
}

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const { login, signup, user } = useAuth(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'CUSTOMER'>(
    mode === 'admin-login' ? 'ADMIN' : 'CUSTOMER'
  );

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        if (mode === 'signup') {
          await signup(name, email, password, role);
        } else {
          await login(email, password);
        }

        const targetRole = role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
        
        if (mode === 'admin-login' || targetRole === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }

      } catch (error: any) {
        // Errors are handled globally by the api interceptor
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };


  const title = mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Admin Portal';
  const subtitle = mode === 'login' 
    ? 'Enter your details to access your account' 
    : mode === 'signup' 
    ? 'Join the elite community today' 
    : 'Authorized personnel only';

  return (
    <div className="min-h-screen flex bg-brand-matte font-sans overflow-hidden items-center justify-center relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 lg:p-8 relative z-10">
        
        {/* LEFT SIDE: FORM */}
        <div className="flex flex-col justify-center">
            <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShoppingCart className="w-24 h-24 text-white" />
                </div>

                <div className="space-y-6 relative z-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                            {title}
                        </h1>
                        <p className="text-white/40 text-lg font-medium">{subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === 'signup' && (
                            <div className="space-y-2 group/input">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1 group-focus-within/input:text-brand-gold transition-colors">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within/input:text-brand-gold transition-colors" />
                                    <input 
                                        required 
                                        type="text" 
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-brand-gold/50 text-white font-medium placeholder:text-white/20 hover:bg-white/10 transition-all" 
                                    />
                                </div>
                            </div>
                        )}

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

                        <div className="space-y-2 group/input">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1 group-focus-within/input:text-brand-gold transition-colors">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within/input:text-brand-gold transition-colors" />
                                <input 
                                    required 
                                    type="password" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-brand-gold/50 text-white font-medium placeholder:text-white/20 hover:bg-white/10 transition-all" 
                                />
                            </div>
                        </div>

                        <div className="pt-1 flex justify-end">
                            {(mode === 'login' || mode === 'admin-login') && (
                                <Link to="/forgot-password" className="text-xs font-bold text-brand-gold hover:text-white transition-colors uppercase tracking-widest">Forgot Password?</Link>
                            )}
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-brand hover:bg-brand-gold disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-brand/20 active:scale-[0.98] flex items-center justify-center gap-3 group/btn"
                            >
                                {loading ? 'Processing...' : (
                                    <>
                                        {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Authenticate'}
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                             <div className="text-sm font-medium text-white/40">
                                {mode === 'login' ? (
                                    <>New here? <Link to="/signup" className="text-brand-gold hover:text-white transition-colors underline-offset-4 hover:underline">Create an account</Link></>
                                ) : (
                                    <>Already a member? <Link to="/login" className="text-brand-gold hover:text-white transition-colors underline-offset-4 hover:underline">Sign in</Link></>
                                )}
                            </div>
                        </div>
                    </form>

                     {/* Test Credentials Box */}
                    {mode === 'login' && (
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-brand-gold/20 text-brand-gold text-[10px] font-bold px-2 py-1 rounded-bl-lg">DEMO</div>
                                <p className="text-xs font-bold text-white/30 uppercase mb-2">Pre-filled Test Account</p>
                                <div className="flex items-center justify-between text-sm text-white/60 font-mono">
                                    <span>test@gmail.com</span>
                                    <span className="opacity-50">•</span>
                                    <span>test4321</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* RIGHT SIDE: CONTENT */}
        <div className="hidden lg:flex flex-col justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent rounded-3xl blur-3xl"></div>
            <div className="relative space-y-8 p-12">
                <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/20 leading-[0.9] tracking-tighter">
                    FUEL YOUR <br/>
                    <span className="text-brand-gold">AMBITION</span>
                </h2>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20 shrink-0">
                            <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-xl mb-1">Premium Performance</h3>
                            <p className="text-white/40 leading-relaxed">scientifically formulated supplements designed for elite athletes who demand the absolute best.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20 shrink-0">
                             <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-xl mb-1">Quality Guaranteed</h3>
                            <p className="text-white/40 leading-relaxed">Every batch is rigorously tested to ensure 100% purity and potency. No harmful additives.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;




// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { ShoppingCart } from 'lucide-react';
// import axios from 'axios';
// import { useStore } from '../StoreContext.tsx';
// import { useAuth } from '@/contexts/AuthContext.tsx';
// interface AuthProps {
//   mode: 'login' | 'signup' | 'admin-login';
// }

// const API_URL = 'http://localhost:5000/api';

// const Auth: React.FC<AuthProps> = ({ mode }) => {
// const { login, signup } = useAuth(); 
//  const navigate = useNavigate();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState<'ADMIN' | 'CUSTOMER'>(
//     mode === 'admin-login' ? 'ADMIN' : 'CUSTOMER'
//   );

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {

//       if (mode === 'signup') {
        
//         signup(name,email,password,role)
//       } else {

//         login(email,password)
//       }


//      const {user}=useAuth();
//       // ✅ Redirect based on role
//       if (user?.role === 'ADMIN') {
//         navigate('/admin');
//       } else {
//         navigate('/');
//       }

//     } catch (error: any) {
//       alert(error.message || 'Authentication failed');
//     }
//   };

//   const title =
//     mode === 'login'
//       ? 'Welcome to Shop'
//       : mode === 'signup'
//       ? 'Create Account'
//       : 'Admin Portal';

//   return (
//     <div className="min-h-screen flex bg-white">
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-10">
//         <div className="w-full max-w-md space-y-8">

//           <h1 className="text-4xl font-black text-center flex justify-center gap-2">
//             {title} <ShoppingCart />
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-5">

//             {mode === 'signup' && (
//               <>
//                 <input
//                   required
//                   placeholder="Full Name"
//                   value={name}
//                   onChange={e => setName(e.target.value)}
//                   className="input"
//                 />

//                 <select
//                   value={role}
//                   onChange={e => setRole(e.target.value as 'ADMIN' | 'CUSTOMER')}
//                   className="input"
//                 >
//                   <option value="CUSTOMER">Customer</option>
//                   <option value="ADMIN">Admin</option>
//                 </select>
//               </>
//             )}

//             <input
//               required
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               className="input"
//             />

//             <input
//               required
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               className="input"
//             />

//             <button
//               type="submit"
//               className="w-full bg-black text-white py-4 font-bold rounded-xl"
//             >
//               {mode === 'signup' ? 'Register' : 'Login'}
//             </button>

//             <p className="text-center text-sm">
//               {mode === 'login' ? (
//                 <>No account? <Link to="/signup" className="text-blue-600">Signup</Link></>
//               ) : (
//                 <>Already registered? <Link to="/login" className="text-blue-600">Login</Link></>
//               )}
//             </p>
//           </form>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;


