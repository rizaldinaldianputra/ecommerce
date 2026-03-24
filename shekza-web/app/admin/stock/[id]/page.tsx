'use client';

import React, { useEffect, useState, use } from 'react';
import { 
  Package, 
  ArrowLeft, 
  History, 
  PlusCircle, 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  User,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutGrid
} from 'lucide-react';
import { ProductService } from '@/services/product.service';
import { StockTransactionService, StockTransaction, StockSummary } from '@/services/stock-transaction.service';
import { Product, ProductVariant } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

import { ColumnDef } from '@tanstack/react-table';
import { CrudTable } from '@/components/admin/crud-table';

export default function ProductStockDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = parseInt(resolvedParams.id);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [summaries, setSummaries] = useState<Record<number, StockSummary>>({});
  const [history, setHistory] = useState<StockTransaction[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyTotalPages, setHistoryTotalPages] = useState(0);
  
  const [activeTab, setActiveTab] = useState<'variants' | 'history'>('variants');
  const { toast } = useToast();

  // Modal State
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [modalType, setModalType] = useState<'ADD' | 'ADJUST' | 'LOG' | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Per-Variant History State
  const [variantHistory, setVariantHistory] = useState<StockTransaction[]>([]);
  const [isVariantHistoryLoading, setIsVariantHistoryLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await ProductService.getById(productId);
      setProduct(data);
      
      const variantIds = data.variants.map(v => v.id);
      if (variantIds.length > 0) {
        const summaryResults = await StockTransactionService.getSummaries(variantIds);
        const summaryMap: Record<number, StockSummary> = {};
        summaryResults.forEach(s => {
          summaryMap[s.variantId] = s;
        });
        setSummaries(summaryMap);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch product data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setIsHistoryLoading(true);
      const res = await StockTransactionService.getHistoryByProduct(productId, historyPage, 10);
      setHistory(res.content);
      setHistoryTotalPages(res.totalPages);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [productId, activeTab, historyPage]);

  const handleOpenAction = (variant: ProductVariant, type: 'ADD' | 'ADJUST') => {
    setSelectedVariant(variant);
    setModalType(type);
    setAmount(0);
    setNotes('');
  };

  const handleOpenLog = async (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setModalType('LOG');
    setVariantHistory([]);
    try {
      setIsVariantHistoryLoading(true);
      const res = await StockTransactionService.getHistoryByVariant(variant.id, 0, 50);
      setVariantHistory(res.content || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch variant history', variant: 'destructive' });
    } finally {
      setIsVariantHistoryLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedVariant) return;
    setIsActionLoading(true);
    try {
      if (modalType === 'ADD') {
        await StockTransactionService.addStock({
          variantId: selectedVariant.id,
          quantity: amount,
          notes
        });
        toast({ title: 'Success', description: `Added ${amount} to ${selectedVariant.sku}` });
      } else if (modalType === 'ADJUST') {
        await StockTransactionService.adjustStock({
          variantId: selectedVariant.id,
          quantity: amount,
          notes
        });
        toast({ title: 'Success', description: `Adjusted ${selectedVariant.sku} to ${amount}` });
      }
      setModalType(null);
      fetchData();
      if (activeTab === 'history') fetchHistory();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Action failed', variant: 'destructive' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const variantColumns: ColumnDef<ProductVariant>[] = [
    {
      accessorKey: 'sku',
      header: 'Variant / SKU',
      cell: ({ row }) => {
        const v = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <Package size={16} />
            </div>
            <div>
              <div className="font-bold text-slate-800 dark:text-white uppercase tracking-tight">{v.sku}</div>
              <div className="flex gap-1.5 mt-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase">{v.size}</span>
                <span className="text-[9px] font-bold text-slate-400 opacity-30">/</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{v.color}</span>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: 'stock_in',
      header: 'In',
      cell: ({ row }) => <span className="text-emerald-600 font-bold text-sm">+{summaries[row.original.id]?.totalIn || 0}</span>
    },
    {
      id: 'stock_out',
      header: 'Out',
      cell: ({ row }) => <span className="text-rose-600 font-bold text-sm">-{summaries[row.original.id]?.totalOut || 0}</span>
    },
    {
      accessorKey: 'stock',
      header: 'Current',
      cell: ({ row }) => (
        <span className={`text-lg font-bold ${row.original.stock < 10 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
          {row.original.stock}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'Operations',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl hover:bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase gap-1.5" onClick={() => handleOpenAction(row.original, 'ADD')}>
            <PlusCircle className="h-3.5 w-3.5" /> Add
          </Button>
          <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl hover:bg-blue-50 text-blue-600 font-bold text-[10px] uppercase gap-1.5" onClick={() => handleOpenAction(row.original, 'ADJUST')}>
            <ArrowRightLeft className="h-3.5 w-3.5" /> Adjust
          </Button>
          <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-[10px] uppercase gap-1.5" onClick={() => handleOpenLog(row.original)}>
            <History className="h-3.5 w-3.5" /> Log
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-400">Product not found</h2>
        <Link href="/admin/stock">
          <Button variant="link" className="text-pink-500 mt-4">Back to Stock Management</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Product Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-white/5 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Package size={120} className="text-slate-900 dark:text-white" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="h-32 w-32 rounded-3xl bg-slate-50 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-white/10 shrink-0 shadow-inner">
            {product.imageUrl ? (
              <img src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8081${product.imageUrl}`} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-300"><Package size={40} /></div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/admin/stock" className="text-pink-500 hover:text-pink-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Back to Master List</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Badge variant="secondary" className="bg-pink-50 text-pink-600 font-bold text-[10px] uppercase px-4 py-1.5 rounded-full border-none shadow-sm ring-1 ring-pink-100">
                {product.category?.name}
              </Badge>
              <Badge variant="outline" className="border-slate-200 text-slate-500 font-bold text-[10px] uppercase px-4 py-1.5 rounded-full bg-white shadow-sm">
                {product.variants.length} Variants
              </Badge>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300 mx-1" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Stock: <span className="text-slate-900 dark:text-white font-bold ml-1">{product.variants.reduce((sum, v) => sum + v.stock, 0)}</span></p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-10 p-1.5 bg-slate-50 dark:bg-white/5 rounded-2xl w-fit shadow-inner">
          <button 
            onClick={() => setActiveTab('variants')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'variants' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md ring-1 ring-slate-100 dark:ring-white/10' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutGrid className="h-4 w-4" /> Variants List
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md ring-1 ring-slate-100 dark:ring-white/10' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <History className="h-4 w-4" /> Product History
          </button>
        </div>
      </div>

      {activeTab === 'variants' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CrudTable
            data={product.variants}
            columns={variantColumns}
            searchKey="variants"
            hasActions={false}
          />
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="px-8 py-6">Timestamp</th>
                  <th className="px-6 py-6">Variant / SKU</th>
                  <th className="px-6 py-6 text-center">Type</th>
                  <th className="px-6 py-6 text-center">Quantity</th>
                  <th className="px-8 py-6">Handled By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {isHistoryLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                    </td>
                  </tr>
                ) : history.length > 0 ? (
                  history.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Calendar className="h-3.5 w-3.5 text-slate-300" />
                          <span className="text-[10px] font-bold whitespace-nowrap">
                            {new Date(tx.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{tx.sku}</span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <Badge 
                          variant="secondary" 
                          className={`text-[9px] font-bold uppercase px-3 py-1 rounded-full ${
                            tx.type === 'ADDITION' ? 'bg-emerald-50 text-emerald-600' : 
                            tx.type === 'ADJUSTMENT' ? 'bg-blue-50 text-blue-600' : 
                            tx.type === 'INITIAL' ? 'bg-slate-100 text-slate-600' : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {tx.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className={`text-lg font-bold ${
                          tx.quantity > 0 ? 'text-emerald-600' : 
                          tx.quantity < 0 ? 'text-rose-600' : 'text-slate-600'
                        }`}>
                          {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-white/10">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter">{tx.createdBy}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No transaction history for this product yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* History Pagination */}
          {historyTotalPages > 1 && (
            <div className="p-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-10 font-bold uppercase text-[10px] tracking-widest"
                disabled={historyPage === 0}
                onClick={() => setHistoryPage(historyPage - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-10 font-bold uppercase text-[10px] tracking-widest"
                disabled={historyPage >= historyTotalPages - 1}
                onClick={() => setHistoryPage(historyPage + 1)}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Action Dialog (Add/Adjust) */}
      <Dialog open={modalType === 'ADD' || modalType === 'ADJUST'} onOpenChange={(open) => !open && setModalType(null)}>
        <DialogContent className="rounded-[2.5rem] sm:max-w-[425px]">
          <DialogHeader className="gap-2">
            <DialogTitle className="text-2xl font-bold uppercase tracking-tight">
              {modalType === 'ADD' ? 'Restock Inventory' : 'Inventory Fix'}
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-bold text-[10px] uppercase italic tracking-widest">
              Updating stock for variant <span className="text-pink-500">{selectedVariant?.sku}</span> ({selectedVariant?.size} / {selectedVariant?.color})
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-6">
            <div className="grid gap-3">
              <Label htmlFor="amount" className="font-bold uppercase tracking-widest text-[10px] text-slate-400">
                {modalType === 'ADD' ? 'Quantity to Add' : 'New Stock Total'}
              </Label>
              <Input
                id="amount"
                type="number"
                className="h-14 rounded-2xl border-slate-200 text-xl font-bold focus-visible:ring-pink-500 bg-slate-50/50 shadow-inner"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="notes" className="font-bold uppercase tracking-widest text-[10px] text-slate-400">Internal Audit Note</Label>
              <textarea
                id="notes"
                className="min-h-[100px] w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium shadow-inner"
                placeholder="Why is this stock being updated? (e.g., Weekly restock, Damage correction)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-3 sm:justify-start">
            <Button 
              className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl h-14 flex-1 font-bold uppercase tracking-widest shadow-lg shadow-pink-500/20" 
              onClick={handleAction}
              disabled={isActionLoading}
            >
              {isActionLoading ? 'Processing...' : 'Confirm Update'}
            </Button>
            <Button 
              variant="ghost" 
              className="rounded-2xl h-14 px-8 font-bold uppercase text-[10px] text-slate-400" 
              onClick={() => setModalType(null)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Variant Log Dialog */}
      <Dialog open={modalType === 'LOG'} onOpenChange={(open) => !open && setModalType(null)}>
        <DialogContent className="rounded-[2.5rem] sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="gap-2">
            <DialogTitle className="text-2xl font-bold uppercase tracking-tight">
              Variant Audit Trail
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-bold text-[10px] uppercase italic tracking-widest">
              Stock movement history for <span className="text-pink-500">{selectedVariant?.sku}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-6 pr-2">
            {isVariantHistoryLoading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
              </div>
            ) : variantHistory.length > 0 ? (
              <div className="space-y-4">
                {variantHistory.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:shadow-md transition-all">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === 'ADDITION' ? 'bg-emerald-100 text-emerald-600' : 
                      tx.type === 'ADJUSTMENT' ? 'bg-blue-100 text-blue-600' : 
                      tx.type === 'INITIAL' ? 'bg-slate-200 text-slate-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {tx.quantity > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold uppercase tracking-tight text-slate-900 truncate">
                          {tx.type} · <span className={tx.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}>{tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}</span> Items
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(tx.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{tx.notes || 'No audit notes provided.'}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <User size={10} className="text-slate-300" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Handled by {tx.createdBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No movement recorded for this variant.</p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 border-t pt-4">
            <Button 
              variant="outline" 
              className="rounded-full w-full h-12 font-bold uppercase text-[10px] tracking-widest" 
              onClick={() => setModalType(null)}
            >
              Close History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
