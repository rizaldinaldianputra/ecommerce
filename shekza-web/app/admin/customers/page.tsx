'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { CrudTable } from '@/components/admin/crud-table';
import { CustomerService } from '@/services/customer.service';
import { Customer } from '@/types/customer';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, User as UserIcon } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await CustomerService.getAll();
      setCustomers(res.content || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch customers', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold shrink-0">
            {row.original.name?.charAt(0) || <UserIcon className="h-5 w-5" />}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800 dark:text-slate-100">{row.original.name}</span>
            <span className="text-xs text-slate-500">ID: #{row.original.id}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="flex flex-col text-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="h-3 w-3" /> {row.original.email}
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-mono">
            <Phone className="h-3 w-3" /> {row.original.phone || '-'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'ordersCount',
      header: 'Orders',
      cell: ({ row }) => <span className="font-medium">{(row.original as any).ordersCount || 0}</span>,
    },
    {
      accessorKey: 'totalSpent',
      header: 'Total Spent',
      cell: ({ row }) => <span className="font-bold text-pink-600 dark:text-pink-400">Rp {((row.original as any).totalSpent || 0).toLocaleString()}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Customers</h1>
        <p className="text-slate-500 text-sm mt-1">View and manage your customer database.</p>
      </div>

      <CrudTable
        data={customers}
        columns={columns}
        searchKey="customers"
        hasActions={true}
        onView={(c) => toast({ title: 'Detail', description: `Viewing ${c.name}` })}
      />
    </div>
  );
}
