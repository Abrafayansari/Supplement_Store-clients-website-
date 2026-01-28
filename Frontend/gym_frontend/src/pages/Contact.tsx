
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="bg-brand-warm min-h-screen">
      {/* Hero Header */}
      <section className="bg-brand-matte py-40 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
          <span className="text-[200px] font-black text-brand-gold uppercase select-none leading-none tracking-tighter">REACH</span>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center space-y-6">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            TACTICAL <span className="text-brand italic">SUPPORT</span>
          </h1>
          <p className="text-brand-gold text-[11px] font-black uppercase tracking-[0.5em]">Direct Command Access 24/7</p>
        </div>
      </section>

      <section className="py-32 container mx-auto px-6 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Cards */}
          <div className="space-y-8">
            <div className="bg-white p-12 border border-black/5 shadow-2xl space-y-8 h-full">
              <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-brand border-b border-black/5 pb-4">Base Operations</h3>

              <div className="space-y-12">
                <div className="flex gap-6 group">
                  <div className="w-12 h-12 bg-brand-warm flex items-center justify-center shrink-0 text-brand group-hover:bg-brand group-hover:text-white transition-all">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40 mb-2">Location</h4>
                    <p className="text-sm font-black uppercase tracking-tight">Sector 01, Elite Performance Lab<br />Austin, TX 78701</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-12 h-12 bg-brand-warm flex items-center justify-center shrink-0 text-brand group-hover:bg-brand group-hover:text-white transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40 mb-2">Digital Link</h4>
                    <p className="text-sm font-black uppercase tracking-tight">command@nexus.com</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-12 h-12 bg-brand-warm flex items-center justify-center shrink-0 text-brand group-hover:bg-brand group-hover:text-white transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40 mb-2">Voice Comms</h4>
                    <p className="text-sm font-black uppercase tracking-tight">800-ELITE-PROTO</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-12 h-12 bg-brand-warm flex items-center justify-center shrink-0 text-brand group-hover:bg-brand group-hover:text-white transition-all">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40 mb-2">Active Hours</h4>
                    <p className="text-sm font-black uppercase tracking-tight italic">Global Monitoring Active<br />Mon — Sun: 00:00 - 24:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-12 md:p-20 border border-black/5 shadow-2xl space-y-16">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-brand-matte uppercase tracking-tighter">DEPLOY A <span className="text-brand-gold italic">MESSAGE</span></h2>
                <p className="text-brand-matte/40 text-[10px] font-black uppercase tracking-widest">Expected Response Time: &lt; 2 Hours</p>
              </div>

              <form className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Full Name</label>
                    <input type="text" placeholder="ENTER OPERATIVE NAME" className="w-full bg-brand-warm border border-black/5 p-6 outline-none focus:border-brand-gold/40 text-[11px] font-black uppercase tracking-widest transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Email Address</label>
                    <input type="email" placeholder="ENTER LOG-IN EMAIL" className="w-full bg-brand-warm border border-black/5 p-6 outline-none focus:border-brand-gold/40 text-[11px] font-black uppercase tracking-widest transition-all" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Subject Protocol</label>
                  <select className="w-full bg-brand-warm border border-black/5 p-6 outline-none focus:border-brand-gold/40 text-[11px] font-black uppercase tracking-widest transition-all appearance-none cursor-pointer">
                    <option>Product Inquiry</option>
                    <option>Logistics / Order Status</option>
                    <option>Corporate Partnership</option>
                    <option>Technical Support</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Message Content</label>
                  <textarea rows={6} placeholder="DESCRIBE YOUR REQUIREMENTS..." className="w-full bg-brand-warm border border-black/5 p-6 outline-none focus:border-brand-gold/40 text-[11px] font-black uppercase tracking-widest transition-all resize-none" />
                </div>

                <button className="btn-luxury w-full py-8 text-[12px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 group">
                  SEND TRANSMISSION <Send className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder / FAQ teaser */}
      <section className="py-24 border-t border-black/5 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h3 className="text-3xl font-black text-brand-matte uppercase tracking-tighter">IMMEDIATE <span className="text-brand">INTEL</span></h3>
            <p className="text-lg text-brand-matte/50 leading-relaxed font-light">Looking for shipping rates or returns? Our automated intelligence system can provide immediate answers to standard operational questions.</p>
            <button className="text-brand-gold font-black uppercase tracking-widest text-[11px] border-b border-brand-gold pb-1 hover:text-brand hover:border-brand transition-all">Open FAQ Archive</button>
          </div>
          <div className="bg-brand-matte aspect-video relative flex items-center justify-center overflow-hidden grayscale">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000"
              className="w-full h-full object-cover opacity-40"
              alt="Tactical Map"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-brand animate-ping rounded-full"></div>
              <div className="w-2 h-2 bg-brand rounded-full absolute"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
