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
      case 'PENDING': return 'bg-white text-brand-matte/40 border-brand-matte/10';
      case 'PROCESSING': return 'bg-brand/10 text-brand border-brand/20';
      case 'SHIPPED': return 'bg-brand-gold/10 text-brand-gold border-brand-gold/20';
      case 'DELIVERED': return 'bg-brand text-white border-brand shadow-[0_5px_15px_rgba(123,15,23,0.15)]';
      case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  const stats = [
    {
      label: 'Monthly Revenue',
      value: loading ? '...' : `Rs. ${dashboardData?.totalRevenue?.toLocaleString() || '0'}`,
      trend: '+12.5%',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'brand'
    },
    {
      label: 'Orders',
      value: loading ? '...' : dashboardData?.totalOrders?.toString() || '0',
      trend: '+18.2%',
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'brand'
    },
    {
      label: 'Total Customers',
      value: loading ? '...' : dashboardData?.totalUsers?.toString() || '0',
      trend: '-2.4%',
      icon: <Users className="w-6 h-6" />,
      color: 'zinc'
    },
    // {
    //   label: 'Conversion Rate',
    //   value: '3.42%',
    //   trend: '+4.1%',
    //   icon: <TrendingUp className="w-6 h-6" />,
    //   color: 'brand'
    // },
  ];

  return (
    <div className="min-h-screen bg-brand-warm text-brand-matte flex font-sans">
      <aside className="w-72 bg-white border-r border-brand-matte/5 hidden xl:flex flex-col p-8 space-y-12 backdrop-blur-3xl sticky top-0 h-screen shadow-sm">
        <Link to="/" className="flex items-center gap-4 group">
          <img src={logo} alt="Nexus Logo" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-black text-brand-matte tracking-tighter uppercase leading-none">NEXUS</span>
            <span className="text-[10px] font-bold text-brand-matte/20 uppercase tracking-[0.4em]">Management</span>
          </div>
        </Link>

        <nav className="flex-grow space-y-4">
          {[
            { icon: <TrendingUp className="w-5 h-5" />, label: 'Overview', active: true, to: '/admin' },
            { icon: <Package className="w-5 h-5" />, label: 'Products', to: '/admin/products' },
            { icon: <ShoppingBag className="w-5 h-5" />, label: 'Orders', to: '/admin/orders' },
            { icon: <Users className="w-5 h-5" />, label: 'Users', to: '/admin/users' },
            { icon: <Package className="w-5 h-5" />, label: 'Bundles', to: '/admin/bundles' },
            { icon: <TrendingUp className="w-5 h-5" />, label: 'Banners', to: '/admin/banners' },
            { icon: <Settings className="w-5 h-5" />, label: 'Settings', to: '#' },
          ].map(item => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-4 px-6 py-4 rounded-none text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${item.active ? 'bg-brand text-white shadow-lg shadow-brand/10' : 'text-brand-matte/40 hover:text-brand-gold hover:bg-brand-warm'}`}
            >
              <div className={item.active ? 'scale-110' : ''}>{item.icon}</div>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-brand-matte/5 space-y-6">
          <div className="flex items-center gap-4 px-4">
            <div className="w-12 h-12 bg-white border border-brand-matte/10 flex items-center justify-center font-black text-brand-gold text-lg italic shadow-sm">A</div>
            <div>
              <p className="text-xs font-black text-brand-matte uppercase tracking-widest">Admin</p>
              <p className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.25em]">Verified</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-brand border border-brand/20 hover:bg-brand hover:text-white transition-all duration-500">
            <LogOut className="w-4 h-4 text-brand-gold" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-12 space-y-12 max-w-[1600px] mx-auto w-full relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-50">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-brand-matte tracking-[-0.05em] uppercase leading-none">Admin <span className="shine-gold italic font-brand">Console</span></h1>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-brand-matte/20">
              <span className="flex items-center gap-2 text-brand"><div className="w-2 h-2 rounded-full bg-brand animate-pulse" /> SYSTEM ACTIVE</span>
              <span className="w-1 h-1 rounded-full bg-brand-matte/10" />
              <span>STABLE</span>
            </div>
          </div>
          <div className="flex gap-4">
            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="bg-white p-4 border border-brand-matte/5 relative hover:border-brand-gold transition-colors shadow-sm"
              >
                <Bell className="w-6 h-6 text-brand-matte/20" />
                {notifications.length > 0 && (
                  <span className="absolute top-3 right-3 min-w-[18px] h-[18px] bg-brand rounded-full flex items-center justify-center text-[9px] font-black text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-[380px] bg-white border border-brand-matte/10 shadow-2xl z-[9999]">
                  <div className="flex items-center justify-between p-4 border-b border-brand-matte/5">
                    <h4 className="text-xs font-black text-brand-matte uppercase tracking-widest">Alerts</h4>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[9px] font-black text-brand-gold hover:text-brand uppercase tracking-widest transition-colors"
                      >
                        Dismiss All
                      </button>
                    )}
                  </div>

                  <div className="max-h-[400px] z-10 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center bg-brand-warm/50">
                        <Bell className="w-8 h-8 text-brand-matte/5 mx-auto mb-3" />
                        <p className="text-[10px] font-black text-brand-matte/20 uppercase tracking-widest">No Alerts</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-5 border-b border-brand-matte/5 hover:bg-brand-warm/80 transition-all duration-300 relative group border-l-2 border-l-transparent hover:border-l-brand"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 text-[7px] font-black uppercase tracking-wider rounded-none ${notification.type === 'new_order' ? 'bg-brand text-white' : 'bg-brand-gold/10 text-brand-gold'
                                  }`}>
                                  {notification.type.replace('_', ' ')}
                                </span>
                                <span className="text-[8px] font-bold text-brand-matte/30 tabular-nums">
                                  {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <h5 className="text-[11px] font-black text-brand-matte mb-1 leading-tight">{notification.title}</h5>
                              <p className="text-[10px] text-brand-matte/50 leading-relaxed mb-3">{notification.message}</p>
                              {notification.orderId && (
                                <Link
                                  to="/admin/orders"
                                  className="inline-flex items-center gap-2 py-2 px-3 bg-brand-matte/5 text-[9px] font-black text-brand-gold hover:bg-brand-gold hover:text-white uppercase tracking-widest transition-all"
                                  onClick={() => {
                                    deleteNotification(notification.id);
                                    setShowNotifications(false);
                                  }}
                                >
                                  Take Action <ArrowUpRight className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="shrink-0 w-8 h-8 flex items-center justify-center bg-brand-warm border border-brand-matte/5 text-brand-matte/30 hover:text-white hover:bg-brand hover:border-brand transition-all duration-300"
                              title="Dismiss Alert"
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
                <div key={stat.label} className="bg-white p-10 border border-brand-matte/5 shadow-sm space-y-6 group hover:border-brand-gold/30 transition-all duration-500">
                  <div className="w-14 h-14 bg-brand-warm border border-brand-matte/5 text-brand-gold rounded-none flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-sm">
                    {stat.icon}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.3em]">{stat.label}</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-brand-matte tracking-tighter">{stat.value}</span>
                      <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-brand' : 'text-brand-matte/20'} flex items-center gap-1`}>
                        {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-10 relative z-10">
              <div className="bg-white border border-brand-matte/5 shadow-sm p-10 space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-brand-matte uppercase tracking-tighter italic">Recent Orders</h3>
                  <Link to="/admin/orders" className="text-[10px] font-black text-brand-gold flex items-center gap-2 hover:text-brand transition-all duration-300 uppercase tracking-widest group">
                    View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-brand-matte/5">
                        <th className="pb-6 text-[9px] font-black text-brand-matte/20 uppercase tracking-[0.4em]">Order ID</th>
                        <th className="pb-6 text-[9px] font-black text-brand-matte/20 uppercase tracking-[0.4em]">Customer</th>
                        <th className="pb-6 text-[9px] font-black text-brand-matte/20 uppercase tracking-[0.4em] text-right">Order Total</th>
                        <th className="pb-6 text-[9px] font-black text-brand-matte/20 uppercase tracking-[0.4em] text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-matte/5">
                      {(recentOrders.length > 0 ? recentOrders : []).map(order => (
                        <tr key={order.id} className="group hover:bg-brand-warm transition-all duration-500">
                          <td className="py-6 font-black text-brand-matte/60 text-sm tracking-tighter group-hover:text-brand-gold transition-colors italic">#{order.id.slice(0, 8)}</td>
                          <td className="py-6 text-[10px] font-black text-brand-matte uppercase tracking-widest">{order.user.name}</td>
                          <td className="py-6 text-sm font-black text-brand-gold text-right italic">Rs. {order.total}</td>
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