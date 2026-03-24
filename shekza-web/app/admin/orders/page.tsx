'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { CrudTable } from '@/components/admin/crud-table';
import { OrderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/types/order';
import { useToast } from '@/hooks/use-toast';
import { Eye, Clock, CheckCircle2, Truck, XCircle, Package, AlertCircle, RefreshCcw } from 'lucide-react';

const STATUS_CONFIG: Record<OrderStatus, { label: string, color: string, icon: any }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  PAID: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2 },
  PROCESSING: { label: 'Processing', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Clock },
  DELIVERING: { label: 'Delivering', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Truck },
  COMPLETED: { label: 'Completed', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400', icon: Package },
  CANCELLED: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', icon: XCircle },
  COMPLAINT: { label: 'Complaint', color: 'bg-amber-50 text-amber-600', icon: AlertCircle },
  RETURNED: { label: 'Returned', color: 'bg-slate-100 text-slate-600', icon: RefreshCcw },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await OrderService.getAll();
      setOrders(res.content || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch orders', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'orderNumber',
      header: 'Order #',
      cell: ({ row }) => <span className="font-bold text-slate-900 dark:text-slate-100">{row.original.orderNumber}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>,
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total',
      cell: ({ row }) => <span className="font-bold">Rp {row.original.totalAmount.toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const config = STATUS_CONFIG[row.original.status] || STATUS_CONFIG.PENDING;
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.color}`}>
            <config.icon className="h-3.5 w-3.5" />
            {config.label}
          </span>
        );
      },
    },
  ];

  const handleView = (order: Order) => router.push(`/admin/orders/${order.id}`);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Orders</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor and manage customer transactions.</p>
        </div>
      </div>

      <CrudTable
        data={orders}
        columns={columns}
        searchKey="orders"
        onView={handleView}
        hasActions={true}
      />
    </div>
  );
}
