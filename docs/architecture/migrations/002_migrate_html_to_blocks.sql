-- Migration: Convert Existing HTML Content to Blocks
-- Description: Migrates legacy HTML content from custom_pages.content to page_blocks
-- Date: 2025-10-14
-- Version: 1.0.0
-- Prerequisites: 001_create_page_builder_schema.sql

-- ============================================================================
-- STEP 1: Create migration helper function
-- ============================================================================

CREATE OR REPLACE FUNCTION migrate_page_html_to_blocks(p_page_id UUID)
RETURNS VOID AS $$
DECLARE
  v_content TEXT;
  v_title TEXT;
  v_page_version INTEGER;
BEGIN
  -- Get page content and version
  SELECT content, title, COALESCE(content_version, 1)
  INTO v_content, v_title, v_page_version
  FROM custom_pages
  WHERE id = p_page_id;

  -- Skip if already migrated or no content
  IF v_page_version = 2 OR v_content IS NULL OR v_content = '' THEN
    RETURN;
  END IF;

  -- Create a single text block with the HTML content
  INSERT INTO page_blocks (
    page_id,
    block_type,
    order_position,
    props,
    spacing,
    alignment,
    visibility,
    is_active,
    version
  ) VALUES (
    p_page_id,
    'text',
    0,
    jsonb_build_object(
      'content', v_content,
      'format', 'html',
      'text_size', 'base',
      'max_width', 'lg',
      'font_family', 'sans'
    ),
    '{"top": "md", "bottom": "md"}'::jsonb,
    'left',
    '{"mobile": true, "tablet": true, "desktop": true}'::jsonb,
    true,
    1
  );

  -- Update page to version 2
  UPDATE custom_pages
  SET content_version = 2,
      updated_at = NOW()
  WHERE id = p_page_id;

  RAISE NOTICE 'Migrated page: % (ID: %)', v_title, p_page_id;

EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to migrate page %: %', p_page_id, SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 2: Migrate all existing pages with HTML content
-- ============================================================================

DO $$
DECLARE
  v_page RECORD;
  v_migrated_count INTEGER := 0;
  v_skipped_count INTEGER := 0;
BEGIN
  -- Loop through all pages with version 1 content
  FOR v_page IN
    SELECT id, title
    FROM custom_pages
    WHERE COALESCE(content_version, 1) = 1
      AND content IS NOT NULL
      AND content != ''
    ORDER BY created_at
  LOOP
    BEGIN
      -- Migrate this page
      PERFORM migrate_page_html_to_blocks(v_page.id);
      v_migrated_count := v_migrated_count + 1;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Skipped page "%" due to error: %', v_page.title, SQLERRM;
        v_skipped_count := v_skipped_count + 1;
    END;
  END LOOP;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration Summary:';
  RAISE NOTICE 'Pages migrated: %', v_migrated_count;
  RAISE NOTICE 'Pages skipped: %', v_skipped_count;
  RAISE NOTICE '========================================';
END;
$$;

-- ============================================================================
-- STEP 3: Verify migration
-- ============================================================================

-- Check migration results
DO $$
DECLARE
  v_total_pages INTEGER;
  v_v1_pages INTEGER;
  v_v2_pages INTEGER;
  v_pages_with_blocks INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_total_pages FROM custom_pages;
  SELECT COUNT(*) INTO v_v1_pages FROM custom_pages WHERE content_version = 1;
  SELECT COUNT(*) INTO v_v2_pages FROM custom_pages WHERE content_version = 2;
  SELECT COUNT(DISTINCT page_id) INTO v_pages_with_blocks FROM page_blocks;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration Verification:';
  RAISE NOTICE 'Total pages: %', v_total_pages;
  RAISE NOTICE 'Version 1 (HTML): %', v_v1_pages;
  RAISE NOTICE 'Version 2 (Blocks): %', v_v2_pages;
  RAISE NOTICE 'Pages with blocks: %', v_pages_with_blocks;
  RAISE NOTICE '========================================';

  IF v_v1_pages > 0 THEN
    RAISE WARNING '% pages still have version 1 content!', v_v1_pages;
  END IF;
END;
$$;

-- ============================================================================
-- STEP 4: Create sample templates
-- ============================================================================

-- Template 1: Simple About Page
INSERT INTO page_templates (name, description, category, blocks, is_public)
VALUES (
  'Simple About Page',
  'A clean, simple about page with hero image and text content',
  'about',
  '[
    {
      "block_type": "hero",
      "order_position": 0,
      "props": {
        "title": "About Us",
        "subtitle": "Your subtitle here",
        "image_url": "",
        "image_fit": "cover",
        "height": "md",
        "overlay_opacity": 30,
        "text_color": "pure-white"
      },
      "spacing": {"top": "none", "bottom": "xl"},
      "alignment": "center",
      "background_color": "charcoal"
    },
    {
      "block_type": "text",
      "order_position": 1,
      "props": {
        "content": "<p>Tell your story here...</p>",
        "format": "html",
        "text_size": "lg",
        "max_width": "lg",
        "font_family": "serif"
      },
      "spacing": {"top": "lg", "bottom": "lg"},
      "alignment": "left"
    }
  ]'::jsonb,
  true
)
ON CONFLICT DO NOTHING;

