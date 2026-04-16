'use client';

import { 
  LayoutTemplate, 
  Shirt, 
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
  Heart,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
  fields: string[];
}

const WEB_CONTENT_TYPES: ContentType[] = [
  {
    title: 'Hero Carousel',
    description: 'Banner slideshow utama di bagian atas homepage website. Gambar besar + judul + CTA.',
    type: 'HERO_CAROUSEL',
    icon: LayoutTemplate,
    color: 'from-pink-500 to-rose-600',
    lightColor: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10',
    href: '/admin/content/web/HERO_CAROUSEL',
    addHref: '/admin/content/web/HERO_CAROUSEL/new',
    fields: ['Gambar', 'Judul', 'Subjudul', 'CTA Button', 'Background Gradient'],
  },
  {
    title: 'Flash Sale Web',
    description: 'Promo kilat di halaman web dengan countdown timer dan daftar produk diskon.',
    type: 'FLASH_SALE_WEB',
    icon: Zap,
    color: 'from-orange-500 to-red-600',
    lightColor: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10',
    href: '/admin/content/web/FLASH_SALE_WEB',
    addHref: '/admin/content/web/FLASH_SALE_WEB/new',
    fields: ['Produk', 'Sisa Stok', 'Waktu Berakhir', 'Urutan Tampil'],
  },
  {
    title: 'Featured Products',
    description: 'Grid produk unggulan dengan tab filter (Best Seller, New Arrival, Sale, Trending).',
    type: 'FEATURED_PRODUCTS',
    icon: Package,
    color: 'from-blue-500 to-indigo-600',
    lightColor: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10',
    href: '/admin/content/web/FEATURED_PRODUCTS',
    addHref: '/admin/content/web/FEATURED_PRODUCTS/new',
    fields: ['Produk', 'Tab Category', 'Urutan di Grid'],
  },
  {
    title: 'Recommendations',
    description: 'Carousel rekomendasi produk untuk pengunjung web — horizontal scroll.',
    type: 'RECOMMENDED_PRODUCTS',
    icon: Star,
    color: 'from-emerald-500 to-teal-600',
    lightColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10',
    href: '/admin/content/web/RECOMMENDED_PRODUCTS',
    addHref: '/admin/content/web/RECOMMENDED_PRODUCTS/new',
    fields: ['Produk', 'Tag', 'Urutan Scroll'],
  },
  {
    title: 'Shop the Look',
    description: 'Grid foto social-style — hover menampilkan nama produk dan jumlah likes.',
    type: 'SHOP_THE_LOOK',
    icon: Shirt,
    color: 'from-amber-500 to-orange-600',
    lightColor: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10',
    href: '/admin/content/web/SHOP_THE_LOOK',
    addHref: '/admin/content/web/SHOP_THE_LOOK/new',
    fields: ['Foto Post', 'Nama Produk', 'Likes Count', 'Link URL'],
  },
  {
    title: 'Brands Section',
    description: 'Marquee logo brand partner yang tampil di halaman web.',
    type: 'BRANDS_SECTION',
    icon: ImageIcon,
    color: 'from-slate-500 to-slate-700',
    lightColor: 'bg-slate-50 text-slate-600 dark:bg-slate-500/10',
    href: '/admin/content/web/BRANDS_SECTION',
    addHref: '/admin/content/web/BRANDS_SECTION/new',
    fields: ['Nama Brand', 'Logo Image', 'Brand Page Link', 'Order'],
  },
  {
    title: 'Testimonials',
    description: 'Grid ulasan dan testimoni pelanggan di homepage web.',
    type: 'TESTIMONIALS',
    icon: Heart,
    color: 'from-pink-400 to-rose-500',
    lightColor: 'bg-pink-50 text-pink-500 dark:bg-pink-500/10',
    href: '/admin/content/web/TESTIMONIALS',
    addHref: '/admin/content/web/TESTIMONIALS/new',
    fields: ['Avatar', 'Nama Reviewer', 'Ulasan', 'Produk Dibeli', 'Bintang'],
  },
  {
    title: 'Newsletter',
    description: 'Konfigurasi section newsletter — judul dan deskripsi ajakan berlangganan.',
    type: 'NEWSLETTER',
    icon: Bell,
    color: 'from-cyan-500 to-blue-600',
    lightColor: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10',
    href: '/admin/content/web/NEWSLETTER',
    addHref: '/admin/content/web/NEWSLETTER/new',
    fields: ['Judul Section', 'Deskripsi'],
  },
];

