# Visual Page Builder - Comprehensive Architecture Plan

## Executive Summary

**Recommendation:** Implement a **hybrid approach** - start with a JSON block-based system using a simple template selector (MVP), then progressively enhance with drag-and-drop capabilities.

**Complexity Rating:** 6/10 (MVP), 8/10 (Full Feature)
**Time Estimate:**
- MVP (Template Selector): 2-3 days
- Phase 2 (Visual Blocks): 4-5 days
- Phase 3 (Drag & Drop): 3-4 days
- **Total:** 9-12 days

---

## Current State Analysis

### Existing Implementation
```typescript
// CustomPageForm.tsx - Current approach
- Plain text/HTML toggle
- Manual HTML/text editing
- Basic form fields (title, slug, publish status)
- Simple content storage in database
```

### Database Schema (Inferred)
```sql
custom_pages {
  id: UUID
  title: TEXT
  slug: TEXT
  content: TEXT (stores HTML/plain text)
  published: BOOLEAN
  show_in_header: BOOLEAN
  show_in_mobile_menu: BOOLEAN
  order_position: INTEGER
}
```

### Frontend Rendering
```typescript
// [slug]/page.tsx - Renders with dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: page.content }} />
```

---

## Architectural Decision: Why Hybrid Approach?

### Option Comparison

| Approach | Pros | Cons | Complexity | Time |
|----------|------|------|------------|------|
| **Custom Builder** | Full control, perfect match | High development time, maintenance burden | 9/10 | 20+ days |
| **Library (GrapesJS, Craft.js)** | Feature-rich, proven | Heavy bundle, over-engineered, hard to theme | 7/10 | 10-15 days |
| **Block System (Recommended)** | Balanced, scalable, maintainable | Less visual initially | 6/10 | 9-12 days |
| **Template Selector** | Fastest to implement | Limited flexibility | 3/10 | 2-3 days |
| **Notion-style Editor** | Great UX, modern | Complex block nesting | 8/10 | 15+ days |

### Why Block System Wins

1. **Incrementally Adoptable** - Start simple, add features progressively
2. **Maintainable** - Clean separation of concerns, easy to debug
3. **Performant** - No heavy libraries, optimized bundle size
4. **Customizable** - Perfect control over monotone theme
5. **Scalable** - Easy to add new block types
6. **Type-Safe** - Full TypeScript support

---

## Recommended Solution: Block-Based Page Builder

### Core Concept

Store pages as **JSON blocks** instead of raw HTML:

```typescript
interface PageBlock {
  id: string
  type: 'hero' | 'text' | 'image' | 'gallery' | 'cta' | 'contact'
  content: Record<string, any>
  settings: {
    background?: 'white' | 'gray' | 'black'
    padding?: 'none' | 'small' | 'medium' | 'large'
    alignment?: 'left' | 'center' | 'right'
  }
}

interface CustomPage {
  // ... existing fields
  blocks: PageBlock[]  // NEW: Replaces raw HTML content
}
```

---

## Implementation Phases

### Phase 1: MVP - Template Selector (2-3 days)

**Goal:** Replace plain HTML with pre-built page templates

#### Features
- 5-6 pre-designed page templates (About, Services, Contact, etc.)
- Simple dropdown to select template
- Each template = predefined JSON blocks
- Basic customization (edit text, swap images)

#### Database Migration
```sql
-- Add new column for block storage
ALTER TABLE custom_pages
ADD COLUMN blocks JSONB DEFAULT '[]'::jsonb;

-- Keep content column for backward compatibility
-- Migrate existing pages to blocks format
```

#### Components Structure
```
components/admin/page-builder/
├── PageTemplateSelector.tsx        # Template picker
├── BlockEditor.tsx                 # Edit individual blocks
├── blocks/
│   ├── HeroBlock.tsx
│   ├── TextBlock.tsx
│   ├── ImageBlock.tsx
│   └── GalleryBlock.tsx
└── preview/
    └── PagePreview.tsx             # Live preview
```

#### Example Template
```typescript
const ABOUT_TEMPLATE: PageBlock[] = [
  {
    id: 'hero-1',
    type: 'hero',
    content: {
      heading: 'About Us',
      subheading: 'Capturing moments that last forever',
      backgroundImage: ''
    },
    settings: {
      background: 'black',
      padding: 'large',
      alignment: 'center'
    }
  },
  {
    id: 'text-1',
    type: 'text',
    content: {
      heading: 'Our Story',
      body: 'Edit this text to tell your story...',
    },
    settings: {
      background: 'white',
      padding: 'medium',
      alignment: 'left'
    }
  }
]
```

#### User Experience
1. Click "Create Page"
2. Select template from gallery
3. Click blocks to edit content inline
4. Preview changes in real-time
5. Publish when ready

**Complexity:** 3/10 - Simple implementation
**Time:** 2-3 days

---

### Phase 2: Visual Block Editor (4-5 days)

**Goal:** Add/remove/reorder blocks with visual controls

#### New Features
- Add new blocks via "+ Add Block" button
- Delete blocks with confirmation
- Reorder blocks with up/down arrows
- Duplicate blocks
- Block library panel

#### Enhanced UI
```typescript
// Block toolbar
<BlockToolbar>
  <MoveUpButton />
  <MoveDownButton />
  <DuplicateButton />
  <DeleteButton />
  <SettingsButton />
</BlockToolbar>
```

#### Block Library
```
Available Blocks:
- Hero Section (full-width, centered text)
- Text Block (heading + paragraphs)
- Image Block (single image with caption)
- Image Gallery (grid of images)
- Call to Action (button + text)
- Contact Form (embedded form)
- Divider (horizontal line)
- Spacer (vertical spacing)
```

#### Settings Panel
```typescript
interface BlockSettings {
  // Layout
  background: 'white' | 'gray' | 'black'
  padding: 'none' | 'small' | 'medium' | 'large'
  alignment: 'left' | 'center' | 'right'

  // Spacing
  marginTop: number
  marginBottom: number

  // Container
  maxWidth: 'full' | 'container' | 'narrow'
}
```

**Complexity:** 6/10 - Moderate complexity
**Time:** 4-5 days

---

### Phase 3: Drag & Drop (3-4 days)

**Goal:** Enable drag-and-drop reordering

#### Technology
- **react-dnd** (already in package.json!)
- Same library used for portfolio item reordering
- Proven to work in the codebase

#### Implementation
```typescript
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function DraggableBlock({ block, index }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'BLOCK',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [, drop] = useDrop({
    accept: 'BLOCK',
    hover: (item) => {
      if (item.index !== index) {
        moveBlock(item.index, index)
        item.index = index
      }
    }
  })

  return (
    <div ref={(node) => drag(drop(node))}>
      {/* Block content */}
    </div>
  )
}
```

**Complexity:** 7/10 - Advanced interaction
**Time:** 3-4 days

---

## Component Architecture

### Data Model

```typescript
// types/page-builder.ts

export type BlockType =
  | 'hero'
  | 'text'
  | 'image'
  | 'gallery'
  | 'cta'
  | 'contact'
  | 'divider'
  | 'spacer'

export interface PageBlock {
  id: string
  type: BlockType
  content: BlockContent
  settings: BlockSettings
}

export interface BlockContent {
  // Hero
  heading?: string
  subheading?: string
  backgroundImage?: string
  buttonText?: string
  buttonLink?: string

  // Text
  body?: string

  // Image
  imageUrl?: string
  caption?: string
  alt?: string

  // Gallery
  images?: Array<{
    url: string
    alt: string
    caption?: string
  }>

  // CTA
  ctaHeading?: string
  ctaText?: string
  ctaButtonText?: string
  ctaButtonLink?: string
}

export interface BlockSettings {
  background: 'white' | 'gray' | 'black'
  padding: 'none' | 'small' | 'medium' | 'large'
  alignment: 'left' | 'center' | 'right'
  maxWidth: 'full' | 'container' | 'narrow'
  marginTop: number
  marginBottom: number
}

export interface CustomPageData {
  id?: string
  title: string
  slug: string
  blocks: PageBlock[]
  published: boolean
  show_in_header: boolean
  show_in_mobile_menu: boolean
  order_position: number
  created_at?: string
  updated_at?: string
}
```

### Component Tree

