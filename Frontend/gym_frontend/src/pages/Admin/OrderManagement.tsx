import React, { useState } from 'react';
import { Search, Eye, ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_ORDERS } from '../../mockData.ts';

const OrderManagement: React.FC = () => {
  const [orders] = useState(MOCK_ORDERS);
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = filterStatus === 'All' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="min-h-screen bg-brand-warm flex">
      <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full space-y-10">
        <Link to="/admin" className="flex items-center gap-3 text-brand-matte/50 hover:text-brand font-black uppercase tracking-widest text-[10px] mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Terminal
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-brand-matte tracking-tighter uppercase">Deployment <span className="text-brand">Logs</span></h1>
            <p className="text-brand-matte/40 font-bold uppercase tracking-widest text-[10px]">Review transactions, shipping protocols, and logistics.</p>
          </div>
          <button className="bg-brand-matte text-white px-10 py-5 rounded-none font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:bg-brand transition flex items-center gap-3">
            <Download className="w-5 h-5 text-brand-gold" /> Export Log (CSV)
          </button>
        </div>

        <div className="bg-white border border-brand-matte/5 shadow-2xl overflow-hidden">
          <div className="p-10 border-b border-brand-matte/5 flex flex-col md:flex-row justify-between gap-6">
            <div className="flex gap-4">
              {['All', 'Pending', 'Shipped', 'Processing'].map(status => (
                <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition border ${filterStatus === status ? 'bg-brand text-white border-brand' : 'bg-white border-brand-matte/10 text-brand-matte/50 hover:bg-brand-warm'}`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-matte/30 w-5 h-5" />
              <input type="text" placeholder="Search protocol ID..." className="pl-16 pr-6 py-4 bg-brand-warm border border-brand-matte/10 outline-none focus:border-brand-gold/40 text-[11px] font-black uppercase tracking-widest text-brand-matte w-full md:w-80" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-warm">
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Protocol ID</th>
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Operative</th>
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Deploy Date</th>
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Valuation</th>
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em] text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-matte/5">
                {filtered.map(order => (
                  <tr key={order.id} className="group hover:bg-brand-warm transition">
                    <td className="px-10 py-8">
                      <span className="font-black text-brand-matte uppercase tracking-tight text-lg italic">{order.id}</span>
                    </td>
                    <td className="px-10 py-8">
                      <div>
                        <p className="font-black text-brand-matte uppercase text-sm tracking-widest">{order.customerName}</p>
                        <p className="text-[10px] text-brand-matte/40 font-bold uppercase">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-black text-brand-matte/60 uppercase tracking-widest">{order.date}</td>
                    <td className="px-10 py-8 font-black text-brand italic text-xl tracking-tighter">${order.total}</td>
                    <td className="px-10 py-8">
                      <span className={`inline-block px-4 py-1 text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'Shipped' ? 'bg-brand text-white shadow-lg' : 
                        order.status === 'Pending' ? 'bg-brand-matte text-brand-gold border border-brand-gold/30' : 'bg-brand-warm text-brand-matte/60 border border-brand-matte/10'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button className="p-3 text-brand-matte/30 hover:text-brand hover:bg-brand-matte transition">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderManagement;