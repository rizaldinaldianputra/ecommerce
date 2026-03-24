import HeroBanner from '@/components/storefront/HeroBanner';
import FeaturedProducts from '@/components/storefront/FeaturedProducts';
import FlashSale from '@/components/storefront/FlashSale';
import Recommendations from '@/components/storefront/Recommendations';
import PromoBanners from '@/components/storefront/PromoBanners';
import BrandsSection from '@/components/storefront/BrandsSection';
import Testimonials from '@/components/storefront/Testimonials';
import Newsletter from '@/components/storefront/Newsletter';
import SocialSection from '@/components/storefront/SocialSection';

export default function StorefrontHome() {
  return (
    <>
      {/* 1. Hero Slider */}
      <HeroBanner />
      
      {/* 3. Featured Products */}
      <FeaturedProducts />

      {/* 4. Flash Sale with Countdown */}
      <FlashSale />

      {/* 5. Recommendations Carousel */}
      <Recommendations />

      {/* 6. Promo Banners (Shipping, BOGO, Cashback) */}
      <PromoBanners />

      {/* 7. Brands Marquee */}
      <BrandsSection />

      {/* 8. Testimonials Slider */}
      <Testimonials />

      {/* 10. Social / Instagram Feed */}
      <SocialSection />

      {/* 11. Newsletter Signup */}
      <Newsletter />
    </>
  );
}
