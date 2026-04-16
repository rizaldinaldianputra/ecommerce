'use client';

import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PaymentErrorPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-red-200"
      >
        <XCircle size={48} className="text-white" />
      </motion.div>
      
      <h1 className="text-4xl font-black text-neutral-900 mb-4 tracking-tight">Payment Failed ❌</h1>
      <p className="text-neutral-500 mb-10 max-w-sm font-medium">
        Something went wrong while processing your payment. Please try again or contact support if the issue persists.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/checkout">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl flex items-center gap-2"
          >
            <RefreshCw size={20} /> Try Again
          </motion.button>
        </Link>
        <Link href="/">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="bg-white text-neutral-900 border border-neutral-200 px-8 py-4 rounded-2xl font-black shadow-lg flex items-center gap-2"
          >
            <ArrowLeft size={20} /> Back to Shop
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
