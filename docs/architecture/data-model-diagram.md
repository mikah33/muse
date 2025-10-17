# Custom Page Builder - Data Model Diagrams

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CUSTOM PAGES                                    │
│ ─────────────────────────────────────────────────────────────────────── │
│  PK  id                    UUID                                         │
│      title                 TEXT                                         │
│  UK  slug                  TEXT                      (unique)           │
│      description           TEXT                      (SEO)              │
│      og_image             TEXT                      (social)           │
│                                                                          │
│      content              TEXT                      (legacy HTML)      │
│      content_version      INTEGER                   (1=HTML, 2=Blocks) │
│                                                                          │
│      published            BOOLEAN                   (visibility)       │
│      published_at         TIMESTAMPTZ                                   │
│      show_in_header       BOOLEAN                   (nav)              │
│      show_in_mobile_menu  BOOLEAN                   (nav)              │
│      order_position       INTEGER                   (nav order)        │
│                                                                          │
│  FK  created_by           UUID → auth.users                            │
│  FK  updated_by           UUID → auth.users                            │
│      created_at           TIMESTAMPTZ                                   │
│      updated_at           TIMESTAMPTZ                                   │
└──────────────────┬──────────────────────────────────────────────────────┘
                   │
                   │ 1:N
                   │
┌──────────────────▼──────────────────────────────────────────────────────┐
│                         PAGE BLOCKS                                     │
│ ─────────────────────────────────────────────────────────────────────── │
│  PK  id                    UUID                                         │
│  FK  page_id               UUID → custom_pages.id   (CASCADE DELETE)   │
│                                                                          │
│      block_type            TEXT                      ('hero', 'text')   │
│      order_position        INTEGER                   (0, 1, 2...)      │
│                                                                          │
│      props                 JSONB                     (block config)     │
│      spacing               JSONB                     (margins/padding)  │
│      alignment             TEXT                      (left/center/right)│
│      background_color      TEXT                      (monotone palette) │
│      visibility            JSONB                     (responsive)       │
│                                                                          │
│      version               INTEGER                   (current version)  │
│      is_active             BOOLEAN                   (soft delete)      │
│                                                                          │
│      created_at            TIMESTAMPTZ                                  │
│      updated_at            TIMESTAMPTZ                                  │
│                                                                          │
│  UK  (page_id, order_position)                       (unique together)  │
└──────────────────┬──────────────────────────────────────────────────────┘
                   │
                   │ 1:N
                   │
┌──────────────────▼──────────────────────────────────────────────────────┐
│                    PAGE BLOCK VERSIONS                                  │
│ ─────────────────────────────────────────────────────────────────────── │
│  PK  id                    UUID                                         │
│  FK  block_id              UUID → page_blocks.id    (CASCADE DELETE)   │
│  FK  page_id               UUID → custom_pages.id   (CASCADE DELETE)   │
│                                                                          │
│      block_type            TEXT                      (snapshot)         │
│      props                 JSONB                     (snapshot)         │
│      spacing               JSONB                     (snapshot)         │
│      alignment             TEXT                      (snapshot)         │
│      background_color      TEXT                      (snapshot)         │
│      visibility            JSONB                     (snapshot)         │
│      order_position        INTEGER                   (snapshot)         │
│                                                                          │
│      version_number        INTEGER                   (1, 2, 3...)      │
│      change_description    TEXT                      (what changed)     │
│                                                                          │
│  FK  created_by            UUID → auth.users                           │
│      created_at            TIMESTAMPTZ                                  │
│                                                                          │
│  UK  (block_id, version_number)                      (unique together)  │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                       PAGE TEMPLATES                                    │
│ ─────────────────────────────────────────────────────────────────────── │
│  PK  id                    UUID                                         │
│      name                  TEXT                      ('Simple About')   │
│      description           TEXT                                         │
│      thumbnail_url         TEXT                      (preview image)    │
│      category              TEXT                      ('about', 'port')  │
│                                                                          │
│      blocks                JSONB                     (template blocks)  │
│                                                                          │
│      is_public             BOOLEAN                   (visible to all)   │
│      usage_count           INTEGER                   (analytics)        │
│                                                                          │
│  FK  created_by            UUID → auth.users                           │
│      created_at            TIMESTAMPTZ                                  │
│      updated_at            TIMESTAMPTZ                                  │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                   SUPABASE STORAGE BUCKETS                              │
│ ─────────────────────────────────────────────────────────────────────── │
│  page-images/                   (hero backgrounds, large images)        │
│    └── [page-slug]/                                                     │
│        ├── hero.jpg                                                     │
│        └── banner.jpg                                                   │
│                                                                          │
│  page-content/                  (inline images, icons)                  │
│    └── [page-slug]/                                                     │
│        ├── icon1.png                                                    │
│        └── diagram.svg                                                  │
│                                                                          │
│  page-galleries/                (gallery images)                        │
│    └── [page-slug]/                                                     │
│        ├── gallery-1.jpg                                                │
│        ├── gallery-1-thumb.jpg                                          │
│        ├── gallery-2.jpg                                                │
│        └── gallery-2-thumb.jpg                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## JSONB Schema Examples

