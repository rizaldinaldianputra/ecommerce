import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ChatFAB from '@/components/storefront/ChatFAB';
import StorefrontAesthetic from '@/components/storefront/StorefrontAesthetic';
import SeoScript from '@/components/storefront/SeoScript';

export const dynamic = 'force-dynamic';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen relative bg-white selection:bg-pink-100 selection:text-pink-600">
      {/* Global Aesthetic Background */}
      <StorefrontAesthetic />
      
      {/* Global SEO Header Code */}
      <SeoScript pageName="GLOBAL" />
      
      <Navbar />
      <main className="flex-grow relative z-10">{children}</main>
      <ChatFAB />
      <Footer />
    </div>
  );
}
