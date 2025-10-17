# Custom Page Builder - Implementation Guide

## Quick Reference

**Architecture Decision:** [ADR-001](./ADR-001-page-builder-architecture.md)
**Database Schema:** [Schema Documentation](./custom-page-builder-schema.md)
**Migrations:** [migrations/](./migrations/)

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     PUBLIC FRONTEND                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  app/[slug]/page.tsx (Server Component)               │  │
│  │  - Fetches page + blocks from Supabase                │  │
│  │  - Renders using BlockRenderer                        │  │
│  │  - SEO optimized, static when possible                │  │
│  └───────────┬───────────────────────────────────────────┘  │
│              │                                               │
│              ▼                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  components/page-builder/BlockRenderer.tsx            │  │
│  │  - Dispatches to block-specific components            │  │
│  │  - Handles spacing, alignment, visibility             │  │
│  └───────────┬───────────────────────────────────────────┘  │
│              │                                               │
│              ▼                                               │
│  ┌─────────────────────────────────────────────┐            │
│  │  Block Components (Server Components)       │            │
│  │  - HeroBlock.tsx                            │            │
│  │  - TextBlock.tsx                            │            │
│  │  - ImageBlock.tsx                           │            │
│  │  - GalleryBlock.tsx                         │            │
│  │  - CTABlock.tsx                             │            │
│  └─────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     ADMIN INTERFACE                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  app/admin/pages/edit/[id]/page.tsx                   │  │
│  │  - Server component that fetches page data            │  │
│  │  - Passes data to client component                    │  │
│  └───────────┬───────────────────────────────────────────┘  │
│              │                                               │
│              ▼                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  components/admin/PageBuilder.tsx (Client Component)  │  │
│  │  - Drag-and-drop interface (@dnd-kit)                 │  │
│  │  - Block toolbar for adding new blocks                │  │
│  │  - Real-time preview                                  │  │
│  └───────────┬───────────────────────────────────────────┘  │
│              │                                               │
│              ▼                                               │
│  ┌─────────────────────────────────────────────┐            │
│  │  Block Editors (Client Components)          │            │
│  │  - HeroBlockEditor.tsx (with image upload)  │            │
│  │  - TextBlockEditor.tsx (rich text)          │            │
│  │  - ImageBlockEditor.tsx (upload + crop)     │            │
│  │  - GalleryBlockEditor.tsx (multi-upload)    │            │
│  │  - CTABlockEditor.tsx (form fields)         │            │
│  └─────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Supabase PostgreSQL                                  │  │
│  │                                                        │  │
│  │  ┌──────────────┐      ┌──────────────────────┐      │  │
│  │  │custom_pages  │──1:N─│ page_blocks          │      │  │
│  │  │              │      │  - block_type        │      │  │
│  │  │- id          │      │  - props (JSONB)     │      │  │
│  │  │- title       │      │  - spacing (JSONB)   │      │  │
│  │  │- slug        │      │  - order_position    │      │  │
│  │  │- content ¹   │      └──────────┬───────────┘      │  │
│  │  │- content_v   │                 │                   │  │
│  │  │- published   │                 │                   │  │
│  │  └──────────────┘                 │                   │  │
│  │                                    │                   │  │
│  │                          ┌─────────▼─────────────┐     │  │
│  │                          │ page_block_versions   │     │  │
│  │                          │  - block_id           │     │  │
│  │                          │  - version_number     │     │  │
│  │                          │  - props snapshot     │     │  │
│  │                          └───────────────────────┘     │  │
│  │                                                        │  │
│  │  ┌──────────────────────┐                             │  │
│  │  │ page_templates       │                             │  │
│  │  │  - name              │                             │  │
│  │  │  - blocks (JSONB)    │                             │  │
│  │  │  - category          │                             │  │
│  │  └──────────────────────┘                             │  │
│  │                                                        │  │
│  │  ¹ Deprecated, kept for migration/rollback            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     STORAGE LAYER                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Supabase Storage                                     │  │
│  │                                                        │  │
│  │  /page-images/           (hero backgrounds)           │  │
│  │  /page-content/          (inline images)              │  │
│  │  /page-galleries/        (gallery images)             │  │
│  │                                                        │  │
│  │  Policy: Public read, Admin write                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Page Rendering Flow (Public)

