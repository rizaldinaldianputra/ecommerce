'use client';

import { motion } from 'framer-motion';

interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className = "w-full h-4" }: ShimmerProps) {
  return (
    <div className={`relative overflow-hidden bg-neutral-200 rounded-xl ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer -translate-x-full" />
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <Shimmer className="aspect-[4/5] rounded-[2rem]" />
      <div className="space-y-2">
        <Shimmer className="w-3/4 h-6" />
        <Shimmer className="w-1/2 h-4" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-80 space-y-6">
        <Shimmer className="h-64 rounded-[2.5rem]" />
      </div>
      <div className="flex-1 space-y-8">
        <Shimmer className="h-96 rounded-[2.5rem]" />
        <div className="grid grid-cols-3 gap-6">
          <Shimmer className="h-32 rounded-3xl" />
          <Shimmer className="h-32 rounded-3xl" />
          <Shimmer className="h-32 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