```
CustomPageForm.tsx (Enhanced)
├── PageBuilderHeader
│   ├── TitleInput
│   ├── SlugInput
│   └── PublishToggle
│
├── PageBuilderEditor
│   ├── TemplateSelectorModal (Phase 1)
│   ├── BlockLibrary (Phase 2)
│   │   └── BlockButton[]
│   │
│   ├── BlockList (DndProvider for Phase 3)
│   │   └── DraggableBlock[]
│   │       ├── BlockToolbar
│   │       │   ├── MoveButton
│   │       │   ├── DuplicateButton
│   │       │   ├── SettingsButton
│   │       │   └── DeleteButton
│   │       │
│   │       └── BlockRenderer
│   │           ├── HeroBlockEditor
│   │           ├── TextBlockEditor
│   │           ├── ImageBlockEditor
│   │           ├── GalleryBlockEditor
│   │           ├── CTABlockEditor
│   │           └── ContactBlockEditor
│   │
│   └── BlockSettingsPanel
│       ├── BackgroundSelector
│       ├── PaddingSlider
│       ├── AlignmentToggle
│       └── SpacingControls
│
└── PagePreview
    └── BlockRenderer[] (read-only)
```

---

## Block Type Specifications

### 1. Hero Block

**Purpose:** Full-width section with heading, subheading, optional background image

**Content Fields:**
- Heading (required)
- Subheading (optional)
- Background image URL (optional)
- Button text (optional)
- Button link (optional)

**Render Output:**
```tsx
<section className={`relative ${bgClass} ${paddingClass}`}>
  {backgroundImage && (
    <Image src={backgroundImage} fill className="object-cover" />
  )}
  <div className={`relative z-10 ${maxWidthClass} ${alignClass}`}>
    <h1 className="font-serif text-5xl">{heading}</h1>
    {subheading && <p className="text-xl">{subheading}</p>}
    {buttonText && (
      <Link href={buttonLink}>
        <button>{buttonText}</button>
      </Link>
    )}
  </div>
</section>
```

**Example Use Cases:**
- Landing page headers
- Section dividers
- Full-width announcements

---

### 2. Text Block

**Purpose:** Rich text content with heading

**Content Fields:**
- Heading (optional)
- Body text (required, Markdown or plain text)

**Render Output:**
```tsx
<div className={`${bgClass} ${paddingClass}`}>
  <div className={`${maxWidthClass} ${alignClass}`}>
    {heading && <h2 className="font-serif text-3xl mb-4">{heading}</h2>}
    <div className="prose prose-lg"
         dangerouslySetInnerHTML={{ __html: processedBody }} />
  </div>
</div>
```

**Example Use Cases:**
- About sections
- Service descriptions
- Blog-style content

---

### 3. Image Block

**Purpose:** Single image with optional caption

**Content Fields:**
- Image URL (required)
- Alt text (required)
- Caption (optional)

**Upload Integration:**
- Uses existing Supabase storage
- Same upload mechanism as PortfolioItemForm
- Supports RAW formats

**Render Output:**
```tsx
<div className={`${bgClass} ${paddingClass}`}>
  <div className={`${maxWidthClass} ${alignClass}`}>
    <Image
      src={imageUrl}
      alt={alt}
      width={1200}
      height={800}
      className="w-full h-auto"
    />
    {caption && (
      <p className="text-sm text-gray-600 mt-2">{caption}</p>
    )}
  </div>
</div>
```

---

### 4. Gallery Block

**Purpose:** Grid of images (like portfolio grid)

**Content Fields:**
- Images array (required)
  - URL
  - Alt text
  - Caption (optional)
- Columns (2, 3, or 4)

**Render Output:**
```tsx
<div className={`${bgClass} ${paddingClass}`}>
  <div className={maxWidthClass}>
    <div className={`grid grid-cols-${columns} gap-6`}>
      {images.map(img => (
        <div key={img.url}>
          <Image src={img.url} alt={img.alt} />
          {img.caption && <p>{img.caption}</p>}
        </div>
      ))}
    </div>
  </div>
</div>
```

---

### 5. Call-to-Action Block

**Purpose:** Prominent button with surrounding text

**Content Fields:**
- Heading (required)
- Description text (optional)
- Button text (required)
- Button link (required)

