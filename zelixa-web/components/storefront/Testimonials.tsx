'use client';

import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';
import { ContentItem } from '@/types/content';

export default function Testimonials({ items }: { items?: ContentItem[] }) {
  const displayTestimonials = items?.map(item => ({
    name: item.title || '',
    img: item.imageUrl || '',
    rating: parseInt(item.iconName || '5'),
    text: item.subtitle || '',
  })) || [
    { name: 'Anindya Putri', img: '', rating: 5, text: 'Zelixa is literally my go-to for every new fit. Quality is unreal!' },
    { name: 'Rafi Maulana',  img: '', rating: 5, text: 'Flash sale deals are insane — got my sneakers at 60% off.' },
  ];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl font-bold text-neutral-900">What Our Fans Say</h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayTestimonials.map((t: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => <Star key={j} size={12} className="fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-neutral-600 text-sm italic mb-6">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold transition-transform hover:scale-110">
                {t.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1">
                  {t.name} <CheckCircle2 size={12} className="text-blue-500" />
                </h4>
                <p className="text-[10px] text-neutral-400 font-bold uppercase">Verified Buyer</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
