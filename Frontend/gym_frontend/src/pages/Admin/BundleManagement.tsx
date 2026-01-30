import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Filter, ArrowLeft, Loader2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddBundleModal from './AddBundleModal';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const BundleManagement: React.FC = () => {
    const { token } = useAuth();
    const [bundles, setBundles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBundle, setEditingBundle] = useState<any>(null);

    const fetchBundles = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/bundles`);
            setBundles(res.data);
        } catch (err) {
            console.error('Failed to fetch bundles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBundles();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to decommission this strategic bundle?")) return;
        try {
            const res = await axios.delete(`${API_URL}/admin/bundles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(res.data.message);
            fetchBundles();
        } catch (err) {
            console.error('Failed to delete bundle:', err);
            alert('Failed to delete bundle');
        }
    };

    const handleEdit = (bundle: any) => {
        setEditingBundle(bundle);
        setIsModalOpen(true);
    };

    const filtered = bundles.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="min-h-screen bg-brand-warm flex">
            <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full space-y-10">
                <Link to="/admin" className="flex items-center gap-3 text-brand-matte/50 hover:text-brand font-black uppercase tracking-widest text-[10px] mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Terminal
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-brand-matte tracking-tighter uppercase">Bundle <span className="text-brand">Strategy</span></h1>
                        <p className="text-brand-matte/40 font-bold uppercase tracking-widest text-[10px]">Architect and manage multi-compound value stacks.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-black text-white px-10 py-5 rounded-none font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:bg-brand transition flex items-center gap-3"
                    >
                        <Plus className="w-5 h-5" /> Deploy New Bundle
                    </button>
                </div>

                <div className="bg-white border border-brand-matte/5 shadow-2xl overflow-hidden">
                    <div className="p-10 border-b border-brand-matte/5 flex flex-col md:flex-row gap-6">
                        <div className="relative flex-grow">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-matte/30 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Locate bundles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-16 pr-6 py-5 bg-brand-warm border border-brand-matte/10 outline-none focus:border-brand-gold/40 text-[11px] font-black uppercase tracking-widest text-brand-matte"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-brand-warm">
                                    <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Bundle Protocol</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Contents</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Valuation</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em] text-right">Ops</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-matte/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 className="w-10 h-10 text-brand animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-matte/40">Synchronizing Bundle Archives...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-matte/40">No strategic records found.</span>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(bundle => (
                                        <tr key={bundle.id} className="group hover:bg-brand-warm transition">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-20 h-20 bg-white border border-brand-matte/5 p-2 overflow-hidden shadow-sm">
                                                        <img src={bundle.image || '/placeholder.png'} alt={bundle.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                                                    </div>
                                                    <div>
                                                        <span className="font-black text-brand-matte uppercase tracking-tight text-lg block">{bundle.name}</span>
                                                        <span className="text-[9px] font-bold text-brand-matte/30 uppercase tracking-[0.2em]">{bundle.id.slice(0, 8).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-wrap gap-2 max-w-xs">
                                                    {bundle.products?.map((p: any) => (
                                                        <span key={p.id} className="px-3 py-1 bg-brand-matte text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                                                            {p.name.split(' ')[0]}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-brand text-xl italic tracking-tighter">${bundle.price}</span>
                                                    {bundle.originalPrice && (
                                                        <span className="text-[10px] text-brand-matte/30 font-bold line-through tracking-widest">${bundle.originalPrice}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-4">
                                                    <button
                                                        onClick={() => handleEdit(bundle)}
                                                        className="p-3 text-brand-matte/30 hover:text-brand-gold hover:bg-brand-matte transition"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(bundle.id)}
                                                        className="p-3 text-brand-matte/30 hover:text-brand hover:bg-brand-matte transition"
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
                <AddBundleModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingBundle(null);
                    }}
                    onSuccess={() => {
                        fetchBundles();
                    }}
                    bundle={editingBundle}
                />
            </main>
        </div>
    );
};

export default BundleManagement;
