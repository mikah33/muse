# Custom Page Builder Architecture Documentation

**Project:** Model Muse Studio - Custom Page Builder System
**Status:** Architecture Design Complete ✅
**Date:** 2025-10-14
**Version:** 1.0.0

---

## Executive Summary

This documentation set provides a comprehensive design for migrating from a simple HTML-based custom page system to a flexible, component-based page builder with drag-and-drop capabilities, version history, and template support.

**Recommended Approach:** Hybrid architecture with separate `page_blocks` table and JSONB properties for maximum flexibility and queryability.

**Timeline:** 8-10 weeks for full implementation
**Complexity:** Medium
**Risk:** Low (maintains backward compatibility)

---

## Document Index

### 1. [Custom Page Builder Schema](./custom-page-builder-schema.md)
**50+ pages | Comprehensive technical specification**

**What's inside:**
- Complete database schema design with SQL DDL
- TypeScript interface definitions for all block types
- Rendering strategy (server vs client components)
- Migration path from HTML to blocks
- Backup and versioning strategy
- Performance implications and projections
- Scalability analysis
- 10-phase implementation roadmap
- Example block definitions (Hero, Gallery, Text, etc.)
- Trade-offs analysis

**When to read:** First stop for understanding the entire system

---

### 2. [ADR-001: Page Builder Architecture](./ADR-001-page-builder-architecture.md)
**Architecture Decision Record**

**What's inside:**
- Problem statement and context
- Four considered options (JSON, Separate Tables, Templates, CMS)
- Detailed pros/cons analysis for each option
- Decision rationale and justification
- Success criteria and validation metrics
- Risk mitigation strategies
- Future enhancement roadmap

**When to read:** When you need to understand WHY decisions were made

---

### 3. [Implementation Guide](./implementation-guide.md)
**Developer's roadmap**

**What's inside:**
- System architecture diagrams (ASCII art)
- Data flow diagrams (public rendering + admin editing)
- 10-phase implementation checklist
- File structure and component hierarchy
- Code examples for key components:
  - BlockRenderer
  - HeroBlock
  - PageBuilder (admin)
- Performance benchmarks and targets
- Rollback procedures
- Security checklist
- Troubleshooting guide

**When to read:** During actual implementation

---

### 4. [Database Migrations](./migrations/)

#### 4.1 `001_create_page_builder_schema.sql`
**What it does:**
- Adds columns to `custom_pages` (content_version, description, og_image, etc.)
- Creates `page_blocks` table
- Creates `page_block_versions` table (version history)
- Creates `page_templates` table (pre-built layouts)
- Adds indexes for performance
- Sets up RLS policies
- Creates triggers for auto-versioning

**When to run:** Before any implementation work begins

#### 4.2 `002_migrate_html_to_blocks.sql`
**What it does:**
- Converts existing HTML content to text blocks
- Creates backup of original content
- Verifies migration success
- Inserts sample templates (About, Portfolio, Contact, Services)

**When to run:** After schema migration and before deploying new UI

---

## Quick Start Guide

### For Developers

**1. Understand the architecture** (30 minutes)
```bash
# Read in this order:
1. This README (you are here)
2. ADR-001-page-builder-architecture.md (decision rationale)
3. custom-page-builder-schema.md (technical details)
4. implementation-guide.md (how to build it)
```

**2. Set up database** (15 minutes)
```bash
# Connect to Supabase SQL Editor
# Run migrations in order:
migrations/001_create_page_builder_schema.sql
migrations/002_migrate_html_to_blocks.sql

# Verify:
SELECT * FROM page_blocks LIMIT 1;
SELECT * FROM page_templates;
```

**3. Create TypeScript types** (30 minutes)
```bash
# Create file: types/page-builder.ts
# Copy interfaces from custom-page-builder-schema.md section 2
```

**4. Build server components** (Week 1-2)
```bash
# Priority order:
1. BlockRenderer.tsx
2. TextBlock.tsx
3. ImageBlock.tsx
4. HeroBlock.tsx
5. GalleryBlock.tsx
6. CTABlock.tsx
```

**5. Build admin UI** (Week 3-5)
```bash
# Install dependencies:
npm install @dnd-kit/core @dnd-kit/sortable

# Build in order:
1. PageBuilder.tsx (drag-and-drop wrapper)
2. BlockToolbar.tsx (add block UI)
3. Block editors (one per block type)
```

---

### For Product/Business

**What problem does this solve?**
- Admins currently write raw HTML to create custom pages
- No visual editing, slow updates, error-prone
- Can't track changes or roll back mistakes
- Hard to maintain brand consistency

**What will users be able to do?**
- Create pages visually with drag-and-drop
- Choose from pre-built templates
- Add/remove/reorder content blocks
- Upload images directly from editor
- Preview changes before publishing
- Roll back to previous versions

**Business impact:**
- Reduce page creation time: ~2-3 hours → 15-30 minutes (80% faster)
- Lower error rate: No HTML knowledge required
- Increase consistency: Template-based layouts
- Enable non-technical admins: No coding skills needed
- Faster iterations: Quick A/B testing of layouts

**Timeline:**
- Database setup: 1 week
- Public rendering: 2 weeks
- Admin builder UI: 4 weeks
- Testing/refinement: 2 weeks
- **Total: 9-10 weeks**

**Risks:**
- Low: Maintains full backward compatibility
- All existing pages continue working during rollout
- Can rollback to HTML mode if needed

---

## Architecture at a Glance

### Database Structure

```
custom_pages (1 page)
    ├── id, title, slug
    ├── content (legacy HTML)
    ├── content_version (1=HTML, 2=Blocks)
    └── published, show_in_header, etc.

    ↓ has many

page_blocks (5-10 blocks per page)
    ├── id, page_id
    ├── block_type ('hero', 'text', 'image', 'gallery', 'cta')
    ├── props (JSONB - flexible properties)
    ├── spacing, alignment, background_color
    ├── order_position
    └── visibility (mobile, tablet, desktop)

    ↓ tracked by

page_block_versions (version history)
    ├── block_id, version_number
    ├── snapshot of all block data
    └── change_description, created_by, created_at
```

### Component Hierarchy

**Public Site (Server Components):**
```
app/[slug]/page.tsx
  └── BlockRenderer
      ├── HeroBlock
      ├── TextBlock
      ├── ImageBlock
      ├── GalleryBlock
      └── CTABlock
```

**Admin Panel (Client Components):**
```
app/admin/pages/edit/[id]/page.tsx
  └── PageBuilder
      ├── BlockToolbar
      ├── DnD Wrapper
      └── Block Editors
          ├── HeroBlockEditor
          ├── TextBlockEditor
          ├── ImageBlockEditor
          ├── GalleryBlockEditor
          └── CTABlockEditor
```

---

## Key Design Decisions

### 1. Separate Blocks Table vs JSON Column
**Decision:** Separate `page_blocks` table
**Rationale:** Better queryability, indexing, and versioning
**Trade-off:** Slightly more complex, requires JOIN queries

### 2. JSONB for Block Properties
**Decision:** Use JSONB for flexible props per block type
**Rationale:** Each block type has different properties; no schema changes needed for new blocks
**Trade-off:** Less type safety at database level (handled in TypeScript)

### 3. Server Components for Rendering
**Decision:** Render blocks on server, not client
**Rationale:** Better SEO, performance, and caching
**Trade-off:** Less interactivity (fine for static pages)

### 4. Backward Compatibility
**Decision:** Maintain `content` column and `content_version` flag
**Rationale:** Zero-downtime migration, easy rollback, gradual transition
**Trade-off:** Temporary schema duplication (removed after 6 months)

### 5. Version History
**Decision:** Automatic snapshots on every block edit
**Rationale:** Enables undo/redo, audit trail, compliance
**Trade-off:** Increased storage (~10x), managed with retention policies

---

## Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| Page Load (p95) | <2s | Server-side rendering, CDN caching |
| TTFB | <500ms | Indexed queries, connection pooling |
| Lighthouse Score | >90 | Optimized images, minimal JS |
| Database Query | <50ms | Indexes on page_id, block_type, order_position |
| Admin Load | <3s | Code splitting, lazy loading editors |
| Storage Growth | ~15MB/100 pages | Acceptable; monitor and archive old versions |

---

## Security Considerations

### Row-Level Security (RLS)
- **Public:** Can SELECT published pages and their blocks
- **Admins:** Full CRUD access to all pages and blocks
- **Storage:** Public read, admin write on page-* buckets

### Content Sanitization
- HTML in TextBlock sanitized with DOMPurify
- Image uploads validated (type, size)
- No user-supplied SQL (always parameterized queries)

### Audit Trail
- Every block change creates version snapshot
- Tracks `created_by` and `updated_by` user IDs
- Can review history and attribute changes

---

## Migration Safety

### Backup Strategy
1. Full database backup before migration
2. Separate `custom_pages_content_backup` table
3. Keep `content` column for 6 months
4. Daily automated backups of all tables

### Rollback Plan
```sql
-- Emergency rollback to HTML mode
UPDATE custom_pages SET content_version = 1;
```

### Validation
- Test on staging database first
- Verify all pages render correctly
- Check performance metrics
- Validate RLS policies
- Smoke test admin interface

---

## Success Metrics

### Launch Criteria (MVP)
- [ ] All 5 core block types implemented (Hero, Text, Image, Gallery, CTA)
- [ ] Existing pages migrated to blocks with 100% fidelity
- [ ] Admin can create new pages using builder
- [ ] Admin can edit existing pages visually
- [ ] Page load time <2s (p95)
- [ ] Lighthouse score >90
- [ ] Zero data loss during migration
- [ ] All tests passing (>80% coverage)

### Post-Launch (30 days)
- [ ] 100% of new pages created with builder (not HTML)
- [ ] >80% admin satisfaction score
- [ ] <5 bugs reported
- [ ] Average page creation time <30 minutes
- [ ] Zero security incidents
- [ ] Performance targets met

---

## Future Enhancements

**Post-MVP features to consider:**

- **Phase 2 (3 months):** Advanced blocks (Columns, Video, Quote)
- **Phase 3 (6 months):** A/B testing, scheduled publishing
- **Phase 4 (9 months):** Page analytics, AI content suggestions
- **Phase 5 (12 months):** Multi-language support, collaborative editing

---

## Technical Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Drag-and-Drop:** @dnd-kit
- **Rich Text:** (TBD: Quill, Tiptap, or Lexical)
- **Image Lightbox:** yet-another-react-lightbox (already installed)

### Backend
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage
- **Auth:** Supabase Auth
- **API:** Next.js Route Handlers

### DevOps
- **Hosting:** Vercel (frontend) + Supabase (backend)
- **CI/CD:** Vercel auto-deploy on push
- **Monitoring:** Vercel Analytics, Supabase Dashboard

---

## Team Roles

### Required Skills

**Backend/Database:**
- SQL migrations
- JSONB schema design
- RLS policy writing
- Performance optimization

**Frontend:**
- React Server Components
- TypeScript
- Drag-and-drop UX
- Image upload/crop

**Full-Stack:**
- Next.js App Router
- Supabase integration
- End-to-end testing

**Estimated Team:**
- 1 Full-Stack Developer (can handle entire project)
- OR 1 Frontend + 1 Backend (faster)

---

## Getting Help

### Documentation
- [Supabase JSONB Docs](https://supabase.com/docs/guides/database/json)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [DnD Kit Documentation](https://docs.dndkit.com/)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)

### Internal Resources
- Database Schema: [custom-page-builder-schema.md](./custom-page-builder-schema.md)
- Architecture Decision: [ADR-001](./ADR-001-page-builder-architecture.md)
- Implementation Guide: [implementation-guide.md](./implementation-guide.md)
- SQL Migrations: [migrations/](./migrations/)

---

## Conclusion

This architecture provides:

✅ **Backward compatibility** - Existing pages continue working
✅ **Flexibility** - Easy to add new block types
✅ **Performance** - Fast queries, server-side rendering
✅ **Type safety** - Strong TypeScript interfaces
✅ **Scalability** - Handles 1000+ pages efficiently
✅ **Version control** - Full audit trail and rollback
✅ **Great UX** - Drag-and-drop visual editing
✅ **Low risk** - Gradual migration, rollback plan

**Status:** ✅ **APPROVED** for implementation

**Next Steps:**
1. Review this documentation set
2. Schedule kickoff meeting
3. Run database migrations
4. Begin Phase 1 implementation

---

**Document Version:** 1.0.0
**Last Updated:** 2025-10-14
**Maintained By:** Architecture Team
