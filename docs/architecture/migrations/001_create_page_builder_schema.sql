-- Migration: Create Page Builder Schema
-- Description: Extends custom_pages with block-based page builder system
-- Date: 2025-10-14
-- Version: 1.0.0

-- ============================================================================
-- STEP 1: Enhance custom_pages table (non-breaking)
-- ============================================================================

-- Add new columns to existing custom_pages table
ALTER TABLE custom_pages
  ADD COLUMN IF NOT EXISTS content_version INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS og_image TEXT,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- Add comment to deprecated column
COMMENT ON COLUMN custom_pages.content IS 'Deprecated: Legacy HTML content. Use page_blocks for version 2.';

-- Update existing published pages to have published_at timestamp
UPDATE custom_pages
SET published_at = updated_at
WHERE published = true AND published_at IS NULL;

-- ============================================================================
-- STEP 2: Create page_blocks table
-- ============================================================================

CREATE TABLE IF NOT EXISTS page_blocks (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to custom_pages
  page_id UUID NOT NULL REFERENCES custom_pages(id) ON DELETE CASCADE,

  -- Block metadata
  block_type TEXT NOT NULL,
  order_position INTEGER NOT NULL DEFAULT 0,

  -- Block configuration (flexible JSONB for props)
  props JSONB NOT NULL DEFAULT '{}',

  -- Styling options
  spacing JSONB DEFAULT '{"top": "md", "bottom": "md"}',
  alignment TEXT DEFAULT 'left',
  background_color TEXT,

  -- Responsive visibility settings
  visibility JSONB DEFAULT '{"mobile": true, "tablet": true, "desktop": true}',

  -- Versioning support
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,

  -- Audit timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT page_blocks_alignment_check CHECK (alignment IN ('left', 'center', 'right')),
  CONSTRAINT page_blocks_order_unique UNIQUE (page_id, order_position),
  CONSTRAINT page_blocks_type_check CHECK (
    block_type IN (
      'hero', 'text', 'image', 'gallery', 'cta',
      'spacer', 'divider', 'columns', 'quote', 'video'
    )
  )
);

-- Add table comment
COMMENT ON TABLE page_blocks IS 'Stores individual content blocks for custom pages in the page builder system';

-- Add column comments
COMMENT ON COLUMN page_blocks.block_type IS 'Type of block: hero, text, image, gallery, cta, spacer, divider, columns, quote, video';
COMMENT ON COLUMN page_blocks.props IS 'Block-specific properties stored as JSONB (flexible schema per block type)';
COMMENT ON COLUMN page_blocks.spacing IS 'Spacing configuration: {"top": "md", "bottom": "md", "left": "md", "right": "md"}';
COMMENT ON COLUMN page_blocks.alignment IS 'Content alignment: left, center, right';
COMMENT ON COLUMN page_blocks.background_color IS 'Background color from monotone palette or Tailwind color class';
COMMENT ON COLUMN page_blocks.visibility IS 'Responsive visibility: {"mobile": true, "tablet": true, "desktop": true}';

-- ============================================================================
-- STEP 3: Create page_block_versions table (version history)
-- ============================================================================

