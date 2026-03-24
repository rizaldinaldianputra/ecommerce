'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MapPin, Phone, User, Home, 
  Briefcase, MoreVertical, Edit2, Trash2, 
  CheckCircle2, ArrowLeft, X, Save,
  Search, Globe, Building2
} from 'lucide-react';
import Link from 'next/link';
import { STYLE_CONFIG } from '@/services/style.config';
import { Address } from '@/types/address';
import { authService, AuthUser } from '@/services/auth.service';
import { useEffect } from 'react';

const mockAddresses: Address[] = [
  { id: 1, label: 'Home', name: 'User', phone: '+62 812 3456 789', province: 'Jakarta', city: 'Jakarta Barat', subdistrict: 'Kebon Jeruk', address: 'Jl. Melati No. 45', postal: '11530', isDefault: true },
  { id: 2, label: 'Office', name: 'User', phone: '+62 878 9012 345', province: 'Jakarta', city: 'Jakarta Selatan', subdistrict: 'SCBD', address: 'Treasury Tower Lt. 42', postal: '12190', isDefault: false },
];

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);
    
    // Update local addresses with real name if mock
    if (userData) {
      setAddresses(prev => prev.map(addr => ({ ...addr, name: userData.fullName })));
    }
  }, []);

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(addr => ({ ...addr, isDefault: addr.id === id })));
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 min-h-screen">
      
      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 md:p-12">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-3xl font-black text-neutral-900 tracking-tight">
                       {editingAddress ? 'Edit Address' : 'New Address'}
                    </h3>
                    <button onClick={() => setShowForm(false)} className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-all">
                       <X size={24} className="text-neutral-400" />
                    </button>
                 </div>

                 <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">Recipient Name</label>
                          <div className="relative">
                             <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                             <input type="text" placeholder={`e.g. ${user?.fullName || 'User Name'}`} className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">Phone Number</label>
                          <div className="relative">
                             <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                             <input type="text" placeholder="+62 8..." className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm" />
                          </div>
                       </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">Province</label>
                          <select className="w-full px-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm appearance-none">
                             <option>Jakarta</option>
                             <option>West Java</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">City</label>
                          <input type="text" placeholder="Jakarta Barat" className="w-full px-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">Postal Code</label>
                          <input type="text" placeholder="11530" className="w-full px-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">Full Address Details</label>
                       <textarea rows={4} placeholder="Street name, Building No, Floor..." className="w-full px-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 font-bold text-sm resize-none"></textarea>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-2xl border border-pink-100">
                       <input type="checkbox" id="default" className="w-5 h-5 rounded-lg border-neutral-300 text-pink-500 focus:ring-pink-400" />
                       <label htmlFor="default" className="text-xs font-black text-pink-600 uppercase tracking-widest cursor-pointer">Set as Default Address</label>
                    </div>

                    <button className="w-full py-5 bg-neutral-900 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-black/20 hover:bg-neutral-800 transition-all active:scale-95">
                       <Save size={18} /> Save Address
                    </button>
                 </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
           <Link href="/profile" className="inline-flex items-center gap-2 text-neutral-400 font-bold text-xs uppercase tracking-widest mb-4 hover:text-neutral-900 transition-colors">
              <ArrowLeft size={14} /> Back to Profile
           </Link>
           <h1 className="text-5xl font-black text-neutral-900 tracking-tight">Shipping <span className="text-pink-500 italic">Destinations</span></h1>
        </div>
        <button 
           onClick={() => { setEditingAddress(null); setShowForm(true); }}
           className="px-8 py-4 bg-neutral-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-black/10 active:scale-95 transition-all"
        >
           <Plus size={18} /> Add New Address
        </button>
      </div>

      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {addresses.map((addr) => (
          <motion.div 
            key={addr.id}
            layout
            className={`relative group bg-white p-10 rounded-[3rem] border-2 transition-all ${addr.isDefault ? 'border-neutral-900 shadow-2xl shadow-black/5' : 'border-neutral-100 hover:border-neutral-300 shadow-sm'}`}
          >
            {addr.isDefault && (
              <div className="absolute -top-3 left-10 px-4 py-1.5 bg-neutral-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 size={12} className="text-pink-400" /> Primary Destination
              </div>
            )}

            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${addr.label === 'Home' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'}`}>
                    {addr.label === 'Home' ? <Home size={24} /> : <Briefcase size={24} />}
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-neutral-900">{addr.label}</h3>
                    <div className="flex items-center gap-1.5 text-neutral-400">
                       <Globe size={10} />
                       <span className="text-[10px] font-black uppercase tracking-widest">{addr.city}</span>
                    </div>
                 </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => { setEditingAddress(addr); setShowForm(true); }} className="p-3 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl"><Edit2 size={18} /></button>
                 <button onClick={() => handleDelete(addr.id as number)} className="p-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
              </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <User size={18} className="text-neutral-300 mt-1" />
                  <div>
                     <p className="text-sm font-black text-neutral-900">{addr.name}</p>
                     <p className="text-xs text-neutral-500 font-medium">{addr.phone}</p>
                  </div>
               </div>

               <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-neutral-300 mt-1" />
                  <div className="flex-1">
                     <p className="text-sm font-bold text-neutral-700 leading-relaxed mb-1">{addr.address}</p>
                     <p className="text-xs text-neutral-400 font-medium">{addr.subdistrict}, {addr.city}, {addr.province} {addr.postal}</p>
                  </div>
               </div>
            </div>

            <div className="mt-10 pt-8 border-t border-neutral-50 flex items-center justify-between">
               {!addr.isDefault && (
                 <button 
                   onClick={() => handleSetDefault(addr.id as number)}
                   className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-pink-500 transition-colors flex items-center gap-2"
                 >
                   Set as Default
                 </button>
               )}
               <div className="ml-auto w-10 h-1.5 rounded-full bg-neutral-50 group-hover:bg-pink-100 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
