'use client';

import { 
  LayoutTemplate, 
  Shirt, 
  Newspaper,
  Plus,
  ArrowRight,
  Monitor,
  Smartphone,
  Grid3X3,
  Star,
  Zap,
  Bell,
  Package,
  Image as ImageIcon,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

type Platform = 'WEB' | 'MOBILE';

interface ContentType {
  title: string;
  description: string;
  type: string;
  icon: any;
  color: string;
  lightColor: string;
  href: string;
  addHref: string;
  platform: Platform[];
  fields: string[];
}

const CONTENT_TYPES: ContentType[] = [
  // ─── WEB ONLY ────────────────────────────────────────────────────────
  {
    title: 'Hero Carousel',
    description: 'Banner utama di bagian atas homepage website. Terdiri dari gambar besar, judul, dan tombol CTA.',
    type: 'HERO_CAROUSEL',
    icon: LayoutTemplate,
    color: 'from-pink-500 to-rose-600',
    lightColor: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10',
    href: '/admin/content-sections?type=HERO_CAROUSEL',
    addHref: '/admin/content-sections/new?type=HERO_CAROUSEL',
    platform: ['WEB'],
    fields: ['Gambar (imageUrl)', 'Judul (title)', 'Subjudul (subtitle)', 'Link URL', 'Teks CTA', 'Badge Text']
  },
  {
    title: 'Shop the Look',
    description: 'Outfit dan inspirasi gaya berbelanja yang ditampilkan di web homepage.',
    type: 'SHOP_THE_LOOK',
    icon: Shirt,
    color: 'from-amber-500 to-orange-600',
    lightColor: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
    href: '/admin/content-sections?type=SHOP_THE_LOOK',
    addHref: '/admin/content-sections/new?type=SHOP_THE_LOOK',
    platform: ['WEB'],
    fields: ['Gambar (imageUrl)', 'Judul (title)', 'Tag', 'Link Produk (linkUrl)', 'ID Produk (productId)']
  },
  {
    title: 'News & Articles',
    description: 'Blog, pengumuman, dan berita fashion untuk web storefront.',
    type: 'NEWS',
    icon: Newspaper,
    color: 'from-slate-700 to-slate-900',
    lightColor: 'bg-slate-100 text-slate-700 dark:bg-slate-500/10',
    href: '/admin/news',
    addHref: '/admin/news/new',
    platform: ['WEB'],
    fields: ['Judul', 'Slug', 'Konten (Rich Text)', 'Gambar', 'Status Terbit']
  },
  {
    title: 'Banner Promosi Web',
    description: 'Banner promosi persegi atau landscape untuk tampil di grid halaman web.',
    type: 'BANNER',
    icon: ImageIcon,
    color: 'from-violet-500 to-purple-700',
    lightColor: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10',
    href: '/admin/banners',
    addHref: '/admin/banners/new',
    platform: ['WEB'],
    fields: ['Gambar (imageUrl)', 'Link URL', 'Judul', 'Posisi Display']
  },

  // ─── MOBILE ONLY ─────────────────────────────────────────────────────
  {
    title: 'Home Sections Mobile',
    description: 'Sections yang muncul di halaman utama aplikasi Flutter — Rekomendasi, Picked For You, dll.',
    type: 'CURATED_PRODUCTS',
    icon: Grid3X3,
    color: 'from-teal-500 to-cyan-600',
    lightColor: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10',
    href: '/admin/content-sections?type=CURATED_PRODUCTS',
    addHref: '/admin/content-sections/new?type=CURATED_PRODUCTS',
    platform: ['MOBILE'],
    fields: ['Judul Seksi (title)', 'Tipe Section', 'ID Produk (productId)', 'Urutan Tampil (displayOrder)']
  },
  {
    title: 'Flash Sale Banner Mobile',
    description: 'Banner Flash Sale khusus di layar utama aplikasi mobile dengan countdown.',
    type: 'FLASH_SALE_BANNER',
    icon: Zap,
    color: 'from-red-500 to-orange-500',
    lightColor: 'bg-red-50 text-red-600 dark:bg-red-500/10',
    href: '/admin/flash-sales',
    addHref: '/admin/flash-sales/new',
    platform: ['MOBILE'],
    fields: ['Nama Campaign', 'Waktu Mulai', 'Waktu Selesai', 'Produk Flash Sale', 'Harga Diskon', 'Limit Stok']
  },
  {
    title: 'Why Shop (Keuntungan)',
    description: 'Section keunggulan belanja — ikon + teks pendek untuk tampilan mobile.',
    type: 'WHY_SHOP',
    icon: Star,
    color: 'from-yellow-400 to-amber-600',
    lightColor: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10',
    href: '/admin/content-sections?type=WHY_SHOP',
    addHref: '/admin/content-sections/new?type=WHY_SHOP',
    platform: ['MOBILE'],
    fields: ['Emoji/Icon (emoji)', 'Judul (title)', 'Deskripsi (subtitle)', 'Urutan Tampil (displayOrder)']
  },
  {
    title: 'Push Notification',
    description: 'Kirim notifikasi push ke semua pengguna mobile atau target pengguna tertentu.',
    type: 'NOTIFICATION',
    icon: Bell,
    color: 'from-blue-500 to-indigo-600',
    lightColor: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10',
    href: '/admin/notifications',
    addHref: '/admin/notifications/new',
    platform: ['MOBILE'],
    fields: ['Judul Notifikasi (title)', 'Isi Pesan (body)', 'Target User (userId atau semua)', 'Tipe Notifikasi']
  },

  // ─── WEB + MOBILE ─────────────────────────────────────────────────────
  {
    title: 'Produk Pilihan',
    description: 'Produk yang dipromosikan secara khusus, tampil baik di web maupun mobile app.',
    type: 'PICKED_FOR_YOU',
    icon: Heart,
    color: 'from-pink-400 to-fuchsia-600',
    lightColor: 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10',
    href: '/admin/content-sections?type=PICKED_FOR_YOU',
    addHref: '/admin/content-sections/new?type=PICKED_FOR_YOU',
    platform: ['WEB', 'MOBILE'],
    fields: ['ID Produk (productId)', 'Urutan Tampil (displayOrder)', 'Badge (badgeText)', 'Tag']
  },
  {
    title: 'Produk Rekomendasi',
    description: 'Daftar produk yang direkomendasikan secara algoritma atau manual, untuk web & mobile.',
    type: 'RECOMMENDED_PRODUCTS',
    icon: Package,
    color: 'from-emerald-500 to-green-600',
    lightColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
    href: '/admin/content-sections?type=RECOMMENDED_PRODUCTS',
    addHref: '/admin/content-sections/new?type=RECOMMENDED_PRODUCTS',
    platform: ['WEB', 'MOBILE'],
    fields: ['ID Produk (productId)', 'Urutan Tampil (displayOrder)', 'Tag', 'Badge']
  },
];

const PLATFORM_CONFIG = {
  WEB: {
    label: 'Web Storefront',
    icon: Monitor,
    color: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    description: 'Konten yang tampil di website zelixa.com',
  },
  MOBILE: {
    label: 'Mobile App',
    icon: Smartphone,
    color: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    description: 'Konten yang tampil di aplikasi Flutter Android & iOS',
  }
};

export default function ContentManagementDashboard() {
  const [activePlatform, setActivePlatform] = useState<Platform | 'ALL'>('ALL');

  const filtered = activePlatform === 'ALL' 
    ? CONTENT_TYPES 
    : CONTENT_TYPES.filter(c => c.platform.includes(activePlatform));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
          Content Management
        </h1>
        <p className="text-slate-500 font-bold">
          Kelola konten untuk Web Storefront dan Mobile App secara terpisah.
        </p>
      </div>

      {/* Platform Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.entries(PLATFORM_CONFIG) as [Platform, typeof PLATFORM_CONFIG.WEB][]).map(([key, config]) => (
          <div key={key} className="rounded-3xl border border-slate-100 dark:border-white/10 bg-white/60 dark:bg-black/40 p-6 flex items-center gap-5 shadow-sm backdrop-blur-sm">
            <div className={`h-14 w-14 rounded-2xl ${config.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
              <config.icon className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{config.label}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{config.description}</p>
              <p className="text-xs text-slate-400 mt-1 font-bold">
                {CONTENT_TYPES.filter(c => c.platform.includes(key)).length} tipe konten tersedia
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Platform Filter Tabs */}
      <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-fit">
        {(['ALL', 'WEB', 'MOBILE'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setActivePlatform(p)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activePlatform === p
                ? 'bg-white dark:bg-slate-800 shadow text-pink-600 dark:text-pink-400'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {p === 'ALL' ? 'Semua' : p === 'WEB' ? '🖥 Web' : '📱 Mobile'}
          </button>
        ))}
      </div>

      {/* Content Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, index) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-7 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 flex flex-col"
          >
            {/* Background Gradient */}
            <div className={`absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${item.color} opacity-5 blur-3xl group-hover:opacity-10 transition-opacity`} />

            <div className="relative flex flex-col h-full">
              {/* Top Row */}
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${item.lightColor} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className="h-7 w-7 text-inherit" />
                </div>
                <Link 
                  href={item.addHref}
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-900 text-white hover:bg-pink-600 transition-colors shadow-lg"
                  title={`Tambah ${item.title}`}
                >
                  <Plus size={18} />
                </Link>
              </div>

              {/* Platform Badges */}
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {item.platform.map(p => (
                  <span key={p} className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${PLATFORM_CONFIG[p].badge}`}>
                    {p === 'WEB' ? '🖥 Web' : '📱 Mobile'}
                  </span>
                ))}
              </div>

              {/* Title & Description */}
              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1.5 group-hover:text-pink-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">
                  {item.description}
                </p>
                
                {/* Fields Preview */}
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Field Tersedia:</p>
                  <ul className="space-y-0.5">
                    {item.fields.slice(0, 3).map((field) => (
                      <li key={field} className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                        <span className="h-1 w-1 rounded-full bg-pink-400 flex-shrink-0" />
                        {field}
                      </li>
                    ))}
                    {item.fields.length > 3 && (
                      <li className="text-[10px] text-slate-400 font-bold pl-2.5">
                        +{item.fields.length - 3} field lainnya
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Footer Link */}
              <div className="mt-6 flex items-center justify-between">
                <Link 
                  href={item.href}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white group-hover:gap-3 transition-all"
                >
                  Kelola List <ArrowRight size={14} className="text-pink-500" />
                </Link>
                <div className={`h-1.5 w-10 rounded-full bg-gradient-to-r ${item.color} opacity-30 group-hover:w-20 group-hover:opacity-100 transition-all duration-500`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-slate-900 to-slate-800 p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-pink-500/20 to-transparent blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Buat Section Kustom?</h2>
            <p className="text-slate-400 font-bold max-w-md">Butuh tipe konten baru? Buat section generic dan definisikan layout-nya nanti.</p>
          </div>
          <Link 
            href="/admin/content-sections/new"
            className="px-8 py-4 bg-white text-slate-900 rounded-full font-black uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            Buat Generic
          </Link>
        </div>
      </div>
    </div>
  );
}
