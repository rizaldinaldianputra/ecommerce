'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ProductCard from './ProductCard';
import { Zap, Clock, Flame } from 'lucide-react';
import { ContentService } from '@/services/content.service';
import { FlashSaleProps } from '@/types/content';

export default function FlashSale({ section }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 12 });
  const [products, setProducts] = useState<any[]>([]);

  // Window-based scroll (no target ref → avoids hydration error)
  const { scrollYProgress } = useScroll();
  const orb1Y = useSpring(useTransform(scrollYProgress, [0, 1], [-120, 120]), { stiffness: 50, damping: 18 });
  const orb2Y = useSpring(useTransform(scrollYProgress, [0, 1], [120, -120]), { stiffness: 50, damping: 18 });
  const orb3Y = useSpring(useTransform(scrollYProgress, [0, 1], [-60, 160]),  { stiffness: 40, damping: 15 });

  useEffect(() => {
    if (section?.items) {
      const mapped = section.items.map(item => ({
        id: item.id || 0,
        name: item.title || '',
        price: 0,
        originalPrice: 0,
        slug: item.linkUrl?.split('/').pop() || '',
        imageUrl: item.imageUrl || '',
        stock: parseInt(item.badgeText || '10'),
        variants: [],
        isActive: true,
        isFeatured: false,
        isTopProduct: false,
        isBestSeller: true,
        isRecommended: false,
        categoryId: 0,
      }));
      setProducts(mapped);
    }
  }, [section]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: any) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 relative bg-neutral-900 overflow-hidden">
      {/* Parallax Orbs */}
      <motion.div
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ y: orb1Y, background: 'radial-gradient(circle, rgba(244,63,94,0.25) 0%, transparent 70%)' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ y: orb2Y, background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ y: orb3Y, background: 'radial-gradient(ellipse, rgba(251,146,60,0.08) 0%, transparent 70%)' }}
      />

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 0.95, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/30"
            >
              <Zap size={32} className="text-white fill-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame size={14} className="text-orange-400 fill-orange-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">Limited Time</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">Flash Sale</h2>
              <p className="text-neutral-400 font-medium mt-1">Grab them before they're gone!</p>
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Clock size={20} className="text-amber-400" />
            <div className="flex items-center gap-2">
              {[
                { value: timeLeft.hours, label: 'HRS' },
                { value: timeLeft.minutes, label: 'MIN' },
                { value: timeLeft.seconds, label: 'SEC' },
              ].map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-2">
                  <div className="text-center">
                    <motion.div
                      key={unit.value}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center border border-white/10 shadow-xl"
                    >
                      <span className="text-2xl font-black text-white tabular-nums leading-none">
                        {unit.value.toString().padStart(2, '0')}
                      </span>
                    </motion.div>
                    <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mt-1">{unit.label}</p>
                  </div>
                  {i < 2 && <span className="text-white/30 font-black text-2xl pb-5">:</span>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-20 text-neutral-600"
          >
            <Zap size={40} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-bold">Flash sale items will appear here</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any, i: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative group"
              >
                <div className="bg-neutral-800/40 backdrop-blur-sm rounded-[2rem] p-3 border border-white/5 group-hover:bg-neutral-800/60 transition-colors">
                  <ProductCard product={product} />
                  {/* Stock Bar */}
                  <div className="px-5 pb-6 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Available</span>
                      <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">{product.stock} Left</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min((product.stock / 15) * 100, 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
