import { SeoService } from "@/services/seo.service";

interface SeoScriptProps {
  pageName: string;
}

export default async function SeoScript({ pageName }: SeoScriptProps) {
  try {
    const seo = await SeoService.getByPageName(pageName);
    
    // Gracefully handle missing SEO config or script code
    if (!seo || !seo.scriptCode) {
      return null;
    }

    return (
      <div 
        style={{ display: 'none' }}
        className="seo-header-scripts"
        dangerouslySetInnerHTML={{ __html: seo.scriptCode }} 
      />
    );
  } catch (error) {
    // Only log real errors (like network failures), 
    // as "not found" is already handled by SeoService and returns null.
    console.error(`Failed to load SEO script for ${pageName}:`, error);
    return null;
  }
}
