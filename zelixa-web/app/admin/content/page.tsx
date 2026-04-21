'use client';

import { 
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import ContentUnifiedList from '@/components/admin/ContentUnifiedList';

export default function ContentManagementPage() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto py-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-pink-500/10 text-pink-500 shadow-inner mb-2">
            <LayoutGrid className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">
              Content <span className="text-pink-600">Storefront</span>
            </h1>
            <p className="text-slate-400 font-bold mt-2 text-sm max-w-md">
              Kelola semua banner, promo, dan kurasi produk untuk Website & Aplikasi Mobile dalam satu tempat.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-4 rounded-[2rem] border border-white/20 shadow-sm">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Status</p>
            <p className="text-sm font-black text-slate-900 dark:text-white">Real-time Syncing</p>
          </div>
        </div>
      </div>

      {/* Unified List */}
      <div className="px-4 pb-20">
        <ContentUnifiedList />
      </div>
    </div>
  );
}
