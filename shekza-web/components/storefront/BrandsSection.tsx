'use client';

import { motion } from 'framer-motion';

const brands = [
  { name: 'Zara', logo: 'ZARA' },
  { name: 'H&M', logo: 'H&M' },
  { name: 'Uniqlo', logo: 'UNIQLO' },
  { name: 'Nike', logo: 'NIKE' },
  { name: 'Adidas', logo: 'adidas' },
  { name: 'Gucci', logo: 'GUCCI' },
  { name: 'Prada', logo: 'PRADA' },
  { name: 'Balenciaga', logo: 'BALENCIAGA' },
  { name: 'Versace', logo: 'VERSACE' },
  { name: 'Levi\'s', logo: "LEVI'S" },
];

export default function BrandsSection() {
  return (
    <section className="py-16 bg-white border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-2">Official Partners</p>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Trusted Brands</h2>
        </motion.div>

        <div className="relative overflow-hidden">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            className="flex gap-8 items-center w-max"
          >
            {[...brands, ...brands].map((brand, i) => (
              <motion.div
                key={`${brand.name}-${i}`}
                whileHover={{ scale: 1.1 }}
                className="flex-shrink-0 w-28 h-14 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center justify-center cursor-pointer hover:border-pink-200 hover:bg-pink-50 transition-all duration-200"
              >
                <span className="text-xs font-black text-neutral-600 tracking-widest">{brand.logo}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
