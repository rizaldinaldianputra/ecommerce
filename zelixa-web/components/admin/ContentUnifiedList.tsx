'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Monitor, Smartphone, LayoutGrid } from 'lucide-react';
import { ContentService } from '@/services/content.service';
import { ContentItem } from '@/types/content';
import { CrudTable } from '@/components/admin/crud-table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const TYPE_LABELS: Record<string, string> = {
  PROMO: 'Promo / Banner',
  FLASH_SALE: 'Flash Sale',
  TRENDING_NOW: 'Trending Now',
  FEATURED_PRODUCTS: 'Featured Products',
};

export default function ContentUnifiedList() {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await ContentService.getAllItems();
      setItems(data);
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data content', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (item: ContentItem) => {
    if (!confirm(`Hapus item "${item.title || item.type}"?`)) return;
    try {
      await ContentService.deleteItem(item.id!);
      toast({ title: 'Berhasil', description: 'Item dihapus' });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus item', variant: 'destructive' });
    }
  };

  const handleToggleStatus = async (item: ContentItem) => {
    try {
      await ContentService.updateItem(item.id!, { ...item, isActive: !item.isActive } as any);
      toast({ title: 'Berhasil', description: 'Status updated' });
      fetchItems();
    } catch {
      toast({ title: 'Error', description: 'Gagal update status', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<ContentItem>[] = [
    {
      accessorKey: 'imageUrl',
      header: 'Preview',
      cell: ({ row }) => (
        <div className="h-10 w-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          {row.original.imageUrl ? (
            <img src={row.original.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-300">
              <LayoutGrid size={16} />
            </div>
          )}
        </div>
      )
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.type || '';
        return (
          <div className="flex flex-col">
            <span className="font-bold text-[10px] text-pink-500 uppercase tracking-widest">{TYPE_LABELS[type] || type}</span>
            <span className="text-[9px] text-slate-400 font-bold tracking-tight">{type}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: ({ row }) => {
        const platform = row.original.platform || 'WEB';
        return (
          <Badge variant="outline" className="rounded-full gap-1.5 font-bold text-[9px] uppercase tracking-widest py-0.5 border-slate-200 dark:border-white/10">
            {platform === 'MOBILE' ? <Smartphone size={10} /> : <Monitor size={10} />}
            {platform}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'title',
      header: 'Content Details',
      cell: ({ row }) => (
        <div className="flex flex-col max-w-xs">
          <span className="font-black text-slate-900 dark:text-slate-100 text-sm truncate uppercase tracking-tight italic">
            {row.original.title || 'Untitled'}
          </span>
          {row.original.subtitle && (
            <span className="text-[10px] text-slate-400 font-semibold line-clamp-1 italic">
              {row.original.subtitle}
            </span>
          )}
        </div>
      )
    },
    {
      accessorKey: 'displayOrder',
      header: 'Order',
      cell: ({ row }) => <span className="font-mono font-bold text-slate-500">#{row.original.displayOrder || 0}</span>
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
    <CrudTable
      data={items}
      columns={columns}
      searchKey="content"
      onAdd={() => router.push('/admin/content/new')}
      onEdit={(item) => router.push(`/admin/content/edit/${item.id}`)}
      onDelete={handleDelete}
      onToggleStatus={handleToggleStatus}
      isLoading={isLoading}
    />
  );
}
