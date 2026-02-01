
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Product Inquiry',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/contact`, formData);
      if (res.data.success) {
        toast.success("Message sent successfully! We will get back to you shortly.");
        setFormData({ name: '', email: '', subject: 'Product Inquiry', message: '' });
      }
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-warm min-h-screen">
      {/* Hero Header */}
      <section className="bg-brand-matte py-40 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
          <span className="text-[200px] font-black text-brand-gold uppercase select-none leading-none tracking-tighter">REACH</span>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center space-y-6">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            CONTACT <span className="text-brand italic">US</span>
          </h1>
          <p className="text-brand-gold text-[11px] font-black uppercase tracking-[0.5em]">Direct Support 24/7</p>
        </div>
      </section>

      <section className="py-32 container mx-auto px-6 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Cards */}
          <div className="space-y-8">
            <div className="bg-white p-12 border border-black/5 shadow-2xl space-y-8 h-full">
              <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-brand border-b border-black/5 pb-4">Headquarters</h3>

              <div className="space-y-12">
                <div className="flex gap-6 group">
                  <div className="w-12 h-12 bg-brand-warm flex items-center justify-center shrink-0 text-brand group-hover:bg-brand group-hover:text-white transition-all">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40 mb-2">Location</h4>
                    <p className="text-sm font-black uppercase tracking-tight">Main Street, Business Hub<br />Austin, TX 78701</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-12 h-12 bg-brand-warm flex items-center justify-center shrink-0 text-brand group-hover:bg-brand group-hover:text-white transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40 mb-2">Email</h4>
                    <p className="text-sm font-black uppercase tracking-tight">support@nexus.com</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-12 h-12 bg-brand-warm flex items-center justify-center shrink-0 text-brand group-hover:bg-brand group-hover:text-white transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40 mb-2">Phone</h4>
                    <p className="text-sm font-black uppercase tracking-tight">+1-202-555-0178</p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-12 h-12 bg-brand-warm flex items-center justify-center shrink-0 text-brand group-hover:bg-brand group-hover:text-white transition-all">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40 mb-2">Service Hours</h4>
                    <p className="text-sm font-black uppercase tracking-tight italic">Response team active<br />Mon — Sun: 24 Hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-12 md:p-20 border border-black/5 shadow-2xl space-y-16">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-brand-matte uppercase tracking-tighter">GET IN <span className="text-brand-gold italic">TOUCH</span></h2>
                <p className="text-brand-matte/40 text-[10px] font-black uppercase tracking-widest">We'll get back to you within 2 hours.</p>
              </div>

              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-brand-warm border border-black/5 p-6 outline-none focus:border-brand-gold/40 text-[11px] font-black tracking-widest transition-all text-brand-matte"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-brand-warm border border-black/5 p-6 outline-none focus:border-brand-gold/40 text-[11px] font-black tracking-widest transition-all text-brand-matte"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">How can we help?</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-brand-warm border border-black/5 p-6 outline-none focus:border-brand-gold/40 text-[11px] font-black uppercase tracking-widest transition-all appearance-none cursor-pointer text-brand-matte"
                  >
                    <option>Product Question</option>
                    <option>Shipping & Orders</option>
                    <option>Business Inquiries</option>
                    <option>Technical Help</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-matte/40">Your Message</label>
                  <textarea
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you need help with..."
                    className="w-full bg-brand-warm border border-black/5 p-6 outline-none focus:border-brand-gold/40 text-[11px] font-black tracking-widest transition-all resize-none text-brand-matte"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brand text-white w-full py-8 text-[12px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 group disabled:opacity-50 hover:bg-brand-matte transition-all shadow-xl shadow-brand/20"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>SEND MESSAGE <Send className="w-4 h-4 group-hover:translate-x-2 transition-transform" /></>
                  )}
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
            <h3 className="text-3xl font-black text-brand-matte uppercase tracking-tighter">COMMON <span className="text-brand">QUESTIONS</span></h3>
            <p className="text-lg text-brand-matte/50 leading-relaxed font-light">Need help with tracking your order or managing your account? Explore our help center for instant answers.</p>
            <button className="text-brand-gold font-black uppercase tracking-widest text-[11px] border-b border-brand-gold pb-1 hover:text-brand hover:border-brand transition-all">Visit Help Center</button>
          </div>
          <div className="bg-brand-matte aspect-video relative flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000"
              className="w-full h-full object-cover opacity-40 grayscale"
              alt="Office Location"
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
