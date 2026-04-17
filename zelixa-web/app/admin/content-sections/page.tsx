'use client';

import { useEffect, useState, useRef } from 'react';
import { Layout, Plus, Edit, Trash2, FileJson, ArrowLeft } from 'lucide-react';
import { ContentService, } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CrudTable } from '@/components/admin/crud-table';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ContentSection } from '@/types/content';

import { Suspense } from 'react';

function ContentSectionsContent() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get('type');
  const platformFilter = searchParams.get('platform');
  const isMounted = useRef(false);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const response = await ContentService.getAll(0, 100, platformFilter || undefined);

      const sectionsData = (response as any).content || response;
      let filtered = Array.isArray(sectionsData) ? sectionsData : [];

      if (typeFilter) {
        filtered = filtered.filter(s => s.type === typeFilter);
      }

      setSections(filtered);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch sections', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [typeFilter, platformFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this content section?')) return;
    try {
      await ContentService.delete(id);
      toast({ title: 'Success', description: 'Section deleted' });
      fetchSections();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete section', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<ContentSection>[] = [
    {
      accessorKey: 'title',
      header: 'Section Title',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
            <FileJson size={14} />
          </div>
          <span className="font-bold text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-pink-600 transition-colors">{row.original.title}</span>
        </div>
      )
    },
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: ({ row }) => (
        <Badge variant="outline" className={cn(
          "text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full",
          row.original.platform === 'WEB' ? 'bg-violet-50 text-violet-600 border-violet-100' :
            row.original.platform === 'MOBILE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              'bg-slate-50 text-slate-600 border-slate-100'
        )}>
          {row.original.platform || 'WEB'}
        </Badge>
      )
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <Badge variant="outline" className="font-mono text-[10px]">{row.original.type}</Badge>
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'pink' : 'secondary'} className="rounded-full uppercase text-[10px] px-3 font-bold tracking-widest">
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  const handleEdit = (section: ContentSection) => {
    router.push(`/admin/content-sections/${section.id}?type=${typeFilter || section.type}${platformFilter ? `&platform=${platformFilter}` : ''}`);
  };

  const handleAdd = () => {
    router.push(`/admin/content-sections/new?${typeFilter ? `type=${typeFilter}` : ''}${platformFilter ? `&platform=${platformFilter}` : ''}`);
  };

  const handleToggleStatus = async (section: ContentSection) => {
    try {
      await ContentService.update(section.id!, { ...section, isActive: !section.isActive });
      toast({ title: 'Success', description: 'Section status updated' });
      fetchSections();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const getPageTitle = () => {
    const platformPrefix = platformFilter === 'MOBILE' ? 'Mobile ' : platformFilter === 'WEB' ? 'Web ' : '';
    let typeTitle = 'Content Sections';
    
    switch (typeFilter) {
      case 'HERO_CAROUSEL': typeTitle = 'Hero Carousel'; break;
      case 'CURATED_PRODUCTS': typeTitle = 'Curated Selections'; break;
      case 'RECOMMENDED_PRODUCTS': typeTitle = 'Recommended for You'; break;
      case 'WHY_SHOP': typeTitle = 'Why Shop Perks'; break;
      case 'SHOP_THE_LOOK': typeTitle = 'Shop the Look'; break;
    }
    
    return `${platformPrefix}${typeTitle}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(platformFilter === 'MOBILE' ? '/admin/content/mobile' : '/admin/content/web')}
            className="rounded-full hover:bg-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-12 w-12 rounded-3xl bg-pink-500/10 flex items-center justify-center text-pink-500 shadow-inner">
            <Layout className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">{getPageTitle()}</h1>
            <p className="text-slate-500 text-sm font-bold">Manage storefront sections and items.</p>
          </div>
        </div>
      </div>

      <CrudTable
        data={sections}
        columns={columns}
        searchKey="sections"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={(item) => handleDelete(item.id!)}
        isLoading={isLoading}
      />
    </div>
  );
}

export default function ContentSectionsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    }>
      <ContentSectionsContent />
    </Suspense>
  );
}
