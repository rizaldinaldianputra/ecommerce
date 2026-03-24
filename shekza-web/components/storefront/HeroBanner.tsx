'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const slides = [
  {
    id: 1,
    tag: '✨ Spring Collection 2026',
    title: 'Discover Your\nTrue Aesthetic',
    subtitle: 'Curated fashion up to 60% OFF — limited time only.',
    cta: 'Shop Now',
    ctaLink: '/products',
    bgFrom: 'from-pink-50',
    bgTo: 'to-rose-100',
    accent: 'from-pink-400 to-rose-600',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
    badge: '🔥 Up to 60% OFF',
  },
  {
    id: 2,
    tag: '⚡ Flash Sale — 6 Hours Only',
    title: 'Mega Sale Is\nLive Now!',
    subtitle: 'Hundreds of premium products with insane discounts.',
    cta: 'See Deals',
    ctaLink: '#flash-sale',
    bgFrom: 'from-violet-50',
    bgTo: 'to-purple-100',
    accent: 'from-violet-500 to-purple-600',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200',
    badge: '⏰ Limited Time',
  },
  {
    id: 3,
    tag: '🌸 New Arrivals',
    title: 'Fresh Drops\nEvery Week',
    subtitle: 'Be the first to wear the latest trends from top brands.',
    cta: 'Explore New',
    ctaLink: '/products?sort=new',
    bgFrom: 'from-amber-50',
    bgTo: 'to-orange-100',
    accent: 'from-amber-400 to-orange-500',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200',
    badge: '🆕 New Arrivals',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const slide = slides[current];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <section className="relative overflow-hidden bg-neutral-50 h-[560px] md:h-[640px]">
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bgFrom} ${slide.bgTo} flex items-center`}
        >
          {/* BG Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-sm font-bold text-neutral-700 shadow-sm mb-6 border border-neutral-100"
              >
                {slide.tag}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-7xl font-black text-neutral-900 tracking-tighter mb-6 leading-[1.1] md:leading-[1.05]"
              >
                {slide.title.split('\n').map((line, i) => (
                  <span key={i} className={`block ${i === 1 ? `text-transparent bg-clip-text bg-gradient-to-r ${slide.accent}` : ''}`}>
                    {line}
                  </span>
                ))}
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg text-neutral-600 mb-8 max-w-md">
                {slide.subtitle}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center gap-4">
                <Link href={slide.ctaLink}>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                    whileTap={{ scale: 0.97 }}
                    className={`bg-gradient-to-r ${slide.accent} text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-lg`}
                  >
                    {slide.cta} <ArrowRight size={18} color='primary' />
                  </motion.button>
                </Link>
                <span className="text-sm font-bold text-neutral-500 bg-white/80 rounded-full px-4 py-2 border border-neutral-200">
                  {slide.badge}
                </span>
              </motion.div>
            </div>

            {/* Image right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="hidden lg:block relative"
            >
              <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl">
                <img src={slide.image} alt="Hero" className="w-full h-full object-cover" />
              </div>
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-8 bg-white rounded-2xl shadow-xl p-4 border border-neutral-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Zap size={18} className="text-pink-500" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Today's Deal</p>
                    <p className="font-bold text-neutral-900">Flash Discount</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-pink-500' : 'w-2 h-2 bg-neutral-300'}`} />
        ))}
      </div>
    </section>
  );
}
