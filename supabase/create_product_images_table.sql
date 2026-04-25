-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create policy for public read
CREATE POLICY "Allow public read" ON product_images
  FOR SELECT USING (true);

-- Insert sample images for existing products
-- Gundam Aerial Full Mechanics
INSERT INTO product_images (product_id, url, display_order) VALUES
  ((SELECT id FROM products WHERE slug = 'gundam-aerial-full-mechanics'), 'https://picsum.photos/600/600?random=11', 0),
  ((SELECT id FROM products WHERE slug = 'gundam-aerial-full-mechanics'), 'https://picsum.photos/600/600?random=12', 1),
  ((SELECT id FROM products WHERE slug = 'gundam-aerial-full-mechanics'), 'https://picsum.photos/600/600?random=13', 2),
  ((SELECT id FROM products WHERE slug = 'gundam-aerial-full-mechanics'), 'https://picsum.photos/600/600?random=14', 3);

-- Gundam RX-78-2 Real Grade
INSERT INTO product_images (product_id, url, display_order) VALUES
  ((SELECT id FROM products WHERE slug = 'gundam-rx-78-2-real-grade'), 'https://picsum.photos/600/600?random=21', 0),
  ((SELECT id FROM products WHERE slug = 'gundam-rx-78-2-real-grade'), 'https://picsum.photos/600/600?random=22', 1),
  ((SELECT id FROM products WHERE slug = 'gundam-rx-78-2-real-grade'), 'https://picsum.photos/600/600?random=23', 2),
  ((SELECT id FROM products WHERE slug = 'gundam-rx-78-2-real-grade'), 'https://picsum.photos/600/600?random=24', 3);

-- Gundam Barbatos Master Grade
INSERT INTO product_images (product_id, url, display_order) VALUES
  ((SELECT id FROM products WHERE slug = 'gundam-barbatos-master-grade'), 'https://picsum.photos/600/600?random=31', 0),
  ((SELECT id FROM products WHERE slug = 'gundam-barbatos-master-grade'), 'https://picsum.photos/600/600?random=32', 1),
  ((SELECT id FROM products WHERE slug = 'gundam-barbatos-master-grade'), 'https://picsum.photos/600/600?random=33', 2),
  ((SELECT id FROM products WHERE slug = 'gundam-barbatos-master-grade'), 'https://picsum.photos/600/600?random=34', 3);
