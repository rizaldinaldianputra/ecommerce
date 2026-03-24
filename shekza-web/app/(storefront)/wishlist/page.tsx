'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/storefront/ProductCard';

const initialWishlist = [
  { id: 1, name: 'Pastel Dream Hoodie', price: 49.99, originalPrice: 79.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600', colors: ['Pink', 'White', 'Black'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, slug: 'pastel-dream-hoodie' },
  { id: 2, name: 'Aesthetic Canvas Tote', price: 24.99, rating: 4.5, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600', colors: ['Cream', 'White'], sizes: ['One Size'], isHot: true, slug: 'aesthetic-canvas-tote' },
];

export default function WishlistPage() {
  const [items, setItems] = useState(initialWishlist);

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center mb-8"
        >
          <Heart size={56} className="text-pink-200" />
        </motion.div>
        <h2 className="text-4xl font-black text-neutral-900 mb-4 tracking-tight">Your wishlist is empty</h2>
        <p className="text-neutral-500 mb-10 max-w-sm text-lg">Save your favorite items to keep track of them and get alerts on price drops!</p>
        <Link href="/">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-neutral-900 text-white px-10 py-4 rounded-[2rem] font-black shadow-2xl flex items-center gap-2">
            Start Exploring <ArrowRight size={20} />
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-100/40 blur-[130px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/30 blur-[110px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-5xl font-black text-neutral-900 tracking-tight mb-4 flex items-center gap-4">
            My <span className="bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">Wishlist</span>
          </h1>
          <p className="text-neutral-500 text-lg font-medium">You have {items.length} items saved for later.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {items.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <ProductCard product={product} />
                
                {/* Remove button overlay */}
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute bottom-1 right-1 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-neutral-100 text-red-400 hover:text-red-600 transition-colors z-20"
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Recommendation section placeholder */}
        <div className="mt-32 pt-20 border-t border-neutral-100">
          <h3 className="text-2xl font-black text-neutral-900 mb-10">You might also like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 opacity-60">
             {/* Simple placeholders or just a few more cards */}
             <ProductCard product={{ id: 99, name: 'Coming Soon', price: 0, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400', colors: [], sizes: [], slug: 'test', rating: 5 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
