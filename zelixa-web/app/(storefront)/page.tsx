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
  // Fetch active sections for WEB platform
  const sections = await ContentService.getSections('WEB');
  const activeSections = sections.filter(s => s.isActive);

  // Fallback for empty sections: Show a message or a default set
  if (activeSections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <p className="font-bold uppercase tracking-widest text-xs">No content available</p>
      </div>
    );
  }

  return (
    <>
      <SeoScript pageName="HOME" />
      
      {activeSections.map((section) => {
        const { type, items } = section;
        if (!items || items.length === 0) return null;

        switch (type) {
          case 'HERO_CAROUSEL':
            return <HeroBanner key={section.id} items={items} />;
          
          case 'FEATURED_PRODUCTS':
            return <FeaturedProducts key={section.id} items={items} />;
          
          case 'FLASH_SALE_WEB':
            return <FlashSale key={section.id} items={items} />;
          
          case 'RECOMMENDED_PRODUCTS':
            return <Recommendations key={section.id} items={items} />;
          
          case 'BRANDS_SECTION':
            return <BrandsSection key={section.id} items={items} />;
          
          case 'SHOP_THE_LOOK':
            return <SocialSection key={section.id} items={items} />;
          
          case 'TESTIMONIALS':
            return <Testimonials key={section.id} items={items} />;
          
          case 'NEWSLETTER':
            return <Newsletter key={section.id} items={items} />;
          
          default:
            return null;
        }
      })}
    </>
  );
}
