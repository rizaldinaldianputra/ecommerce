'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProductCard from './ProductCard';

const categories = ['All', 'Best Seller', 'New Arrival', 'Sale', 'Trending'];

const allProducts = [
  { id: 1, name: 'Pastel Dream Hoodie', price: 49.99, originalPrice: 79.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600', colors: ['Pink', 'White', 'Black'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, category: 'New Arrival', slug: 'pastel-dream-hoodie' },
  { id: 2, name: 'Aesthetic Canvas Tote', price: 24.99, rating: 4.5, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600', colors: ['Cream', 'White'], sizes: ['One Size'], isHot: true, category: 'Trending', slug: 'aesthetic-canvas-tote' },
  { id: 3, name: 'Minimalist Rose Watch', price: 89.99, originalPrice: 120.0, rating: 4.9, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600', colors: ['Gold', 'Silver'], sizes: ['One Size'], category: 'Best Seller', slug: 'minimalist-rose-watch' },
  { id: 4, name: 'Oversized Denim Jacket', price: 65.0, rating: 4.7, image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=600', colors: ['Blue', 'Black'], sizes: ['M', 'L', 'XL'], isNew: true, category: 'New Arrival', slug: 'oversized-denim-jacket' },
  { id: 5, name: 'Platform Chunky Sneakers', price: 79.99, originalPrice: 110.0, rating: 4.6, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600', colors: ['White', 'Pastel'], sizes: ['38', '39', '40', '41'], category: 'Sale', slug: 'platform-chunky-sneakers' },
  { id: 6, name: 'Vintage Cat-Eye Shades', price: 18.99, rating: 4.4, image: 'https://images.unsplash.com/photo-1511499767390-a75c1793ff02?auto=format&fit=crop&q=80&w=600', colors: ['Black', 'Pink'], sizes: ['One Size'], category: 'Trending', slug: 'vintage-cat-eye-shades' },
  { id: 7, name: 'Silky Slip Dress', price: 45.0, rating: 4.8, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600', colors: ['Champagne', 'Silver', 'Black'], sizes: ['S', 'M', 'L'], isHot: true, category: 'Best Seller', slug: 'silky-slip-dress' },
  { id: 8, name: 'Handmade Clay Earrings', price: 12.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600', colors: ['Earth', 'Multicolor'], sizes: ['One Size'], isNew: true, category: 'New Arrival', slug: 'handmade-clay-earrings' },
];

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('All');

  const filteredProducts = activeTab === 'All' 
    ? allProducts 
    : allProducts.filter(p => p.category === activeTab);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-100/30 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/20 blur-[100px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4"
            >
              Curated <span className="bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">Selections</span>
            </motion.h2>
            <p className="text-neutral-500 text-lg">Handpicked essentials for your contemporary aesthetic.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${activeTab === cat ? 'bg-neutral-900 text-white shadow-xl shadow-neutral-200' : 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        <div className="mt-20 text-center">
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white border border-neutral-100 rounded-[2rem] font-black text-neutral-900 shadow-xl shadow-black/5 hover:bg-neutral-900 hover:text-white transition-all"
            >
              Explore All Products
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
