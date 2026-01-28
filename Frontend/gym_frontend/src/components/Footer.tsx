
import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-matte border-t border-brand-gold/20 text-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-white">
              <img src="/src/assets/nexus_logo.jpg" alt="Nexus Logo" className="h-10 w-auto object-contain" />
              <span className="text-3xl font-black tracking-tighter uppercase">
                NEXUS
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Engineered for the elite. 100% verified compounds for maximum human biological output. High performance. Zero compromise.
            </p>
            <div className="flex space-x-6">
              <Instagram className="w-5 h-5 hover:text-brand-gold cursor-pointer transition-luxury" />
              <Youtube className="w-5 h-5 hover:text-brand-gold cursor-pointer transition-luxury" />
              <Twitter className="w-5 h-5 hover:text-brand-gold cursor-pointer transition-luxury" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.4em] text-[10px] mb-10">Protocols</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em]">
              <li><a href="#" className="hover:text-brand-gold transition-luxury">Muscle Synthesis</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-luxury">Neural Clarity</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-luxury">Bio-Optimization</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.4em] text-[10px] mb-10">Intelligence</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em]">
              <li><a href="#" className="hover:text-brand-gold transition-luxury">Logistics</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-luxury">Molecular Reports</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-luxury">Contact Command</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-[0.4em] text-[10px] mb-10">Base Base</h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-[0.2em]">
              <li className="flex items-center gap-4">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span>Sector 01, Elite Performance Lab</span>
              </li>
              <li className="flex items-center gap-4 text-brand-gold">
                <Zap className="w-4 h-4" />
                <span>800-ELITE-PROTO</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-24 pt-10 flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase tracking-[0.3em]">
          <p>© 2024 NEXUS SUPPLEMENTS. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-10 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-luxury">PRIVACY POLICY</a>
            <a href="#" className="hover:text-white transition-luxury">TERMS OF DEPLOYMENT</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
