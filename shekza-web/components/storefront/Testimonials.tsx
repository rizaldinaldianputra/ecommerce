'use client';

import { motion } from 'framer-motion';
import { Star, Quote, Heart, CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    name: 'Anindya Putri',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    text: 'shekza is literally my go-to for every new fit. The quality is unreal and everything arrives so fast. The packaging alone deserves 5 stars! ✨',
    product: 'Pastel Dream Hoodie',
    date: '2 days ago'
  },
  {
    name: 'Rafi Maulana',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    text: 'I ordered 3 items and they all fit perfectly. The flash sale deals are insane — got my sneakers at 60% off. Will definitely be back! 👟',
    product: 'Blush Pink Sneakers',
    date: '5 days ago'
  },
  {
    name: 'Citra Dewi',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    text: 'As a content creator, I need outfits that look amazing on camera. shekza never disappoints — the aesthetics are always on point! 🌸',
    product: 'Satin Wrap Midi Dress',
    date: '1 week ago'
  },
  {
    name: 'Budi Santoso',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    rating: 4,
    text: 'Great customer service and fast delivery. Had a small sizing issue and they resolved it in under 24 hours. Very impressed! ⚡',
    product: 'Denim Trousers',
    date: '2 weeks ago'
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-50/30 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-xl shadow-neutral-200"
          >
            <Heart size={12} className="fill-pink-500 text-pink-500" /> Community Reviews
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-none mb-4">
            Loved by <span className="bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent italic">Thousands</span>
          </h2>
          <p className="text-neutral-500 font-medium max-w-lg mx-auto">
            Join 50,000+ happy customers who found their style at shekza. Real reviews from real people.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white/80 backdrop-blur-md border border-neutral-100 rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-100/50 group"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
                {t.rating < 5 && <Star size={14} className="fill-neutral-100 text-neutral-100" />}
              </div>

              <p className="text-neutral-700 font-medium text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className="relative">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-md" />
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full ring-2 ring-white">
                    <CheckCircle2 size={10} />
                  </div>
                </div>
                <div>
                  <h4 className="text-[13px] font-black text-neutral-900 tracking-tight">{t.name}</h4>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{t.date}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-50 flex items-center justify-between text-[11px] font-bold text-neutral-400 group-hover:text-pink-500 transition-colors">
                <span>Purchased</span>
                <span className="text-neutral-900 group-hover:text-pink-600 transition-colors">{t.product}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total Rating Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 border-t border-neutral-100 pt-16"
        >
          <div className="text-center">
            <p className="text-4xl font-black text-neutral-900 leading-none mb-2">4.9/5.0</p>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Average User Rating</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-neutral-100" />
          <div className="text-center">
            <p className="text-4xl font-black text-neutral-900 leading-none mb-2">99%</p>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Satisfied Shoppers</p>
            <p className="text-[10px] text-pink-500 font-bold uppercase tracking-wider bg-pink-50 px-3 py-1 rounded-full">Recommended</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
