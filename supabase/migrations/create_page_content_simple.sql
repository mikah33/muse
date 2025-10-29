-- Create page_content table for editable pages
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE page_content DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_page_content_page_name ON page_content(page_name);
