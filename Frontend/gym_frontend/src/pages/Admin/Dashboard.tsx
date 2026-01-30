import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users, ShoppingBag, DollarSign, TrendingUp,
  ArrowUpRight, ArrowDownRight, Package,
  Settings, LogOut, ChevronRight, Bell, X
} from 'lucide-react';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../../mockData.ts';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import NexusLoader from '../../components/NexusLoader';

const API_URL = import.meta.env.VITE_API_URL;

import logo from '../../assets/nexus_logo.jpg';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  orderId?: string;
  isRead: boolean;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const { token } = useAuth();

  const [dashboardData, setDashboardData] = React.useState<{
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
  } | null>(null);
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await axios.delete(`${API_URL}/admin/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete(`${API_URL}/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  React.useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
          axios.get(`${API_URL}/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/admin/orders`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (statsRes.data.success) {
          setDashboardData(statsRes.data.data);
        }
        if (ordersRes.data.orders) {
          setRecentOrders(ordersRes.data.orders.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
      fetchNotifications();
    }
  }, [token]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-white/5 text-white/40 border-white/5';
      case 'PROCESSING': return 'bg-brand/10 text-brand border-brand/20';
      case 'SHIPPED': return 'bg-brand-gold/10 text-brand-gold border-brand-gold/20';
      case 'DELIVERED': return 'bg-brand text-white border-brand shadow-[0_0_15px_rgba(123,15,23,0.3)]';
      case 'CANCELLED': return 'bg-red-900/20 text-red-500 border-red-900/30';
      default: return 'bg-zinc-800 text-zinc-400';
    }
  };

  const stats = [
    {
      label: 'Monthly Revenue',
      value: loading ? '...' : `$${dashboardData?.totalRevenue?.toLocaleString() || '0'}`,
      trend: '+12.5%',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'brand'
    },
    {
      label: 'Package Dispatches',
      value: loading ? '...' : dashboardData?.totalOrders?.toString() || '0',
      trend: '+18.2%',
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'brand'
    },
    {
      label: 'Active Operatives',
      value: loading ? '...' : dashboardData?.totalUsers?.toString() || '0',
      trend: '-2.4%',
      icon: <Users className="w-6 h-6" />,
      color: 'zinc'
    },
    {
      label: 'Conversion Matrix',
      value: '3.42%',
      trend: '+4.1%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'brand'
    },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex font-sans">
      <aside className="w-72 bg-black border-r border-white/10 hidden xl:flex flex-col p-8 space-y-12 backdrop-blur-3xl sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-4 group">
          <img src={logo} alt="Nexus Logo" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter uppercase leading-none">NEXUS</span>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">ADMIN CONTROLS</span>
          </div>
        </Link>

        <nav className="flex-grow space-y-4">
          {[
            { icon: <TrendingUp className="w-5 h-5" />, label: 'Overview', active: true, to: '/admin' },
            { icon: <Package className="w-5 h-5" />, label: 'Products', to: '/admin/products' },
            { icon: <ShoppingBag className="w-5 h-5" />, label: 'Orders', to: '/admin/orders' },
            { icon: <Users className="w-5 h-5" />, label: 'Users', to: '/admin/users' },
            { icon: <TrendingUp className="w-5 h-5" />, label: 'Banners', to: '/admin/banners' }, // Using TrendingUp as a placeholder icon for Banners
            { icon: <Settings className="w-5 h-5" />, label: 'Settings', to: '#' },
          ].map(item => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-4 px-6 py-4 rounded-none text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${item.active ? 'bg-brand text-white shadow-[0_10px_30px_rgba(123,15,23,0.3)]' : 'text-white/30 hover:text-brand-gold hover:bg-white/5'}`}
            >
              <div className={item.active ? 'scale-110' : ''}>{item.icon}</div>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/10 space-y-6">
          <div className="flex items-center gap-4 px-4">
            <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center font-black text-brand-gold text-lg italic">A</div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-widest">Ops Admin</p>
              <p className="text-[9px] font-bold text-brand-gold/60 uppercase tracking-[0.25em]">Master Protocol</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-brand border border-brand/20 hover:bg-brand hover:text-white transition-all duration-500">
            <LogOut className="w-4 h-4 text-brand-gold" /> Termination Sequence
          </button>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-12 space-y-12 max-w-[1600px] mx-auto w-full relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-[-0.05em] uppercase leading-none">Telemetry <span className="shine-gold italic">Matrix</span></h1>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand animate-pulse" /> SYNCED</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span>STABLE CONNECTION</span>
            </div>
          </div>
          <div className="flex gap-4">
            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="bg-white/5 p-4 border border-white/10 relative hover:border-brand-gold transition-colors"
              >
                <Bell className="w-6 h-6 text-white/40" />
                {notifications.length > 0 && (
                  <span className="absolute top-3 right-3 min-w-[18px] h-[18px] bg-brand rounded-full flex items-center justify-center text-[9px] font-black text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-[380px] bg-black border border-white/10 shadow-2xl z-50">
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Notifications</h4>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[9px] font-black text-brand-gold hover:text-white uppercase tracking-widest transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-white/10 mx-auto mb-3" />
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-brand/20 text-brand text-[8px] font-black uppercase tracking-wider">
                                  {notification.type.replace('_', ' ')}
                                </span>
                                <span className="text-[8px] font-bold text-white/20">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <h5 className="text-xs font-black text-white mb-1">{notification.title}</h5>
                              <p className="text-[10px] text-white/50">{notification.message}</p>
                              {notification.orderId && (
                                <Link
                                  to="/admin/orders"
                                  className="inline-block mt-2 text-[9px] font-black text-brand-gold hover:text-white uppercase tracking-widest transition-colors"
                                  onClick={() => {
                                    deleteNotification(notification.id);
                                    setShowNotifications(false);
                                  }}
                                >
                                  View Order →
                                </Link>
                              )}
                            </div>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-white/20 hover:text-brand transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="btn-luxury px-10 py-5 text-[10px]">
              Archive Report
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-grow flex items-center justify-center min-h-[500px]">
            <NexusLoader />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {stats.map(stat => (
                <div key={stat.label} className="bg-white/[0.03] p-10 border border-white/5 shadow-2xl space-y-6 group hover:border-brand-gold/30 transition-all duration-500">
                  <div className="w-14 h-14 bg-black border border-white/10 text-brand-gold rounded-none flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    {stat.icon}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{stat.label}</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-white tracking-tighter">{stat.value}</span>
                      <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-brand' : 'text-white/20'} flex items-center gap-1`}>
                        {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
              <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 shadow-2xl p-10 space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Live Dispatches</h3>
                  <Link to="/admin/orders" className="text-[10px] font-black text-brand-gold flex items-center gap-2 hover:text-white transition-all duration-300 uppercase tracking-widest group">
                    Full Log <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="pb-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Protocol ID</th>
                        <th className="pb-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Operative</th>
                        <th className="pb-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] text-right">Valuation</th>
                        <th className="pb-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] text-right">Vector</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {(recentOrders.length > 0 ? recentOrders : []).map(order => (
                        <tr key={order.id} className="group hover:bg-white/[0.02] transition-all duration-500">
                          <td className="py-6 font-black text-white/60 text-sm tracking-tighter group-hover:text-brand-gold transition-colors italic">#{order.id.slice(0, 8)}</td>
                          <td className="py-6 text-xs font-black text-white uppercase tracking-widest">{order.user.name}</td>
                          <td className="py-6 text-sm font-black text-brand-gold text-right italic">${order.total}</td>
                          <td className="py-6 text-right">
                            <span className={`inline-block px-4 py-1.5 border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 shadow-2xl p-10 space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand/10 transition-colors" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter relative z-10">Elite Assets</h3>
                <div className="space-y-8 relative z-10">
                  {MOCK_PRODUCTS.slice(0, 3).map(product => (
                    <div key={product.id} className="flex items-center gap-6 group/item hover:translate-x-2 transition-transform duration-500">
                      <div className="w-16 h-16 bg-black flex items-center justify-center p-3 border border-white/10 group-hover/item:border-brand-gold/30 transition-colors">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain grayscale group-hover/item:grayscale-0 transition-all duration-500" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-black text-white uppercase truncate tracking-widest">{product.name}</h4>
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Active Inventory</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-brand-gold italic">$4.5k</p>
                        <p className="text-[9px] text-brand font-black">+12%</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-5 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-brand-gold hover:border-brand-gold transition-all duration-500 relative z-10">
                  In-Depth Logistics
                </button>
              </div>
            </div>
          </>
        )}
      </main>

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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0E0E0E;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #7B0F17;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #C9A24D;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;