'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentService } from '@/services/content.service';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft, Save, Loader2, LayoutGrid,
  Monitor, Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sectionSchema = z.object({
  id: z.number().optional(),
  platform: z.enum(['WEB', 'MOBILE', 'ALL']),
  type: z.string().min(1, 'Type is required'),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  displayOrder: z.number().optional().nullable(),
  isActive: z.boolean(),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

interface ContentSectionFormProps {
  id?: string;
}

export default function ContentSectionForm({ id }: ContentSectionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isNew = !id || id === 'new';

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema) as any,
    defaultValues: {
      platform: 'WEB',
      type: '',
      title: '',
      subtitle: '',
      displayOrder: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (!isNew && id) {
        setIsLoading(true);
        try {
          const data = await ContentService.getSectionById(id);
          form.reset(data);
        } catch {
          toast({ title: 'Error', description: 'Gagal memuat data section', variant: 'destructive' });
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadData();
  }, [id, isNew]);

  const onSubmit: SubmitHandler<SectionFormValues> = async (values) => {
    setIsLoading(true);
    try {
      if (isNew) {
        await ContentService.createSection(values);
        toast({ title: 'Berhasil', description: 'Section berhasil dibuat' });
      } else {
        await ContentService.updateSection(Number(id), values);
        toast({ title: 'Berhasil', description: 'Section berhasil diupdate' });
      }
      router.push('/admin/content-sections');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Gagal menyimpan section', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-white dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {isNew ? 'Tambah Section Baru' : 'Edit Section'}
            </h1>
            <p className="text-slate-400 text-xs font-semibold">
              {isNew ? 'Buat grup konten baru untuk storefront.' : `Mengedit section ID: ${id}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/content-sections')}
            className="rounded-full font-bold text-xs uppercase"
          >
            Batal
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="rounded-full bg-pink-500 hover:bg-pink-600 text-white font-black uppercase tracking-widest px-8 shadow-lg shadow-pink-500/20"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Simpan Section
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
          <div className="bg-white/60 dark:bg-slate-900/60 p-8 rounded-[3rem] border border-white/20 shadow-sm backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Platform Selection */}
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-2xl h-12 border-none bg-slate-100 dark:bg-white/5 font-bold">
                          <SelectValue placeholder="Pilih Platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-white/20 backdrop-blur-xl">
                        <SelectItem value="WEB" className="rounded-xl font-bold">WEB (Desktop/Browser)</SelectItem>
                        <SelectItem value="MOBILE" className="rounded-xl font-bold">MOBILE (App/Flutter)</SelectItem>
                        <SelectItem value="ALL" className="rounded-xl font-bold">ALL PLATFORMS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type / Identifier */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type (Identifier)</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12 rounded-2xl border-none bg-slate-100 dark:bg-white/5 font-semibold" placeholder="CONTOH: HERO_CAROUSEL, NEW_ARRIVALS" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Judul Section</FormLabel>
                    <FormControl>
                      <Input {...field as any} className="h-12 rounded-2xl border-none bg-slate-100 dark:bg-white/5 font-semibold" placeholder="Judul yang tampil di UI" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subtitle */}
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subtitle</FormLabel>
                    <FormControl>
                      <Input {...field as any} className="h-12 rounded-2xl border-none bg-slate-100 dark:bg-white/5 font-semibold" placeholder="Keterangan tambahan" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Display Order */}
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Display Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        className="h-12 rounded-2xl border-none bg-slate-100 dark:bg-white/5 font-bold" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Status */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-white/5 p-4 mt-2">
                    <div>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Active Status</FormLabel>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Tampilkan section ini?</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
