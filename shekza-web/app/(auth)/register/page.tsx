'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Chrome, Facebook, Apple, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { STYLE_CONFIG } from '@/services/style.config';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-white">

      {/* Left Side: Brand Visuals (Logo + Tagline) */}
      <div
        className="hidden lg:flex w-1/2 relative items-center justify-center p-12 overflow-hidden"
        style={{ background: STYLE_CONFIG.gradients.primary }}
      >
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/brick-wall.png')] pointer-events-none" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [-50, 50, -50]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/20 blur-[120px] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              y: [-50, 50, -50]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 blur-[100px] rounded-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center text-white p-8"
        >
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl">
              <Sparkles size={44} className="text-white fill-white" />
            </div>
            <h1 className="text-7xl font-black tracking-tighter uppercase italic">shekza</h1>
          </div>

          <h2 className="text-3xl font-black tracking-tight mb-8">Join the Aesthetics <span className="italic block mt-2 text-white/50">Revolution.</span></h2>

          <div className="space-y-6 text-left max-w-sm mx-auto">
            {[
              'Access 1.2M+ Curated Aesthetic Products',
              'Exclusive 40% Off Member Welcome Bundle',
              'Priority Shipping & Free Aesthetic Returns',
              'Personal Style Concierge Service'
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <span className="text-sm font-bold opacity-90">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 pt-16 border-t border-white/10 flex items-center justify-center gap-10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white/20 bg-neutral-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-white/60">Joined by 200K+ members</p>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-2">Create Account</h1>
            <p className="text-neutral-500 font-medium">Join us and start your journey today.</p>
          </div>

          <RegisterForm />


          <p className="mt-12 text-center text-sm text-neutral-500 font-medium">
            Already have an account?{' '}
            <Link href="/login" style={{ color: STYLE_CONFIG.primary }} className="font-black hover:underline uppercase tracking-widest text-xs">
              Go to Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
