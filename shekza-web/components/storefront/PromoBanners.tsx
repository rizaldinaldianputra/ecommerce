'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, Gift, RotateCcw, Percent } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ContentService } from '@/services/content.service';

export default function PromoBanners() {
  const [promos, setPromos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sections = await ContentService.getActiveSectionsByType('WHY_SHOP');
        if (sections.length > 0 && sections[0].items) {
          const mapped = sections[0].items.map(item => {
            const styles = item.styleConfig?.split(',') || ['from-blue-500 to-indigo-600', 'from-blue-50 to-indigo-50', 'border-blue-100'];
            return {
              title: item.title,
              subtitle: item.subtitle,
              cta: item.ctaText || 'Learn More',
              href: item.linkUrl || '#',
              gradient: styles[0] || 'from-pink-500 to-rose-600',
              bg: styles[1] || 'from-pink-50 to-rose-50',
              border: styles[2] || 'border-pink-100',
              emoji: item.emoji || '✨'
            };
          });
          setPromos(mapped);
        }
      } catch (error) {
        console.error('Failed to load why shop promos', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Why Shop at shekza?</h2>
          <p className="text-neutral-500 mt-2">Exclusive perks and deals just for you</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promos.map((promo, i) => {
            const Icon = promo.icon;
            return (
              <motion.div
                key={promo.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 130 }}
                viewport={{ once: true }}
              >
                <Link href={promo.href}>
                  <motion.div
                    whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`bg-gradient-to-br ${promo.bg} border ${promo.border} rounded-2xl p-6 h-full cursor-pointer transition-all duration-200`}
                  >
                    <div className="text-3xl mb-4">{promo.emoji}</div>
                    <h3 className="font-black text-neutral-900 text-lg mb-1">{promo.title}</h3>
                    <p className="text-neutral-500 text-sm mb-4">{promo.subtitle}</p>
                    <span className={`inline-block bg-gradient-to-r ${promo.gradient} text-white text-xs font-bold px-4 py-1.5 rounded-full`}>
                      {promo.cta} →
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
