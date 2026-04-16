'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { OrderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/types/order';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle2, Clock, Package, Truck, XCircle, Printer, AlertCircle, RefreshCcw } from 'lucide-react';

const STATUS_CONFIG: Partial<Record<OrderStatus, { label: string, color: string, icon: any }>> = {
  PENDING: { label: 'Pending Payment', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  PAID: { label: 'Payment Received', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2 },
  PROCESSING: { label: 'Processing', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Clock },
  DELIVERING: { label: 'Delivering', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Truck },
  COMPLETED: { label: 'Completed', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400', icon: Package },
  CANCELLED: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', icon: XCircle },
  COMPLAINT: { label: 'Complaint', color: 'bg-amber-50 text-amber-600', icon: AlertCircle },
  RETURNED: { label: 'Returned', color: 'bg-slate-100 text-slate-600', icon: RefreshCcw },
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    if (params.id) {
      const fetchOrder = async () => {
        try {
          const data = await OrderService.getById(Number(params.id));
          setOrder(data);
        } catch (error) {
          toast({ title: 'Error', description: 'Failed to fetch order details', variant: 'destructive' });
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder();
    }
  }, [params.id]);

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    try {
      await OrderService.updateStatus(order.id, newStatus);
      setOrder({ ...order, status: newStatus });
      toast({ title: 'Success', description: `Order status updated to ${newStatus}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleShipOrder = async () => {
    if (!order) return;
    if (!trackingNumber.trim()) {
      toast({ title: 'Error', description: 'Tracking number is required to ship the order', variant: 'destructive' });
      return;
    }
    
    try {
      await OrderService.addTrackingNumber(order.id, trackingNumber);
      await OrderService.updateStatus(order.id, 'DELIVERING');
      setOrder({ ...order, trackingNumber, status: 'DELIVERING' });
      toast({ title: 'Success', description: `Order shipped with tracking number ${trackingNumber}` });
      setTrackingNumber('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to ship order', variant: 'destructive' });
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  if (!order) return <div className="text-center py-20">Order not found.</div>;

  const currentStatus = STATUS_CONFIG[order.status] || { label: 'Unknown', color: 'bg-slate-100 text-slate-700', icon: Package };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-white/40 border border-white/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order {order.orderNumber}</h1>
            <p className="text-sm text-slate-500">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full gap-2 border-slate-200">
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-sm ${currentStatus.color}`}>
            <currentStatus.icon className="h-4 w-4" />
            {currentStatus.label}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-white/20 font-bold uppercase tracking-wider text-xs text-slate-500">
              Order Items
            </div>
            <div className="divide-y divide-white/20">
              {order.items?.map((item) => (
                <div key={item.id} className="p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-200 shrink-0">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.productName}</h3>
                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Rp {item.price.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Total: Rp {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-50/50 dark:bg-white/5 border-t border-white/20">
              <div className="space-y-2 max-w-xs ml-auto text-right">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>Rp {(order.totalAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-pink-600 dark:text-pink-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total</span>
                  <span>Rp {(order.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 uppercase tracking-wider text-xs text-slate-500">Manage Order Status</h3>

            {order.status === 'PROCESSING' && (
              <div className="mb-6 bg-slate-50/50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-sm mb-3">Ship Order</p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter Tracking Number" 
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="flex-1 bg-white"
                  />
                  <Button onClick={handleShipOrder} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                    Ship Now
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleUpdateStatus('PAID')} variant="outline" className="rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                Mark as Paid
              </Button>
              <Button onClick={() => handleUpdateStatus('PROCESSING')} variant="outline" className="rounded-full bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
                Process Order
              </Button>
              {order.status !== 'PROCESSING' && (
                <Button onClick={() => handleUpdateStatus('DELIVERING')} variant="outline" className="rounded-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                  Ship Order
                </Button>
              )}
              <Button onClick={() => handleUpdateStatus('COMPLETED')} variant="outline" className="rounded-full bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100">
                Complete
              </Button>
              <Button onClick={() => handleUpdateStatus('CANCELLED')} variant="outline" className="rounded-full bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100">
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar: Customer Info */}
        <div className="space-y-6">
          <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 uppercase tracking-wider text-xs text-slate-500">Customer Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white font-bold">
                  U{order.userId}
                </div>
                <div>
                  <p className="font-bold">User ID: {order.userId}</p>
                  <p className="text-xs text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">Customer record linked via ID</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="text-sm">
                  <p className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Shipping Service</p>
                  <p className="mt-1 font-bold text-slate-800">{order.shippingService || 'Standard Shipping'}</p>
                </div>
                
                {order.trackingNumber && (
                  <div className="text-sm pt-2">
                    <p className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Tracking Number</p>
                    <p className="mt-1 font-black text-blue-600 bg-blue-50 w-max px-3 py-1 rounded-md">{order.trackingNumber}</p>
                  </div>
                )}
                
                {order.paymentToken && (
                  <div className="text-sm pt-2">
                    <p className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Payment Token</p>
                    <p className="mt-1 font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded w-max">{order.paymentToken}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
