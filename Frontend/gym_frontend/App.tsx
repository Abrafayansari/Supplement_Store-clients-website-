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
import Cart from './src/pages/Cart';
import Checkout from './src/pages/Checkout';
import Profile from './src/pages/Profile';
import Auth from './src/pages/Auth';
import AdminDashboard from './src/pages/Admin/Dashboard';
import ProductManagement from './src/pages/Admin/ProductManagement';
import OrderManagement from './src/pages/Admin/OrderManagement';
import UserManagement from './src/pages/Admin/UserManagement';
import { CartProvider } from './src/contexts/CartContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { Toaster } from './src/components/ui/sonner';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow pt-20">
      {children}
    </main>
    <Footer />
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: 'User' | 'Admin' }> = ({ children, role }) => {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <CartProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/products" element={<Layout><ProductList /></Layout>} />
              <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />
              <Route path="/checkout" element={<Layout><ProtectedRoute><Checkout /></ProtectedRoute></Layout>} />
              <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
              <Route path="/login" element={<Layout><Auth mode="login" /></Layout>} />
              <Route path="/signup" element={<Layout><Auth mode="signup" /></Layout>} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<Layout><Auth mode="admin-login" /></Layout>} />
              <Route path="/admin" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute role="Admin"><ProductManagement /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute role="Admin"><OrderManagement /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute role="Admin"><UserManagement /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </AuthProvider>
      </CartProvider>
      <Toaster position="top-center" richColors />
    </StoreProvider>
  );
};

export default App;