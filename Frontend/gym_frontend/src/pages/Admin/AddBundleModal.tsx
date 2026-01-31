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
                setSuccess('Bundle created successfully!');
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-matte/80 backdrop-blur-sm shadow-2xl overflow-y-auto">
            <div className="bg-brand-warm border border-brand-matte/5 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl rounded-none my-auto">
                {/* Header */}
                <div className="p-8 border-b border-brand-matte/5 flex items-center justify-between bg-white shadow-sm">
                    <div>
                        <h2 className="text-2xl font-black text-brand-matte uppercase tracking-tighter italic">
                            {bundle ? 'Edit' : 'Create'} <span className="text-brand">{bundle ? 'Pack' : 'New Pack'}</span>
                        </h2>
                        <p className="text-brand-matte/40 text-[10px] font-black uppercase tracking-widest mt-1">
                            {bundle ? `Editing: ${bundle.name}` : 'Combine items into a discounted set'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-brand-warm rounded-none transition text-brand-matte/40 hover:text-brand">
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
                                <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1">Pack Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="E.G. SUMMER STRENGTH PACK"
                                    className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-sm font-black text-brand-matte focus:border-brand outline-none transition uppercase italic shadow-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1">Bundle Price</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="149.99"
                                        className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-sm font-black text-brand-matte focus:border-brand outline-none transition shadow-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1 italic">Original Price</label>
                                    <input
                                        type="number"
                                        value={formData.originalPrice}
                                        onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                                        placeholder="199.99"
                                        className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-sm font-black text-brand-matte focus:border-brand outline-none transition shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1">Pack Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="DESCRIBE THE BENEFITS OF THIS SET..."
                                    className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-sm font-black text-brand-matte focus:border-brand outline-none transition resize-none shadow-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1 italic">Marketing Image</label>
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
                                        className="flex flex-col items-center justify-center w-full h-40 bg-white border-2 border-dashed border-brand-matte/10 rounded-none cursor-pointer group-hover:border-brand-gold group-hover:bg-brand-gold/5 transition-luxury shadow-sm"
                                    >
                                        {image ? (
                                            <div className="w-full h-full p-2">
                                                <img src={URL.createObjectURL(image)} alt="preview" className="w-full h-full object-contain" />
                                            </div>
                                        ) : bundle?.image ? (
                                            <div className="w-full h-full p-2">
                                                <img src={bundle.image} alt="existing" className="w-full h-full object-contain brightness-50" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <ImageIcon className="w-8 h-8 text-white mb-2" />
                                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Replace Image</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon className="w-8 h-8 text-brand-matte/10 group-hover:text-brand-gold mb-3 transition-colors" />
                                                <span className="text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.3em] group-hover:text-brand-gold transition-colors text-center px-4">
                                                    Add media asset
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
                                    <label className="text-[10px] font-black text-brand uppercase tracking-[0.4em] italic">Select Items</label>
                                    <span className="text-[10px] font-black text-brand uppercase">{selectedProductIds.length} Added</span>
                                </div>
                                <div className="relative mb-4">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-matte/20 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="SEARCH PRODUCTS..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full bg-white border border-brand-matte/10 pl-12 pr-4 py-4 rounded-none text-[11px] font-black uppercase tracking-widest text-brand-matte outline-none focus:border-brand shadow-sm"
                                    />
                                </div>

                                <div className="flex-grow bg-white border border-brand-matte/5 rounded-none overflow-hidden flex flex-col max-h-[440px] shadow-sm">
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
                                                    <h4 className="text-[10px] font-black text-brand-matte uppercase tracking-tight truncate">{p.name}</h4>
                                                    <p className="text-[9px] font-bold text-brand-matte/30 uppercase tracking-widest">{p.brand}</p>
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
                                                No products found.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-brand-matte/5 bg-white flex justify-end gap-6">
                    <button
                        disabled={loading}
                        onClick={onClose}
                        className="px-8 py-5 text-brand-matte/40 font-black text-[10px] uppercase tracking-[0.3em] hover:text-brand transition-colors rounded-none"
                    >
                        Back
                    </button>
                    <button
                        form="bundle-form"
                        disabled={loading || selectedProductIds.length === 0}
                        className="px-12 py-5 bg-brand text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-brand-gold transition-luxury shadow-lg shadow-brand/10 rounded-none flex items-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            bundle ? 'Save Changes' : 'Create Pack'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBundleModal;
