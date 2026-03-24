'use client';

import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  ChevronLeft,
  Tag,
  Gift
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
      { name: 'Vouchers', href: '/admin/vouchers', icon: Gift },
    ]
  },
  {
    title: 'Sales & Customers',
    items: [
      { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { name: 'Customers', href: '/admin/customers', icon: Users },
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: Settings },
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
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/20 dark:border-white/10">
          <Link href="/admin" className="flex items-center gap-2 group overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-transform ml-0.5">
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
            className="lg:hidden text-slate-500 hover:text-slate-800 dark:text-slate-400"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="mb-2">
              {!isCollapsed && (
                <div className="mb-3 mt-6 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap overflow-hidden">
                  {group.title}
                </div>
              )}
              {isCollapsed && <div className="h-4" />}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
                  
                  return (
                    <Link key={item.name} href={item.href} title={isCollapsed ? item.name : undefined}>
                      <span className={cn(
                        "flex items-center rounded-xl transition-all duration-200 group relative overflow-hidden",
                        isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5",
                        isActive 
                          ? "text-pink-700 font-medium dark:text-pink-300"
                          : "text-slate-600 hover:text-pink-600 hover:bg-pink-50/50 dark:text-slate-300 dark:hover:bg-pink-900/20"
                      )}>
                        {isActive && (
                          <motion.div 
                            layoutId={`sidebar-active-pill-${group.title}`}
                            className="absolute inset-0 bg-gradient-to-r from-pink-100/80 to-rose-50/80 dark:from-pink-900/40 dark:to-rose-900/20 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-pink-500 rounded-r-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
                        )}
                        
                        <item.icon className={cn(
                          "h-5 w-5 transition-transform duration-200 group-hover:scale-110 shrink-0",
                          isActive ? "text-pink-600 dark:text-pink-400" : "text-slate-400 group-hover:text-pink-500"
                        )} />
                        {!isCollapsed && (
                          <motion.span 
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative z-10 whitespace-nowrap"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}


        </nav>
      </aside>
    </>
  );
}
