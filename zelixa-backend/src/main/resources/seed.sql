-- Roles
INSERT INTO roles (name) VALUES ('ROLE_ADMIN') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('ROLE_USER') ON CONFLICT (name) DO NOTHING;

-- Categories
INSERT INTO category (name, slug, description, is_active, created_at) VALUES 
('T-Shirts', 't-shirts', 'Premium quality cotton t-shirts', true, NOW()),
('Jeans', 'jeans', 'Stylish and durable denim jeans', true, NOW()),
('Jackets', 'jackets', 'Trendy jackets for all seasons', true, NOW()),
('Accessories', 'accessories', 'Complete your look with our accessories', true, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO product (name, slug, description, short_description, category_id, is_active, is_featured, created_at) VALUES 
('Classic White T-Shirt', 'classic-white-t-shirt', 'A premium classic white t-shirt made from 100% organic cotton.', 'Premium organic cotton white tee', (SELECT id FROM category WHERE slug = 't-shirts'), true, true, NOW()),
('Slim Fit Blue Jeans', 'slim-fit-blue-jeans', 'Comfortable slim fit blue jeans with a modern wash.', 'Modern slim fit blue jeans', (SELECT id FROM category WHERE slug = 'jeans'), true, true, NOW()),
('Leather Biker Jacket', 'leather-biker-jacket', 'Authentic black leather biker jacket with silver hardware.', 'Authentic leather biker jacket', (SELECT id FROM category WHERE slug = 'jackets'), true, true, NOW()),
('Leather Minimalist Wallet', 'leather-minimalist-wallet', 'Sleek leather wallet that fits easily in your pocket.', 'Sleek leather wallet', (SELECT id FROM category WHERE slug = 'accessories'), true, false, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Product Variants (Stock and Prices)
INSERT INTO product_variant (product_id, sku, size, color, price, stock, is_active, created_at) VALUES 
((SELECT id FROM product WHERE slug = 'classic-white-t-shirt'), 'WT-SML-WHT', 'S', 'White', 150000.00, 100, true, NOW()),
((SELECT id FROM product WHERE slug = 'classic-white-t-shirt'), 'WT-MED-WHT', 'M', 'White', 150000.00, 100, true, NOW()),
((SELECT id FROM product WHERE slug = 'classic-white-t-shirt'), 'WT-LRG-WHT', 'L', 'White', 150000.00, 100, true, NOW()),
((SELECT id FROM product WHERE slug = 'slim-fit-blue-jeans'), 'BJ-30-BLU', '30', 'Blue', 450000.00, 50, true, NOW()),
((SELECT id FROM product WHERE slug = 'slim-fit-blue-jeans'), 'BJ-32-BLU', '32', 'Blue', 450000.00, 50, true, NOW()),
((SELECT id FROM product WHERE slug = 'leather-biker-jacket'), 'LJ-MED-BLK', 'M', 'Black', 1200000.00, 20, true, NOW()),
((SELECT id FROM product WHERE slug = 'leather-minimalist-wallet'), 'WL-MIN-BRN', 'Standard', 'Brown', 250000.00, 30, true, NOW())
ON CONFLICT (sku) DO NOTHING;

-- Vouchers
INSERT INTO voucher (code, discount_amount, min_purchase, valid_until, is_active, created_at) VALUES 
('WELCOME10', 10000.00, 50000.00, '2026-12-31', true, NOW()),
('SHEKZA20', 20000.00, 100000.00, '2026-12-31', true, NOW()),
('FREESHIP', 0.00, 150000.00, '2026-12-31', true, NOW())
ON CONFLICT (code) DO NOTHING;

-- Content Sections
INSERT INTO content_section (title, type, display_order, is_active)
SELECT 'Main Hero Banner', 'CAROUSEL', 1, true WHERE NOT EXISTS (SELECT 1 FROM content_section WHERE title = 'Main Hero Banner');
INSERT INTO content_section (title, type, display_order, is_active)
SELECT 'Featured Categories', 'GRID', 2, true WHERE NOT EXISTS (SELECT 1 FROM content_section WHERE title = 'Featured Categories');
INSERT INTO content_section (title, type, display_order, is_active)
SELECT 'New Arrivals', 'GRID', 3, true WHERE NOT EXISTS (SELECT 1 FROM content_section WHERE title = 'New Arrivals');

-- Content Items
INSERT INTO content_item (section_id, title, subtitle, image_url, link_url, display_order)
SELECT (SELECT id FROM content_section WHERE title = 'Main Hero Banner'), 'Summer Sale', 'Get up to 50% off on all summer items!', 'https://example.com/banners/summer-sale.jpg', '/products?sale=summer', 1
WHERE NOT EXISTS (SELECT 1 FROM content_item WHERE title = 'Summer Sale' AND section_id = (SELECT id FROM content_section WHERE title = 'Main Hero Banner'));

INSERT INTO content_item (section_id, title, subtitle, image_url, link_url, display_order)
SELECT (SELECT id FROM content_section WHERE title = 'Main Hero Banner'), 'New Collection', 'Explore our latest arrivals', 'https://example.com/banners/new-collection.jpg', '/products?new=true', 2
WHERE NOT EXISTS (SELECT 1 FROM content_item WHERE title = 'New Collection' AND section_id = (SELECT id FROM content_section WHERE title = 'Main Hero Banner'));

INSERT INTO content_item (section_id, title, subtitle, image_url, link_url, display_order)
SELECT (SELECT id FROM content_section WHERE title = 'Featured Categories'), 'Men''s Fashion', 'Explore Men''s style', 'https://example.com/categories/mens.jpg', '/categories/mens', 1
WHERE NOT EXISTS (SELECT 1 FROM content_item WHERE title = 'Men''s Fashion' AND section_id = (SELECT id FROM content_section WHERE title = 'Featured Categories'));

INSERT INTO content_item (section_id, title, subtitle, image_url, link_url, display_order)
SELECT (SELECT id FROM content_section WHERE title = 'Featured Categories'), 'Women''s Fashion', 'Explore Women''s style', 'https://example.com/categories/womens.jpg', '/categories/womens', 2
WHERE NOT EXISTS (SELECT 1 FROM content_item WHERE title = 'Women''s Fashion' AND section_id = (SELECT id FROM content_section WHERE title = 'Featured Categories'));

-- News
INSERT INTO news (title, slug, content, image_url, is_active, published_at) VALUES 
('Zelixa App Launched!', 'zelixa-app-launched', 'We are excited to announce the launch of our new e-commerce app.', 'https://example.com/news/launch.jpg', true, NOW()),
('Summer Collection 2026', 'summer-collection-2026', 'Explore the hottest trends of this summer.', 'https://example.com/news/summer.jpg', true, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Flash Sales
INSERT INTO flash_sale (name, title, start_time, end_time, is_active)
SELECT 'Midnight Madness Sale', 'Midnight Madness', NOW(), NOW() + INTERVAL '24 hours', true
WHERE NOT EXISTS (SELECT 1 FROM flash_sale WHERE name = 'Midnight Madness Sale');
