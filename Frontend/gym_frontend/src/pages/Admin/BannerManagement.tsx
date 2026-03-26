import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
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
                            <Link to="/admin" className="inline-flex items-center gap-3 text-brand-matte/40 hover:text-brand font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 group">
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
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-brand-matte/80 backdrop-blur-sm overflow-y-auto">
                        <div className="bg-brand-warm border border-brand-matte/5 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl my-auto">
                            {/* Header */}
                            <div className="p-6 md:p-8 border-b border-brand-matte/5 flex items-center justify-between bg-white shadow-sm">
                                <div>
                                    <h2 className="text-2xl font-black text-brand-matte uppercase tracking-tighter italic">Create <span className="text-brand">Slide</span></h2>
                                    <p className="text-brand-matte/40 text-[10px] font-black uppercase tracking-widest mt-1">Configure your promotional highlight on the main stage</p>
                                </div>
                                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-brand-warm rounded-none transition text-brand-matte/40 hover:text-brand">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6">
                                <form onSubmit={handleCreate} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1">Visual Title</label>
                                        <input
                                            type="text"
                                            placeholder="E.G. NEW ARRIVAL - SUMMER COLLECTION"
                                            className="w-full px-6 md:px-8 py-4 md:py-5 bg-white border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm"
                                            value={newBanner.title}
                                            onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1">Target Navigation Link</label>
                                        <input
                                            type="text"
                                            placeholder="/products?category=sale"
                                            className="w-full px-6 md:px-8 py-4 md:py-5 bg-white border border-brand-matte/10 text-[11px] font-black tracking-widest focus:border-brand transition-colors outline-none shadow-sm"
                                            value={newBanner.link}
                                            onChange={e => setNewBanner({ ...newBanner, link: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1">Imagery Asset</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                id="banner-image"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                accept="image/*"
                                                onChange={e => setNewBanner({ ...newBanner, image: e.target.files?.[0] || null })}
                                            />
                                            <label
                                                htmlFor="banner-image"
                                                className="flex flex-col items-center justify-center w-full h-40 bg-white border-2 border-dashed border-brand-matte/10 rounded-none cursor-pointer group-hover:border-brand group-hover:bg-brand/5 transition-all shadow-sm"
                                            >
                                                <Upload className="w-10 h-10 text-brand-matte/10 group-hover:text-brand mb-3 transition-colors" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40 group-hover:text-brand transition-colors text-center px-4">
                                                    {newBanner.image ? newBanner.image.name : 'Select or drop 1920x800 asset'}
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Footer */}
                            <div className="p-6 md:p-8 border-t border-brand-matte/5 bg-white flex justify-end gap-4">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="px-6 md:px-8 py-4 md:py-5 text-brand-matte/40 font-black text-[10px] uppercase tracking-[0.3em] hover:text-brand transition-colors rounded-none"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={uploading}
                                    className="px-8 md:px-12 py-4 md:py-5 bg-brand text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-brand-matte transition-all shadow-lg shadow-brand/10 rounded-none flex items-center gap-3 disabled:opacity-50"
                                >
                                    {uploading ? 'Processing...' : 'Deploy Banner'}
                                </button>
                            </div>
                        </div>
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
                            <div key={banner.id} className="group bg-white border border-brand-matte/5 overflow-hidden shadow-2xl hover:shadow-brand/10 hover:border-brand/20 transition-all duration-700">
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
                                        <p className="text-[8px] font-bold text-brand uppercase tracking-[0.4em]">Interactive Hub</p>
                                        <h3 className="text-xl font-black text-brand-matte uppercase tracking-tighter truncate group-hover:text-brand transition-colors">{banner.title || 'Visual Asset'}</h3>
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
                    background: linear-gradient(90deg, #e8222e, #FFF, #e8222e);
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
