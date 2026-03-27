import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Heart, Package, LayoutDashboard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext.tsx';
import { useWishlist } from '../contexts/WishlistContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import logo from '../assets/nexus_logo.jpg';
import { getCategories, Category } from '../data/Product';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
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

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
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
      {/* ── NAVBAR ─────────────────────────────────────────────────────────────
       *
       *  Layout (3 columns):
       *    Left  → nav links (hidden on < lg)
       *    Center → logo  ← always visible, constrained height
       *    Right  → icons + hamburger
       *
       *  Fixed height:
       *    Mobile / tablet  → h-14  (56 px)
       *    Desktop          → h-16  (64 px)
       *
       *  Logo is clipped to the navbar height using max-h so it never overflows.
       * ──────────────────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 bg-white border-b border-brand-matte/5 ${
          isScrolled ? 'shadow-lg py-0' : 'py-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Row — fixed height so logo can never push it taller */}
          <div className="flex items-center justify-between h-16 md:h-[70px]">

            {/* ── LEFT: Nav Links (desktop only) ──────────────────────────── */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 min-w-0">
              <Link
                to="/"
                className="text-[11px] font-black uppercase tracking-[0.4em] whitespace-nowrap text-brand-matte hover:text-brand-gold transition-all"
              >
                Home
              </Link>

              {/* Shop dropdown */}
              <div className="relative group/shop">
                <Link
                  to="/products"
                  className="flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.4em] whitespace-nowrap text-brand-matte hover:text-brand-gold transition-all"
                >
                  Shop
                  <ChevronDown className="w-3 h-3 transition-transform group-hover/shop:rotate-180" />
                </Link>

                {/* Mega dropdown */}
                <div className="absolute left-0 top-full mt-2 w-max max-w-[90vw] opacity-0 -translate-y-2 scale-95 pointer-events-none group-hover/shop:opacity-100 group-hover/shop:translate-y-0 group-hover/shop:scale-100 group-hover/shop:pointer-events-auto transition-all duration-300 z-[70]">
                  <div className="bg-brand-warm border border-brand-matte/10 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
                    <div
                      className={`grid gap-8 ${
                        categories.length > 6
                          ? 'grid-cols-4'
                          : categories.length > 3
                          ? 'grid-cols-3'
                          : 'grid-cols-2'
                      }`}
                    >
                      {categories.map((cat) => (
                        <div key={cat.name} className="space-y-4">
                          <Link
                            to={`/products?category=${cat.name}`}
                            className="text-[11px] font-black uppercase tracking-[0.3em] text-brand border-b-2 border-brand-gold pb-2 block"
                          >
                            {cat.name
                              .split(/[- ]/)
                              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                              .join(' ')}
                          </Link>
                          <div className="space-y-2">
                            {cat.subCategories.slice(0, 8).map((sub) => (
                              <Link
                                key={sub}
                                to={`/products?subCategory=${sub}`}
                                className="block text-[10px] font-bold text-brand-matte/60 hover:text-brand uppercase tracking-[0.2em] hover:translate-x-1 transition-all"
                              >
                                {sub
                                  .split(/[- ]/)
                                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                                  .join(' ')}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                      {categories.length === 0 && (
                        <div className="col-span-2 text-center py-8 text-brand-matte/40 text-[11px] uppercase font-black tracking-widest border border-dashed border-brand-matte/10">
                          Loading catalog…
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/plans"   className="text-[11px] font-black uppercase tracking-[0.4em] whitespace-nowrap text-brand-matte hover:text-brand-gold transition-all">Plans</Link>
              <Link to="/bundles" className="text-[11px] font-black uppercase tracking-[0.4em] whitespace-nowrap text-brand-matte hover:text-brand-gold transition-all">Bundles</Link>
              <Link to="/contact" className="text-[11px] font-black uppercase tracking-[0.4em] whitespace-nowrap text-brand-matte hover:text-brand-gold transition-all">Contact</Link>
            </div>

            {/* ── CENTER: Logo ─────────────────────────────────────────────
             *  max-h matches the row height minus 8px breathing room.
             *  w-auto lets the logo scale proportionally.
             *  shrink-0 prevents flex from squishing it.
             * ─────────────────────────────────────────────────────────── */}
            <div className="flex justify-center lg:flex-1">
              <Link to="/" className="flex items-center shrink-0 group">
                <img
                  src={logo}
                  alt="Nexus Logo"
                  className="
                    w-auto object-contain
                    h-10          /* mobile  — 40 px, fits inside h-14 row */
                    md:h-11       /* tablet  — 44 px */
                    lg:h-12       /* desktop — 48 px, fits inside h-16 row */
                    group-hover:scale-105 transition-transform duration-300
                  "
                />
              </Link>
            </div>

            {/* ── RIGHT: Icons ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-1 justify-end">

              {/* Search */}
              <div className="relative flex items-center">
                <AnimatePresence mode="wait">
                  {isSearchOpen && (
                    <motion.form
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 180, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={handleSearch}
                      className="absolute right-full mr-2 overflow-hidden"
                    >
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-brand-warm border border-brand-matte/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest outline-none focus:border-brand-gold transition-all"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-brand-matte hover:text-brand-gold transition-colors"
                >
                  {isSearchOpen
                    ? <X className="w-5 h-5" />
                    : <Search className="w-5 h-5 stroke-[1.5px]" />
                  }
                </button>
              </div>

              {/* ── User icon / dropdown ──────────────────────────────────
               *  LOGGED IN  → white icon inside a dark brand circle
               *  LOGGED OUT → dark icon (no background)
               * ───────────────────────────────────────────────────────── */}
              {user ? (
                <div className="relative group/user hidden sm:block">
                  {/* Trigger button */}
                  <button className="flex items-center gap-2 rounded-full bg-brand-matte border border-brand-matte/80 hover:border-brand-gold/60 pl-0 pr-1 sm:pl-2 transition-all shadow-sm">
                    {/* Username — visible md+ */}
                    <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-white/80 pl-2">
                      {user.name.split(' ')[0]}
                    </span>
                    {/* White user icon circle */}
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-matte flex items-center justify-center border border-brand-gold/30">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </button>

                  {/* Desktop dropdown */}
                  <div className="absolute right-0 top-full w-56 opacity-0 translate-y-2 pointer-events-none group-hover/user:opacity-100 group-hover/user:translate-y-0 group-hover/user:pointer-events-auto transition-all duration-300 z-[70] pt-2">
                    <div className="bg-brand-warm border border-brand-matte/10 shadow-2xl p-2 backdrop-blur-xl">
                      <div className="px-4 py-3 border-b border-brand-matte/5 mb-2">
                        <p className="text-[10px] font-black text-brand-matte uppercase tracking-tight truncate">{user.name}</p>
                        <p className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.2em]">{user.role}</p>
                      </div>

                      {isAdmin ? (
                        <>
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-gold hover:bg-brand-gold/10 transition-all border-b border-brand-matte/5 mb-1">
                            <LayoutDashboard className="w-4 h-4" /> Admin Console
                          </Link>
                          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-matte/60 hover:text-brand-gold hover:bg-brand-matte/5 transition-all">
                            <Package className="w-4 h-4" /> Manage Products
                          </Link>
                          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-matte/60 hover:text-brand-gold hover:bg-brand-matte/5 transition-all">
                            <ShoppingCart className="w-4 h-4" /> Manage Orders
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-matte/60 hover:text-brand-gold hover:bg-brand-matte/5 transition-all">
                            <User className="w-4 h-4" /> Account Settings
                          </Link>
                          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-matte/60 hover:text-brand-gold hover:bg-brand-matte/5 transition-all">
                            <Package className="w-4 h-4" /> Order History
                          </Link>
                        </>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-white hover:bg-brand transition-all mt-2 border-t border-brand-matte/5"
                      >
                        <X className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* NOT logged in → plain dark icon */
                <Link
                  to="/login"
                  className="p-2 text-brand-matte hover:text-brand-gold transition-colors"
                  aria-label="Login"
                >
                  <User className="w-5 h-5 stroke-[1.5px] text-brand-matte" />
                </Link>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="hidden sm:flex relative p-2 text-brand-matte hover:text-brand-gold transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.5px]" />
                {wishlistItems && wishlistItems.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-brand text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-brand-matte hover:text-brand-gold transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5 stroke-[1.5px]" />
                {totalItems > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-brand text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Hamburger — shown below lg */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                className="lg:hidden p-2 -mr-1 text-brand-matte hover:text-brand-gold transition-colors"
              >
                <Menu className="w-6 h-6 stroke-[1.5px]" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE / TABLET MENU ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-[1000] bg-brand-warm overflow-y-auto"
          >
            <div className="flex flex-col min-h-screen px-6 sm:px-10 py-6">

              {/* Header row */}
              <div className="flex justify-between items-center mb-10">
                <img src={logo} alt="Nexus Logo" className="h-10 w-auto object-contain" />
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 text-brand-matte hover:text-brand transition-colors"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              {/* Main links */}
              <nav className="flex flex-col gap-5">
                {[
                  { to: '/',         label: 'Home'     },
                  { to: '/products', label: 'Shop All' },
                  { to: '/plans',    label: 'Plans'    },
                  { to: '/bundles',  label: 'Bundles'  },
                  { to: '/contact',  label: 'Contact'  },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-brand-matte hover:text-brand-gold transition-colors"
                  >
                    {label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-brand-gold hover:text-brand-matte transition-colors"
                  >
                    Admin Console
                  </Link>
                )}
              </nav>

              {/* Category grid */}
              {categories.length > 0 && (
                <div className="mt-10 pt-8 border-t border-brand-matte/10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {categories.map((cat) => (
                    <div key={cat.name} className="space-y-3">
                      <Link
                        to={`/products?category=${cat.name}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-sm font-black uppercase tracking-[0.2em] text-brand border-b border-brand/10 pb-2"
                      >
                        {cat.name.split(/[- ]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                      </Link>
                      <div className="pl-2 flex flex-col gap-2">
                        {cat.subCategories.map((sub) => (
                          <Link
                            key={sub}
                            to={`/products?subCategory=${sub}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-xs font-bold uppercase tracking-widest text-brand-matte/60 hover:text-brand-gold transition-colors"
                          >
                            {sub.split(/[- ]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom actions */}
              <div className="mt-10 pt-8 border-t border-brand-matte/5 flex flex-col gap-4 pb-10">
                <Link
                  to="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-brand-matte/60 hover:text-brand-gold transition-colors"
                >
                  <div className="relative">
                    <Heart className="w-5 h-5" />
                    {wishlistItems && wishlistItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-brand text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </div>
                  Wishlist
                </Link>

                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-brand-matte hover:text-brand-gold transition-colors"
                    >
                      {/* White icon badge in mobile menu too */}
                      <div className="w-7 h-7 rounded-full bg-brand-matte flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      My Account
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-brand hover:text-brand-gold transition-colors"
                    >
                      <X className="w-5 h-5" /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-brand-matte/60 hover:text-brand-gold transition-colors"
                  >
                    <User className="w-5 h-5 text-brand-matte" /> Login / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;