### page_blocks.props (Block-Specific)

#### Hero Block Props
```json
{
  "title": "Welcome to Model Muse Studio",
  "subtitle": "Professional Photography",
  "image_url": "https://bucket.supabase.co/storage/v1/object/public/page-images/about/hero.jpg",
  "image_alt": "Studio interior",
  "image_fit": "cover",
  "overlay_opacity": 40,
  "text_color": "pure-white",
  "height": "lg",
  "cta_text": "View Portfolio",
  "cta_link": "/portfolio"
}
```

#### Text Block Props
```json
{
  "content": "<h2>About Us</h2><p>We are a photography studio...</p>",
  "format": "html",
  "text_size": "lg",
  "text_color": "charcoal",
  "max_width": "lg",
  "font_family": "serif"
}
```

#### Image Block Props
```json
{
  "url": "https://bucket.supabase.co/storage/v1/object/public/page-content/about/team.jpg",
  "alt": "Our team",
  "caption": "The Model Muse Studio team",
  "fit": "cover",
  "width": "lg",
  "aspect_ratio": "16:9",
  "link_url": "/team",
  "show_lightbox": true
}
```

#### Gallery Block Props
```json
{
  "images": [
    {
      "url": "https://bucket.supabase.co/storage/v1/object/public/page-galleries/portfolio/1.jpg",
      "thumbnail_url": "https://bucket.supabase.co/storage/v1/object/public/page-galleries/portfolio/1-thumb.jpg",
      "alt": "Portfolio image 1",
      "caption": "Summer Collection 2024"
    },
    {
      "url": "https://bucket.supabase.co/storage/v1/object/public/page-galleries/portfolio/2.jpg",
      "thumbnail_url": "https://bucket.supabase.co/storage/v1/object/public/page-galleries/portfolio/2-thumb.jpg",
      "alt": "Portfolio image 2",
      "caption": "Editorial Shoot"
    }
  ],
  "layout": "grid",
  "columns": 3,
  "gap": "md",
  "show_captions": true,
  "lightbox_enabled": true
}
```

#### CTA Block Props
```json
{
  "heading": "Ready to get started?",
  "subheading": "Contact us today for a consultation",
  "button_text": "Send Message",
  "button_link": "/contact",
  "button_style": "primary",
  "background_color": "off-white",
  "text_color": "charcoal"
}
```

### page_blocks.spacing
```json
{
  "top": "xl",      // none, xs, sm, md, lg, xl, 2xl
  "bottom": "lg",
  "left": "md",     // optional
  "right": "md"     // optional
}
```

### page_blocks.visibility
```json
{
  "mobile": true,   // show on mobile (<768px)
  "tablet": true,   // show on tablet (768-1024px)
  "desktop": true   // show on desktop (>1024px)
}
```

### page_templates.blocks
```json
[
  {
    "block_type": "hero",
    "order_position": 0,
    "props": {
      "title": "{{PAGE_TITLE}}",
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
      "content": "<p>Your content here...</p>",
      "format": "html",
      "text_size": "base",
      "max_width": "lg"
    },
    "spacing": {"top": "lg", "bottom": "lg"},
    "alignment": "left"
  }
]
```

---

## Database Indexes

### Performance-Critical Indexes

