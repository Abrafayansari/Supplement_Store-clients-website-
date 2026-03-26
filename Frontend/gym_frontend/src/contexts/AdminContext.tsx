import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface AdminData {
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
  deliveryCharges?: Array<{ province: string; charge: number }>;
  accountTitle?: string;
  bankAccountHolder?: string;
  iban?: string;
  bankName?: string;
}

interface AdminContextType {
  adminData: AdminData | null;
  loading: boolean;
  error: string | null;
  refetchAdminData: () => Promise<void>;
  getDeliveryCharge: (province: string | undefined) => number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}/admin/settings`);
      if (res.data.success) {
        setAdminData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("Failed to load admin settings");
      // Set default fallback data
      setAdminData({
        headline: "Welcome to NEXUS",
        deliveryCharges: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const getDeliveryCharge = (province: string | undefined): number => {
    if (!province || !adminData?.deliveryCharges) return 0;
    const charge = adminData.deliveryCharges.find(
      (dc) => dc.province.toLowerCase() === province.toLowerCase()
    );
    return charge?.charge || 0;
  };

  const value: AdminContextType = {
    adminData,
    loading,
    error,
    refetchAdminData: fetchAdminData,
    getDeliveryCharge,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};
