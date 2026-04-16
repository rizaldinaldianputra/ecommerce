'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { ContentService } from '@/services/content.service';
import { ContentSection, Slide } from '@/types/content';
import { slugify } from '@/lib/utils/slug';

interface HeroBannerProps {
  section?: ContentSection;
}

export default function HeroBanner({ section }: HeroBannerProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const targetSection = section || (await ContentService.getActiveSectionsByType('HERO_CAROUSEL'))[0];
        if (targetSection?.items) {
          const mapped = targetSection.items.map(item => {
            const styles = item.styleConfig?.split(',') || ['from-pink-50', 'to-rose-100', 'from-pink-400 to-rose-600'];
            
            // Automatic Slug generation for missing linkUrls
            let ctaLink = item.linkUrl || '';
            if (!ctaLink && item.title) {
              ctaLink = `/products/${slugify(item.title)}`;
            } else if (!ctaLink) {
              ctaLink = '/products';
            }

            return {
              id: item.id || 0,
              tag: item.tag || '',
              title: item.title || '',
              subtitle: item.subtitle || '',
              cta: item.ctaText || 'Shop Now',
              ctaLink: ctaLink,
              bgFrom: styles[0] || 'from-pink-50',
              bgTo: styles[1] || 'to-rose-100',
              accent: styles[2] || 'from-pink-400 to-rose-600',
              image: item.imageUrl || '',
              badge: item.badgeText || '',
            };
          });
          setSlides(mapped);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load hero slides', error);
      }
    };
    loadSlides();
  }, [section]);

  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, isHovered]);

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const slide = slides[current];

  return (
    <section 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden bg-neutral-50 h-[500px] md:h-[600px]"
    >
      {!isLoaded || !slide ? (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
            <Zap size={40} className="text-pink-200 animate-pulse" />
        </div>
      ) : (
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
            className={`absolute inset-0 bg-gradient-to-br ${slide.bgFrom} ${slide.bgTo} flex items-center`}
          >
            {slide.image && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1 text-xs font-bold text-neutral-700 shadow-sm mb-6 border border-neutral-100">
                  {slide.tag}
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight mb-6 leading-tight">
                  {slide.title.split('\n').map((line: string, i: number) => (
                    <span key={i} className={`block ${i === 1 ? `text-transparent bg-clip-text bg-gradient-to-r ${slide.accent}` : ''}`}>
                      {line}
                    </span>
                  ))}
                </h1>

                <p className="text-base text-neutral-600 mb-8 max-w-md">
                  {slide.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link href={slide.ctaLink}>
                    <button className={`bg-gradient-to-r ${slide.accent} text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95`}>
                      {slide.cta} <ArrowRight size={18} />
                    </button>
                  </Link>
                  {slide.badge && (
                    <span className="text-xs font-bold text-neutral-500 bg-white/80 rounded-full px-4 py-2 border border-neutral-200">
                      {slide.badge}
                    </span>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden lg:block relative"
              >
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl bg-neutral-100">
                  {slide.image ? (
                    <img src={slide.image} alt="Hero" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Zap size={60} className="text-pink-100" /></div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => goTo((current + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-pink-500' : 'w-1.5 bg-neutral-300'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
