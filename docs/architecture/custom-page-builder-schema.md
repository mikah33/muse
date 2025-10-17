# Custom Page Builder - Database Schema & Architecture Design

## Executive Summary

This document outlines the recommended database schema, TypeScript interfaces, and architectural decisions for implementing a flexible, block-based custom page builder system for Model Muse Studio.

**Recommendation: Hybrid Approach (Option B+ with JSON enhancement)**
- Separate blocks table for structure and queryability
- JSONB for flexible component properties
- Maintains backward compatibility with current HTML content
- Supports future scalability and versioning

---

## 1. Recommended Data Model

### 1.1 Core Schema Design

```sql
-- Enhanced custom_pages table
CREATE TABLE custom_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  -- Legacy support
  content TEXT, -- Deprecated, kept for migration
  content_version INTEGER DEFAULT 2, -- 1=HTML, 2=Blocks

  -- Metadata
  description TEXT, -- SEO meta description
  og_image TEXT, -- Social sharing image URL

  -- Publishing
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,

  -- Navigation
  show_in_header BOOLEAN DEFAULT true,
  show_in_mobile_menu BOOLEAN DEFAULT true,
  order_position INTEGER DEFAULT 0,

  -- Audit
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page blocks table (core of builder system)
CREATE TABLE page_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES custom_pages(id) ON DELETE CASCADE,

  -- Block metadata
  block_type TEXT NOT NULL, -- 'hero', 'text', 'image', 'gallery', 'cta', 'spacer', 'divider'
  order_position INTEGER NOT NULL DEFAULT 0,

  -- Block configuration (JSONB for flexibility)
  props JSONB NOT NULL DEFAULT '{}',

  -- Styling
  spacing JSONB DEFAULT '{"top": "md", "bottom": "md"}', -- 'none', 'sm', 'md', 'lg', 'xl'
  alignment TEXT DEFAULT 'left', -- 'left', 'center', 'right'
  background_color TEXT, -- Tailwind color from monotone palette

  -- Responsive settings
  visibility JSONB DEFAULT '{"mobile": true, "tablet": true, "desktop": true}',

  -- Versioning support
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT page_blocks_order_unique UNIQUE (page_id, order_position)
);

-- Block version history (for undo/redo and auditing)
CREATE TABLE page_block_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page templates (optional, for pre-built layouts)
CREATE TABLE page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT, -- 'portfolio', 'about', 'services', 'contact', 'general'

  -- Template structure (array of block definitions)
  blocks JSONB NOT NULL DEFAULT '[]',

  -- Metadata
  is_public BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_page_blocks_page_id ON page_blocks(page_id);
CREATE INDEX idx_page_blocks_order ON page_blocks(page_id, order_position);
CREATE INDEX idx_page_blocks_type ON page_blocks(block_type);
CREATE INDEX idx_page_block_versions_block_id ON page_block_versions(block_id);
CREATE INDEX idx_custom_pages_published ON custom_pages(published, order_position);
CREATE INDEX idx_custom_pages_slug ON custom_pages(slug) WHERE published = true;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_custom_pages_updated_at
  BEFORE UPDATE ON custom_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_blocks_updated_at
  BEFORE UPDATE ON page_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 1.2 Block Type Definitions

The `block_type` field determines the component structure and expected props:

```typescript
// Block type registry
const BLOCK_TYPES = {
  HERO: 'hero',
  TEXT: 'text',
  IMAGE: 'image',
  GALLERY: 'gallery',
  CTA: 'cta',
  SPACER: 'spacer',
  DIVIDER: 'divider',
  COLUMNS: 'columns',
  QUOTE: 'quote',
  VIDEO: 'video'
} as const;
```

---

## 2. TypeScript Interface Definitions

### 2.1 Core Types

```typescript
// types/page-builder.ts

// Spacing values
export type SpacingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Alignment = 'left' | 'center' | 'right';
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type ImageFit = 'cover' | 'contain' | 'fill' | 'none';

