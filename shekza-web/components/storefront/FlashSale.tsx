'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { Zap, Clock } from 'lucide-react';

const flashSaleProducts = [
  { id: 101, name: 'Wireless Noise Cancelling Headphones', price: 129.99, originalPrice: 199.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600', colors: ['Black', 'Silver'], sizes: ['One Size'], isHot: true, slug: 'wireless-headphones-flash', stock: 12 },
  { id: 102, name: 'Smart Fitness Tracker', price: 45.0, originalPrice: 89.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600', colors: ['Black', 'Navy'], sizes: ['One Size'], isHot: true, slug: 'fitness-tracker-flash', stock: 5 },
  { id: 103, name: 'Portable Mini Projector', price: 199.0, originalPrice: 299.0, rating: 4.8, image: 'https://images.unsplash.com/photo-1535016120720-40c646bebbfc?auto=format&fit=crop&q=80&w=600', colors: ['White'], sizes: ['One Size'], isHot: true, slug: 'mini-projector-flash', stock: 8 },
  { id: 104, name: 'Ergonomic Mechanical Keyboard', price: 75.0, originalPrice: 120.0, rating: 4.6, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=600', colors: ['Grey', 'Black'], sizes: ['US Layout'], isHot: true, slug: 'mechanical-keyboard-flash', stock: 3 },
];

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500 blur-[150px] -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 blur-[120px] -z-10 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 rotate-12">
              <Zap size={32} className="text-white fill-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-2">Flash Sale</h2>
              <p className="text-neutral-400 font-medium">Limited time offers. Grab them before they're gone!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Clock size={20} className="text-amber-400" />
             <div className="flex items-center gap-2">
                {[
                  { value: timeLeft.hours, label: 'H' },
                  { value: timeLeft.minutes, label: 'M' },
                  { value: timeLeft.seconds, label: 'S' }
                ].map((unit, i) => (
                  <div key={unit.label} className="flex items-center gap-2">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl flex flex-col items-center justify-center border border-white/10 shadow-xl">
                      <span className="text-2xl font-black text-white tabular-nums">{unit.value.toString().padStart(2, '0')}</span>
                    </div>
                    {i < 2 && <span className="text-white/30 font-black text-xl">:</span>}
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {flashSaleProducts.map((product) => (
            <div key={product.id} className="relative group">
              {/* Product Card with some custom styles for dark theme if needed */}
              <div className="bg-neutral-800/40 backdrop-blur-sm rounded-[2rem] p-3 border border-white/5 group-hover:bg-neutral-800/60 transition-colors">
                <ProductCard product={product} />
                
                {/* Stock Bar (Flash Sale specific) */}
                <div className="px-5 pb-6 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Available</span>
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{product.stock} Left</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(product.stock / 15) * 100}%` }}
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