**Render Output:**
```tsx
<div className={`${bgClass} ${paddingClass}`}>
  <div className={`${maxWidthClass} text-center`}>
    <h2 className="font-serif text-4xl mb-4">{heading}</h2>
    {description && <p className="text-lg mb-8">{description}</p>}
    <Link href={buttonLink}>
      <button className="bg-black text-white px-8 py-4">
        {buttonText}
      </button>
    </Link>
  </div>
</div>
```

---

### 6. Contact Form Block

**Purpose:** Embedded contact form

**Content Fields:**
- Heading (optional)
- Form fields (pre-configured)
- Submit button text

**Integration:**
- Uses existing contact form logic
- Sends to same endpoint as /contact page
- Validates with same rules

---

## Database Schema Changes

### Migration Script

```sql
-- Phase 1: Add blocks column
ALTER TABLE custom_pages
ADD COLUMN IF NOT EXISTS blocks JSONB DEFAULT '[]'::jsonb;

-- Add index for performance
CREATE INDEX idx_custom_pages_blocks ON custom_pages USING gin(blocks);

-- Phase 2: Migrate existing content to blocks
UPDATE custom_pages
SET blocks = jsonb_build_array(
  jsonb_build_object(
    'id', gen_random_uuid()::text,
    'type', 'text',
    'content', jsonb_build_object(
      'body', content
    ),
    'settings', jsonb_build_object(
      'background', 'white',
      'padding', 'medium',
      'alignment', 'left',
      'maxWidth', 'container',
      'marginTop', 0,
      'marginBottom', 0
    )
  )
)
WHERE blocks = '[]'::jsonb;

-- Phase 3: Eventually deprecate content column
-- ALTER TABLE custom_pages DROP COLUMN content; (Do this later)
```

### Backward Compatibility

Keep `content` column during transition:
- New pages use `blocks`
- Old pages continue to work
- Gradual migration over time

---

## Frontend Rendering Updates

### Updated [slug]/page.tsx

```tsx
import { BlockRenderer } from '@/components/page-builder/BlockRenderer'

export default async function CustomPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('custom_pages')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!page) notFound()

  // Parse blocks (with fallback to legacy content)
  const blocks = page.blocks || []
  const legacyContent = page.content

  return (
    <div className="min-h-screen bg-white">
      <Header customPages={customPages || []} />

      <main className="pt-32">
        {/* Render blocks */}
        {blocks.length > 0 ? (
          <BlockRenderer blocks={blocks} />
        ) : (
          // Fallback for legacy pages
          <div className="max-w-4xl mx-auto px-4 py-20">
            <h1 className="text-4xl font-serif mb-8">{page.title}</h1>
            <div
              className="prose prose-lg"
              dangerouslySetInnerHTML={{ __html: legacyContent }}
            />
          </div>
        )}
      </main>
    </div>
  )
}
```

### BlockRenderer Component

```tsx
// components/page-builder/BlockRenderer.tsx
import { PageBlock } from '@/types/page-builder'
import HeroBlock from './blocks/HeroBlock'
import TextBlock from './blocks/TextBlock'
import ImageBlock from './blocks/ImageBlock'
import GalleryBlock from './blocks/GalleryBlock'
import CTABlock from './blocks/CTABlock'

interface BlockRendererProps {
  blocks: PageBlock[]
  isPreview?: boolean
}

export function BlockRenderer({ blocks, isPreview = false }: BlockRendererProps) {
  return (
    <>
      {blocks.map(block => {
        switch (block.type) {
          case 'hero':
            return <HeroBlock key={block.id} {...block} />
          case 'text':
            return <TextBlock key={block.id} {...block} />
          case 'image':
            return <ImageBlock key={block.id} {...block} />
          case 'gallery':
            return <GalleryBlock key={block.id} {...block} />
          case 'cta':
            return <CTABlock key={block.id} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
```

---

## Monotone Theme Integration

### Design System

```typescript
// Theme configuration matching site aesthetic
const THEME = {
  colors: {
    white: '#FFFFFF',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      500: '#6B7280',
      900: '#111827'
    },
    black: '#000000',
    charcoal: '#1a1a1a' // From existing portfolio page
  },

  spacing: {
    none: 'py-0',
    small: 'py-8',
    medium: 'py-16',
    large: 'py-24'
  },

  maxWidth: {
    full: 'max-w-full',
    container: 'max-w-7xl mx-auto px-8',
    narrow: 'max-w-4xl mx-auto px-8'
  }
}
```

### Block Editor UI

```tsx
// Monotone color picker
function BackgroundSelector({ value, onChange }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange('white')}
        className={`w-12 h-12 bg-white border-2 ${
          value === 'white' ? 'border-black' : 'border-gray-300'
        }`}
      />
      <button
        onClick={() => onChange('gray')}
        className={`w-12 h-12 bg-gray-100 border-2 ${
          value === 'gray' ? 'border-black' : 'border-gray-300'
        }`}
      />
      <button
        onClick={() => onChange('black')}
        className={`w-12 h-12 bg-black border-2 ${
          value === 'black' ? 'border-white' : 'border-gray-300'
        }`}
      />
    </div>
  )
}
```

---

## Image Upload Integration

### Reuse Existing Infrastructure

```typescript
// From PortfolioItemForm.tsx - proven to work
const handleImageUpload = async (file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('blog-images') // Reuse existing bucket
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(fileName)

  return publicUrl
}
```

### Gallery Multi-Upload

```typescript
// Upload multiple images for gallery block
async function uploadGalleryImages(files: File[]): Promise<GalleryImage[]> {
  const uploads = files.map(async (file) => {
    const url = await handleImageUpload(file)
    return {
      url,
      alt: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      caption: ''
    }
  })

  return Promise.all(uploads)
}
```

---

## User Experience Flow

### Creating a New Page

```
1. Click "Create Page" in /admin/pages
   ↓
2. Choose starting point:
   - Start from template
   - Start blank
   ↓
3. If template: Select from gallery
   - About Us
   - Services
   - Contact
   - Portfolio Showcase
   - Custom (blank)
   ↓
4. Edit page details:
   - Title
   - URL slug
   - Visibility settings
   ↓
5. Edit blocks:
   - Click block to edit content
   - Use toolbar to reorder/delete
   - Add new blocks from library
   ↓
6. Preview changes in real-time
   ↓
7. Save as draft or publish
```

### Editing Existing Page

```
1. Click "Edit" on page in /admin/pages
   ↓
2. See live preview + editor side-by-side
   ↓
3. Edit blocks inline:
   - Click to edit text
   - Upload images via drag-drop or click
   - Adjust settings in panel
   ↓
4. Reorder blocks:
   - Drag and drop (Phase 3)
   - Up/down arrows (Phase 2)
   ↓
5. Save changes
```

---

## Alternative Approaches Considered

### 1. GrapesJS (Popular Page Builder Library)

**Pros:**
- Feature-complete out of the box
- Drag-and-drop editor
- Component library
- Asset manager

**Cons:**
- 200KB+ bundle size (bloated)
- Complex theming (hard to match monotone design)
- Over-engineered for our needs
- jQuery dependency (outdated)

**Verdict:** ❌ Too heavy, doesn't fit our stack

---

### 2. Craft.js (React Page Builder)

**Pros:**
- Modern React-based
- Flexible component system
- TypeScript support
- Good documentation

**Cons:**
- Still 100KB+ bundle
- Learning curve for custom components
- More complex than needed
- Requires significant customization

**Verdict:** ⚠️ Possible but overkill

---

### 3. Notion-Style Block Editor (tiptap/slate)

**Pros:**
- Excellent UX
- Modern feel
- Rich text editing
- Block nesting

**Cons:**
- Complex implementation
- Not ideal for visual layout
- Primarily text-focused
- 15+ days development time

**Verdict:** ⚠️ Great for blogs, not page layouts

---

### 4. WordPress-Style Gutenberg Blocks

**Pros:**
- Proven pattern
- User-friendly
- Flexible

**Cons:**
- WordPress-specific implementation
- Would require React port
- Complex state management

**Verdict:** ✅ Good inspiration, but not directly usable

---

### 5. Simple Template Selector (Chosen MVP)

**Pros:**
- Fast to implement (2-3 days)
- Easy to use
- No learning curve
- Lightweight

**Cons:**
- Limited flexibility initially
- Can't add arbitrary blocks (until Phase 2)

**Verdict:** ✅ Perfect MVP approach

---

## Complexity Assessment

