import React from 'react';
import { Users, Search, MoreHorizontal, UserX, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_USERS } from '../../mockData.ts';

const UserManagement: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-warm flex">
      <main className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full space-y-10">
        <Link to="/admin" className="flex items-center gap-3 text-brand-matte/50 hover:text-brand font-black uppercase tracking-widest text-[10px] mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-brand-matte tracking-tighter uppercase italic">Customer <span className="text-brand">List</span></h1>
            <p className="text-brand-matte/40 font-bold uppercase tracking-widest text-[10px]">View and manage all registered customers.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-matte/30 w-5 h-5" />
            <input type="text" placeholder="Search for a user..." className="pl-16 pr-6 py-5 bg-white border border-brand-matte/10 outline-none focus:border-brand-gold/40 text-[11px] font-black uppercase tracking-widest text-brand-matte w-full md:w-[450px] shadow-sm" />
          </div>
        </div>

        <div className="bg-white border border-brand-matte/5 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-warm">
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Customer Name</th>
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Position</th>
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Date Joined</th>
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em]">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-brand-matte/40 uppercase tracking-[0.3em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-matte/5">
                {MOCK_USERS.map(user => (
                  <tr key={user.id} className="group hover:bg-brand-warm transition">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-brand-matte text-brand-gold flex items-center justify-center font-black text-xl border border-brand-gold/20">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-brand-matte uppercase tracking-tight text-lg leading-none">{user.name}</p>
                          <p className="text-[10px] text-brand-matte/40 font-bold uppercase mt-1">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        {user.role === 'ADMIN' ? <Shield className="w-5 h-5 text-brand" /> : <Users className="w-5 h-5 text-brand-matte/30" />}
                        <span className="text-[11px] font-black uppercase tracking-widest text-brand-matte">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-black text-brand-matte/50 uppercase tracking-widest">{user.joinDate}</td>
                    <td className="px-10 py-8">
                      <span className={`inline-block px-4 py-1 text-[9px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'bg-brand-gold text-brand-matte' : 'bg-brand text-white'
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button title="Suspend User" className="p-3 text-brand-matte/30 hover:text-brand hover:bg-brand-matte transition">
                          <UserX className="w-5 h-5" />
                        </button>
                        <button className="p-3 text-brand-matte/30 hover:text-brand-gold hover:bg-brand-matte transition">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;