'use client';

import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ChatFAB from '@/components/storefront/ChatFAB';
import { motion } from 'framer-motion';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen relative bg-white selection:bg-pink-100 selection:text-pink-600">
      {/* Global Aesthetic Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.03, 0.06, 0.03],
            x: [0, -40, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-indigo-500 blur-[100px] rounded-full" 
        />
        <div className="absolute top-[40%] right-[10%] w-[25%] h-[35%] bg-amber-500/5 blur-[80px] rounded-full" />
      </div>
      
      <Navbar cartCount={2} wishlistCount={3} />
      <main className="flex-grow relative z-10">{children}</main>
      <ChatFAB />
      <Footer />
    </div>
  );
}