### Phase 1 (Template Selector): 3/10
- Simple form enhancements
- JSON data structure
- Pre-built templates
- Basic block editing

**Challenges:**
- Template design
- Migration of existing pages

---

### Phase 2 (Visual Blocks): 6/10
- Dynamic block management
- Settings panel
- Live preview
- State management

**Challenges:**
- Block library UI
- Settings persistence
- Preview synchronization

---

### Phase 3 (Drag & Drop): 7/10
- react-dnd integration
- Drag states
- Drop zones
- Animation

**Challenges:**
- Smooth animations
- Touch device support
- Accessibility

---

## Time Estimates (Detailed)

### Phase 1: Template Selector (2-3 days)

**Day 1:**
- Database migration (2 hours)
- Data type definitions (1 hour)
- Template definitions (2 hours)
- Template selector UI (3 hours)

**Day 2:**
- Block editor components (4 hours)
- Image upload integration (2 hours)
- Settings panel basics (2 hours)

**Day 3:**
- BlockRenderer component (3 hours)
- Frontend [slug]/page.tsx updates (2 hours)
- Testing & bug fixes (3 hours)

**Total:** 24 hours = 3 days

---

### Phase 2: Visual Blocks (4-5 days)

**Day 1:**
- Block library UI (4 hours)
- Add/remove block logic (4 hours)

**Day 2:**
- Reorder with arrows (3 hours)
- Duplicate block feature (2 hours)
- Block toolbar component (3 hours)

**Day 3:**
- Enhanced settings panel (4 hours)
- Spacing controls (2 hours)
- Background/layout options (2 hours)

**Day 4:**
- Live preview improvements (4 hours)
- State synchronization (4 hours)

**Day 5:**
- Polish & refinement (4 hours)
- Testing (4 hours)

**Total:** 40 hours = 5 days

---

### Phase 3: Drag & Drop (3-4 days)

**Day 1:**
- react-dnd setup (2 hours)
- Draggable block wrapper (3 hours)
- Drop zone logic (3 hours)

**Day 2:**
- Drag preview styling (3 hours)
- Drop indicators (2 hours)
- Animation polish (3 hours)

**Day 3:**
- Touch device support (4 hours)
- Accessibility (2 hours)
- Edge case handling (2 hours)

**Day 4 (buffer):**
- Testing across devices (4 hours)
- Bug fixes (4 hours)

**Total:** 32 hours = 4 days

---

## Risk Assessment & Mitigation

### Risk 1: Performance with Many Blocks

**Likelihood:** Medium
**Impact:** Medium

**Mitigation:**
- Lazy load block editors
- Virtualize long page previews
- Debounce auto-save

---

### Risk 2: Image Upload Failures

**Likelihood:** Low (proven system)
**Impact:** High

**Mitigation:**
- Reuse existing upload logic from PortfolioItemForm
- Add retry mechanism
- Show clear error messages
- Allow manual URL entry as fallback

---

### Risk 3: Complex Page Layouts

**Likelihood:** High
**Impact:** Low

**Mitigation:**
- Start with simple block types
- Add layout blocks later (columns, grids)
- Provide templates for common layouts

---

### Risk 4: User Confusion

**Likelihood:** Medium
**Impact:** Medium

**Mitigation:**
- Clear onboarding tooltips
- Template gallery with previews
- "Getting Started" guide
- Video tutorial (optional)

---

### Risk 5: Browser Compatibility

**Likelihood:** Low
**Impact:** Medium

**Mitigation:**
- Use established patterns (Next.js, Tailwind)
- Test in major browsers
- Graceful degradation

---

## Success Metrics

### Phase 1 Success Criteria
- ✅ 5+ page templates available
- ✅ Admin can create page from template in <2 minutes
- ✅ Existing pages continue to work
- ✅ Images upload successfully
- ✅ Pages render correctly on frontend

### Phase 2 Success Criteria
- ✅ Can add/remove blocks easily
- ✅ Can reorder blocks without drag-drop
- ✅ Settings panel is intuitive
- ✅ Live preview updates instantly
- ✅ No data loss on save

### Phase 3 Success Criteria
- ✅ Drag-and-drop feels smooth
- ✅ Works on touch devices
- ✅ Accessible via keyboard
- ✅ Clear visual feedback during drag

