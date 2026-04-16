'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SeoService, SeoConfig } from '@/services/seo.service';
import { useToast } from '@/hooks/use-toast';
import { CrudTable } from '@/components/admin/crud-table';
import { ColumnDef } from '@tanstack/react-table';

export default function SeoSettingsPage() {
  const [configs, setConfigs] = useState<SeoConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const loadConfigs = async () => {
    setIsLoading(true);
    try {
      const data = await SeoService.getAll();
      const allConfigs = Array.isArray(data) ? data : (data as any)?.content || [];
      setConfigs(allConfigs);
    } catch {
      toast({ title: 'Error', description: 'Failed to load SEO configs', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const handleAdd = () => {
    router.push('/admin/settings/seo/new');
  };

  const handleEdit = (config: SeoConfig) => {
    if (config.id) {
      router.push(`/admin/settings/seo/${config.id}`);
    }
  };

  const handleDelete = async (config: SeoConfig) => {
    if (!config.id) return;
    if (!confirm('Are you sure you want to delete this SEO config?')) return;
    try {
      await SeoService.delete(config.id);
      toast({ title: 'Success', description: 'SEO config deleted' });
      loadConfigs();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete config', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<SeoConfig>[] = [
    {
      accessorKey: 'pageName',
      header: 'Target Page Name',
      cell: ({ row }) => (
        <span className="text-xs font-black uppercase tracking-widest text-pink-700 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400 px-2.5 py-1 rounded-full">
          {row.original.pageName}
        </span>
      ),
    },
    {
      accessorKey: 'scriptCode',
      header: 'Script Content',
      cell: ({ row }) => (
        <span className="text-xs text-slate-500 font-mono italic truncate max-w-[500px] block">
          {row.original.scriptCode ? `${row.original.scriptCode.substring(0, 80)}...` : 'No script'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">SEO Management</h1>
          <p className="text-slate-500 text-sm mt-1">Configure header scripts and tracking pixels per page.</p>
        </div>
      </div>

      <CrudTable
        data={configs}
        columns={columns}
        searchKey="seo"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
