'use client';

import { motion } from 'framer-motion';
import { Instagram, ShoppingBag, Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ContentService } from '@/services/content.service';

export default function SocialSection() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sections = await ContentService.getActiveSectionsByType('SHOP_THE_LOOK');
        if (sections.length > 0 && sections[0].items) {
          const mapped = sections[0].items.map(item => ({
            id: item.id,
            image: item.imageUrl,
            likes: item.badgeText || '0',
            product: item.title,
            link: item.linkUrl || '#'
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
  }, []);
  return (
    <section className="py-24 bg-neutral-50 relative overflow-hidden">
      {/* Decorative Text background */}
      <div className="absolute top-10 left-10 pointer-events-none opacity-[0.03]">
        <h1 className="text-[200px] font-black leading-none uppercase tracking-tighter select-none">SOCIAL</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-none mb-4">
              Shop <span className="text-pink-500 italic">the Look</span>
            </h2>
            <p className="text-neutral-500 font-medium max-w-sm">
              Real style from real people. Mention us <span className="font-bold text-neutral-900">@shekza.official</span> to get featured.
            </p>
          </div>

          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(244,63,94,0.15)' }}
              whileTap={{ scale: 0.97 }}
              className="bg-white border border-neutral-100 text-neutral-900 px-8 py-4 rounded-3xl font-black text-sm flex items-center gap-3 shadow-xl shadow-neutral-200 transition-all hover:border-pink-200"
            >
              <Instagram size={20} className="text-pink-500" /> FAM ON INSTAGRAM
            </motion.button>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-[2rem]"
            >
              <img
                src={post.image}
                alt="Social Fit"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <Link href={post.link}>
                <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-pink-500 mb-4 shadow-xl"
                  >
                    <ShoppingBag size={20} />
                  </motion.div>
                  <p className="text-white text-[11px] font-black uppercase tracking-widest mb-1">{post.product}</p>
                  <div className="flex items-center gap-3 text-white/80">
                    <span className="text-[10px] font-bold flex items-center gap-1"><Heart size={10} className="fill-white" /> {post.likes}</span>
                    <span className="text-[10px] font-bold flex items-center gap-1"><Eye size={10} /> View</span>
                  </div>
                </div>
              </Link>

              {/* Tag Badge */}
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-2 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-widest opacity-80 group-hover:opacity-0 transition-opacity">
                #shekza_FIT
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Tag */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-neutral-200" />
          <p className="text-xs font-black text-neutral-300 uppercase tracking-[0.4em]">Inspire & Be Inspired</p>
          <div className="h-px w-12 bg-neutral-200" />
        </div>
      </div>
    </section>
  );
}
