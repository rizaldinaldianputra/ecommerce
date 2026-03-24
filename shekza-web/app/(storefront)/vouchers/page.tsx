'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Sparkles, Clock, CheckCircle2, Gift, ArrowRight, Tag } from 'lucide-react';
import { STYLE_CONFIG } from '@/services/style.config';
import Link from 'next/link';
import { Voucher } from '@/types/voucher';

const vouchers: Voucher[] = [
  { id: 1, title: 'Welcome Bundle', desc: '40% Off on your first aesthetic purchase', code: 'WELCOME40', expiry: '7 Days Left', type: 'Discount' },
  { id: 2, title: 'Free Express Shipping', desc: 'Complimentary JNE YES upgrade for any order', code: 'FASTSHIZ', expiry: '2 Days Left', type: 'Shipping' },
  { id: 3, title: 'Aesthetic Cashback', desc: 'Earn $15 back in shekza credits', code: 'CASHBACK15', expiry: 'Expires Soon', type: 'Cashback' },
  { id: 4, title: 'Summer Collection 20%', desc: 'Valid for all new seasonal arrivals', code: 'SUMMER20', expiry: '1 Month Left', type: 'Discount' },
];

export default function VouchersPage() {
  const [claimed, setClaimed] = useState<number[]>([]);

  const handleClaim = (id: number) => {
    if (claimed.includes(id)) return;
    setClaimed([...claimed, id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full text-pink-500 text-xs font-black uppercase tracking-widest mb-6"
        >
          <Sparkles size={14} /> Rewards & Vouchers
        </motion.div>
        <h1 className="text-5xl font-black text-neutral-900 tracking-tight mb-4">Claim Your <span className="text-pink-500 italic">Style Perks</span></h1>
        <p className="text-neutral-500 max-w-lg mx-auto font-medium">Unlock exclusive discounts, free shipping, and cashback rewards. Claim them now and they'll be ready at checkout.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vouchers.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white rounded-[2.5rem] border border-neutral-100 p-8 shadow-xl shadow-black/5 overflow-hidden hover:shadow-pink-200/20 transition-all duration-500"
          >
            {/* Background Blob */}
            <div
              className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity"
              style={{ background: STYLE_CONFIG.primary }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${v.type === 'Shipping' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'}`}>
                  {v.type === 'Shipping' ? <Clock size={28} /> : <Ticket size={28} />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                  <Tag size={12} /> {v.type}
                </span>
              </div>

              <h3 className="text-2xl font-black text-neutral-900 mb-2 leading-tight">{v.title}</h3>
              <p className="text-sm text-neutral-500 font-medium mb-8 leading-relaxed">{v.desc}</p>

              <div className="flex items-center justify-between pt-6 border-t border-neutral-50">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Expiry</p>
                  <p className="text-sm font-black text-neutral-900">{v.expiry}</p>
                </div>
                <button
                  onClick={() => handleClaim(v.id)}
                  disabled={claimed.includes(v.id)}
                  className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${claimed.includes(v.id) ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-xl shadow-black/10 active:scale-95'}`}
                >
                  {claimed.includes(v.id) ? (
                    <>
                      Claimed <CheckCircle2 size={14} />
                    </>
                  ) : (
                    <>
                      Claim Now <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-20 text-center">
        <p className="text-sm text-neutral-400 font-medium">Want more rewards? Follow our <Link href="#" className="underline font-bold text-neutral-500 hover:text-pink-500 transition-colors">Instagram</Link> for weekly surprise drops.</p>
      </div>
    </div>
  );
}
