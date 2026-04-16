export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED' | 'COMPLAINT' | 'RETURNED' | 'all' | 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';

export interface OrderItem {
  id: number | string;
  productId: number;
  productName?: string;
  name?: string;
  groupName?: string;
  size?: string;
  color?: string;
  quantity: number;
  qty?: number;
  price: number;
  img?: string;
  imageUrl?: string;
}

export interface Order {
  id: number | string;
  orderNumber?: string;
  userId?: number;
  totalAmount?: number;
  total?: number;
  status: OrderStatus;
  trackingNumber?: string;
  complaintNotes?: string;
  paymentToken?: string;
  paymentUrl?: string;
  shippingAmount?: number;
  shippingService?: string;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  items: OrderItem[];
  courier?: string;
  deliveryDate?: string;
}

export interface CheckoutRequest {
  shippingService?: string;
  destinationSubdistrictId?: string;
  shippingAmount?: number;
  voucherCode?: string;
  addressLine?: string;
  note?: string;
}

export interface CheckoutResponse extends Order {
  paymentToken: string;
  paymentUrl: string;
}

export interface OrderTab {
  id: OrderStatus | 'all';
  label: string;
}
