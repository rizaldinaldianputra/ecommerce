'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid2X2, List, LayoutGrid, Search, X } from 'lucide-react';
import ProductCard from '@/components/storefront/ProductCard';

const allProducts = [
  { id: 1, name: 'Pastel Dream Hoodie', price: 49.99, originalPrice: 79.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600', colors: ['Pink', 'White', 'Black'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, category: 'Fashion', slug: 'pastel-dream-hoodie' },
  { id: 2, name: 'Aesthetic Canvas Tote', price: 24.99, rating: 4.5, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600', colors: ['Cream', 'White'], sizes: ['One Size'], isHot: true, category: 'Bags', slug: 'aesthetic-canvas-tote' },
  { id: 3, name: 'Minimalist Rose Watch', price: 89.99, originalPrice: 120.0, rating: 4.9, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600', colors: ['Gold', 'Silver'], sizes: ['One Size'], category: 'Watch', slug: 'minimalist-rose-watch' },
  { id: 4, name: 'Oversized Denim Jacket', price: 65.0, rating: 4.7, image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=600', colors: ['Blue', 'Black'], sizes: ['M', 'L', 'XL'], isNew: true, category: 'Fashion', slug: 'oversized-denim-jacket' },
  { id: 5, name: 'Platform Chunky Sneakers', price: 79.99, originalPrice: 110.0, rating: 4.6, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600', colors: ['White', 'Pastel'], sizes: ['38', '39', '40', '41'], category: 'Shoes', slug: 'platform-chunky-sneakers' },
  { id: 6, name: 'Vintage Cat-Eye Shades', price: 18.99, rating: 4.4, image: 'https://images.unsplash.com/photo-1511499767390-a75c1793ff02?auto=format&fit=crop&q=80&w=600', colors: ['Black', 'Pink'], sizes: ['One Size'], category: 'Beauty', slug: 'vintage-cat-eye-shades' },
  { id: 7, name: 'Silky Slip Dress', price: 45.0, rating: 4.8, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600', colors: ['Champagne', 'Silver', 'Black'], sizes: ['S', 'M', 'L'], isHot: true, category: 'Fashion', slug: 'silky-slip-dress' },
  { id: 8, name: 'Handmade Clay Earrings', price: 12.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400', colors: ['Earth', 'Multicolor'], sizes: ['One Size'], isNew: true, category: 'Beauty', slug: 'handmade-clay-earrings' },
];

const categories = ['All', 'Fashion', 'Shoes', 'Bags', 'Beauty', 'Watch'];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = allProducts.filter(p => 
    (activeCategory === 'All' || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen pb-20 pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight mb-4">
          Explore <span className="bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent italic">Everything</span>
        </h1>
        <p className="text-neutral-500 text-lg font-medium max-w-xl">
          From curated fashion to aesthetic lifestyles, find what makes you unique.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 sticky top-24 z-30 bg-white/80 backdrop-blur-md py-4 -mx-4 px-4 border-y border-neutral-100/50 shadow-sm md:shadow-none md:border-none md:bg-transparent md:static">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-neutral-100 border-none rounded-[2rem] text-sm font-bold focus:ring-2 ring-pink-400 transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-4 flex items-center text-neutral-400 hover:text-neutral-900">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all border ${isFilterOpen ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-900 border-neutral-100 hover:border-pink-200'}`}
          >
            <Filter size={18} /> Filters
          </button>
          
          <div className="hidden md:flex items-center gap-2 p-1.5 bg-neutral-100 rounded-2xl">
            <button className="p-2 bg-white text-neutral-900 shadow-sm rounded-xl"><LayoutGrid size={18} /></button>
            <button className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"><Grid2X2 size={18} /></button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters (Hidden on Mobile) */}
        <aside className="hidden lg:block w-64 space-y-10 flex-shrink-0">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">Categories</h3>
            <div className="space-y-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl font-bold transition-all ${activeCategory === cat ? 'bg-pink-50 text-pink-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
                >
                  <div className={`w-2 h-2 rounded-full transition-all ${activeCategory === cat ? 'bg-pink-500 scale-100' : 'bg-transparent scale-0'}`} />
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">Sort By</h3>
            <div className="space-y-4">
               {['Newest Arrivals', 'Price: Low to High', 'Price: High to Low', 'Best Rating'].map(s => (
                 <label key={s} className="flex items-center gap-3 cursor-pointer group">
                   <div className="w-5 h-5 rounded-md border-2 border-neutral-200 group-hover:border-pink-300 transition-colors" />
                   <span className="text-sm font-bold text-neutral-600 group-hover:text-neutral-900 transition-colors">{s}</span>
                 </label>
               ))}
            </div>
          </div>
        </aside>

        {/* Categories Mobile Scroll */}
        <div className="lg:hidden flex gap-3 overflow-x-auto pb-6 scrollbar-hide no-scrollbar -mx-4 px-4 sticky top-[160px] z-20 bg-white/50 backdrop-blur-sm pt-2">
           {categories.map(cat => (
             <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-pink-500 text-white shadow-lg shadow-pink-100' : 'bg-white border border-neutral-100 text-neutral-400'}`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p, idx) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
               <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={40} className="text-neutral-200" />
               </div>
               <h3 className="text-xl font-black text-neutral-900">Nothing found</h3>
               <p className="text-neutral-500 mt-2">Try searching for something else or change your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
