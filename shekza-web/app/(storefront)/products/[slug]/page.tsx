'use client';

import ProductDetail from '@/components/storefront/ProductDetail';
import FeaturedProducts from '@/components/storefront/FeaturedProducts';

const dummyProduct = {
  id: 1,
  name: 'Pastel Dream Hoodie',
  price: 49.99,
  originalPrice: 79.99,
  rating: 4.8,
  reviews: 1240,
  description: 'Experience ultimate comfort with our Pastel Dream Hoodie. Crafted from a premium cotton blend, this oversized hoodie features a soft brushed interior, dropped shoulders, and a spacious kanga pocket. Perfect for lounging or adding an aesthetic touch to your street style.',
  images: [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1556821840-d1643f61530d?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1556821840-02c38848d708?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=1200',
  ],
  colors: ['Pink', 'White', 'Black'],
  sizes: ['S', 'M', 'L', 'XL'],
  stock: 12,
  features: [
    '100% Organic Cotton',
    'Heavyweight 400GSM',
    'Pre-shrunk for perfect fit',
    'Ethically sourced',
  ]
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <div className="bg-white">
      <ProductDetail product={dummyProduct} />
      
      {/* Related Products */}
      <div className="border-t border-neutral-100 mt-20">
        <FeaturedProducts />
      </div>
    </div>
  );
}
