import React, { useEffect, useState } from 'react';
import { Users, Search, MoreHorizontal, UserX, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import NexusLoader from '../../components/NexusLoader';

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        // Filter out admins - only show CUSTOMER role
        const customersOnly = res.data.users.filter((user: User) => user.role !== 'ADMIN');
        setUsers(customersOnly);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const suspendUser = async (userId: string) => {
    try {
      await axios.patch(`${API_URL}/admin/users/${userId}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User status updated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  if (loading && users.length === 0) {
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
          <Link to="/admin" className="inline-flex items-center gap-3 text-brand-matte/40 hover:text-brand-gold font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-500" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] uppercase leading-[0.9]">
                User <br />
                <span className="shine-gold italic font-brand">Directory</span>
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.4em]">
                <span className="flex items-center gap-3 px-5 py-2.5 bg-white border border-brand-matte/5 text-brand shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" /> DATABASE SECURE
                </span>
                <span className="w-[1px] h-4 bg-brand-matte/10 hidden sm:block" />
                <span className="text-brand-matte/40">{users.length} CUSTOMERS REGISTERED</span>
              </div>
            </div>

            <div className="relative group w-full xl:w-[450px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-matte/20 group-focus-within:text-brand-gold transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder="SEARCH CUSTOMERS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-16 pr-6 py-5 bg-white border border-brand-matte/5 outline-none focus:border-brand-gold/40 text-[11px] font-black uppercase tracking-[0.3em] text-brand-matte w-full shadow-sm transition-all placeholder:text-brand-matte/20"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-brand-matte/5 shadow-2xl overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-warm/50 border-b border-brand-matte/5">
                  <th className="px-10 py-8 text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.3em]">Customer Details</th>
                  <th className="px-10 py-8 text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.3em]">Lifecycle</th>
                  <th className="px-10 py-8 text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.3em]">Security Status</th>
                  <th className="px-10 py-8 text-[10px] font-black text-brand-matte/20 uppercase tracking-[0.3em] text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-matte/5">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-32 text-center">
                      <Users className="w-16 h-16 text-brand-matte/5 mx-auto mb-4" />
                      <p className="text-brand-matte/10 font-black uppercase tracking-[0.5em] text-xs">No matching customer records</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="group hover:bg-brand-warm transition-all duration-500">
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-brand-matte text-brand-gold flex items-center justify-center font-black text-2xl border border-brand-gold/10 group-hover:scale-105 transition-transform duration-500 italic">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-brand-matte uppercase tracking-tight text-xl leading-none group-hover:text-brand-gold transition-colors">{user.name}</p>
                            <p className="text-[10px] text-brand-matte/30 font-bold uppercase mt-2 tracking-widest">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-10 text-[12px] font-black text-brand-matte uppercase tracking-tighter italic">
                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        <p className="text-[8px] text-brand-matte/20 not-italic uppercase mt-1 tracking-widest font-bold">Registration Date</p>
                      </td>
                      <td className="px-10 py-10">
                        <span className={`inline-block px-5 py-2 border text-[9px] font-black uppercase tracking-widest shadow-sm ${user.status !== 'Suspended' ? 'bg-brand/5 text-brand border-brand/10' : 'bg-red-50 text-red-600 border-red-100'}`}>
                          {user.status || 'Active Account'}
                        </span>
                      </td>
                      <td className="px-10 py-10 text-right">
                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                          <button
                            onClick={() => suspendUser(user.id)}
                            title={user.status === 'Suspended' ? "Restore Access" : "Revoke Access"}
                            className={`p-4 transition-all duration-300 border ${user.status === 'Suspended' ? 'text-brand border-brand/20 bg-brand/5' : 'text-brand-matte/30 border-brand-matte/10 hover:text-brand hover:bg-brand/5 hover:border-brand/20'}`}
                          >
                            <UserX className="w-5 h-5" />
                          </button>
                          <button className="p-4 text-brand-matte/30 border border-brand-matte/10 hover:text-brand-gold hover:bg-brand-gold/5 hover:border-brand-gold/20 transition-all duration-300">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style>{`
        .shine-gold {
          background: linear-gradient(90deg, #C9A24D, #FFF, #C9A24D);
          background-size: 200% auto;
          animation: gold-shine 5s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes gold-shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
};

export default UserManagement;