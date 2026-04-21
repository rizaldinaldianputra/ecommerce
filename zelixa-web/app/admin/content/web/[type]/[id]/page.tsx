'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ContentService } from '@/services/content.service';
import { ProductService } from '@/services/product.service';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import {
  Monitor, Plus, Trash2, Tag, Image as ImageIcon,
  ArrowLeft, Save, Loader2, LayoutTemplate
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { ImageUpload } from '@/components/ui/image-upload';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const itemSchema = z.object({
  id: z.number().optional(),
  type: z.string().min(1, 'Type is required'),
  platform: z.enum(['WEB', 'MOBILE', 'ALL']),
  isActive: z.boolean(),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  productId: z.number().nullable().optional(),
  tag: z.string().optional().nullable(),
  ctaText: z.string().optional().nullable(),
  badgeText: z.string().optional().nullable(),
  iconName: z.string().optional().nullable(),
  emoji: z.string().optional().nullable(),
  styleConfig: z.string().optional().nullable(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

// ─── Field Config per Web Type ─────────────────────────────────────────────

type FieldType = 'text' | 'number' | 'image' | 'product' | 'textarea';

interface FieldDef {
  key: keyof z.infer<typeof itemSchema>;
  label: string;
  placeholder?: string;
  type?: FieldType;
  hint?: string;
  wide?: boolean;
}

interface TypeConfig {
  label: string;
  emoji: string;
  description: string;
  fields: FieldDef[];
}

const WEB_FIELD_CONFIG: Record<string, TypeConfig> = {
  HERO_CAROUSEL: {
    label: 'Hero Slide',
    emoji: '🖼',
    description: 'Tiap slide di HeroBanner — gambar produk besar, judul dua baris, subtitle, dan tombol CTA.',
    fields: [
      { key: 'imageUrl',    label: 'Foto Hero',              type: 'image',    hint: 'Foto produk/campaign di sisi kanan slide.' },
      { key: 'title',       label: 'Judul Utama',            placeholder: 'New Summer\nCollection', hint: 'Gunakan \\n untuk dua baris. Baris kedua dapat warna gradient.' },
      { key: 'subtitle',    label: 'Subtitle',               placeholder: 'Discover the latest drops, up to 50% OFF.' },
      { key: 'ctaText',     label: 'Teks Tombol CTA',        placeholder: 'Shop Now' },
      { key: 'linkUrl',     label: 'Link Tombol CTA',        placeholder: '/products?tag=summer' },
      { key: 'tag',         label: 'Pill Tag (di atas judul)', placeholder: 'New Arrival ✨' },
      { key: 'badgeText',   label: 'Badge Samping Tombol',   placeholder: 'Free Shipping' },
      { key: 'styleConfig', label: 'Gradient Background',    placeholder: 'from-pink-50,to-rose-100,from-pink-400 to-rose-600', hint: 'Format CSV: bgFrom,bgTo,accentGradient', wide: true },
    ]
  },
  FLASH_SALE_WEB: {
    label: 'Produk Flash Sale',
    emoji: '⚡',
    description: 'Tiap item = satu produk di grid Flash Sale gelap. Tampil stok tersisa dan waktu berakhir.',
    fields: [
      { key: 'productId',    label: 'Produk',              type: 'product',  hint: 'Produk yang ditampilkan di grid Flash Sale.' },
      { key: 'badgeText',    label: 'Sisa Stok',           placeholder: '12', hint: 'Tampil sebagai "12 Left" di bawah kartu produk.' },
      { key: 'subtitle',     label: 'Waktu Berakhir',      placeholder: '2025-12-31 23:59', hint: 'Opsional. Waktu akhir per-item.' },
    ]
  },
  FEATURED_PRODUCTS: {
    label: 'Produk Unggulan',
    emoji: '📦',
    description: 'Produk unggulan dengan label kategori (All, Best Seller, New Arrival, Sale, Trending).',
    fields: [
      { key: 'productId',    label: 'Produk',          type: 'product',  hint: 'Produk yang ditampilkan di grid Featured.' },
      { key: 'tag',          label: 'Tab Category',    placeholder: 'Best Seller', hint: 'Pilih: All, Best Seller, New Arrival, Sale, Trending' },
    ]
  },
  RECOMMENDED_PRODUCTS: {
    label: 'Produk Rekomendasi',
    emoji: '✨',
    description: 'Item produk untuk carousel rekomendasi horizontal.',
    fields: [
      { key: 'productId',    label: 'Produk',         type: 'product' },
      { key: 'tag',          label: 'Tag',            placeholder: 'Minimalist, Streetwear' },
    ]
  },
  SHOP_THE_LOOK: {
    label: 'Shop the Look Post',
    emoji: '📸',
    description: 'Item foto social-style. Hover menampilkan nama produk dan likes count.',
    fields: [
      { key: 'imageUrl',  label: 'Foto Post',            type: 'image',  hint: 'Foto format square — gaya Instagram.' },
      { key: 'title',     label: 'Nama Produk',          placeholder: 'Pastel Hoodie Set' },
      { key: 'badgeText', label: 'Jumlah Likes',         placeholder: '1.2k' },
      { key: 'linkUrl',   label: 'Link (produk/post)',   placeholder: '/products/pastel-hoodie-set' },
    ]
  },
  BRANDS_SECTION: {
    label: 'Brand Partner',
    emoji: '🏷',
    description: 'Logo brand partner untuk marquee scroll.',
    fields: [
      { key: 'title',        label: 'Nama Brand',          placeholder: 'ZARA', hint: 'Tampil bold uppercase jika tanpa gambar.' },
      { key: 'imageUrl',     label: 'Logo Brand',          type: 'image',  hint: 'Opsional. Jika ada, gambar menggantikan teks.' },
      { key: 'linkUrl',      label: 'Link Halaman Brand',  placeholder: '/brands/zara' },
    ]
  },
  TESTIMONIALS: {
    label: 'Ulasan Pelanggan',
    emoji: '⭐',
    description: 'Review pelanggan — foto avatar, nama, rating bintang, dan teks ulasan.',
    fields: [
      { key: 'imageUrl',     label: 'Foto Avatar',      type: 'image' },
      { key: 'title',        label: 'Nama Lengkap',     placeholder: 'Anindya Putri' },
      { key: 'subtitle',     label: 'Teks Ulasan',      type: 'textarea', placeholder: 'Zelixa is literally my go-to for every new fit...', wide: true },
      { key: 'tag',          label: 'Produk Dibeli',    placeholder: 'Pastel Dream Hoodie' },
      { key: 'badgeText',    label: 'Tanggal Post',     placeholder: '2 hari lalu' },
      { key: 'iconName',     label: 'Rating Bintang (1–5)', placeholder: '5', hint: 'Masukkan angka 1 sampai 5.' },
    ]
  },
  NEWSLETTER: {
    label: 'Newsletter Config',
    emoji: '📧',
    description: 'Konfigurasi headline dan deskripsi iklan newsletter.',
    fields: [
      { key: 'title',    label: 'Headline',    placeholder: 'Subscribe to our newsletter' },
      { key: 'subtitle', label: 'Description', placeholder: 'Get latest updates and special offers.' },
    ]
  },
};

// ─── Page Props ────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ type: string; id: string }>;
}

export default function WebContentFormPage({ params }: PageProps) {
  const { type, id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const isNew = id === 'new';

  const typeConfig = WEB_FIELD_CONFIG[type] || {
    label: 'Generic Item',
    emoji: '📄',
    description: 'Generic web content item.',
    fields: [
      { key: 'imageUrl' as const, label: 'Gambar', type: 'image' as const },
      { key: 'title' as const, label: 'Judul' },
      { key: 'subtitle' as const, label: 'Subtitle' },
      { key: 'linkUrl' as const, label: 'Link URL' },
    ]
  };

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema) as any,
    defaultValues: {
      type: type,
      platform: 'WEB',
      isActive: true,
      title: '',
      subtitle: '',
      imageUrl: '',
      linkUrl: '',
      productId: undefined,
      tag: '',
      ctaText: '',
      badgeText: '',
      iconName: '',
      emoji: '',
      styleConfig: '',
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodData = await ProductService.getAll(0, 200);
        setProducts(prodData.content || []);
        if (!isNew) {
          // Flatten: we fetch a single item now, but ContentService.getById is still there
          // We need getOneItem in ContentService
          const data = await ContentService.getById(id); // Temporary: assuming response mapping
          form.reset({
            ...data,
            productId: data.productId || undefined,
          } as any);
        }
      } catch {
        toast({ title: 'Error', description: 'Gagal memuat data', variant: 'destructive' });
      }
    };
    loadData();
  }, [id, isNew]);

  const onSubmit: SubmitHandler<ItemFormValues> = async (values) => {
    setIsLoading(true);
    try {
      // Clean up values to match backend expectations (remove nulls if any)
      const submitData = { ...values };
      
      if (isNew) {
        await ContentService.createItem(submitData as any);
        toast({ title: 'Berhasil', description: 'Item berhasil dibuat' });
      } else {
        await ContentService.updateItem(Number(id), submitData as any);
        toast({ title: 'Berhasil', description: 'Item berhasil diupdate' });
      }
      router.push(`/admin/content/web/${type}`);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Gagal menyimpan item', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/admin/content/web/${type}`)}
          className="rounded-full hover:bg-white dark:hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="h-11 w-11 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600 shadow-sm flex-shrink-0">
          <Monitor className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-violet-500 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-full">🖥 WEB · {type}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {isNew ? `Tambah ${typeConfig.label}` : `Edit ${typeConfig.label}`}
          </h1>
          <p className="text-slate-400 text-xs font-semibold">{typeConfig.description}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Image Upload if available */}
            {typeConfig.fields.some(f => f.type === 'image') && (
              <div className="md:col-span-4 space-y-6">
                {typeConfig.fields.filter(f => f.type === 'image').map(f => (
                  <div key={f.key} className="bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-sm backdrop-blur-sm">
                    <FormField
                      control={form.control}
                      name={f.key as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">{f.label}</FormLabel>
                          <FormControl>
                            <ImageUpload value={field.value as string} onChange={field.onChange} />
                          </FormControl>
                          {f.hint && <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{f.hint}</p>}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                {/* Status Card */}
                <div className="bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-sm backdrop-blur-sm">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Active</FormLabel>
                          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Tampilkan di web</p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Right Column: Other Fields */}
            <div className={`${typeConfig.fields.some(f => f.type === 'image') ? 'md:col-span-8' : 'md:col-span-12'} space-y-6`}>
              <div className="bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-white/10 p-8 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-8">
                   <div className="h-9 w-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
                    <LayoutTemplate size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">Detail Konten</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Isi informasi untuk {typeConfig.label} baru ini.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  {/* Status if no image field (to keep it visible) */}
                  {!typeConfig.fields.some(f => f.type === 'image') && (
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2 flex items-center justify-between rounded-2xl border border-slate-100 dark:border-white/10 p-4 bg-slate-50/50">
                          <div>
                            <FormLabel className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Published & Active</FormLabel>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Item akan tampil di website secara otomatis.</p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}

                  {typeConfig.fields.filter(f => f.type !== 'image').map(f => (
                    <FormField
                      key={f.key}
                      control={form.control}
                      name={f.key as any}
                      render={({ field }) => (
                        <FormItem className={f.wide || f.type === 'textarea' ? 'md:col-span-2' : ''}>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">{f.label}</FormLabel>
                          <FormControl>
                            {f.type === 'product' ? (
                              <Combobox
                                options={products.map(p => ({ label: p.name, value: p.id }))}
                                value={field.value as number}
                                onChange={field.onChange}
                                placeholder="Pilih produk..."
                              />
                            ) : f.type === 'textarea' ? (
                              <textarea
                                {...field as any}
                                rows={4}
                                placeholder={f.placeholder}
                                className="w-full rounded-2xl border border-slate-200 focus:ring-violet-400 bg-white/50 px-4 py-3 text-sm font-semibold transition-all dark:bg-slate-800 dark:border-white/10 resize-none"
                              />
                            ) : (
                              <Input {...field as any} className="h-12 rounded-2xl border-slate-200 focus:ring-violet-400 font-semibold" placeholder={f.placeholder} />
                            )}
                          </FormControl>
                          {f.hint && <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{f.hint}</p>}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

               {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full bg-pink-500 hover:bg-pink-600 text-white font-black uppercase tracking-widest h-12 px-10 shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-60"
                >
                  {isLoading ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" /> Menyimpan...</>
                  ) : (
                    <><Save size={16} className="mr-2" /> {isNew ? 'Tambah Item' : 'Simpan Perubahan'}</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push(`/admin/content/web/${type}`)}
                  className="rounded-full h-12 px-6 text-slate-500 hover:text-slate-900 font-bold dark:hover:text-white"
                >
                  Batal
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
