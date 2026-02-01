import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Target, Award, FlaskConical, ChevronLeft, ChevronRight, Star, Badge } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Slider from '../../components/Slider.tsx';
import Categories from './Categories.tsx';
import ProductCard from '../../components/ProductCard.tsx';
import { fetchProducts } from '../../data/Product.tsx';
import { MOCK_PRODUCTS } from '../../mockData.ts';
import NexusLoader from '../../components/NexusLoader';
import AutomaticBannerSlider from '../../components/AutomaticBannerSlider';
import { Product } from '@/types.ts';

const Home: React.FC = () => {
  const heroRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { once: true });
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Mouse position for interactive effects
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const [initialProducts, setInitialProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [typedText, setTypedText] = React.useState('');
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const fullText = 'BIOLOGY';
  const productsPerSlide = 3;
  const totalSlides = initialProducts.length > 0 ? Math.ceil(initialProducts.length / productsPerSlide) : 1;

  // Mouse move handler for interactive effects
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  React.useEffect(() => {
    setLoading(true);
    fetchProducts({ sort: 'newest', limit: 10 })
      .then((res) => {
        console.log('Fetched products:', res.products);
        setInitialProducts(res.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    if (isInView) {
      let i = 0;
      const timer = setInterval(() => {
        setTypedText(fullText.slice(0, i + 1));
        i++;
        if (i === fullText.length) clearInterval(timer);
      }, 150);
      return () => clearInterval(timer);
    }
  }, [isInView]);

  // Navigation functions for New Arrivals slider
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Get the current slide products
  const getCurrentSlideProducts = () => {
    const startIndex = currentSlide * productsPerSlide;
    const products = initialProducts.slice(startIndex, startIndex + productsPerSlide);
    console.log('Current slide products:', products, 'for slide:', currentSlide);
    return products;
  };

  return (
    <div className="pb-0 overflow-x-hidden">
      {/* 1. HERO SECTION - Enhanced with Advanced Animations and Visuals */}

      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden py-32 lg:py-0 pt-20 bg-white">
        {/* Enhanced Background Elements with Parallax */}
        <motion.div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{ y }}
        >
          <motion.div
            className="absolute top-[-10%] right-[-5%] w-[60%] h-[120%] bg-gradient-to-br from-brand-warm via-brand/20 to-transparent rotate-12 -z-10"
            animate={{
              rotate: [12, 15, 12],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>

          {/* Animated Grid Pattern */}
          <motion.div
            className="absolute inset-0 z-[11] opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(90deg, #000 1px, transparent 1px), linear-gradient(#000 1px, transparent 1px)',
              backgroundSize: '100px 100px'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '100px 100px']
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          ></motion.div>

          {/* Gradient Mesh Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-brand/5 to-brand-warm/30"></div>

          {/* Floating Geometric Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-brand/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}

          <motion.div
            className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white to-transparent z-10"
            animate={{
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
        </motion.div>

        <div className="container mx-auto px-6 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-12"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
            }}
          >
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Badge className="bg-brand/5 text-brand border-brand/10 rounded-none px-4 py-1 text-[9px] font-black uppercase tracking-widest backdrop-blur-sm">
                    EST. 2023
                  </Badge>
                  <motion.div
                    className="absolute inset-0 bg-brand/10 rounded-none"
                    animate={{
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
                <motion.span
                  className="text-brand-matte/30 text-[9px] font-black uppercase tracking-[0.6em]"
                  animate={{
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  PREMIUM QUALITY
                </motion.span>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                <motion.h1
                  className="text-7xl md:text-9xl font-black uppercase leading-[0.85] tracking-tighter text-brand-matte"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(123, 15, 23, 0.1)",
                      "0 0 40px rgba(123, 15, 23, 0.2)",
                      "0 0 20px rgba(123, 15, 23, 0.1)"
                    ]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  BIO <br />
                  <motion.span
                    className="text-brand italic relative"
                    animate={{
                      color: ["#7B0F17", "#C9A277", "#7B0F17"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    ELITE
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand to-transparent"
                      animate={{
                        scaleX: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    />
                  </motion.span>
                  .
                </motion.h1>
                <motion.p
                  className="text-2xl md:text-3xl font-light text-brand-matte/20 uppercase tracking-tighter italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  High Performance Supplements
                </motion.p>
              </motion.div>
            </motion.div>

            <motion.div
              className="max-w-md space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
            >
              <motion.p
                className="text-base text-brand-matte/50 font-medium leading-relaxed"
                animate={{
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                The intersection of purity and human potential. We develop high-quality supplements for athletes demanding peak performance.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(123, 15, 23, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/products" className="btn-luxury px-12 py-6 text-[12px] flex items-center justify-center gap-5 rounded-none shadow-xl hover:shadow-brand/20 relative overflow-hidden group">
                    <motion.span
                      className="relative z-10"
                      animate={{
                        x: [0, 5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      SHOP ALL
                    </motion.span>
                    <motion.div
                      animate={{
                        x: [0, 5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.1
                      }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-brand via-brand-gold to-brand opacity-0 group-hover:opacity-20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(123, 15, 23, 0.05)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/about" className="px-12 py-6 text-[12px] font-black uppercase tracking-[0.4em] border border-brand-matte/10 hover:bg-brand-matte hover:text-white transition-luxury flex items-center justify-center rounded-none text-brand-matte relative overflow-hidden group">
                    <motion.span
                      className="relative z-10"
                      animate={{
                        letterSpacing: ["0.4em", "0.5em", "0.4em"]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      OUR PHILOSOPHY
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8 }}
                    />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-8 pt-8 border-t border-brand-matte/5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              {[
                { label: 'Absorption', val: '99.8%', delay: 0 },
                { label: 'Pure', val: 'Verified', delay: 0.2 },
                { label: 'Availability', val: 'In Stock', delay: 0.4 }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2 + stat.delay }}
                  whileHover={{
                    scale: 1.05,
                    y: -5
                  }}
                >
                  <motion.p
                    className="text-[10px] font-black text-brand-matte/20 uppercase tracking-widest mb-1"
                    animate={{
                      color: ["rgba(14, 14, 14, 0.2)", "rgba(123, 15, 23, 0.4)", "rgba(14, 14, 14, 0.2)"]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: stat.delay
                    }}
                  >
                    {stat.label}
                  </motion.p>
                  <motion.p
                    className="text-xl font-black text-brand-matte uppercase tracking-tighter italic"
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(123, 15, 23, 0)",
                        "0 0 10px rgba(123, 15, 23, 0.3)",
                        "0 0 0px rgba(123, 15, 23, 0)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: stat.delay + 1
                    }}
                  >
                    {stat.val}
                  </motion.p>
                  <motion.div
                    className="h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent mt-2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 2.5 + stat.delay }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 80 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.6, delay: 0.2 }}
            className="hidden lg:block lg:col-span-6 relative"
            style={{
              transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
            }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Enhanced Decorative Frame */}
              <motion.div
                className="absolute -top-10 -left-10 w-32 h-32 border-t-2 border-l-2 border-brand/20"
                animate={{
                  borderColor: ["rgba(123, 15, 23, 0.2)", "rgba(201, 162, 119, 0.4)", "rgba(123, 15, 23, 0.2)"]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-10 -right-10 w-32 h-32 border-b-2 border-r-2 border-brand/20"
                animate={{
                  borderColor: ["rgba(123, 15, 23, 0.2)", "rgba(201, 162, 119, 0.4)", "rgba(123, 15, 23, 0.2)"]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />

              <Slider products={initialProducts} loading={loading} />

              {/* Enhanced light pulse background */}
              <motion.div
                className="absolute -inset-20 bg-gradient-radial from-brand/5 via-transparent to-transparent blur-[120px] -z-10 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Additional floating elements */}
              <motion.div
                className="absolute -top-20 -right-20 w-16 h-16 border border-brand/10 rounded-full"
                animate={{
                  rotate: 360,
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute -bottom-16 -left-16 w-12 h-12 bg-brand/5 rounded-lg"
                animate={{
                  rotate: -360,
                  borderRadius: ["0%", "50%", "0%"]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AutomaticBannerSlider />

      {/* 3. NEW ARRIVALS SECTION - Enhanced White */}
      <motion.section
        className="bg-white py-24 border-b border-black/5 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Subtle animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(45deg, #fff 1px, transparent 1px), linear-gradient(-45deg, #fff 1px, transparent 1px)'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '20px 20px']
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Floating elements */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`arrivals-${i}`}
            className="absolute w-2 h-2 bg-brand-gold/20 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${30 + Math.random() * 40}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="flex justify-between items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h2
              className="text-4xl font-black uppercase tracking-tighter text-brand-gold"
              animate={{
                textShadow: [
                  "0 0 10px rgba(201, 162, 119, 0)",
                  "0 0 25px rgba(201, 162, 119, 0.4)",
                  "0 0 10px rgba(201, 162, 119, 0)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              New Arrivals
            </motion.h2>

            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                onClick={prevSlide}
                className="p-3 bg-brand-warm border border-brand-matte/10 text-brand-matte hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all rounded-none"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 20px rgba(201, 162, 119, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={nextSlide}
                className="p-3 bg-brand-warm border border-brand-matte/10 text-brand-matte hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all rounded-none"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 20px rgba(201, 162, 119, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {/* Enhanced Feature Image Card */}
            <motion.div
              className="lg:col-span-1 relative group overflow-hidden bg-brand-matte h-[420px] rounded-none"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.img
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800"
                alt="Support Muscle Growth"
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-brand-matte/80 to-transparent"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.p
                  className="text-brand-gold text-[10px] font-black uppercase tracking-widest mb-4"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(201, 162, 119, 0)",
                      "0 0 8px rgba(201, 162, 119, 0.5)",
                      "0 0 0px rgba(201, 162, 119, 0)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Supports Muscle Growth
                </motion.p>
                <motion.h3
                  className="text-3xl font-black text-white uppercase tracking-tighter leading-tight mb-8"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(255, 255, 255, 0)",
                      "0 0 15px rgba(255, 255, 255, 0.2)",
                      "0 0 0px rgba(255, 255, 255, 0)"
                    ]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  Must-Have <br /> Supplements For
                </motion.h3>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/products" className="bg-white text-brand-matte py-4 px-8 text-[11px] font-black uppercase tracking-[0.2em] w-fit hover:bg-brand-gold hover:text-white transition-luxury relative overflow-hidden group/btn">
                    <motion.span
                      animate={{
                        letterSpacing: ["0.2em", "0.25em", "0.2em"]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      Shop Now
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-brand-gold to-brand opacity-0 group-hover/btn:opacity-20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </Link>
                </motion.div>
              </motion.div>

              {/* Decorative corner elements */}
              <motion.div
                className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/20"
                animate={{
                  borderColor: ["rgba(255, 255, 255, 0.2)", "rgba(201, 162, 119, 0.4)", "rgba(255, 255, 255, 0.2)"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            {/* Enhanced Product Cards Row */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {loading ? (
                <motion.div
                  className="flex items-center justify-center h-full min-h-[400px]"
                  animate={{
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <NexusLoader />
                </motion.div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.15
                      }
                    }
                  }}
                  initial="visible"
                  animate="visible"
                >
                  {getCurrentSlideProducts().length > 0 ? (
                    getCurrentSlideProducts().map((product, index) => (
                      <motion.div
                        key={`${product.id}-${currentSlide}`}
                        className="flex justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          ease: "easeOut"
                        }}
                        whileHover={{ y: -5 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))
                  ) : (
                    // Fallback for debugging
                    <div className="col-span-3 text-center text-brand-matte/50">
                      <p>No products available</p>
                      {/* <p className="text-sm">Products array length: {initialProducts.length}</p>
                      <p className="text-sm">Current slide: {currentSlide}</p> */}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>


      {/* 2. FEATURED REGISTRY - Enhanced Dark */}
      <motion.section
        className="bg-brand-matte py-32 border-t border-white/5 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                className="text-brand font-black uppercase tracking-[0.5em] text-[12px] inline-block"
                animate={{
                  textShadow: [
                    "0 0 0px rgba(123, 15, 23, 0)",
                    "0 0 15px rgba(123, 15, 23, 0.5)",
                    "0 0 0px rgba(123, 15, 23, 0)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Our Categories
              </motion.span>
              <motion.h2
                className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white"
                animate={{
                  textShadow: [
                    "0 0 0px rgba(255, 255, 255, 0)",
                    "0 0 20px rgba(255, 255, 255, 0.1)",
                    "0 0 0px rgba(255, 255, 255, 0)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                Top Collections
              </motion.h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/products" className="text-brand-gold font-black uppercase tracking-[0.3em] text-[12px] border-b-2 border-brand-gold/20 pb-2 hover:text-brand-matte hover:border-brand-matte transition-luxury relative group">
                  <motion.span
                    animate={{
                      letterSpacing: ["0.3em", "0.35em", "0.3em"]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Shop All Products
                  </motion.span>
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <Categories />
          </motion.div>
        </div>
      </motion.section>



      {/* 4. STATS AREA - Matte Black (#0E0E0E) */}
      <section className="py-40 bg-brand-matte border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-24 text-center relative z-10">
          {[
            { label: 'Integrity', val: '100%', sub: 'Third-Party Testing', icon: <ShieldCheck className="w-12 h-12 text-brand mx-auto" /> },
            { label: 'Absorption', val: 'MAX', sub: 'Maximum Results', icon: <Zap className="w-12 h-12 text-brand-gold mx-auto" /> },
            { label: 'Results', val: 'PROVEN', sub: 'Lab Tested', icon: <Target className="w-12 h-12 text-white mx-auto" /> }
          ].map((stat, i) => (
            <div key={i} className="space-y-8 group">
              <div className="group-hover:scale-125 transition-transform duration-700">
                {stat.icon}
              </div>
              <div className="space-y-3">
                <p className="text-brand-gold font-black uppercase tracking-widest text-[12px] opacity-40 group-hover:opacity-100 transition-opacity">{stat.label}</p>
                <h3 className="text-8xl lg:text-8xl md:text-8xl font-black text-white italic tracking-tighter leading-none">{stat.val}</h3>
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
              <span className="text-brand font-black uppercase tracking-[0.4em] text-[11px]">Our Mission</span>
              <h2 className="text-5xl font-black text-brand-matte uppercase tracking-tighter leading-tight">
                SCIENCE OVER <span className="text-brand-gold italic">SPECULATION</span>
              </h2>
            </div>
            <p className="text-lg text-brand-matte/60 leading-relaxed font-light">
              Nexus was born from a singular frustration: the supplement industry's obsession with marketing over quality. We dismantled the traditional model to build a brand centered on transparency, high-quality ingredients, and proven results.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-matte text-brand-gold flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-sm text-brand-matte">Quality Standards</h4>
                <p className="text-[10px] text-brand-matte/50 leading-loose uppercase font-bold tracking-widest">Every batch is verified through third-party testing.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-matte text-brand-gold flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-sm text-brand-matte">Maximum Absorption</h4>
                <p className="text-[10px] text-brand-matte/50 leading-loose uppercase font-bold tracking-widest">Optimized absorption rates for immediate results.</p>
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
              desc: "Targeted formulas designed for specific fitness goals."
            },
            {
              icon: <Award className="w-12 h-12 text-brand-gold" />,
              title: "ELITE STATUS",
              desc: "Supplying the nutritional foundation for world-class athletes."
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
            Our labs operate at ISO-9001 and cGMP standards, utilizing advanced laboratory testing to ensure every gram of powder meets our exact specifications.
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
          <span className="text-[300px] font-black text-brand-matte uppercase select-none leading-none tracking-tighter">NEXUS</span>
        </div>
        <div className="container mx-auto px-6 relative z-10 space-y-16">
          <h2 className="text-6xl md:text-[9rem] font-black uppercase tracking-tighter leading-[0.8] text-brand-matte">START <br /><span className="text-brand">YOUR JOURNEY</span></h2>
          <p className="text-brand-matte/50 max-w-2xl mx-auto italic text-xl leading-relaxed">Choose the most advanced supplement brand for your fitness goals.</p>
          <div className="flex justify-center">
            <Link to="/signup" className="btn-luxury px-16 py-8 text-[14px] rounded-none shadow-[0_30px_60px_rgba(123,15,23,0.15)] hover:shadow-brand-gold/20">Join Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;