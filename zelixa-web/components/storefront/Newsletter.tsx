'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-20 bg-neutral-900">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail size={24} className="text-neutral-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Subscribe & Get 10% OFF</h2>
        <p className="text-neutral-400 text-base mb-8">Join our newsletter to get latest updates and exclusive offers.</p>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 font-bold flex items-center justify-center gap-2">
              <CheckCircle size={20} /> Thanks for subscribing!
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Email address..."
                className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-pink-500 transition-colors"
                required
              />
              <button className="bg-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors flex items-center justify-center gap-2">
                Join <ArrowRight size={18} />
              </button>
            </form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
