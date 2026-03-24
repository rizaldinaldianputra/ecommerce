'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Chrome, Facebook, Apple, ArrowRight, Sparkles } from 'lucide-react';
import { STYLE_CONFIG } from '@/services/style.config';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Side: Brand Visuals (Logo + Tagline) */}
      <div
        className="hidden lg:flex w-1/2 relative items-center justify-center p-12 overflow-hidden"
        style={{ background: STYLE_CONFIG.gradients.primary }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        </div>

        {/* Animated Decor */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 blur-[100px] rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 blur-[100px] rounded-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 text-center text-white"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
              <Sparkles size={40} className="text-white fill-white" />
            </div>
            <h1 className="text-7xl font-black tracking-tighter uppercase italic">shekza</h1>
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-4 opacity-90">Your Aesthetic Journey Starts Here.</h2>
          <p className="max-w-md mx-auto text-white/70 font-bold leading-relaxed">
            Curated fashion, premium lifestyle, and an unmatched aesthetic experience—all in one place.
          </p>

          <div className="mt-16 flex items-center justify-center gap-12">
            {[
              { label: 'Verified', val: '50K+' },
              { label: 'Partners', val: '200+' },
              { label: 'Styles', val: '1M+' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black">{stat.val}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-y-auto">
        {/* Mobile Header (Hidden on Laptop) */}
        <div className="absolute top-8 left-0 w-full flex justify-center lg:hidden">
          <div className="flex items-center gap-2">
            <Sparkles size={24} style={{ color: STYLE_CONFIG.primary }} />
            <span className="text-2xl font-black uppercase italic tracking-tighter">shekza</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >


          <LoginForm />





        </motion.div>
      </div>
    </div>
  );
}