```sql
-- Custom Pages
CREATE INDEX idx_custom_pages_published
  ON custom_pages(published, order_position)
  WHERE published = true;

CREATE INDEX idx_custom_pages_slug_published
  ON custom_pages(slug)
  WHERE published = true;

CREATE INDEX idx_custom_pages_version
  ON custom_pages(content_version);

-- Page Blocks
CREATE INDEX idx_page_blocks_page_id
  ON page_blocks(page_id);

CREATE INDEX idx_page_blocks_order
  ON page_blocks(page_id, order_position);

CREATE INDEX idx_page_blocks_type
  ON page_blocks(block_type);

CREATE INDEX idx_page_blocks_active
  ON page_blocks(page_id, is_active, order_position)
  WHERE is_active = true;

-- Block Versions
CREATE INDEX idx_page_block_versions_block_id
  ON page_block_versions(block_id, version_number DESC);

CREATE INDEX idx_page_block_versions_page_id
  ON page_block_versions(page_id, created_at DESC);

-- Templates
CREATE INDEX idx_page_templates_category
  ON page_templates(category, is_public)
  WHERE is_public = true;

CREATE INDEX idx_page_templates_usage
  ON page_templates(usage_count DESC)
  WHERE is_public = true;
```

---

## Row-Level Security (RLS) Policies

### Custom Pages

```sql
-- Public read access to published pages
CREATE POLICY "Published pages are viewable by everyone"
  ON custom_pages FOR SELECT
  USING (published = true);

-- Admins have full access
CREATE POLICY "Admins can manage all pages"
  ON custom_pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );
```

### Page Blocks

```sql
-- Public can view blocks of published pages
CREATE POLICY "Published page blocks are viewable by everyone"
  ON page_blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custom_pages
      WHERE id = page_blocks.page_id
      AND published = true
    )
  );

-- Admins can manage all blocks
CREATE POLICY "Admins can manage all blocks"
  ON page_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );
```

### Page Block Versions

```sql
-- Only admins can view version history
CREATE POLICY "Admins can view all block versions"
  ON page_block_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );
```

### Page Templates

```sql
-- Public can view public templates
CREATE POLICY "Public templates are viewable by everyone"
  ON page_templates FOR SELECT
  USING (is_public = true);

-- Admins can manage all templates
CREATE POLICY "Admins can manage all templates"
  ON page_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );
```

---

## Query Patterns

### Fetch Published Page with Blocks

```sql
-- Single optimized query with JOIN
SELECT
  p.id,
  p.title,
  p.slug,
  p.description,
  p.og_image,
  p.content_version,
  p.content,
  json_agg(
    json_build_object(
      'id', pb.id,
      'block_type', pb.block_type,
      'props', pb.props,
      'spacing', pb.spacing,
      'alignment', pb.alignment,
      'background_color', pb.background_color,
      'visibility', pb.visibility,
      'order_position', pb.order_position
    ) ORDER BY pb.order_position
  ) AS blocks
FROM custom_pages p
LEFT JOIN page_blocks pb
  ON pb.page_id = p.id
  AND pb.is_active = true
WHERE p.slug = 'about'
  AND p.published = true
GROUP BY p.id;
```

### Fetch All Published Pages for Navigation

```sql
SELECT
  id,
  title,
  slug,
  show_in_header,
  show_in_mobile_menu,
  order_position
FROM custom_pages
WHERE published = true
ORDER BY order_position;
```

### Fetch Page with Version History

```sql
SELECT
  pb.*,
  json_agg(
    json_build_object(
      'version_number', pbv.version_number,
      'created_at', pbv.created_at,
      'created_by', pbv.created_by,
      'change_description', pbv.change_description
    ) ORDER BY pbv.version_number DESC
  ) AS versions
FROM page_blocks pb
LEFT JOIN page_block_versions pbv ON pbv.block_id = pb.id
WHERE pb.page_id = 'page-uuid'
GROUP BY pb.id
ORDER BY pb.order_position;
```

### Fetch Templates by Category

```sql
SELECT
  id,
  name,
  description,
  thumbnail_url,
  blocks,
  usage_count
FROM page_templates
WHERE category = 'portfolio'
  AND is_public = true
ORDER BY usage_count DESC;
```

---

## Storage Organization

### Bucket Structure

```
page-images/                          (Public bucket)
├── about/
│   ├── hero.jpg                      (1920x1080, optimized)
│   └── team-photo.jpg
├── services/
│   ├── hero.jpg
│   ├── service-1.jpg
│   └── service-2.jpg
└── contact/
    └── hero.jpg

page-content/                         (Public bucket)
├── about/
│   ├── logo.svg
│   └── icon.png
└── services/
    ├── icon-1.svg
    ├── icon-2.svg
    └── icon-3.svg

page-galleries/                       (Public bucket)
├── portfolio/
│   ├── 1.jpg                         (1920x1080, full size)
│   ├── 1-thumb.jpg                   (400x300, thumbnail)
│   ├── 2.jpg
│   ├── 2-thumb.jpg
│   ├── 3.jpg
│   └── 3-thumb.jpg
└── about/
    ├── gallery-1.jpg
    └── gallery-1-thumb.jpg
```

