'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid2X2, List, LayoutGrid, Search, X, Loader2 } from 'lucide-react';
import ProductCard from '@/components/storefront/ProductCard';
import { ProductService } from '@/services/product.service';
import { CategoryService } from '@/services/category.service';
import { Product } from '@/types/product';
import { Category } from '@/types/category';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Load Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await CategoryService.getAll();
        setCategories(catRes.content || []);
      } catch (e) {
         console.warn("Failed to fetch categories", e);
      }
    };
    fetchCategories();
  }, []);

  // Sync with URL search params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchTerm(q);
    }
    
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    } else {
      setActiveCategory(null);
      setActiveCategoryName('All');
    }
  }, [searchParams]);

  // Sync active category name when categories or activeCategory changes
  useEffect(() => {
    if (activeCategory === null) {
      setActiveCategoryName('All');
    } else {
      const cat = categories.find(c => String(c.id) === String(activeCategory));
      if (cat) {
        setActiveCategoryName(cat.name);
      }
    }
  }, [categories, activeCategory]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load Products based on dependencies
  useEffect(() => {
    const loadProducts = async () => {
      setIsSearching(true);
      try {
        let response;
        
        const isSearchRequested = debouncedSearchTerm.trim() !== '';
        
        if (isSearchRequested) {
          // Fallback to standard search while Elastic is disabled
          // let queryStr = debouncedSearchTerm;
          // if (activeCategory && activeCategory !== 'All') {
          //   queryStr = `${queryStr} catId:${activeCategory}`;
          // }
          // response = await ProductService.searchProductsElastic(queryStr, 24, 0);
          response = await ProductService.getAll(0, 24, debouncedSearchTerm, activeCategory || undefined);
        } else {
          // If not searching, use getAll with categoryId filter
          response = await ProductService.getAll(0, 24, '', activeCategory || undefined);
        }
        
        setProducts(response.content || []);
      } catch (e) {
        console.error("Failed to load products", e);
        setProducts([]);
      } finally {
        setIsSearching(false);
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [debouncedSearchTerm, activeCategory]);

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
        <div className="relative flex-1 max-w-md group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader2 size={18} className="text-pink-500 animate-spin" />
            ) : (
              <Search size={18} className="text-neutral-400 group-focus-within:text-pink-500 transition-colors" />
            )}
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-neutral-100 rounded-2xl text-sm font-bold focus:ring-2 ring-pink-400 transition-all shadow-xl shadow-black/5"
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
            className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all border ${isFilterOpen ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-900 border-neutral-100 hover:border-pink-200 shadow-sm'}`}
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
              <button
                  onClick={() => setActiveCategory(null)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl font-bold transition-all ${activeCategory === null ? 'bg-pink-50 text-pink-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
                >
                  <div className={`w-2 h-2 rounded-full transition-all ${activeCategory === null ? 'bg-pink-500 scale-100' : 'bg-transparent scale-0'}`} />
                  All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(String(cat.id))}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl font-bold transition-all ${String(activeCategory) === String(cat.id) ? 'bg-pink-50 text-pink-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
                >
                  <div className={`w-2 h-2 rounded-full transition-all ${String(activeCategory) === String(cat.id) ? 'bg-pink-500 scale-100' : 'bg-transparent scale-0'}`} />
                  {cat.name}
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
           <button
                onClick={() => setActiveCategory(null)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeCategory === null ? 'bg-pink-500 text-white shadow-lg shadow-pink-100' : 'bg-white border border-neutral-100 text-neutral-400'}`}
             >
               All
           </button>
           {categories.map(cat => (
             <button
                key={cat.id}
                onClick={() => setActiveCategory(String(cat.id))}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${String(activeCategory) === String(cat.id) ? 'bg-pink-500 text-white shadow-lg shadow-pink-100' : 'bg-white border border-neutral-100 text-neutral-400'}`}
             >
               {cat.name}
             </button>
           ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-pink-500" size={40} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {products.map((p, idx) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {products.length === 0 && (
                <div className="py-20 text-center">
                   <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search size={40} className="text-neutral-200" />
                   </div>
                   <h3 className="text-xl font-black text-neutral-900">Nothing found</h3>
                   <p className="text-neutral-500 mt-2">Try searching for something else or change your category filters.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-pink-500" size={40} />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
