'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CrudForm } from '@/components/admin/crud-form';
import { CategoryService } from '@/services/category.service';
import { Category } from '@/types/category';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';

const categorySchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  slug: z.string().min(2, { message: 'Slug must be at least 2 characters' }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoryEditPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isNew = params.id === 'new';

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (!isNew && params.id) {
      const fetchCategory = async () => {
        try {
          const data = await CategoryService.getById(Number(params.id));
          form.reset({
            name: data.name,
            slug: data.slug,
            description: data.description || '',
            imageUrl: data.imageUrl || '',
            isActive: !!data.isActive,
          });
        } catch (error) {
          toast({ title: 'Error', description: 'Failed to fetch category', variant: 'destructive' });
        }
      };
      fetchCategory();
    }
  }, [isNew, params.id]);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      if (isNew) {
        await CategoryService.create(values as any);
        toast({ title: 'Success', description: 'Category created' });
      } else {
        await CategoryService.update(Number(params.id), values as any);
        toast({ title: 'Success', description: 'Category updated' });
      }
      router.push('/admin/categories');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save category', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CrudForm 
      title={isNew ? 'New Category' : 'Edit Category'} 
      subtitle={isNew ? 'Create a new product category' : 'Update category details'}
      onSubmit={form.handleSubmit(onSubmit)}
      isLoading={isLoading}
      submitLabel={isNew ? 'Create Category' : 'Save Changes'}
    >
      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-slate-300">Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Electronics" className="rounded-xl h-12" {...field} />
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
                <FormLabel className="text-slate-700 dark:text-slate-300">Slug</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. electronics" className="rounded-xl h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-slate-700 dark:text-slate-300">Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe what this category is for..." 
                    className="min-h-[120px]"
                    {...field} 
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
              <FormItem className="md:col-span-2">
                <FormLabel className="text-slate-700 dark:text-slate-300">Category Image</FormLabel>
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
              <FormItem className="flex items-center justify-between rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-4 bg-slate-50/50 dark:bg-slate-900/50 md:col-span-2">
                <div className="space-y-0.5">
                  <FormLabel className="text-slate-700 dark:text-slate-300">Active Status</FormLabel>
                  <p className="text-xs text-slate-500">Visible to customers in the storefront</p>
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
      </Form>
    </CrudForm>
  );
}