```
User visits /about
      │
      ▼
Next.js App Router
      │
      ▼
app/[slug]/page.tsx
      │
      ├─→ Fetch custom_pages WHERE slug='about'
      │   AND published=true
      │
      ├─→ Fetch page_blocks WHERE page_id=X
      │   ORDER BY order_position
      │
      ▼
BlockRenderer component
      │
      ├─→ block.type === 'hero' → HeroBlock
      ├─→ block.type === 'text' → TextBlock
      ├─→ block.type === 'image' → ImageBlock
      └─→ block.type === 'gallery' → GalleryBlock
      │
      ▼
Rendered HTML (Server-Side)
      │
      ▼
Cached by Vercel/CDN
      │
      ▼
Served to user (<2s)
```

### Page Editing Flow (Admin)

```
Admin edits page
      │
      ▼
PageBuilder component
      │
      ├─→ User drags block ────→ Update order_position
      │                          (optimistic UI)
      │
      ├─→ User edits block ────→ BlockEditor modal opens
      │   properties               │
      │                             ├─→ User changes text
      │                             ├─→ User uploads image
      │                             │   (Supabase Storage)
      │                             │
      │                             ▼
      │                          Save to page_blocks
      │                          (update props JSONB)
      │                             │
      │                             ▼
      │                          Create version snapshot
      │                          (page_block_versions)
      │
      ├─→ User adds new block ─→ Insert into page_blocks
      │                          (default props)
      │
      ├─→ User deletes block ──→ Soft delete or hard delete
      │                          (is_active = false)
      │
      └─→ User publishes ──────→ Update custom_pages
                                 (published = true)
                                    │
                                    ▼
                                 Revalidate /[slug]
                                 (Next.js ISR)
```

---

## Implementation Checklist

### Phase 1: Database Setup ✓

- [ ] Run migration `001_create_page_builder_schema.sql`
- [ ] Verify tables created: `page_blocks`, `page_block_versions`, `page_templates`
- [ ] Check indexes exist: `idx_page_blocks_page_id`, `idx_page_blocks_order`, etc.
- [ ] Test RLS policies (public can SELECT published, admins have full access)
- [ ] Create Supabase Storage buckets: `page-images`, `page-content`, `page-galleries`

### Phase 2: Type Definitions ✓

- [ ] Create `types/page-builder.ts` with all interfaces
- [ ] Update `types/database.ts` to include new tables
- [ ] Define block prop types (HeroBlockProps, TextBlockProps, etc.)
- [ ] Create validation schemas (optional: Zod)

### Phase 3: Migration Script

- [ ] Run migration `002_migrate_html_to_blocks.sql`
- [ ] Verify existing pages converted to blocks
- [ ] Check `custom_pages_content_backup` table populated
- [ ] Test rendering of migrated pages

### Phase 4: Server Components (Public Rendering)

**Create these files:**

```
components/page-builder/
├── BlockRenderer.tsx          # Main dispatcher
├── blocks/
│   ├── HeroBlock.tsx          # Hero component
│   ├── TextBlock.tsx          # Text/HTML component
│   ├── ImageBlock.tsx         # Single image
│   ├── GalleryBlock.tsx       # Image gallery
│   ├── CTABlock.tsx           # Call-to-action
│   ├── SpacerBlock.tsx        # Vertical spacing
│   ├── DividerBlock.tsx       # Horizontal line
│   └── index.ts               # Barrel export
└── utils/
    ├── spacing.ts             # Spacing utilities
    ├── alignment.ts           # Alignment utilities
    └── visibility.ts          # Responsive visibility
```

**Implementation order:**
1. BlockRenderer (dispatches to components)
2. TextBlock (simplest, good starting point)
3. ImageBlock (introduces image handling)
4. HeroBlock (combines text + image)
5. GalleryBlock (complex, uses lightbox)
6. CTABlock (buttons and links)
7. SpacerBlock & DividerBlock (trivial)

### Phase 5: Update Page Route

**Modify `/app/[slug]/page.tsx`:**

```typescript
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

  // Version 1: Legacy HTML rendering (fallback)
  if (page.content_version === 1 && page.content) {
    return <LegacyHTMLPage page={page} />;
  }

  // Version 2: Modern block rendering
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {page.blocks?.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </main>
    </div>
  );
}
```

