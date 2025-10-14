-- Disable RLS on storage.objects to break recursion
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Drop ALL storage policies
DROP POLICY IF EXISTS "Admin can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete photos" ON storage.objects;
DROP POLICY IF EXISTS "Customers can view assigned photos" ON storage.objects;
