import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Heart, Package, LayoutDashboard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { ToastContainer } from 'react-toast';
import logo from '../assets/nexus_logo.jpg';
import { getCategories, Category } from '../data/Product';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCats();
  }, []);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${isScrolled ? 'bg-gray-100/90 border-b border-black/5 py-1 shadow-lg backdrop-blur-xl' : 'bg-gray-100/90 border-b border-black/5 backdrop-blur-md py-3'}`}>
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Nexus Logo" className="h-10 w-auto object-contain transition-luxury group-hover:scale-110" />
            <span className="text-3xl  tracking-tighter uppercase text-brand font-brand ">
              NEXUS
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-12">
            <Link to="/" className="text-[11px] font-black uppercase tracking-[0.4em] transition-luxury text-brand-matte hover:text-brand-gold">Home</Link>

            {/* Shop Dropdown */}
            <div className="relative group/shop-dropdown">
              <Link
                to="/products"
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.4em] transition-luxury text-brand-matte hover:text-brand-gold"
              >
                Shop <ChevronDown className="w-3 h-3 group-hover/shop-dropdown:rotate-180 transition-transform" />
              </Link>

              <div className="absolute left-0 mt-2 w-[600px] opacity-0 translate-y-2 pointer-events-none group-hover/shop-dropdown:opacity-100 group-hover/shop-dropdown:translate-y-0 group-hover/shop-dropdown:pointer-events-auto transition-all duration-300 z-[70]">
                <div className="bg-white border border-brand-matte/10 shadow-2xl p-8 grid grid-cols-3 gap-8 backdrop-blur-xl">
                  {categories.map((cat) => (
                    <div key={cat.name} className="space-y-4">
                      <Link
                        to={`/products?category=${cat.name}`}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-brand border-b border-brand/10 pb-2 block"
                      >
                        {cat.name}
                      </Link>
                      <div className="space-y-2">
                        {cat.subCategories.map((sub) => (
                          <Link
                            key={sub}
                            to={`/products?subCategory=${sub}`}
                            className="block text-[10px] font-bold text-brand-matte/60 hover:text-brand-gold uppercase tracking-widest transition-colors"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="col-span-3 text-center py-4 text-brand-matte/40 text-[10px] uppercase font-black tracking-widest">
                      Loading Categories...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Link to="/plans" className="text-[11px] font-black uppercase tracking-[0.4em] transition-luxury text-brand-matte hover:text-brand-gold">Plans</Link>
            <Link to="/bundles" className="text-[11px] font-black uppercase tracking-[0.4em] transition-luxury text-brand-matte hover:text-brand-gold">Bundles</Link>
            <Link to="/contact" className="text-[11px] font-black uppercase tracking-[0.4em] transition-luxury text-brand-matte hover:text-brand-gold">Contact</Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearch}
                    className="absolute right-full mr-2"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search protocols..."
                      className="w-full bg-white border border-brand-matte/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest outline-none focus:border-brand-gold transition-all"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 transition-luxury text-brand-matte hover:text-brand-gold"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5 stroke-[1.5px]" />}
              </button>
            </div>

            {user ? (
              <div className="relative group/user-menu">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 p-1 pl-3 rounded-full bg-white/5 border-2 border-brand-matte/10 hover:border-brand-gold/50 transition-luxury"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-matte/70 hidden sm:block">
                      {user.name.split(' ')[0]}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center border border-brand-gold/30">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </Link>
                ) : (
                  <button className="flex items-center gap-3 p-1 pl-3 rounded-full bg-white border border-brand-matte/10 hover:border-brand-gold/50 transition-luxury shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-matte/70 hidden sm:block">
                      {user.name.split(' ')[0]}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center border border-brand-gold/30">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </button>
                )}

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover/user-menu:opacity-100 group-hover/user-menu:translate-y-0 group-hover/user-menu:pointer-events-auto transition-all duration-300 z-[70]">
                  <div className="bg-white border border-brand-matte/10 shadow-2xl overflow-hidden p-2 backdrop-blur-xl">
                    <div className="px-4 py-3 border-b border-brand-matte/5 mb-2">
                      <p className="text-[10px] font-black text-brand-matte uppercase tracking-tighter truncate">{user.name}</p>
                      <p className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em]">{user.role}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-brand-matte hover:bg-brand-gold/10 transition-luxury border-b border-brand-matte/5 mb-2">
                        <LayoutDashboard className="w-4 h-4" /> Admin Console
                      </Link>
                    )}
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-matte/60 hover:text-brand-gold hover:bg-brand-matte/5 transition-luxury">
                      <User className="w-4 h-4" /> Account Settings
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-matte/60 hover:text-brand-gold hover:bg-brand-matte/5 transition-luxury">
                      <Package className="w-4 h-4" /> Order History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-white hover:bg-brand transition-luxury mt-2 border-t border-brand-matte/5 pt-4"
                    >
                      <X className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2 transition-luxury text-brand-matte/50 hover:text-brand-gold">
                <User className="w-5 h-5 stroke-[1.5px]" />
              </Link>
            )}

            <Link to="/wishlist" className="p-2 transition-luxury text-black hover:text-brand-gold">
              <Heart className="w-5 h-5 stroke-[1.5px]" />
            </Link>
            <Link to="/cart" className="relative p-2 transition-luxury text-black hover:text-brand-gold">
              <ShoppingCart className="w-5 h-5 stroke-[1.5px]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0 bg-brand text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-brand-matte">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-brand-matte">
              {isMenuOpen ? <X className="w-6 h-6 stroke-[1.5px]" /> : <Menu className="w-6 h-6 stroke-[1.5px]" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-brand-warm h-screen fixed inset-0 z-50 px-8 py-20 space-y-8 animate-in slide-in-from-right duration-500 overflow-y-auto font-sans">
          <div className="flex justify-between items-center mb-16">
            <span className="text-2xl font-black text-brand-gold uppercase tracking-tighter transition-luxury">NEXUS</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-brand-matte hover:text-brand transition-colors"><X className="w-8 h-8" /></button>
          </div>
          <Link to="/" className="block text-4xl font-black text-brand-matte hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/products" className="block text-4xl font-black text-brand-matte hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          <Link to="/plans" className="block text-4xl font-black text-brand-matte hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Plans</Link>
          <Link to="/bundles" className="block text-4xl font-black text-brand-matte hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Bundles</Link>
          <Link to="/contact" className="block text-4xl font-black text-brand-matte hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          {isAdmin && (
            <Link to="/admin" className="block text-4xl font-black text-brand-gold hover:text-brand-matte transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Admin Console</Link>
          )}
          <div className="space-y-6 pt-10 border-t border-brand-matte/10">
            {categories.map(cat => (
              <div key={cat.name} className="space-y-4">
                <Link to={`/products?category=${cat.name}`} onClick={() => setIsMenuOpen(false)} className="block text-lg font-black uppercase tracking-[0.2em] text-brand">{cat.name}</Link>
                <div className="pl-4 space-y-2">
                  {cat.subCategories.map(sub => (
                    <Link key={sub} to={`/products?subCategory=${sub}`} onClick={() => setIsMenuOpen(false)} className="block text-sm font-bold uppercase tracking-widest text-brand-matte/60">{sub}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;