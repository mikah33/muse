-- Make the blog-images bucket public (no authentication required)
UPDATE storage.buckets
SET public = true
WHERE id = 'blog-images';
