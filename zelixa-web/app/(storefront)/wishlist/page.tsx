'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/storefront/ProductCard';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductService } from '@/services/product.service';
import { Product } from '@/types/product';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, isLoading: isWishlistLoading } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (wishlistItems.length === 0) {
        setProducts([]);
        return;
      }
      setIsProductsLoading(true);
      try {
        const productIds = wishlistItems.map(item => item.productId);
        const data = await ProductService.getByIds(productIds);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch wishlist products:', error);
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchProducts();
  }, [wishlistItems]);

  const isLoading = isWishlistLoading || isProductsLoading;

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-500" size={40} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center mb-8"
        >
          <Heart size={56} className="text-pink-200" />
        </motion.div>
        <h2 className="text-4xl font-black text-neutral-900 mb-4 tracking-tight">Your wishlist is empty</h2>
        <p className="text-neutral-500 mb-10 max-w-sm text-lg">Save your favorite items to keep track of them and get alerts on price drops!</p>
        <Link href="/products">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-neutral-900 text-white px-10 py-4 rounded-[2rem] font-black shadow-2xl flex items-center gap-2">
            Start Exploring <ArrowRight size={20} />
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-100/40 blur-[130px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/30 blur-[110px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-5xl font-black text-neutral-900 tracking-tight mb-4 flex items-center gap-4">
            My <span className="bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">Wishlist</span>
          </h1>
          <p className="text-neutral-500 text-lg font-medium">You have {products.length} items saved for later.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {products.map((product) => {
              const wishlistItem = wishlistItems.find(item => item.productId === product.id);
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  <ProductCard product={product} />
                  
                  {/* Remove button overlay */}
                  <button
                    onClick={() => wishlistItem && removeFromWishlist(wishlistItem.id)}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-neutral-100 text-red-500 hover:text-red-700 transition-colors z-20"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
