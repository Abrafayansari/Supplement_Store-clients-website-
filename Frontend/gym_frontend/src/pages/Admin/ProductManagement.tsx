import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Filter, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../../mockData.ts';

const ProductManagement: React.FC = () => {
  const [products] = useState(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-brand-warm flex">
      <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full space-y-10">
        <Link to="/admin" className="flex items-center gap-3 text-brand-matte/50 hover:text-brand font-black uppercase tracking-widest text-[10px] mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Terminal
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-brand-matte tracking-tighter uppercase">Product <span className="text-brand">Archive</span></h1>
            <p className="text-brand-matte/40 font-bold uppercase tracking-widest text-[10px]">Manage catalog inventory and molecular metadata.</p>
          </div>
          <button className="bg-brand text-white px-10 py-5 rounded-none font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:bg-brand-matte transition flex items-center gap-3">
            <Plus className="w-5 h-5" /> Deploy New Compound
          </button>
        </div>

        <div className="bg-white border border-brand-matte/5 shadow-2xl overflow-hidden">
          <div className="p-10 border-b border-brand-matte/5 flex flex-col md:flex-row gap-6">
            <div className="relative flex-grow">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-matte/30 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Locate compounds..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-brand-warm border border-brand-matte/10 outline-none focus:border-brand-gold/40 text-[11px] font-black uppercase tracking-widest text-brand-matte" 
              />
            </div>
            <button className="flex items-center justify-center gap-3 px-10 py-5 bg-white border border-brand-matte/10 font-black text-[11px] uppercase tracking-widest text-brand-matte hover:bg-brand-warm transition">
              <Filter className="w-5 h-5 text-brand-gold" /> Filter Logic
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-warm">
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Compound</th>
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Series</th>
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Valuation</th>
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Stock Level</th>
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em] text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-matte/5">
                {filtered.map(product => (
                  <tr key={product.id} className="group hover:bg-brand-warm transition">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white border border-brand-matte/5 p-3 overflow-hidden shadow-sm">
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                        <span className="font-black text-brand-matte uppercase tracking-tight text-lg">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-4 py-1 bg-brand text-white text-[9px] font-black uppercase tracking-widest">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-10 py-8 font-black text-brand-matte text-xl italic tracking-tighter">${product.price}</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-24 bg-brand-matte/10 h-2 overflow-hidden">
                          <div 
                            className={`h-full ${product.stock < 10 ? 'bg-brand' : 'bg-brand-gold'}`} 
                            style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                          ></div>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock < 10 ? 'text-brand' : 'text-brand-matte/40'}`}>{product.stock} Units</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button className="p-3 text-brand-matte/30 hover:text-brand-gold hover:bg-brand-matte transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-3 text-brand-matte/30 hover:text-brand hover:bg-brand-matte transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

export default ProductManagement;