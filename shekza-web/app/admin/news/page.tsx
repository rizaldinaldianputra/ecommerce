'use client';

import { useEffect, useState } from 'react';
import { Newspaper, Plus, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { NewsService, News } from '@/services/news.service';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CrudTable } from '@/components/admin/crud-table';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

export default function NewsManagementPage() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchNews = async () => {
    try {
      const response = await NewsService.getAll();
      setNews((response as any).content || response);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch news', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await NewsService.delete(id);
      toast({ title: 'Success', description: 'Article deleted' });
      fetchNews();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete article', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<News>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors uppercase">{row.original.title}</span>
          <span className="text-[10px] text-slate-400 font-mono tracking-tight">/{row.original.slug}</span>
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Published At',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-500 font-bold">
          <Calendar className="h-3.5 w-3.5" />
          {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : 'Draft'}
        </div>
      )
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'pink' : 'secondary'} className="rounded-full uppercase text-[10px] px-3 font-bold tracking-widest">
          {row.original.isActive ? 'Published' : 'Hidden'}
        </Badge>
      )
    }
  ];

  const handleEdit = (item: News) => {
    router.push(`/admin/news/${item.id}`);
  };

  const handleAdd = () => {
    router.push('/admin/news/new');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-3xl bg-pink-500/10 flex items-center justify-center text-pink-500 shadow-inner">
             <Newspaper className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">News & Articles</h1>
            <p className="text-slate-500 text-sm font-bold">Publish news, updates, and articles for your customers.</p>
          </div>
        </div>
      </div>

      <CrudTable 
        data={news} 
        columns={columns} 
        searchKey="news"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(item) => handleDelete(item.id!)}
      />
    </div>
  );
}
