import React, { useEffect, useState } from 'react';
import { X, Upload, Package, AlertCircle, CheckCircle2, Loader2, Image as ImageIcon, Search } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

interface AddBundleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    bundle?: any;
}

const AddBundleModal: React.FC<AddBundleModalProps> = ({ isOpen, onClose, onSuccess, bundle }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
    });
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/getallproducts?limit=100`);
                setProducts(res.data.products);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            }
        };
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    useEffect(() => {
        if (bundle) {
            setFormData({
                name: bundle.name || '',
                description: bundle.description || '',
                price: bundle.price?.toString() || '',
                originalPrice: bundle.originalPrice?.toString() || '',
            });
            setSelectedProductIds(bundle.products?.map((p: any) => p.id) || []);
            setImage(null);
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                originalPrice: '',
            });
            setSelectedProductIds([]);
            setImage(null);
        }
        setError(null);
        setSuccess(null);
    }, [bundle, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('originalPrice', formData.originalPrice);
        data.append('productIds', JSON.stringify(selectedProductIds));

        if (image) {
            data.append('image', image);
        }

        try {
            if (bundle) {
                if (bundle.image) {
                    data.append('existingImage', bundle.image);
                }
                await axios.put(`${API_URL}/admin/bundles/${bundle.id}`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                setSuccess('Bundle updated successfully!');
            } else {
                await axios.post(`${API_URL}/admin/bundles`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                setSuccess('Bundle deployed successfully!');
            }
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || `Failed to ${bundle ? 'update' : 'deploy'} bundle`);
        } finally {
            setLoading(false);
        }
    };

    const toggleProduct = (id: string) => {
        setSelectedProductIds(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm shadow-2xl overflow-y-auto">
            <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl rounded-[32px] my-auto">
                {/* Header */}
                <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                            {bundle ? 'Modify' : 'Deploy'} <span className="text-brand">{bundle ? 'Strategic Pack' : 'Bundle Protocol'}</span>
                        </h2>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                            {bundle ? `Editing record ID: ${bundle.id.slice(0, 8)}` : 'Create a multi-compound value stack'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition text-zinc-500 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold">
                            <AlertCircle className="w-5 h-5" /> {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-brand/10 border border-brand/20 p-4 rounded-2xl flex items-center gap-3 text-brand text-sm font-bold">
                            <CheckCircle2 className="w-5 h-5" /> {success}
                        </div>
                    )}

                    <form id="bundle-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Left Side: Details */}
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Bundle Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="E.G. THE SPARTAN MASS STACK"
                                    className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Stack Valuation (Price)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="149.99"
                                        className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Original Price (Strike)</label>
                                    <input
                                        type="number"
                                        value={formData.originalPrice}
                                        onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                                        placeholder="199.99"
                                        className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Strategy Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the synergy between these compounds..."
                                    className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition resize-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Bundle Blueprint (Image)</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setImage(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="bundle-image-upload"
                                    />
                                    <label
                                        htmlFor="bundle-image-upload"
                                        className="flex flex-col items-center justify-center w-full h-40 bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer group-hover:border-brand group-hover:bg-brand/5 transition"
                                    >
                                        {image ? (
                                            <div className="w-full h-full p-2">
                                                <img src={URL.createObjectURL(image)} alt="preview" className="w-full h-full object-contain rounded-lg" />
                                            </div>
                                        ) : bundle?.image ? (
                                            <div className="w-full h-full p-2">
                                                <img src={bundle.image} alt="existing" className="w-full h-full object-contain rounded-lg brightness-50" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <ImageIcon className="w-8 h-8 text-white mb-2" />
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Replace Asset</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-8 h-8 text-zinc-600 group-hover:text-brand mb-2" />
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center px-4">
                                                    Select strategic bundle imagery
                                                </span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Product Selection */}
                        <div className="space-y-4 flex flex-col">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black text-brand uppercase tracking-widest">Molecular Manifest (Products)</label>
                                    <span className="text-[10px] font-black text-zinc-500 uppercase">{selectedProductIds.length} Selected</span>
                                </div>
                                <div className="relative mb-4">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search compounds..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 pl-12 pr-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-white outline-none focus:border-brand"
                                    />
                                </div>

                                <div className="flex-grow bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col max-h-[400px]">
                                    <div className="overflow-y-auto p-2 space-y-2 custom-scrollbar">
                                        {filteredProducts.map(p => (
                                            <div
                                                key={p.id}
                                                onClick={() => toggleProduct(p.id)}
                                                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 ${selectedProductIds.includes(p.id) ? 'bg-brand/10 border border-brand/20' : 'bg-black/20 border border-transparent hover:bg-black/40'}`}
                                            >
                                                <div className="w-10 h-10 bg-white p-1 rounded-lg shrink-0">
                                                    <img src={p.images?.[0]} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="text-[10px] font-black text-white uppercase tracking-tight truncate">{p.name}</h4>
                                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{p.brand}</p>
                                                </div>
                                                {selectedProductIds.includes(p.id) && (
                                                    <div className="w-5 h-5 bg-brand rounded-full flex items-center justify-center text-white">
                                                        <CheckCircle2 size={12} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {filteredProducts.length === 0 && (
                                            <div className="py-10 text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                                                No compounds found.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-4">
                    <button
                        disabled={loading}
                        onClick={onClose}
                        className="px-8 py-4 bg-zinc-900 text-zinc-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition rounded-xl border border-zinc-800"
                    >
                        Abort Operation
                    </button>
                    <button
                        form="bundle-form"
                        disabled={loading || selectedProductIds.length === 0}
                        className="px-10 py-4 bg-brand text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition shadow-lg shadow-brand/20 rounded-xl flex items-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Finalizing Protocol...
                            </>
                        ) : (
                            bundle ? 'Synthesize Pack' : 'Deploy Bundle'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBundleModal;
