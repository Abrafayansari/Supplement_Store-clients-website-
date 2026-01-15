import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Target, Award, FlaskConical, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Slider from '../../components/Slider.tsx';
import Categories from './Categories.tsx';
import ProductCard from '../../components/ProductCard.tsx';
import { fetchProducts } from '../../data/Product.tsx';

const Home: React.FC = () => {

  const [initialProducts, setInitialProducts] = React.useState<Array<any>>([]);

  React.useEffect(() => {
   
       fetchProducts({ sort: 'newest', limit: 10 }).then(( res) => setInitialProducts(res.products))
       .catch(console.error);
      
      }, []);

  // Get the first 3 products marked as 'isNew' to populate the New Arrivals section
   ;

  return (
    <div className="pb-0 overflow-x-hidden">
      {/* 1. HERO SECTION - Overpowered Matte Black (#0E0E0E) */}
      <section className="relative min-h-screen flex items-center overflow-hidden py-32 lg:py-0 pt-20 bg-brand-matte">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-brand-matte z-10"></div>
          {/* Elite Gold Grid */}
          <div className="absolute inset-0 z-[11] opacity-[0.04] pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(#C9A24D 1.5px, transparent 1.5px)', 
              backgroundSize: '54px 54px' 
            }}
          ></div>
          <img 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover grayscale opacity-5" 
            alt="Elite Operations"
          />
        </div>

        <div className="container mx-auto px-6 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center py-20">
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-12"
          >
            <div className="flex items-center gap-6">
              <span className="h-[2px] w-20 bg-brand-gold"></span>
              <span className="text-brand-gold text-[11px] font-black uppercase tracking-[0.8em] animate-pulse">DEPLOYMENT PROTOCOL 01</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-8xl xl:text-[5.5rem] font-black uppercase leading-[0.8] tracking-tighter text-white">
                PRECISION <br />
                <span className="shine-gold">BIOLOGY </span>.
              </h1>
              <div className="h-2 w-32 bg-brand rounded-none"></div>
            </div>
            
            <p className="text-base md:text-lg text-white/30 max-w-xl font-light leading-relaxed italic border-l-4 border-brand-gold/20 pl-10">
              Forged in pursuit of total physiological dominance. PureVigor compounds represent the convergence of pharmaceutical isolation and human performance.
            </p>
            
            <div className="space-y-16">
              <div className="flex flex-col sm:flex-row gap-8 pt-4">
                <Link to="/products" className="btn-luxury px-12 py-6 text-[12px] flex items-center justify-center gap-5 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-luxury">
                  DEPLOY CATALOG <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="px-12 py-6 text-[12px] font-black uppercase tracking-[0.4em] border border-white/10 cursor-default flex items-center justify-center rounded-none opacity-50">
                  EST. 2023
                </div>
              </div>

              <div className="flex flex-wrap gap-8 pt-12 border-t border-white/5">
                {[
                  { icon: <ShieldCheck className="w-5 h-5 text-brand-gold" />, label: 'PERFECT 100%', sub: 'Molecular Integrity' },
                  { icon: <FlaskConical className="w-5 h-5 text-brand-gold" />, label: 'LAB CERTIFIED', sub: 'Grade-A Isolation' },
                  { icon: <Award className="w-5 h-5 text-brand-gold" />, label: 'ELITE STATUS', sub: 'Verified Protocol' }
                ].map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-4 group/badge cursor-default">
                    <div className="p-4 bg-white/5 rounded-none group-hover/badge:bg-brand transition-all duration-500 shadow-xl border border-white/5 group-hover/badge:rotate-3">
                      {badge.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">{badge.label}</p>
                      <p className="text-[8px] text-white/10 font-bold uppercase tracking-tight">{badge.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, x: 80 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.6, delay: 0.4 }}
            className="hidden lg:block lg:col-span-6 relative"
          >
            <div className="relative z-10 flex justify-end">
              <Slider />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand/5 blur-[160px] rounded-full -z-10 animate-pulse"></div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED REGISTRY - Warm White (#FAFAFA) */}
      <section className="bg-brand-warm py-32 border-t border-black/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="space-y-4">
              <span className="text-brand font-black uppercase tracking-[0.5em] text-[12px]">Deployment Active</span>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-brand-matte">Elite Registry</h2>
            </div>
            <Link to="/products" className="text-brand-gold font-black uppercase tracking-[0.3em] text-[12px] border-b-2 border-brand-gold/20 pb-2 hover:text-brand-matte hover:border-brand-matte transition-luxury">
              Browse All Modules
            </Link>
          </div>
          <Categories />
        </div>
      </section>

      {/* 3. NEW ARRIVALS SECTION - White */}
      <section className="bg-white py-24 border-b border-black/5">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-brand-matte">New Arrivals</h2>
            <div className="flex gap-2">
              <button className="p-2 bg-[#F4F4F4] hover:bg-brand-gold hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 bg-[#F4F4F4] hover:bg-brand-gold hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Feature Image Card - Styled to match ProductCard height */}
            <div className="lg:col-span-1 relative group overflow-hidden bg-brand-matte h-[420px] rounded-none">
              <img 
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800" 
                alt="Support Muscle Growth" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-brand-matte/80 to-transparent">
                <p className="text-brand-gold text-[10px] font-black uppercase tracking-widest mb-4">Supports Muscle Growth</p>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight mb-8">
                  Must-Have <br /> Supplements For
                </h3>
                <Link to="/products" className="bg-white text-brand-matte py-4 px-8 text-[11px] font-black uppercase tracking-[0.2em] w-fit hover:bg-brand-gold hover:text-white transition-luxury">
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Product Cards Row - Using the ProductCard component */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {initialProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="flex justify-center">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATS AREA - Matte Black (#0E0E0E) */}
      <section className="py-40 bg-brand-matte border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-24 text-center relative z-10">
          {[
            { label: 'Integrity', val: '100%', sub: 'Molecular Trace Analysis', icon: <ShieldCheck className="w-12 h-12 text-brand mx-auto" /> },
            { label: 'Uptake', val: 'MAX', sub: 'Bio-Available Delivery', icon: <Zap className="w-12 h-12 text-brand-gold mx-auto" /> },
            { label: 'Command', val: 'STABLE', sub: 'Protocol Validated', icon: <Target className="w-12 h-12 text-white mx-auto" /> }
          ].map((stat, i) => (
            <div key={i} className="space-y-8 group">
              <div className="group-hover:scale-125 transition-transform duration-700">
                {stat.icon}
              </div>
              <div className="space-y-3">
                <p className="text-brand-gold font-black uppercase tracking-widest text-[12px] opacity-40 group-hover:opacity-100 transition-opacity">{stat.label}</p>
                <h3 className="text-8xl md:text-9xl font-black text-white italic tracking-tighter leading-none">{stat.val}</h3>
                <p className="text-white/10 text-[11px] font-bold uppercase tracking-[0.4em]">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CORE VALUES (From About) - White */}
      <section className="py-32 bg-white container mx-auto px-6 max-w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center px-6">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-brand font-black uppercase tracking-[0.4em] text-[11px]">The Prime Directive</span>
              <h2 className="text-5xl font-black text-brand-matte uppercase tracking-tighter leading-tight">
                SCIENCE OVER <span className="text-brand-gold italic">SPECULATION</span>
              </h2>
            </div>
            <p className="text-lg text-brand-matte/60 leading-relaxed font-light">
              PureVigor was born from a singular frustration: the supplement industry's obsession with marketing over molecules. We dismantled the traditional model to build a brand centered on transparency, pharmaceutical-grade isolation, and biological efficacy.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-matte text-brand-gold flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-sm text-brand-matte">Purity Protocol</h4>
                <p className="text-[10px] text-brand-matte/50 leading-loose uppercase font-bold tracking-widest">Every batch is verified through third-party molecular analysis.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-matte text-brand-gold flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-sm text-brand-matte">Peak Bio-Yield</h4>
                <p className="text-[10px] text-brand-matte/50 leading-loose uppercase font-bold tracking-widest">Optimized absorption rates for immediate biological response.</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/5] bg-brand-warm overflow-hidden shadow-2xl">
             <img 
              src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover grayscale brightness-75 hover:scale-105 transition-transform duration-1000" 
              alt="The Standard" 
            />
            <div className="absolute inset-0 border-[20px] border-white/10 m-10"></div>
          </div>
        </div>
      </section>

      {/* 6. THE PROMISE (From About) - Matte Black */}
      <section className="py-40 bg-brand-matte text-white relative">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20">
          {[
            { 
              icon: <Target className="w-12 h-12 text-brand" />, 
              title: "PRECISION", 
              desc: "Targeted formulae designed for specific metabolic outcomes." 
            },
            { 
              icon: <Award className="w-12 h-12 text-brand-gold" />, 
              title: "ELITE STATUS", 
              desc: "Supplying the chemical foundation for world-class athletes." 
            },
            { 
              icon: <ShieldCheck className="w-12 h-12 text-white" />, 
              title: "INTEGRITY", 
              desc: "Full label disclosure. Zero proprietary blends. Zero fillers." 
            }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-8">
              {item.icon}
              <h3 className="text-2xl font-black uppercase tracking-[0.4em]">{item.title}</h3>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed px-4">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. QUALITY ASSURANCE (From About) - Warm White */}
      <section className="py-32 bg-brand-warm border-y border-black/5">
        <div className="container mx-auto px-6 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-brand-matte uppercase tracking-tighter">CERTIFIED <span className="text-brand">FACILITIES</span></h2>
            <div className="h-1 w-24 bg-brand-gold mx-auto"></div>
          </div>
          <p className="max-w-3xl mx-auto text-xl text-brand-matte/60 font-light leading-relaxed">
            Our labs operate at ISO-9001 and cGMP standards, utilizing the latest in liquid chromatography and mass spectrometry to ensure every gram of powder meets our exact specifications.
          </p>
          <div className="flex flex-wrap justify-center gap-20 opacity-30 grayscale pointer-events-none">
            <div className="text-4xl font-black tracking-tighter uppercase text-brand-matte">ISO-9001</div>
            <div className="text-4xl font-black tracking-tighter uppercase text-brand-matte">cGMP</div>
            <div className="text-4xl font-black tracking-tighter uppercase text-brand-matte">LAB-TESTED</div>
            <div className="text-4xl font-black tracking-tighter uppercase text-brand-matte">NSF-CERT</div>
          </div>
        </div>
      </section>

      {/* 8. CTA SECTION - Warm White (#FAFAFA) */}
      <section className="bg-brand-warm py-40 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none">
           <span className="text-[300px] font-black text-brand-matte uppercase select-none leading-none tracking-tighter">VIGOR</span>
        </div>
        <div className="container mx-auto px-6 relative z-10 space-y-16">
          <h2 className="text-6xl md:text-[9rem] font-black uppercase tracking-tighter leading-[0.8] text-brand-matte">INITIALIZE <br /><span className="text-brand">YOUR PROTOCOL</span></h2>
          <p className="text-brand-matte/50 max-w-2xl mx-auto italic text-xl leading-relaxed">Secure your clearance for the most advanced biological optimization network on the planet.</p>
          <div className="flex justify-center">
             <Link to="/signup" className="btn-luxury px-16 py-8 text-[14px] rounded-none shadow-[0_30px_60px_rgba(123,15,23,0.15)] hover:shadow-brand-gold/20">Secure Operational Access</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;