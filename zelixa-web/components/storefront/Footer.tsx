'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, Zap } from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', href: '/products?sort=new' },
    { label: 'Best Sellers', href: '/products?sort=popular' },
    { label: 'Flash Sale', href: '/flash-sale' },
    { label: 'All Products', href: '/products' },
    { label: 'Brands', href: '/brands' },
  ],
  Account: [
    { label: 'My Account', href: '/account' },
    { label: 'Order History', href: '/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Track Order', href: '/track' },
    { label: 'Loyalty Points', href: '/rewards' },
  ],
  Help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Return Policy', href: '/returns' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};


export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      {/* App download bar */}
      <div className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white fill-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Download the zelixa App</p>
              <p className="text-neutral-500 text-xs">Shop faster, easier, and smarter</p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.04 }} className="bg-white text-neutral-900 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
              🍎 App Store
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} className="bg-white text-neutral-900 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
              🤖 Google Play
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="text-xl font-black text-white">Zeli<span className="text-pink-400">xa</span></span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
              Your one-stop destination for curated fashion, beauty, and lifestyle products. Style delivered to your door.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-pink-500 flex-shrink-0" />
                Jl. Fashion No. 10, Jakarta Selatan, Indonesia
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-pink-500 flex-shrink-0" />
                +62 812-3456-7890
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-pink-500 flex-shrink-0" />
                hello@zelixa.id
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-pink-400 transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-800 mt-16 pt-8 flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Social */}
          <div className="flex items-center gap-4">
            {[
              { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
              { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
              { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.15, color: '#f43f5e' }} className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-xl flex items-center justify-center transition-colors">
                <Icon size={18} className="text-neutral-400" />
              </motion.a>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] text-neutral-600 font-medium tracking-wide uppercase italic">© 2026 zelixa Studio. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
