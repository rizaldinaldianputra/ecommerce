'use client';

import { useEffect, useState, useRef } from 'react';
import { Image as ImageIcon, Plus, Edit, Trash2, Eye, LayoutPanelTop, MonitorPlay, Layers } from 'lucide-react';
import { ContentService, ContentSection } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CrudTable } from '@/components/admin/crud-table';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

export default function BannersPage() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const isMounted = useRef(false);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      // Fetch all sections and filter for Banner types
      const response = await ContentService.getAll();
      const allSections = (response as any).content || response || [];
      const bannerSections = allSections.filter((s: ContentSection) => 
        s.type === 'BANNER' || s.type === 'HERO_CAROUSEL'
      );
      setSections(bannerSections);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch banners', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted.current) return;
    fetchBanners();
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banner section?')) return;
    try {
      await ContentService.delete(id);
      toast({ title: 'Success', description: 'Banner section deleted' });
      fetchBanners();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete section', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<ContentSection>[] = [
    {
      accessorKey: 'title',
      header: 'Campaign Title',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors uppercase tracking-tight">{row.original.title}</span>
          <span className="text-[10px] text-slate-400 font-mono tracking-tight">ID: {row.original.id}</span>
        </div>
      )
    },
    {
      accessorKey: 'type',
      header: 'Format',
      cell: ({ row }) => {
          const isCarousel = row.original.type === 'HERO_CAROUSEL';
          return (
            <Badge variant={isCarousel ? 'pink' : 'secondary'} className="rounded-full font-black uppercase text-[9px] tracking-widest px-3 py-1 flex items-center gap-2 w-fit">
              {isCarousel ? <MonitorPlay className="h-3 w-3" /> : <LayoutPanelTop className="h-3 w-3" />}
              {row.original.type.replace('_', ' ')}
            </Badge>
          );
      }
    },
    {
       accessorKey: 'items',
       header: 'Slides',
       cell: ({ row }) => (
         <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
           <Layers className="h-3.5 w-3.5" />
           {row.original.items?.length || 0} Assets
         </div>
       )
    },
    {
      accessorKey: 'isActive',
      header: 'Visibility',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'pink' : 'outline'} className="rounded-full uppercase text-[10px] px-3 font-bold tracking-widest">
          {row.original.isActive ? 'Live' : 'Hidden'}
        </Badge>
      )
    }
  ];

  const handleToggleStatus = async (section: ContentSection) => {
    try {
      await ContentService.update(section.id!, { ...section, isActive: !section.isActive });
      toast({ title: 'Success', description: 'Banner visibility updated' });
      fetchBanners();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update visibility', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-3xl bg-pink-500/10 flex items-center justify-center text-pink-500 shadow-inner">
             <ImageIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Banner Management</h1>
            <p className="text-slate-500 text-sm font-bold">Manage storefront banners and hero carousels for the mobile app.</p>
          </div>
        </div>
        <Button onClick={handleAdd} className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl shadow-lg shadow-pink-500/20 font-bold uppercase text-xs h-11 px-6 flex items-center gap-2 group transition-all">
          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
          Create Banner Section
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <CrudTable 
          data={sections} 
          columns={columns} 
          searchKey="banners"
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={(item) => handleDelete(item.id!)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
