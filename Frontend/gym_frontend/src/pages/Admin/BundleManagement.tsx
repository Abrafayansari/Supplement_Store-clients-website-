import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Filter, ArrowLeft, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddBundleModal from './AddBundleModal';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import NexusLoader from '../../components/NexusLoader';

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
        if (!window.confirm("Are you sure you want to delete this bundle?")) return;
        try {
            const res = await axios.delete(`${API_URL}/admin/bundles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(res.data.message || "Bundle deleted");
            fetchBundles();
        } catch (err) {
            console.error('Failed to delete bundle:', err);
            toast.error('Failed to delete bundle');
        }
    };

    const handleEdit = (bundle: any) => {
        setEditingBundle(bundle);
        setIsModalOpen(true);
    };

    const filtered = bundles.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading && bundles.length === 0) {
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
                                Bundle <br />
                                <span className="shine-gold italic font-brand">Configurations</span>
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em]">
                                <span className="flex items-center gap-3 px-5 py-2.5 bg-white border border-brand-matte/5 text-brand shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" /> CLOUD SYNC
                                </span>
                                <span className="w-[1px] h-4 bg-brand-matte/10 hidden sm:block" />
                                <span className="text-brand-matte/40">{bundles.length} ACTIVE BUNDLES</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-brand text-white px-14 py-7 rounded-none font-black text-[12px] uppercase tracking-[0.4em] shadow-xl shadow-brand/20 hover:bg-brand-matte transition-all duration-500 flex items-center gap-4 group"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" /> Create New Pack
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-brand-matte/5 shadow-2xl relative">
                    <div className="p-8 border-b border-brand-matte/5 flex flex-col xl:flex-row gap-8 bg-brand-warm/30">
                        <div className="relative flex-grow group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-matte/20 group-focus-within:text-brand transition-colors w-5 h-5" />
                            <input
                                type="text"
                                placeholder="SEARCH BUNDLES..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-16 pr-6 py-5 bg-white border border-brand-matte/5 outline-none focus:border-brand-gold/40 text-[11px] font-black uppercase tracking-widest text-brand-matte shadow-sm placeholder:text-brand-matte/20"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-4 px-12 py-5 bg-white border border-brand-matte/5 font-black text-[11px] uppercase tracking-[0.2em] text-brand-matte hover:text-brand-gold transition-all shadow-sm">
                            <Filter className="w-4 h-4" /> Filter Protocols
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-brand-warm/50">
                                    <th className="px-10 py-8 text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.4em]">Protocol Name</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.4em]">Components</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.4em]">Valuation</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.4em] text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-matte/5">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-32 text-center">
                                            <Package className="w-16 h-16 text-brand-matte/5 mx-auto mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-matte/20">No matching protocols identified</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(bundle => (
                                        <tr key={bundle.id} className="group hover:bg-brand-warm transition-all duration-500">
                                            <td className="px-10 py-10">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-24 h-24 bg-white border border-brand-matte/5 p-4 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
                                                        <img src={bundle.image || '/placeholder.png'} alt={bundle.name} className="w-full h-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="font-black text-brand-matte uppercase tracking-tight text-xl leading-none block group-hover:text-brand-gold transition-colors">{bundle.name}</span>
                                                        <span className="text-[9px] font-bold text-brand-matte/20 uppercase tracking-[0.4em] italic">REF_{bundle.id.slice(0, 8).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-10">
                                                <div className="flex flex-wrap gap-2 max-w-[200px]">
                                                    {bundle.products?.map((p: any) => (
                                                        <span key={p.id} className="px-3 py-1.5 bg-brand-matte text-white text-[8px] font-black uppercase tracking-widest shadow-sm">
                                                            {p.name.split(' ')[0]}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-10 py-10">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-black text-brand-gold text-2xl italic tracking-tighter tabular-nums leading-none">Rs. {bundle.price.toLocaleString()}</span>
                                                    {bundle.originalPrice && (
                                                        <span className="text-[10px] text-brand-matte/20 font-bold line-through tracking-[0.2em] uppercase">MSRP: Rs. {bundle.originalPrice.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-10 text-right">
                                                <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                                    <button
                                                        onClick={() => handleEdit(bundle)}
                                                        className="p-4 text-brand-matte/30 border border-brand-matte/10 hover:text-brand-gold hover:bg-brand-gold/5 hover:border-brand-gold/20 transition-all duration-300"
                                                        title="Edit Protocol"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(bundle.id)}
                                                        className="p-4 text-brand-matte/30 border border-brand-matte/10 hover:text-brand-gold hover:bg-brand hover:text-white hover:border-brand transition-all duration-300"
                                                        title="Delete Protocol"
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
            `}</style>
        </div>
    );
};

export default BundleManagement;
