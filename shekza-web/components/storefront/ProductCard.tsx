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
        whileHover={{ y: -8 }}
        className="group relative bg-white rounded-[2rem] overflow-hidden border border-neutral-100 hover:border-pink-200 transition-all duration-500 shadow-sm hover:shadow-[0_20px_60px_-10px_rgba(236,72,153,0.25)]"
      >
        {/* IMAGE */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Link href={`/products/${product.slug}`}>
            <motion.img
              src={product.image}
              alt={product.name}
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

          {/* BADGES */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isNew && (
              <span className="px-3 py-1 text-[10px] font-black bg-white/90 backdrop-blur rounded-full">
                NEW
              </span>
            )}
            {product.isHot && (
              <span className="px-3 py-1 text-[10px] font-black bg-pink-500 text-white rounded-full">
                HOT
              </span>
            )}
          </div>

          {/* WISHLIST */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
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
          {/* RATING */}
          <div className="flex items-center gap-2">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-neutral-500">
              {product.rating}
            </span>
          </div>

          {/* TITLE */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-bold text-neutral-900 group-hover:text-pink-500 transition line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* PRICE */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-neutral-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs line-through text-neutral-400">
                  ${product.originalPrice}
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
            {product.colors?.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-neutral-200"
                style={{ backgroundColor: color.toLowerCase() }}
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