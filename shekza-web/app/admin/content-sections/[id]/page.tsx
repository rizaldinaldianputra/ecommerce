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
import { Layout, Plus, Trash2, Tag, Image as ImageIcon, Link as LinkIcon, MoveVertical } from 'lucide-react';
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
  displayOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  items: z.array(contentItemSchema).default([]),
});

type ContentSectionFormValues = z.infer<typeof contentSectionSchema>;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ContentSectionEditPage({ params }: PageProps) {
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
        const prodData = await ProductService.getAll(0, 100);
        setProducts(prodData.content || []);

        if (!isNew) {
          const data = await ContentService.getById(id);
          form.reset({
            title: data.title,
            type: data.type,
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
      router.push('/admin/content-sections');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save section', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CrudForm
      title={isNew ? 'New Content Section' : 'Edit Content Section'}
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
                render={({ field }) => (
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Display Mode</FormLabel>
                    <FormControl>
                      <Combobox
                        options={[
                          { label: 'Hero Carousel', value: 'HERO_CAROUSEL' },
                          { label: 'Curated Products', value: 'CURATED_PRODUCTS' },
                          { label: 'Recommended Products', value: 'RECOMMENDED_PRODUCTS' },
                          { label: 'Why Shop Perks', value: 'WHY_SHOP' },
                          { label: 'Shop the Look', value: 'SHOP_THE_LOOK' },
                          { label: 'Promo Banner', value: 'BANNER' },
                          { label: 'Latest News', value: 'NEWS' },
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
                render={({ field }) => (
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
                name="isActive"
                render={({ field }) => (
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
          <div className="space-y-4">
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
                {fields.map((field, index) => (
                  <div key={field.id} className="bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-all group relative">
                     <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-12 w-1.5 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                     
                     <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        <div className="md:col-span-3">
                           <FormField
                              control={form.control}
                              name={`items.${index}.imageUrl`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Media</FormLabel>
                                  <FormControl>
                                    <ImageUpload
                                      value={field.value}
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                           />
                        </div>

                        <div className="md:col-span-8 grid grid-cols-2 gap-4">
                           <FormField
                              control={form.control}
                              name={`items.${index}.title`}
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Item Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="h-10 rounded-xl font-bold" placeholder="Headline..." />
                                  </FormControl>
                                </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name={`items.${index}.subtitle`}
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subtitle</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="h-10 rounded-xl" placeholder="Additional details..." />
                                  </FormControl>
                                </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name={`items.${index}.productId`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Product Link</FormLabel>
                                  <FormControl>
                                    <Combobox
                                      options={products.map(p => ({ label: p.name, value: p.id }))}
                                      value={field.value}
                                      onChange={field.onChange}
                                      placeholder="Connect product..."
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                           />
                            <FormField
                              control={form.control}
                              name={`items.${index}.linkUrl`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Custom URL</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="h-10 rounded-xl font-mono text-xs" placeholder="/shop/category" />
                                  </FormControl>
                                </FormItem>
                              )}
                           />

                            <FormField
                               control={form.control}
                               name={`items.${index}.tag`}
                               render={({ field }) => (
                                 <FormItem>
                                   <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tag / Category</FormLabel>
                                   <FormControl>
                                     <Input {...field} className="h-10 rounded-xl" placeholder="e.g. Best Seller" />
                                   </FormControl>
                                 </FormItem>
                               )}
                            />
                            <FormField
                               control={form.control}
                               name={`items.${index}.ctaText`}
                               render={({ field }) => (
                                 <FormItem>
                                   <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">CTA Text</FormLabel>
                                   <FormControl>
                                     <Input {...field} className="h-10 rounded-xl" placeholder="e.g. Shop Now" />
                                   </FormControl>
                                 </FormItem>
                               )}
                            />
                            <FormField
                               control={form.control}
                               name={`items.${index}.badgeText`}
                               render={({ field }) => (
                                 <FormItem>
                                   <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Badge Text</FormLabel>
                                   <FormControl>
                                     <Input {...field} className="h-10 rounded-xl font-bold text-pink-500" placeholder="e.g. 20% OFF" />
                                   </FormControl>
                                 </FormItem>
                               )}
                            />
                            <FormField
                               control={form.control}
                               name={`items.${index}.emoji`}
                               render={({ field }) => (
                                 <FormItem>
                                   <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Emoji icon</FormLabel>
                                   <FormControl>
                                     <Input {...field} className="h-10 rounded-xl text-center text-lg" placeholder="✨" />
                                   </FormControl>
                                 </FormItem>
                               )}
                            />
                            <FormField
                               control={form.control}
                               name={`items.${index}.styleConfig`}
                               render={({ field }) => (
                                 <FormItem className="col-span-2">
                                   <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Style Config (CSV: gradient,bg,border)</FormLabel>
                                   <FormControl>
                                     <Input {...field} className="h-10 rounded-xl font-mono text-[10px]" placeholder="from-pink-500 to-rose-600,from-pink-50 to-rose-50,border-pink-100" />
                                   </FormControl>
                                 </FormItem>
                               )}
                            />
                        </div>

                        <div className="md:col-span-1 flex flex-col items-center justify-center gap-2 pt-6">
                           <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-50"
                           >
                              <Trash2 size={18} />
                           </Button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </Form>
    </CrudForm>
  );
}
