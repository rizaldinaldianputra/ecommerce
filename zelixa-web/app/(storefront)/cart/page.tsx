'use client';

import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { cartItems, cartCount, totalAmount, updateQuantity, removeFromCart, isLoading } = useCart();

  const subtotal = totalAmount;
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-500" size={40} />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6"
        >
          <ShoppingBag size={40} className="text-neutral-300" />
        </motion.div>
        <h2 className="text-3xl font-black text-neutral-900 mb-2">Your cart is empty</h2>
        <p className="text-neutral-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Time to go shopping!</p>
        <Link href="/products">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-pink-500 text-white px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-pink-100">
            Browse Products
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black text-neutral-900 mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                className="bg-white rounded-3xl p-4 md:p-6 border border-neutral-100 flex gap-4 md:gap-6 items-center hover:shadow-lg hover:shadow-black/5 transition-all"
              >
                <div className="w-24 h-32 md:w-32 md:h-40 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-50">
                  <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-neutral-900 text-base md:text-lg truncate">{item.productName}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-neutral-500 mb-4">
                    {item.groupName && <span className="text-pink-500 font-bold">{item.groupName}</span>}
                    {item.groupName && ' · '}
                    {item.color} · {item.size}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 bg-neutral-100 rounded-xl px-3 py-1.5 scale-90 origin-left">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-pink-500 transition-colors">
                        <Minus size={16} />
                      </button>
                      <span className="font-black text-neutral-900 w-4 text-center tabular-nums">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-pink-500 transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="font-black text-neutral-900 text-lg">Rp {((item.discountPrice || item.price) * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link href="/products" className="inline-flex items-center gap-2 text-pink-500 font-bold hover:translate-x-1 transition-transform mt-4">
            <ArrowRight size={18} className="rotate-180" /> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-neutral-900 rounded-3xl p-8 text-white sticky top-24">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              Order Summary <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-[10px]">{cartCount}</div>
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-neutral-400 font-medium">
                <span>Subtotal</span>
                <span className="text-white">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-neutral-400 font-medium">
                <span>Shipping</span>
                <span className="text-green-400 font-bold">FREE</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-black text-pink-400">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <Link href="/checkout">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-neutral-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </motion.button>
            </Link>

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-neutral-400">
                <Heart size={20} />
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">Save these items for later? Move them to your <Link href="/wishlist" className="text-pink-400 hover:underline">Wishlist</Link>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
