import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from "framer-motion"
import { toast } from 'sonner';
import NexusLoader from '../../components/NexusLoader';

const API_URL = import.meta.env.VITE_API_URL;

const BannerManagement: React.FC = () => {
    const { token } = useAuth();
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const [newBanner, setNewBanner] = useState({
        title: '',
        link: '',
        image: null as File | null
    });

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/banners`);
            setBanners(res.data);
        } catch (err) {
            console.error('Failed to fetch banners:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;
        try {
            await axios.delete(`${API_URL}/admin/banners/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Banner removed");
            fetchBanners();
        } catch (err) {
            console.error('Failed to delete banner:', err);
            toast.error('Failed to delete banner');
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBanner.image) return toast.error('Image is required');

        const formData = new FormData();
        formData.append('title', newBanner.title);
        formData.append('link', newBanner.link);
        formData.append('image', newBanner.image);

        try {
            setUploading(true);
            await axios.post(`${API_URL}/admin/banners`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("New banner slide added");
            setNewBanner({ title: '', link: '', image: null });
            setShowAddForm(false);
            fetchBanners();
        } catch (err) {
            console.error('Failed to create banner:', err);
            toast.error('Failed to create banner');
        } finally {
            setUploading(false);
        }
    };

    if (loading && banners.length === 0) {
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
                                Promo <br />
                                <span className="shine-gold italic font-brand">Banners</span>
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em]">
                                <span className="flex items-center gap-3 px-5 py-2.5 bg-white border border-brand-matte/5 text-brand shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" /> LIVE SYNCING
                                </span>
                                <span className="w-[1px] h-4 bg-brand-matte/10 hidden sm:block" />
                                <span className="text-brand-matte/40">{banners.length} ACTIVE SLIDES</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-brand text-white px-14 py-7 rounded-none font-black text-[12px] uppercase tracking-[0.4em] shadow-xl shadow-brand/20 hover:bg-brand-matte transition-all duration-500 flex items-center gap-4 group"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" /> Add New Slide
                        </button>
                    </div>
                </div>

                {showAddForm && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-brand-matte/95 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-white p-12 max-w-2xl w-full border border-brand-matte/5 relative shadow-2xl"
                        >
                            <button onClick={() => setShowAddForm(false)} className="absolute top-8 right-8 text-brand-matte/30 hover:text-brand transition-colors">
                                <X className="w-6 h-6" />
                            </button>

                            <div className="space-y-2 mb-12">
                                <h2 className="text-3xl font-black text-brand-matte uppercase tracking-tighter">Slide <span className="shine-gold italic font-brand">Composer</span></h2>
                                <p className="text-[10px] text-brand-matte/30 font-black uppercase tracking-widest leading-loose">Configure your promotional highlight on the main stage.</p>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-matte/40">Visual Title</label>
                                    <input
                                        type="text"
                                        placeholder="E.G. NEW ARRIVAL - SUMMER COLLECTION"
                                        className="w-full px-8 py-5 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand-gold transition-colors outline-none"
                                        value={newBanner.title}
                                        onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-matte/40">Target Navigation Link</label>
                                    <input
                                        type="text"
                                        placeholder="/products?category=sale"
                                        className="w-full px-8 py-5 bg-brand-warm border border-brand-matte/10 text-[11px] font-black tracking-widest focus:border-brand-gold transition-colors outline-none"
                                        value={newBanner.link}
                                        onChange={e => setNewBanner({ ...newBanner, link: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-matte/40">Imagery Asset</label>
                                    <div className="relative border-2 border-dashed border-brand-matte/10 p-12 text-center hover:border-brand-gold/40 transition-all group pointer-cursor bg-brand-warm/50">
                                        <input
                                            type="file"
                                            id="banner-image"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            accept="image/*"
                                            onChange={e => setNewBanner({ ...newBanner, image: e.target.files?.[0] || null })}
                                        />
                                        <Upload className="w-12 h-12 text-brand-matte/10 mx-auto mb-6 group-hover:text-brand-gold transition-colors" />
                                        <p className="text-[11px] font-black uppercase tracking-widest text-brand-matte/40 group-hover:text-brand-matte transition-colors">
                                            {newBanner.image ? newBanner.image.name : 'Select or drop 1920x800 asset'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full py-8 bg-brand text-white font-black uppercase tracking-[0.5em] text-[12px] hover:bg-brand-matte transition-all disabled:opacity-50 shadow-xl shadow-brand/20"
                                >
                                    {uploading ? 'Processing Asset...' : 'Deploy Banner'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {banners.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-white border border-brand-matte/5">
                            <X className="w-16 h-16 text-brand-matte/5 mx-auto mb-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-matte/20">Zero active items in visual queue</span>
                        </div>
                    ) : (
                        banners.map(banner => (
                            <div key={banner.id} className="group bg-white border border-brand-matte/5 overflow-hidden shadow-2xl hover:shadow-brand-gold/10 hover:border-brand-gold/20 transition-all duration-700">
                                <div className="relative h-64 overflow-hidden bg-brand-warm">
                                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                                    <div className="absolute inset-0 bg-brand-matte/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <button
                                            onClick={() => handleDelete(banner.id)}
                                            className="p-6 bg-brand text-white rounded-none hover:bg-brand-matte transition-all shadow-2xl translate-y-4 group-hover:translate-y-0 duration-500"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-10 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-bold text-brand-gold uppercase tracking-[0.4em]">Interactive Hub</p>
                                        <h3 className="text-xl font-black text-brand-matte uppercase tracking-tighter truncate group-hover:text-brand-gold transition-colors">{banner.title || 'Visual Asset'}</h3>
                                    </div>
                                    <div className="pt-4 border-t border-brand-matte/5">
                                        <p className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] truncate italic">{banner.link || 'Static Highlight'}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
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

export default BannerManagement;