---

## Comparison to Existing Features

### Similar Patterns in Codebase

#### PortfolioItemForm (Lessons Learned)
- ✅ Image upload works well
- ✅ Form validation is solid
- ✅ Simple, clean UI
- 🔄 Could benefit from drag-and-drop (solved in Phase 3)

#### BulkPortfolioUpload
- ✅ Multi-file upload proven
- ✅ Progress indicators helpful
- 🔄 Can reuse for gallery blocks

---

## Technology Stack Alignment

### Already in Project
- ✅ Next.js 15 App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Supabase storage
- ✅ react-dnd (for drag-and-drop)
- ✅ Image component (Next.js)

### Need to Add
- ❌ None! (All dependencies already present)

---

## Deployment Considerations

### Database Migration Strategy

```bash
# 1. Create migration file
supabase migration new add_blocks_to_custom_pages

# 2. Apply migration
supabase db push

# 3. Verify
supabase db diff
```

### Backward Compatibility

- Keep `content` column for 30 days
- Add warning in admin if old format detected
- Provide "Convert to Blocks" button
- Gradual migration, not forced

### Rollback Plan

```sql
-- If needed, revert blocks to HTML
UPDATE custom_pages
SET content = (
  SELECT string_agg(block->>'body', E'\n\n')
  FROM jsonb_array_elements(blocks) AS block
  WHERE block->>'type' = 'text'
)
WHERE blocks IS NOT NULL;

-- Then drop blocks column
ALTER TABLE custom_pages DROP COLUMN blocks;
```

---

## Future Enhancements (Post-MVP)

### Phase 4: Advanced Blocks (Optional)
- Video embed block
- Testimonial carousel
- Pricing table
- FAQ accordion
- Newsletter signup
- Social media feed

### Phase 5: Layout Blocks (Optional)
- Two-column layout
- Three-column grid
- Sidebar layouts
- Tabbed content

### Phase 6: AI Assistance (Optional)
- Generate page from description
- Suggest blocks based on content
- Auto-optimize images
- SEO recommendations

---

## Final Recommendation

### Start with Phase 1 (Template Selector)

**Why:**
1. Delivers immediate value (better UX than raw HTML)
2. Low risk (simple implementation)
3. Fast to market (2-3 days)
4. Validates approach with real usage
5. Foundation for future phases

**Then Evaluate:**
- User feedback on templates
- Demand for custom layouts
- Complexity tolerance
- ROI on further development

**If Successful, Proceed to Phase 2:**
- Add block library
- Enable add/remove/reorder
- Enhanced settings

**If Very Successful, Add Phase 3:**
- Drag-and-drop polish
- Advanced interactions

---

## Estimated Total Investment

### MVP (Phase 1)
- **Time:** 2-3 days (16-24 hours)
- **Complexity:** 3/10
- **Risk:** Low
- **Value:** High

### Full Feature (All Phases)
- **Time:** 9-12 days (72-96 hours)
- **Complexity:** 6-7/10
- **Risk:** Medium
- **Value:** Very High

---

## Questions for Stakeholder

1. **Priority:** Is this high priority vs other features?
2. **Timeline:** When do you need this completed?
3. **Scope:** Start with MVP or go straight to full feature?
4. **Users:** How many pages will be created? (impacts performance needs)
5. **Training:** Will users need training/documentation?

---

## Next Steps

If approved:

1. **Day 1-3:** Implement Phase 1 (MVP)
2. **Day 4:** User testing with stakeholder
3. **Day 5:** Iterate based on feedback
4. **Decision:** Proceed to Phase 2 or stop at MVP

---

## Conclusion

The visual page builder is **definitely worth implementing** as a phased approach:

1. ✅ **Complexity is manageable** (6/10 overall)
2. ✅ **Time investment is reasonable** (9-12 days total, 2-3 for MVP)
3. ✅ **Technology fits our stack** (no new dependencies)
4. ✅ **Risk is low** (proven patterns, incremental approach)
5. ✅ **Value is high** (much better UX than raw HTML)

**Recommendation:** Proceed with Phase 1 MVP implementation.

---

**Document Version:** 1.0
**Date:** October 14, 2025
**Author:** Strategic Planning Analysis
