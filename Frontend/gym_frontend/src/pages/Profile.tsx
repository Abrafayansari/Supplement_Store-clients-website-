import React from 'react';
import { User, Package, LogOut, ChevronRight, Calendar, Shield } from 'lucide-react';
import { useStore } from '../StoreContext.tsx';
import { MOCK_ORDERS } from '../mockData.ts';

const Profile: React.FC = () => {
  const { user, logout } = useStore();

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-brand-warm">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        <aside className="lg:col-span-1 space-y-8">
          <div className="bg-brand-matte p-10 text-center space-y-6 border border-brand-gold/20 shadow-2xl">
            <div className="w-24 h-24 bg-brand text-white mx-auto flex items-center justify-center text-3xl font-black border-2 border-brand-gold">
              {user.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{user.name}</h2>
              <p className="text-brand-gold text-[10px] font-bold uppercase tracking-widest">{user.role} Status</p>
            </div>
          </div>

          <nav className="bg-white border border-black/5 shadow-xl overflow-hidden">
            {[
              { icon: <User className="w-5 h-5" />, label: 'Profile Intelligence', active: true },
              { icon: <Package className="w-5 h-5" />, label: 'Order Archive' },
              { icon: <Shield className="w-5 h-5" />, label: 'Security Protocols' },
            ].map(item => (
              <button 
                key={item.label}
                className={`w-full flex items-center justify-between px-8 py-6 text-[10px] font-black uppercase tracking-widest transition-luxury ${item.active ? 'bg-brand text-white' : 'text-brand-matte hover:bg-brand-matte/5'}`}
              >
                <div className="flex items-center gap-4">
                  {item.icon} {item.label}
                </div>
                {!item.active && <ChevronRight className="w-4 h-4 opacity-30" />}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Calendar className="w-5 h-5 text-brand" />, label: 'Operative Since', value: 'OCT 2023' },
              { icon: <Package className="w-5 h-5 text-brand" />, label: 'Total Deployments', value: MOCK_ORDERS.length.toString() },
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">Full Operative Name</label>
                <input readOnly value={user.name} className="w-full bg-brand-warm border border-black/5 p-5 text-[12px] font-black uppercase tracking-widest outline-none focus:border-brand-gold transition-luxury" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-widest">Digital Address</label>
                <input readOnly value={user.email} className="w-full bg-brand-warm border border-black/5 p-5 text-[12px] font-black uppercase tracking-widest outline-none focus:border-brand-gold transition-luxury" />
              </div>
            </div>
            <button className="btn-luxury px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em]">Update Credentials</button>
          </section>

          <section className="space-y-8">
            <h3 className="text-3xl font-black text-brand-matte uppercase tracking-tighter">Recent Order Deployments</h3>
            <div className="space-y-4">
              {MOCK_ORDERS.map(order => (
                <div key={order.id} className="bg-white p-10 border border-black/5 flex flex-col md:flex-row justify-between gap-10 hover:border-brand-gold/30 transition-luxury">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-black text-brand-matte tracking-tighter">{order.id}</span>
                      <span className={`px-4 py-1 text-[8px] font-black uppercase tracking-widest ${
                        order.status === 'Shipped' ? 'bg-brand text-white' : 'bg-brand-matte text-brand-gold'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-brand-matte/40">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {order.date}</div>
                      <div className="flex items-center gap-2"><Package className="w-4 h-4" /> {order.items.length} Units</div>
                    </div>
                  </div>
                  <div className="flex md:flex-col items-end justify-between">
                    <p className="text-3xl font-black text-brand italic tracking-tighter">${order.total}</p>
                    <button className="text-brand-gold font-black uppercase text-[10px] tracking-widest hover:text-brand transition-luxury underline">Archive Log</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;