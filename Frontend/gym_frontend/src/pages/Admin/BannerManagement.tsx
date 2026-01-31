import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from "framer-motion"
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
            fetchBanners();
        } catch (err) {
            console.error('Failed to delete banner:', err);
            alert('Failed to delete banner');
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBanner.image) return alert('Image is required');

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
            setNewBanner({ title: '', link: '', image: null });
            setShowAddForm(false);
            fetchBanners();
        } catch (err) {
            console.error('Failed to create banner:', err);
            alert('Failed to create banner');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-warm flex">
            <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full space-y-10">
                <Link to="/admin" className="flex items-center gap-3 text-brand-matte/50 hover:text-brand font-black uppercase tracking-widest text-[10px] mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-brand-matte tracking-tighter uppercase italic">Promo <span className="text-brand">Banners</span></h1>
                        <p className="text-brand-matte/40 font-bold uppercase tracking-widest text-[10px]">Update the images at the top of the home page.</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-brand text-white px-10 py-5 rounded-none font-black text-[11px] uppercase tracking-[0.4em] shadow-lg shadow-brand/10 hover:bg-brand-gold transition-luxury flex items-center gap-3"
                    >
                        <Plus className="w-5 h-5" /> Add New Slide
                    </button>
                </div>

                {showAddForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-matte/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-10 max-w-2xl w-full border border-brand-matte/5 relative"
                        >
                            <button onClick={() => setShowAddForm(false)} className="absolute top-6 right-6 text-brand-matte/30 hover:text-brand">
                                <X className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-black text-brand-matte uppercase tracking-tighter mb-8">New Banner <span className="text-brand">Settings</span></h2>
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Banner Title (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="E.G. SUMMER MEGA CLEARANCE"
                                        className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase"
                                        value={newBanner.title}
                                        onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Link</label>
                                    <input
                                        type="text"
                                        placeholder="/products?category=sale"
                                        className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px]"
                                        value={newBanner.link}
                                        onChange={e => setNewBanner({ ...newBanner, link: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Image</label>
                                    <div className="relative border-2 border-dashed border-brand-matte/10 p-10 text-center hover:border-brand/30 transition">
                                        <input
                                            type="file"
                                            id="banner-image"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={e => setNewBanner({ ...newBanner, image: e.target.files?.[0] || null })}
                                        />
                                        <Upload className="w-10 h-10 text-brand-matte/20 mx-auto mb-4" />
                                        <p className="text-[11px] font-black uppercase tracking-widest text-brand-matte/40">
                                            {newBanner.image ? newBanner.image.name : 'Select or drop image'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full py-5 bg-brand text-white font-black uppercase tracking-[0.4em] text-[11px] hover:bg-brand-matte transition-all disabled:opacity-50"
                                >
                                    {uploading ? 'Uploading...' : 'Add Banner'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full py-20 flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 text-brand animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-matte/40">Loading Banners...</span>
                        </div>
                    ) : banners.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white border border-dashed border-brand-matte/10">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-matte/40">No active banners.</span>
                        </div>
                    ) : (
                        banners.map(banner => (
                            <div key={banner.id} className="group bg-white border border-brand-matte/5 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                                <div className="relative h-48 overflow-hidden bg-brand-warm">
                                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => handleDelete(banner.id)}
                                            className="p-4 bg-brand text-white rounded-none hover:bg-brand-matte transition shadow-2xl"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 space-y-2">
                                    <h3 className="font-black text-brand-matte uppercase tracking-tighter truncate">{banner.title || 'Untitled Banner'}</h3>
                                    <p className="text-[10px] font-bold text-brand-matte/30 uppercase tracking-widest truncate">{banner.link || 'No Redirect'}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default BannerManagement;
