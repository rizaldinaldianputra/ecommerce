'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { History, Search, ArrowLeft, Calendar, User, Tag, FileText, ChevronLeft, ChevronRight, Package, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { StockTransactionService, StockTransaction } from '@/services/stock-transaction.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function StockHistoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [history, setHistory] = useState<StockTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const page = parseInt(searchParams.get('page') || '0');
  const query = searchParams.get('query') || '';

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await StockTransactionService.getHistory(query, page, 10);
      setHistory(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('query') as string;
    const params = new URLSearchParams(searchParams);
    params.set('query', q);
    params.set('page', '0');
    router.push(`?${params.toString()}`);
  };

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/admin/stock" className="text-pink-500 hover:text-pink-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Inventory Management</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
            <History className="h-10 w-10 text-pink-500" />
            Transaction Logs
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Audit trail of every stock addition, adjustment, and movement.</p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              name="query"
              defaultValue={query}
              placeholder="Search by SKU or Product..." 
              className="pl-12 h-12 rounded-2xl bg-white shadow-sm border-slate-200 focus:ring-pink-500"
            />
          </div>
          <Button type="submit" className="h-12 px-6 rounded-2xl bg-pink-500 text-white hover:bg-pink-600 font-bold shadow-lg shadow-pink-500/20">
            Search
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Date & Time</th>
                    <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">SKU / Item</th>
                    <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-slate-400 text-center">Type</th>
                    <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-slate-400 text-center">Quantity</th>
                    <th className="px-6 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Handled By</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-slate-400">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {history.map((tx) => (
                      <motion.tr 
                        key={tx.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Calendar className="h-3.5 w-3.5 text-slate-300" />
                            <span className="text-xs font-bold whitespace-nowrap">
                              {new Date(tx.createdAt).toLocaleString(undefined, { 
                                dateStyle: 'medium', 
                                timeStyle: 'short' 
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{tx.sku}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Product Variant</span>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <Badge 
                            variant="secondary" 
                            className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                              tx.type === 'ADDITION' ? 'bg-emerald-50 text-emerald-600' : 
                              tx.type === 'ADJUSTMENT' ? 'bg-blue-50 text-blue-600' : 
                              tx.type === 'INITIAL' ? 'bg-slate-100 text-slate-600' : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {tx.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {tx.quantity > 0 ? (
                              <TrendingUp className="h-4 w-4 text-emerald-500" />
                            ) : tx.quantity < 0 ? (
                              <TrendingDown className="h-4 w-4 text-rose-500" />
                            ) : (
                              <RefreshCcw className="h-4 w-4 text-slate-300" />
                            )}
                            <span className={`text-lg font-bold ${
                              tx.quantity > 0 ? 'text-emerald-600' : 
                              tx.quantity < 0 ? 'text-rose-600' : 'text-slate-600'
                            }`}>
                              {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-white/10">
                              <User className="h-3.5 w-3.5 text-slate-400" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{tx.createdBy || 'System'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {tx.notes ? (
                            <p className="text-xs font-medium text-slate-500 max-w-xs truncate" title={tx.notes}>
                              {tx.notes}
                            </p>
                          ) : (
                            <span className="text-[10px] italic text-slate-300 font-medium">No notes available</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {history.length === 0 && (
                <div className="py-20 text-center">
                  <Package className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold">No transaction records found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500">
                Showing <span className="text-slate-900">{history.length}</span> of <span className="text-slate-900">{totalElements}</span> logs
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i ? 'default' : 'outline'}
                      className={`h-10 w-10 rounded-xl font-bold ${page === i ? 'bg-pink-500 text-white' : ''}`}
                      onClick={() => setPage(i)}
                    >
                      {i + 1}
                    </Button>
                  )).slice(Math.max(0, page - 2), Math.min(totalPages, page + 3))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StockHistoryPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    }>
      <StockHistoryContent />
    </Suspense>
  );
}
