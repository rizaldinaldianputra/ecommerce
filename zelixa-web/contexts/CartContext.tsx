'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '@/services/cart.service';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { CartItemResponse, CartItemRequest } from '@/types/cart';
import { CartContextType } from '@/types/context';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!authService.isLoggedIn()) {
      setCartItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const items = await cartService.getCart();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
    
    const handleAuthChange = () => {
      refreshCart();
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [refreshCart]);

  const addToCart = async (request: CartItemRequest) => {
    if (!authService.isLoggedIn()) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await cartService.addToCart(request);
      await refreshCart();
      toast.success('Added to cart successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    try {
      await cartService.updateQuantity(id, quantity);
      await refreshCart();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      await cartService.removeFromCart(id);
      await refreshCart();
      toast.success('Removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await refreshCart();
      toast.success('Cart cleared');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear cart');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      totalAmount,
      isLoading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
