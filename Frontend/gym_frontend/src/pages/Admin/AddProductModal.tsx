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

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        subCategory: '',
        description: '',
        warnings: '',
        directions: '',
        variantType: 'SIZE',
        secondaryVariantName: 'Flavor',
    });
    const [variants, setVariants] = useState<Array<{ size: string; flavor: string; price: string; discountPrice: string; stock: string }>>([
        { size: '', flavor: '', price: '', discountPrice: '', stock: '' }
    ]);
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
                description: product.description || '',
                warnings: Array.isArray(product.warnings) ? product.warnings.join(', ') : '',
                directions: product.directions || '',
                variantType: product.variantType || 'SIZE',
                secondaryVariantName: product.secondaryVariantName || 'Flavor',
            });
            if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
                setVariants(product.variants.map((v: any) => ({
                    size: v.size || '',
                    flavor: v.flavor || '',
                    price: v.price?.toString() || '',
                    discountPrice: v.discountPrice?.toString() || '',
                    stock: v.stock?.toString() || ''
                })));
            } else {
                setVariants([{ size: '', flavor: '', price: '', discountPrice: '', stock: '' }]);
            }
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
                description: '',
                warnings: '',
                directions: '',
                variantType: 'SIZE',
                secondaryVariantName: 'Flavor',
            });
            setVariants([{ size: '', flavor: '', price: '', discountPrice: '', stock: '' }]);
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
            if (key === 'warnings' || key === 'directions') {
                data.append(key, JSON.stringify(value.split(',').map(s => s.trim()).filter(s => s !== '')));
            } else {
                data.append(key, value);
            }
        });

        // Filter out empty variants (must have size, price, and stock)
        const validVariants = variants.filter(v => v.size && v.price && v.stock);
        data.append('variants', JSON.stringify(validVariants));

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
                setSuccess('Product added successfully!');
            }
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || `Failed to ${product ? 'update' : 'add'} product`);
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
            setError(err.response?.data?.error || 'Bulk upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-matte/80 backdrop-blur-sm">
            <div className="bg-brand-warm border border-brand-matte/5 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl rounded-none">
                {/* Header */}
                <div className="p-8 border-b border-brand-matte/5 flex items-center justify-between bg-white shadow-sm">
                    <div>
                        <h2 className="text-2xl font-black text-brand-matte uppercase tracking-tighter italic">
                            {product ? 'Edit' : 'Add'} <span className="text-brand">{product ? 'Product' : 'New Item'}</span>
                        </h2>
                        <p className="text-brand-matte/40 text-[10px] font-black uppercase tracking-widest mt-1">
                            {product ? `Editing: ${product.name}` : 'Enter the details of your new product below'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-brand-warm rounded-none transition text-brand-matte/40 hover:text-brand">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs - Only show for new products */}
                {!product && (
                    <div className="flex border-b border-brand-matte/5 bg-white">
                        <button
                            onClick={setActiveTab.bind(null, 'manual')}
                            className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${activeTab === 'manual' ? 'text-brand border-b-2 border-brand bg-brand-warm' : 'text-brand-matte/30 hover:text-brand-matte hover:bg-brand-warm/50'}`}
                        >
                            <Package className="w-4 h-4" /> Single Item
                        </button>
                        <button
                            onClick={setActiveTab.bind(null, 'bulk')}
                            className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${activeTab === 'bulk' ? 'text-brand border-b-2 border-brand bg-brand-warm' : 'text-brand-matte/30 hover:text-brand-matte hover:bg-brand-warm/50'}`}
                        >
                            <Upload className="w-4 h-4" /> Upload List
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
                                    <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1">Product Name</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="E.G. WHEY ISOLATE X"
                                        className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-sm font-black text-brand-matte focus:border-brand outline-none transition uppercase italic shadow-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1">Category</label>
                                        <input
                                            required
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            placeholder="PROTEIN"
                                            className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-sm font-black text-brand-matte focus:border-brand outline-none transition uppercase shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1">Sub-Category</label>
                                        <input
                                            value={formData.subCategory}
                                            onChange={e => setFormData({ ...formData, subCategory: e.target.value })}
                                            placeholder="ISOLATE"
                                            className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-sm font-black text-brand-matte focus:border-brand outline-none transition uppercase shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1">Brand Name</label>
                                    <input
                                        required
                                        value={formData.brand}
                                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                        placeholder="E.G. NEXUS"
                                        className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-sm font-black text-brand-matte focus:border-brand outline-none transition uppercase shadow-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1 italic">Variant Type</label>
                                        <select
                                            value={formData.variantType}
                                            onChange={e => setFormData({ ...formData, variantType: e.target.value })}
                                            className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-xs font-black text-brand-matte focus:border-brand outline-none transition uppercase shadow-sm cursor-pointer"
                                        >
                                            {['SIZE', 'SERVINGS', 'GRAMS', 'TABLETS', 'BARS', 'SCOOPS', 'CAPSULES', 'VERSION', 'OTHER'].map(v => (
                                                <option key={v} value={v} className="bg-white">{v}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1 italic">Secondary Label</label>
                                        <input
                                            value={formData.secondaryVariantName}
                                            onChange={e => setFormData({ ...formData, secondaryVariantName: e.target.value })}
                                            placeholder="FLAVOR / COLOR"
                                            className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-sm font-black text-brand-matte focus:border-brand outline-none transition uppercase shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-6 border-t border-brand-matte/5">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[10px] font-black text-brand uppercase tracking-[0.4em] italic">Product Variants</label>
                                        <button
                                            type="button"
                                            onClick={() => setVariants([...variants, { size: '', flavor: '', price: '', discountPrice: '', stock: '' }])}
                                            className="text-[9px] font-black text-brand bg-brand/10 px-4 py-2 rounded-none uppercase tracking-widest hover:bg-brand hover:text-white transition-luxury shadow-sm"
                                        >
                                            + Add Option
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {variants.map((v, i) => (
                                            <div key={i} className="grid grid-cols-12 gap-2 items-end bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50">
                                                <div className="col-span-3 space-y-1">
                                                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">{formData.variantType}</label>
                                                    <input
                                                        value={v.size}
                                                        onChange={e => {
                                                            const newV = [...variants];
                                                            newV[i].size = e.target.value;
                                                            setVariants(newV);
                                                        }}
                                                        placeholder="30 SERVINGS"
                                                        className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-lg text-xs font-bold text-white focus:border-brand outline-none"
                                                    />
                                                </div>
                                                <div className="col-span-3 space-y-1">
                                                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">{formData.secondaryVariantName || 'Flavor'}</label>
                                                    <input
                                                        value={v.flavor}
                                                        onChange={e => {
                                                            const newV = [...variants];
                                                            newV[i].flavor = e.target.value;
                                                            setVariants(newV);
                                                        }}
                                                        placeholder="CHOCOLATE"
                                                        className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-lg text-xs font-bold text-white focus:border-brand outline-none"
                                                    />
                                                </div>
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">Price</label>
                                                    <input
                                                        type="number"
                                                        value={v.price}
                                                        onChange={e => {
                                                            const newV = [...variants];
                                                            newV[i].price = e.target.value;
                                                            setVariants(newV);
                                                        }}
                                                        placeholder="0.00"
                                                        className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-lg text-xs font-bold text-white focus:border-brand outline-none"
                                                    />
                                                </div>
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-[8px] font-black text-brand uppercase tracking-widest ml-1">Discount</label>
                                                    <input
                                                        type="number"
                                                        value={v.discountPrice}
                                                        onChange={e => {
                                                            const newV = [...variants];
                                                            newV[i].discountPrice = e.target.value;
                                                            setVariants(newV);
                                                        }}
                                                        placeholder="0.00"
                                                        className="w-full bg-zinc-950 border border-brand/30 p-2 rounded-lg text-xs font-bold text-white focus:border-brand outline-none"
                                                    />
                                                </div>
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">Stock</label>
                                                    <input
                                                        type="number"
                                                        value={v.stock}
                                                        onChange={e => {
                                                            const newV = [...variants];
                                                            newV[i].stock = e.target.value;
                                                            setVariants(newV);
                                                        }}
                                                        placeholder="10"
                                                        className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-lg text-xs font-bold text-white focus:border-brand outline-none"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                                                    disabled={variants.length === 1}
                                                    className="col-span-2 p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition disabled:opacity-20"
                                                >
                                                    <X size={14} className="mx-auto" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1">Product Description</label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="ENTER KEY PRODUCT FEATURES AND DESCRIPTION..."
                                        className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-sm font-black text-brand-matte focus:border-brand outline-none transition resize-none placeholder:text-brand-matte/10 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1 italic">Product Gallery (Max 5)</label>
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
                                            className="flex flex-col items-center justify-center w-full h-40 bg-white border-2 border-dashed border-brand-matte/10 rounded-none cursor-pointer group-hover:border-brand-gold group-hover:bg-brand-gold/5 transition-luxury shadow-sm"
                                        >
                                            <ImageIcon className="w-8 h-8 text-brand-matte/10 group-hover:text-brand-gold mb-3 transition-colors" />
                                            <span className="text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.3em] group-hover:text-brand-gold transition-colors">
                                                {images.length > 0 ? `${images.length} Media Selected` : 'Click to add product photos'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1 italic">Safety Information</label>
                                    <input
                                        value={formData.warnings}
                                        onChange={e => setFormData({ ...formData, warnings: e.target.value })}
                                        placeholder="E.G. NOT FOR CHILDREN, STORE IN COOL PLACE"
                                        className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-sm font-black text-brand-matte focus:border-brand outline-none transition uppercase shadow-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-[0.2em] ml-1 italic">How to Use</label>
                                    <input
                                        value={formData.directions}
                                        onChange={e => setFormData({ ...formData, directions: e.target.value })}
                                        placeholder="E.G. MIX 1 SCOOP WITH 200ML WATER"
                                        className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-sm font-black text-brand-matte focus:border-brand outline-none transition uppercase shadow-sm"
                                    />
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-8 py-10">
                            <div className="flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-brand-matte/5 rounded-none text-center space-y-4 shadow-sm">
                                <div className="w-20 h-20 bg-brand-warm rounded-full flex items-center justify-center text-brand-gold">
                                    <FileText className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-brand-matte uppercase tracking-tighter italic">Bulk List Upload</h3>
                                    <p className="text-brand-matte/30 text-[10px] font-black uppercase tracking-widest max-w-sm mx-auto">
                                        Upload Excel data + Media ZIP to update items in bulk.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-widest ml-1 italic">Spreadsheet (.xlsx)</label>
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls"
                                        onChange={e => setExcelFile(e.target.files?.[0] || null)}
                                        className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-[10px] font-black text-brand-matte file:bg-brand file:border-none file:px-4 file:py-2 file:rounded-none file:text-white file:text-[9px] file:font-black file:uppercase file:tracking-widest cursor-pointer shadow-sm"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-brand-matte/30 uppercase tracking-widest ml-1 italic">Media Archive (.zip)</label>
                                    <input
                                        type="file"
                                        accept=".zip"
                                        onChange={e => setZipFile(e.target.files?.[0] || null)}
                                        className="w-full bg-white border border-brand-matte/10 p-4 rounded-none text-[10px] font-black text-brand-matte file:bg-brand file:border-none file:px-4 file:py-2 file:rounded-none file:text-white file:text-[9px] file:font-black file:uppercase file:tracking-widest cursor-pointer shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
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
                        form={activeTab === 'manual' ? 'manual-form' : undefined}
                        onClick={activeTab === 'bulk' ? handleBulkSubmit : undefined}
                        disabled={loading}
                        className="px-12 py-5 bg-brand text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-brand-gold transition-luxury shadow-lg shadow-brand/10 rounded-none flex items-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            product ? 'Update Details' : 'Save Item'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;
