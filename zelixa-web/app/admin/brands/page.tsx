'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { CrudTable } from '@/components/admin/crud-table';
import { BrandService } from '@/services/brand.service';
import { Brand } from '@/types/brand';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatImageUrl } from '@/lib/url-utils';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const isMounted = useRef(false);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const res = await BrandService.getAll();
      setBrands(res.content || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch brands', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted.current) return;
    fetchBrands();
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const columns: ColumnDef<Brand>[] = [
    {
      header: 'Brand',
      accessorKey: 'name',
      cell: ({ row }) => {
        const brand = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-slate-100">
              <AvatarImage src={formatImageUrl(brand.logoUrl)} alt={brand.name} />
              <AvatarFallback>{brand.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 dark:text-slate-100">{brand.name}</span>
              <span className="text-xs text-slate-500">{brand.slug}</span>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'success' : 'secondary'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <span className="text-slate-500 text-sm">
          {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : '-'}
        </span>
      ),
    },
  ];

  const handleAdd = () => router.push('/admin/brands/new');
  const handleEdit = (brand: Brand) => router.push(`/admin/brands/${brand.id}`);
  const handleDelete = async (brand: Brand) => {
    if (confirm(`Are you sure you want to delete ${brand.name}?`)) {
      try {
        await BrandService.delete(brand.id);
        toast({ title: 'Success', description: 'Brand deleted' });
        fetchBrands();
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete brand', variant: 'destructive' });
      }
    }
  };

  const handleToggleStatus = async (brand: Brand) => {
    try {
      await BrandService.update(brand.id, { ...brand, isActive: !brand.isActive });
      toast({ title: 'Success', description: 'Brand status updated' });
      fetchBrands();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update brand status', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Official Brands</h1>
          <p className="text-slate-500 text-sm mt-1">Manage partner brands and their logos.</p>
        </div>
      </div>

      <CrudTable
        data={brands}
        columns={columns}
        searchKey="brands"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading}
      />
    </div>
  );
}
