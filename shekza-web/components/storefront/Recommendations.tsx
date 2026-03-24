'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import { ContentService } from '@/services/content.service';
import { ProductService } from '@/services/product.service';
import { Product } from '@/types/product';

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
}

export default function Recommendations() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<MappedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sections = await ContentService.getActiveSectionsByType('RECOMMENDED_PRODUCTS');
        if (sections.length > 0 && sections[0].items) {
          const productIds = sections[0].items
            .map(item => item.productId)
            .filter((id): id is number => id !== undefined && id !== null);

          if (productIds.length > 0) {
            const productData = await ProductService.getByIds(productIds);
            const mapped: MappedProduct[] = productData.map(p => ({
              id: p.id,
              name: p.name,
              price: p.price || p.variants?.[0]?.price || 0,
              originalPrice: p.variants?.[0]?.price,
              rating: 4.8, 
              image: p.imageUrl || p.variants?.[0]?.imageUrl || '',
              colors: p.variants ? [...new Set(p.variants.map(v => v.color).filter((c): c is string => !!c))] : [],
              sizes: p.variants ? [...new Set(p.variants.map(v => v.size).filter((s): s is string => !!s))] : [],
              slug: p.slug
            }));
            setProducts(mapped);
          }
        }
      } catch (error) {
        console.error('Failed to load recommended products', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-pink-500 font-bold text-sm mb-3">
              <Sparkles size={16} />
              <span>Picked Just for You</span>
            </div>
            <h2 className="text-4xl font-black text-neutral-900 leading-tight">
              Recommended<br />For You
            </h2>
          </motion.div>

          <div className="flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide no-scrollbar"
        >
          {isLoading ? (
            <p>Loading recommendations...</p>
          ) : products.length === 0 ? (
            <p>No recommendations found.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="min-w-[280px] w-[280px] snap-start">
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