### Phase 6: Admin UI (Client Components)

**Create these files:**

```
components/admin/page-builder/
├── PageBuilder.tsx            # Main builder interface
├── BlockToolbar.tsx           # Add block toolbar
├── BlockEditor.tsx            # Wrapper for block editing
├── editors/
│   ├── HeroBlockEditor.tsx    # Hero editor with image upload
│   ├── TextBlockEditor.tsx    # Rich text editor
│   ├── ImageBlockEditor.tsx   # Image upload + settings
│   ├── GalleryBlockEditor.tsx # Multi-image upload
│   ├── CTABlockEditor.tsx     # CTA form fields
│   └── index.ts
├── panels/
│   ├── BlockSettingsPanel.tsx # Spacing, alignment, visibility
│   ├── PageSettingsPanel.tsx  # SEO, meta, publish settings
│   └── VersionHistoryPanel.tsx# Version management
└── utils/
    ├── drag-and-drop.ts       # DnD utilities
    ├── block-factory.ts       # Create new blocks
    └── supabase-client.ts     # Admin Supabase client
```

**Key dependencies:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install react-quill  # or tiptap for rich text
npm install zod          # for validation
```

**Implementation order:**
1. PageBuilder (structure + DnD)
2. BlockToolbar (add block button)
3. BlockSettingsPanel (spacing, colors)
4. TextBlockEditor (simplest editor)
5. ImageBlockEditor (file upload)
6. HeroBlockEditor (combines both)
7. GalleryBlockEditor (advanced)
8. VersionHistoryPanel (bonus feature)

### Phase 7: Update Admin Routes

**Modify `/app/admin/pages/edit/[id]/page.tsx`:**

```typescript
import PageBuilder from '@/components/admin/page-builder/PageBuilder';

export default async function EditPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from('custom_pages')
    .select(`
      *,
      blocks:page_blocks(*)
    `)
    .eq('id', id)
    .order('blocks(order_position)')
    .single();

  return (
    <div className="admin-container">
      <PageBuilder page={page} blocks={page.blocks || []} />
    </div>
  );
}
```

### Phase 8: Testing

**Create tests:**
```
tests/
├── page-builder/
│   ├── block-renderer.test.tsx
│   ├── hero-block.test.tsx
│   ├── text-block.test.tsx
│   └── gallery-block.test.tsx
├── admin/
│   ├── page-builder.test.tsx
│   └── block-editors.test.tsx
└── integration/
    ├── page-rendering.test.ts
    ├── page-editing.test.ts
    └── migration.test.ts
```

**Test scenarios:**
- [ ] Legacy HTML pages still render correctly
- [ ] New block pages render correctly
- [ ] Drag-and-drop reordering works
- [ ] Block editing saves properly
- [ ] Image uploads to Supabase Storage
- [ ] RLS policies enforce permissions
- [ ] Version history tracks changes
- [ ] Responsive visibility works
- [ ] SEO metadata included in HTML

### Phase 9: Performance Optimization

- [ ] Enable Next.js static generation where possible
- [ ] Add caching headers to API routes
- [ ] Lazy load block editors in admin
- [ ] Optimize images (next/image)
- [ ] Implement progressive image loading
- [ ] Add prefetching for common pages
- [ ] Monitor database query performance
- [ ] Add CDN caching for public pages

### Phase 10: Documentation

- [ ] Update admin user guide
- [ ] Create video tutorial for page builder
- [ ] Document block types and options
- [ ] Write migration runbook
- [ ] Create troubleshooting guide

---

## Code Examples

### Example 1: BlockRenderer Component

```typescript
// components/page-builder/BlockRenderer.tsx
import { PageBlock } from '@/types/page-builder';
import {
  HeroBlock,
  TextBlock,
  ImageBlock,
  GalleryBlock,
  CTABlock,
  SpacerBlock,
  DividerBlock
} from './blocks';

const BLOCK_COMPONENTS = {
  hero: HeroBlock,
  text: TextBlock,
  image: ImageBlock,
  gallery: GalleryBlock,
  cta: CTABlock,
  spacer: SpacerBlock,
  divider: DividerBlock
} as const;

