
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Target, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative h-[60vh] bg-brand-matte flex items-center justify-center text-center">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1574680077505-ef74a4ef2441?auto=format&fit=crop&q=80&w=2000"
            alt="The Lab"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-matte/60"></div>
        </div>
        <div className="relative z-10 px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
              OUR <span className="text-brand">PHILOSOPHY</span>
            </h1>
            <p className="text-brand-gold text-[12px] font-black uppercase tracking-[0.6em]">Optimizing Human Performance Since 2023</p>
          </motion.div>
        </div>
      </section>

      {/* 2. Core Values */}
      <section className="py-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-brand font-black uppercase tracking-[0.4em] text-[11px]">Our Core Mission</span>
              <h2 className="text-5xl font-black text-brand-matte uppercase tracking-tighter leading-tight">
                SCIENCE OVER <span className="text-brand-gold italic">SPECULATION</span>
              </h2>
            </div>
            <p className="text-lg text-brand-matte/60 leading-relaxed font-light">
              Nexus was born from a singular frustration: the supplement industry's obsession with marketing over results. We dismantled the traditional model to build a brand centered on transparency, high-quality ingredients, and proven results.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-matte text-brand-gold flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-sm">Purity Standards</h4>
                <p className="text-xs text-brand-matte/50 leading-loose uppercase font-bold tracking-widest">Every batch is verified through third-party lab analysis.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-matte text-brand-gold flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-sm">Maximum Absorption</h4>
                <p className="text-xs text-brand-matte/50 leading-loose uppercase font-bold tracking-widest">Optimized absorption rates for immediate results.</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/5] bg-brand-warm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=1000"
              className="w-full h-full object-cover grayscale brightness-75 hover:scale-105 transition-transform duration-1000"
              alt="The Standard"
            />
            <div className="absolute inset-0 border-[20px] border-white/10 m-10"></div>
          </div>
        </div>
      </section>

      {/* 3. The Promise Section */}
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

      {/* 4. Quality Section */}
      <section className="py-32 bg-brand-warm">
        <div className="container mx-auto px-6 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-brand-matte uppercase tracking-tighter">CERTIFIED <span className="text-brand">FACILITIES</span></h2>
            <div className="h-1 w-24 bg-brand-gold mx-auto"></div>
          </div>
          <p className="max-w-3xl mx-auto text-xl text-brand-matte/60 font-light leading-relaxed">
            Our labs operate at ISO-9001 and cGMP standards, utilizing advanced laboratory testing to ensure every gram of powder meets our exact specifications.
          </p>
          <div className="flex flex-wrap justify-center gap-20 opacity-30 grayscale">
            <div className="text-4xl font-black tracking-tighter uppercase">ISO-9001</div>
            <div className="text-4xl font-black tracking-tighter uppercase">cGMP</div>
            <div className="text-4xl font-black tracking-tighter uppercase">LAB-TESTED</div>
            <div className="text-4xl font-black tracking-tighter uppercase">NSF-CERT</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