### Bucket Policies

```sql
-- Public read access
CREATE POLICY "Anyone can view page images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('page-images', 'page-content', 'page-galleries'));

-- Admin write access
CREATE POLICY "Admins can upload page images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('page-images', 'page-content', 'page-galleries')
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin delete access
CREATE POLICY "Admins can delete page images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('page-images', 'page-content', 'page-galleries')
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );
```

---

## Migration Workflow

```
┌─────────────────────────────────────────────────────┐
│  BEFORE MIGRATION                                   │
│ ─────────────────────────────────────────────────── │
│  custom_pages                                       │
│  ├── id: "page-1"                                   │
│  ├── title: "About Us"                              │
│  ├── slug: "about"                                  │
│  ├── content: "<h1>About Us</h1><p>We are...</p>"  │
│  └── published: true                                │
└─────────────────────────────────────────────────────┘
                      │
                      │ Run 001_create_page_builder_schema.sql
                      ▼
┌─────────────────────────────────────────────────────┐
│  AFTER SCHEMA MIGRATION                             │
│ ─────────────────────────────────────────────────── │
│  custom_pages (enhanced)                            │
│  ├── id: "page-1"                                   │
│  ├── title: "About Us"                              │
│  ├── slug: "about"                                  │
│  ├── content: "<h1>About Us</h1><p>We are...</p>"  │
│  ├── content_version: 1 (HTML)                      │
│  ├── description: NULL                              │
│  └── published: true                                │
│                                                      │
│  page_blocks (empty)                                │
│  page_block_versions (empty)                        │
│  page_templates (empty)                             │
└─────────────────────────────────────────────────────┘
                      │
                      │ Run 002_migrate_html_to_blocks.sql
                      ▼
┌─────────────────────────────────────────────────────┐
│  AFTER CONTENT MIGRATION                            │
│ ─────────────────────────────────────────────────── │
│  custom_pages                                       │
│  ├── id: "page-1"                                   │
│  ├── title: "About Us"                              │
│  ├── slug: "about"                                  │
│  ├── content: "<h1>About Us</h1><p>We are...</p>"  │  (backup)
│  ├── content_version: 2 (Blocks)                    │  (updated)
│  └── published: true                                │
│                                                      │
│  page_blocks                                        │
│  └── block-1                                        │
│      ├── id: "block-1"                              │
│      ├── page_id: "page-1"                          │
│      ├── block_type: "text"                         │
│      ├── order_position: 0                          │
│      └── props:                                     │
│          {                                          │
│            "content": "<h1>About...</h1>",          │
│            "format": "html",                        │
│            "text_size": "base"                      │
│          }                                          │
│                                                      │
│  custom_pages_content_backup                        │
│  └── page_id: "page-1"                              │
│      └── original_content: "<h1>About...</h1>"      │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow: Creating a New Page

```
Admin creates new page "Services"
          │
          ▼
1. Insert into custom_pages
   ─────────────────────────
   INSERT INTO custom_pages (
     title, slug, content_version, published
   ) VALUES (
     'Services', 'services', 2, false
   )
   RETURNING id;
          │
          ▼
2. Select template (optional)
   ─────────────────────────
   SELECT * FROM page_templates
   WHERE category = 'services';
          │
          ▼
3. Create blocks from template
   ─────────────────────────
   INSERT INTO page_blocks (
     page_id, block_type, order_position, props, spacing
   ) VALUES
     ('page-2', 'hero', 0, {...}, {...}),
     ('page-2', 'text', 1, {...}, {...}),
     ('page-2', 'cta', 2, {...}, {...});
          │
          ▼
4. Admin edits blocks in PageBuilder
   ─────────────────────────
   - Drag-and-drop to reorder
   - Edit props (text, images)
   - Upload images to Storage
   - Adjust spacing/alignment
          │
          ▼
5. Save changes
   ─────────────────────────
   UPDATE page_blocks
   SET props = {...}, spacing = {...}
   WHERE id = 'block-1';

   (Triggers create_block_version automatically)
          │
          ▼
6. Publish page
   ─────────────────────────
   UPDATE custom_pages
   SET published = true, published_at = NOW()
   WHERE id = 'page-2';
          │
          ▼
7. Page visible at /services
   ─────────────────────────
   Next.js renders blocks server-side
   Cached by CDN
```

---

**Document Version:** 1.0.0
**Last Updated:** 2025-10-14
