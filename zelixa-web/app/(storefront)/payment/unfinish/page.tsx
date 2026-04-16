'use client';

import { motion } from 'framer-motion';
import { Clock, ArrowRight, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function PaymentUnfinishPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-amber-200"
      >
        <Clock size={48} className="text-white" />
      </motion.div>
      
      <h1 className="text-4xl font-black text-neutral-900 mb-4 tracking-tight">Payment Pending... ⏳</h1>
      <p className="text-neutral-500 mb-10 max-w-sm font-medium">
        Your payment is still being processed or was not completed. You can finish the payment later from your order history.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/orders">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl flex items-center gap-2"
          >
            <Wallet size={20} /> Finish Payment
          </motion.button>
        </Link>
        <Link href="/">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="bg-white text-neutral-900 border border-neutral-200 px-8 py-4 rounded-2xl font-black shadow-lg flex items-center gap-2"
          >
            Go to Shop <ArrowRight size={20} />
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
