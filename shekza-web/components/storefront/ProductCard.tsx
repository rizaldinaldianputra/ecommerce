'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import Link from 'next/link';
import AddToCartModal from './AddToCartModal';

interface ProductCardProps {
  product: {
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
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  return (
    <>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative bg-white rounded-[2rem] p-3 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/10 border border-neutral-100 hover:border-pink-100"
      >
        {/* Badges */}
        <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-pink-200">
              New
            </span>
          )}
          {product.isHot && (
            <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-200">
              Hot
            </span>
          )}
        </div>

        {/* Wishlist Toggle */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-5 right-5 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-90"
        >
          <Heart size={18} className={isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-neutral-400'} />
        </button>

        {/* Image Container */}
        <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-neutral-50 mb-4">
          <Link href={`/products/${product.slug}`}>
            <motion.img
              src={product.image}
              alt={product.name}
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Quick Actions Overlay */}
          <div className={`absolute inset-0 bg-neutral-900/10 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-3 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartModalOpen(true)}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl text-neutral-900 hover:bg-pink-500 hover:text-white transition-colors"
            >
              <ShoppingBag size={20} />
            </motion.button>
            <Link href={`/products/${product.slug}`}>
              <motion.button
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
              >
                <Eye size={20} />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="px-2 pb-2">
          <div className="flex items-center gap-1 mb-1.5">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-neutral-400">{product.rating}</span>
          </div>
          
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-black text-neutral-900 mb-2 truncate group-hover:text-pink-500 transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-neutral-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-400 line-through">${product.originalPrice}</span>
              )}
            </div>
            
            <button 
              onClick={() => setIsCartModalOpen(true)}
              className="text-[10px] font-black uppercase tracking-widest text-pink-500 hover:text-pink-600 flex items-center gap-1 transition-colors"
            >
              Add <ShoppingBag size={12} />
            </button>
          </div>
        </div>
      </motion.div>

      <AddToCartModal 
        isOpen={isCartModalOpen} 
        onClose={() => setIsCartModalOpen(false)} 
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          colors: product.colors,
          sizes: product.sizes
        }} 
      />
    </>
  );
}
