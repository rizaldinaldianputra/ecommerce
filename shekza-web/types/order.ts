export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED' | 'COMPLAINT' | 'RETURNED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  totalAmount: number;
  status: OrderStatus;
  trackingNumber?: string;
  complaintNotes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
