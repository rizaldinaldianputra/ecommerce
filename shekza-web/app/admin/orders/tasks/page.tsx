'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, CheckCircle2, XCircle, Truck, MessageSquare, AlertCircle, Search, RefreshCw, User, Package, Calendar, ArrowRight } from 'lucide-react';
import { OrderWorkflowService, WorkflowTask } from '@/services/order-workflow.service';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export default function OrderTasksPage() {
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  // Task Action State
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(null);
  const [actionType, setActionType] = useState<'REVIEW' | 'DELIVERY' | 'COMPLAINT' | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await OrderWorkflowService.getAdminTasks();
      setTasks(res);
      setUser(authService.getUser());
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch workflow tasks', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCompleteTask = async (variables: Record<string, any>) => {
    if (!selectedTask) return;
    setIsProcessing(true);
    try {
      await OrderWorkflowService.completeTask(selectedTask.id, {
        ...variables,
        resolutionNote: actionType === 'COMPLAINT' ? resolutionNote : ''
      });
      toast({ title: 'Success', description: 'Task completed successfully' });
      setActionType(null);
      setSelectedTask(null);
      setResolutionNote('');
      fetchTasks();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to complete task', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const openAction = (task: WorkflowTask) => {
    setSelectedTask(task);
    if (task.name.includes('Review')) setActionType('REVIEW');
    else if (task.name.includes('Tracking') || task.name.includes('Delivery')) setActionType('DELIVERY');
    else if (task.name.includes('Complaint')) setActionType('COMPLAINT');
    setTrackingNumber('');
  };

  const filteredTasks = tasks.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    String(t.variables.orderNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-3xl bg-pink-500/10 flex items-center justify-center text-pink-500 shadow-inner">
             <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Order Workflow Tasks</h1>
            <p className="text-slate-500 text-sm font-medium">
              {user?.taskGroup ? `Assigned to: ${user.taskGroup}` : 'Manage and process order lifecycle tasks.'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by Order # or Task..." 
              className="pl-12 h-12 rounded-2xl bg-white shadow-sm border-slate-200 focus:ring-pink-500 font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="h-12 w-12 p-0 rounded-2xl bg-white border-slate-200 hover:bg-slate-50 transition-colors"
            onClick={fetchTasks}
            disabled={isLoading}
          >
            <RefreshCw className={`h-5 w-5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Order Information</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Workflow Task</th>
                  <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Wait Time</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map((task) => (
                    <motion.tr 
                      key={task.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center border border-pink-100 shrink-0">
                            <Package size={20} />
                           </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{task.variables.orderNumber}</span>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <User className="h-3 w-3" />
                              {task.variables.customerUsername}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                             task.name.includes('Review') ? 'bg-amber-500' :
                             task.name.includes('Delivery') ? 'bg-blue-500' : 'bg-rose-500'
                           }`} />
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">{task.name}</span>
                        </div>
                      </td>
                       <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Created</span>
                          <span className="text-xs font-bold text-slate-600">
                            {new Date(task.createTime).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button 
                          className="h-10 px-6 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-slate-900/10 flex items-center gap-2"
                          onClick={() => openAction(task)}
                        >
                          Process Task
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredTasks.length === 0 && (
              <div className="py-20 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">All tasks completed! No pending orders.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Modal */}
      <Dialog open={actionType !== null} onOpenChange={(open) => !open && setActionType(null)}>
        <DialogContent className="rounded-[2.5rem] border-slate-200 shadow-2xl overflow-hidden p-0 sm:max-w-[425px]">
           <div className="p-8 space-y-6">
            <DialogHeader className="gap-2">
              <DialogTitle className="text-xl font-bold uppercase tracking-tight text-slate-900">
                {actionType === 'REVIEW' ? 'Review Order' : actionType === 'DELIVERY' ? 'Shipping Details' : 'Resolve Complaint'}
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                Order Reference #<span className="text-pink-500">{selectedTask?.variables.orderNumber}</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6">
              {actionType === 'REVIEW' && (
                <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100 flex gap-4">
                   <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shrink-0 shadow-sm border border-emerald-50">
                     <CheckCircle2 size={20} />
                  </div>
                  <p className="text-xs text-emerald-700 font-bold leading-relaxed">Verify payment and inventory before proceeding. Once accepted, the customer will be notified.</p>
                </div>
              )}

               {actionType === 'DELIVERY' && (
                <div className="grid gap-3">
                  <Label htmlFor="resi" className="font-bold text-slate-400 uppercase tracking-widest text-[10px] px-1">Tracking Number (Resi)</Label>
                  <Input
                    id="resi"
                    className="h-14 rounded-2xl border-slate-200 text-sm font-bold focus:ring-pink-500 shadow-inner bg-slate-50/50"
                    placeholder="e.g. JB-123456789"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>
              )}

              {actionType === 'COMPLAINT' && (
                <div className="space-y-6">
                  <div className="bg-rose-50/50 rounded-3xl p-6 border border-rose-100 flex gap-4">
                     <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-rose-500 shrink-0 shadow-sm border border-rose-50">
                       <AlertCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-rose-600 uppercase mb-1">Customer Issue</h4>
                      <p className="text-xs text-rose-700 font-bold leading-relaxed">"{selectedTask?.variables.complaintNotes || 'No details provided'}"</p>
                    </div>
                  </div>
                   <div className="space-y-3">
                    <Label className="font-bold text-slate-400 uppercase tracking-widest text-[10px] px-1">Internal Resolution Note</Label>
                    <textarea 
                      className="w-full rounded-3xl border border-slate-200 p-5 text-sm focus:ring-2 focus:ring-pink-500 transition-all outline-none min-h-[120px] font-bold bg-slate-50/50 shadow-inner" 
                      placeholder="Describe how this issue was resolved..." 
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-3">
              {actionType === 'REVIEW' ? (
                <>
                   <Button 
                    variant="outline" 
                    className="rounded-2xl h-14 flex-1 font-bold text-rose-500 hover:bg-rose-50 border-rose-100 uppercase text-[10px] tracking-widest" 
                    onClick={() => handleCompleteTask({ action: 'reject' })}
                    disabled={isProcessing}
                  >
                    Reject Order
                  </Button>
                   <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 flex-1 font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20" 
                    onClick={() => handleCompleteTask({ action: 'accept' })}
                    disabled={isProcessing}
                  >
                    Accept & Confirm
                  </Button>
                </>
              ) : (
                 <Button 
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 w-full font-bold uppercase text-[10px] tracking-widest shadow-2xl transition-all active:scale-95" 
                  onClick={() => handleCompleteTask({ trackingNumber })}
                  disabled={isProcessing || (actionType === 'DELIVERY' && !trackingNumber)}
                >
                  {isProcessing ? 'Processing Action...' : 'Confirm Resolution'}
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
