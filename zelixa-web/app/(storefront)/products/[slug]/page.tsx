'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductDetail from '@/components/storefront/ProductDetail';
import FeaturedProducts from '@/components/storefront/FeaturedProducts';
import { ProductService } from '@/services/product.service';
import { Product } from '@/types/product';
import ProductReviews from '@/components/storefront/ProductReviews';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const data = await ProductService.getBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Product Not Found</h1>
        <p className="text-neutral-500">The product you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <ProductDetail product={product as any} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductReviews productId={product.id} />
      </div>

      {/* Related Products */}
      <div className="border-t border-neutral-100 mt-20">
        <FeaturedProducts />
      </div>
    </div>
  );
}
