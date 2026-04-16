export interface FlashSaleItem {
  id?: number;
  productId: number;
  variantId: number;
  productName?: string;
  discountPrice: number;
  stockLimit?: number;
  soldCount?: number;
}

export interface FlashSale {
  id?: number;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  items: FlashSaleItem[];
  createdAt?: string;
}
