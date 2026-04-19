'use client';

import { motion } from 'framer-motion';
import { Instagram, ShoppingBag, Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ContentService } from '@/services/content.service';
import { SocialSectionProps } from '@/types/content';
import { formatImageUrl } from '@/lib/url-utils';

export default function SocialSection({ section }: SocialSectionProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const targetSection = section || (await ContentService.getActiveSectionsByType('SHOP_THE_LOOK'))[0];
        if (targetSection?.items) {
          const mapped = targetSection.items.map(item => ({
            id: item.id,
            image: formatImageUrl(item.imageUrl || ''),
            likes: item.badgeText || '0',
            product: item.title,
            link: item.linkUrl || '#',
          }));
          setPosts(mapped);
        }
      } catch (error) {
        console.error('Failed to load social posts', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [section]);

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">Shop the Look</h2>
            <p className="text-neutral-500 text-sm">Real style from our community @zelixa.official</p>
          </div>

          <a href="https://instagram.com" className="bg-white border border-neutral-200 px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-neutral-50 transition-colors">
            <Instagram size={18} className="text-pink-500" /> Follow Us
          </a>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-neutral-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative aspect-square group overflow-hidden rounded-2xl"
              >
                {post.image ? (
                  <img src={post.image} alt="Social" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-300">
                    <Instagram size={30} />
                  </div>
                )}
                
                <Link href={post.link}>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3">
                    <ShoppingBag size={20} className="text-white mb-2" />
                    <p className="text-white text-[9px] font-bold uppercase text-center">{post.product}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
