'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { ContentService } from '@/services/content.service';
import { ProductService } from '@/services/product.service';
import { Product } from '@/types/product';
import { ContentItem } from '@/types/content';

const categories = ['All', 'Best Seller', 'New Arrival', 'Sale', 'Trending'];

export default function FeaturedProducts({ items }: { items?: ContentItem[] }) {
  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (items && items.length > 0) {
          // If we have items from CMS, filter by tab (tag)
          const filtered = activeTab === 'All' 
            ? items 
            : items.filter(item => item.tag === activeTab);

          const mappedProducts = filtered.map(item => ({
            id: item.id || 0,
            name: item.title || '',
            price: 0, // CMS items might not have price, component should handle
            slug: item.linkUrl?.split('/').pop() || '',
            imageUrl: item.imageUrl || '',
            variants: [],
            isActive: true,
            isFeatured: true,
            category: item.tag || 'All',
          }));
          setProducts(mappedProducts as any);
          return;
        }

        // Fallback to ProductService if no CMS items
        let productData: Product[] = [];
        switch (activeTab) {
          case 'Best Seller':  productData = await ProductService.getBestSellers(8); break;
          case 'New Arrival':  productData = await ProductService.getTopProducts(8); break;
          case 'Trending':     productData = await ProductService.getFeaturedProducts(8); break;
          default:             productData = await ProductService.getFeaturedProducts(8);
        }

        const mappedProducts = productData.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price || p.variants?.[0]?.price || 0,
          originalPrice: p.variants?.[0]?.price,
          rating: 4.8,
          image: p.imageUrl || p.variants?.[0]?.imageUrl || '',
          colors: p.variants ? [...new Set(p.variants.map(v => v.color).filter((c): c is string => !!c))] : [],
          sizes: p.variants ? [...new Set(p.variants.map(v => v.size).filter((s): s is string => !!s))] : [],
          isNew: p.isTopProduct,
          slug: p.slug,
          category: activeTab,
        }));
        setProducts(mappedProducts as any);
      } catch (error) {
        console.error('Failed to load featured products', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [activeTab, items]);

  return (
    <section className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">Featured Products</h2>
            <p className="text-neutral-500 text-sm">Our handpicked selection for your style.</p>
          </div>

          <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-50 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === cat
                    ? 'bg-white text-neutral-900 shadow-sm border border-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product as any} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
