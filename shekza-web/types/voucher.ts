export interface Voucher {
  id: number;
  code: string;
  discountAmount: number;
  minPurchase: number;
  validUntil: string;
  isActive: boolean;
  // UI helpers
  title?: string;
  desc?: string;
}
