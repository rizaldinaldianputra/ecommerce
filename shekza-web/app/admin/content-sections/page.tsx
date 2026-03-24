'use client';

import { useEffect, useState } from 'react';
import { Layout, Plus, Edit, Trash2, FileJson } from 'lucide-react';
import { ContentService, ContentSection } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CrudTable } from '@/components/admin/crud-table';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ContentSectionsPage() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get('type');

  const fetchSections = async () => {
    try {
      const response = typeFilter 
        ? await ContentService.getSectionsByType(typeFilter)
        : await ContentService.getAll();
      
      const sectionsData = (response as any).content || response;
      setSections(Array.isArray(sectionsData) ? sectionsData : []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch sections', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [typeFilter]);

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
    router.push(`/admin/content-sections/${section.id}?type=${typeFilter || section.type}`);
  };

  const handleAdd = () => {
    router.push(`/admin/content-sections/new${typeFilter ? `?type=${typeFilter}` : ''}`);
  };

  const getPageTitle = () => {
    switch (typeFilter) {
      case 'HERO_CAROUSEL': return 'Hero Carousel';
      case 'CURATED_PRODUCTS': return 'Curated Selections';
      case 'RECOMMENDED_PRODUCTS': return 'Recommended for You';
      case 'WHY_SHOP': return 'Why Shop Perks';
      case 'SHOP_THE_LOOK': return 'Shop the Look';
      default: return 'Content Sections';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
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
        onDelete={(item) => handleDelete(item.id!)}
      />
    </div>
  );
}
