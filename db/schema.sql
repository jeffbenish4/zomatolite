-- Zomato Lite schema and sample data.
-- Run in the Neon SQL Editor. No computed rating columns are stored.

CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  area TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO restaurants (id, name, cuisine, area)
VALUES (1, 'Ludhiana Burrito', 'Indian', 'Sector 32')
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    cuisine = EXCLUDED.cuisine,
    area = EXCLUDED.area;

-- Insert the three example reviews only if this seed has not already been applied.
INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT 1, seed.rating, seed.comment, NOW() - (seed.days_ago || ' days')::interval
FROM (VALUES
  (5, 'Paneer burrito is unreal', 8),
  (4, 'Good, but slow service', 6),
  (4, 'Solid. Would repeat.', 2)
) AS seed(rating, comment, days_ago)
WHERE NOT EXISTS (
  SELECT 1
  FROM reviews existing
  WHERE existing.restaurant_id = 1
    AND existing.comment = seed.comment
);

-- Keep the seeded restaurant ID stable for /restaurant/1.
SELECT setval(
  pg_get_serial_sequence('restaurants', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM restaurants), 1),
  true
);
