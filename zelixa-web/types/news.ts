export interface News {
  id?: number;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
  isActive: boolean;
  publishedAt?: string;
  createdAt?: string;
}
