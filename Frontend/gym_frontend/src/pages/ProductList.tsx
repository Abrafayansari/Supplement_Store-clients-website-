import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  X, 
  ChevronDown, 
  FlaskConical, 
  Zap, 
  ShieldCheck,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { initialProducts, categories } from '../data/Product.tsx';
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

const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(200);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name'>('newest');

  const activeCategory = searchParams.get('category') || 'All';

  const processedProducts = useMemo(() => {
    let filtered = initialProducts.filter(p => {
      const matchesCategory = 
        activeCategory === 'All' || 
        p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price <= maxPrice;
      return matchesCategory && matchesSearch && matchesPrice;
    });

    // Sorting Logic
    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'newest') filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    return filtered;
  }, [activeCategory, searchQuery, maxPrice, sortBy]);

  const removeCategory = () => {
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setMaxPrice(200);
    removeCategory();
    setSortBy('newest');
  };

  const FilterSidebar = () => (
    <div className="space-y-16">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-brand-gold rotate-45"></div>
          <h3 className="text-[11px] font-black text-brand-matte uppercase tracking-[0.4em]">Protocol Series</h3>
        </div>
        <div className="space-y-2">
          <button 
            onClick={removeCategory}
            className={`flex items-center justify-between w-full text-left text-[11px] font-bold uppercase tracking-widest px-4 py-3 transition-all ${activeCategory === 'All' ? 'bg-brand-matte text-white' : 'text-brand-matte/40 hover:bg-brand-warm'}`}
          >
            All Archive
            <ChevronDown className={`w-3 h-3 transition-transform ${activeCategory === 'All' ? 'rotate-180' : ''}`} />
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => {
                searchParams.set('category', cat.name);
                setSearchParams(searchParams);
                setIsFilterOpen(false);
              }}
              className={`flex items-center justify-between w-full text-left text-[11px] font-bold uppercase tracking-widest px-4 py-3 transition-all ${activeCategory.toLowerCase() === cat.name.toLowerCase() ? 'bg-brand text-white' : 'text-brand-matte/40 hover:bg-brand-warm border border-transparent hover:border-brand-matte/5'}`}
            >
              {cat.name} Series
              <Badge variant="outline" className="text-[8px] border-white/20 text-inherit">
                {initialProducts.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
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
            <div className="bg-brand-warm border border-brand-matte/5 px-3 py-1 rounded-sm text-[10px] font-black text-brand-matte/40">MIN $10</div>
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
    switch(sortBy) {
      case 'newest': return 'Sequence: Newest First';
      case 'price-asc': return 'Yield: Low to High';
      case 'price-desc': return 'Yield: High to Low';
      case 'name': return 'Alphabetical Protocol';
    }
  };

  return (
    <div className="bg-brand-warm min-h-screen pt-32 pb-48 selection:bg-brand selection:text-white">
      <div className="max-w-[1700px] mx-auto px-6">
        
        {/* SHOP HERO BANNER */}
        <div className="relative h-64 md:h-80 bg-brand-matte mb-20 overflow-hidden group">
          <div className="absolute inset-0 z-0 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000">
            <img 
              src="https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=1600" 
              alt="Elite Compounds" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-matte via-brand-matte/60 to-transparent z-10"></div>
          <div className="relative z-20 h-full flex flex-col justify-center px-12 md:px-20 space-y-4">
            <div className="flex items-center gap-4">
              <Badge className="bg-brand-gold text-brand-matte font-black rounded-none px-4">DECLASSFIED</Badge>
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Protocol V-77-X Is Now Online</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight">
              ADVANCED <span className="text-brand-gold italic">BIO-STACKS</span>
            </h2>
            <p className="text-white/30 text-xs font-bold uppercase tracking-[0.3em] max-w-md">
              Synchronize your metabolism with high-yield isolation compounds. Verified clinical results only.
            </p>
          </div>
        </div>

        {/* SHOP HEADER & SEARCH */}
        <header className="mb-16 space-y-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <span className="h-[2px] w-12 bg-brand"></span>
                <span className="text-[11px] font-black uppercase tracking-[0.8em] text-brand">Operational Catalog</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-brand-matte uppercase tracking-tighter leading-[0.8]">
                ELITE <br />
                <span className="shine-gold">ARCHIVE</span>
              </h1>
            </div>

            <div className="w-full lg:w-[600px] relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-matte/20 w-5 h-5 group-focus-within:text-brand-gold transition-colors" />
              <input 
                type="text" 
                placeholder="Scan Registry For Specific Protocol..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-7 bg-white border border-brand-matte/10 shadow-xl outline-none focus:border-brand-gold/40 text-[13px] font-bold uppercase tracking-widest text-brand-matte transition-all placeholder:text-brand-matte/10"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                <span className="hidden md:block text-[9px] font-black text-brand-matte/20 uppercase tracking-widest">Targeting Status: Active</span>
                <div className="w-2 h-2 bg-brand-gold animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row justify-between items-center py-8 border-y border-brand-matte/5 mb-16 gap-8">
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
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-matte/30">
                Identified {processedProducts.length} Active Records
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {activeCategory !== 'All' && (
                <Badge className="bg-brand/10 text-brand border-brand/20 rounded-none px-4 py-1 flex items-center gap-2 group cursor-pointer hover:bg-brand hover:text-white transition-luxury" onClick={removeCategory}>
                  {activeCategory.toUpperCase()} <X className="w-3 h-3" />
                </Badge>
              )}
              {maxPrice < 200 && (
                <Badge className="bg-brand-gold/10 text-brand-gold border-brand-gold/20 rounded-none px-4 py-1 flex items-center gap-2 group cursor-pointer hover:bg-brand-gold hover:text-brand-matte transition-luxury" onClick={() => setMaxPrice(200)}>
                  UNDER ${maxPrice} <X className="w-3 h-3" />
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="flex border border-brand-matte/5 bg-white shadow-sm overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-4 transition-colors ${viewMode === 'grid' ? 'bg-brand-matte text-white' : 'hover:bg-brand-warm text-brand-matte/20'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-4 transition-colors ${viewMode === 'list' ? 'bg-brand-matte text-white' : 'hover:bg-brand-warm text-brand-matte/20'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-4 bg-white border border-brand-matte/10 px-6 py-4 text-[10px] font-black uppercase tracking-widest outline-none hover:border-brand-gold transition-colors shadow-sm min-w-[220px] justify-between group">
                  <div className="flex items-center gap-3">
                    <ArrowUpDown className="w-3.5 h-3.5 text-brand-gold" />
                    {getSortLabel()}
                  </div>
                  <ChevronDown className="w-3 h-3 text-brand-matte/20 group-hover:text-brand-gold transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-brand-matte/10 rounded-none p-0 w-[220px] shadow-2xl z-50">
                {[
                  { id: 'newest', label: 'Sequence: Newest First' },
                  { id: 'price-desc', label: 'Yield: High to Low' },
                  { id: 'price-asc', label: 'Yield: Low to High' },
                  { id: 'name', label: 'Alphabetical Protocol' }
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

        <div className="flex flex-col lg:flex-row gap-20">
          <aside className="hidden lg:block lg:w-80 shrink-0">
            <div className="sticky top-32">
              <FilterSidebar />
              <div className="mt-20 p-8 bg-brand border border-brand shadow-[0_20px_40px_rgba(123,15,23,0.2)] space-y-6 text-white">
                <FlaskConical className="w-10 h-10 text-white animate-bounce" />
                <div className="space-y-2">
                  <h4 className="text-xl font-black uppercase tracking-tight">Rapid Response</h4>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest leading-loose">Need a custom stack protocol? Our AI diagnostics team is ready.</p>
                </div>
                <button className="w-full py-3 bg-white text-brand font-black text-[10px] uppercase tracking-widest hover:bg-brand-gold hover:text-brand-matte transition-luxury">Contact Command</button>
              </div>
            </div>
          </aside>

          <main className="flex-grow">
            {processedProducts.length > 0 ? (
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6' : 'flex flex-col gap-6'}`}>
                {processedProducts.map(product => (
                  <div key={product.id} className={`${viewMode === 'grid' ? 'flex justify-start' : 'w-full'}`}>
                    {viewMode === 'grid' ? (
                      <ProductCard product={product} />
                    ) : (
                      <div className="bg-white border border-brand-matte/5 p-6 flex items-center gap-8 group hover:border-brand-gold/30 transition-luxury">
                        <div className="w-24 h-24 bg-brand-warm border border-brand-matte/5 p-4 shrink-0">
                          <img src={product.image} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" alt={product.name} />
                        </div>
                        <div className="flex-grow space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-brand-gold text-[9px] font-black uppercase tracking-widest">{product.category} Series</span>
                            <div className="w-1 h-1 bg-brand-matte/20 rounded-full"></div>
                            <span className="text-brand-matte/30 text-[9px] font-bold uppercase tracking-widest">ID: {product.id}</span>
                          </div>
                          <h3 className="text-xl font-black text-brand-matte uppercase tracking-tight group-hover:text-brand transition-colors">{product.name}</h3>
                          <div className="flex items-center gap-4 pt-2">
                            <span className="text-2xl font-black text-brand italic tracking-tighter">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                              <span className="text-xs text-brand-matte/20 line-through font-bold">${product.originalPrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button className="bg-brand-matte text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold transition-luxury">Authorize</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-48 text-center space-y-12">
                <div className="w-32 h-32 bg-white border border-brand-matte/5 flex items-center justify-center mx-auto rounded-none rotate-45 shadow-2xl">
                  <Search className="w-12 h-12 text-brand-matte/10 -rotate-45" />
                </div>
                <div className="space-y-6">
                  <p className="text-5xl font-black text-brand-matte/5 uppercase tracking-tighter italic">No Registry Match</p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand-matte/40 italic max-w-sm mx-auto leading-relaxed">The requested protocol sequence is not found in the current archive.</p>
                  <div className="pt-10">
                    <button 
                      onClick={clearAllFilters}
                      className="text-brand-gold font-black uppercase tracking-[0.5em] text-[11px] border-b-2 border-brand-gold/20 pb-2 hover:text-brand hover:border-brand transition-luxury"
                    >
                      Reset Operational Calibration
                    </button>
                  </div>
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