'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

import { ContentService } from '@/services/content.service';

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  bgFrom: string;
  bgTo: string;
  accent: string;
  image: string;
  badge: string;
}

export default function HeroBanner() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const sections = await ContentService.getActiveSectionsByType('HERO_CAROUSEL');
        if (sections.length > 0 && sections[0].items) {
          const mapped = sections[0].items.map(item => {
            const styles = item.styleConfig?.split(',') || ['from-pink-50', 'to-rose-100', 'from-pink-400 to-rose-600'];
            return {
              id: item.id || 0,
              tag: item.tag || '',
              title: item.title || '',
              subtitle: item.subtitle || '',
              cta: item.ctaText || 'Shop Now',
              ctaLink: item.linkUrl || '/products',
              bgFrom: styles[0] || 'from-pink-50',
              bgTo: styles[1] || 'to-rose-100',
              accent: styles[2] || 'from-pink-400 to-rose-600',
              image: item.imageUrl || '',
              badge: item.badgeText || '',
            };
          });
          setSlides(mapped);
        }
      } catch (error) {
        console.error('Failed to load hero slides', error);
      }
    };
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const slide = slides[current];

  if (!slide) return null;

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
