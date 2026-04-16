'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import { ContentService } from '@/services/content.service';
import { ProductService } from '@/services/product.service';
import { RecommendationsProps } from '@/types/content';

export default function Recommendations({ section }: RecommendationsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (section?.items && section.items.length > 0) {
          const mapped = section.items.map(item => ({
            id: item.id || 0,
            name: item.title || '',
            price: 0,
            slug: item.linkUrl?.split('/').pop() || '',
            imageUrl: item.imageUrl || '',
            variants: [],
            categoryId: 0,
            isActive: true,
            isFeatured: false,
            isTopProduct: false,
            isBestSeller: false,
            isRecommended: false,
          }));
          setProducts(mapped as any);
          return;
        }
        const productData = await ProductService.getRecommendedProducts(10);
        const mapped = productData.map(p => ({
          ...p,
          price: p.price || p.variants?.[0]?.price || 0,
          originalPrice: p.variants?.[0]?.price,
          rating: 4.8,
          image: p.imageUrl || p.variants?.[0]?.imageUrl || '',
          colors: p.variants ? [...new Set(p.variants.map(v => v.color).filter((c): c is string => !!c))] : [],
          sizes: p.variants ? [...new Set(p.variants.map(v => v.size).filter((s): s is string => !!s))] : [],
        }));
        setProducts(mapped);
      } catch (error) {
        console.error('Failed to load recommended products', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [section]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({ left: direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-pink-500 font-bold text-xs mb-2">
              <Sparkles size={14} /> Recommended
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Picked For You</h2>
          </div>

          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center hover:bg-neutral-50 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center hover:bg-neutral-50 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar"
        >
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[250px] aspect-[3/4] bg-neutral-50 rounded-xl animate-pulse flex-shrink-0" />
            ))
          ) : (
            products.map((product, i) => (
              <motion.div
                key={product.id}
                className="min-w-[250px] flex-shrink-0 snap-start"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product as any} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
