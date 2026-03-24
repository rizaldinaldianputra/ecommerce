'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CrudForm } from '@/components/admin/crud-form';
import { ProductService } from '@/services/product.service';
import { CategoryService } from '@/services/category.service';
import { Product, ProductVariant } from '@/types/product';
import { Category } from '@/types/category';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { ImageUpload } from '@/components/ui/image-upload';

const variantSchema = z.object({
  id: z.number().optional(),
  sku: z.string().min(3),
  size: z.string().optional(),
  color: z.string().optional(),
  hexColor: z.string().optional(),
  price: z.coerce.number().min(0.01),
  discountPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().min(0),
  isActive: z.boolean().default(true),
  imageUrl: z.string().optional(),
});

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  categoryId: z.coerce.number().min(1),
  gender: z.enum(['MEN', 'WOMEN', 'UNISEX']).default('UNISEX'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  imageUrl: z.string().optional(),
  images: z.array(z.string()).default([]),
  variants: z.array(variantSchema).min(1),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const isNew = params.id === 'new';

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      categoryId: 1,
      gender: 'UNISEX',
      isActive: true,
      isFeatured: false,
      imageUrl: '',
      images: [],
      variants: [{ sku: '', size: '', color: '', hexColor: '', price: 0.01, discountPrice: 0, stock: 0, isActive: true, imageUrl: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await CategoryService.getAll();
        setCategories(cats.content || []);

        if (!isNew && params.id) {
          const data = await ProductService.getById(Number(params.id));
          form.reset({
            name: data.name,
            slug: data.slug,
            description: data.description || '',
            categoryId: data.categoryId,
            gender: data.gender || 'UNISEX',
            isActive: data.isActive,
            isFeatured: data.isFeatured,
            imageUrl: data.imageUrl || '',
            images: data.images || [],
            variants: data.variants.map(v => ({
              id: v.id,
              sku: v.sku,
              size: v.size || '',
              color: v.color || '',
              hexColor: v.hexColor || '',
              price: v.price || 0.01,
              discountPrice: v.discountPrice || 0,
              stock: v.stock || 0,
              isActive: v.isActive,
              imageUrl: v.imageUrl || '',
            })),
          });
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
      }
    };
    loadData();
  }, [isNew, params.id]);

  // Auto-generate slug from name
  const name = form.watch('name');
  useEffect(() => {
    if (isNew || !form.getValues('slug')) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      form.setValue('slug', slug);
    }
  }, [name, form, isNew]);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        variants: values.variants.map((v: any) => ({
          ...v,
          price: Number(v.price),
          discountPrice: Number(v.discountPrice),
          stock: Number(v.stock),
        }))
      };
      if (isNew) {
        await ProductService.create(payload as any);
        toast({ title: 'Success', description: 'Product created' });
      } else {
        await ProductService.update(Number(params.id), payload as any);
        toast({ title: 'Success', description: 'Product updated' });
      }
      router.push('/admin/products');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save product', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CrudForm
      title={isNew ? 'New Product' : 'Edit Product'}
      onSubmit={form.handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      <Form {...form}>
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Classic T-Shirt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. classic-t-shirt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Combobox
                      options={categories.map(c => ({ label: c.name, value: c.id }))}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Search categories..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-12 w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 transition-colors"
                    >
                      <option value="MEN">Men</option>
                      <option value="WOMEN">Women</option>
                      <option value="UNISEX">Unisex</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className="flex min-h-[120px] w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 transition-colors placeholder:text-slate-400"
                    placeholder="Product details..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex-1 flex items-center justify-between rounded-2xl border border-white/20 p-4 bg-white/20">
                  <FormLabel className="m-0">Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex-1 flex items-center justify-between rounded-2xl border border-white/20 p-4 bg-white/20">
                  <FormLabel className="m-0">Featured</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Product Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Product Gallery (Additional Images)</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {form.watch('images')?.map((url: string, idx: number) => (
                <div key={idx} className="relative group">
                  <ImageUpload
                    value={url}
                    onChange={(newUrl) => {
                      const currentImages = form.getValues('images') || [];
                      const updated = [...currentImages];
                      updated[idx] = newUrl;
                      form.setValue('images', updated);
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const currentImages = form.getValues('images') || [];
                      form.setValue('images', currentImages.filter((_, i) => i !== idx));
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="h-[150px] border-dashed"
                onClick={() => {
                  const currentImages = form.getValues('images') || [];
                  form.setValue('images', [...currentImages, '']);
                }}
              >
                <Plus className="h-6 w-6 mr-2" />
                Add Image
              </Button>
            </div>
          </div>

          {/* Variants Section */}
          <div className="space-y-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Variants</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ sku: '', size: '', color: '', price: 0, discountPrice: 0, stock: 0, isActive: true })}
                className="rounded-full border-pink-200 dark:border-pink-900/50 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all font-bold"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Variant
              </Button>
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all p-6 space-y-5 group"
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold shadow">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          Product Variant
                        </h4>
                        <p className="text-xs text-slate-400">
                          Configure variant details
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* BASIC INFO */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.sku`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">
                            SKU
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="SKU"
                              className="rounded-xl focus-visible:ring-pink-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.size`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">
                            Size
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="S / M / L"
                              className="rounded-xl focus-visible:ring-pink-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.color`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">
                            Color
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Black"
                              className="rounded-xl focus-visible:ring-pink-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.hexColor`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">
                            Hex Color
                          </FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input
                                {...field}
                                placeholder="#000000"
                                className="rounded-xl focus-visible:ring-pink-500 flex-1 uppercase"
                                maxLength={7}
                              />
                              <div 
                                className="h-10 w-10 rounded-xl border border-slate-200 shrink-0 shadow-sm"
                                style={{ backgroundColor: field.value || 'transparent' }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">
                            Price
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              placeholder="0.00"
                              className="rounded-xl focus-visible:ring-pink-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.discountPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">
                            Discount Price
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              placeholder="0.00"
                              className="rounded-xl focus-visible:ring-pink-500 border-pink-200 bg-pink-50/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.stock`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">
                            Stock
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              placeholder="0"
                              disabled={!isNew && !!form.getValues(`variants.${index}.id` as any)}
                              className={`rounded-xl focus-visible:ring-pink-500 ${!isNew && !!form.getValues(`variants.${index}.id` as any) ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* DIVIDER */}
                  <div className="border-t border-slate-100" />

                  {/* IMAGE + STATUS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.imageUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-500">
                            Variant Image
                          </FormLabel>
                          <FormControl>
                            <div className="rounded-2xl border border-dashed border-slate-300 p-4 hover:border-pink-400 transition">
                              <ImageUpload
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variants.${index}.isActive`}
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 bg-slate-50">
                          <div>
                            <FormLabel className="text-sm font-bold text-slate-700">
                              Active Variant
                            </FormLabel>
                            <p className="text-xs text-slate-400">
                              Enable or disable this variant
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
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
