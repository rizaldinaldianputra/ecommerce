'use client';

import { Bell, Search, Menu, User, Settings, LogOut, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';
import { OrderWorkflowService } from '@/services/order-workflow.service';
import { NotificationService } from '@/services/notification.service';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';

export default function AdminHeader({
  onMenuClick,
  isCollapsed,
  setIsCollapsed
}: {
  onMenuClick: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}) {
  const router = useRouter();

  const [taskCount, setTaskCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchDataCounts = async () => {
    try {
      // Parallel fetch for counts
      const [tasks, unreadRes] = await Promise.all([
        OrderWorkflowService.getAdminTasks(),
        NotificationService.getUnreadCount()
      ]);
      
      setTaskCount(tasks.length || 0);
      setNotificationCount(unreadRes.count || unreadRes.data || 0);
    } catch (error) {
      console.error('Failed to fetch counts:', error);
    }
  };

  useEffect(() => {
    fetchDataCounts();
    const interval = setInterval(fetchDataCounts, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/20 bg-white/40 px-6 backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden text-slate-700 dark:text-slate-200">
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex text-slate-700 dark:text-slate-200 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-xl"
        >
          <PanelLeft className={cn("h-5 w-5 transition-transform duration-300", isCollapsed && "rotate-180")} />
        </Button>

      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        {/* Tasks Badge */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push('/admin/orders/tasks')}
          className="relative rounded-full bg-white/50 hover:bg-white/80 dark:bg-black/50 backdrop-blur-sm border-white/30 group"
        >
          <ClipboardList className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:text-pink-600 transition-colors" />
          {taskCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white border-2 border-white dark:border-black animate-in zoom-in duration-300">
              {taskCount}
            </span>
          )}
        </Button>

        {/* Notifications Badge */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push('/admin/notifications')}
          className="relative rounded-full bg-white/50 hover:bg-white/80 dark:bg-black/50 backdrop-blur-sm border-white/30 group"
        >
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:text-pink-600 transition-colors" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-white dark:border-black animate-in zoom-in duration-300">
              {notificationCount}
            </span>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 p-0.5">
              <Avatar className="h-full w-full border-2 border-white dark:border-black">
                <AvatarImage src="/avatar-placeholder.png" alt="Admin" />
                <AvatarFallback className="bg-pink-100 text-pink-800 font-bold uppercase">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2 rounded-2xl glass-panel border-white/20 bg-white/80 backdrop-blur-xl dark:bg-black/80" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">admin@zelixa.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/30">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/30">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 rounded-xl">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
