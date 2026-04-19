export interface ContentItem {
  id?: number;
  platform?: 'WEB' | 'MOBILE' | 'ALL';
  type?: string;
  tag?: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  ctaText?: string;
  linkUrl?: string;
  emoji?: string;
  iconName?: string;
  productId?: number;
  styleConfig?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  bgFrom: string;
  bgTo: string;
  accent: string;
  image: string;
  badge: string;
}
