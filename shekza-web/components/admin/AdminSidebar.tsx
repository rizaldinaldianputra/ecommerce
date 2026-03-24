'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  ChevronLeft,
  Tag,
  Gift,
  PlusSquare,
  Zap,
  LayoutTemplate,
  Newspaper,
  ClipboardList,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '@/services/auth.service';

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Store Management',
    items: [
      { name: 'Products', href: '/admin/products', icon: Package },
      { name: 'Categories', href: '/admin/categories', icon: Tag },
      { name: 'Stock Management', href: '/admin/stock', icon: PlusSquare },
      { name: 'Flash Sales', href: '/admin/flash-sales', icon: Zap },
      { name: 'Vouchers', href: '/admin/vouchers', icon: Gift },
    ]
  },
  {
    title: 'Content Management',
    items: [
      { name: 'Hero Carousel', href: '/admin/content-sections?type=HERO_CAROUSEL', icon: LayoutTemplate },
      { name: 'Curated Selections', href: '/admin/content-sections?type=CURATED_PRODUCTS', icon: LayoutTemplate },
      { name: 'Recommendations', href: '/admin/content-sections?type=RECOMMENDED_PRODUCTS', icon: LayoutTemplate },
      { name: 'Why Shop Perks', href: '/admin/content-sections?type=WHY_SHOP', icon: LayoutTemplate },
      { name: 'Shop the Look', href: '/admin/content-sections?type=SHOP_THE_LOOK', icon: LayoutTemplate },
      { name: 'News & Articles', href: '/admin/news', icon: Newspaper },
    ]
  },
  {
    title: 'Sales & Operations',
    items: [
      { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { name: 'Workflow Tasks', href: '/admin/orders/tasks', icon: ClipboardList, restrictedTo: ['ORDER_PROCESSOR', 'SHIPPING', 'CUSTOMER_SERVICE', 'ADMIN'] },
      { name: 'Team Management', href: '/admin/users', icon: Users, roleRequired: 'ROLE_ADMIN' },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: Settings, roleRequired: 'ROLE_ADMIN' },
    ]
  }
];

export default function AdminSidebar({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = authService.getUser();
    setUser(userData);

    const handleAuthChange = () => {
      setUser(authService.getUser());
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const userRoles = user?.roles || [];
  const userTaskGroup = user?.taskGroup || '';
  const isAdmin = userRoles.includes('ROLE_ADMIN');

  const isItemVisible = (item: any) => {
    if (item.roleRequired && !userRoles.includes(item.roleRequired)) return false;
    if (item.restrictedTo) {
      if (isAdmin) return true;
      if (!item.restrictedTo.includes(userTaskGroup)) return false;
    }
    return true;
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform border-r border-slate-200 bg-white/90 backdrop-blur-2xl transition-all duration-300 ease-in-out lg:static dark:border-white/5 dark:bg-slate-900/95",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "lg:w-20" : "lg:w-72 lg:translate-x-0",
          !isOpen && "lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-white/10">
          <Link href="/admin" className="flex items-center gap-2 group overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-transform">
              <span className="font-bold text-lg">S</span>
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold text-pink-600 dark:text-pink-400 tracking-tight whitespace-nowrap"
              >
                SHEKZA
              </motion.span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-500"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {NAV_GROUPS.map((group) => {
            const visibleItems = group.items.filter(isItemVisible);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-1">
                {!isCollapsed && (
                  <h4 className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 mt-2">
                    {group.title}
                  </h4>
                )}
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                        isActive
                          ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <item.icon size={20} className={cn(
                        "transition-transform group-hover:scale-110 shrink-0",
                        isActive ? "text-white" : "group-hover:text-pink-500")
                      } />
                      {!isCollapsed && (
                        <span className="text-sm font-bold tracking-tight">{item.name}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