const MOBILE_CONTENT_TYPES: ContentType[] = [
  {
    title: 'Promo Carousel',
    description: 'Banner slideshow gradient di bagian atas aplikasi mobile. Tile, subtitle, dan deep link.',
    type: 'MOBILE_PROMO',
    icon: Smartphone,
    color: 'from-teal-500 to-cyan-600',
    lightColor: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10',
    href: '/admin/content/mobile/MOBILE_PROMO',
    addHref: '/admin/content/mobile/MOBILE_PROMO/new',
    fields: ['Judul', 'Subtitle', 'Tag Chip', 'Gradient Colors', 'Deep Link'],
  },
  {
    title: 'Flash Sale Mobile',
    description: 'Strip Flash Sale horizontal di home app — tiap item adalah ProductCard diskon.',
    type: 'FLASH_SALE_MOBILE',
    icon: Zap,
    color: 'from-rose-500 to-orange-500',
    lightColor: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10',
    href: '/admin/content/mobile/FLASH_SALE_MOBILE',
    addHref: '/admin/content/mobile/FLASH_SALE_MOBILE/new',
    fields: ['Produk', 'Badge Diskon', 'Posisi di List'],
  },
  {
    title: 'Trending Now',
    description: 'Kartu trending horizontal dengan foto background, label kategori, dan judul besar.',
    type: 'TRENDING_LIST',
    icon: TrendingUp,
    color: 'from-violet-500 to-purple-600',
    lightColor: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10',
    href: '/admin/content/mobile/TRENDING_LIST',
    addHref: '/admin/content/mobile/TRENDING_LIST/new',
    fields: ['Foto Background', 'Label Kategori', 'Judul Kartu', 'Deep Link'],
  },
  {
    title: 'Featured Products',
    description: '2-column grid produk unggulan di home aplikasi mobile menggunakan ProductCard.',
    type: 'FEATURED_MOBILE',
    icon: Grid3X3,
    color: 'from-sky-500 to-blue-600',
    lightColor: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10',
    href: '/admin/content/mobile/FEATURED_MOBILE',
    addHref: '/admin/content/mobile/FEATURED_MOBILE/new',
    fields: ['Produk', 'Posisi Grid'],
  },
  {
    title: 'Why Shop',
    description: 'Section keunggulan berbelanja — icon + judul + deskripsi singkat untuk mobile.',
    type: 'WHY_SHOP',
    icon: Star,
    color: 'from-yellow-400 to-amber-600',
    lightColor: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10',
    href: '/admin/content/mobile/WHY_SHOP',
    addHref: '/admin/content/mobile/WHY_SHOP/new',
    fields: ['Emoji/Icon', 'Judul', 'Deskripsi', 'Urutan'],
  },
  {
    title: 'Curated Selections',
    description: 'Section produk pilihan editorial — Picks for You, dll — di home mobile.',
    type: 'CURATED_PRODUCTS',
    icon: Heart,
    color: 'from-pink-400 to-fuchsia-600',
    lightColor: 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10',
    href: '/admin/content/mobile/CURATED_PRODUCTS',
    addHref: '/admin/content/mobile/CURATED_PRODUCTS/new',
    fields: ['Produk', 'Urutan', 'Badge', 'Tag'],
  },
  {
    title: 'Push Notification',
    description: 'Kirim notifikasi push ke semua pengguna atau target tertentu di aplikasi mobile.',
    type: 'NOTIFICATION',
    icon: MessageSquare,
    color: 'from-blue-500 to-indigo-600',
    lightColor: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10',
    href: '/admin/notifications',
    addHref: '/admin/notifications/new',
    fields: ['Judul Notifikasi', 'Isi Pesan', 'Target User', 'Tipe'],
  },
];

const PLATFORM_CONFIG = {
  WEB: {
    label: 'Web Storefront',
    icon: Monitor,
    gradient: 'from-violet-600 to-indigo-700',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    description: 'Konten yang tampil di website zelixa.com',
    accentColor: 'violet',
    types: WEB_CONTENT_TYPES,
  },
  MOBILE: {
    label: 'Mobile App',
    icon: Smartphone,
    gradient: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    description: 'Konten yang tampil di aplikasi Flutter Android & iOS',
    accentColor: 'emerald',
    types: MOBILE_CONTENT_TYPES,
  }
};

interface ContentDashboardProps {
  platform: Platform;
  title: string;
}

export default function ContentDashboard({ platform, title }: ContentDashboardProps) {
  const config = PLATFORM_CONFIG[platform];
  const PlatformIcon = config.icon;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
          {title}
        </h1>
        <p className="text-slate-500 font-semibold text-sm">
          Kelola konten spesifik untuk{' '}
          <span className={platform === 'WEB' ? 'text-violet-600 font-bold' : 'text-emerald-600 font-bold'}>
            {config.label}
          </span>
          {' '}— terpisah dari platform lain.
        </p>
      </div>

      {/* Platform Hero Card */}
      <div className={`rounded-3xl bg-gradient-to-br ${config.gradient} p-8 text-white shadow-2xl relative overflow-hidden`}>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 [mask-image:radial-gradient(ellipse_at_right,white,transparent)]" />
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
            <PlatformIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">{config.label} Management</h2>
            <p className="text-white/70 font-medium mt-1 text-sm">{config.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase">
                {config.types.length} tipe konten tersedia
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Type Cards Grid */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
          Pilih tipe konten yang ingin dikelola
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {config.types.map((item, index) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 30 }}
              className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
            >
              {/* Background Glow */}
              <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${item.color} opacity-5 blur-3xl group-hover:opacity-15 transition-opacity duration-500`} />

              <div className="relative flex flex-col h-full">
                {/* Icon + Add Button */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.lightColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <Link
                    href={item.addHref}
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-pink-600 dark:hover:bg-pink-500 dark:hover:text-white transition-all shadow-md hover:scale-110 active:scale-95"
                    title={`Tambah ${item.title}`}
                  >
                    <Plus size={16} />
                  </Link>
                </div>

                {/* Title & Description */}
                <div className="flex-1">
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1.5 group-hover:text-pink-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Fields Preview */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Field Tersedia:</p>
                    <ul className="space-y-0.5">
                      {item.fields.slice(0, 3).map((field) => (
                        <li key={field} className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                          <span className="h-1 w-1 rounded-full bg-pink-400 flex-shrink-0" />
                          {field}
                        </li>
                      ))}
                      {item.fields.length > 3 && (
                        <li className="text-[10px] text-slate-400 font-semibold pl-2.5">
                          +{item.fields.length - 3} field lainnya
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/10">
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white group-hover:gap-3 transition-all group-hover:text-pink-600"
                  >
                    Kelola List <ArrowRight size={13} className="text-pink-500" />
                  </Link>
                  <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${item.color} opacity-30 group-hover:w-16 group-hover:opacity-100 transition-all duration-500`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
