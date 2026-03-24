'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package, Gift, RotateCcw, Percent } from 'lucide-react';

const promos = [
  {
    icon: Package,
    title: 'Free Shipping',
    subtitle: 'On all orders above Rp 200K',
    cta: 'Shop Now',
    href: '/products',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-100',
    emoji: '🚚',
  },
  {
    icon: Gift,
    title: 'Buy 1 Get 1',
    subtitle: 'On selected fashion items',
    cta: 'See Deals',
    href: '/deals/bogo',
    gradient: 'from-pink-500 to-rose-600',
    bg: 'from-pink-50 to-rose-50',
    border: 'border-pink-100',
    emoji: '🎁',
  },
  {
    icon: Percent,
    title: '10% Cashback',
    subtitle: 'Pay with shekza Wallet',
    cta: 'Learn More',
    href: '/wallet',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'from-amber-50 to-orange-50',
    border: 'border-amber-100',
    emoji: '💰',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    subtitle: 'Hassle-free, no questions asked',
    cta: 'Policy Details',
    href: '/returns',
    gradient: 'from-green-500 to-emerald-600',
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-100',
    emoji: '✅',
  },
];

export default function PromoBanners() {
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
