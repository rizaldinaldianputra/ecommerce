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
}

export interface ContentSection {
  id?: number;
  platform: 'WEB' | 'MOBILE' | 'ALL';
  type: string;
  title?: string;
  subtitle?: string;
  displayOrder: number;
  isActive: boolean;
  items: ContentItem[];
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

export interface FeaturedProductsProps {
  section?: ContentSection;
}

export interface FlashSaleProps {
  section?: ContentSection;
}

export interface BrandsSectionProps {
  section?: ContentSection;
}

export interface TestimonialsProps {
  section?: ContentSection;
}

export interface SocialSectionProps {
  section?: ContentSection;
}

export interface RecommendationsProps {
  section?: ContentSection;
}
