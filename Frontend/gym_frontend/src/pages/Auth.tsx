import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { useStore } from '../StoreContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
interface AuthProps {
  mode: 'login' | 'signup' | 'admin-login';
}

const API_URL = 'http://localhost:5000/api';

const Auth: React.FC<AuthProps> = ({ mode }) => {
const { login, signup, user } = useAuth(); 
 const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'CUSTOMER'>(
    mode === 'admin-login' ? 'ADMIN' : 'CUSTOMER'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      if (mode === 'signup') {
        
       await signup(name,email,password,role)
      } else {

       await login(email,password)
      }


      // ✅ Redirect based on role  
      if (user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (error: any) {
      alert(error.message || 'Authentication failed');
    }
  };

  const title = mode === 'login' ? 'Welcome to Shop' : mode === 'signup' ? 'Create Account' : 'Admin Portal';
  const subtitle = mode === 'login' 
    ? 'Login to your account to continue shopping' 
    : mode === 'signup' 
    ? 'Join our community of elite athletes.' 
    : 'Authorized access only.';

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* LEFT SIDE: FORM */}

      
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 bg-white relative z-10">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black text-brand-matte flex items-center justify-center gap-3 tracking-tight">
              {title} <ShoppingCart className="w-8 h-8" />
            </h1>
            <p className="text-brand-matte/40 font-medium text-lg italic">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2">
                <input 
                  required 
                  type="text" 
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-5 bg-white border border-brand-matte/10 rounded-xl outline-none focus:border-brand-gold transition-all text-brand-matte font-semibold shadow-sm" 
                />
              </div>
            )}

            <div className="space-y-2">
              <input 
                required 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-5 bg-white border border-brand-matte/10 rounded-xl outline-none focus:border-brand-gold transition-all text-brand-matte font-semibold shadow-sm" 
              />
            </div>

            <div className="space-y-2 relative">
              <input 
                required 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-5 bg-white border border-brand-matte/10 rounded-xl outline-none focus:border-brand-gold transition-all text-brand-matte font-semibold shadow-sm" 
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm font-bold text-brand-matte/40">
                {mode === 'login' ? (
                  <>No account? <Link to="/signup" className="text-brand-gold hover:underline underline-offset-4">Sign up</Link></>
                ) : (
                  <>Already registered? <Link to="/login" className="text-brand-gold hover:underline underline-offset-4">Login</Link></>
                )}
              </div>
              <button 
                type="submit" 
                className="bg-[#374151] text-white px-12 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-matte transition-all shadow-xl"
              >
                {mode === 'login' ? 'Login' : mode === 'signup' ? 'Register' : 'Auth'}
              </button>
            </div>
          </form>

          {/* Test Credentials Box as per image */}
          {mode === 'login' && (
            <div className="mt-12 bg-[#1F2937] rounded-2xl p-8 text-center text-white space-y-2 shadow-2xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Dev Protocol</div>
              <h3 className="text-lg font-black tracking-tight">Test Account Details</h3>
              <p className="text-sm font-bold opacity-80">Email: <span className="text-brand-gold">test@gmail.com</span></p>
              <p className="text-sm font-bold opacity-80">Password: <span className="text-brand-gold">test4321</span></p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: IMAGE */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 z-10 bg-black/5"></div>
        <img 
          src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover grayscale-0"
          alt="Elite Fitness"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none p-12">
            <div className="bg-white p-12 lg:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.2)] max-w-lg text-center space-y-4">
                <h2 className="text-6xl md:text-8xl font-black text-brand-matte leading-[0.9] tracking-tighter uppercase">
                  WE'RE GLAD <br />
                  <span className="border-y-4 border-brand-gold/40 py-2 inline-block">YOU'RE</span> <br />
                  HERE!
                </h2>
                <div className="h-1.5 w-24 bg-brand-gold mx-auto mt-8"></div>
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


