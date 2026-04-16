'use client';

import { useEffect, useState } from 'react';
import { Bell, Plus, Trash2, Calendar, User, Globe, AlertCircle } from 'lucide-react';
import { NotificationService, NotificationHistory } from '@/services/notification.service';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CrudTable } from '@/components/admin/crud-table';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await NotificationService.getAll();
      setNotifications(response.data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch notifications', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear your notification history?')) return;
    try {
      await NotificationService.clearAll();
      toast({ title: 'Success', description: 'Notification history cleared' });
      fetchNotifications();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to clear history', variant: 'destructive' });
    }
  };

  const columns: ColumnDef<NotificationHistory>[] = [
    {
      accessorKey: 'title',
      header: 'Notification',
      cell: ({ row }) => (
        <div className="flex flex-col max-w-[300px]">
          <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">{row.original.title}</span>
          <span className="text-xs text-slate-500 line-clamp-1">{row.original.body}</span>
        </div>
      )
    },
    {
      accessorKey: 'userId',
      header: 'Target',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.userId ? (
            <Badge variant="secondary" className="gap-1 rounded-full font-bold uppercase text-[10px]">
              <User className="h-3 w-3" />
              UID: {row.original.userId}
            </Badge>
          ) : (
            <Badge variant="pink" className="gap-1 rounded-full font-bold uppercase text-[10px]">
              <Globe className="h-3 w-3" />
              GLOBAL
            </Badge>
          )}
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Sent At',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(row.original.createdAt).toLocaleString()}
        </div>
      )
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline" className="rounded-full font-black uppercase text-[9px] tracking-widest px-2">
          {row.original.type || 'SYSTEM'}
        </Badge>
      )
    }
  ];

  const handleAdd = () => {
    router.push('/admin/notifications/new');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-3xl bg-pink-500/10 flex items-center justify-center text-pink-500 shadow-inner">
             <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Notifications</h1>
            <p className="text-slate-500 text-sm font-bold">Manage and push notifications to your mobile users.</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button onClick={handleClear} variant="outline" className="rounded-2xl border-slate-200 font-bold uppercase text-xs h-11 px-6 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Local History
          </Button>
          <Button onClick={handleAdd} className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl shadow-lg shadow-pink-500/20 font-bold uppercase text-xs h-11 px-6 flex items-center gap-2 group transition-all">
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Push New
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <CrudTable 
          data={notifications} 
          columns={columns} 
          searchKey="notifications"
          hasActions={false}
        />
      </div>
    </div>
  );
}