export default function BlockRenderer({ block }: { block: PageBlock }) {
  const Component = BLOCK_COMPONENTS[block.block_type];

  if (!Component) {
    console.warn(`Unknown block type: ${block.block_type}`);
    return null;
  }

  // Apply spacing
  const spacingClasses = `
    pt-${block.spacing.top}
    pb-${block.spacing.bottom}
    ${block.spacing.left ? `pl-${block.spacing.left}` : ''}
    ${block.spacing.right ? `pr-${block.spacing.right}` : ''}
  `;

  // Apply visibility
  const visibilityClasses = `
    ${!block.visibility.mobile ? 'hidden sm:block' : ''}
    ${!block.visibility.tablet ? 'sm:hidden lg:block' : ''}
    ${!block.visibility.desktop ? 'lg:hidden' : ''}
  `;

  // Apply background
  const bgClass = block.background_color
    ? `bg-${block.background_color}`
    : '';

  return (
    <div
      className={`${spacingClasses} ${visibilityClasses} ${bgClass}`}
      data-block-id={block.id}
      data-block-type={block.block_type}
    >
      <Component block={block} />
    </div>
  );
}
```

### Example 2: HeroBlock Component

```typescript
// components/page-builder/blocks/HeroBlock.tsx
import Image from 'next/image';
import Link from 'next/link';
import { PageBlock, HeroBlockProps } from '@/types/page-builder';

