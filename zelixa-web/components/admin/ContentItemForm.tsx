'use client';

import { useEffect, useState } from 'react';
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
  ArrowLeft, Save, Loader2, LayoutTemplate,
  Smartphone, Monitor, Package, Image as ImageIcon,
  Zap, Star, Heart, TrendingUp, Bell, MessageSquare,
  Shirt,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { ImageUpload } from '@/components/ui/image-upload';
import RichTextEditor from '@/components/ui/rich-text-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const itemSchema = z.object({
  id: z.number().optional(),
  type: z.string().min(1, 'Pilih tipe konten'),
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
  displayOrder: z.number().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  contentBody: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),
  productIds: z.string().optional().nullable(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

// ─── Field Configs ─────────────────────────────────────────────────────────────

type FieldType = 'text' | 'number' | 'image' | 'product' | 'textarea' | 'rich-text';

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
  icon: any;
  platform: 'WEB' | 'MOBILE' | 'ALL';
  description: string;
  fields: FieldDef[];
}

const ALL_TYPE_CONFIGS: Record<string, TypeConfig> = {
  PROMO: {
    label: 'Promo / Banner',
    icon: ImageIcon,
    platform: 'ALL',
    description: 'Banner slideshow untuk Web & Mobile app.',
    fields: [
      { key: 'title', label: 'Judul Promo', placeholder: 'Summer Collection' },
      { key: 'subtitle', label: 'Subtitle', placeholder: 'Up to 50% OFF' },
      { key: 'imageUrl', label: 'Background Image', type: 'image' },
      { key: 'linkUrl', label: 'Deep Link / URL', placeholder: 'zelixa://category/sale or /promo/summer' },
      { key: 'ctaText', label: 'CTA Text', placeholder: 'Shop Now' },
      { key: 'tag', label: 'Tag / Label', placeholder: 'New Arrival' },
      { key: 'styleConfig', label: 'Theme Config (CSV)', placeholder: '0xFF6A1B9A,0xFFAB47BC', hint: 'Warna gradient atau class CSS.', wide: true },
    ]
  },
  FLASH_SALE: {
    label: 'Flash Sale (Campaign)',
    icon: Zap,
    platform: 'MOBILE',
    description: 'Campaign Flash Sale dengan waktu mulai/berakhir dan daftar produk.',
    fields: [
      { key: 'title', label: 'Nama Flash Sale', placeholder: 'Promo Ramadhan 2026' },
      { key: 'startDate', label: 'Waktu Mulai', placeholder: 'YYYY-MM-DDTHH:mm:ss' },
      { key: 'endDate', label: 'Waktu Berakhir', placeholder: '2026-04-30T23:59:59' },
      { key: 'productIds', label: 'Daftar Produk (CSV)', placeholder: '1,2,3,4', hint: 'Masukkan ID produk dipisah koma (item productnya all).', wide: true },
      { key: 'badgeText', label: 'Badge / Diskon', placeholder: '40% OFF' },
    ]
  },
  NEWS: {
    label: 'News & Updates',
    icon: LayoutTemplate,
    platform: 'MOBILE',
    description: 'Berita atau artikel blog dengan thumbnail, banner, dan konten HTML.',
    fields: [
      { key: 'title', label: 'Judul Berita', placeholder: 'Peluncuran Koleksi Baru Spring 2026' },
      { key: 'imageUrl', label: 'Thumbnail (Square)', type: 'image' },
      { key: 'bannerUrl', label: 'Banner (Wide)', type: 'image' },
      { key: 'contentBody', label: 'Isi Konten (HTML)', type: 'rich-text', wide: true, hint: 'Edit konten berita dengan editor visual.' },
    ]
  },
  TRENDING_NOW: {
    label: 'Trending Now (Item)',
    icon: TrendingUp,
    platform: 'ALL',
    description: 'Produk atau koleksi yang sedang populer.',
    fields: [
      { key: 'productId', label: 'Produk (Opsional)', type: 'product' },
      { key: 'title', label: 'Judul Kartu', placeholder: 'Best Seller 2026' },
      { key: 'subtitle', label: 'Kategori / Label', placeholder: 'Exclusive' },
      { key: 'imageUrl', label: 'Hero Image', type: 'image', hint: 'Gunakan jika ingin custom image, jika tidak pakai image produk.' },
      { key: 'linkUrl', label: 'Target URL', placeholder: '/trending' },
    ]
  },
  FEATURED_PRODUCTS: {
    label: 'Featured Products (Item)',
    icon: Star,
    platform: 'ALL',
    description: 'Produk unggulan di grid storefront.',
    fields: [
      { key: 'productId', label: 'Pilih Produk', type: 'product' },
      { key: 'tag', label: 'Category Tab', placeholder: 'Best Seller' },
      { key: 'badgeText', label: 'Corner Badge', placeholder: 'Editor\'s Pick' },
    ]
  },
};

interface ContentItemFormProps {
  id?: string;
}

