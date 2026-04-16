'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CrudForm } from '@/components/admin/crud-form';
import { BrandService } from '@/services/brand.service';
import { Brand } from '@/types/brand';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ui/image-upload';

const brandSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

type BrandFormValues = z.infer<typeof brandSchema>;

export default function BrandEditPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isNew = params.id === 'new';

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      logoUrl: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (!isNew && params.id) {
      const loadBrand = async () => {
        try {
          const data = await BrandService.getById(Number(params.id));
          form.reset({
            name: data.name,
            slug: data.slug,
            description: data.description || '',
            logoUrl: data.logoUrl || '',
            isActive: data.isActive,
          });
        } catch (error) {
          toast({ title: 'Error', description: 'Failed to load brand data', variant: 'destructive' });
        }
      };
      loadBrand();
    }
  }, [isNew, params.id, form]);

  // Automated Slug Generation
  const name = form.watch('name');
  useEffect(() => {
    if (isNew || !form.getValues('slug')) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      form.setValue('slug', slug, { shouldValidate: true });
    }
  }, [name, form, isNew]);

  const onSubmit = async (values: BrandFormValues) => {
    setIsLoading(true);
    try {
      if (isNew) {
        await BrandService.create(values as any);
        toast({ title: 'Success', description: 'Brand created' });
      } else {
        await BrandService.update(Number(params.id), values as any);
        toast({ title: 'Success', description: 'Brand updated' });
      }
      router.push('/admin/brands');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save brand', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CrudForm
      title={isNew ? 'New Brand' : 'Edit Brand'}
      onSubmit={form.handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      <Form {...form}>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Nike" {...field} />
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
                    <Input placeholder="e.g. nike" {...field} />
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
                    placeholder="Brand details..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Logo</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-2xl border border-white/20 p-4 bg-white/20">
                <FormLabel className="m-0 text-slate-700">Display this brand</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </CrudForm>
  );
}
