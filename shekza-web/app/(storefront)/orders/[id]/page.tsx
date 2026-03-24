'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, MapPin, Calendar, Clock, ChevronLeft, ExternalLink, AlertCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { OrderService } from '@/services/order.service';
import { OrderWorkflowService, WorkflowTask } from '@/services/order-workflow.service';
import { Order } from '@/types/order';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [task, setTask] = useState<WorkflowTask | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Action State
  const [showComplaintDialog, setShowComplaintDialog] = useState(false);
  const [complaintNotes, setComplaintNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const orderData = await OrderService.getById(id as string);
      setOrder(orderData);

      // Fetch user tasks to see if there's a pending confirmation/complaint for this order
      const tasks = await OrderWorkflowService.getUserTasks();
      const orderTask = tasks.find(t => t.variables.orderId === orderData.id);
      setTask(orderTask || null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch order details', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAction = async (outcome: 'confirm' | 'complaint') => {
    if (!task) return;
    setIsProcessing(true);
    try {
      await OrderWorkflowService.completeTask(task.id, { 
        outcome,
        complaintNotes: outcome === 'complaint' ? complaintNotes : ''
      });
      toast({ title: 'Success', description: outcome === 'confirm' ? 'Order confirmed!' : 'Complaint submitted.' });
      setShowComplaintDialog(false);
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to process action', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING': return { color: 'bg-amber-500', icon: Clock, label: 'Pending Payment' };
      case 'PAID': return { color: 'bg-emerald-500', icon: CheckCircle2, label: 'Paid' };
      case 'PROCESSING': return { color: 'bg-blue-500', icon: Package, label: 'Processing' };
      case 'DELIVERING': return { color: 'bg-pink-500', icon: Truck, label: 'Out for Delivery' };
      case 'COMPLETED': return { color: 'bg-slate-900', icon: CheckCircle2, label: 'Completed' };
      default: return { color: 'bg-neutral-400', icon: Package, label: status };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="min-h-screen bg-neutral-50 py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/orders" className="inline-flex items-center gap-2 text-neutral-400 font-bold text-sm mb-4 hover:text-pink-500 transition-colors">
              <ChevronLeft size={16} /> My Orders
            </Link>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Order Recovery</h1>
            <p className="text-neutral-500 text-sm font-medium">#{order.orderNumber} · {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-2 ${statusConfig.color} text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg`}
          >
            <statusConfig.icon size={14} /> {statusConfig.label}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Tracking Section */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-neutral-100 shadow-xl shadow-black/5">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black flex items-center gap-3">
                  Tracking Details
                </h2>
                {order.trackingNumber && (
                   <Badge variant="outline" className="rounded-full px-4 py-1.5 border-neutral-200 font-black text-neutral-400 text-[10px] tracking-widest">
                    RESI: {order.trackingNumber}
                  </Badge>
                )}
              </div>
              
              <div className="relative pl-1 px-4">
                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-neutral-100" />
                <div className="space-y-12">
                  {[
                    { label: 'Order Created', completed: true, date: new Date(order.createdAt).toLocaleDateString() },
                    { label: 'Payment Verified', completed: order.status !== 'PENDING', date: order.status !== 'PENDING' ? 'Confirmed' : 'Waiting' },
                    { label: 'Processing', completed: ['PROCESSING', 'DELIVERING', 'COMPLETED'].includes(order.status), date: ['PROCESSING', 'DELIVERING', 'COMPLETED'].includes(order.status) ? 'Done' : 'Pending' },
                    { label: 'Shipped', active: order.status === 'DELIVERING', completed: order.status === 'COMPLETED', date: order.status === 'DELIVERING' ? 'In Transit' : order.status === 'COMPLETED' ? 'Arrived' : 'Pending' },
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-8 group">
                      <div className={`relative z-10 w-4 h-4 rounded-full mt-1.5 ring-4 ring-white ${step.completed || step.active ? 'bg-pink-500' : 'bg-neutral-200'}`}>
                        {step.completed && <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold"><CheckCircle2 size={10} /></div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className={`font-black text-sm uppercase tracking-widest ${step.active ? 'text-pink-500 animate-pulse' : step.completed ? 'text-neutral-900' : 'text-neutral-300'}`}>
                            {step.label}
                          </p>
                          <span className={`text-[10px] font-bold ${step.completed ? 'text-neutral-400' : 'text-neutral-200'}`}>
                            {step.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS (Camunda User Task) */}
              {task && (
                <div className="mt-12 pt-8 border-t border-neutral-50 flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="flex-1 h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10"
                    onClick={() => handleAction('confirm')}
                    disabled={isProcessing}
                  >
                    Confirm Received
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl border-rose-200 text-rose-500 font-bold uppercase tracking-widest hover:bg-rose-50"
                    onClick={() => setShowComplaintDialog(true)}
                    disabled={isProcessing}
                  >
                    Complaint / Return
                  </Button>
                </div>
              )}
            </div>

            {/* Address Info */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xl shadow-black/5">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                <MapPin size={20} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Shipping Destination</h4>
              <p className="text-sm font-bold text-neutral-900 leading-relaxed italic">Package is being sent to your registered address.</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white sticky top-24">
              <h2 className="text-lg font-black mb-8 border-b border-white/10 pb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-pink-500" />
                Items Detail
              </h2>
              <div className="space-y-6 mb-8">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10 group-hover:border-pink-500/50 transition-colors">
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                        <Package size={20} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{item.productName}</p>
                      <p className="text-[10px] text-neutral-500 font-bold">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-black text-pink-400">${item.price}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                <span className="text-neutral-400 text-xs font-bold uppercase tracking-widest">Grand Total</span>
                <span className="text-2xl font-black text-white">${order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Dialog */}
      <Dialog open={showComplaintDialog} onOpenChange={setShowComplaintDialog}>
        <DialogContent className="rounded-[2.5rem] sm:max-w-[425px]">
          <DialogHeader className="gap-2">
            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <AlertCircle className="text-rose-500 h-6 w-6" />
              File Complaint
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              We're sorry for the issue. Please describe what happened.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label htmlFor="notes" className="font-black text-slate-700 uppercase tracking-widest text-[10px]">Complaint Details</Label>
              <textarea
                id="notes"
                className="min-h-[150px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:ring-pink-500 transition-all outline-none"
                placeholder="Product damaged? Wrong size? Tell us more..."
                value={complaintNotes}
                onChange={(e) => setComplaintNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              className="rounded-2xl h-12 flex-1 font-bold" 
              onClick={() => setShowComplaintDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-rose-500 text-white rounded-2xl h-12 flex-1 font-black uppercase tracking-wider" 
              onClick={() => handleAction('complaint')}
              disabled={isProcessing || !complaintNotes}
            >
              {isProcessing ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
