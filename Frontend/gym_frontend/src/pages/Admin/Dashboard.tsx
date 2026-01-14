import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, ShoppingBag, DollarSign, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Package, 
  Settings, LogOut, ChevronRight, Bell
} from 'lucide-react';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../../mockData.ts';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Revenue', value: '$24,490', trend: '+12.5%', icon: <DollarSign className="w-6 h-6" />, color: 'brand' },
    { label: 'Total Orders', value: '1,284', trend: '+18.2%', icon: <ShoppingBag className="w-6 h-6" />, color: 'brand' },
    { label: 'Active Users', value: '4,562', trend: '-2.4%', icon: <Users className="w-6 h-6" />, color: 'zinc' },
    { label: 'Conversion Rate', value: '3.42%', trend: '+4.1%', icon: <TrendingUp className="w-6 h-6" />, color: 'brand' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-72 bg-zinc-950 border-r border-zinc-800 hidden xl:flex flex-col p-8 space-y-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-black text-xl">P</div>
          <span className="text-xl font-bold text-white tracking-tight uppercase">PureVigor <span className="text-brand italic font-light">Admin</span></span>
        </Link>

        <nav className="flex-grow space-y-2">
          {[
            { icon: <TrendingUp className="w-5 h-5" />, label: 'Overview', active: true, to: '/admin' },
            { icon: <Package className="w-5 h-5" />, label: 'Products', to: '/admin/products' },
            { icon: <ShoppingBag className="w-5 h-5" />, label: 'Orders', to: '/admin/orders' },
            { icon: <Users className="w-5 h-5" />, label: 'Users', to: '/admin/users' },
            { icon: <Settings className="w-5 h-5" />, label: 'Settings', to: '#' },
          ].map(item => (
            <Link 
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${item.active ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-zinc-500 hover:bg-zinc-900 hover:text-brand'}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-zinc-900 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-500">A</div>
            <div>
              <p className="text-sm font-bold text-white">Ops Commander</p>
              <p className="text-xs text-zinc-600">Master Level</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-brand hover:bg-brand/10 rounded-xl transition">
            <LogOut className="w-5 h-5" /> Logout Terminal
          </button>
        </div>
      </aside>

      <main className="flex-grow p-4 md:p-10 space-y-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">System <span className="text-brand">Telemetry</span></h1>
            <p className="text-zinc-500 font-medium">Real-time performance metrics and insights.</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 shadow-sm relative">
              <Bell className="w-6 h-6 text-zinc-400" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-brand rounded-full border-2 border-black"></span>
            </button>
            <button className="bg-brand text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-white hover:text-black transition">
              Export Archive
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-zinc-900 p-8 rounded-[32px] border border-zinc-800 shadow-sm space-y-4">
              <div className={`w-12 h-12 bg-black border border-zinc-800 text-brand rounded-2xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-end gap-3">
                  <span className="text-2xl font-black text-white">{stat.value}</span>
                  <span className={`text-xs font-bold mb-1 ${stat.trend.startsWith('+') ? 'text-brand' : 'text-zinc-600'} flex items-center gap-0.5`}>
                    {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-zinc-900 rounded-[40px] border border-zinc-800 shadow-sm p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Recent Transactions</h3>
              <Link to="/admin/orders" className="text-sm font-bold text-brand flex items-center gap-1 hover:text-white transition">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="pb-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">Protocol ID</th>
                    <th className="pb-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">Operative</th>
                    <th className="pb-4 text-xs font-bold text-zinc-600 uppercase tracking-widest text-right">Value</th>
                    <th className="pb-4 text-xs font-bold text-zinc-600 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {MOCK_ORDERS.map(order => (
                    <tr key={order.id} className="group hover:bg-black transition">
                      <td className="py-4 font-bold text-white text-sm">{order.id}</td>
                      <td className="py-4 text-sm font-medium text-zinc-400">{order.customerName}</td>
                      <td className="py-4 text-sm font-black text-brand text-right">${order.total}</td>
                      <td className="py-4 text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'Shipped' ? 'bg-brand/20 text-brand' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-[40px] border border-zinc-800 shadow-sm p-8 space-y-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Top Formulae</h3>
            <div className="space-y-6">
              {MOCK_PRODUCTS.slice(0, 3).map(product => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-black rounded-xl p-2 shrink-0 border border-zinc-800">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain grayscale" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                    <p className="text-xs text-zinc-600 font-medium">84 units dispatched</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-brand">$4.5k</p>
                    <p className="text-[10px] text-white font-bold">+12%</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-black border border-zinc-800 rounded-2xl font-bold text-zinc-500 hover:text-brand transition text-sm">
              Inventory Analytics
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;