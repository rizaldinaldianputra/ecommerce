-- Create content_section table
CREATE TABLE IF NOT EXISTS content_section (
    id BIGSERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL DEFAULT 'WEB',
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add section_id to content_item if not already there
-- (The user said it's already there, but we ensure it)
ALTER TABLE content_item ADD COLUMN IF NOT EXISTS section_id BIGINT;

-- If there's a NOT NULL constraint and no sections exist, we might want to relax it 
-- or create a default section.
-- For now, we just ensure the column exists. 
-- The user said it violates NOT NULL, so it IS already there and NOT NULL.

-- Recommendation: To fix existing data, create a default section and assign items to it.
-- INSERT INTO content_section (type, title, platform) VALUES ('GENERAL', 'General Section', 'WEB');
-- UPDATE content_item SET section_id = (SELECT id FROM content_section LIMIT 1) WHERE section_id IS NULL;
