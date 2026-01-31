import React, { useState, useEffect } from 'react';
import { Search, Eye, ArrowLeft, Download, RefreshCw, Package, Truck, CheckCircle, XCircle, Clock, Banknote, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'COD' | 'ONLINE';
  paymentStatus: string;
  receipt?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  adress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`${API_URL}/admin/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Order ${orderId} updated to ${newStatus}`);

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status.');
    }
  };

  const filtered = orders.filter(o => {
    const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PENDING': return { icon: <Clock className="w-3 h-3" />, class: 'bg-white text-brand-matte/40 border-brand-matte/10' };
      case 'PROCESSING': return { icon: <RefreshCw className="w-3 h-3 animate-spin" />, class: 'bg-brand-gold/10 text-brand-gold border-brand-gold/20' };
      case 'SHIPPED': return { icon: <Truck className="w-3 h-3" />, class: 'bg-brand/10 text-brand border-brand/20' };
      case 'DELIVERED': return { icon: <CheckCircle className="w-3 h-3" />, class: 'bg-brand-gold/20 text-brand-gold border-brand-gold/30 shadow-sm' };
      case 'CANCELLED': return { icon: <XCircle className="w-3 h-3" />, class: 'bg-red-50 text-red-500 border-red-100' };
      default: return { icon: null, class: 'bg-white text-brand-matte/40 border-brand-matte/10' };
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-brand-warm flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-t-2 border-brand-gold rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-b-2 border-brand rounded-full animate-spin-slow"></div>
            <Package className="absolute inset-0 m-auto w-8 h-8 text-brand-gold" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold">Accessing Data...</p>
            <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-brand-matte/20">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-warm text-brand-matte relative overflow-hidden">
      {/* Mesh Background Effect using brand colors */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <main className="relative p-6 md:p-12 max-w-[1600px] mx-auto w-full space-y-16">
        {/* Header Section */}
        <div className="space-y-10">
          <Link to="/admin" className="inline-flex items-center gap-3 text-white/30 hover:text-brand-gold font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-500" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] uppercase leading-[0.9]">
                Order <br />
                <span className="shine-gold italic font-brand">List</span>
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em]">
                <span className="flex items-center gap-3 px-5 py-2.5 bg-brand-warm border border-brand-gold/20 text-brand shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" /> SYSTEM ACTIVE
                </span>
                <span className="w-[1px] h-4 bg-brand-matte/10 hidden sm:block" />
                <span className="text-brand-matte/40">{orders.length} TOTAL ENTRIES</span>
              </div>
            </div>

            <button className="btn-luxury px-14 py-6 text-[11px] flex items-center gap-4 group">
              <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              Download List
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-8">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 bg-white border border-brand-matte/5 p-3 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${filterStatus === status
                    ? 'bg-brand text-white border-brand shadow-lg shadow-brand/10'
                    : 'bg-transparent border-brand-matte/5 text-brand-matte/30 hover:text-brand-gold hover:bg-brand-warm'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="relative group w-full xl:w-[400px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-matte/20 group-focus-within:text-brand-gold transition-colors w-4 h-4" />
              <input
                type="text"
                placeholder="SEARCH ORDER ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 pr-6 py-5 bg-brand-warm border border-brand-matte/5 outline-none focus:border-brand-gold/40 text-[10px] font-black uppercase tracking-[0.3em] text-brand-matte w-full transition-all duration-300 placeholder:text-brand-matte/10"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-brand-matte/5 shadow-2xl relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-warm border-b border-brand-matte/5">
                    <th className="px-10 py-8 text-[9px] font-black text-brand-matte/20 uppercase tracking-[0.5em]">Order ID</th>
                    <th className="px-10 py-8 text-[9px] font-black text-brand-matte/20 uppercase tracking-[0.5em]">Customer Details</th>
                    <th className="px-10 py-8 text-[9px] font-black text-brand-matte/20 uppercase tracking-[0.5em]">Total Price</th>
                    <th className="px-10 py-8 text-[9px] font-black text-brand-matte/20 uppercase tracking-[0.5em]">Order Date</th>
                    <th className="px-10 py-8 text-[9px] font-black text-brand-matte/20 uppercase tracking-[0.5em]">Status</th>
                    <th className="px-10 py-8 text-[9px] font-black text-brand-matte/20 uppercase tracking-[0.5em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-matte/5">
                  {filtered.map(order => {
                    const display = getStatusDisplay(order.status);
                    return (
                      <tr key={order.id} className="group hover:bg-brand-warm transition-all duration-500">
                        <td className="px-10 py-12">
                          <span className="font-black text-brand-matte/40 uppercase tracking-tighter text-sm italic group-hover:text-brand-gold transition-all duration-500">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-10 py-12">
                          <div className="space-y-1">
                            <p className="font-black text-brand-matte uppercase text-[11px] tracking-[0.1em]">{order.user.name}</p>
                            <p className="text-[9px] text-brand-matte/20 font-bold uppercase tracking-widest">{order.user.email}</p>
                          </div>
                        </td>
                        <td className="px-10 py-12 font-black text-brand-gold italic text-2xl tracking-tighter">
                          Rs. {order.total.toLocaleString()}
                        </td>
                        <td className="px-10 py-12 text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.1em]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-10 py-12">
                          <div className="flex flex-col gap-2">
                            <div className={`inline-flex items-center gap-3 px-5 py-2 border text-[9px] font-black uppercase tracking-[0.2em] transition-luxury ${display.class}`}>
                              {display.icon} {order.status}
                            </div>
                            <div className="flex items-center gap-2 px-4 text-[8px] font-black text-brand-matte/30 uppercase tracking-widest">
                              {order.paymentMethod === 'COD' ? <Banknote className="w-3 h-3" /> : <QrCode className="w-3 h-3 text-brand-gold" />}
                              {order.paymentMethod} • {order.paymentStatus}
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-12 text-right">
                          <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                            {[
                              { s: 'PROCESSING', icon: <RefreshCw className="w-3.5 h-3.5" />, tip: 'PROCESSING' },
                              { s: 'SHIPPED', icon: <Truck className="w-3.5 h-3.5" />, tip: 'SHIP' },
                              { s: 'DELIVERED', icon: <CheckCircle className="w-3.5 h-3.5" />, tip: 'DELIVER' },
                              { s: 'CANCELLED', icon: <XCircle className="w-3.5 h-3.5" />, tip: 'CANCEL' }
                            ].map(action => (
                              <button
                                key={action.s}
                                onClick={() => handleStatusUpdate(order.id, action.s)}
                                title={action.tip}
                                disabled={order.status === action.s}
                                className={`p-3 border transition-all duration-300 ${order.status === action.s
                                  ? 'bg-brand/10 border-brand/20 text-brand cursor-not-allowed'
                                  : 'bg-white border-brand-matte/10 text-brand-matte/40 hover:text-brand-gold hover:border-brand-gold hover:bg-brand-gold/5'
                                  }`}
                              >
                                {action.icon}
                              </button>
                            ))}
                            <div className="w-[1px] h-10 bg-brand-matte/5 mx-2" />
                            {order.receipt && (
                              <button
                                onClick={() => setSelectedReceipt(order.receipt!)}
                                className="p-3 bg-brand/10 border border-brand/20 text-brand hover:bg-brand hover:text-white transition-all duration-300 shadow-sm"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button className="p-3 bg-white border border-brand-matte/10 text-brand-matte/30 hover:text-brand-gold hover:border-brand-gold transition-all duration-500 shadow-sm">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="p-32 text-center space-y-6">
                  <Search className="w-12 h-12 text-brand-matte/5 mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-matte/10">No records found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative max-w-lg w-full bg-zinc-950 border border-white/10 p-1.5 shadow-2xl">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute -top-10 right-0 text-white/40 hover:text-brand-gold flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-colors"
            >
              <XCircle className="w-4 h-4" /> Close Receipt
            </button>
            <div className="aspect-square w-full overflow-hidden bg-black flex items-center justify-center border border-white/5">
              <img src={selectedReceipt} alt="Proof of payment" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="p-6 border-t border-white/5 flex flex-col gap-6">
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Payment Receipt</h4>
                <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest">Payment Proof uploaded by user</p>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="btn-luxury w-full py-4 text-[9px] tracking-[0.2em]">Close View</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .shine-gold {
          background: linear-gradient(90deg, #C9A24D, #FFF, #C9A24D);
          background-size: 200% auto;
          animation: gold-shine 5s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes gold-shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .btn-luxury {
          background-color: #7B0F17;
          color: white;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.15em;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        .btn-luxury:hover {
          background-color: #C9A24D;
          border-color: #FFF;
          box-shadow: 0 0 20px rgba(201, 162, 77, 0.4);
          transform: translateY(-2px);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default OrderManagement;