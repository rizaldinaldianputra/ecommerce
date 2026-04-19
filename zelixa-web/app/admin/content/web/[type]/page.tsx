'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { FileJson, ArrowLeft, Layout, Plus, Monitor } from 'lucide-react';
import { ContentService } from '@/services/content.service';
import { ContentItem } from '@/types/content';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CrudTable } from '@/components/admin/crud-table';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

// Human-readable labels for each type
const TYPE_LABELS: Record<string, { label: string; description: string }> = {
  HERO_CAROUSEL:       { label: 'Hero Carousel',         description: 'Banner slideshow utama homepage web' },
  FLASH_SALE_WEB:      { label: 'Flash Sale Web',         description: 'Promo kilat dengan countdown timer di web' },
  FEATURED_PRODUCTS:   { label: 'Featured Products Web',  description: 'Grid produk unggulan dengan tab filter' },
  RECOMMENDED_PRODUCTS:{ label: 'Recommendations Web',    description: 'Carousel rekomendasi produk horizontal' },
  SHOP_THE_LOOK:       { label: 'Shop the Look',          description: 'Grid foto social-style hover produk' },
  BRANDS_SECTION:      { label: 'Brands Section',         description: 'Marquee logo brand partner di web' },
  TESTIMONIALS:        { label: 'Testimonials',           description: 'Grid ulasan pelanggan di homepage' },
  NEWSLETTER:          { label: 'Newsletter',             description: 'Konfigurasi section newsletter' },
};

interface PageProps {
  params: Promise<{ type: string }>;
}

export default function WebContentTypeListPage({ params }: PageProps) {
  const { type } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const typeInfo = TYPE_LABELS[type] || { label: type, description: 'Web storefront items' };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await ContentService.getItemsByType(type, 'WEB', false);
      setItems(data);
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data item', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [type]);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus item ini?')) return;
    try {
      await ContentService.deleteItem(id);
      toast({ title: 'Berhasil', description: 'Item dihapus' });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus item', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<ContentItem>[] = [
    {
      accessorKey: 'title',
      header: 'Item Title',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.imageUrl ? (
            <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50">
              <img src={row.original.imageUrl} alt="" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 flex-shrink-0">
              <FileJson size={14} />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">{row.original.title || 'Untitled'}</span>
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{row.original.subtitle}</span>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Date Created',
      cell: ({ row }) => (
        <span className="text-xs font-semibold text-slate-500">
          {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : '-'}
        </span>
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/content/web')}
            className="rounded-full hover:bg-white dark:hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-11 w-11 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600 shadow-sm flex-shrink-0">
            <Monitor className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-violet-500 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded-full">🖥 WEB</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{typeInfo.label}</h1>
            <p className="text-slate-400 text-xs font-semibold">{typeInfo.description}</p>
          </div>
        </div>
        <Link
          href={`/admin/content/web/${type}/new`}
          className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95"
        >
          <Plus size={14} /> Tambah Item
        </Link>
      </div>

      <CrudTable
        data={items}
        columns={columns}
        searchKey="items"
        onAdd={() => router.push(`/admin/content/web/${type}/new`)}
        onEdit={(item) => router.push(`/admin/content/web/${type}/${item.id}`)}
        onDelete={(item) => handleDelete(item.id!)}
      />
    </div>
  );
}
