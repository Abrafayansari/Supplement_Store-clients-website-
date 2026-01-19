import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Search,
    SlidersHorizontal,
    LayoutGrid,
    List,
    X,
    ChevronDown,
    FlaskConical,
    Filter,
    ArrowUpDown
} from 'lucide-react';
import { fetchProducts, getCategories } from '../data/Product.tsx';
import ProductCard from '../components/ProductCard.tsx';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '../components/ui/sheet.tsx';
import { Badge } from '../components/ui/badge.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu.tsx";
import { Product } from '@/types.ts';

const ProductList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [maxPrice, setMaxPrice] = useState(200);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name'>('newest');
    const [products, setProducts] = useState<Product[]>([]);
    const [subcategories, setsubCategories] = useState<Array<any>>([]);
    const activeCategory = searchParams.get('category') || 'All';

    useEffect(() => {
        getCategories()
            .then(res => setsubCategories(res))
            .catch(console.error);
        fetchProducts({
            subCategory: activeCategory !== "All" ? activeCategory : undefined,
            search: searchQuery || undefined,
            maxPrice,
            sort: sortBy,
            page: 1,
            limit: 12,
            inStock: true,
        })
            .then(res => {
                setProducts(res.products)
                console.log('Fetched products:', res.products);
            }
            )
            .catch(console.error);
    }, [activeCategory, searchQuery, maxPrice, sortBy]);

    const isNew = (product: Product) => {
        const now = new Date();
        const createdAt = new Date(product.createdAt);
        const diffInDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return diffInDays <= 30;
    };

    const processedProducts = useMemo(() => products, [products]);


    const removeCategory = () => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            params.delete('category');
            return params;
        });

    };
    const normalize = (v: string) =>
        v.trim().toLowerCase().replace(/\s+/g, '-');
    const clearAllFilters = () => {
        setSearchQuery('');
        setMaxPrice(200);
        removeCategory();
        setSortBy('newest');
    };

    const FilterSidebar = () => (
        <div className="space-y-12">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-brand-gold rotate-45"></div>
                    <h3 className="text-[11px] font-black text-brand-matte uppercase tracking-[0.4em]">Protocol Series</h3>
                </div>
                <div className="space-y-1">
                    <button
                        onClick={removeCategory}
                        className={`flex items-center justify-between w-full text-left text-[11px] font-bold uppercase tracking-widest px-4 py-3 transition-all rounded-sm ${activeCategory === 'All' ? 'bg-brand-matte text-white' : 'text-brand-matte/60 hover:bg-white hover:shadow-md'}`}
                    >
                        All Archive
                        <ChevronDown className={`w-3 h-3 transition-transform ${activeCategory === 'All' ? 'rotate-180' : ''}`} />
                    </button>
                    {subcategories.map(cat => (
                        <button
                            key={cat.subCategory}
                            onClick={() => {
                                setSearchParams(prev => {
                                    const params = new URLSearchParams(prev);
                                    params.set('category', cat.subCategory);
                                    return params;
                                });

                                setIsFilterOpen(false);
                            }}
                            className={`flex items-center justify-between w-full text-left text-[11px] font-bold uppercase tracking-widest px-4 py-3 transition-all rounded-sm ${normalize(cat.subCategory ?? '') === normalize(activeCategory) ? 'bg-brand text-white' : 'text-brand-matte/60 hover:bg-white hover:text-brand-matte hover:shadow-md'}`}
                        >
                            {cat.subCategory} Series
                            <Badge variant="outline" className={`text-[9px] border-black/10 text-inherit ${normalize(cat.subCategory ?? '') === normalize(activeCategory) ? 'border-white/20' : ''}`}>
                                {products.filter(p => p.subCategory?.toLowerCase() === cat.subCategory.toLowerCase()).length}
                            </Badge>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-brand-gold rotate-45"></div>
                    <h3 className="text-[11px] font-black text-brand-matte uppercase tracking-[0.4em]">Price Boundary</h3>
                </div>
                <div className="px-2 space-y-6">
                    <input
                        type="range"
                        min="10"
                        max="200"
                        step="5"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        className="w-full accent-brand-gold bg-brand-matte/10 h-1.5 appearance-none cursor-pointer rounded-full"
                    />
                    <div className="flex justify-between items-center">
                        <div className="bg-white border border-brand-matte/5 px-3 py-1 rounded-sm text-[10px] font-black text-brand-matte/40">MIN $10</div>
                        <div className="text-brand font-black text-sm italic tracking-tighter underline underline-offset-4 decoration-brand-gold/30">CAP ${maxPrice}</div>
                    </div>
                </div>
            </div>

            <button
                onClick={clearAllFilters}
                className="w-full py-4 border border-brand text-brand text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand hover:text-white transition-luxury"
            >
                Reset Filters
            </button>
        </div>
    );

    const getSortLabel = () => {
        switch (sortBy) {
            case 'newest': return 'Sequence: Newest First';
            case 'price-asc': return 'Yield: Low to High';
            case 'price-desc': return 'Yield: High to Low';
            case 'name': return 'Alphabetical Protocol';
        }
    };

    return (
        <div className="min-h-screen bg-brand-warm selection:bg-brand selection:text-white">

            {/* 1. DARK HERO SECTION */}
            <div className="bg-brand-matte pt-32 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-0 right-0 p-20 opacity-5">
                    <FlaskConical className="w-96 h-96 text-white" />
                </div>

                <div className="max-w-[1700px] mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Badge className="bg-brand-gold text-brand-matte font-black rounded-none px-3 py-1 border-none">LIVE FEED</Badge>
                                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">System Online</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
                                Global <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-white shine-gold">Inventory</span>
                            </h1>
                        </div>

                        <div className="w-full lg:w-[500px] relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within:text-brand-gold transition-colors" />
                            <input
                                type="text"
                                placeholder="SEARCH PROTOCOL ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 backdrop-blur-sm focus:bg-black/40 focus:border-brand-gold/50 text-white placeholder:text-white/20 text-[13px] font-bold uppercase tracking-widest outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. LIGHT CONTENT AREA */}
            <div className="max-w-[1700px] mx-auto px-6 -mt-10 relative z-20 pb-40">

                {/* TOOLBAR (FLOATING CARD) */}
                <div className="bg-white border-b-4 border-brand-gold shadow-[0_20px_40px_rgba(0,0,0,0.05)] p-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-8">

                    <div className="flex items-center gap-8 w-full md:w-auto overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                            <SheetTrigger asChild>
                                <button className="lg:hidden flex items-center gap-3 px-6 py-3 bg-brand-matte text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                    <Filter className="w-4 h-4 text-brand-gold" /> Filter Protocol
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-brand-warm border-none w-full max-w-sm p-10 overflow-y-auto">
                                <SheetHeader className="mb-12">
                                    <SheetTitle className="text-left text-3xl font-black text-brand-matte uppercase tracking-tighter">
                                        Recalibrate <span className="text-brand">Grid</span>
                                    </SheetTitle>
                                </SheetHeader>
                                <FilterSidebar />
                            </SheetContent>
                        </Sheet>

                        <div className="flex items-center gap-3 shrink-0">
                            <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">
                                {processedProducts.length} Results Found
                            </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            {activeCategory !== 'All' && (
                                <Badge className="bg-brand-matte text-white px-4 py-1.5 rounded-none flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider cursor-pointer hover:bg-brand" onClick={removeCategory}>
                                    {activeCategory} <X className="w-3 h-3" />
                                </Badge>
                            )}
                            {maxPrice < 200 && (
                                <Badge className="bg-brand-matte text-white px-4 py-1.5 rounded-none flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider cursor-pointer hover:bg-brand" onClick={() => setMaxPrice(200)}>
                                    ${maxPrice} CAP <X className="w-3 h-3" />
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex bg-brand-warm p-1 gap-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand-matte' : 'text-brand-matte/20 hover:text-brand-matte'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-brand-matte' : 'text-brand-matte/20 hover:text-brand-matte'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest outline-none text-brand-matte hover:text-brand transition-colors group">
                                    <span className="text-brand-matte/30">Sort By:</span>
                                    <div className="flex items-center gap-2">
                                        {getSortLabel()}
                                        <ChevronDown className="w-3 h-3 text-brand-matte/20 group-hover:text-black transition-colors" />
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border border-brand-matte/5 rounded-none p-0 w-[220px] shadow-2xl z-50">
                                {[
                                    { id: 'newest', label: 'Newest First' },
                                    { id: 'price-desc', label: 'Price: High to Low' },
                                    { id: 'price-asc', label: 'Price: Low to High' },
                                    { id: 'name', label: 'Alphabetical' }
                                ].map((option) => (
                                    <DropdownMenuItem
                                        key={option.id}
                                        onClick={() => setSortBy(option.id as any)}
                                        className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest cursor-pointer rounded-none border-b border-brand-matte/5 last:border-0 hover:bg-brand-warm ${sortBy === option.id ? 'bg-brand-warm text-brand' : 'text-brand-matte/60'}`}
                                    >
                                        {option.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    <aside className="hidden lg:block lg:w-72 shrink-0">
                        <div className="sticky top-10">
                            <FilterSidebar />

                            <div className="mt-16 p-8 bg-brand-matte text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="space-y-4 relative z-10">
                                    <h4 className="text-xl font-black uppercase tracking-tight leading-none">Custom <br />Formulation</h4>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Need a specific stack? Our clinic offers custom compounding services.</p>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-brand-gold border-b border-brand-gold/30 pb-1 hover:text-white hover:border-white transition-all">Start Consult</button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-grow">
                        {processedProducts.length > 0 ? (
                            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'flex flex-col gap-6'}`}>
                                {processedProducts.map(product => (
                                    <div key={product.id} className={`${viewMode === 'grid' ? 'flex justify-start' : 'w-full'}`}>
                                        {viewMode === 'grid' ? (
                                            <ProductCard product={product} />
                                        ) : (
                                            <div className="bg-white p-6 flex items-center gap-8 group shadow-[0_5px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-luxury border border-transparent hover:border-brand-gold/20 w-full relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-1 h-full bg-brand-gold scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500"></div>
                                                <div className="w-40 h-40 bg-brand-warm p-6 shrink-0 flex items-center justify-center mixing-blend-multiply">
                                                    <img src={product.images[0]} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" alt={product.name} />
                                                </div>
                                                <div className="flex-grow space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="outline" className="border-brand-gold/30 text-brand-gold text-[9px] font-black uppercase tracking-widest rounded-none px-2 py-0.5">{product.subCategory}</Badge>
                                                        <span className="text-brand-matte/20 text-[9px] font-bold uppercase tracking-widest">SEQ-ID: {product.id}</span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <h3 className="text-2xl font-black text-brand-matte uppercase tracking-tight group-hover:text-brand transition-colors">{product.name}</h3>
                                                        <p className="text-xs text-brand-matte/50 line-clamp-2 max-w-xl">{product.description}</p>
                                                    </div>

                                                    <div className="flex items-center gap-6 pt-2">
                                                        <span className="text-3xl font-black text-brand italic tracking-tighter">${product.price.toFixed(2)}</span>
                                                        <div className="h-8 w-[1px] bg-brand-matte/10"></div>
                                                        {product.price && (
                                                            <span className="text-xs text-brand-matte/30 line-through font-bold">MSRP ${(product.price * 1.2).toFixed(2)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button className="btn-luxury px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] relative overflow-hidden">
                                                        Authentication
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 text-center space-y-8 bg-white/50 border border-brand-matte/5 p-12">
                                <Search className="w-16 h-16 text-brand-matte/10 mx-auto" />
                                <div className="space-y-4">
                                    <p className="text-3xl font-black text-brand-matte/20 uppercase tracking-tighter">No Matches Found</p>
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-matte/40 max-w-sm mx-auto">The requested protocol sequence is not found in the current archive.</p>
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-brand font-black uppercase tracking-widest text-[11px] underline underline-offset-4 hover:text-brand-gold"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductList; 