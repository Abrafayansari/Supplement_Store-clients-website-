import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Filter, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddProductModal from './AddProductModal';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import NexusLoader from '../../components/NexusLoader';

const API_URL = import.meta.env.VITE_API_URL;

const ProductManagement: React.FC = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/getallproducts?limit=100`);
      setProducts(res.data.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await axios.delete(`${API_URL}/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message || "Product deleted");
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-brand-warm flex items-center justify-center">
        <NexusLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-warm text-brand-matte relative overflow-hidden font-sans">
      {/* Mesh Background Effect */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <main className="relative p-6 md:p-12 max-w-[1600px] mx-auto w-full space-y-16">
        {/* Header Section */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-8">
              <Link to="/admin" className="inline-flex items-center gap-3 text-brand-matte/40 hover:text-brand-gold font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-500" />
                Back to Dashboard
              </Link>
              <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] uppercase leading-[0.9]">
                Product <br />
                <span className="shine-gold italic font-brand">Inventory</span>
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em]">
                <span className="flex items-center gap-3 px-5 py-2.5 bg-white border border-brand-matte/5 text-brand-gold shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-glow" /> LIVE INVENTORY SYNCED
                </span>
                <span className="w-[1px] h-4 bg-brand-matte/10 hidden sm:block" />
                <span className="text-brand-matte/40">{products.length} TOTAL SKUs</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-brand text-white px-14 py-7 rounded-none font-black text-[12px] uppercase tracking-[0.4em] shadow-xl shadow-brand/20 hover:bg-brand-matte transition-all duration-500 flex items-center gap-4 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" /> Add New Asset
            </button>
          </div>
        </div>

        <div className="bg-white border border-brand-matte/5 shadow-2xl relative">
          <div className="p-8 border-b border-brand-matte/5 flex flex-col xl:flex-row gap-8 bg-brand-warm/30">
            <div className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-matte/20 group-focus-within:text-brand transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder="SEARCH INVENTORY..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-white border border-brand-matte/5 outline-none focus:border-brand-gold/40 text-[11px] font-black uppercase tracking-widest text-brand-matte shadow-sm placeholder:text-brand-matte/20"
              />
            </div>
            <button className="flex items-center justify-center gap-4 px-12 py-5 bg-white border border-brand-matte/5 font-black text-[11px] uppercase tracking-[0.2em] text-brand-matte hover:text-brand-gold transition-all shadow-sm">
              <Filter className="w-4 h-4" /> Filter Categories
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-warm/50">
                  <th className="px-10 py-8 text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.4em]">Product Detail</th>
                  <th className="px-10 py-8 text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.4em]">Grouping</th>
                  <th className="px-10 py-8 text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.4em]">Valuation</th>
                  <th className="px-10 py-8 text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.4em]">Availability</th>
                  <th className="px-10 py-8 text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.4em] text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-matte/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-matte/20">No matching assets found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map(product => (
                    <tr key={product.id} className="group hover:bg-brand-warm transition-all duration-500">
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-8">
                          <div className="w-20 h-20 bg-white border border-brand-matte/5 p-4 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
                            <img src={product.images?.[0] || '/placeholder.png'} alt={product.name} className="w-full h-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                          </div>
                          <div className="space-y-1">
                            <span className="font-black text-brand-matte uppercase tracking-tight text-xl leading-none group-hover:text-brand-gold transition-colors">{product.name}</span>
                            <p className="text-[9px] text-brand-matte/20 font-bold uppercase tracking-widest italic tracking-tighter">SKU: {product.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        <span
                          className="inline-block px-5 py-2 bg-brand-warm border border-brand-matte/5 text-brand-gold text-[9px] font-black uppercase tracking-widest shadow-sm max-w-[140px] truncate align-middle"
                          title={product.category}
                        >
                          {product.category}
                        </span>
                      </td>
                      <td className="px-10 py-10 font-black text-brand-gold text-2xl italic tracking-tighter tabular-nums">Rs. {product.price.toLocaleString()}</td>
                      <td className="px-10 py-10">
                        <div className="space-y-3 min-w-[140px]">
                          <div className="w-full max-w-[128px] bg-brand-matte/5 h-1.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${product.stock < 10 ? 'bg-brand' : 'bg-brand-gold'}`}
                              style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }} // 100 units = Full Bar for visual scale
                            ></div>
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${product.stock < 10 ? 'text-brand' : 'text-brand-matte/40'}`}>
                            <div className={`w-1 h-1 rounded-full ${product.stock < 10 ? 'bg-brand animate-pulse' : 'bg-brand-gold'}`} />
                            {product.stock} Units In Stock
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-10 text-right">
                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-4 text-brand-matte/30 border border-brand-matte/10 hover:text-brand-gold hover:bg-brand-gold/5 hover:border-brand-gold/20 transition-all duration-300"
                            title="Edit Asset"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-4 text-brand-matte/30 border border-brand-matte/10 hover:text-brand-gold hover:bg-brand hover:text-white hover:border-brand transition-all duration-300"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            fetchProducts();
          }}
          product={editingProduct}
        />
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
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(201, 162, 77, 0.5); opacity: 0.5; }
          50% { box-shadow: 0 0 15px rgba(201, 162, 77, 0.8); opacity: 1; }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductManagement;