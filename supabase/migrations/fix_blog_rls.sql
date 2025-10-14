-- Drop existing blog policies
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admin can manage blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can view blog images" ON public.blog_images;
DROP POLICY IF EXISTS "Admin can manage blog images" ON public.blog_images;

-- Recreate policies without circular reference
-- Anyone can view published posts
CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (published = TRUE);

-- Authenticated users can insert/update/delete (we'll check admin in the app)
CREATE POLICY "Authenticated users can manage blog posts"
  ON public.blog_posts FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Anyone can view blog images
CREATE POLICY "Anyone can view blog images"
  ON public.blog_images FOR SELECT
  USING (TRUE);

-- Authenticated users can manage blog images
CREATE POLICY "Authenticated users can manage blog images"
  ON public.blog_images FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
