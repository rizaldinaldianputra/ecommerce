'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Bell,
  Package, MapPin, LogOut, Settings, Zap, ChevronRight, Sparkles,
  Activity
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { AuthUser } from '@/types/auth';
import { authService } from '@/services/auth.service';
import { CategoryService } from '@/services/category.service';
import { Category } from '@/types/category';
import { formatImageUrl } from '@/lib/url-utils';

// Helper to map category names to icons (or use default)
const getCategoryIcon = (name: string) => {
  const map: Record<string, string> = {
    'Fashion': '👗',
    'Shoes': '👟',
    'Bags': '👜',
    'Beauty': '💄',
    'Electronics': '📱',
    'Home': '🏠',
  };
  return map[name] || '✨';
};

const suggestions = ['Pastel Hoodie', 'Platform Sneakers', 'Mini Crossbody Bag', 'Rose Gold Watch', 'Aesthetic Room Decor'];

export default function Navbar() {
  const router = useRouter();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const checkAuth = () => {
      setIsLoggedIn(authService.isLoggedIn());
      setUser(authService.getUser());
    };

    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getAll();
        setCategories(response.content || []);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('auth-change', checkAuth);
    checkAuth();
    fetchCategories();
    setMounted(true);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUserMenuOpen(false);
  };

  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) return;
    router.push(`/products?q=${encodeURIComponent(query)}`);
    setSearchFocused(false);
    setIsMobileSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-neutral-100' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Left: Menu & Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 text-neutral-600 transition-colors"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <Link href="/" className="flex items-center gap-2 pr-4 md:border-r md:border-neutral-100 mr-2">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200"
                >
                  <Activity size={16} className="text-white fill-white md:w-18 md:h-18" />
                </motion.div>
                <span className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
                  Zeli<span className="text-pink-500">xa</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-6">
                <Link href="/products" className="text-sm font-bold text-neutral-600 hover:text-pink-500 transition-colors">Explore</Link>
                <div className="relative group">
                  <button className="flex items-center gap-1 text-sm font-bold text-neutral-600 hover:text-pink-500 transition-colors group h-full py-4">
                    Categories <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </button>

                  {/* Mega Menu Dropdown */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                    <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-black/10 border border-neutral-100 p-6 min-w-[500px] grid grid-cols-2 gap-4">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.id}`}
                          className="flex items-center gap-4 p-4 rounded-2xl hover:bg-neutral-50 transition-all group/item border border-transparent hover:border-pink-100"
                        >
                          <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-xl group-hover/item:scale-110 group-hover/item:bg-pink-50 transition-all">
                            {cat.imageUrl ? <img src={formatImageUrl(cat.imageUrl)} alt={cat.name} className="w-6 h-6 object-contain" /> : getCategoryIcon(cat.name)}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-neutral-900 group-hover/item:text-pink-500 transition-colors">{cat.name}</h4>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Shop Collection</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <Link href="/deals" className="text-sm font-bold text-neutral-600 hover:text-pink-500 transition-colors">Deals</Link>
              </nav>
            </div>

            {/* Center: Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
              <div className={`relative w-full flex items-center transition-all duration-300 ${searchFocused ? 'ring-2 ring-pink-400' : ''} bg-neutral-100 rounded-2xl`}>
                <Search size={16} className="absolute left-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search aesthetics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent text-[13px] text-neutral-800 placeholder-neutral-400 outline-none"
                />
              </div>

              <AnimatePresence>
                {searchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl shadow-black/15 border border-neutral-100 p-5 z-50"
                  >
                    <div className="flex items-center gap-2 mb-4 text-pink-500">
                      <Sparkles size={14} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Trending Now</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSearch(s)}
                          className="text-xs px-3 py-2 bg-neutral-50 border border-neutral-100 text-neutral-600 rounded-xl font-bold hover:bg-pink-50 hover:text-pink-600 hover:border-pink-100 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              {/* Mobile Search Trigger */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden p-2.5 text-neutral-600 hover:text-pink-500 transition-colors"
              >
                <Search size={20} />
              </button>

              <Link href="/wishlist">
                <motion.div whileTap={{ scale: 0.9 }} className="relative p-2.5 text-neutral-600 hover:text-pink-500 transition-colors group cursor-pointer">
                  <Heart size={20} className="group-hover:fill-pink-500 transition-all" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-pink-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">{wishlistCount}</span>
                  )}
                </motion.div>
              </Link>

              <Link href="/cart">
                <motion.div whileTap={{ scale: 0.9 }} className="relative p-2.5 text-neutral-600 hover:text-pink-500 transition-colors group cursor-pointer">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-br from-pink-500 to-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              <div className="relative ml-2" ref={userRef}>
                <Link href={mounted ? (isLoggedIn ? '/profile' : '/login') : '#'}>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => isLoggedIn && setUserMenuOpen(true)}
                    className="flex items-center gap-2 p-1 bg-neutral-50 rounded-full border border-neutral-100 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shadow-md bg-gradient-to-br from-indigo-500 to-purple-600">
                      {user?.profilePicture ? (
                        <img src={formatImageUrl(user.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={16} className="text-white" />
                      )}
                    </div>
                  </motion.div>
                </Link>

                {/* User Dropdown... (keep logic same but upgrade aesthetic) */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-black/10 border border-neutral-100 overflow-hidden z-[110]"
                    >
                      <div className="p-6 bg-gradient-to-br from-neutral-50 to-pink-50/30">
                        <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-1">Account</p>
                        <h4 className="text-lg font-black text-neutral-900 leading-tight">
                          {mounted ? (isLoggedIn ? `Hello, ${user?.fullName || 'User'} ✨` : 'Join zelixa 🌸') : '...'}
                        </h4>
                        {!isLoggedIn && (
                          <Link href="/login" className="mt-4 block text-center text-xs font-black text-white bg-neutral-900 rounded-2xl py-3 hover:bg-pink-500 transition-colors shadow-lg shadow-neutral-200">
                            SIGN IN / JOIN
                          </Link>
                        )}
                      </div>
                      <div className="p-3 space-y-1">
                        {[
                          { icon: Package, label: 'My Orders', href: '/orders' },
                          { icon: Heart, label: 'Wishlist', href: '/wishlist' },
                          { icon: MapPin, label: 'Addresses', href: '/addresses' },
                          { icon: Settings, label: 'Settings', href: '/profile' },
                        ].map(({ icon: Icon, label, href }) => (
                          <Link key={label} href={href} className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-neutral-50 transition-all group">
                            <div className="flex items-center gap-3">
                              <Icon size={18} className="text-neutral-400 group-hover:text-pink-500" />
                              <span className="text-[13px] font-bold text-neutral-600 group-hover:text-neutral-900">{label}</span>
                            </div>
                            <ChevronRight size={14} className="text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
                          </Link>
                        ))}
                        {isLoggedIn && (
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all mt-2 group">
                            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                            <span className="text-[13px] font-black uppercase tracking-widest">Sign Out</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-neutral-100 bg-white px-4 py-3"
            >
              <div className="relative flex items-center bg-neutral-100 rounded-xl px-4">
                <Search size={18} className="text-neutral-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full py-3 bg-transparent text-sm outline-none pl-3"
                />
                <button onClick={() => setIsMobileSearchOpen(false)} className="p-1"><X size={16} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Menu */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 bg-neutral-900/30 backdrop-blur-sm z-[110] lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[120] lg:hidden flex flex-col shadow-2xl"
              >
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center"><Zap size={16} className="text-white" /></div>
                    <span className="text-lg font-black italic">zelixa</span>
                  </Link>
                  <button onClick={() => setMenuOpen(false)} className="p-2"><X size={24} /></button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">Categories</p>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map(cat => (
                        <Link key={cat.id} href={`/products?category=${cat.id}`} className="flex flex-col items-center gap-2 p-4 bg-neutral-50 rounded-2xl hover:bg-pink-50 transition-colors text-center border border-neutral-100">
                          <span className="text-2xl">{getCategoryIcon(cat.name)}</span>
                          <span className="text-xs font-black uppercase truncate w-full">{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Explore</p>
                    <Link href="/products" className="flex items-center justify-between py-2 text-lg font-bold text-neutral-800">
                      Featured Collection <ChevronRight size={20} />
                    </Link>
                    <Link href="/deals" className="flex items-center justify-between py-2 text-lg font-bold text-pink-500">
                      Flash Deals 🔥 <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>

                <div className="p-6 bg-neutral-50 border-t border-neutral-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-neutral-200 rounded-2xl" />
                    <div>
                      <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Support</p>
                      <p className="text-sm font-bold text-neutral-900">help@zelixa.id</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
      {/* Spacer for fixed nav */}
      <div className="h-16 md:h-20" />
    </>
  );
}
