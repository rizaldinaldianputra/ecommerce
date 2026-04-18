'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { CrudTable } from '@/components/admin/crud-table';
import { ProductService } from '@/services/product.service';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { useToast } from '@/hooks/use-toast';

import { Switch } from '@/components/ui/switch';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Added state
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const isMounted = useRef(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await ProductService.getAll();
      setProducts(res.content || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch products', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted.current) return;
    fetchProducts();
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const handleToggleStatus = async (product: Product) => {
    try {
      // Send the full product object to satisfy backend PUT requirements
      const updatedProduct = { 
        ...product, 
        isActive: !product.isActive 
      };
      
      await ProductService.update(product.id, updatedProduct as any);
      
      toast({ 
        title: 'Status Updated', 
        description: `${product.name} is now ${!product.isActive ? 'Active' : 'Inactive'}` 
      });
      fetchProducts();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({ title: 'Error', description: 'Failed to update status. Make sure all required fields are present.', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Product',
      cell: ({ row }) => {
        let imageUrl = row.original.imageUrl || (row.original.images && row.original.images.length > 0 ? row.original.images[0] : null);
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https://api.zelixa.my.id${imageUrl}`;
        }
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 group">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400 text-[10px] font-bold">No Img</div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 dark:text-slate-100">{row.original.name}</span>
              <span className="text-xs text-slate-500">{row.original.category?.name || 'Uncategorized'}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const price = row.original.variants?.[0]?.price || row.original.price || 0;
        return <span className="font-bold">Rp {price.toLocaleString()}</span>;
      },
    },
    {
      accessorKey: 'qty',
      header: 'Stock',
      cell: ({ row }) => {
        const stock = row.original.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || row.original.qty || 0;
        return (
          <span className={`font-bold ${stock < 10 ? 'text-red-500' : 'text-slate-600'}`}>
            {stock} units
          </span>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${row.original.isActive
            ? 'bg-pink-100 text-pink-700'
            : 'bg-slate-100 text-slate-700'
          }`}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const handleAdd = () => router.push('/admin/products/new');
  const handleEdit = (product: Product) => router.push(`/admin/products/${product.id}`);


  const handleDelete = async (product: Product) => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await ProductService.delete(product.id);
        toast({ title: 'Success', description: 'Product deleted' });
        fetchProducts();
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Products</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your inventory, prices and variants.</p>
        </div>
      </div>

      <CrudTable
        data={products}
        columns={columns}
        searchKey="products"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onHistory={(product) => router.push(`/admin/stock?search=${encodeURIComponent(product.name)}`)}
        isLoading={isLoading}
      />
    </div>
  );
}
