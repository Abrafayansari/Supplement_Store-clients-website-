import React, { useEffect, useState } from 'react';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import NexusLoader from '../../components/NexusLoader';

const API_URL = import.meta.env.VITE_API_URL;

interface DeliveryCharge {
  province: string;
  charge: number;
}

interface AdminSettings {
  id?: string;
  city?: string;
  province?: string;
  country?: string;
  address?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  headline?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  deliveryCharges?: DeliveryCharge[];
  accountTitle?: string;
  bankAccountHolder?: string;
  iban?: string;
  bankName?: string;
}

const AdminSettings: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>({});
  const [newDeliveryCharge, setNewDeliveryCharge] = useState({ province: '', charge: 0 });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSettings(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSettings();
    }
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDeliveryCharge = () => {
    if (!newDeliveryCharge.province || newDeliveryCharge.charge <= 0) {
      toast.error("Please enter valid province and charge");
      return;
    }
    
    const updatedCharges = [...(settings.deliveryCharges || []), newDeliveryCharge];
    setSettings(prev => ({
      ...prev,
      deliveryCharges: updatedCharges
    }));
    setNewDeliveryCharge({ province: '', charge: 0 });
  };

  const handleRemoveDeliveryCharge = (index: number) => {
    const updatedCharges = settings.deliveryCharges?.filter((_, i) => i !== index) || [];
    setSettings(prev => ({
      ...prev,
      deliveryCharges: updatedCharges
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...settings,
        deliveryCharges: settings.deliveryCharges || []
      };
      
      const res = await axios.put(`${API_URL}/admin/settings`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setSettings(res.data.data);
        toast.success("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-warm flex items-center justify-center">
        <NexusLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-warm text-brand-matte relative overflow-hidden font-sans">
      {/* Mesh Background Effect */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <main className="relative p-6 md:p-12 max-w-[1600px] mx-auto w-full space-y-16">
        {/* Header Section */}
        <div className="space-y-10">
          <Link to="/admin" className="inline-flex items-center gap-3 text-brand-matte/40 hover:text-brand font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-500" />
            Back to Dashboard
          </Link>

          <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] uppercase leading-[0.9]">
            Business <br />
            <span className="text-brand italic">Settings</span>
          </h1>
        </div>

        {/* Settings Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Location Section */}
          <div className="bg-white border border-brand-matte/5 p-8 md:p-10 shadow-lg">
            <h2 className="text-2xl font-black text-brand-matte uppercase tracking-tighter mb-8">
              Location <span className="text-brand">Details</span>
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">City</label>
                <input type="text" name="city" placeholder="Enter city" value={settings.city || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">Province</label>
                <input type="text" name="province" placeholder="Enter province" value={settings.province || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">Country</label>
                <input type="text" name="country" placeholder="Enter country" value={settings.country || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">Address</label>
                <textarea name="address" placeholder="Enter full address" value={settings.address || ''} onChange={handleInputChange} rows={3} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm resize-none" />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white border border-brand-matte/5 p-8 md:p-10 shadow-lg">
            <h2 className="text-2xl font-black text-brand-matte uppercase tracking-tighter mb-8">
              Contact <span className="text-brand">Info</span>
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">Email</label>
                <input type="email" name="email" placeholder="Enter email" value={settings.email || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">Phone</label>
                <input type="tel" name="phone" placeholder="Enter phone" value={settings.phone || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">WhatsApp</label>
                <input type="tel" name="whatsapp" placeholder="Enter WhatsApp number" value={settings.whatsapp || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">Headline</label>
                <textarea name="headline" placeholder="Enter business headline" value={settings.headline || ''} onChange={handleInputChange} rows={2} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm resize-none" />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white border border-brand-matte/5 p-8 md:p-10 shadow-lg">
            <h2 className="text-2xl font-black text-brand-matte uppercase tracking-tighter mb-8">
              Social <span className="text-brand">Media</span>
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">YouTube</label>
                <input type="url" name="youtubeUrl" placeholder="https://youtube.com/..." value={settings.youtubeUrl || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">Facebook</label>
                <input type="url" name="facebookUrl" placeholder="https://facebook.com/..." value={settings.facebookUrl || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">Instagram</label>
                <input type="url" name="instagramUrl" placeholder="https://instagram.com/..." value={settings.instagramUrl || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">LinkedIn</label>
                <input type="url" name="linkedinUrl" placeholder="https://linkedin.com/..." value={settings.linkedinUrl || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white border border-brand-matte/5 p-8 md:p-10 shadow-lg">
            <h2 className="text-2xl font-black text-brand-matte uppercase tracking-tighter mb-8">
              Payment <span className="text-brand">Details</span>
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">Bank Name</label>
                <input type="text" name="bankName" placeholder="Enter bank name" value={settings.bankName || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">Account Title</label>
                <input type="text" name="accountTitle" placeholder="Enter account title" value={settings.accountTitle || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">Account Holder Name</label>
                <input type="text" name="bankAccountHolder" placeholder="Enter account holder name" value={settings.bankAccountHolder || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">IBAN</label>
                <input type="text" name="iban" placeholder="Enter IBAN" value={settings.iban || ''} onChange={handleInputChange} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Charges Section */}
        <div className="bg-white border border-brand-matte/5 p-8 md:p-10 shadow-lg">
          <h2 className="text-2xl font-black text-brand-matte uppercase tracking-tighter mb-8">
            Delivery <span className="text-brand">Charges (Province-Wise)</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">Province</label>
              <input type="text" placeholder="E.g., Punjab, Sindh" value={newDeliveryCharge.province} onChange={e => setNewDeliveryCharge({...newDeliveryCharge, province: e.target.value})} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
            </div>
            <div>
              <label className="text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.2em] ml-1 block mb-2">Charge (Rs.)</label>
              <input type="number" placeholder="E.g., 500" value={newDeliveryCharge.charge} onChange={e => setNewDeliveryCharge({...newDeliveryCharge, charge: parseFloat(e.target.value)})} className="w-full px-6 py-4 bg-brand-warm border border-brand-matte/10 text-[11px] font-black uppercase tracking-widest focus:border-brand transition-colors outline-none shadow-sm" />
            </div>
            <div className="flex items-end">
              <button onClick={handleAddDeliveryCharge} className="w-full px-6 py-4 bg-brand text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-brand-matte transition-all shadow-lg">
                Add Charge
              </button>
            </div>
          </div>

          {/* Display Delivery Charges */}
          {settings.deliveryCharges && settings.deliveryCharges.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[12px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Current Charges:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {settings.deliveryCharges.map((dc: DeliveryCharge, index: number) => (
                  <div key={index} className="bg-brand-warm border border-brand-matte/10 p-4 flex justify-between items-center">
                    <div>
                      <p className="font-black text-brand-matte text-[12px] uppercase">{dc.province}</p>
                      <p className="text-brand font-black text-[14px]">Rs. {dc.charge}</p>
                    </div>
                    <button onClick={() => handleRemoveDeliveryCharge(index)} className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving} className="px-12 py-6 bg-brand text-white font-black uppercase tracking-[0.5em] text-[12px] hover:bg-brand-matte transition-all shadow-xl shadow-brand/20 disabled:opacity-50 flex items-center gap-4">
            {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
