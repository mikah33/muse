-- Make author_id nullable and remove foreign key constraint
ALTER TABLE public.blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;

ALTER TABLE public.blog_posts
  ALTER COLUMN author_id DROP NOT NULL;

-- Add back foreign key but make it optional
ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_author_id_fkey
  FOREIGN KEY (author_id)
  REFERENCES public.users(id)
  ON DELETE SET NULL;
