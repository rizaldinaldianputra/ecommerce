export interface CartItemResponse {
  id: number;
  productId: number;
  productName: string;
  productVariantId: number;
  size: string;
  color: string;
  groupName: string;
  price: number;
  discountPrice: number;
  quantity: number;
  imageUrl: string;
}

export interface CartItemRequest {
  productVariantId: number;
  quantity: number;
}
