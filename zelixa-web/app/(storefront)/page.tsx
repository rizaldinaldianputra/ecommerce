import { Metadata } from 'next';
import HeroBanner from '@/components/storefront/HeroBanner';
import FeaturedProducts from '@/components/storefront/FeaturedProducts';
import FlashSale from '@/components/storefront/FlashSale';
import Recommendations from '@/components/storefront/Recommendations';
import BrandsSection from '@/components/storefront/BrandsSection';
import Testimonials from '@/components/storefront/Testimonials';
import Newsletter from '@/components/storefront/Newsletter';
import SocialSection from '@/components/storefront/SocialSection';
import { ContentService } from '@/services/content.service';
import SeoScript from '@/components/storefront/SeoScript';

export const metadata: Metadata = {
  title: 'Zelixa | Premium Aesthetic Store',
  description: 'Your one-stop destination for curated fashion, beauty, and lifestyle products.',
};

export default async function StorefrontHome() {
  // Fetch all core content types in parallel
  const [
    heroItems,
    featuredItems,
    flashSaleItems,
    recommendedItems,
    brandItems,
    testimonialItems,
    socialItems,
    newsletterItems
  ] = await Promise.all([
    ContentService.getItemsByType('HERO_CAROUSEL'),
    ContentService.getItemsByType('FEATURED_PRODUCTS'),
    ContentService.getItemsByType('FLASH_SALE_WEB'),
    ContentService.getItemsByType('RECOMMENDED_PRODUCTS'),
    ContentService.getItemsByType('BRANDS_SECTION'),
    ContentService.getItemsByType('TESTIMONIALS'),
    ContentService.getItemsByType('SHOP_THE_LOOK'),
    ContentService.getItemsByType('NEWSLETTER')
  ]);

  return (
    <>
      <SeoScript pageName="HOME" />
      
      {/* 1. Hero Carousel */}
      <HeroBanner items={heroItems} />

      {/* 2. Featured Products */}
      {featuredItems.length > 0 && <FeaturedProducts items={featuredItems} />}

      {/* 3. Flash Sale */}
      {flashSaleItems.length > 0 && <FlashSale items={flashSaleItems} />}

      {/* 4. Recommendations */}
      {recommendedItems.length > 0 && <Recommendations items={recommendedItems} />}

      {/* 5. Brands Section */}
      {brandItems.length > 0 && <BrandsSection items={brandItems} />}

      {/* 6. Shop the Look (Social) */}
      {socialItems.length > 0 && <SocialSection items={socialItems} />}

      {/* 7. Testimonials */}
      {testimonialItems.length > 0 && <Testimonials items={testimonialItems} />}

      {/* 8. Newsletter */}
      <Newsletter items={newsletterItems} />
    </>
  );
}
