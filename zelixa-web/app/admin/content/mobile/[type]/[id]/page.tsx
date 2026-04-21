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
  Smartphone, Plus, Tag,
  ArrowLeft, Save, Loader2, LayoutTemplate
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';
import { ImageUpload } from '@/components/ui/image-upload';
import RichTextEditor from '@/components/ui/rich-text-editor';

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
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  contentBody: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),
  productIds: z.string().optional().nullable(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

// ─── Field Config per Mobile Type ─────────────────────────────────────────────

type FieldType = 'text' | 'number' | 'image' | 'product' | 'textarea' | 'rich-text' | 'multi-product';

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

const MOBILE_FIELD_CONFIG: Record<string, TypeConfig> = {
  MOBILE_PROMO: {
    label: 'Promo Slide',
    emoji: '🎠',
    description: 'Tiap slide di HomePromoCarousel — gradient banner dengan judul, subtitle, tag chip, dan deep link.',
    fields: [
      { key: 'title', label: 'Judul Slide', placeholder: 'Summer Collection' },
      { key: 'subtitle', label: 'Subtitle', placeholder: 'Up to 40% OFF' },
      { key: 'tag', label: 'Tag Chip (atas kartu)', placeholder: 'New Arrival' },
      { key: 'imageUrl', label: 'Gambar Background', type: 'image', hint: 'Opsional. Jika tidak diisi, tampil gradient saja.' },
      { key: 'linkUrl', label: 'Deep Link (tap)', placeholder: 'zelixa://category/sale' },
      { key: 'styleConfig', label: 'Warna Gradient', placeholder: '0xFF6A1B9A,0xFFAB47BC', hint: 'Format CSV hex: warna1,warna2. Contoh: 0xFF6A1B9A,0xFFAB47BC (ungu).', wide: true },
    ]
  },
  FLASH_SALE_MOBILE: {
    label: 'Produk Flash Sale',
    emoji: '⚡',
    description: 'Tiap item = satu ProductCard di strip Flash Sale horizontal home mobile.',
    fields: [
      { key: 'title',        label: 'Nama Flash Sale', placeholder: 'Promo Ramadhan 2026' },
      { key: 'startDate',    label: 'Waktu Mulai',     placeholder: 'YYYY-MM-DDTHH:mm:ss' },
      { key: 'endDate',      label: 'Waktu Berakhir',  placeholder: '2026-04-30T23:59:59' },
      { key: 'productIds',   label: 'Daftar Produk',   type: 'multi-product', hint: 'Pilih beberapa produk untuk kampanye ini.', wide: true },
      { key: 'badgeText',    label: 'Badge Diskon',    placeholder: '50% OFF', hint: 'Tampil sebagai badge di kartu produk.' },
    ]
  },
  TRENDING_LIST: {
    label: 'Trending Card',
    emoji: '🔥',
    description: 'Kartu horizontal HomeTrendingList — foto background, label kategori di atas, judul besar di bawah.',
    fields: [
      { key: 'imageUrl', label: 'Foto Background Kartu', type: 'image', hint: 'Gambar full-bleed background kartu trending (280×200).' },
      { key: 'subtitle', label: 'Label Kategori (atas)', placeholder: 'Exclusive Selection' },
      { key: 'title', label: 'Judul Kartu (bawah)', placeholder: 'Best Outfit for 2026' },
      { key: 'linkUrl', label: 'Deep Link (tap)', placeholder: 'zelixa://collection/trending' },
    ]
  },
  FEATURED_MOBILE: {
    label: 'Produk Featured',
    emoji: '📦',
    description: 'Tiap item = satu ProductCard di 2-column grid Featured Products di home mobile.',
    fields: [
      { key: 'productId', label: 'Produk', type: 'product', hint: 'Ditampilkan sebagai ProductCard di grid 2-kolom.' },
    ]
  },
  NEWS: {
    label: 'News & Article',
    emoji: '📰',
    description: 'Update koleksi atau berita terbaru dengan konten HTML.',
    fields: [
      { key: 'title', label: 'Judul Berita', placeholder: 'Spring Collection 2026' },
      { key: 'imageUrl', label: 'Thumbnail (Square)', type: 'image' },
      { key: 'bannerUrl', label: 'Banner (Wide)', type: 'image' },
      { key: 'contentBody', label: 'Konten (HTML)', type: 'rich-text', wide: true, hint: 'Edit konten visual dengan HTML editor.' },
    ]
  },
};

// ─── Page Props ────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ type: string; id: string }>;
}

export default function MobileContentFormPage({ params }: PageProps) {
  const { type, id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const isNew = id === 'new';

  const typeConfig = MOBILE_FIELD_CONFIG[type] || {
    label: 'Generic Item',
    emoji: '📱',
    description: 'Generic mobile content item.',
    fields: [
      { key: 'imageUrl' as const, label: 'Gambar', type: 'image' as const },
      { key: 'title' as const, label: 'Judul' },
      { key: 'subtitle' as const, label: 'Subtitle' },
      { key: 'linkUrl' as const, label: 'Deep Link' },
    ]
  };

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema) as any,
    defaultValues: {
      type: type,
      platform: 'MOBILE',
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
      startDate: '',
      endDate: '',
      contentBody: '',
      bannerUrl: '',
      productIds: '',
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodData = await ProductService.getAll(0, 200);
        setProducts(prodData.content || []);
        if (!isNew) {
          const data = await ContentService.getById(id);
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
      if (isNew) {
        await ContentService.createItem(values as any);
        toast({ title: 'Berhasil', description: 'Item berhasil dibuat' });
      } else {
        await ContentService.updateItem(Number(id), values as any);
        toast({ title: 'Berhasil', description: 'Item berhasil diupdate' });
      }
      router.push(`/admin/content/mobile/${type}`);
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
          onClick={() => router.push(`/admin/content/mobile/${type}`)}
          className="rounded-full hover:bg-white dark:hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0">
          <Smartphone className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">📱 MOBILE · {type}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {isNew ? `Tambah ${typeConfig.label}` : `Edit ${typeConfig.label}`}
          </h1>
          <p className="text-slate-400 text-xs font-semibold">Konfigurasi data item untuk {typeConfig.label.toLowerCase()} di aplikasi mobile.</p>
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
                          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Tampilkan di aplikasi</p>
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
                  <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
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
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Item akan tampil di aplikasi secara otomatis.</p>
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
                            ) : f.type === 'multi-product' ? (
                              <MultiSelectCombobox
                                options={products.map(p => ({ label: p.name, value: p.id }))}
                                value={field.value ? (field.value as string).split(',').filter(id => id.trim() !== '').map(id => isNaN(Number(id)) ? id : Number(id)) : []}
                                onChange={(vals) => field.onChange(vals.join(','))}
                                placeholder="Pilih produk-produk..."
                              />
                            ) : f.type === 'rich-text' ? (
                              <RichTextEditor
                                value={field.value as string}
                                onChange={field.onChange}
                                placeholder={f.placeholder}
                              />
                            ) : f.type === 'textarea' ? (
                              <textarea
                                {...field as any}
                                rows={4}
                                placeholder={f.placeholder}
                                className="w-full rounded-2xl border border-slate-200 focus:ring-emerald-400 bg-white/50 px-4 py-3 text-sm font-semibold transition-all dark:bg-slate-800 dark:border-white/10 resize-none"
                              />
                            ) : (
                              <Input {...field as any} className="h-12 rounded-2xl border-slate-200 focus:ring-emerald-400 font-semibold" placeholder={f.placeholder} />
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
                  onClick={() => router.push(`/admin/content/mobile/${type}`)}
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
