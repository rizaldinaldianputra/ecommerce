import { CartItemResponse, CartItemRequest } from './cart';

export interface CartContextType {
  cartItems: CartItemResponse[];
  cartCount: number;
  totalAmount: number;
  isLoading: boolean;
  addToCart: (request: CartItemRequest) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export interface WishlistContextType {
  wishlistItems: any[]; // Adjust when actual items are implemented
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: any) => void;
  isLoading: boolean;
}
