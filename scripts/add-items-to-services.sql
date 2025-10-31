-- Add items column to services table for detailed content
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS items TEXT[] DEFAULT '{}';

-- Update existing services with some default items
UPDATE public.services
SET items = ARRAY[
  'Professional photography with attention to lighting and composition',
  'High-resolution digital images delivered in multiple formats',
  'Flexible scheduling to accommodate your availability',
  'Comfortable studio environment designed for great results'
]
WHERE items = '{}' OR items IS NULL;