export default function ContentItemForm({ id }: ContentItemFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const isNew = !id || id === 'new';

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema) as any,
    defaultValues: {
      type: '',
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
      displayOrder: 0,
      startDate: '',
      endDate: '',
      contentBody: '',
      bannerUrl: '',
      productIds: '',
    },
  });

  const selectedType = form.watch('type');
  const typeConfig = ALL_TYPE_CONFIGS[selectedType] || {
    label: 'Generic Item',
    icon: LayoutTemplate,
    platform: 'ALL',
    description: 'Pilih tipe konten untuk melihat field yang tersedia.',
    fields: [
      { key: 'title', label: 'Judul' },
      { key: 'subtitle', label: 'Subtitle' },
      { key: 'imageUrl', label: 'Gambar', type: 'image' },
      { key: 'linkUrl', label: 'Link URL' },
    ]
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodData = await ProductService.getAll(0, 500);
        setProducts(prodData.content || []);
        if (!isNew && id) {
          const data = await ContentService.getById(id);
          form.reset({
            ...data,
            productId: data.productId || undefined,
            type: data.type || '',
            platform: (data.platform as any) || 'WEB',
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
        toast({ title: 'Berhasil', description: 'Konten berhasil dibuat' });
      } else {
        await ContentService.updateItem(Number(id), values as any);
        toast({ title: 'Berhasil', description: 'Konten berhasil diupdate' });
      }
      router.push('/admin/content');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Gagal menyimpan konten', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-white dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {isNew ? 'Tambah Konten Baru' : 'Edit Konten'}
            </h1>
            <p className="text-slate-400 text-xs font-semibold">
              {isNew ? 'Buat item konten baru untuk storefront.' : `Mengedit konten ID: ${id}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/content')}
            className="rounded-full font-bold text-xs uppercase"
          >
            Batal
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="rounded-full bg-pink-500 hover:bg-pink-600 text-white font-black uppercase tracking-widest px-8 shadow-lg shadow-pink-500/20"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Simpan Konten
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Config Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/60 dark:bg-slate-900/60 p-8 rounded-[3rem] border border-white/20 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 shadow-inner">
                  <typeConfig.icon size={24} />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">Informasi Dasar</h2>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">{typeConfig.label}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Platform Selection */}
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-2xl h-12 border-none bg-slate-100 dark:bg-white/5 font-bold">
                            <SelectValue placeholder="Pilih Platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-white/20 backdrop-blur-xl">
                          <SelectItem value="WEB" className="rounded-xl font-bold">WEB (Desktop/Browser)</SelectItem>
                          <SelectItem value="MOBILE" className="rounded-xl font-bold">MOBILE (App/Flutter)</SelectItem>
                          <SelectItem value="ALL" className="rounded-xl font-bold">ALL PLATFORMS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type Selection */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tipe Konten</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-2xl h-12 border-none bg-slate-100 dark:bg-white/5 font-bold">
                            <SelectValue placeholder="Pilih Tipe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-white/20 backdrop-blur-xl max-h-[300px]">
                          {Object.entries(ALL_TYPE_CONFIGS).sort((a, b) => a[1].label.localeCompare(b[1].label)).map(([key, config]) => (
                            <SelectItem key={key} value={key} className="rounded-xl">
                              <div className="flex flex-col">
                                <span className="font-bold text-xs uppercase tracking-tight">{config.label}</span>
                                <span className="text-[8px] text-slate-400 uppercase tracking-widest font-black">{config.platform} · {key}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dynamic Fields */}
              <div className="mt-12 space-y-8">
                <div className="h-px bg-slate-100 dark:bg-white/5 w-full mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
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
                                className="w-full rounded-2xl border-none bg-slate-100 dark:bg-white/5 px-4 py-3 text-sm font-semibold transition-all resize-none shadow-inner"
                              />
                            ) : (
                              <Input {...field as any} className="h-12 rounded-2xl border-none bg-slate-100 dark:bg-white/5 font-semibold shadow-inner" placeholder={f.placeholder} />
                            )}
                          </FormControl>
                          {f.hint && <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-widest leading-relaxed">{f.hint}</p>}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Media & Side Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Action Info Card */}
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 h-32 w-32 bg-pink-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <h3 className="text-xl font-black uppercase tracking-tight italic">Live <span className="text-pink-500">Preview</span></h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Status Sinkronisasi</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Ready to publish</span>
                </div>
              </div>
            </div>

            {/* Image Upload Fields */}
            {typeConfig.fields.filter(f => f.type === 'image').map(f => (
              <div key={f.key} className="bg-white/60 dark:bg-slate-900/60 p-6 rounded-[2.5rem] border border-white/20 shadow-sm backdrop-blur-xl">
                <FormField
                  control={form.control}
                  name={f.key as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">{f.label}</FormLabel>
                      <FormControl>
                        <ImageUpload value={field.value as string} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <div className="bg-white/60 dark:bg-slate-900/60 p-6 rounded-[2.5rem] border border-white/20 shadow-sm backdrop-blur-xl space-y-6">
              {/* Display Order */}
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Urutan Tampil (Display Order)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ''}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        className="h-12 rounded-2xl border-none bg-slate-100 dark:bg-white/5 font-black text-center text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Switch */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-2xl bg-white dark:bg-white/5 p-4 border border-slate-100 dark:border-white/10">
                    <div>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Active Status</FormLabel>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Tampilkan di app</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