// Monotone palette colors (from tailwind.config.ts)
export type MonotoneColor =
  | 'pure-black'
  | 'soft-black'
  | 'charcoal'
  | 'dark-gray'
  | 'medium-gray'
  | 'light-gray'
  | 'pale-gray'
  | 'off-white'
  | 'pure-white'
  | 'transparent';

export interface Spacing {
  top: SpacingSize;
  bottom: SpacingSize;
  left?: SpacingSize;
  right?: SpacingSize;
}

export interface Visibility {
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
}

// Base block interface
export interface BaseBlock {
  id: string;
  page_id: string;
  block_type: string;
  order_position: number;
  spacing: Spacing;
  alignment: Alignment;
  background_color?: MonotoneColor;
  visibility: Visibility;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Block-specific prop interfaces
export interface HeroBlockProps {
  title: string;
  subtitle?: string;
  image_url: string;
  image_alt?: string;
  image_fit: ImageFit;
  overlay_opacity?: number; // 0-100
  text_color?: MonotoneColor;
  height?: 'sm' | 'md' | 'lg' | 'full'; // viewport height
  cta_text?: string;
  cta_link?: string;
}

export interface TextBlockProps {
  content: string; // HTML or markdown
  format: 'html' | 'markdown' | 'plain';
  text_size: TextSize;
  text_color?: MonotoneColor;
  max_width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  font_family?: 'serif' | 'sans';
}

export interface ImageBlockProps {
  url: string;
  alt?: string;
  caption?: string;
  fit: ImageFit;
  width?: 'sm' | 'md' | 'lg' | 'full';
  aspect_ratio?: '1:1' | '4:3' | '16:9' | '21:9' | 'auto';
  link_url?: string;
  show_lightbox?: boolean;
}

export interface GalleryBlockProps {
  images: Array<{
    url: string;
    thumbnail_url?: string;
    alt?: string;
    caption?: string;
  }>;
  layout: 'grid' | 'masonry' | 'carousel';
  columns: 2 | 3 | 4;
  gap: SpacingSize;
  show_captions: boolean;
  lightbox_enabled: boolean;
}

export interface CTABlockProps {
  heading: string;
  subheading?: string;
  button_text: string;
  button_link: string;
  button_style: 'primary' | 'secondary' | 'outline';
  background_color?: MonotoneColor;
  text_color?: MonotoneColor;
}

export interface SpacerBlockProps {
  height: SpacingSize;
}

export interface DividerBlockProps {
  style: 'solid' | 'dashed' | 'dotted';
  width?: 'sm' | 'md' | 'lg' | 'full';
  color?: MonotoneColor;
  thickness?: 1 | 2 | 4;
}

export interface ColumnsBlockProps {
  columns: Array<{
    width: number; // 1-12 grid units
    blocks: PageBlock[]; // Nested blocks
  }>;
  gap: SpacingSize;
  stack_on_mobile: boolean;
}

export interface QuoteBlockProps {
  quote: string;
  author?: string;
  author_title?: string;
  style: 'default' | 'large' | 'bordered';
  text_color?: MonotoneColor;
}

export interface VideoBlockProps {
  video_url: string; // YouTube, Vimeo, or direct URL
  thumbnail_url?: string;
  aspect_ratio: '16:9' | '4:3' | '1:1';
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
}

// Union type for all block types
export type PageBlockProps =
  | HeroBlockProps
  | TextBlockProps
  | ImageBlockProps
  | GalleryBlockProps
  | CTABlockProps
  | SpacerBlockProps
  | DividerBlockProps
  | ColumnsBlockProps
  | QuoteBlockProps
  | VideoBlockProps;

// Complete block interface
export interface PageBlock extends BaseBlock {
  props: PageBlockProps;
}

// Page interface
export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content?: string; // Legacy
  content_version: 1 | 2;
  description?: string;
  og_image?: string;
  published: boolean;
  published_at?: string;
  show_in_header: boolean;
  show_in_mobile_menu: boolean;
  order_position: number;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

// Page with blocks (for rendering)
export interface CustomPageWithBlocks extends CustomPage {
  blocks: PageBlock[];
}

// Template interface
export interface PageTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  category: string;
  blocks: Partial<PageBlock>[];
  is_public: boolean;
  usage_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Version history
export interface PageBlockVersion {
  id: string;
  block_id: string;
  page_id: string;
  block_type: string;
  props: PageBlockProps;
  spacing: Spacing;
  alignment: Alignment;
  background_color?: MonotoneColor;
  visibility: Visibility;
  order_position: number;
  version_number: number;
  change_description?: string;
  created_by?: string;
  created_at: string;
}
```

### 2.2 Database Types Extension

```typescript
// types/database.ts (addition to existing types)

export interface Database {
  public: {
    Tables: {
      // ... existing tables ...

      custom_pages: {
        Row: CustomPage;
        Insert: Omit<CustomPage, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CustomPage, 'id'>>;
      };

      page_blocks: {
        Row: PageBlock;
        Insert: Omit<PageBlock, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PageBlock, 'id'>>;
      };

      page_block_versions: {
        Row: PageBlockVersion;
        Insert: Omit<PageBlockVersion, 'id' | 'created_at'>;
        Update: never; // Versions are immutable
      };

      page_templates: {
        Row: PageTemplate;
        Insert: Omit<PageTemplate, 'id' | 'created_at' | 'updated_at' | 'usage_count'>;
        Update: Partial<Omit<PageTemplate, 'id'>>;
      };
    };
  };
}
```

---

## 3. Rendering Strategy

### 3.1 Server vs Client Components

**Server Components (Default)**
- Use for static/published pages
- Better SEO and performance
- No hydration cost
- Pre-rendered at build or request time

**Client Components (Builder Interface)**
- Page builder admin interface
- Drag-and-drop functionality
- Real-time preview
- Interactive block editors

### 3.2 Component Architecture

```typescript
// Server component for rendering published pages
// app/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BlockRenderer } from '@/components/page-builder/BlockRenderer';
import Header from '@/components/shared/Header';

export default async function CustomPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch page with blocks
  const { data: page } = await supabase
    .from('custom_pages')
    .select(`
      *,
      blocks:page_blocks(*)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .order('blocks(order_position)')
    .single();

  if (!page) notFound();

  // If legacy HTML content
  if (page.content_version === 1 && page.content) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-serif mb-8">{page.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </main>
      </div>
    );
  }

  // Modern block-based rendering
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-20">
        {page.blocks?.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </main>
    </div>
  );
}
```

```typescript
// Client component for page builder
// components/admin/PageBuilder.tsx

'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { BlockEditor } from './BlockEditor';
import { BlockToolbar } from './BlockToolbar';

export default function PageBuilder({ pageId, initialBlocks }) {
  const [blocks, setBlocks] = useState(initialBlocks);

  // Drag and drop handlers
  const handleDragEnd = (event) => {
    // Reorder logic
  };

  const handleAddBlock = (blockType) => {
    // Add new block logic
  };

  return (
    <div className="page-builder">
      <BlockToolbar onAddBlock={handleAddBlock} />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <BlockEditor key={block.id} block={block} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
```

---

## 4. Migration Path from Current HTML Content

### 4.1 Migration Strategy

**Phase 1: Schema Update (Non-breaking)**
```sql
-- Add new columns while keeping existing content
ALTER TABLE custom_pages ADD COLUMN content_version INTEGER DEFAULT 1;
ALTER TABLE custom_pages ADD COLUMN description TEXT;
ALTER TABLE custom_pages ADD COLUMN og_image TEXT;
ALTER TABLE custom_pages ADD COLUMN created_by UUID REFERENCES auth.users(id);
ALTER TABLE custom_pages ADD COLUMN updated_by UUID REFERENCES auth.users(id);

-- Create new tables
-- (Execute page_blocks, page_block_versions, page_templates CREATE statements)
```

**Phase 2: Content Migration (Gradual)**
```typescript
// Migration script: migrate-html-to-blocks.ts
// Converts existing HTML content to text blocks

async function migratePageToBlocks(pageId: string) {
  const supabase = createClient();

  // Get existing page
  const { data: page } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('id', pageId)
    .single();

  if (!page || page.content_version === 2) return;

  // Create a single text block with existing HTML
  const { data: block } = await supabase
    .from('page_blocks')
    .insert({
      page_id: pageId,
      block_type: 'text',
      order_position: 0,
      props: {
        content: page.content,
        format: 'html',
        text_size: 'base',
        max_width: 'lg'
      }
    })
    .single();

  // Update page version
  await supabase
    .from('custom_pages')
    .update({ content_version: 2 })
    .eq('id', pageId);

  console.log(`Migrated page ${page.slug} to blocks`);
}
```

**Phase 3: Editor Rollout**
- Deploy new block-based editor to admin
- Keep legacy HTML editor as fallback
- Allow admins to opt-in to new builder per page

**Phase 4: Deprecation**
- After all pages migrated, remove HTML editor
- Keep `content` column for 6 months as backup
- Eventually drop column in future migration

---

## 5. Backup & Versioning Strategy

### 5.1 Block-Level Versioning

Every block change creates a version snapshot:

```typescript
// lib/versioning.ts

export async function saveBlockVersion(
  blockId: string,
  block: PageBlock,
  changeDescription: string,
  userId?: string
) {
  const supabase = createClient();

  // Get current version number
  const { data: versions } = await supabase
    .from('page_block_versions')
    .select('version_number')
    .eq('block_id', blockId)
    .order('version_number', { ascending: false })
    .limit(1);

  const nextVersion = (versions?.[0]?.version_number || 0) + 1;

  // Create version snapshot
  await supabase.from('page_block_versions').insert({
    block_id: blockId,
    page_id: block.page_id,
    block_type: block.block_type,
    props: block.props,
    spacing: block.spacing,
    alignment: block.alignment,
    background_color: block.background_color,
    visibility: block.visibility,
    order_position: block.order_position,
    version_number: nextVersion,
    change_description: changeDescription,
    created_by: userId
  });
}

export async function restoreBlockVersion(
  blockId: string,
  versionNumber: number
) {
  const supabase = createClient();

  // Get version
  const { data: version } = await supabase
    .from('page_block_versions')
    .select('*')
    .eq('block_id', blockId)
    .eq('version_number', versionNumber)
    .single();

  if (!version) throw new Error('Version not found');

  // Restore block to this version
  await supabase
    .from('page_blocks')
    .update({
      block_type: version.block_type,
      props: version.props,
      spacing: version.spacing,
      alignment: version.alignment,
      background_color: version.background_color,
      visibility: version.visibility,
      order_position: version.order_position,
      version: version.version_number
    })
    .eq('id', blockId);
}
```

### 5.2 Page-Level Backup

```typescript
// Automated daily backup of all published pages
export async function backupPublishedPages() {
  const supabase = createClient();

  const { data: pages } = await supabase
    .from('custom_pages')
    .select(`
      *,
      blocks:page_blocks(*)
    `)
    .eq('published', true);

  // Store in separate backup table or external storage
  await supabase.from('page_backups').insert({
    backup_date: new Date().toISOString(),
    pages_data: pages
  });
}
```

---

## 6. Performance Implications

### 6.1 Query Performance

**Optimization Strategies:**

1. **Indexed Lookups**
   - Slug-based page queries use index
   - Block order queries use composite index
   - Published pages filtered efficiently

2. **Eager Loading**
   ```typescript
   // Single query with JOIN instead of N+1
   const { data } = await supabase
     .from('custom_pages')
     .select(`
       *,
       blocks:page_blocks(*)
     `)
     .eq('slug', slug)
     .order('blocks(order_position)');
   ```

3. **Caching Strategy**
   ```typescript
   // Next.js Route Handlers with cache
   export async function GET(request) {
     const page = await getPageWithBlocks(slug);

     return Response.json(page, {
       headers: {
         'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
       }
     });
   }
   ```

### 6.2 Bundle Size

**Client-Side Considerations:**
- Block renderer components: ~5-10KB per block type
- DnD library (admin only): ~45KB (react-dnd)
- Total admin bundle: ~200KB (acceptable for admin interface)
- Public-facing pages: Server-rendered, minimal JS (~20KB)

### 6.3 Database Size Projections

Assumptions:
- Average page: 5-10 blocks
- Average block size: 1-3KB (JSONB props)
- 100 pages in system

**Storage Estimates:**
- `custom_pages`: ~100 rows × 1KB = 100KB
- `page_blocks`: ~750 rows × 2KB = 1.5MB
- `page_block_versions`: ~7,500 rows × 2KB = 15MB (with history)
- **Total: ~17MB for 100 pages with full version history**

**Growth Rate:** Linear with page count, manageable for years.

---

## 7. Scalability Considerations

### 7.1 Horizontal Scalability

**Database:**
- PostgreSQL read replicas for high traffic
- Connection pooling via Supabase
- JSONB indexing for props queries if needed

**Application:**
- Stateless Next.js deployment (Vercel/Netlify)
- CDN caching for published pages
- Incremental Static Regeneration (ISR)

### 7.2 Block Type Extensibility

**Adding New Block Types:**
```typescript
// 1. Define props interface
export interface CustomBlockProps {
  custom_field: string;
}

// 2. Add to union type
export type PageBlockProps =
  | HeroBlockProps
  | CustomBlockProps;

// 3. Create renderer component
export function CustomBlockRenderer({ block }: { block: PageBlock }) {
  const props = block.props as CustomBlockProps;
  // Render logic
}

// 4. Register in block registry
const BLOCK_REGISTRY = {
  // ...
  custom: CustomBlockRenderer
};
```

**No database migrations needed for new block types!**

### 7.3 Multi-Site Support (Future)

```sql
-- Add site_id for multi-tenant support
ALTER TABLE custom_pages ADD COLUMN site_id UUID;
ALTER TABLE page_blocks ADD COLUMN site_id UUID;

CREATE TABLE sites (
  id UUID PRIMARY KEY,
  domain TEXT UNIQUE,
  name TEXT
);
```

---

## 8. Security Considerations

### 8.1 Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_block_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_templates ENABLE ROW LEVEL SECURITY;

-- Public read access to published pages
CREATE POLICY "Published pages are viewable by everyone"
  ON custom_pages FOR SELECT
  USING (published = true);

CREATE POLICY "Published page blocks are viewable by everyone"
  ON page_blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custom_pages
      WHERE id = page_blocks.page_id
      AND published = true
    )
  );

