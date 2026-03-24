'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';

const recommendedProducts = [
  { id: 201, name: 'Cloud-Soft Lounge Pants', price: 35.0, rating: 4.8, image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=400', colors: ['Grey', 'Black'], sizes: ['S', 'M', 'L'], slug: 'cloud-soft-lounge-pants' },
  { id: 202, name: 'Silk Sleep Mask', price: 15.0, rating: 4.9, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c717678?auto=format&fit=crop&q=80&w=400', colors: ['Pink', 'Navy', 'Champagne'], sizes: ['One Size'], slug: 'silk-sleep-mask' },
  { id: 203, name: 'Aromatic Candle - Rose', price: 29.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1603006375271-7f3b9024c0ef?auto=format&fit=crop&q=80&w=400', colors: ['White'], sizes: ['Standard'], slug: 'aromatic-candle-rose' },
  { id: 204, name: 'Ceramic Minimalist Vase', price: 42.0, rating: 4.6, image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=400', colors: ['White', 'Beige'], sizes: ['Medium'], slug: 'minimalist-vase' },
  { id: 205, name: 'Luxury Bath Salts', price: 22.0, rating: 4.8, image: 'https://images.unsplash.com/photo-1560032763-045d1185484k?auto=format&fit=crop&q=80&w=400', colors: ['Purple'], sizes: ['Standard'], slug: 'luxury-bath-salts' },
];

export default function Recommendations() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-pink-500 font-black text-xs uppercase tracking-widest mb-2">
              <Sparkles size={14} /> Recommended for you
            </div>
            <h2 className="text-4xl font-black text-neutral-900 tracking-tight italic">
              Picked <span className="text-pink-500">Just for You</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-neutral-100 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all shadow-lg active:scale-95">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-neutral-100 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all shadow-lg active:scale-95">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide no-scrollbar"
        >
          {recommendedProducts.map((product) => (
            <div key={product.id} className="min-w-[280px] w-[280px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
