import { Category } from './category';

export interface ProductVariant {
  id: number;
  sku: string;
  size?: string;
  color?: string;
  hexColor?: string;
  price: number;
  discountPrice?: number;
  costPrice?: number;
  barcode?: string;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt?: string;
}

export interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  shortDescription?: string;
  categoryId: number;
  brandId?: number;
  gender?: 'MEN' | 'WOMEN' | 'UNISEX';
  material?: string;
  weight?: number;
  isActive: boolean;
  isFeatured: boolean;
  category?: Category;
  variants: ProductVariant[];
  images?: string[];
  // UI helpers
  price?: number; // fallback or lowest price
  qty?: number;   // total stock
  img?: string;   // primary image url
}
