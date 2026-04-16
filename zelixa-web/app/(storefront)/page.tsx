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
  const allSections = await ContentService.getStorefrontSections();

  // Explicitly separate Hero Carousel from other sections to ensure it's always at the top
  const heroSection = allSections.find(s => s.type === 'HERO_CAROUSEL');
  const otherSections = allSections.filter(s => s.type !== 'HERO_CAROUSEL');

  if (!allSections || allSections.length === 0) {
    return (
      <>
        <SeoScript pageName="HOME" />
        <HeroBanner />
        <FeaturedProducts />
        <FlashSale />
        <Recommendations />
        <BrandsSection />
        <Testimonials />
        <SocialSection />
        <Newsletter />
      </>
    );
  }

  return (
    <>
      <SeoScript pageName="HOME" />
      
      {/* Hero Carousel always comes first */}
      {heroSection && <HeroBanner key={heroSection.id} section={heroSection} />}
      {!heroSection && <HeroBanner />} {/* Fallback if no hero in CMS */}

      {/* Render the rest of the sections */}
      {otherSections.map((section) => {
        switch (section.type) {
          case 'FEATURED_PRODUCTS':
            return <FeaturedProducts key={section.id} section={section} />;
          case 'FLASH_SALE':
          case 'FLASH_SALE_WEB':
            return <FlashSale key={section.id} section={section} />;
          case 'RECOMMENDATIONS':
          case 'RECOMMENDED_PRODUCTS':
            return <Recommendations key={section.id} section={section} />;
          case 'BRANDS_MARQUEE':
          case 'BRANDS_SECTION':
            return <BrandsSection key={section.id} section={section} />;
          case 'TESTIMONIALS':
            return <Testimonials key={section.id} section={section} />;
          case 'SHOP_THE_LOOK':
            return <SocialSection key={section.id} section={section} />;
          default:
            return null;
        }
      })}

      <Newsletter />
    </>
  );
}
