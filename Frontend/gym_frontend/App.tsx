import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './src/StoreContext';
import Navbar from './src/components/Navbar';
import Footer from './src/components/Footer';

// Pages
import Home from './src/pages/Home/Home';
import About from './src/pages/About';
import Contact from './src/pages/Contact';
import ProductList from './src/pages/ProductList';
import ProductDetail from './src/pages/ProductDetail';
import AddReview from './src/pages/AddReview';
import Cart from './src/pages/Cart';
import Checkout from './src/pages/Checkout';
import Profile from './src/pages/Profile';
import Auth from './src/pages/Auth';
import AdminDashboard from './src/pages/Admin/Dashboard';
import ProductManagement from './src/pages/Admin/ProductManagement';
import OrderManagement from './src/pages/Admin/OrderManagement';
import UserManagement from './src/pages/Admin/UserManagement';
import BannerManagement from './src/pages/Admin/BannerManagement';
import BundleManagement from './src/pages/Admin/BundleManagement';
import Wishlist from './src/pages/Wishlist';
import ForgotPassword from './src/pages/ForgotPassword';
import ResetPassword from './src/pages/ResetPassword';
import Plans from './src/pages/Plans';
import Bundles from './src/pages/Bundles';
import BundleDetail from './src/pages/BundleDetail';
import { CartProvider } from './src/contexts/CartContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { WishlistProvider } from './src/contexts/WishlistContext';
import { Toaster } from './src/components/ui/sonner';
import { LoaderProvider } from './src/contexts/LoaderContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow pt-20">
      {children}
    </main>
    <Footer />
  </div>
);

import { useAuth } from './src/contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: 'ADMIN' | 'CUSTOMER' }> = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <LoaderProvider>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Layout><Home /></Layout>} />
                  <Route path="/about" element={<Layout><About /></Layout>} />
                  <Route path="/contact" element={<Layout><Contact /></Layout>} />
                  <Route path="/products" element={<Layout><ProductList /></Layout>} />
                  <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
                  <Route path="/plans" element={<Layout><Plans /></Layout>} />
                  <Route path="/bundles" element={<Layout><Bundles /></Layout>} />
                  <Route path="/bundle/:id" element={<Layout><BundleDetail /></Layout>} />
                  <Route path="/product/:id/review" element={<Layout><ProtectedRoute><AddReview /></ProtectedRoute></Layout>} />
                  <Route path="/cart" element={<Layout><Cart /></Layout>} />
                  <Route path="/checkout" element={<Layout><ProtectedRoute><Checkout /></ProtectedRoute></Layout>} />
                  <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
                  <Route path="/login" element={<Layout><Auth mode="login" /></Layout>} />
                  <Route path="/signup" element={<Layout><Auth mode="signup" /></Layout>} />
                  <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
                  <Route path="/reset-password/:token" element={<Layout><ResetPassword /></Layout>} />
                  <Route path="/wishlist" element={<Layout><ProtectedRoute><Wishlist /></ProtectedRoute></Layout>} />

                  {/* Admin routes */}
                  <Route path="/admin/login" element={<Layout><Auth mode="admin-login" /></Layout>} />
                  <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/products" element={<ProtectedRoute role="ADMIN"><ProductManagement /></ProtectedRoute>} />
                  <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><OrderManagement /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><UserManagement /></ProtectedRoute>} />
                  <Route path="/admin/banners" element={<ProtectedRoute role="ADMIN"><BannerManagement /></ProtectedRoute>} />
                  <Route path="/admin/bundles" element={<ProtectedRoute role="ADMIN"><BundleManagement /></ProtectedRoute>} />

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Router>
            </WishlistProvider>
          </CartProvider>
          <Toaster position="top-center" richColors />
        </StoreProvider>
      </AuthProvider>
    </LoaderProvider>

  );
};

export default App;