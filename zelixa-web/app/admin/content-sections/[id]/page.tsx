'use client';

import { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CrudForm } from '@/components/admin/crud-form';
import { ContentService, ContentSection, ContentItem } from '@/services/content.service';
import { ProductService } from '@/services/product.service';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import { Layout, Plus, Trash2, Tag, Image as ImageIcon, Link as LinkIcon, MoveVertical, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { ImageUpload } from '@/components/ui/image-upload';

const contentItemSchema = z.object({
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

const contentSectionSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  type: z.string().default('HERO_CAROUSEL'),
  platform: z.enum(['WEB', 'MOBILE', 'ALL']).default('WEB'),
  displayOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  items: z.array(contentItemSchema).default([]),
});

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT_FIELD_CONFIG: Each key maps to a frontend component.
// Fields are derived from actual component code (not guesses).
// ─────────────────────────────────────────────────────────────────────────────

type FieldType = 'text' | 'number' | 'image' | 'product' | 'textarea' | 'rating';

interface FieldDef {
  key: keyof z.infer<typeof contentItemSchema>;
  label: string;
  placeholder?: string;
  type?: FieldType;
  hint?: string;   // shows as helper text below the field
  wide?: boolean;  // spans full width in 2-col grid
}

interface TypeConfig {
  label: string;    // human title shown in header of each item card
  platform: 'WEB' | 'MOBILE' | 'BOTH';
  description: string;
  fields: FieldDef[];
  hasNoItems?: boolean; // true for section-level-only types like Newsletter
}

const CONTENT_FIELD_CONFIG: Record<string, TypeConfig> = {

  // ── WEB ──────────────────────────────────────────────────────────────────

  HERO_CAROUSEL: {
    label: '🖼 Hero Slide',
    platform: 'WEB',
    description: 'Each slide in the HeroBanner component. Supports multi-line title using \\n.',
    fields: [
      // HeroBanner.tsx reads: item.imageUrl → right-side product photo
      { key: 'imageUrl',   label: 'Hero Image',       type: 'image', hint: 'Product/campaign photo shown on the right side of the slide.' },
      // item.title → h1 headline (line 2 gets accent gradient)
      { key: 'title',      label: 'Headline',          placeholder: 'New Summer\nCollection', hint: 'Use \\n to break into 2 lines. Second line gets the gradient color.' },
      // item.subtitle → paragraph below headline
      { key: 'subtitle',   label: 'Subtitle',          placeholder: 'Discover the latest drops, up to 50% OFF.' },
      // item.ctaText → button label
      { key: 'ctaText',    label: 'CTA Button Label',  placeholder: 'Shop Now' },
      // item.linkUrl → button href
      { key: 'linkUrl',    label: 'CTA Button Link',   placeholder: '/products?tag=summer' },
      // item.tag → small pill chip above the headline
      { key: 'tag',        label: 'Pill Tag (above headline)', placeholder: 'New Arrival ✨' },
      // item.badgeText → secondary badge/label next to CTA
      { key: 'badgeText',  label: 'Badge Label (beside button)', placeholder: 'Free Shipping' },
      // item.styleConfig → CSS gradient classes (comma-separated)
      { key: 'styleConfig', label: 'Background Gradient', placeholder: 'from-pink-50,to-rose-100,from-pink-400 to-rose-600', hint: 'CSV format: bgFrom,bgTo,accentGradient. Example: from-purple-50,to-indigo-100,from-purple-400 to-indigo-600', wide: true },
    ]
  },

  SHOP_THE_LOOK: {
    label: '📸 Social Post / Shop the Look',
    platform: 'WEB',
    description: 'SocialSection.tsx — square grid posts. Hover shows product name + likes.',
    fields: [
      // SocialSection: item.imageUrl → square post image
      { key: 'imageUrl',  label: 'Post Image',         type: 'image', hint: 'Square-format social photo (Instagram style).' },
      // item.title → product name shown on hover overlay
      { key: 'title',     label: 'Product Name',       placeholder: 'Pastel Hoodie Set' },
      // item.badgeText → likes count shown on hover
      { key: 'badgeText', label: 'Likes Count',        placeholder: '1.2k' },
      // item.linkUrl → link on click
      { key: 'linkUrl',   label: 'Link (product or post)', placeholder: '/products/pastel-hoodie-set' },
    ]
  },

  BRANDS_SECTION: {
    label: '🏷 Brand Partner',
    platform: 'WEB',
    description: 'BrandsSection.tsx marquee. Shows brand logo or brand name text if no logo.',
    fields: [
      // BrandsSection: brand.logo → text shown (fallsback to title)
      { key: 'title',    label: 'Brand Name (shown as text logo)', placeholder: 'ZARA', hint: 'Displayed in uppercase bold text if no image.' },
      // brand logo image
      { key: 'imageUrl', label: 'Brand Logo Image',  type: 'image', hint: 'Optional. If provided, shows image instead of text.' },
      // click target
      { key: 'linkUrl',  label: 'Brand Page Link',   placeholder: '/brands/zara' },
      { key: 'displayOrder', label: 'Order in Marquee', type: 'number' },
    ]
  },

  TESTIMONIALS: {
    label: '⭐ Customer Review',
    platform: 'WEB',
    description: 'Testimonials.tsx grid. Each item is one reviewer card.',
    fields: [
      // t.img → avatar photo
      { key: 'imageUrl',    label: 'Reviewer Avatar',   type: 'image' },
      // t.name → bold name below avatar
      { key: 'title',       label: 'Full Name',          placeholder: 'Anindya Putri' },
      // t.text → review paragraph
      { key: 'subtitle',    label: 'Review Text',        type: 'textarea', placeholder: 'zelixa is literally my go-to for every new fit...', wide: true },
      // t.product → product name below the review
      { key: 'tag',         label: 'Product Purchased',  placeholder: 'Pastel Dream Hoodie' },
      // t.date → shown under the name
      { key: 'badgeText',   label: 'Date Posted',        placeholder: '2 days ago' },
      // t.rating → 1–5 stars (use displayOrder field to store it)
      { key: 'displayOrder', label: 'Star Rating (1–5)', type: 'number', hint: 'Enter a number from 1 to 5.' },
    ]
  },

  FLASH_SALE_WEB: {
    label: '⚡ Flash Sale Product (Web)',
    platform: 'WEB',
    description: 'FlashSale.tsx — horizontal product grid in dark background section. Each item = one sale product.',
    fields: [
      // Each product in the flash sale grid
      { key: 'productId',    label: 'Product',            type: 'product', hint: 'The product to feature in the Flash Sale grid.' },
      // stock count shown below the product card
      { key: 'badgeText',    label: 'Stock Remaining',    placeholder: '12', hint: 'Shows "X Left" below the product. E.g. "12".' },
      // optional end time per product
      { key: 'subtitle',     label: 'Sale End Date/Time', placeholder: '2024-12-31 23:59', hint: 'Optional per-item end time.' },
      { key: 'displayOrder', label: 'Display Order',      type: 'number' },
    ]
  },

  FEATURED_PRODUCTS: {
    label: '📦 Featured Product (Web)',
    platform: 'WEB',
    description: 'FeaturedProducts.tsx — tab-filtered product grid. Products come from ProductService; this section controls which appear.',
    fields: [
      { key: 'productId',    label: 'Product',         type: 'product', hint: 'Product to feature in the Curated Selections grid.' },
      // tab category each product belongs to
      { key: 'tag',          label: 'Tab Category',    placeholder: 'Best Seller', hint: 'One of: All, Best Seller, New Arrival, Sale, Trending' },
      { key: 'displayOrder', label: 'Order in Grid',   type: 'number' },
    ]
  },

  RECOMMENDED_PRODUCTS: {
    label: '✨ Recommended Product',
    platform: 'WEB',
    description: 'Recommendations.tsx — horizontal scroll carousel. Products come from ProductService.',
    fields: [
      { key: 'productId',    label: 'Product',        type: 'product' },
      { key: 'tag',          label: 'Tag',            placeholder: 'e.g. Minimalist, Streetwear' },
      { key: 'displayOrder', label: 'Scroll Order',  type: 'number' },
    ]
  },

  NEWSLETTER: {
    label: '📧 Newsletter Config',
    platform: 'WEB',
    description: 'Newsletter.tsx — section-level config only. No items needed. The section title/subtitle controls the headline text.',
    hasNoItems: true,
    fields: []
  },

  // ── MOBILE ────────────────────────────────────────────────────────────

  MOBILE_PROMO: {
    label: '🎠 Promo Carousel Slide',
    platform: 'MOBILE',
    description: 'HomePromoCarousel — each slide shows gradient banner with title, subtitle, tag chip and "Shop Now" button.',
    fields: [
      // item.title → large white text
      { key: 'title',       label: 'Title',             placeholder: 'Summer Collection' },
      // item.subtitle → smaller text below
      { key: 'subtitle',    label: 'Subtitle',           placeholder: 'Up to 40% OFF' },
      // item.tag → pill chip at the top of the card
      { key: 'tag',         label: 'Tag Chip',           placeholder: 'New Arrival' },
      // item.imageUrl → optional background image
      { key: 'imageUrl',    label: 'Background Image',   type: 'image', hint: 'Optional. Falls back to gradient if not set.' },
      // item.linkUrl → optional navigation target
      { key: 'linkUrl',     label: 'Tap Link (Deep Link)', placeholder: 'zelixa://category/sale' },
      // item.styleConfig → gradient hex colors (CSV: color1,color2)
      { key: 'styleConfig', label: 'Gradient Colors', placeholder: '0xFF6A1B9A,0xFFAB47BC', hint: 'Hex color CSV: startColor,endColor. E.g. 0xFF6A1B9A,0xFFAB47BC for purple.', wide: true },
      { key: 'displayOrder', label: 'Slide Order', type: 'number' },
    ]
  },

  FLASH_SALE_MOBILE: {
    label: '⚡ Flash Sale Item (Mobile)',
    platform: 'MOBILE',
    description: 'HomeFlashSale — horizontal scrolling ProductCard list. Each item = one sale product.',
    fields: [
      // ProductCard needs productId to load the product
      { key: 'productId',    label: 'Product',           type: 'product', hint: 'Will be fetched and rendered as a ProductCard in the mobile flash sale strip.' },
      // discount badge on the product card
      { key: 'badgeText',    label: 'Discount Badge',    placeholder: '50% OFF', hint: 'Shown as a badge on the product card.' },
      { key: 'displayOrder', label: 'Position in List',  type: 'number' },
    ]
  },

  TRENDING_LIST: {
    label: '🔥 Trending Card',
    platform: 'MOBILE',
    description: 'HomeTrendingList — horizontal card list with background photo, category label and title text.',
    fields: [
      // card background photo
      { key: 'imageUrl',     label: 'Card Background Photo', type: 'image', hint: 'Full-bleed background image for the trending card (280×200).' },
      // category label shown at top in lighter text
      { key: 'subtitle',     label: 'Category Label (top)', placeholder: 'Exclusive Selection' },
      // main bold text at bottom
      { key: 'title',        label: 'Card Title (bottom)',  placeholder: 'Best Outfit for 2026' },
      // navigation target
      { key: 'linkUrl',      label: 'Tap Link (Deep Link)', placeholder: 'zelixa://collection/trending' },
      { key: 'displayOrder', label: 'Card Position',        type: 'number' },
    ]
  },

  FEATURED_MOBILE: {
    label: '📦 Featured Product (Mobile Grid)',
    platform: 'MOBILE',
    description: 'Home featured section — 2-column product grid using ProductCard widgets.',
    fields: [
      { key: 'productId',    label: 'Product',         type: 'product', hint: 'Displayed as a ProductCard in the 2-col grid.' },
      { key: 'displayOrder', label: 'Grid Position',   type: 'number' },
    ]
  },
};


type ContentSectionFormValues = z.infer<typeof contentSectionSchema>;

interface PageProps {
  params: Promise<{ id: string }>;
}

import { Suspense } from 'react';

function ContentSectionEditContent({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const { id } = use(params);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const isNew = id === 'new';

  const form = useForm<any>({
    resolver: zodResolver(contentSectionSchema),
    defaultValues: {
      title: '',
      type: typeParam || 'HERO_CAROUSEL',
      platform: (searchParams.get('platform') as any) || 'WEB',
      displayOrder: 0,
      isActive: true,
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // Auto-sync the Platform field when type changes
  const watchedType = form.watch('type');
  useEffect(() => {
    const config = CONTENT_FIELD_CONFIG[watchedType];
    if (!config) return;
    if (config.platform === 'WEB') form.setValue('platform', 'WEB');
    if (config.platform === 'MOBILE') form.setValue('platform', 'MOBILE');
  }, [watchedType]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodData = await ProductService.getAll(0, 100);
        setProducts(prodData.content || []);

        if (!isNew) {
          const data = await ContentService.getById(id);
          form.reset({
            title: data.title,
            type: data.type,
            platform: data.platform || 'WEB',
            displayOrder: data.displayOrder,
            isActive: data.isActive,
            items: data.items.map(item => ({
              ...item,
              productId: item.productId || undefined
            })),
          });
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load content section', variant: 'destructive' });
      }
    };
    loadData();
  }, [id, isNew]);

  const onSubmit = async (values: ContentSectionFormValues) => {
    setIsLoading(true);
    try {
      if (isNew) {
        await ContentService.create(values as any);
        toast({ title: 'Success', description: 'Section created' });
      } else {
        await ContentService.update(id, values as any);
        toast({ title: 'Success', description: 'Section updated' });
      }
      const redirectUrl = values.platform === 'MOBILE' 
        ? '/admin/content/mobile' 
        : values.platform === 'WEB' 
          ? '/admin/content/web'
          : '/admin/content';
      router.push(redirectUrl);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save section', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push(`/admin/content-sections${typeParam ? `?type=${typeParam}` : ''}`)}
          className="rounded-full hover:bg-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="h-10 w-10 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500">
           <Layout size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            {isNew ? 'New Content Section' : 'Edit Content Section'}
          </h1>
          <p className="text-slate-500 text-xs font-bold">Configure storefront content and items.</p>
        </div>
      </div>

      <CrudForm
        title=""
        onSubmit={form.handleSubmit(onSubmit)}
        isLoading={isLoading}
      >
      <Form {...form}>
        <div className="max-w-5xl space-y-8">
          {/* Configuration Card */}
          <div className="bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 space-y-6 shadow-sm">
             <div className="flex items-center gap-3 mb-2">
               <div className="h-10 w-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                  <Layout size={24} />
               </div>
               <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 dark:text-white">Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField
                control={form.control}
                name="title"
                render={({ field }: any) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Section Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Featured Products" {...field} className="h-12 rounded-2xl border-slate-200 focus:ring-pink-500 font-bold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Display Mode</FormLabel>
                    <FormControl>
                      <Combobox
                        options={[
                          // ── 🖥 WEB STOREFRONT ──────────────────────────
                          { label: '🖥 Web · Hero Banner Carousel',      value: 'HERO_CAROUSEL' },
                          { label: '🖥 Web · Featured Products Grid',    value: 'FEATURED_PRODUCTS' },
                          { label: '🖥 Web · Flash Sale',                value: 'FLASH_SALE_WEB' },
                          { label: '🖥 Web · Recommendations Carousel',  value: 'RECOMMENDED_PRODUCTS' },
                          { label: '🖥 Web · Brands Marquee',            value: 'BRANDS_SECTION' },
                          { label: '🖥 Web · Customer Testimonials',     value: 'TESTIMONIALS' },
                          { label: '🖥 Web · Shop the Look (Social)',    value: 'SHOP_THE_LOOK' },
                          { label: '🖥 Web · Newsletter',                value: 'NEWSLETTER' },
                          // ── 📱 MOBILE APP ─────────────────────────────
                          { label: '📱 Mobile · Promo Carousel',         value: 'MOBILE_PROMO' },
                          { label: '📱 Mobile · Flash Sale Strip',       value: 'FLASH_SALE_MOBILE' },
                          { label: '📱 Mobile · Trending Now',           value: 'TRENDING_LIST' },
                          { label: '📱 Mobile · Featured Products',      value: 'FEATURED_MOBILE' },
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Display Priority</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="h-12 rounded-2xl border-slate-200 focus:ring-pink-500 font-bold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platform"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Target Platform</FormLabel>
                    <FormControl>
                      <Combobox
                        options={[
                          { label: 'Website Storefront', value: 'WEB' },
                          { label: 'Mobile Application', value: 'MOBILE' },
                          { label: 'All Platforms', value: 'ALL' },
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }: any) => (
                  <FormItem className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 bg-slate-50/50 md:col-span-2">
                    <FormLabel className="text-sm font-bold text-slate-700 uppercase tracking-tight">Published & Active</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Items Section */}
          {(() => {
            const currentType = form.watch('type');
            const config = CONTENT_FIELD_CONFIG[currentType] || {
              label: 'Generic Item',
              platform: 'WEB' as const,
              description: 'Generic content item.',
              fields: [
                { key: 'imageUrl' as const, label: 'Image', type: 'image' as const },
                { key: 'title' as const, label: 'Title' },
                { key: 'subtitle' as const, label: 'Subtitle' },
                { key: 'linkUrl' as const, label: 'Link URL' },
              ]
            };

            return (
              <div className="space-y-4">
                {/* Type context banner */}
                <div className={`rounded-2xl border px-5 py-4 text-sm font-medium flex items-start gap-3 ${
                  config.platform === 'MOBILE'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
                    : 'bg-violet-50 border-violet-100 text-violet-700 dark:bg-violet-900/20 dark:border-violet-800 dark:text-violet-400'
                }`}>
                  <span className="text-lg leading-none mt-0.5">{config.platform === 'MOBILE' ? '📱' : '🖥'}</span>
                  <div>
                    <p className="font-black uppercase tracking-wide text-[11px]">{config.platform} — {config.label}</p>
                    <p className="text-[11px] mt-0.5 opacity-80">{config.description}</p>
                  </div>
                </div>

                {config.hasNoItems ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-8 text-center text-slate-400">
                    <p className="text-sm font-bold">This section type doesn't use individual items.</p>
                    <p className="text-xs mt-1">The Section Title above will be used as the main text content.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
                          <Tag size={20} />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 dark:text-white">Section Items</h3>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ title: '', subtitle: '', imageUrl: '', displayOrder: fields.length })}
                        className="rounded-full border-pink-200 text-pink-600 hover:bg-pink-50 font-bold uppercase text-[10px] tracking-widest h-9 px-4"
                      >
                        <Plus size={14} className="mr-1" /> Add Item
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {fields.map((itemField: any, index: number) => (
                        <div key={itemField.id} className="bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-all group relative">
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-12 w-1.5 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-pink-600">
                              {config.label} #{index + 1}
                            </span>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50">
                              <Trash2 size={14} />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            {/* Image column — left side */}
                            {config.fields.some((f: any) => f.type === 'image') && (
                              <div className="md:col-span-3">
                                {config.fields.filter((f: any) => f.type === 'image').map((f: any) => (
                                  <FormField
                                    key={f.key}
                                    control={form.control}
                                    name={`items.${index}.${f.key}`}
                                    render={({ field }: any) => (
                                      <FormItem>
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{f.label}</FormLabel>
                                        <FormControl>
                                          <ImageUpload value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        {f.hint && <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{f.hint}</p>}
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                            )}

                            {/* Text / product / number fields — right side */}
                            <div className={`${config.fields.some((f: any) => f.type === 'image') ? 'md:col-span-9' : 'md:col-span-12'} grid grid-cols-1 md:grid-cols-2 gap-4`}>
                              {config.fields.filter((f: any) => f.type !== 'image').map((f: any) => (
                                <FormField
                                  key={f.key}
                                  control={form.control}
                                  name={`items.${index}.${f.key}`}
                                  render={({ field }: any) => (
                                    <FormItem className={f.wide || f.type === 'textarea' ? 'md:col-span-2' : ''}>
                                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{f.label}</FormLabel>
                                      <FormControl>
                                        {f.type === 'product' ? (
                                          <Combobox
                                            options={products.map((p: any) => ({ label: p.name, value: p.id }))}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Search product..."
                                          />
                                        ) : f.type === 'number' ? (
                                          <Input type="number" {...field} className="h-10 rounded-xl font-bold" placeholder={f.placeholder} />
                                        ) : f.type === 'textarea' ? (
                                          <textarea
                                            {...field}
                                            rows={3}
                                            placeholder={f.placeholder}
                                            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                                          />
                                        ) : (
                                          <Input {...field} className="h-10 rounded-xl font-bold" placeholder={f.placeholder} />
                                        )}
                                      </FormControl>
                                      {f.hint && <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{f.hint}</p>}
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      </Form>
    </CrudForm>
    </div>
  );
}

export default function ContentSectionEditPage({ params }: PageProps) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    }>
      <ContentSectionEditContent params={params} />
    </Suspense>
  );
}
