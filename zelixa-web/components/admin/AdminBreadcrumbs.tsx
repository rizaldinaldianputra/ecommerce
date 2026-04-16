'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  
  // Ex: /admin/products/new => ['admin', 'products', 'new']
  const paths = pathname.split('/').filter(Boolean);
  
  // If we are at /admin, don't show complex breadcrumb, just Dashboard
  if (paths.length === 1 && paths[0] === 'admin') {
    return (
      <div className="flex items-center text-sm text-slate-500 bg-white/40 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full inline-flex border border-white/40 shadow-sm">
        <Home className="w-4 h-4 mr-2 text-pink-500" />
        <span className="font-medium text-slate-800 dark:text-slate-200">Dashboard</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center text-sm font-medium bg-white/40 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full inline-flex border border-white/40 shadow-sm">
      <Link href="/admin" className="flex items-center text-slate-500 hover:text-pink-600 transition-colors">
        <Home className="w-4 h-4 mr-1 text-pink-500" />
        <span className="hidden sm:inline">Admin</span>
      </Link>
      
      {paths.map((path, index) => {
        if (index === 0) return null; // skip 'admin'
        
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        const title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

        return (
          <div key={path} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
            
            {isLast ? (
              <span className="text-slate-800 dark:text-slate-200 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
                {title}
              </span>
            ) : (
              <Link 
                href={href}
                className="text-slate-500 hover:text-pink-600 transition-colors"
              >
                {title}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
