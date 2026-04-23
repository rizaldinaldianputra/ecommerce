'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Monitor, Smartphone, LayoutGrid, Plus } from 'lucide-react';
import { ContentService, ContentSection } from '@/services/content.service';
import { CrudTable } from '@/components/admin/crud-table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ContentSectionListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [platform, setPlatform] = useState<'WEB' | 'MOBILE'>('WEB');

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const data = await ContentService.getSections(platform);
      setSections(data);
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data section', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [platform]);

  const handleDelete = async (section: ContentSection) => {
    if (!confirm(`Hapus section "${section.title || section.type}"? Semua item di dalamnya akan terpengaruh.`)) return;
    try {
      await ContentService.deleteSection(section.id!);
      toast({ title: 'Berhasil', description: 'Section dihapus' });
      fetchSections();
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus section', variant: 'destructive' });
    }
  };

  const handleToggleStatus = async (section: ContentSection) => {
    try {
      await ContentService.updateSection(section.id!, { ...section, isActive: !section.isActive });
      toast({ title: 'Berhasil', description: 'Status updated' });
      fetchSections();
    } catch {
      toast({ title: 'Error', description: 'Gagal update status', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<ContentSection>[] = [
    {
      accessorKey: 'type',
      header: 'Type / ID',
      cell: ({ row }) => (
        <code className="bg-slate-100 dark:bg-white/5 px-2 py-1 rounded text-[10px] font-bold text-pink-600">
          {row.original.type}
        </code>
      )
    },
    {
      accessorKey: 'title',
      header: 'Section Details',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
            {row.original.title || 'Untitled Section'}
          </span>
          {row.original.subtitle && (
            <span className="text-[10px] text-slate-400 font-bold italic line-clamp-1">
              {row.original.subtitle}
            </span>
          )}
        </div>
      )
    },
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: ({ row }) => {
        const p = row.original.platform || 'WEB';
        return (
          <Badge variant="outline" className="rounded-full gap-1.5 font-bold text-[9px] uppercase tracking-widest py-0.5">
            {p === 'MOBILE' ? <Smartphone size={10} /> : <Monitor size={10} />}
            {p}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'items',
      header: 'Items',
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono font-bold">
          {row.original.items?.length || 0} items
        </Badge>
      )
    },
    {
      accessorKey: 'displayOrder',
      header: 'Order',
      cell: ({ row }) => <span className="font-mono font-bold text-slate-400">#{row.original.displayOrder}</span>
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'pink' : 'secondary'} className="rounded-full px-3 font-black text-[9px] uppercase tracking-widest">
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">
            Storefront <span className="text-pink-600">Sections</span>
          </h1>
          <p className="text-slate-400 font-bold mt-2 text-sm max-w-md">
            Kelola pengelompokan konten (Sections) untuk Website dan Mobile App.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10">
          <Button
            variant={platform === 'WEB' ? 'secondary' : 'ghost'}
            onClick={() => setPlatform('WEB')}
            className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9"
          >
            <Monitor size={14} className="mr-2" /> Web
          </Button>
          <Button
            variant={platform === 'MOBILE' ? 'secondary' : 'ghost'}
            onClick={() => setPlatform('MOBILE')}
            className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9"
          >
            <Smartphone size={14} className="mr-2" /> Mobile
          </Button>
        </div>
      </div>

      <CrudTable
        data={sections}
        columns={columns}
        searchKey="title"
        onAdd={() => router.push('/admin/content-sections/new')}
        onEdit={(section) => router.push(`/admin/content-sections/${section.id}`)}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading}
      />
    </div>
  );
}
