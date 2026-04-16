'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { FileJson, ArrowLeft, Smartphone, Plus } from 'lucide-react';
import { ContentService, ContentSection } from '@/services/content.service';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CrudTable } from '@/components/admin/crud-table';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

const TYPE_LABELS: Record<string, { label: string; description: string }> = {
  MOBILE_PROMO:     { label: 'Promo Carousel',       description: 'Banner slideshow gradient di home app mobile' },
  FLASH_SALE_MOBILE:{ label: 'Flash Sale Mobile',     description: 'Strip ProductCard diskon di home mobile' },
  TRENDING_LIST:    { label: 'Trending Now',          description: 'Kartu trending horizontal dengan foto & kategori' },
  FEATURED_MOBILE:  { label: 'Featured Products',     description: '2-column grid produk unggulan di mobile' },
  WHY_SHOP:         { label: 'Why Shop',              description: 'Keunggulan berbelanja — icon + teks' },
  CURATED_PRODUCTS: { label: 'Curated Selections',    description: 'Produk pilihan editorial di home mobile' },
};

interface PageProps {
  params: Promise<{ type: string }>;
}

export default function MobileContentTypeListPage({ params }: PageProps) {
  const { type } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const typeInfo = TYPE_LABELS[type] || { label: type, description: 'Mobile content section' };

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const data = await ContentService.getByTypeAndPlatform(type, 'MOBILE');
      setSections(data);
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data section', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSections(); }, [type]);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus section ini?')) return;
    try {
      await ContentService.delete(id);
      toast({ title: 'Berhasil', description: 'Section dihapus' });
      fetchSections();
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus section', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<ContentSection>[] = [
    {
      accessorKey: 'title',
      header: 'Section Title',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <FileJson size={14} />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">{row.original.title}</span>
        </div>
      )
    },
    {
      accessorKey: 'displayOrder',
      header: 'Order',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-slate-500">#{row.original.displayOrder}</span>
      )
    },
    {
      id: 'items',
      header: 'Items',
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-[10px]">
          {row.original.items?.length ?? 0} items
        </Badge>
      )
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/content/mobile')}
            className="rounded-full hover:bg-white dark:hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">📱 MOBILE</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{typeInfo.label}</h1>
            <p className="text-slate-400 text-xs font-semibold">{typeInfo.description}</p>
          </div>
        </div>
        <Link
          href={`/admin/content/mobile/${type}/new`}
          className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95"
        >
          <Plus size={14} /> Tambah Section
        </Link>
      </div>

      <CrudTable
        data={sections}
        columns={columns}
        searchKey="sections"
        onAdd={() => router.push(`/admin/content/mobile/${type}/new`)}
        onEdit={(section) => router.push(`/admin/content/mobile/${type}/${section.id}`)}
        onDelete={(section) => handleDelete(section.id!)}
      />
    </div>
  );
}
