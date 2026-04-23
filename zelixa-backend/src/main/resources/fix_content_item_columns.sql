-- 1. Add basic and metadata columns
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS tag VARCHAR(100);
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS cta_text VARCHAR(100);
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS badge_text VARCHAR(100);
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS icon_name VARCHAR(100);
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS emoji VARCHAR(50);
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS style_config VARCHAR(500);

-- 2. Add scheduling and rich content columns
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS start_date TIMESTAMP;
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS end_date TIMESTAMP;
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS content_body TEXT;
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS banner_url VARCHAR(500);
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS product_ids VARCHAR(1000);

-- 3. Ensure critical columns are NOT NULL for future inserts (matching the JPA entity)
ALTER TABLE content_item ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE content_item ALTER COLUMN created_at SET NOT NULL;
