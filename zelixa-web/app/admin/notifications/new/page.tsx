'use client';

import { useState } from 'react';
import { Bell, Send, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { NotificationService, PushNotificationRequest } from '@/services/notification.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewNotificationPage() {
  const [formData, setFormData] = useState<PushNotificationRequest>({
    title: '',
    body: '',
    type: 'PROMOTION',
    topic: 'all',
    userId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.body) {
      toast({ title: 'Validation Error', description: 'Title and Body are required', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);
      await NotificationService.push(formData);
      toast({ title: 'Success', description: 'Notification pushed successfully' });
      router.push('/admin/notifications');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to push notification', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            className="rounded-2xl font-bold uppercase text-[10px] tracking-widest gap-2 text-slate-500 hover:text-pink-500 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <div className="p-8 md:p-12 space-y-10">
          <div className="flex items-center gap-6">
             <div className="h-16 w-16 rounded-[2rem] bg-pink-500/10 flex items-center justify-center text-pink-500 shadow-inner">
               <Bell className="h-8 w-8" />
             </div>
             <div>
               <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Push Notification</h1>
               <p className="text-slate-500 font-bold text-sm mt-1">Broadcast messages to your mobile application users.</p>
             </div>
          </div>

          <form onSubmit={handlePush} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Target Audience</label>
                <Select 
                    value={formData.topic || (formData.userId ? 'individual' : 'all')} 
                    onValueChange={(val) => {
                        if (val === 'individual') setFormData({...formData, topic: '', userId: ''});
                        else setFormData({...formData, topic: val, userId: ''});
                    }}
                >
                  <SelectTrigger className="rounded-2xl border-slate-200 dark:border-white/10 h-14 font-bold">
                    <SelectValue placeholder="Select Target" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="all">Global (All Users)</SelectItem>
                    <SelectItem value="news">News Topic</SelectItem>
                    <SelectItem value="promotions">Promotions Topic</SelectItem>
                    <SelectItem value="individual">Direct User (Individual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.topic === '' || !formData.topic) && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">User ID</label>
                  <Input 
                    value={formData.userId}
                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                    placeholder="Enter User ID (e.g. 123)"
                    className="rounded-2xl border-slate-200 dark:border-white/10 h-14 font-bold"
                  />
                </div>
              )}

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Notification Type</label>
                 <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                   <SelectTrigger className="rounded-2xl border-slate-200 dark:border-white/10 h-14 font-bold">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent className="rounded-2xl">
                     <SelectItem value="PROMOTION">Promotion</SelectItem>
                     <SelectItem value="ORDER_UPDATE">Order Update</SelectItem>
                     <SelectItem value="SYSTEM">System/Technical</SelectItem>
                     <SelectItem value="ALERT">Alert/Urgent</SelectItem>
                   </SelectContent>
                 </Select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Title</label>
              <Input 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter a catchy title..."
                className="rounded-2xl border-slate-200 dark:border-white/10 h-14 font-bold text-lg"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Message Body</label>
              <Textarea 
                value={formData.body}
                onChange={(e) => setFormData({...formData, body: e.target.value})}
                placeholder="Describe your notification in detail..."
                className="rounded-2xl border-slate-200 dark:border-white/10 min-h-[150px] font-bold py-4"
              />
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                className="rounded-2xl h-14 px-8 font-bold uppercase text-xs"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl h-14 px-12 font-bold uppercase text-xs shadow-xl shadow-pink-500/20 group transition-all"
              >
                {isSubmitting ? 'Pushing...' : (
                  <>
                    Push to Users
                    <Send className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-white/5 rounded-3xl p-6 flex items-start gap-4 border border-slate-200 dark:border-white/10">
        <Info className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">About FCM Topics</h4>
            <p className="text-xs text-slate-500 font-bold leading-relaxed">
              Topics like <code className="text-pink-600 bg-pink-50 px-1 py-0.5 rounded">all</code>, <code className="text-pink-600 bg-pink-50 px-1 py-0.5 rounded">news</code>, or <code className="text-pink-600 bg-pink-50 px-1 py-0.5 rounded">promotions</code> are used to reach broad audiences. Individual pushes require a valid User ID that has registered their FCM token in the mobile app.
            </p>
        </div>
      </div>
    </div>
  );
}
