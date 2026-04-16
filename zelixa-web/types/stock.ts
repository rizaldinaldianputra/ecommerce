export interface StockTransaction {
  id: number;
  variantId: number;
  sku: string;
  productName: string;
  productId: number;
  quantity: number;
  type: 'ADDITION' | 'ADJUSTMENT' | 'INITIAL' | 'SALE' | 'RETURN';
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface StockSummary {
  variantId: number;
  sku: string;
  productName: string;
  currentStock: number;
  totalIn: number;
  totalOut: number;
}

export interface StockTransactionRequest {
  variantId: number;
  quantity: number;
  notes: string;
}
