export interface Review {
  id: number;
  productId: number;
  productName?: string;
  userId: number;
  userName?: string;
  rating: number;
  comment: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