export default function HeroBlock({ block }: { block: PageBlock }) {
  const props = block.props as HeroBlockProps;

  const heightClasses = {
    sm: 'h-64 md:h-80',
    md: 'h-80 md:h-96',
    lg: 'h-96 md:h-[32rem]',
    full: 'h-screen'
  }[props.height || 'md'];

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }[block.alignment || 'center'];

  return (
    <div className={`relative ${heightClasses} overflow-hidden`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={props.image_url}
          alt={props.image_alt || props.title}
          fill
          className={`object-${props.image_fit || 'cover'}`}
          priority
        />
        {/* Overlay */}
        {props.overlay_opacity && (
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: props.overlay_opacity / 100 }}
          />
        )}
      </div>

      {/* Content */}
      <div className={`relative h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 ${alignmentClasses}`}>
        <div className="max-w-4xl">
          <h1
            className={`text-4xl md:text-6xl font-serif mb-4 ${props.text_color ? `text-${props.text_color}` : 'text-white'}`}
          >
            {props.title}
          </h1>

          {props.subtitle && (
            <p
              className={`text-lg md:text-xl mb-8 ${props.text_color ? `text-${props.text_color}` : 'text-white'}`}
            >
              {props.subtitle}
            </p>
          )}

          {props.cta_text && props.cta_link && (
            <Link
              href={props.cta_link}
              className="inline-block px-8 py-3 bg-white text-black tracking-wider hover:bg-gray-100 transition-colors"
            >
              {props.cta_text}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Example 3: PageBuilder Component (Admin)

```typescript
// components/admin/page-builder/PageBuilder.tsx
'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { PageBlock } from '@/types/page-builder';
import { createClient } from '@/lib/supabase/client';
import BlockToolbar from './BlockToolbar';
import SortableBlockEditor from './SortableBlockEditor';

export default function PageBuilder({
  page,
  blocks: initialBlocks
}: {
  page: any;
  blocks: PageBlock[];
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const supabase = createClient();

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);

    const newBlocks = arrayMove(blocks, oldIndex, newIndex);
    setBlocks(newBlocks);

    // Update order_position in database
    await Promise.all(
      newBlocks.map((block, index) =>
        supabase
          .from('page_blocks')
          .update({ order_position: index })
          .eq('id', block.id)
      )
    );
  };

  const handleAddBlock = async (blockType: string) => {
    const { data, error } = await supabase
      .from('page_blocks')
      .insert({
        page_id: page.id,
        block_type: blockType,
        order_position: blocks.length,
        props: getDefaultProps(blockType)
      })
      .select()
      .single();

    if (data) {
      setBlocks([...blocks, data]);
    }
  };

  const handleUpdateBlock = async (blockId: string, updates: Partial<PageBlock>) => {
    await supabase
      .from('page_blocks')
      .update(updates)
      .eq('id', blockId);

    setBlocks(blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b)));
  };

  const handleDeleteBlock = async (blockId: string) => {
    await supabase.from('page_blocks').delete().eq('id', blockId);
    setBlocks(blocks.filter((b) => b.id !== blockId));
  };

  return (
    <div className="page-builder">
      <BlockToolbar onAddBlock={handleAddBlock} />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {blocks.map((block) => (
              <SortableBlockEditor
                key={block.id}
                block={block}
                onUpdate={handleUpdateBlock}
                onDelete={handleDeleteBlock}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function getDefaultProps(blockType: string) {
  const defaults = {
    hero: { title: 'New Hero', image_url: '', height: 'md', text_color: 'pure-white' },
    text: { content: '<p>Start typing...</p>', format: 'html', text_size: 'base' },
    image: { url: '', alt: '', fit: 'cover', width: 'lg' },
    gallery: { images: [], layout: 'grid', columns: 3 },
    cta: { heading: 'Call to Action', button_text: 'Learn More', button_link: '#' }
  };
  return defaults[blockType] || {};
}
```

---

## Performance Benchmarks

### Target Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| Page Load (p95) | <2s | First Contentful Paint |
| TTFB | <500ms | Server response time |
| Lighthouse Score | >90 | Performance score |
| Database Query | <50ms | Single page + blocks query |
| Block Render | <100ms | Individual block render time |
| Admin Load | <3s | Builder interface load |
| Image Upload | <5s | Single image upload to Storage |

### Query Performance

**Optimized query (single JOIN):**
```sql
SELECT
  p.*,
  json_agg(
    pb.* ORDER BY pb.order_position
  ) AS blocks
FROM custom_pages p
LEFT JOIN page_blocks pb ON pb.page_id = p.id AND pb.is_active = true
WHERE p.slug = 'about' AND p.published = true
GROUP BY p.id;
```

**Expected execution time:** ~15-30ms (with indexes)

---

## Rollback Procedures

### Emergency Rollback

If critical issues arise post-migration:

1. **Revert to HTML rendering:**
   ```sql
   UPDATE custom_pages SET content_version = 1;
   ```

2. **Restore from backup:**
   ```sql
   UPDATE custom_pages
   SET content = backup.original_content
   FROM custom_pages_content_backup backup
   WHERE custom_pages.id = backup.page_id;
   ```

3. **Disable block rendering in code:**
   ```typescript
   // app/[slug]/page.tsx
   const FORCE_LEGACY_MODE = true; // Emergency flag
   if (FORCE_LEGACY_MODE || page.content_version === 1) {
     return <LegacyHTMLPage page={page} />;
   }
   ```

### Partial Rollback

Rollback individual pages:
```sql
UPDATE custom_pages
SET content_version = 1
WHERE id = 'specific-page-id';
```

---

## Security Checklist

- [ ] RLS policies prevent non-admins from editing
- [ ] HTML content is sanitized (use DOMPurify)
- [ ] Image uploads validate file types
- [ ] Storage buckets have size limits
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (React escapes by default)
- [ ] CSRF tokens on admin forms
- [ ] Rate limiting on API routes
- [ ] Audit log for page changes (created_by, updated_by)

---

## Support & Troubleshooting

### Common Issues

**Q: Existing pages not rendering**
- Check `content_version` field (should be 1 or 2)
- Verify migration ran successfully
- Check browser console for errors

**Q: Images not uploading**
- Verify Storage bucket exists and is public
- Check RLS policies on storage
- Ensure file size <10MB

**Q: Blocks not saving**
- Check network tab for failed requests
- Verify user has admin role
- Check Supabase logs for RLS denials

**Q: Drag-and-drop not working**
- Check @dnd-kit dependencies installed
- Verify client component boundaries
- Check browser console for errors

---

## Next Steps

1. **Review architecture documents:**
   - [ADR-001](./ADR-001-page-builder-architecture.md)
   - [Schema Documentation](./custom-page-builder-schema.md)

2. **Run migrations:**
   - `001_create_page_builder_schema.sql`
   - `002_migrate_html_to_blocks.sql`

3. **Begin Phase 4 implementation** (Server Components)

4. **Schedule review meeting** for post-MVP feedback

---

**Document Status:** ✅ READY for implementation
**Last Updated:** 2025-10-14