-- Admin full access
CREATE POLICY "Admins can manage all pages"
  ON custom_pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all blocks"
  ON page_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
```

### 8.2 Content Sanitization

```typescript
// Sanitize HTML content in text blocks
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeBlockContent(block: PageBlock): PageBlock {
  if (block.block_type === 'text') {
    const props = block.props as TextBlockProps;
    if (props.format === 'html') {
      return {
        ...block,
        props: {
          ...props,
          content: DOMPurify.sanitize(props.content)
        }
      };
    }
  }
  return block;
}
```

---

## 9. Example Block Definitions

### 9.1 Sample Hero Block

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "page_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "block_type": "hero",
  "order_position": 0,
  "props": {
    "title": "Welcome to Model Muse Studio",
    "subtitle": "Professional Photography for Your Special Moments",
    "image_url": "https://your-bucket.supabase.co/storage/v1/object/public/images/hero.jpg",
    "image_alt": "Studio photography session",
    "image_fit": "cover",
    "overlay_opacity": 40,
    "text_color": "pure-white",
    "height": "lg",
    "cta_text": "View Portfolio",
    "cta_link": "/portfolio"
  },
  "spacing": {
    "top": "none",
    "bottom": "xl"
  },
  "alignment": "center",
  "background_color": "pure-black",
  "visibility": {
    "mobile": true,
    "tablet": true,
    "desktop": true
  }
}
```

