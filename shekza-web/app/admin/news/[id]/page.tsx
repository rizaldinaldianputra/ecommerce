'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { CrudForm } from '@/components/admin/crud-form';
import { NewsService, News } from '@/services/news.service';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import { Newspaper, Type, Link as LinkIcon, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';

const newsSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(3, 'Slug is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

type NewsFormValues = z.infer<typeof newsSchema>;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NewsEditPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isNew = id === 'new';

  const form = useForm<any>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      imageUrl: '',
      isActive: true,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (!isNew) {
        try {
          const data = await NewsService.getById(id);
          form.reset({
            title: data.title,
            slug: data.slug,
            content: data.content,
            imageUrl: data.imageUrl || '',
            isActive: data.isActive,
          });
        } catch (error) {
          toast({ title: 'Error', description: 'Failed to load news article', variant: 'destructive' });
        }
      }
    };
    loadData();
  }, [id, isNew]);

  const onSubmit = async (values: NewsFormValues) => {
    setIsLoading(true);
    try {
      if (isNew) {
        await NewsService.create(values as any);
        toast({ title: 'Success', description: 'Article published' });
      } else {
        await NewsService.update(id, values as any);
        toast({ title: 'Success', description: 'Article updated' });
      }
      router.push('/admin/news');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save article', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CrudForm
      title={isNew ? 'New Article' : 'Edit Article'}
      onSubmit={form.handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      <Form {...form}>
        <div className="max-w-4xl space-y-8">
          {/* Main Content Card */}
          <div className="bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 space-y-6 shadow-sm">
             <div className="flex items-center gap-3 mb-2">
               <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                  <Type size={24} />
               </div>
               <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 dark:text-white">Content Editor</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Article Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a catchy title..." {...field} className="h-12 rounded-2xl border-slate-200 focus:ring-pink-500 font-bold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 flex gap-2 items-center">
                      <LinkIcon size={10} /> Permalink Slug
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="article-url-slug" {...field} className="h-12 rounded-2xl border-slate-200 focus:ring-pink-500 font-medium font-mono text-sm bg-slate-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Main Content (Markdown supported)</FormLabel>
                    <FormControl>
                      <textarea 
                        {...field} 
                        className="flex min-h-[300px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 font-medium leading-relaxed" 
                        placeholder="Write your story here..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Media & Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Thumbnail */}
             <div className="md:col-span-2 bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                      <ImageIcon size={24} />
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-slate-900 dark:text-white">Cover Image</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
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
             </div>

             {/* Visibility */}
             <div className="md:col-span-1 bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 space-y-6 shadow-sm h-fit">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                      <CheckCircle2 size={24} />
                  </div>
                   <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white">Publish Settings</h3>
                </div>

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 bg-slate-50/50">
                      <FormLabel className="text-xs font-bold text-slate-700 uppercase tracking-tight">Active</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100">
                   <p className="text-[10px] text-pink-600 font-bold uppercase leading-tight">
                     When inactive, this article will be hidden from the public news feed.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </Form>
    </CrudForm>
  );
}
