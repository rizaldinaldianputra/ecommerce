'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';

function FinishContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-200"
      >
        <CheckCircle2 size={48} className="text-white" />
      </motion.div>
      
      <h1 className="text-4xl font-black text-neutral-900 mb-4 tracking-tight">Payment Successful! 🎉</h1>
      <p className="text-neutral-500 mb-10 max-w-sm font-medium">
        Thank you for your purchase. Your order {orderId ? `#${orderId}` : ''} has been confirmed and is being processed.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/orders">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black shadow-xl flex items-center gap-2"
          >
            <Package size={20} /> View My Orders
          </motion.button>
        </Link>
        <Link href="/">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="bg-white text-neutral-900 border border-neutral-200 px-8 py-4 rounded-2xl font-black shadow-lg flex items-center gap-2"
          >
            Return Home <ArrowRight size={20} />
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFinishPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    }>
      <FinishContent />
    </Suspense>
  );
}
