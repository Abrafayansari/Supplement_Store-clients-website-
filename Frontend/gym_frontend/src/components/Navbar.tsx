import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useStore } from '../StoreContext.tsx';
import { ToastContainer } from 'react-toast';
const Navbar: React.FC = () => {
  const { cart, user, logout } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${isScrolled ? 'bg-brand-matte border-b border-brand-gold/30 py-1 shadow-2xl' : 'bg-brand-matte/90 border-b border-brand-gold/30 backdrop-blur-md py-3'}`}>
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl font-black tracking-tighter uppercase text-white">
              PURE<span className="text-brand-gold italic">VIGOR</span>
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
            <Link to="/profile" className="p-2 transition-luxury text-white/50 hover:text-brand-gold">
              <User className="w-5 h-5 stroke-[1.5px]" />
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
             <span className="text-2xl font-black text-brand-gold uppercase tracking-tighter">PureVigor</span>
             <button onClick={() => setIsMenuOpen(false)} className="text-white"><X className="w-8 h-8" /></button>
          </div>
          <Link to="/" className="block text-4xl font-black text-white hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>The Index</Link>
          <Link to="/products" className="block text-4xl font-black text-white hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Shop Elite</Link>
          <Link to="/contact" className="block text-4xl font-black text-white hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Contact</Link>
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