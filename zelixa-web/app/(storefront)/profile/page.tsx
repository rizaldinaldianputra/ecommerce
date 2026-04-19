'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Camera, Save, 
  Package, Heart, Bell, Shield, ChevronRight,
  LogOut, Plus, Edit2, Trash2, Ticket, Settings, History, Wallet, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { STYLE_CONFIG } from '@/services/style.config';
import Link from 'next/link';
import { authService, AuthUser } from '@/services/auth.service';
import { useEffect } from 'react';
import { formatImageUrl } from '@/lib/url-utils';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isUpdating, setIsUpdating] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const userData = authService.getUser();
    if (userData) {
      setUser(userData);
    }
    
    // Refresh data from server
    authService.fetchMe().then(setUser).catch(console.error);
  }, []);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wallet', label: 'My Wallet', icon: Wallet },
    { id: 'vouchers', label: 'Vouchers', icon: Ticket },
    { id: 'recently-viewed', label: 'Recently Viewed', icon: History },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="bg-neutral-50 px-4 pt-10 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

        {/* Sidebar Nav */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 p-8 border border-neutral-100">
            <div className="text-center mb-8">
              <div className="relative inline-block group">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-neutral-100 relative">
                  <img
                    src={formatImageUrl(user?.profilePicture) || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <button className="absolute bottom-1 right-1 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-neutral-400 hover:text-pink-500 transition-colors border border-neutral-100">
                  <Edit2 size={16} />
                </button>
              </div>
              <h2 className="text-2xl font-black text-neutral-900 mt-6 tracking-tight">{user?.fullName || 'Guest ✨'}</h2>
              <p className="text-neutral-500 font-bold text-sm tracking-wide">Silver Member</p>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${activeTab === tab.id ? 'bg-neutral-900 text-white shadow-xl' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'}`}
                >
                  <div className="flex items-center gap-4">
                    <tab.icon size={20} className={activeTab === tab.id ? 'text-pink-500' : 'text-neutral-300 group-hover:text-pink-400'} />
                    <span className="text-sm font-black tracking-tight">{tab.label}</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
                </button>
              ))}
              <div className="pt-8">
                <button 
                  onClick={() => authService.logout()}
                  className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                >
                  <LogOut size={20} />
                  <span className="text-sm font-black tracking-tight">Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 p-8 md:p-12 border border-neutral-100">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Personal Details</h3>
                    <motion.div
                      className="w-1.5 h-8 rounded-full"
                      style={{ background: STYLE_CONFIG.primary }}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {[
                      { icon: User, label: 'Full Name', val: user?.fullName || '' },
                      { icon: Mail, label: 'Email', val: user?.email || '', disabled: true },
                    ].map((field) => (
                      <div key={field.label} className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest pl-2">{field.label}</label>
                        <div className="relative">
                          <field.icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                          <input 
                            type="text" 
                            defaultValue={field.val}
                            disabled={field.disabled}
                            className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 ring-pink-400 transition-all font-bold text-sm text-neutral-800 disabled:opacity-60"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 flex justify-end">
                    <button 
                      onClick={() => { setIsUpdating(true); setTimeout(() => setIsUpdating(false), 1500); }}
                      className="px-10 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-pink-200 hover:shadow-pink-300 transition-all active:scale-95 flex items-center gap-3"
                      style={{ background: `linear-gradient(45deg, ${STYLE_CONFIG.primary}, ${STYLE_CONFIG.accent})` }}
                    >
                      {isUpdating ? 'Saving...' : <><Save size={18} /> Update Data</>}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { label: 'Active Orders', val: '04', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Wishlist Items', val: '12', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
                    { label: 'Saved Addresses', val: '02', icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between">
                       <div>
                          <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest mb-1">{stat.label}</p>
                          <h4 className="text-2xl font-black text-neutral-900">{stat.val}</h4>
                       </div>
                       <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                          <stat.icon size={24} />
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-[2.5rem] p-12 text-center border border-neutral-100 shadow-2xl shadow-black/5">
                   <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MapPin size={32} className="text-pink-500" />
                   </div>
                   <h3 className="text-2xl font-black text-neutral-900 mb-2">Shipping Destinations</h3>
                   <p className="text-neutral-500 mb-8 max-w-xs mx-auto font-medium">Manage your delivery locations, set a default address, and ensure your aesthetic hauls arrive at the right door.</p>
                   <Link href="/addresses" className="inline-flex items-center gap-2 px-10 py-4 bg-neutral-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                      Manage Addresses <ChevronRight size={16} />
                   </Link>
                </div>
              </motion.div>
            )}

            {activeTab === 'vouchers' && (
              <motion.div
                key="vouchers"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-black text-neutral-900 tracking-tight">Active Vouchers</h3>
                  <Link href="/vouchers" className="text-xs font-black uppercase tracking-widest text-pink-500 hover:underline">Claim More</Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Welcome Bundle', code: 'WELCOME40', off: '40% OFF', color: 'bg-pink-500' },
                    { title: 'Free Express', code: 'FASTSHIZ', off: 'FREE SHIPPING', color: 'bg-blue-500' },
                  ].map(v => (
                    <div key={v.code} className="relative bg-white rounded-[2rem] p-8 border border-neutral-100 overflow-hidden group shadow-sm hover:shadow-xl transition-all">
                      <div className={`absolute top-0 right-0 w-32 h-32 ${v.color} opacity-5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700`} />
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${v.color}`}>
                           <Ticket size={28} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-neutral-50 rounded-xl border border-neutral-100 text-neutral-500">{v.off}</span>
                      </div>
                      <h3 className="text-xl font-black text-neutral-900 mb-2">{v.title}</h3>
                      <div className="flex items-center justify-between pt-6 border-t border-neutral-50">
                        <p className="text-xs font-black text-neutral-400 tracking-widest uppercase">{v.code}</p>
                        <button className="text-[10px] font-black uppercase tracking-widest text-pink-500 hover:text-pink-600 transition-colors">Apply Code</button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'recently-viewed' && (
              <motion.div
                key="recently-viewed"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-black text-neutral-900 tracking-tight">Last Activity</h3>
                  <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-widest">
                    <History size={14} /> Recently Viewed
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[
                    { id: 1, name: 'Aesthetic Linen Shirt', price: 29.99, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400', category: 'Cloting', date: 'Yesterday' },
                    { id: 2, name: 'Minimalist Ceramics Vase', price: 45.00, image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=400', category: 'Home Decor', date: '2 days ago' },
                    { id: 3, name: 'Premium Leather Wallet', price: 89.00, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400', category: 'Accessories', date: '3 days ago' },
                    { id: 4, name: 'Boho Style Macrame', price: 55.50, image: 'https://images.unsplash.com/photo-1528612134426-383748238692?auto=format&fit=crop&q=80&w=400', category: 'Decor', date: 'Last week' },
                  ].map((item) => (
                    <motion.div 
                      key={item.id}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-[2rem] p-4 border border-neutral-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden"
                    >
                      <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                        <img src={formatImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-neutral-900 shadow-lg hover:bg-pink-500 hover:text-white transition-all transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300">
                            <Heart size={18} />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                           <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-lg flex justify-between items-center transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500">
                              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{item.category}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">{item.date}</span>
                           </div>
                        </div>
                      </div>
                      <div className="px-2 pb-2">
                        <h4 className="font-black text-neutral-900 tracking-tight mb-1 truncate">{item.name}</h4>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-black text-pink-500">${item.price.toFixed(2)}</p>
                          <Link href={`/products/${item.id}`} className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white hover:bg-pink-500 transition-colors shadow-lg">
                            <Plus size={18} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-[2.5rem] p-12 text-center border border-neutral-100 shadow-2xl shadow-black/5">
                   <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package size={32} className="text-neutral-300" />
                   </div>
                   <h3 className="text-2xl font-black text-neutral-900 mb-2">Track Your Style</h3>
                   <p className="text-neutral-500 mb-8 max-w-xs mx-auto font-medium">View your full order history, track shipments, and manage returns in our dedicated dashboard.</p>
                   <Link href="/orders" className="inline-flex items-center gap-2 px-10 py-4 bg-neutral-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                      Go to Order History <ChevronRight size={16} />
                   </Link>
                </div>
              </motion.div>
            )}

            {activeTab === 'wallet' && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-black text-neutral-900 tracking-tight">Financial Hub</h3>
                  <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-widest">
                    <Wallet size={14} /> My Wallet
                  </div>
                </div>

                {/* Balance Card */}
                <div className="relative overflow-hidden bg-neutral-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl shadow-neutral-200 group">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-purple-600/20 blur-[100px] -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000" />
                   <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                      <div>
                         <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 opacity-80">Available Points</p>
                         <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 flex items-baseline gap-4">
                            2,450.00 <span className="text-xl md:text-2xl text-pink-500 uppercase tracking-widest">PTS</span>
                         </h2>
                         <p className="text-sm font-bold text-neutral-400 border-l border-neutral-700 pl-4">1 Point = Rp 1.000 — Use points for your next aesthetic purchases.</p>
                      </div>
                      <div className="flex flex-col gap-4">
                         <button className="px-10 py-5 bg-white text-neutral-900 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-pink-500 hover:text-white transition-all active:scale-95">
                            TOP UP WALLET
                         </button>
                         <button className="px-10 py-5 bg-neutral-800 text-white border border-neutral-700 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:border-white transition-all active:scale-95">
                            WITHDRAW FUNDS
                         </button>
                      </div>
                   </div>
                </div>

                {/* Transactions */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-neutral-100 shadow-sm">
                   <div className="flex items-center justify-between mb-10">
                      <h4 className="text-xl font-black text-neutral-900 tracking-tight uppercase tracking-widest">Recent Activity</h4>
                      <button className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-pink-500 transition-colors">View All Statement</button>
                   </div>

                   <div className="space-y-4">
                      {[
                        { type: 'REFUND', label: 'Refund for Order #SKZ-2024-9102', date: 'Oct 24, 2024', amount: '+750.00', status: 'COMPLETED', color: 'text-emerald-500', icon: ArrowUpRight, bg: 'bg-emerald-50' },
                        { type: 'PURCHASE', label: 'Payment for Boho Style Macrame', date: 'Oct 18, 2024', amount: '-550.50', status: 'COMPLETED', color: 'text-neutral-900', icon: ArrowDownLeft, bg: 'bg-neutral-100' },
                        { type: 'REFUND', label: 'Refund for Order #SKZ-2024-8841', date: 'Sep 12, 2024', amount: '+450.00', status: 'COMPLETED', color: 'text-emerald-500', icon: ArrowUpRight, bg: 'bg-emerald-50' },
                        { type: 'TOPUP', label: 'Manual Wallet Top Up', date: 'Aug 30, 2024', amount: '+1,800.50', status: 'COMPLETED', color: 'text-emerald-500', icon: ArrowUpRight, bg: 'bg-emerald-50' },
                      ].map((tx, idx) => (
                        <div key={idx} className="flex items-center justify-between p-6 rounded-3xl hover:bg-neutral-50 border border-transparent hover:border-neutral-100 transition-all group">
                           <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 ${tx.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                 <tx.icon size={24} className={tx.color} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{tx.type} — {tx.date}</p>
                                 <h5 className="text-sm font-black text-neutral-900 leading-tight">{tx.label}</h5>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className={`text-lg font-black ${tx.color}`}>{tx.amount}</p>
                              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300">{tx.status}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
