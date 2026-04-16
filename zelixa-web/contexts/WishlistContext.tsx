'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { WishlistItemResponse } from '@/types/wishlist';
import { wishlistService } from '@/services/wishlist.service';

interface WishlistContextType {
  wishlistItems: WishlistItemResponse[];
  wishlistCount: number;
  isLoading: boolean;
  toggleWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (id: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!authService.isLoggedIn()) {
      setWishlistItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const items = await wishlistService.getWishlist();
      setWishlistItems(items);
    } catch (error: any) {
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        setWishlistItems([]);
      } else {
        console.warn('Failed to fetch wishlist:', error.message || error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWishlist();
    const handleAuthChange = () => refreshWishlist();
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [refreshWishlist]);

  const toggleWishlist = async (productId: number) => {
    if (!authService.isLoggedIn()) {
      toast.error('Please login to manage wishlist');
      return;
    }
    try {
      await wishlistService.toggleWishlist(productId);
      await refreshWishlist();
      // No toast here as it's a toggle, the UI should reflect the change
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  const removeFromWishlist = async (id: number) => {
    try {
      await wishlistService.removeFromWishlist(id);
      await refreshWishlist();
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount,
      isLoading,
      toggleWishlist,
      removeFromWishlist,
      isInWishlist,
      refreshWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