CREATE TABLE IF NOT EXISTS page_block_versions (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign keys
  block_id UUID NOT NULL REFERENCES page_blocks(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES custom_pages(id) ON DELETE CASCADE,

  -- Snapshot of block at this version
  block_type TEXT NOT NULL,
  props JSONB NOT NULL,
  spacing JSONB,
  alignment TEXT,
  background_color TEXT,
  visibility JSONB,
  order_position INTEGER,

  -- Version metadata
  version_number INTEGER NOT NULL,
  change_description TEXT,

  -- Audit
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT page_block_versions_unique UNIQUE (block_id, version_number)
);

-- Add table comment
COMMENT ON TABLE page_block_versions IS 'Version history for page blocks, enabling undo/redo and audit trail';

-- ============================================================================
-- STEP 4: Create page_templates table (optional pre-built layouts)
-- ============================================================================

CREATE TABLE IF NOT EXISTS page_templates (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Template metadata
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'general',

  -- Template structure (array of block definitions)
  blocks JSONB NOT NULL DEFAULT '[]',

  -- Settings
  is_public BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,

  -- Audit
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT page_templates_category_check CHECK (
    category IN ('portfolio', 'about', 'services', 'contact', 'general')
  )
);

-- Add table comment
COMMENT ON TABLE page_templates IS 'Pre-built page templates that users can start from';
COMMENT ON COLUMN page_templates.blocks IS 'Array of block definitions (partial PageBlock objects without IDs)';

-- ============================================================================
-- STEP 5: Create indexes for performance
-- ============================================================================

-- Page blocks indexes
CREATE INDEX IF NOT EXISTS idx_page_blocks_page_id
  ON page_blocks(page_id);

CREATE INDEX IF NOT EXISTS idx_page_blocks_order
  ON page_blocks(page_id, order_position);

CREATE INDEX IF NOT EXISTS idx_page_blocks_type
  ON page_blocks(block_type);

CREATE INDEX IF NOT EXISTS idx_page_blocks_active
  ON page_blocks(page_id, is_active, order_position)
  WHERE is_active = true;

-- Version history indexes
CREATE INDEX IF NOT EXISTS idx_page_block_versions_block_id
  ON page_block_versions(block_id, version_number DESC);

CREATE INDEX IF NOT EXISTS idx_page_block_versions_page_id
  ON page_block_versions(page_id, created_at DESC);

-- Custom pages indexes (additional)
CREATE INDEX IF NOT EXISTS idx_custom_pages_published
  ON custom_pages(published, order_position)
  WHERE published = true;

CREATE INDEX IF NOT EXISTS idx_custom_pages_slug_published
  ON custom_pages(slug)
  WHERE published = true;

CREATE INDEX IF NOT EXISTS idx_custom_pages_version
  ON custom_pages(content_version);

-- Templates indexes
CREATE INDEX IF NOT EXISTS idx_page_templates_category
  ON page_templates(category, is_public)
  WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_page_templates_usage
  ON page_templates(usage_count DESC)
  WHERE is_public = true;

-- ============================================================================
-- STEP 6: Create triggers for updated_at timestamps
-- ============================================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for custom_pages (if not exists)
DROP TRIGGER IF EXISTS update_custom_pages_updated_at ON custom_pages;
CREATE TRIGGER update_custom_pages_updated_at
  BEFORE UPDATE ON custom_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for page_blocks
CREATE TRIGGER update_page_blocks_updated_at
  BEFORE UPDATE ON page_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for page_templates
CREATE TRIGGER update_page_templates_updated_at
  BEFORE UPDATE ON page_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 7: Create function to automatically create block versions
-- ============================================================================

CREATE OR REPLACE FUNCTION create_block_version()
RETURNS TRIGGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM page_block_versions
  WHERE block_id = NEW.id;

  -- Insert version record
  INSERT INTO page_block_versions (
    block_id,
    page_id,
    block_type,
    props,
    spacing,
    alignment,
    background_color,
    visibility,
    order_position,
    version_number,
    created_by
  ) VALUES (
    NEW.id,
    NEW.page_id,
    NEW.block_type,
    NEW.props,
    NEW.spacing,
    NEW.alignment,
    NEW.background_color,
    NEW.visibility,
    NEW.order_position,
    next_version,
    NEW.updated_by
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create version on update
CREATE TRIGGER create_block_version_on_update
  AFTER UPDATE ON page_blocks
  FOR EACH ROW
  WHEN (
    OLD.props IS DISTINCT FROM NEW.props OR
    OLD.block_type IS DISTINCT FROM NEW.block_type OR
    OLD.spacing IS DISTINCT FROM NEW.spacing OR
    OLD.alignment IS DISTINCT FROM NEW.alignment OR
    OLD.background_color IS DISTINCT FROM NEW.background_color OR
    OLD.visibility IS DISTINCT FROM NEW.visibility
  )
  EXECUTE FUNCTION create_block_version();

-- ============================================================================
-- STEP 8: Create helper functions
-- ============================================================================

-- Function to reorder blocks when inserting/deleting
CREATE OR REPLACE FUNCTION reorder_page_blocks()
RETURNS TRIGGER AS $$
BEGIN
  -- If inserting and order_position conflicts, shift others down
  IF (TG_OP = 'INSERT') THEN
    UPDATE page_blocks
    SET order_position = order_position + 1
    WHERE page_id = NEW.page_id
      AND order_position >= NEW.order_position
      AND id != NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-reorder blocks
CREATE TRIGGER reorder_blocks_on_insert
  BEFORE INSERT ON page_blocks
  FOR EACH ROW
  EXECUTE FUNCTION reorder_page_blocks();

-- Function to increment template usage
CREATE OR REPLACE FUNCTION increment_template_usage(template_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE page_templates
  SET usage_count = usage_count + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 9: Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_block_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Published pages are viewable by everyone" ON custom_pages;
DROP POLICY IF EXISTS "Published page blocks are viewable by everyone" ON page_blocks;
DROP POLICY IF EXISTS "Block versions are viewable with page access" ON page_block_versions;
DROP POLICY IF EXISTS "Public templates are viewable by everyone" ON page_templates;
DROP POLICY IF EXISTS "Admins can manage all pages" ON custom_pages;
DROP POLICY IF EXISTS "Admins can manage all blocks" ON page_blocks;
DROP POLICY IF EXISTS "Admins can view all block versions" ON page_block_versions;
DROP POLICY IF EXISTS "Admins can manage all templates" ON page_templates;

-- Public read access to published pages
CREATE POLICY "Published pages are viewable by everyone"
  ON custom_pages FOR SELECT
  USING (published = true);

-- Public read access to blocks of published pages
CREATE POLICY "Published page blocks are viewable by everyone"
  ON page_blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custom_pages
      WHERE id = page_blocks.page_id
      AND published = true
    )
  );

-- Public read access to block versions (for published pages)
CREATE POLICY "Block versions are viewable with page access"
  ON page_block_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custom_pages
      WHERE id = page_block_versions.page_id
      AND published = true
    )
  );

