export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: number;
    discountPrice?: number;
    imageUrl?: string;
    category: string;
    isFeatured: boolean;
}