### 9.2 Sample Gallery Block

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "page_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "block_type": "gallery",
  "order_position": 1,
  "props": {
    "images": [
      {
        "url": "https://your-bucket.supabase.co/storage/v1/object/public/images/photo1.jpg",
        "thumbnail_url": "https://your-bucket.supabase.co/storage/v1/object/public/images/photo1_thumb.jpg",
        "alt": "Portfolio image 1",
        "caption": "Summer Collection 2024"
      },
      {
        "url": "https://your-bucket.supabase.co/storage/v1/object/public/images/photo2.jpg",
        "thumbnail_url": "https://your-bucket.supabase.co/storage/v1/object/public/images/photo2_thumb.jpg",
        "alt": "Portfolio image 2",
        "caption": "Editorial Shoot"
      }
    ],
    "layout": "grid",
    "columns": 3,
    "gap": "md",
    "show_captions": true,
    "lightbox_enabled": true
  },
  "spacing": {
    "top": "lg",
    "bottom": "lg"
  },
  "alignment": "center",
  "visibility": {
    "mobile": true,
    "tablet": true,
    "desktop": true
  }
}
```

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Create database migrations
- [ ] Define TypeScript interfaces
- [ ] Update database.ts types
- [ ] Implement basic BlockRenderer components
- [ ] Create migration script for existing pages

### Phase 2: Core Blocks (Week 3-4)
- [ ] Implement Hero block renderer
- [ ] Implement Text block renderer
- [ ] Implement Image block renderer
- [ ] Implement Gallery block renderer
- [ ] Implement CTA block renderer
- [ ] Implement Spacer/Divider renderers

### Phase 3: Admin Builder UI (Week 5-6)
- [ ] Create PageBuilder component with DnD
- [ ] Implement BlockToolbar
- [ ] Create block-specific editors
- [ ] Add block settings panel
- [ ] Implement version history UI

### Phase 4: Advanced Features (Week 7-8)
- [ ] Template system
- [ ] Undo/Redo functionality
- [ ] Preview mode
- [ ] Responsive preview
- [ ] SEO metadata editor
- [ ] Performance optimizations

### Phase 5: Migration & Testing (Week 9)
- [ ] Migrate existing custom pages
- [ ] End-to-end testing
- [ ] Performance testing
- [ ] Security audit
- [ ] Documentation

### Phase 6: Launch (Week 10)
- [ ] Beta testing with admins
- [ ] Fix bugs and gather feedback
- [ ] Production deployment
- [ ] Monitor performance
- [ ] Training documentation

---

## 11. Architectural Trade-offs Summary

### Chosen Approach: Separate Blocks Table + JSONB

**Advantages:**
1. **Queryability**: Can filter/search blocks by type, page, or metadata
2. **Performance**: Indexes on block_type, page_id, order_position
3. **Flexibility**: JSONB props allow different schemas per block type
4. **Versioning**: Easy to snapshot individual blocks
5. **Scalability**: Can partition/shard blocks independently
6. **Developer Experience**: Type-safe with TypeScript unions
7. **Migration Path**: Non-breaking addition to existing schema

**Disadvantages:**
1. **Complexity**: More tables to manage than pure JSON
2. **Joins Required**: Need JOIN for page + blocks queries
3. **Storage**: Slightly more overhead than pure JSON column

**Rejected Alternatives:**

**Option A (Pure JSON):**
- Pros: Simple, single table
- Cons: Can't query individual blocks, hard to version, large row sizes

**Option C (Templates Only):**
- Pros: Easiest for users
- Cons: Not flexible enough, can't customize layouts

---

## 12. Conclusion

The recommended hybrid architecture provides:

- **Backward compatibility** with existing HTML content
- **Future flexibility** for unlimited block types
- **Strong performance** with proper indexing
- **Developer-friendly** TypeScript interfaces
- **Scalable** for thousands of pages and blocks
- **Maintainable** with clear separation of concerns
- **Production-ready** with versioning and backups

This design supports the current needs while enabling rich page building capabilities for the future.
