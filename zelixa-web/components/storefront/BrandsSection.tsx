'use client';

import { motion } from 'framer-motion';
import { ContentItem } from '@/types/content';

export default function BrandsSection({ items }: { items?: ContentItem[] }) {
  const displayBrands = items?.map(item => ({
    name: item.title || '',
    logo: item.imageUrl || item.emoji || item.title || ''
  })) || [
    { name: 'Zara',       logo: 'ZARA' },
    { name: 'H&M',        logo: 'H&M' },
    { name: 'Uniqlo',     logo: 'UNIQLO' },
    { name: 'Nike',       logo: 'NIKE' },
    { name: 'Adidas',     logo: 'adidas' },
    { name: 'Gucci',      logo: 'GUCCI' },
  ];

  return (
    <section className="py-12 bg-white border-y border-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Official Partners</h2>
      </div>

      <div className="relative">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          className="flex gap-8 items-center w-max px-4"
        >
          {[...displayBrands, ...displayBrands].map((brand, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-32 h-12 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <span className="text-xs font-black text-neutral-500 tracking-tighter">{brand.logo}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
