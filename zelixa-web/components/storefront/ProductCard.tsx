'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import Link from 'next/link';
import AddToCartModal from './AddToCartModal';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product, ProductCardProps } from '@/types/product';

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  return (
    <>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -8 }}
        className="group relative bg-white rounded-[2rem] overflow-hidden border border-neutral-100 hover:border-pink-200 transition-all duration-500 shadow-sm hover:shadow-[0_20px_60px_-10px_rgba(236,72,153,0.25)]"
      >
        {/* IMAGE */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Link href={`/products/${product.slug}`}>
            {(product.imageUrl || product.img) ? (
              <motion.img
                src={product.imageUrl || product.img}
                alt={product.name}
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                <ShoppingBag size={40} className="opacity-20" />
              </div>
            )}
          </Link>

          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

          {/* BADGES */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isActive && (
              <span className="px-3 py-1 text-[10px] font-black bg-white/90 backdrop-blur rounded-full">
                ACTIVE
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-3 py-1 text-[10px] font-black bg-pink-500 text-white rounded-full">
                HOT
              </span>
            )}
          </div>

          {/* WISHLIST */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition"
          >
            <Heart
              size={18}
              className={`transition ${isWishlisted
                ? 'fill-pink-500 text-pink-500'
                : 'text-neutral-500'
                }`}
            />
          </button>

          {/* QUICK ACTION */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartModalOpen(true)}
              className="flex-1 py-3 bg-white text-neutral-900 rounded-xl font-bold text-sm shadow-lg hover:bg-pink-500 hover:text-white transition"
            >
              Add to Cart
            </motion.button>

            <Link href={`/products/${product.slug}`}>
              <button className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-neutral-900 hover:text-white transition">
                <Eye size={18} />
              </button>
            </Link>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-3">
          {/* TITLE */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-bold text-neutral-900 group-hover:text-pink-500 transition line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {product.variants && product.variants.length > 1 ? (
                <>
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Starting from</span>
                  <span className="text-lg font-black text-neutral-900">
                    Rp {Math.min(...product.variants.map(v => v.price)).toLocaleString('id-ID')}
                  </span>
                </>
              ) : (
                <span className="text-lg font-black text-neutral-900">
                  Rp {(product.price || 0).toLocaleString('id-ID')}
                </span>
              )}
            </div>

            <button
              onClick={() => setIsCartModalOpen(true)}
              className="text-pink-500 text-xs font-bold hover:underline"
            >
              Add
            </button>
          </div>

          {/* COLORS */}
          <div className="flex gap-2">
            {product.variants?.reduce((acc: any[], v) => {
              if (v.hexColor && !acc.some(a => a.hexColor === v.hexColor)) {
                acc.push(v);
              }
              return acc;
            }, []).slice(0, 4).map((v, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-neutral-200 shadow-sm"
                style={{ backgroundColor: v.hexColor }}
                title={v.color}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <AddToCartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        product={product}
      />
    </>
  );
}