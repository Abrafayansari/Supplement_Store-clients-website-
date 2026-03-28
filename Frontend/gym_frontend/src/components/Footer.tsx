
import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Zap, Linkedin } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import logo from '../assets/logo.png';

const Footer: React.FC = () => {
  const { adminData } = useAdmin();

  return (
    <footer className="bg-brand-matte border-t border-brand-gold/10 text-brand-warm/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-white">
              <img src={logo} alt="Nexus Logo" className="h-10 w-auto object-contain" />
              <span className="text-3xl font-black tracking-tighter uppercase">
                NEXUS
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              {adminData?.headline || "Designed for results. 100% verified products for maximum performance. High quality. Zero compromise."}
            </p>
            <div className="flex space-x-6">
              {adminData?.instagramUrl && (
                <a href={adminData.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-5 h-5 hover:text-brand-gold cursor-pointer transition-luxury">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {adminData?.youtubeUrl && (
                <a href={adminData.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-5 h-5 hover:text-brand-gold cursor-pointer transition-luxury">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {adminData?.facebookUrl && (
                <a href={adminData.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-5 h-5 hover:text-brand-gold cursor-pointer transition-luxury">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {adminData?.linkedinUrl && (
                <a href={adminData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-5 h-5 hover:text-brand-gold cursor-pointer transition-luxury">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.4em] text-[10px] mb-10">Products</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em]">
              <li><a href="#" className="hover:text-brand-gold transition-luxury">Protein</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-luxury">Pre-Workout</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-luxury">Vitamins</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.4em] text-[10px] mb-10">Information</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-[0.2em]">
              <li><a href="#" className="hover:text-brand-gold transition-luxury">Shipping</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-luxury">Lab Reports</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-luxury">Contact Us</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-[0.4em] text-[10px] mb-10">Our Location</h4>
            <ul className="space-y-6 text-[10px] font-bold uppercase tracking-[0.2em]">
              <li className="flex items-center gap-4">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span>{adminData?.city ? `${adminData.city}, ${adminData.province}` : "NEXUS Performance Lab, Karachi"}</span>
              </li>
              {(adminData?.phone || adminData?.whatsapp) && (
                <li className="flex items-center gap-4 text-brand-gold">
                  <Phone className="w-4 h-4" />
                  <span>{adminData.phone || adminData.whatsapp}</span>
                </li>
              )}
              {adminData?.email && (
                <li className="flex items-center gap-4 text-brand-gold">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${adminData.email}`} className="hover:text-white transition-luxury">
                    {adminData.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-24 pt-10 flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase tracking-[0.3em]">
          <p>© 2024 NEXUS SUPPLEMENTS. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-10 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-luxury">PRIVACY POLICY</a>
            <a href="#" className="hover:text-white transition-luxury">TERMS OF SERVICE</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
