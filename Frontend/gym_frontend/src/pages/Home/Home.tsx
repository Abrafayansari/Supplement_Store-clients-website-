import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Target, Award, ShoppingCart, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchProducts, getCategories } from '../../data/Product.tsx';
import NexusLoader from '../../components/NexusLoader';
import AutomaticBannerSlider from '../../components/AutomaticBannerSlider';
import { Product } from '@/types.ts';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [initialProducts, setInitialProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sliderWidth, setSliderWidth] = React.useState(0);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  // Shop by Goal state - Dynamic Categories
  const [dynamicCategories, setDynamicCategories] = React.useState<string[]>([]);
  const [goalProducts, setGoalProducts] = React.useState<{ [key: string]: Product[] }>({});
  const [goalImageIndices, setGoalImageIndices] = React.useState<{ [key: string]: number }>({});

  // 1. Fetch Top 10 New Arrivals
  React.useEffect(() => {
    const retryFetch = async () => {
      setLoading(true);
      try {
        const res = await fetchProducts({ sort: 'newest', limit: 10 });
        setInitialProducts(res.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    retryFetch();
  }, []);

  // 2. Fetch Goal Categories
  React.useEffect(() => {
    const fetchGoalCategories = async () => {
      try {
        const categories = await getCategories();
        const categoryNames = categories.map(c => c.name);
        const products: { [key: string]: Product[] } = {};
        const imageIndices: { [key: string]: number } = {};
        const validCategories: string[] = [];

        for (const categoryName of categoryNames) {
          try {
            const res = await fetchProducts({ category: categoryName, limit: 3 });
            const productsWithImages = res.products.filter(p => p.images && p.images.length > 0);
            if (productsWithImages.length > 0) {
              products[categoryName] = productsWithImages;
              imageIndices[categoryName] = 0;
              validCategories.push(categoryName);
            }
          } catch (err) {
            console.error(`Failed to fetch products for ${categoryName}:`, err);
          }
        }
        setDynamicCategories(validCategories);
        setGoalProducts(products);
        setGoalImageIndices(imageIndices);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchGoalCategories();
  }, []);

  // 3. Auto-rotate images for each category
  React.useEffect(() => {
    const intervals = dynamicCategories.map((categoryName) => {
      return setInterval(() => {
        setGoalImageIndices(prev => ({
          ...prev,
          [categoryName]: (prev[categoryName] + 1) % (goalProducts[categoryName]?.length || 1)
        }));
      }, 4000);
    });
    return () => intervals.forEach(clearInterval);
  }, [dynamicCategories, goalProducts]);

  // 4. Update slider width
  React.useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.scrollWidth - sliderRef.current.offsetWidth);
    }
  }, [initialProducts]);

  return (
    <div className="pb-0 overflow-x-hidden bg-[#FAFAFA]">
      {/* Hero Banner Slider */}
      <AutomaticBannerSlider />

      {/* Headline moved into AutomaticBannerSlider to reuse fetched banners and avoid extra API calls */}

      {/* New Arrivals - White Background, Medium Circles Centered */}
      <section id="new-arrivals" className="py-20 bg-white overflow-hidden border-b border-brand-matte/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <span className="text-brand text-[10px] md:text-xs font-black tracking-[0.5em] uppercase block opacity-60 mb-4">The Latest Drops</span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-brand-matte leading-tight mb-8">
              New <span className="text-brand-gold italic">Arrivals</span>
            </h2>
            <div className="w-16 h-1 bg-brand-gold mx-auto opacity-30"></div>
        </div>

        <div className="relative cursor-grab active:cursor-grabbing overflow-hidden py-4 px-4 sm:px-6">
          <motion.div
            ref={sliderRef}
            drag="x"
            dragConstraints={{ right: 0, left: -sliderWidth }}
            className="flex gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center justify-center min-w-full"
          >
            {initialProducts.length > 0 ? (
              initialProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="min-w-[220px] sm:min-w-[260px] md:min-w-[300px] lg:min-w-[320px] flex flex-col items-center group cursor-pointer"
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative w-full aspect-square flex items-center justify-center">
                    <motion.div
                      className="relative w-[220px] h-[220px] sm:w-[260px] h-[260px] md:w-[300px] h-[300px] lg:w-[320px] h-[320px] bg-brand-warm/20 group-hover:bg-brand-warm/40 border border-brand-matte/5 rounded-full flex items-center justify-center overflow-hidden transition-all duration-700 shadow-sm"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain p-10 md:p-14 group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      
                      {/* Circle Overlay - Forced Circular Shape */}
                      <div className="absolute inset-0 bg-brand-matte/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px] rounded-full">
                        <div className="bg-brand text-white px-5 py-3 flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all">
                          <Eye size={16} />
                          <span className="text-[9px] font-black uppercase tracking-widest">View</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="mt-8 space-y-1 text-center px-4 w-full">
                    <span className="text-[9px] font-black text-brand-gold uppercase tracking-[0.4em] block mb-1">{product.subCategory}</span>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-brand-matte group-hover:text-brand transition-colors duration-500 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-brand font-black text-base md:text-lg italic tracking-tighter">Rs.{product.price}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="w-full flex justify-center py-20">
                <NexusLoader />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Shop by Goal - Restored Internal Vibrancy */}
      <section className="bg-brand-warm py-20 px-6 border-y border-brand-matte/5 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-brand-matte">
              SHOP BY GOAL
            </h2>
            <div className="w-16 h-1 bg-brand-gold mx-auto mt-4"></div>
          </div>
          
          <div className="relative group">
            {/* Navigation Buttons */}
            <button 
              onClick={() => {
                const el = document.getElementById('goal-slider');
                if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
            >
              <ChevronLeft className="w-5 h-5 text-brand" />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('goal-slider');
                if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow-xl p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
            >
              <ChevronRight className="w-5 h-5 text-brand" />
            </button>

            <div 
              id="goal-slider"
              className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory px-2"
            >
              {dynamicCategories.length === 0 ? (
                <div className="w-full py-20 text-center text-brand-matte/40 font-black uppercase tracking-widest">
                  Loading categories...
                </div>
              ) : (
                dynamicCategories.map((categoryName, index) => {
                  const products = goalProducts[categoryName] || [];
                  const currentImageIdx = goalImageIndices[categoryName] || 0;
                  const currentImage = products[currentImageIdx]?.images?.[0];
                  return (
                    <motion.div
                      key={index}
                      className="min-w-[280px] md:min-w-[320px] lg:min-w-[350px] relative group cursor-pointer aspect-[3/4] overflow-hidden rounded-sm shadow-lg snap-start"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate(`/products?category=${categoryName}`)}
                    >
                      {/* Full Bleed Image - No Grayscale, No Brightness Decrease */}
                      {currentImage ? (
                        <motion.img
                          src={currentImage}
                          alt={categoryName}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-brand-matte/10 animate-pulse" />
                      )}
                      
                      {/* Minimal Bottom Gradient Overlay for Text Legibility only */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Category Label at bottom center */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 z-10 text-center">
                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white leading-tight drop-shadow-2xl">
                          {categoryName}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Area */}
      <section className="py-24 md:py-32 bg-brand-matte border-y border-brand-matte/20 relative overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20 text-center relative z-10">
          {[
            { label: 'Integrity', val: '100%', sub: 'Third-Party Testing', icon: <ShieldCheck className="w-10 h-10 text-brand mx-auto" strokeWidth={1} /> },
            { label: 'Absorption', val: 'MAX', sub: 'Maximum Results', icon: <Zap className="w-10 h-10 text-brand-gold mx-auto" strokeWidth={1} /> },
            { label: 'Results', val: 'PROVEN', sub: 'Lab Tested', icon: <Target className="w-10 h-10 text-white mx-auto" strokeWidth={1} /> }
          ].map((stat, i) => (
            <div key={i} className="space-y-6 group">
              <div className="group-hover:scale-110 transition-transform duration-700 opacity-60">
                {stat.icon}
              </div>
              <div className="space-y-2">
                <p className="text-brand-gold font-black uppercase tracking-widest text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">{stat.label}</p>
                <h3 className="text-6xl md:text-7xl font-black text-brand-warm italic tracking-tighter leading-none">{stat.val}</h3>
                <p className="text-brand-warm/10 text-[9px] font-bold uppercase tracking-[0.4em]">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-brand-warm container mx-auto px-6 max-w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-3">
              <span className="text-brand font-black uppercase tracking-[0.4em] text-[10px]">Our Mission</span>
              <h2 className="text-3xl md:text-5xl font-black text-brand-matte uppercase tracking-tighter leading-tight">
                SCIENCE OVER <br /> <span className="text-brand-gold italic">SPECULATION</span>
              </h2>
            </div>
            <p className="text-base text-brand-matte/60 leading-relaxed font-light max-w-xl">
              Nexus was born from a singular frustration: the supplement industry's obsession with marketing over quality. We build a brand centered on transparency, high-quality ingredients, and proven results.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-brand-matte text-brand-gold flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-xs text-brand-matte">Quality Standards</h4>
                <p className="text-[9px] text-brand-matte/50 leading-loose uppercase font-bold tracking-widest">Every batch is verified through testing.</p>
              </div>
              <div className="space-y-4">
                <div className="w-10 h-10 bg-brand-matte text-brand-gold flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-xs text-brand-matte">Absorption</h4>
                <p className="text-[9px] text-brand-matte/50 leading-loose uppercase font-bold tracking-widest">Optimized for immediate results.</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/5] bg-brand-warm rounded-sm overflow-hidden shadow-xl group">
            <img
              src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=1000"
              className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000"
              alt="The Standard"
            />
            <div className="absolute inset-0 border-[10px] md:border-[20px] border-brand-matte/10 m-6 group-hover:border-brand-gold/30 transition-all duration-700"></div>
          </div>
        </div>
      </section>

      {/* The Promise Area */}
      <section className="py-24 md:py-32 bg-brand-matte text-brand-warm relative">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          {[
            { icon: <Target className="w-10 h-10 text-brand mx-auto" />, title: "PRECISION", desc: "Targeted formulas." },
            { icon: <Award className="w-10 h-10 text-brand-gold mx-auto" />, title: "PREMIUM", desc: "For world-class athletes." },
            { icon: <ShieldCheck className="w-10 h-10 text-white mx-auto" />, title: "INTEGRITY", desc: "Zero proprietary blends." }
          ].map((item, idx) => (
            <div key={idx} className="space-y-6">
              {item.icon}
              <h3 className="text-xl font-black uppercase tracking-[0.4em]">{item.title}</h3>
              <p className="text-brand-warm/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed px-4">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quality Assurance */}
      {/* <section className="py-20 bg-brand-warm border-y border-brand-matte/5">
        <div className="container mx-auto px-6 text-center space-y-12">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-5xl font-black text-brand-matte uppercase tracking-tighter">CERTIFIED FACILITIES</h2>
            <div className="h-1 w-16 bg-brand-gold mx-auto"></div>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-brand-matte/60 font-light leading-relaxed">
            Operating at ISO-9001 and cGMP standards.
          </p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-16 opacity-30 grayscale pointer-events-none">
            <div className="text-2xl md:text-3xl font-black text-brand-matte">ISO-9001</div>
            <div className="text-2xl md:text-3xl font-black text-brand-matte">cGMP</div>
            <div className="text-2xl md:text-3xl font-black text-brand-matte">NSF-CERT</div>
          </div>
        </div>
      </section> */}

      {/* Final CTA */}
      <section className="bg-brand-warm py-40 md:py-52 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none">
          <span className="text-[200px] md:text-[400px] font-black text-brand-matte uppercase tracking-tighter">NEXUS</span>
        </div>
        <div className="container mx-auto px-6 relative z-10 space-y-12">
          <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] text-brand-matte">
            START <br /><span className="text-brand italic">THE JOURNEY</span>
          </h2>
          <p className="text-brand-matte/50 max-w-xl mx-auto italic text-lg md:text-xl">Choose the elite supplement brand.</p>
          <div className="flex justify-center pt-4">
            <Link to="/signup" className="btn-luxury px-12 md:px-16 py-6 md:py-8 text-[12px] md:text-[14px]">Join Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;