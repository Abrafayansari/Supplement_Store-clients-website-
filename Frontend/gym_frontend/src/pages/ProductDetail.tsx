import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingBag, Check, ArrowLeft, ShieldCheck, Zap, FlaskConical, Beaker, FileText, Share2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { initialProducts } from '../data/Product.tsx';
import { useCart } from '../contexts/CartContext.tsx';
import { Product } from '../data/Product.tsx';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge.tsx';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'reviews'>('details');

  useEffect(() => {
    const found = initialProducts.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setSelectedFlavor(found.flavor || 'Standard');
    }
  }, [id]);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-warm">
        <div className="w-16 h-16 border-4 border-brand-gold border-t-transparent animate-spin"></div>
    </div>
  );

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
        addToCart(product);
    }
    toast.success(`Protocol ${product.name} initialized in cart.`);
  };

  return (
    <div className="bg-brand-warm min-h-screen pt-12 pb-48 selection:bg-brand selection:text-white">
      <div className="max-w-[1700px] mx-auto px-6 pt-24">
        
        {/* BREADCRUMB / NAV */}
        <div className="flex justify-between items-center mb-16">
          <button onClick={() => navigate(-1)} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-brand-matte/40 hover:text-brand transition-luxury group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-luxury" /> Return to Archive
          </button>
          <div className="flex gap-6">
            <button className="p-3 bg-white border border-brand-matte/5 hover:bg-brand-gold hover:text-white transition-luxury shadow-sm">
                <Heart className="w-4 h-4" />
            </button>
            <button className="p-3 bg-white border border-brand-matte/5 hover:bg-brand-gold hover:text-white transition-luxury shadow-sm">
                <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* LEFT: IMAGE GALLERY */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-6 space-y-8">
            <div className="aspect-[4/5] bg-white border border-brand-matte/5 p-16 relative overflow-hidden group shadow-2xl flex items-center justify-center">
              <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain transition-luxury group-hover:scale-105" />
              
              <div className="absolute top-12 left-12 flex flex-col gap-4">
                <Badge className="bg-brand-matte text-brand-gold px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] border border-brand-gold/30 rounded-none">ISO-9001 CERTIFIED</Badge>
                <Badge className="bg-brand text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 rounded-none">BATCH #V77-X</Badge>
              </div>
              
              <div className="absolute bottom-12 right-12 text-right">
                <p className="text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.4em]">Molecular Visualization</p>
                <p className="text-[9px] font-bold text-brand-matte/10 uppercase tracking-widest mt-1">Rendered at 4K Resolution</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-white border border-brand-matte/5 p-4 opacity-40 hover:opacity-100 cursor-pointer transition-luxury hover:border-brand-gold/40">
                        <img src={product.image} alt="preview" className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all" />
                    </div>
                ))}
            </div>
          </motion.div>

          {/* RIGHT: CONTENT */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-6 space-y-16 lg:pl-10">
            <div className="space-y-10">
              <div className="flex items-center gap-8">
                <div className="h-[2px] w-12 bg-brand"></div>
                <span className="text-[12px] font-black uppercase tracking-[0.8em] text-brand">Compound Analysis</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h1 className="text-6xl md:text-8xl font-black text-brand-matte uppercase tracking-tighter leading-none">{product.name}</h1>
                  <div className="bg-brand-gold/10 px-4 py-2 border border-brand-gold/20">
                    <div className="flex items-center gap-1 text-brand-gold">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-black text-brand-matte">{product.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <p className="text-5xl font-black text-brand italic tracking-tighter leading-none">${product.price.toFixed(2)}</p>
                  {product.originalPrice && (
                    <p className="text-xl text-brand-matte/20 line-through font-black italic tracking-tighter">${product.originalPrice.toFixed(2)}</p>
                  )}
                </div>
              </div>
            </div>

            <p className="text-2xl text-brand-matte/60 font-light leading-relaxed border-l-4 border-brand-gold/40 pl-10 italic">
              "{product.description}"
            </p>

            <div className="space-y-12 bg-white p-12 border border-brand-matte/5 shadow-xl">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-brand-matte">Protocol Configuration</h4>
                    <span className="text-[9px] font-bold text-brand-matte/30 uppercase tracking-widest">Select Variant</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {['Chocolate', 'Vanilla', 'Unflavored', 'Standard'].includes(selectedFlavor) ? (
                    ['Chocolate', 'Vanilla', 'Unflavored'].map(f => (
                      <button 
                        key={f} 
                        onClick={() => setSelectedFlavor(f)}
                        className={`px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] border transition-luxury ${selectedFlavor === f ? 'bg-brand-matte text-white border-brand-gold' : 'bg-brand-warm text-brand-matte border-brand-matte/5 hover:border-brand-gold/40'}`}
                      >
                        {f}
                      </button>
                    ))
                  ) : (
                    <button className="px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] bg-brand-matte text-white border border-brand-gold">
                        Standard Deployment
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center bg-brand-warm border border-brand-matte/5">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-8 hover:text-brand transition-luxury"><Minus size={18}/></button>
                  <span className="w-16 text-center font-black text-2xl tabular-nums">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-8 hover:text-brand transition-luxury"><Plus size={18}/></button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow btn-luxury px-12 py-8 text-[12px] font-black uppercase tracking-[0.5em] shadow-[0_20px_40px_rgba(123,15,23,0.2)] flex items-center justify-center gap-4"
                >
                  <ShoppingBag className="w-5 h-5" /> Initialize Protocol
                </button>
              </div>
            </div>

            {/* QUICK STATS GRID */}
            <div className="grid grid-cols-3 gap-6">
                {[
                    { icon: <ShieldCheck className="w-5 h-5" />, label: "Integrity", val: "99.9%" },
                    { icon: <Zap className="w-5 h-5" />, label: "Bio-Uptake", val: "FAST" },
                    { icon: <Beaker className="w-5 h-5" />, label: "Grade", val: "PHARMA" }
                ].map((stat, i) => (
                    <div key={i} className="text-center p-6 border border-brand-matte/5 bg-white space-y-3">
                        <div className="text-brand flex justify-center">{stat.icon}</div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-matte/30">{stat.label}</p>
                        <p className="text-xl font-black text-brand-matte tracking-tighter">{stat.val}</p>
                    </div>
                ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* DETAILED SPECS SECTION */}
      <section className="mt-48 max-w-[1700px] mx-auto px-6 border-t border-brand-matte/5 pt-32">
        <div className="flex flex-col lg:flex-row gap-24">
            
            <aside className="lg:w-1/3 space-y-12">
                <div className="space-y-4">
                    <h3 className="text-3xl font-black text-brand-matte uppercase tracking-tighter">TECHNICAL <br />SPECIFICATIONS</h3>
                    <div className="h-1 w-20 bg-brand-gold"></div>
                </div>
                <div className="space-y-1">
                    {[
                        { label: 'Deployment Batch', val: 'V-ARCHIVE-002' },
                        { label: 'Molecular Chain', val: 'High Density' },
                        { label: 'Synthesis Location', val: 'Sector 01' },
                        { label: 'Archive Status', val: 'Operational' },
                    ].map((spec, i) => (
                        <div key={i} className="flex justify-between py-5 border-b border-brand-matte/5 text-[11px] font-bold uppercase tracking-widest">
                            <span className="text-brand-matte/30">{spec.label}</span>
                            <span className="text-brand-matte font-black">{spec.val}</span>
                        </div>
                    ))}
                </div>
                <div className="p-8 bg-brand-matte text-white space-y-4">
                    <FileText className="w-8 h-8 text-brand-gold" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Download Batch COA</p>
                    <p className="text-white/40 text-[9px] leading-relaxed uppercase font-bold tracking-widest">Full laboratory analysis of molecular purity and heavy metal screening.</p>
                </div>
            </aside>

            <main className="flex-grow space-y-16">
                <div className="flex gap-16 border-b border-brand-matte/5">
                    {['details', 'ingredients', 'reviews'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-8 text-[12px] font-black uppercase tracking-[0.6em] transition-luxury relative ${activeTab === tab ? 'text-brand' : 'text-brand-matte/30 hover:text-brand-matte'}`}
                        >
                            {tab}
                            {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand" />}
                        </button>
                    ))}
                </div>

                <div className="min-h-[400px]">
                    {activeTab === 'details' && (
                        <div className="space-y-10">
                            <p className="text-3xl text-brand-matte/50 leading-relaxed italic font-light">
                                Engineered for elite physiology. This protocol utilizes advanced molecular isolation to maximize active compound yield while neutralizing unnecessary biological load.
                            </p>
                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <h4 className="text-xl font-black text-brand-matte uppercase tracking-tight">Rapid Response Synthesis</h4>
                                    <p className="text-[11px] font-bold text-brand-matte/40 leading-relaxed uppercase tracking-widest">Optimized for immediate biological uptake, reducing the gap between ingestion and physiological utility.</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xl font-black text-brand-matte uppercase tracking-tight">Zero Filler Integrity</h4>
                                    <p className="text-[11px] font-bold text-brand-matte/40 leading-relaxed uppercase tracking-widest">A clean synthesis protocol. No proprietary masking, no chemical additives, no compromises.</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'ingredients' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {['Molecular Isolated Base', 'Enzyme Catalyst V-1', 'Uptake Matrix', 'Amino Complex'].map(ing => (
                                <div key={ing} className="bg-white p-10 border border-brand-matte/5 flex items-center justify-between group hover:border-brand-gold/30 transition-luxury">
                                    <div>
                                        <span className="text-[12px] font-black uppercase tracking-widest text-brand-matte">{ing}</span>
                                        <p className="text-[9px] font-bold text-brand-matte/20 uppercase tracking-widest mt-1">Laboratory Sourced</p>
                                    </div>
                                    <FlaskConical className="text-brand-gold w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div className="space-y-12">
                            <div className="p-16 border-2 border-dashed border-brand-matte/10 text-center space-y-6">
                                <Beaker className="w-12 h-12 text-brand-matte/10 mx-auto" />
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-matte/40">Field Reports Pending Verification</p>
                                <button className="text-brand font-black uppercase tracking-widest text-[10px] underline underline-offset-8">Submit Your Protocol Log</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="mt-48 max-w-[1700px] mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
                <span className="text-brand font-black uppercase tracking-[0.4em] text-[10px]">Registry Suggestions</span>
                <h3 className="text-4xl font-black text-brand-matte uppercase tracking-tighter">COMPLEMENTARY STACKS</h3>
            </div>
            <button className="text-[11px] font-black uppercase tracking-widest border-b-2 border-brand-gold/20 pb-2 hover:border-brand transition-luxury">Archive Catalog</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {initialProducts.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                <div key={p.id} className="bg-white border border-brand-matte/5 p-8 text-center space-y-6 group cursor-pointer hover:shadow-2xl transition-luxury">
                    <img src={p.image} alt={p.name} className="h-40 w-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-matte group-hover:text-brand">{p.name}</h4>
                    <p className="text-lg font-black text-brand italic tracking-tighter">${p.price.toFixed(2)}</p>
                </div>
            ))}
        </div>
      </section>

    </div>
  );
};

export default ProductDetail;