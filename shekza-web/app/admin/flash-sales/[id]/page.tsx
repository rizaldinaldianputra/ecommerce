'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { CrudForm } from '@/components/admin/crud-form';
import { FlashSaleService, FlashSale, FlashSaleItem } from '@/services/flash-sale.service';
import { ProductService } from '@/services/product.service';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Zap, Calendar, Package, IndianRupee, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';

const flashSaleItemSchema = z.object({
  id: z.number().optional(),
  productId: z.coerce.number().min(1, 'Product is required'),
  variantId: z.coerce.number().min(1, 'Variant is required'),
  discountPrice: z.coerce.number().min(0.01, 'Discount price must be greater than 0'),
  stockLimit: z.coerce.number().min(1, 'Stock limit must be at least 1'),
});

const flashSaleSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  isActive: z.boolean().default(true),
  items: z.array(flashSaleItemSchema).min(1, 'At least one product is required'),
});

type FlashSaleFormValues = z.infer<typeof flashSaleSchema>;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function FlashSaleEditPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const isNew = id === 'new';

  const form = useForm<any>({
    resolver: zodResolver(flashSaleSchema),
    defaultValues: {
      name: '',
      startTime: '',
      endTime: '',
      isActive: true,
      items: [{ productId: 0, variantId: 0, discountPrice: 0, stockLimit: 1 }],
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
          const data = await FlashSaleService.getById(id);
          form.reset({
            name: data.name,
            startTime: data.startTime.substring(0, 16), // Format for datetime-local
            endTime: data.endTime.substring(0, 16),
            isActive: data.isActive,
            items: data.items.map(item => ({
              id: item.id,
              productId: item.productId,
              variantId: item.variantId,
              discountPrice: item.discountPrice,
              stockLimit: item.stockLimit || 1,
            })),
          });
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load flash sale data', variant: 'destructive' });
      }
    };
    loadData();
  }, [id, isNew]);

  const onSubmit = async (values: FlashSaleFormValues) => {
    setIsLoading(true);
    try {
      if (isNew) {
        await FlashSaleService.create(values as any);
        toast({ title: 'Success', description: 'Flash sale created' });
      } else {
        await FlashSaleService.update(id, values as any);
        toast({ title: 'Success', description: 'Flash sale updated' });
      }
      router.push('/admin/flash-sales');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save flash sale', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CrudForm
      title={isNew ? 'New Flash Sale' : 'Edit Flash Sale'}
      onSubmit={form.handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      <Form {...form}>
        <div className="max-w-5xl space-y-8">
          {/* Header Info */}
          <div className="bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 space-y-6 shadow-sm">
             <div className="flex items-center gap-3 mb-2">
               <div className="h-10 w-10 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                  <Zap size={24} />
               </div>
               <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 dark:text-white">General Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Summer Mega Sale" {...field} className="h-12 rounded-2xl border-slate-200 focus:ring-pink-500 font-bold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 flex gap-2 items-center">
                      <Calendar size={10} /> Start Time
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} className="h-12 rounded-2xl border-slate-200 focus:ring-pink-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 flex gap-2 items-center">
                      <Calendar size={10} /> End Time
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} className="h-12 rounded-2xl border-slate-200 focus:ring-pink-500" />
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
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-bold text-slate-700 uppercase tracking-tight">Active Status</FormLabel>
                      <p className="text-xs text-slate-400 italic font-medium">Toggle visibility of this flash sale campaign.</p>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <div className="h-9 w-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600">
                  <Tag size={20} />
               </div>
               <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 dark:text-white">Products in Flash Sale</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ productId: 0, variantId: 0, discountPrice: 0, stockLimit: 1 })}
              className="rounded-full border-pink-200 text-pink-600 hover:bg-pink-50 font-bold uppercase text-[10px] tracking-widest h-9 px-4"
            >
                <Plus size={14} className="mr-1" /> Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-white/70 dark:bg-slate-900/70 rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-all group relative">
                   <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-12 w-1.5 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                   <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`items.${index}.productId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Select Product</FormLabel>
                              <FormControl>
                                <Combobox
                                  options={products.map(p => ({ label: p.name, value: p.id }))}
                                  value={field.value}
                                  onChange={(val) => {
                                    field.onChange(val);
                                    form.setValue(`items.${index}.variantId`, 0); // Reset variant when product changes
                                  }}
                                  placeholder="Search products..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`items.${index}.variantId`}
                          render={({ field }) => {
                            const selectedProductId = form.watch(`items.${index}.productId`);
                            const selectedProduct = products.find(p => p.id === Number(selectedProductId));
                            const variantOptions = selectedProduct?.variants?.map(v => ({
                              label: `${v.sku} ${v.color ? `- ${v.color}` : ''} ${v.size ? `(${v.size})` : ''}`,
                              value: v.id
                            })) || [];

                            return (
                              <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Select Variant</FormLabel>
                                <FormControl>
                                  <Combobox
                                    options={variantOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select variant..."
                                    disabled={!selectedProductId}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>

                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`items.${index}.discountPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Flash Sale Price</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                                  <Input type="number" step="0.01" {...field} className="h-12 pl-8 rounded-2xl border-slate-200 focus:ring-pink-500 font-bold" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`items.${index}.stockLimit`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Max Stock</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} className="h-12 rounded-2xl border-slate-200 focus:ring-pink-500 font-bold" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-1 flex justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-12 w-12 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50"
                          disabled={fields.length === 1}
                        >
                          <Trash2 size={20} />
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
