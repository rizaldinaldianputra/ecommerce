'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black relative overflow-hidden">
      {/* Animated background orbs */}
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-0 left-1/4 w-64 h-64 bg-pink-500 rounded-full blur-3xl pointer-events-none" />
      <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} className="absolute bottom-0 right-1/4 w-80 h-80 bg-rose-500 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 text-center relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex justify-center mb-6">
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} className="w-16 h-16 bg-pink-500/20 border border-pink-500/30 rounded-2xl flex items-center justify-center">
              <Mail size={28} className="text-pink-400" />
            </motion.div>
          </div>

          <p className="text-xs font-black text-pink-400 uppercase tracking-widest mb-3">Newsletter</p>
          <h2 className="text-4xl font-black text-white tracking-tight mb-4">
            Subscribe & Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">10% OFF</span>
          </h2>
          <p className="text-neutral-400 text-lg mb-10">Be the first to hear about new arrivals, exclusive deals, and style tips delivered weekly.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: 2 }}>
                <CheckCircle size={56} className="text-green-400" />
              </motion.div>
              <h3 className="text-2xl font-black text-white">You're In! 🎉</h3>
              <p className="text-neutral-400">We've sent your 10% discount code to <span className="text-pink-400 font-bold">{email}</span></p>
            </motion.div>
          ) : (
            <motion.form key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full pl-10 pr-4 py-4 bg-white/10 border border-white/15 rounded-2xl text-white placeholder-neutral-500 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-pink-500/30 flex items-center gap-2 whitespace-nowrap disabled:opacity-70"
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles size={16} />
                  </motion.div>
                ) : <Sparkles size={16} />}
                {loading ? 'Subscribing...' : 'Subscribe Now'}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
        
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-neutral-600 text-xs mt-5">
          No spam. Unsubscribe anytime. 🔒 Your privacy is safe with us.
        </motion.p>
      </div>
    </section>
  );
}
