import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Heart, Package, LayoutDashboard } from 'lucide-react';
import { useCart } from '../contexts/CartContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { ToastContainer } from 'react-toast';
import logo from '../assets/nexus_logo.jpg';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = totalItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${isScrolled ? 'bg-brand-matte border-b border-brand-gold/30 py-1 shadow-2xl' : 'bg-brand-matte/90 border-b border-brand-gold/30 backdrop-blur-md py-3'}`}>
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Nexus Logo" className="h-10 w-auto object-contain transition-luxury group-hover:scale-110" />
            <span className="text-3xl font-black tracking-tighter uppercase text-white">
              NEXUS
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-12">
            {[
              { label: 'Home', path: '/' },
              { label: 'Shop', path: '/products' },
              { label: 'Contact', path: '/contact' }
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-[11px] font-black uppercase tracking-[0.4em] transition-luxury text-white/70 hover:text-brand-gold"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-8">
            <button className="p-2 transition-luxury text-white/50 hover:text-brand-gold">
              <Search className="w-5 h-5 stroke-[1.5px]" />
            </button>

            {user ? (
              <div className="relative group/user-menu">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 p-1 pl-3 rounded-full bg-white/5 border border-white/10 hover:border-brand-gold/50 transition-luxury"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70 hidden sm:block">
                      {user.name.split(' ')[0]}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center border border-brand-gold/30">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </Link>
                ) : (
                  <button className="flex items-center gap-3 p-1 pl-3 rounded-full bg-white/5 border border-white/10 hover:border-brand-gold/50 transition-luxury">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70 hidden sm:block">
                      {user.name.split(' ')[0]}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center border border-brand-gold/30">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </button>
                )}

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover/user-menu:opacity-100 group-hover/user-menu:translate-y-0 group-hover/user-menu:pointer-events-auto transition-all duration-300 z-[70]">
                  <div className="bg-brand-matte border border-brand-gold/30 shadow-2xl overflow-hidden p-2 backdrop-blur-xl">
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{user.name}</p>
                      <p className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em]">{user.role}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-white hover:bg-brand-gold/20 transition-luxury border-b border-white/5 mb-2">
                        <LayoutDashboard className="w-4 h-4" /> Admin Console
                      </Link>
                    )}
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-brand-gold hover:bg-white/5 transition-luxury">
                      <User className="w-4 h-4" /> Account Protocols
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-brand-gold hover:bg-white/5 transition-luxury">
                      <Package className="w-4 h-4" /> Order History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-white hover:bg-brand transition-luxury mt-2 border-t border-white/5 pt-4"
                    >
                      <X className="w-4 h-4" /> Termination (Logout)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2 transition-luxury text-white/50 hover:text-brand-gold">
                <User className="w-5 h-5 stroke-[1.5px]" />
              </Link>
            )}

            <Link to="/wishlist" className="p-2 transition-luxury text-white/50 hover:text-brand-gold">
              <Heart className="w-5 h-5 stroke-[1.5px]" />
            </Link>
            <Link to="/cart" className="relative p-2 transition-luxury text-white/50 hover:text-brand-gold">
              <ShoppingCart className="w-5 h-5 stroke-[1.5px]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0 bg-brand text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-brand-matte">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white">
              {isMenuOpen ? <X className="w-6 h-6 stroke-[1.5px]" /> : <Menu className="w-6 h-6 stroke-[1.5px]" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-brand-matte h-screen fixed inset-0 z-50 px-8 py-20 space-y-8 animate-in slide-in-from-right duration-500 overflow-y-auto">
          <div className="flex justify-between items-center mb-16">
            <span className="text-2xl font-black text-brand-gold uppercase tracking-tighter">NEXUS</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-white"><X className="w-8 h-8" /></button>
          </div>
          <Link to="/" className="block text-4xl font-black text-white hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>The Index</Link>
          <Link to="/products" className="block text-4xl font-black text-white hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Shop Elite</Link>
          <Link to="/contact" className="block text-4xl font-black text-white hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          {isAdmin && (
            <Link to="/admin" className="block text-4xl font-black text-brand-gold hover:text-white transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Admin Console</Link>
          )}
          <div className="space-y-6 pt-10 border-t border-white/10">
            {['Protein', 'Vitamins', 'Pre-Workout', 'Wellness'].map(cat => (
              <Link key={cat} to={`/products?category=${cat}`} onClick={() => setIsMenuOpen(false)} className="block text-sm font-bold uppercase tracking-[0.3em] text-white/50 hover:text-brand-gold">{cat}</Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;