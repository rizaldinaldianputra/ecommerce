-- Remove legacy SEO columns that are no longer part of the simplified SeoConfig entity
ALTER TABLE seo_config DROP COLUMN IF EXISTS title;
ALTER TABLE seo_config DROP COLUMN IF EXISTS meta_description;
ALTER TABLE seo_config DROP COLUMN IF EXISTS meta_keywords;
ALTER TABLE seo_config DROP COLUMN IF EXISTS og_title;
ALTER TABLE seo_config DROP COLUMN IF EXISTS og_description;
ALTER TABLE seo_config DROP COLUMN IF EXISTS og_image;
ALTER TABLE seo_config DROP COLUMN IF EXISTS twitter_card;
ALTER TABLE seo_config DROP COLUMN IF EXISTS twitter_site;
ALTER TABLE seo_config DROP COLUMN IF EXISTS twitter_creator;
