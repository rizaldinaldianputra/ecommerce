'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Edit, Eye, Trash2, ToggleRight, Search, Plus, History, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { CrudTableProps } from '@/types/admin';

export function CrudTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onAdd,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onHistory,
  hasActions = true,
  isLoading = false,
}: CrudTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const tableColumns = React.useMemo(() => {
    if (!hasActions) return columns;
    return [
      ...columns,
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: { row: any }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-1">
              {onView && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" onClick={() => onView(item)} className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl">
                    <Eye className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              {onEdit && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-8 w-8 text-pink-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-xl">
                    <Edit className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              {onToggleStatus && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" onClick={() => onToggleStatus(item)} className="h-8 w-8 text-slate-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-xl">
                    <ToggleRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              {onHistory && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" onClick={() => onHistory(item)} className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl">
                    <History className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              {onDelete && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(item)} className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          );
        },
      },
    ];
  }, [columns, hasActions, onView, onEdit, onDelete, onToggleStatus, onHistory]);

  const table = useReactTable({
    data,
    columns: tableColumns as ColumnDef<TData, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  const totalEntries = data.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const from = totalEntries === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalEntries);

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {searchKey && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={`Search ${searchKey}...`}
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 rounded-full text-slate-900 dark:text-white placeholder:text-slate-400 h-10"
            />
          </div>
        )}
        {onAdd && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={onAdd}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full shadow-lg shadow-pink-500/25 h-10 px-5 text-sm font-bold"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Record
            </Button>
          </motion.div>
        )}
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 dark:bg-black/40 border-b border-slate-100 dark:border-white/8">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="h-11 px-4 align-middle font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                // Skeleton rows
                [...Array(5)].map((_, i) => (
                  <tr key={`skel-${i}`} className="border-b border-slate-50 dark:border-white/5">
                    {tableColumns.map((_, j) => (
                      <td key={j} className="p-4">
                        <motion.div
                          className="h-4 bg-slate-100 dark:bg-white/5 rounded-full"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: (i + j) * 0.05 }}
                          style={{ width: `${60 + Math.random() * 30}%` }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows?.length ? (
                <AnimatePresence>
                  {table.getRowModel().rows.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="hover:bg-slate-50/80 dark:hover:bg-white/4 transition-colors border-b border-slate-50 dark:border-white/5 group"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-4 align-middle text-slate-700 dark:text-slate-300">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={tableColumns.length} className="py-16 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                        <FileSearch className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="font-bold text-slate-400 dark:text-slate-500">No records found</p>
                      {onAdd && (
                        <button
                          onClick={onAdd}
                          className="text-xs font-bold text-pink-500 hover:text-pink-600 underline underline-offset-2 transition-colors"
                        >
                          + Add your first record
                        </button>
                      )}
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalEntries > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
            Showing <span className="text-slate-600 dark:text-slate-300 font-bold">{from}–{to}</span> of{' '}
            <span className="text-slate-600 dark:text-slate-300 font-bold">{totalEntries}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="rounded-full h-8 w-8 p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </motion.div>
            <span className="text-xs font-bold text-slate-500 px-1">
              {pageIndex + 1} / {table.getPageCount() || 1}
            </span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="rounded-full h-8 w-8 p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
