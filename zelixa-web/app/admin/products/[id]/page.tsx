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
import { Plus, Trash2, Folders, Palette, Layers, Box, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { ImageUpload } from '@/components/ui/image-upload';
import { motion } from 'framer-motion';

const variantDetailSchema = z.object({
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

const variantGroupSchema = z.object({
  groupName: z.string().min(1, "Group Name is required"),
  details: z.array(variantDetailSchema).min(1),
});

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  categoryId: z.coerce.number().min(1),
  gender: z.enum(['MEN', 'WOMEN', 'UNISEX']).default('UNISEX'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isTopProduct: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isRecommended: z.boolean().default(false),
  imageUrl: z.string().optional(),
  images: z.array(z.string()).default([]),
  variantGroups: z.array(variantGroupSchema).min(1),
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
      isTopProduct: false,
      isBestSeller: false,
      isRecommended: false,
      imageUrl: '',
      images: [],
      variantGroups: [{ groupName: 'Default Style', details: [{ sku: '', size: '', color: '', hexColor: '', price: 0.01, discountPrice: 0, stock: 0, isActive: true, imageUrl: '' }] }],
    },
  });

  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({
    control: form.control,
    name: 'variantGroups',
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
            isTopProduct: data.isTopProduct,
            isBestSeller: data.isBestSeller,
            isRecommended: data.isRecommended,
            imageUrl: data.imageUrl || '',
            images: data.images || [],
            variantGroups: (() => {
              // Group by groupName
              const groups: Record<string, any[]> = {};
              data.variants.forEach(v => {
                const groupName = v.groupName || 'Other';
                if (!groups[groupName]) groups[groupName] = [];
                groups[groupName].push({
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
                });
              });
              return Object.entries(groups).map(([name, details]) => ({
                groupName: name,
                details
              }));
            })(),
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
      // Flatten variantGroups back to variants for the API
      const flatVariants: any[] = [];
      values.variantGroups.forEach((group: any) => {
        group.details.forEach((detail: any) => {
          flatVariants.push({
            ...detail,
            groupName: group.groupName,
            price: Number(detail.price),
            discountPrice: Number(detail.discountPrice),
            stock: Number(detail.stock),
          });
        });
      });

      const payload = {
        ...values,
        variants: flatVariants
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
          <div className="space-y-6 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-neutral-900 rounded-2xl shadow-xl text-white">
                  <Folders size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-neutral-900">Variant Groups</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Organize by Style or Model</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => appendGroup({
                  groupName: 'New Style',
                  details: [{ sku: '', size: '', color: '', hexColor: '#000000', price: 0, stock: 0, isActive: true }]
                })}
                className="rounded-2xl border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-50 font-black px-6"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Style Group
              </Button>
            </div>

            <div className="space-y-8">
              {groupFields.map((group, groupIndex) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={group.id}
                  className="relative rounded-[3rem] border-2 border-slate-100 bg-white p-8 space-y-8 shadow-xl shadow-neutral-100 group/group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 font-black">
                        {groupIndex + 1}
                      </div>
                      <FormField
                        control={form.control}
                        name={`variantGroups.${groupIndex}.groupName`}
                        render={({ field }) => (
                          <FormItem className="flex-1 max-w-sm">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Group Name (e.g. Blos Mini)"
                                className="border-none bg-neutral-50 rounded-2xl h-14 text-lg font-black focus-visible:ring-0 placeholder:text-neutral-300"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeGroup(groupIndex)}
                      className="text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-2xl opacity-0 group-hover/group:opacity-100 transition-all h-12 w-12"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>

                  <div className="rounded-[2rem] border-2 border-neutral-50 overflow-hidden">
                    <VariantDetailTable groupIndex={groupIndex} form={form} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Form>
    </CrudForm>
  );
}

// Helper component for hierarchical variant rows
function VariantDetailTable({ groupIndex, form }: { groupIndex: number, form: any }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `variantGroups.${groupIndex}.details`
  });

  return (
    <div className="bg-neutral-50/30 p-6 space-y-4">
      <div className="hidden md:grid grid-cols-8 gap-4 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
        <div className="col-span-1">SKU</div>
        <div>Size</div>
        <div className="col-span-1">Color Name</div>
        <div className="text-center pr-4">Hex Color</div>
        <div className="col-span-1">Price</div>
        <div>Stock</div>
        <div>Status</div>
        <div className="text-right pr-4">Action</div>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 hover:border-pink-200 transition-colors">
            <div className="col-span-1">
              <FormField
                control={form.control}
                name={`variantGroups.${groupIndex}.details.${index}.sku`}
                render={({ field }) => (
                  <Input {...field} placeholder="SKU" className="rounded-xl bg-neutral-50/50 border-none h-11 text-xs font-bold" />
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name={`variantGroups.${groupIndex}.details.${index}.size`}
                render={({ field }) => (
                  <Input {...field} placeholder="Size" className="rounded-xl bg-neutral-50/50 border-none h-11 text-xs font-bold" />
                )}
              />
            </div>
            <div className="col-span-1">
              <FormField
                control={form.control}
                name={`variantGroups.${groupIndex}.details.${index}.color`}
                render={({ field }) => (
                  <Input {...field} placeholder="e.g. Red" className="rounded-xl bg-neutral-50/50 border-none h-11 text-[11px] font-bold" />
                )}
              />
            </div>
            <div className="flex justify-center">
              <FormField
                control={form.control}
                name={`variantGroups.${groupIndex}.details.${index}.hexColor`}
                render={({ field }) => (
                  <div className="relative h-11 w-11 shrink-0 group">
                    <input
                      type="color"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                      value={field.value || '#000000'}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <div
                      className="h-full w-full rounded-xl border-2 border-slate-100 shadow-sm transition-transform group-hover:scale-105"
                      style={{ backgroundColor: field.value || '#ffffff' }}
                    />
                  </div>
                )}
              />
            </div>
            <div className="col-span-1">
              <FormField
                control={form.control}
                name={`variantGroups.${groupIndex}.details.${index}.price`}
                render={({ field }) => (
                  <Input type="number" {...field} className="rounded-xl bg-neutral-50/50 border-none h-11 text-xs font-bold" />
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name={`variantGroups.${groupIndex}.details.${index}.stock`}
                render={({ field }) => (
                  <Input type="number" {...field} className="rounded-xl bg-neutral-50/50 border-none h-11 text-xs font-bold" />
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name={`variantGroups.${groupIndex}.details.${index}.isActive`}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
            <div className="flex justify-end pr-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                className="text-pink-500 hover:text-red-600 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ sku: '', size: '', color: '', hexColor: '#000000', price: 0, stock: 0, isActive: true })}
          className="w-full py-4 border-2 border-dashed border-neutral-100 rounded-[1.5rem] text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:border-pink-200 hover:text-pink-500 hover:bg-white transition-all"
        >
          <Plus size={14} className="inline mr-2" /> Add Selection Row
        </button>
      </div>
    </div>
  );
}
