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
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${isScrolled ? 'bg-white/90 border-b border-black/5 py-1 shadow-lg backdrop-blur-xl' : 'bg-white/80 border-b border-white/10 backdrop-blur-md py-3'}`}>
        <ToastContainer />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <img src={logo} alt="Nexus Logo" className="h-8 w-auto sm:h-10 object-contain transition-luxury group-hover:scale-110" />
              <span className="text-xl sm:text-2xl md:text-3xl tracking-tighter uppercase text-brand font-brand">
                NEXUS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
              <Link to="/" className="text-[11px] font-black uppercase tracking-[0.4em] transition-luxury text-brand-matte hover:text-brand-gold">Home</Link>

              {/* Shop Dropdown */}
              <div className="relative group/shop-dropdown">
                <Link
                  to="/products"
                  className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.4em] transition-luxury text-brand-matte hover:text-brand-gold"
                >
                  Shop <ChevronDown className="w-3 h-3 group-hover/shop-dropdown:rotate-180 transition-transform" />
                </Link>

                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[600px] opacity-0 translate-y-2 pointer-events-none group-hover/shop-dropdown:opacity-100 group-hover/shop-dropdown:translate-y-0 group-hover/shop-dropdown:pointer-events-auto transition-all duration-300 z-[70]">
                  <div className="bg-white border border-brand-matte/10 shadow-2xl p-8 grid grid-cols-3 gap-8 backdrop-blur-xl">
                    {categories.map((cat) => (
                      <div key={cat.name} className="space-y-4">
                        <Link
                          to={`/products?category=${cat.name}`}
                          className="text-[10px] font-black uppercase tracking-[0.2em] text-brand border-b border-brand/10 pb-2 block truncate"
                          title={cat.name}
                        >
                          {cat.name.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                        </Link>
                        <div className="space-y-2">
                          {cat.subCategories.map((sub) => (
                            <Link
                              key={sub}
                              to={`/products?subCategory=${sub}`}
                              className="block text-[10px] font-bold text-brand-matte/60 hover:text-brand-gold uppercase tracking-widest transition-colors"
                            >
                              {sub.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
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

            {/* Icons and Mobile Trigger */}
            <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
              <div className="relative flex items-center">
                <AnimatePresence mode="wait">
                  {isSearchOpen && (
                    <motion.form
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: window.innerWidth < 640 ? 150 : 240, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      onSubmit={handleSearch}
                      className="absolute right-full mr-2"
                    >
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-white border border-brand-matte/10 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest outline-none focus:border-brand-gold transition-all"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-1.5 sm:p-2 transition-luxury text-brand-matte hover:text-brand-gold"
                >
                  {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5 stroke-[1.5px]" />}
                </button>
              </div>

              {/* Account - Mini on Mobile */}
              {user ? (
                <div className="relative group/user-menu">
                  <button className="flex items-center gap-2 p-0.5 sm:p-1 sm:pl-3 rounded-full bg-white border border-brand-matte/10 hover:border-brand-gold/50 transition-luxury shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-matte/70 hidden md:block">
                      {user.name.split(' ')[0]}
                    </span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand flex items-center justify-center border border-brand-gold/30">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </button>

                  {/* Dropdown Menu (Desktop) */}
                  <div className="absolute right-0 mt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover/user-menu:opacity-100 group-hover/user-menu:translate-y-0 group-hover/user-menu:pointer-events-auto transition-all duration-300 z-[70] hidden lg:block">
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
                <Link to="/login" className="p-1.5 sm:p-2 transition-luxury text-brand-matte/50 hover:text-brand-gold">
                  <User className="w-5 h-5 stroke-[1.5px]" />
                </Link>
              )}

              <Link to="/wishlist" className="hidden sm:block p-1.5 sm:p-2 transition-luxury text-black hover:text-brand-gold">
                <Heart className="w-5 h-5 stroke-[1.5px]" />
              </Link>

              <Link to="/cart" className="relative p-1.5 sm:p-2 transition-luxury text-black hover:text-brand-gold">
                <ShoppingCart className="w-5 h-5 stroke-[1.5px]" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-0 bg-brand text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-brand-matte">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-3 -mr-2 text-brand-matte hover:text-brand-gold transition-colors z-[70] relative"
                aria-label="Open menu"
              >
                <Menu className="w-7 h-7 stroke-[1.5px]" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu-portal"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden bg-brand-warm fixed inset-0 z-[1000] overflow-y-auto font-sans"
          >
            <div className="flex flex-col min-h-screen px-6 sm:px-12 py-8 sm:py-12">
              <div className="flex justify-between items-center mb-12 sm:mb-16">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="Logo" className="h-10 w-auto" />
                  <span className="text-2xl font-black text-brand-gold uppercase tracking-tighter">NEXUS</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 text-brand-matte hover:text-brand transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="flex flex-col space-y-6 sm:space-y-8">
                <Link to="/" className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-matte hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/products" className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-matte hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
                <Link to="/plans" className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-matte hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Plans</Link>
                <Link to="/bundles" className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-matte hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Bundles</Link>
                <Link to="/contact" className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-matte hover:text-brand-gold transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Contact</Link>

                {isAdmin && (
                  <Link to="/admin" className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-gold hover:text-brand-matte transition-luxury uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>Admin Console</Link>
                )}
              </div>

              <div className="mt-12 pt-12 border-t border-brand-matte/10 space-y-10 mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  {categories.map(cat => (
                    <div key={cat.name} className="space-y-4">
                      <Link
                        to={`/products?category=${cat.name}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-lg font-black uppercase tracking-[0.2em] text-brand border-b border-brand/10 pb-2 "
                      >
                        {cat.name.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                      </Link>
                      <div className="pl-2 space-y-3">
                        {cat.subCategories.map(sub => (
                          <Link
                            key={sub}
                            to={`/products?subCategory=${sub}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="block text-xs font-bold uppercase tracking-widest text-brand-matte/60 hover:text-brand-gold transition-colors"
                          >
                            {sub.split(/[- ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-4 pt-10 border-t border-brand-matte/5">
                  <Link to="/wishlist" className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-brand-matte/40 hover:text-brand-gold" onClick={() => setIsMenuOpen(false)}>
                    <Heart className="w-5 h-5" /> Wishlist
                  </Link>
                  {user ? (
                    <>
                      <Link to="/profile" className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-black hover:text-brand-gold" onClick={() => setIsMenuOpen(false)}>
                        <User className="w-5 h-5" /> My Account
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-brand hover:text-brand-gold"
                      >
                        <X className="w-5 h-5" /> Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/login" className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-brand-matte/40 hover:text-brand-gold" onClick={() => setIsMenuOpen(false)}>
                      <User className="w-5 h-5" /> Login / Register
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
