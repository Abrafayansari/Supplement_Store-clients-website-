import React, { useEffect, useState } from 'react';
import { User, Package, LogOut, ChevronRight, Calendar, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.REACT_APP_API_URL;

const Profile: React.FC = () => {
  const { user, logout, token, updateProfile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'security'>('profile');

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateProfile(name, email);
      toast.success('Profile Intelligence Updated Successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update credentials');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-brand-warm">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        <aside className="lg:col-span-1 space-y-8">
          <div className="bg-brand-matte p-10 text-center space-y-6 border border-brand-gold/20 shadow-2xl">
            <div className="w-24 h-24 bg-brand text-white mx-auto flex items-center justify-center text-3xl font-black border-2 border-brand-gold">
              {user.name ? user.name.charAt(0) : '?'}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{user.name}</h2>
              <p className="text-brand-gold text-[10px] font-bold uppercase tracking-widest">{user.role} Status</p>
            </div>
          </div>

          <nav className="bg-white border border-black/5 shadow-xl overflow-hidden">
            {[
              { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Profile Intelligence' },
              { id: 'orders', icon: <Package className="w-5 h-5" />, label: 'Order Archive' },
              { id: 'security', icon: <Shield className="w-5 h-5" />, label: 'Security Protocols' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-8 py-6 text-[10px] font-black uppercase tracking-widest transition-luxury ${activeTab === item.id ? 'bg-brand text-white' : 'text-brand-matte hover:bg-brand-matte/5'}`}
              >
                <div className="flex items-center gap-4">
                  {item.icon} {item.label}
                </div>
                {activeTab !== item.id && <ChevronRight className="w-4 h-4 opacity-30" />}
              </button>
            ))}
            <button
              onClick={logout}
              className="w-full flex items-center gap-4 px-8 py-6 text-[10px] font-black uppercase tracking-widest text-brand hover:bg-brand-matte hover:text-white transition-luxury border-t border-black/5"
            >
              <LogOut className="w-5 h-5" /> End Session
            </button>
          </nav>
        </aside>

        <div className="lg:col-span-3 space-y-12">
          {activeTab === 'profile' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                {[
                  { icon: <Calendar className="w-5 h-5 text-brand" />, label: 'Operative Since', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'OCT 2023' },
                  { icon: <Package className="w-5 h-5 text-brand" />, label: 'Total Deployments', value: orders.length.toString() },
                  { icon: <Shield className="w-5 h-5 text-brand" />, label: 'Clearance', value: 'AUTHORIZED' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 border border-black/5 flex items-center gap-6 shadow-sm">
                    <div className="w-14 h-14 bg-brand-matte text-brand-gold flex items-center justify-center shrink-0">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em]">{stat.label}</p>
                      <p className="text-xl font-black text-brand-matte tracking-tighter">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <section className="bg-white p-12 border border-black/5 shadow-sm space-y-12">
                <h3 className="text-3xl font-black text-brand-matte uppercase tracking-tighter">Account Intelligence</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">Full Operative Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-brand-warm border border-black/5 p-5 text-[12px] font-black uppercase tracking-widest outline-none focus:border-brand-gold transition-luxury"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">Digital Address</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-warm border border-black/5 p-5 text-[12px] font-black uppercase tracking-widest outline-none focus:border-brand-gold transition-luxury"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={updating}
                    className="btn-luxury px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-2"
                  >
                    {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Credentials
                  </button>
                </form>
              </section>
            </>
          )}

          {activeTab === 'orders' && (
            <section className="space-y-8">
              <h3 className="text-3xl font-black text-brand-matte uppercase tracking-tighter">Current Order Deployments</h3>
              <div className="space-y-6">
                {loadingOrders ? (
                  <div className="p-20 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-brand mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Syncing Deployment Data...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-20 text-center bg-white border border-black/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">No Order Logs Found in Archive</p>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-white border border-black/5 flex flex-col hover:border-brand-gold/50 transition-luxury group shadow-lg">
                      <div className="p-10 flex flex-col md:flex-row justify-between gap-10">
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-black text-brand-matte tracking-tighter">ORD-{order.id.slice(0, 8)}</span>
                            <span className={`px-4 py-1 text-[9px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-green-600 text-white' : order.status === 'SHIPPED' ? 'bg-brand text-white' : 'bg-brand-matte text-brand-gold'
                              }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-brand-matte/40">
                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(order.createdAt).toLocaleDateString()}</div>
                            <div className="flex items-center gap-2"><Package className="w-4 h-4" /> {order.items?.length || 0} Units</div>
                          </div>
                        </div>
                        <div className="flex md:flex-col items-end justify-between">
                          <p className="text-3xl font-black text-brand italic tracking-tighter">${order.total}</p>
                          <button className="text-brand-gold font-black uppercase text-[10px] tracking-widest hover:text-brand transition-luxury underline decoration-2 underline-offset-4">View Intelligence Log</button>
                        </div>
                      </div>

                      {/* Tracking Visualizer */}
                      <div className="px-10 pb-10 border-t border-black/5 pt-10 bg-brand-warm/30">
                        <p className="text-[10px] font-black text-brand-matte uppercase tracking-widest mb-8 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-brand-gold" /> Logistics Tracking Status
                        </p>
                        <div className="relative">
                          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black/5 -translate-y-1/2"></div>
                          <div className="absolute top-1/2 left-0 h-0.5 bg-brand-gold -translate-y-1/2 transition-all duration-1000" style={{ width: order.status === 'SHIPPED' ? '66%' : order.status === 'DELIVERED' ? '100%' : '33%' }}></div>

                          <div className="relative flex justify-between">
                            {[
                              { label: 'Manifested', completed: true },
                              { label: 'In Transit', completed: order.status === 'SHIPPED' || order.status === 'DELIVERED' },
                              { label: 'Deployed', completed: order.status === 'DELIVERED' }
                            ].map((step, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 transition-luxury ${step.completed ? 'bg-brand-gold border-brand-gold' : 'bg-white border-black/10'}`}></div>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${step.completed ? 'text-brand-matte' : 'text-brand-matte/30'}`}>{step.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                          <button className="btn-luxury px-6 py-3 text-[9px] font-black uppercase tracking-widest border border-brand-gold/30 hover:bg-brand-gold hover:text-white transition-luxury">
                            Live Tracking Feed
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {activeTab === 'security' && (
            <section className="bg-white p-12 border border-black/5 shadow-sm space-y-12">
              <h3 className="text-3xl font-black text-brand-matte uppercase tracking-tighter">Security Protocols</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Secure credential management coming soon.</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;