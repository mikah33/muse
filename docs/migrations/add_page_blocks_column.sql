-- ============================================================================
-- ADD BLOCKS COLUMN TO CUSTOM_PAGES TABLE
-- ============================================================================
-- This migration adds a JSONB column for structured block data while
-- maintaining backward compatibility with existing HTML content.
-- ============================================================================
-- Migration Date: 2025-10-14
-- Version: 1.0.0
-- ============================================================================

-- ============================================================================
-- STEP 1: Add blocks JSONB column
-- ============================================================================

-- Add blocks column to store structured block data
ALTER TABLE custom_pages
  ADD COLUMN IF NOT EXISTS blocks JSONB DEFAULT '[]'::jsonb;

-- Add content_version column to track format ('html' or 'blocks')
ALTER TABLE custom_pages
  ADD COLUMN IF NOT EXISTS content_version TEXT DEFAULT 'html'
  CHECK (content_version IN ('html', 'blocks'));

-- Add comments explaining the columns
COMMENT ON COLUMN custom_pages.content IS
  'Legacy HTML content. Deprecated in favor of blocks column for content_version=''blocks''.';

COMMENT ON COLUMN custom_pages.blocks IS
  'Structured block data as JSONB array. Each block contains: id, type, content, and settings.
   Example structure:
   [
     {
       "id": "uuid-string",
       "type": "hero" | "text" | "image" | "gallery" | "cta",
       "content": { /* type-specific content */ },
       "settings": {
         "background": "white" | "gray" | "black",
         "padding": "none" | "sm" | "md" | "lg" | "xl",
         "alignment": "left" | "center" | "right"
       }
     }
   ]';

COMMENT ON COLUMN custom_pages.content_version IS
  'Content format version: "html" (uses content column) or "blocks" (uses blocks column)';

-- ============================================================================
-- STEP 2: Create indexes for JSONB queries
-- ============================================================================

-- GIN index for efficient JSONB queries (searching within blocks)
CREATE INDEX IF NOT EXISTS idx_custom_pages_blocks_gin
  ON custom_pages USING GIN (blocks);

-- Index on content_version for filtering pages by format
CREATE INDEX IF NOT EXISTS idx_custom_pages_content_version
  ON custom_pages(content_version);

-- Composite index for querying published pages by version
CREATE INDEX IF NOT EXISTS idx_custom_pages_published_version
  ON custom_pages(published, content_version)
  WHERE published = true;

-- ============================================================================
-- STEP 3: Create helper functions
-- ============================================================================

-- Function to validate block structure
CREATE OR REPLACE FUNCTION validate_page_blocks()
RETURNS TRIGGER AS $$
BEGIN
  -- Only validate if blocks is not empty
  IF NEW.blocks IS NOT NULL AND jsonb_array_length(NEW.blocks) > 0 THEN
    -- Check that blocks is an array
    IF jsonb_typeof(NEW.blocks) != 'array' THEN
      RAISE EXCEPTION 'blocks must be a JSON array';
    END IF;

    -- Validate each block has required fields
    IF NOT (
      SELECT bool_and(
        block ? 'id' AND
        block ? 'type' AND
        block ? 'content' AND
        block ? 'settings'
      )
      FROM jsonb_array_elements(NEW.blocks) AS block
    ) THEN
      RAISE EXCEPTION 'Each block must have id, type, content, and settings fields';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to validate blocks on insert/update
DROP TRIGGER IF EXISTS validate_page_blocks_trigger ON custom_pages;
CREATE TRIGGER validate_page_blocks_trigger
  BEFORE INSERT OR UPDATE ON custom_pages
  FOR EACH ROW
  WHEN (NEW.blocks IS NOT NULL)
  EXECUTE FUNCTION validate_page_blocks();

-- Function to get block count for a page
CREATE OR REPLACE FUNCTION get_page_block_count(page_id UUID)
RETURNS INTEGER AS $$
DECLARE
  block_count INTEGER;
BEGIN
  SELECT COALESCE(jsonb_array_length(blocks), 0)
  INTO block_count
  FROM custom_pages
  WHERE id = page_id;

  RETURN block_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get blocks by type
CREATE OR REPLACE FUNCTION get_blocks_by_type(page_id UUID, block_type TEXT)
RETURNS JSONB AS $$
DECLARE
  matching_blocks JSONB;
BEGIN
  SELECT COALESCE(
    jsonb_agg(block),
    '[]'::jsonb
  )
  INTO matching_blocks
  FROM custom_pages,
       jsonb_array_elements(blocks) AS block
  WHERE id = page_id
    AND block->>'type' = block_type;

  RETURN matching_blocks;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 4: Add sample queries as SQL comments
-- ============================================================================

