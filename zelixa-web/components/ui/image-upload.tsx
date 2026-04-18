'use client';

import { useState } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUploadService } from '@/services/file-upload.service';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setIsUploading(true);
    try {
      const url = await FileUploadService.upload(file);
      onChange(url);
      setPreview(null);
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } catch (error) {
      setPreview(null);
      toast({ title: 'Error', description: 'Failed to upload image', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const currentImageUrl = value ? (value.startsWith('http') ? value : `https://api.zelixa.my.id${value}`) : null;
  const displayUrl = preview || currentImageUrl;

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-4">
        {displayUrl ? (
          <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-white/10 group">
            <img 
              src={displayUrl} 
              alt="Upload" 
              className="w-full h-full object-cover transition-transform group-hover:scale-105" 
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
            {!isUploading && (
              <button
                onClick={() => {
                  onChange('');
                  setPreview(null);
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl cursor-pointer hover:border-pink-500 hover:bg-pink-50/10 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-slate-400 group-hover:text-pink-500 transition-colors" />
                  <p className="mt-2 text-xs text-slate-500 group-hover:text-pink-600">Click to upload</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={onUpload} 
              disabled={disabled || isUploading} 
            />
          </label>
        )}
      </div>
    </div>
  );
}