-- Template 2: Portfolio Showcase
INSERT INTO page_templates (name, description, category, blocks, is_public)
VALUES (
  'Portfolio Showcase',
  'A gallery-focused template perfect for showcasing your work',
  'portfolio',
  '[
    {
      "block_type": "hero",
      "order_position": 0,
      "props": {
        "title": "Portfolio",
        "subtitle": "View our latest work",
        "image_url": "",
        "image_fit": "cover",
        "height": "lg",
        "text_color": "pure-white"
      },
      "spacing": {"top": "none", "bottom": "xl"},
      "alignment": "center"
    },
    {
      "block_type": "text",
      "order_position": 1,
      "props": {
        "content": "<p>Introduction to your portfolio...</p>",
        "format": "html",
        "text_size": "base",
        "max_width": "md"
      },
      "spacing": {"top": "md", "bottom": "lg"},
      "alignment": "center"
    },
    {
      "block_type": "gallery",
      "order_position": 2,
      "props": {
        "images": [],
        "layout": "grid",
        "columns": 3,
        "gap": "md",
        "show_captions": true,
        "lightbox_enabled": true
      },
      "spacing": {"top": "lg", "bottom": "xl"}
    }
  ]'::jsonb,
  true
)
ON CONFLICT DO NOTHING;

-- Template 3: Contact/CTA Page
INSERT INTO page_templates (name, description, category, blocks, is_public)
VALUES (
  'Contact Page',
  'A contact page with call-to-action and information',
  'contact',
  '[
    {
      "block_type": "hero",
      "order_position": 0,
      "props": {
        "title": "Get in Touch",
        "subtitle": "We''d love to hear from you",
        "image_url": "",
        "height": "md",
        "text_color": "pure-white"
      },
      "spacing": {"top": "none", "bottom": "xl"},
      "alignment": "center",
      "background_color": "charcoal"
    },
    {
      "block_type": "text",
      "order_position": 1,
      "props": {
        "content": "<p>Contact information goes here...</p>",
        "format": "html",
        "text_size": "base",
        "max_width": "md"
      },
      "spacing": {"top": "md", "bottom": "md"},
      "alignment": "center"
    },
    {
      "block_type": "cta",
      "order_position": 2,
      "props": {
        "heading": "Ready to get started?",
        "subheading": "Contact us today for a consultation",
        "button_text": "Send Message",
        "button_link": "/contact",
        "button_style": "primary"
      },
      "spacing": {"top": "xl", "bottom": "xl"},
      "alignment": "center",
      "background_color": "off-white"
    }
  ]'::jsonb,
  true
)
ON CONFLICT DO NOTHING;

-- Template 4: Services Page
INSERT INTO page_templates (name, description, category, blocks, is_public)
VALUES (
  'Services Page',
  'Showcase your services with images and descriptions',
  'services',
  '[
    {
      "block_type": "hero",
      "order_position": 0,
      "props": {
        "title": "Our Services",
        "subtitle": "Professional photography for every occasion",
        "image_url": "",
        "height": "md",
        "text_color": "pure-white"
      },
      "spacing": {"top": "none", "bottom": "xl"},
      "alignment": "center"
    },
    {
      "block_type": "text",
      "order_position": 1,
      "props": {
        "content": "<h2>Service 1</h2><p>Description...</p>",
        "format": "html",
        "text_size": "base",
        "max_width": "lg"
      },
      "spacing": {"top": "lg", "bottom": "md"},
      "alignment": "left"
    },
    {
      "block_type": "image",
      "order_position": 2,
      "props": {
        "url": "",
        "alt": "Service image",
        "fit": "cover",
        "width": "lg",
        "aspect_ratio": "16:9"
      },
      "spacing": {"top": "md", "bottom": "lg"}
    },
    {
      "block_type": "divider",
      "order_position": 3,
      "props": {
        "style": "solid",
        "width": "md",
        "color": "pale-gray",
        "thickness": 1
      },
      "spacing": {"top": "xl", "bottom": "xl"}
    }
  ]'::jsonb,
  true
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 5: Create backup of original content
-- ============================================================================

-- Create backup table (one-time)
CREATE TABLE IF NOT EXISTS custom_pages_content_backup (
  page_id UUID PRIMARY KEY,
  original_content TEXT,
  migrated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backup original HTML content
INSERT INTO custom_pages_content_backup (page_id, original_content)
SELECT id, content
FROM custom_pages
WHERE content IS NOT NULL AND content != ''
ON CONFLICT (page_id) DO NOTHING;

-- ============================================================================
-- STEP 6: Cleanup (optional - comment out for safety)
-- ============================================================================

/*
-- After confirming migration is successful, you can optionally:
-- 1. Remove the content column (keep for 6 months as backup)
-- ALTER TABLE custom_pages DROP COLUMN content;

-- 2. Drop the migration helper function
-- DROP FUNCTION IF EXISTS migrate_page_html_to_blocks(UUID);

-- 3. Archive the backup table after sufficient time
-- DROP TABLE IF EXISTS custom_pages_content_backup;
*/

-- ============================================================================
-- Summary
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration Complete!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Review migrated pages in admin panel';
  RAISE NOTICE '2. Test page rendering on frontend';
  RAISE NOTICE '3. Update any custom page integrations';
  RAISE NOTICE '4. Monitor for any issues';
  RAISE NOTICE '';
  RAISE NOTICE 'Backup: Original content saved in custom_pages_content_backup';
  RAISE NOTICE '========================================';
END;
$$;
