'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { CrudFormProps } from '@/types/admin';

export function CrudForm({
  title,
  subtitle,
  children,
  onSubmit,
  isLoading,
  onCancel,
  submitLabel = 'Save Changes'
}: CrudFormProps) {
  const router = useRouter();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel} className="rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/60 dark:hover:bg-black/60 transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="relative bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 md:p-10 overflow-hidden">
          
          <div className="space-y-8">
            {children}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="rounded-full px-6 bg-transparent border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full px-8 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30 border-0"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {submitLabel}
                </span>
              )}
            </Button>
          </div>
          
        </div>
      </form>
    </div>
  );
}
