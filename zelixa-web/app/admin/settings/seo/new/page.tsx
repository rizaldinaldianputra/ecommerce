'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SeoService, SeoConfig } from '@/services/seo.service';
import { useToast } from '@/hooks/use-toast';
import { CrudForm } from '@/components/admin/crud-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const seoSchema = z.object({
  pageName: z.string().min(2, 'Page Name is required'),
  scriptCode: z.string().optional(),
});

type SeoFormValues = z.infer<typeof seoSchema>;

export default function NewSeoConfigPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      pageName: '',
      scriptCode: '',
    },
  });

  const onSubmit = async (values: SeoFormValues) => {
    setIsLoading(true);
    try {
      await SeoService.save(values);
      toast({ title: 'Success', description: 'SEO Configuration created' });
      router.push('/admin/settings/seo');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to create config', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CrudForm
      title="Create SEO Configuration"
      subtitle="Define a new page mapping and header script block."
      onSubmit={form.handleSubmit(onSubmit)}
      isLoading={isLoading}
    >
      <Form {...form}>
        <div className="space-y-10">
          {/* Target Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-pink-500/80 mb-6">Target Configuration</h3>
            
            <FormField
              control={form.control}
              name="pageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Target Page Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. HOME, SHOP, GLOBAL, CATEGORY" 
                      {...field} 
                      className="h-14 rounded-3xl border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/50 font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tighter"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold uppercase tracking-widest" />
                </FormItem>
              )}
            />
          </div>

          {/* Script Content */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-pink-500/80 mb-6">Header Optimization</h3>
            
            <FormField
              control={form.control}
              name="scriptCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Header Script / URL Code</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paste your <script>, <link> or <meta> tags here. Keep it clean and optimized." 
                      {...field} 
                      className="min-h-[350px] rounded-[2rem] border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/50 font-mono text-[13px] leading-relaxed resize-none p-6 shadow-inner focus:ring-1 focus:ring-pink-500/30 transition-all placeholder:text-slate-400" 
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold uppercase tracking-widest" />
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>
    </CrudForm>
  );
}
