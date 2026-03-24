'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { ContentService } from '@/services/content.service';
import { ProductService } from '@/services/product.service';
import { Product } from '@/types/product';

const categories = ['All', 'Best Seller', 'New Arrival', 'Sale', 'Trending'];

interface MappedProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  isHot?: boolean;
  slug: string;
  category: string;
}

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState<MappedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sections = await ContentService.getActiveSectionsByType('CURATED_PRODUCTS');
        if (sections.length > 0 && sections[0].items) {
          const productIds = sections[0].items
            .map(item => item.productId)
            .filter((id): id is number => id !== undefined && id !== null);

          if (productIds.length > 0) {
            const productData = await ProductService.getByIds(productIds);

            // Map the tags from ContentItems back to the products for filtering
            const mappedProducts = productData.map(p => {
              const contentItem = sections[0].items.find(item => item.productId === p.id);
              return {
                id: p.id,
                name: p.name,
                price: p.price || p.variants?.[0]?.price || 0,
                originalPrice: p.variants?.[0]?.price,
                rating: 4.8, // Fallback rating
                image: p.imageUrl || p.variants?.[0]?.imageUrl || '',
                colors: p.variants ? [...new Set(p.variants.map(v => v.color).filter((c): c is string => !!c))] : [],
                sizes: p.variants ? [...new Set(p.variants.map(v => v.size).filter((s): s is string => !!s))] : [],
                isNew: true,
                slug: p.slug,
                category: contentItem?.tag || 'All'
              };
            });

            setProducts(mappedProducts as any);
          }
        }
      } catch (error) {
        console.error('Failed to load curated products', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = activeTab === 'All'
    ? products
    : products.filter((p: any) => p.category === activeTab);

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