/*
-- ============================================================================
-- COMMON QUERY EXAMPLES
-- ============================================================================

-- 1. Get all pages using block format
SELECT id, title, slug, blocks
FROM custom_pages
WHERE content_version = 'blocks';

-- 2. Get page with block count
SELECT
  id,
  title,
  slug,
  content_version,
  jsonb_array_length(blocks) AS block_count
FROM custom_pages
WHERE published = true;

-- 3. Find pages containing a specific block type (e.g., 'hero')
SELECT
  id,
  title,
  slug
FROM custom_pages,
     jsonb_array_elements(blocks) AS block
WHERE block->>'type' = 'hero'
  AND published = true;

-- 4. Get all hero blocks across all pages
SELECT
  cp.title,
  cp.slug,
  block
FROM custom_pages cp,
     jsonb_array_elements(blocks) AS block
WHERE block->>'type' = 'hero'
  AND cp.published = true;

-- 5. Count blocks by type for a specific page
SELECT
  block->>'type' AS block_type,
  COUNT(*) AS count
FROM custom_pages,
     jsonb_array_elements(blocks) AS block
WHERE id = 'YOUR-PAGE-ID-HERE'
GROUP BY block->>'type';

-- 6. Get pages with more than N blocks
SELECT
  id,
  title,
  slug,
  jsonb_array_length(blocks) AS block_count
FROM custom_pages
WHERE jsonb_array_length(blocks) > 5
  AND published = true;

-- 7. Search for text within block content
SELECT
  cp.id,
  cp.title,
  cp.slug,
  block
FROM custom_pages cp,
     jsonb_array_elements(blocks) AS block
WHERE block->'content'->>'text' ILIKE '%search term%'
  AND cp.published = true;

-- 8. Get pages using legacy HTML content
SELECT id, title, slug
FROM custom_pages
WHERE content_version = 'html'
  AND content IS NOT NULL;

-- 9. Update a specific block within a page (by block id)
UPDATE custom_pages
SET blocks = (
  SELECT jsonb_agg(
    CASE
      WHEN block->>'id' = 'BLOCK-ID-HERE'
      THEN jsonb_set(block, '{content,title}', '"New Title"')
      ELSE block
    END
  )
  FROM jsonb_array_elements(blocks) AS block
)
WHERE id = 'PAGE-ID-HERE';

-- 10. Add a new block to a page
UPDATE custom_pages
SET blocks = blocks || jsonb_build_array(
  jsonb_build_object(
    'id', gen_random_uuid()::text,
    'type', 'text',
    'content', jsonb_build_object(
      'text', 'Your content here',
      'format', 'html'
    ),
    'settings', jsonb_build_object(
      'background', 'white',
      'padding', 'md',
      'alignment', 'left'
    )
  )
)
WHERE id = 'PAGE-ID-HERE';

-- 11. Remove a block from a page (by block id)
UPDATE custom_pages
SET blocks = (
  SELECT jsonb_agg(block)
  FROM jsonb_array_elements(blocks) AS block
  WHERE block->>'id' != 'BLOCK-ID-TO-REMOVE'
)
WHERE id = 'PAGE-ID-HERE';

-- 12. Get statistics on block usage across all pages
SELECT
  block->>'type' AS block_type,
  COUNT(*) AS total_usage,
  COUNT(DISTINCT cp.id) AS pages_using
FROM custom_pages cp,
     jsonb_array_elements(blocks) AS block
WHERE cp.published = true
GROUP BY block->>'type'
ORDER BY total_usage DESC;
*/

-- ============================================================================
-- STEP 5: Update existing pages (optional migration)
-- ============================================================================

/*
-- Uncomment to migrate existing HTML pages to have empty blocks array
-- and set content_version to 'html' explicitly

UPDATE custom_pages
SET
  blocks = '[]'::jsonb,
  content_version = 'html'
WHERE content_version IS NULL
  OR blocks IS NULL;
*/

-- ============================================================================
-- STEP 6: Create view for easy querying
-- ============================================================================

-- Create a view that shows pages with block statistics
CREATE OR REPLACE VIEW custom_pages_with_stats AS
SELECT
  id,
  title,
  slug,
  content_version,
  CASE
    WHEN content_version = 'blocks'
    THEN jsonb_array_length(blocks)
    ELSE 0
  END AS block_count,
  CASE
    WHEN content_version = 'html' AND content IS NOT NULL
    THEN length(content)
    ELSE 0
  END AS html_length,
  published,
  show_in_header,
  show_in_mobile_menu,
  order_position,
  created_at,
  updated_at
FROM custom_pages;

-- Grant access to the view
GRANT SELECT ON custom_pages_with_stats TO anon, authenticated;

COMMENT ON VIEW custom_pages_with_stats IS
  'Convenience view showing custom pages with computed statistics about their content';

-- ============================================================================
-- ROLLBACK SCRIPT
-- ============================================================================

/*
-- To rollback this migration, run the following:

-- Drop the view
DROP VIEW IF EXISTS custom_pages_with_stats;

-- Drop the triggers
DROP TRIGGER IF EXISTS validate_page_blocks_trigger ON custom_pages;

-- Drop the functions
DROP FUNCTION IF EXISTS validate_page_blocks();
DROP FUNCTION IF EXISTS get_page_block_count(UUID);
DROP FUNCTION IF EXISTS get_blocks_by_type(UUID, TEXT);

-- Drop the indexes
DROP INDEX IF EXISTS idx_custom_pages_blocks_gin;
DROP INDEX IF EXISTS idx_custom_pages_content_version;
DROP INDEX IF EXISTS idx_custom_pages_published_version;

-- Remove the columns
ALTER TABLE custom_pages
  DROP COLUMN IF EXISTS blocks,
  DROP COLUMN IF EXISTS content_version;
*/

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- To apply this migration:
-- 1. Go to Supabase Dashboard
-- 2. Navigate to SQL Editor -> New Query
-- 3. Paste this entire SQL script
-- 4. Click "Run" to execute
--
-- After successful execution:
-- - custom_pages table will have 'blocks' and 'content_version' columns
-- - GIN index will enable efficient JSONB queries
-- - Helper functions will be available for block manipulation
-- - View 'custom_pages_with_stats' will provide content statistics
-- ============================================================================
