'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ContentService } from '@/services/content.service';
import { ProductService } from '@/services/product.service';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import {
  Smartphone, Plus, Trash2, Tag,
  ArrowLeft, Save, Loader2, LayoutTemplate
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { ImageUpload } from '@/components/ui/image-upload';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const itemSchema = z.object({
  id: z.number().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  imageUrl: z.string().optional(),
  linkUrl: z.string().optional(),
  productId: z.coerce.number().optional(),
  displayOrder: z.coerce.number().default(0),
  tag: z.string().optional(),
  ctaText: z.string().optional(),
  badgeText: z.string().optional(),
  iconName: z.string().optional(),
  emoji: z.string().optional(),
  styleConfig: z.string().optional(),
});

const sectionSchema = z.object({
  title: z.string().min(2, 'Judul section wajib diisi'),
  displayOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  items: z.array(itemSchema).default([]),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

// ─── Field Config per Mobile Type ─────────────────────────────────────────────

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
  hasNoItems?: boolean;
  fields: FieldDef[];
}

const MOBILE_FIELD_CONFIG: Record<string, TypeConfig> = {
  MOBILE_PROMO: {
    label: 'Promo Slide',
    emoji: '🎠',
    description: 'Tiap slide di HomePromoCarousel — gradient banner dengan judul, subtitle, tag chip, dan tombol "Shop Now".',
    fields: [
      { key: 'title',        label: 'Judul Slide',             placeholder: 'Summer Collection' },
      { key: 'subtitle',     label: 'Subtitle',                placeholder: 'Up to 40% OFF' },
      { key: 'tag',          label: 'Tag Chip (atas kartu)',    placeholder: 'New Arrival' },
      { key: 'imageUrl',     label: 'Gambar Background',       type: 'image', hint: 'Opsional. Jika tidak diisi, tampil gradient saja.' },
      { key: 'linkUrl',      label: 'Deep Link (tap)',         placeholder: 'zelixa://category/sale' },
      { key: 'styleConfig',  label: 'Warna Gradient',         placeholder: '0xFF6A1B9A,0xFFAB47BC', hint: 'Format CSV hex: warna1,warna2. Contoh: 0xFF6A1B9A,0xFFAB47BC (ungu).', wide: true },
      { key: 'displayOrder', label: 'Urutan Slide',            type: 'number' },
    ]
  },
  FLASH_SALE_MOBILE: {
    label: 'Produk Flash Sale',
    emoji: '⚡',
    description: 'Tiap item = satu ProductCard di strip Flash Sale horizontal home mobile.',
    fields: [
      { key: 'productId',    label: 'Produk',          type: 'product', hint: 'Ditampilkan sebagai ProductCard di strip Flash Sale mobile.' },
      { key: 'badgeText',    label: 'Badge Diskon',    placeholder: '50% OFF', hint: 'Tampil sebagai badge di kartu produk.' },
      { key: 'displayOrder', label: 'Posisi di List',  type: 'number' },
    ]
  },
  TRENDING_LIST: {
    label: 'Trending Card',
    emoji: '🔥',
    description: 'Kartu horizontal HomeTrendingList — foto background, label kategori di atas, judul besar di bawah.',
    fields: [
      { key: 'imageUrl',     label: 'Foto Background Kartu', type: 'image', hint: 'Gambar full-bleed background kartu trending (280×200).' },
      { key: 'subtitle',     label: 'Label Kategori (atas)', placeholder: 'Exclusive Selection' },
      { key: 'title',        label: 'Judul Kartu (bawah)',   placeholder: 'Best Outfit for 2026' },
      { key: 'linkUrl',      label: 'Deep Link (tap)',       placeholder: 'zelixa://collection/trending' },
      { key: 'displayOrder', label: 'Posisi Kartu',          type: 'number' },
    ]
  },
  FEATURED_MOBILE: {
    label: 'Produk Featured',
    emoji: '📦',
    description: 'Tiap item = satu ProductCard di 2-column grid Featured Products di home mobile.',
    fields: [
      { key: 'productId',    label: 'Produk',          type: 'product', hint: 'Ditampilkan sebagai ProductCard di grid 2-kolom.' },
      { key: 'displayOrder', label: 'Posisi Grid',     type: 'number' },
    ]
  },
  WHY_SHOP: {
    label: 'Keunggulan Belanja',
    emoji: '⭐',
    description: 'Tiap item = satu keunggulan belanja — emoji/icon + judul + deskripsi singkat.',
    fields: [
      { key: 'emoji',        label: 'Emoji / Icon',       placeholder: '🚀' },
      { key: 'title',        label: 'Judul',              placeholder: 'Fast Delivery' },
      { key: 'subtitle',     label: 'Deskripsi',          placeholder: 'Estimasi tiba 1–2 hari kerja', wide: true },
      { key: 'displayOrder', label: 'Urutan',             type: 'number' },
    ]
  },
  CURATED_PRODUCTS: {
    label: 'Produk Pilihan',
    emoji: '💎',
    description: 'Section produk pilihan editorial di home mobile — Picks for You, dll.',
    fields: [
      { key: 'productId',    label: 'Produk',         type: 'product' },
      { key: 'displayOrder', label: 'Urutan',         type: 'number' },
      { key: 'badgeText',    label: 'Badge',          placeholder: 'Editor\'s Pick' },
      { key: 'tag',          label: 'Tag',            placeholder: 'Trending' },
    ]
  },
};

// ─── Page ──────────────────────────────────────────────────────────────────

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

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: '',
      displayOrder: 0,
      isActive: true,
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodData = await ProductService.getAll(0, 200);
        setProducts(prodData.content || []);
        if (!isNew) {
          const data = await ContentService.getById(id);
          form.reset({
            title: data.title,
            displayOrder: data.displayOrder,
            isActive: data.isActive,
            items: data.items.map(item => ({ ...item, productId: item.productId || undefined })),
          });
        }
      } catch {
        toast({ title: 'Error', description: 'Gagal memuat data', variant: 'destructive' });
      }
    };
    loadData();
  }, [id, isNew]);

  const onSubmit = async (values: SectionFormValues) => {
    setIsLoading(true);
    try {
      const payload = { ...values, type, platform: 'MOBILE' as const };
      if (isNew) {
        await ContentService.create(payload as any);
        toast({ title: 'Berhasil', description: 'Section berhasil dibuat' });
      } else {
        await ContentService.update(id, payload as any);
        toast({ title: 'Berhasil', description: 'Section berhasil diupdate' });
      }
      router.push(`/admin/content/mobile/${type}`);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Gagal menyimpan section', variant: 'destructive' });
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
          <p className="text-slate-400 text-xs font-semibold">{typeConfig.description}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Section Config Card */}
          <div className="bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-white/10 p-8 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                <LayoutTemplate size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">Konfigurasi Section</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Platform: MOBILE · Type: {type}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }: { field: any }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Judul Section</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Flash Sale Ramadan 2025" {...field} className="h-12 rounded-2xl border-slate-200 focus:ring-emerald-400 font-semibold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Urutan Tampil</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="h-12 rounded-2xl border-slate-200 focus:ring-emerald-400 font-semibold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }: { field: any }) => (
                  <FormItem className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-white/10 p-4 bg-slate-50/50 dark:bg-white/5">
                    <div>
                      <FormLabel className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">Published & Active</FormLabel>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Section akan tampil di aplikasi mobile</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Items Section */}
          {typeConfig.hasNoItems ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 p-10 text-center">
              <p className="text-sm font-bold text-slate-500">Tipe ini tidak membutuhkan items individual.</p>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Judul section di atas akan digunakan sebagai konten utama.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                    <Tag size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                      {typeConfig.emoji} {typeConfig.label}s
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold">{fields.length} item ditambahkan</p>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => append({ title: '', subtitle: '', imageUrl: '', displayOrder: fields.length })}
                  className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest h-9 px-4 shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus size={13} className="mr-1" /> Tambah Item
                </Button>
              </div>

              {fields.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 p-10 text-center">
                  <div className="text-4xl mb-3">{typeConfig.emoji}</div>
                  <p className="text-sm font-bold text-slate-500">Belum ada item</p>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Klik "Tambah Item" untuk menambahkan {typeConfig.label} pertama</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {fields.map((itemField: any, index: number) => (
                  <div
                    key={itemField.id}
                    className="group bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative"
                  >
                    <div className="absolute -left-px top-6 bottom-6 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-white/10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                        {typeConfig.emoji} {typeConfig.label} #{index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-8 w-8 rounded-full text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                      {/* Image column */}
                      {typeConfig.fields.some(f => f.type === 'image') && (
                        <div className="md:col-span-3">
                          {typeConfig.fields.filter(f => f.type === 'image').map(f => (
                            <FormField
                              key={f.key}
                              control={form.control}
                              name={`items.${index}.${f.key}` as any}
                              render={({ field }: { field: any }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">{f.label}</FormLabel>
                                  <FormControl>
                                    <ImageUpload value={field.value as string} onChange={field.onChange} />
                                  </FormControl>
                                  {f.hint && <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{f.hint}</p>}
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      )}

                      {/* Text/product/number fields */}
                      <div className={`${typeConfig.fields.some(f => f.type === 'image') ? 'md:col-span-9' : 'md:col-span-12'} grid grid-cols-1 md:grid-cols-2 gap-4`}>
                        {typeConfig.fields.filter(f => f.type !== 'image').map(f => (
                          <FormField
                            key={f.key}
                            control={form.control}
                            name={`items.${index}.${f.key}` as any}
                            render={({ field }: { field: any }) => (
                              <FormItem className={f.wide || f.type === 'textarea' ? 'md:col-span-2' : ''}>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">{f.label}</FormLabel>
                                <FormControl>
                                  {f.type === 'product' ? (
                                    <Combobox
                                      options={products.map(p => ({ label: p.name, value: p.id }))}
                                      value={field.value as number}
                                      onChange={field.onChange}
                                      placeholder="Cari produk..."
                                    />
                                  ) : f.type === 'number' ? (
                                    <Input type="number" {...field} className="h-10 rounded-xl font-semibold" placeholder={f.placeholder} />
                                  ) : f.type === 'textarea' ? (
                                    <textarea
                                      {...field as any}
                                      rows={3}
                                      placeholder={f.placeholder}
                                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-slate-900 dark:border-white/10"
                                    />
                                  ) : (
                                    <Input {...field as any} className="h-10 rounded-xl font-semibold" placeholder={f.placeholder} />
                                  )}
                                </FormControl>
                                {f.hint && <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{f.hint}</p>}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest h-12 px-8 shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:scale-100"
            >
              {isLoading ? (
                <><Loader2 size={16} className="mr-2 animate-spin" /> Menyimpan...</>
              ) : (
                <><Save size={16} className="mr-2" /> {isNew ? 'Buat Section' : 'Simpan Perubahan'}</>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(`/admin/content/mobile/${type}`)}
              className="rounded-full h-12 px-6 text-slate-500 hover:text-slate-900 font-bold"
            >
              Batal
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