-- Public read access to public templates
CREATE POLICY "Public templates are viewable by everyone"
  ON page_templates FOR SELECT
  USING (is_public = true);

-- Admin full access to pages
CREATE POLICY "Admins can manage all pages"
  ON custom_pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin full access to blocks
CREATE POLICY "Admins can manage all blocks"
  ON page_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin read access to all block versions
CREATE POLICY "Admins can view all block versions"
  ON page_block_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin full access to templates
CREATE POLICY "Admins can manage all templates"
  ON page_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================================================
-- STEP 10: Grant permissions
-- ============================================================================

-- Grant usage on tables to authenticated and anon users
GRANT SELECT ON custom_pages TO anon, authenticated;
GRANT SELECT ON page_blocks TO anon, authenticated;
GRANT SELECT ON page_templates TO anon, authenticated;
GRANT SELECT ON page_block_versions TO authenticated;

-- ============================================================================
-- Rollback script (comment out for production)
-- ============================================================================

/*
-- To rollback this migration, run:

DROP TRIGGER IF EXISTS create_block_version_on_update ON page_blocks;
DROP TRIGGER IF EXISTS reorder_blocks_on_insert ON page_blocks;
DROP TRIGGER IF EXISTS update_page_blocks_updated_at ON page_blocks;
DROP TRIGGER IF EXISTS update_page_templates_updated_at ON page_templates;

DROP FUNCTION IF EXISTS create_block_version();
DROP FUNCTION IF EXISTS reorder_page_blocks();
DROP FUNCTION IF EXISTS increment_template_usage(UUID);

DROP TABLE IF EXISTS page_block_versions;
DROP TABLE IF EXISTS page_blocks;
DROP TABLE IF EXISTS page_templates;

ALTER TABLE custom_pages
  DROP COLUMN IF EXISTS content_version,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS og_image,
  DROP COLUMN IF EXISTS published_at,
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS updated_by;
*/
