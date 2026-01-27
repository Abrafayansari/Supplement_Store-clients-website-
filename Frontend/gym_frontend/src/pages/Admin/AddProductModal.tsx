import React, { useEffect, useState } from 'react';
import { X, Upload, FileText, Package, AlertCircle, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product?: any; // Optional product for editing
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess, product }) => {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState<'manual' | 'bulk'>('manual');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Manual Form State
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        subCategory: '',
        price: '',
        size: '',
        stock: '',
        description: '',
        warnings: '',
        directions: '',
        variants: ''
    });
    const [images, setImages] = useState<File[]>([]);

    // Bulk Upload State
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [zipFile, setZipFile] = useState<File | null>(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                brand: product.brand || '',
                category: product.category || '',
                subCategory: product.subCategory || '',
                price: product.price?.toString() || '',
                size: product.size || '',
                stock: product.stock?.toString() || '',
                description: product.description || '',
                warnings: Array.isArray(product.warnings) ? product.warnings.join(', ') : '',
                directions: product.directions || '',
                variants: Array.isArray(product.variants) ? product.variants.join(', ') : ''
            });
            // We don't set files, but we might want to track existing images if we want to delete them
            // For now, we'll just clear new image selection when editing
            setImages([]);
            setActiveTab('manual'); // Force manual tab when editing
        } else {
            setFormData({
                name: '',
                brand: '',
                category: '',
                subCategory: '',
                price: '',
                size: '',
                stock: '',
                description: '',
                warnings: '',
                directions: '',
                variants: ''
            });
            setImages([]);
            setActiveTab('manual'); // Default to manual for new product
        }
        setError(null);
        setSuccess(null);
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'warnings' || key === 'variants') {
                data.append(key, JSON.stringify(value.split(',').map(s => s.trim()).filter(s => s !== '')));
            } else {
                data.append(key, value);
            }
        });

        images.forEach(image => {
            data.append('images', image);
        });

        try {
            if (product) {
                // Handle Edit
                // Add existing images back (assuming product.images contains URLs)
                if (product.images && Array.isArray(product.images)) {
                    product.images.forEach((img: string) => {
                        data.append('existingImages', img);
                    });
                }

                await axios.put(`${API_URL}/product/${product.id}`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                setSuccess('Product updated successfully!');
            } else {
                // Handle Create
                await axios.post(`${API_URL}/create-product`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                setSuccess('Product deployed successfully!');
            }
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || `Failed to ${product ? 'update' : 'deploy'} compound`);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!excelFile || !zipFile) {
            setError('Both Excel and ZIP files are required');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        const data = new FormData();
        data.append('excel', excelFile);
        data.append('images', zipFile);

        try {
            const res = await axios.post(`${API_URL}/uploadproducts`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccess(res.data.message || 'Bulk upload successful!');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Bulk transmission failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl rounded-[32px]">
                {/* Header */}
                <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                            {product ? 'Modify' : 'Deploy'} <span className="text-brand">{product ? 'Core Entity' : 'New Compounds'}</span>
                        </h2>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                            {product ? `Editing record ID: ${product.id.slice(0, 8)}` : 'Select deployment protocol'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition text-zinc-500 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs - Only show for new products */}
                {!product && (
                    <div className="flex border-b border-zinc-800 bg-black">
                        <button
                            onClick={() => setActiveTab('manual')}
                            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeTab === 'manual' ? 'text-brand border-b-2 border-brand bg-brand/5' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <Package className="w-4 h-4" /> Manual Sequence
                        </button>
                        <button
                            onClick={() => setActiveTab('bulk')}
                            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeTab === 'bulk' ? 'text-brand border-b-2 border-brand bg-brand/5' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <Upload className="w-4 h-4" /> Bulk Upload
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar">
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

                    {activeTab === 'manual' ? (
                        <form id="manual-form" onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Compound Name</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="E.G. WHEY ISOLATE X"
                                        className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Brand Identity</label>
                                    <input
                                        required
                                        value={formData.brand}
                                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                        placeholder="E.G. PUREVIGOR"
                                        className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Category</label>
                                        <input
                                            required
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            placeholder="PROTEIN"
                                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Sub-Category</label>
                                        <input
                                            value={formData.subCategory}
                                            onChange={e => setFormData({ ...formData, subCategory: e.target.value })}
                                            placeholder="ISOLATE"
                                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Price ($)</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="0.00"
                                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Size</label>
                                        <input
                                            value={formData.size}
                                            onChange={e => setFormData({ ...formData, size: e.target.value })}
                                            placeholder="5 LBS"
                                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Stock</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.stock}
                                            onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                            placeholder="100"
                                            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Enter compound molecular description..."
                                        className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition resize-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Visual Assets (Up to 5)</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={e => {
                                                const files = Array.from(e.target.files || []);
                                                setImages(files.slice(0, 5));
                                            }}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="flex flex-col items-center justify-center w-full h-32 bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer group-hover:border-brand group-hover:bg-brand/5 transition"
                                        >
                                            <ImageIcon className="w-8 h-8 text-zinc-600 group-hover:text-brand mb-2" />
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                                {images.length > 0 ? `${images.length} Files Selected` : 'Click to upload blueprints'}
                                            </span>
                                        </label>
                                    </div>
                                    {product?.images && product.images.length > 0 && (
                                        <div className="mt-2 text-xs text-zinc-500">
                                            Existing images: {product.images.length}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Warnings (Comma Separated)</label>
                                    <input
                                        value={formData.warnings}
                                        onChange={e => setFormData({ ...formData, warnings: e.target.value })}
                                        placeholder="Do not exceed dose, consult doctor"
                                        className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Directions (Comma Separated)</label>
                                    <input
                                        value={formData.directions}
                                        onChange={e => setFormData({ ...formData, directions: e.target.value })}
                                        placeholder="Take 1 scoop daily, mix with water"
                                        className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Variants (Comma Separated)</label>
                                    <input
                                        value={formData.variants}
                                        onChange={e => setFormData({ ...formData, variants: e.target.value })}
                                        placeholder="Vanilla, Chocolate, Strawberry"
                                        className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white focus:border-brand outline-none transition"
                                    />
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-8 py-10">
                            <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-[40px] text-center space-y-4">
                                <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center text-brand">
                                    <FileText className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Bulk Archive Encryption</h3>
                                    <p className="text-zinc-500 text-sm max-w-sm mx-auto font-medium">
                                        Upload an Excel file (.xlsx) with product details and a ZIP file containing the corresponding images.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1 italic underline">Instruction Set (Excel)</label>
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls"
                                        onChange={e => setExcelFile(e.target.files?.[0] || null)}
                                        className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white file:bg-brand file:border-none file:px-4 file:py-1 file:rounded-lg file:text-white file:text-[10px] file:font-black file:uppercase file:tracking-widest cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1 italic underline">Asset Archive (ZIP)</label>
                                    <input
                                        type="file"
                                        accept=".zip"
                                        onChange={e => setZipFile(e.target.files?.[0] || null)}
                                        className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm font-bold text-white file:bg-brand file:border-none file:px-4 file:py-1 file:rounded-lg file:text-white file:text-[10px] file:font-black file:uppercase file:tracking-widest cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
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
                        form={activeTab === 'manual' ? 'manual-form' : undefined}
                        onClick={activeTab === 'bulk' ? handleBulkSubmit : undefined}
                        disabled={loading}
                        className="px-10 py-4 bg-brand text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition shadow-lg shadow-brand/20 rounded-xl flex items-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Transmitting...
                            </>
                        ) : (
                            product ? 'Confirm Modification' : 'Initiate Deployment'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;
