-- Fix service icons - replace text names with actual emojis
UPDATE public.services
SET icon = CASE
  WHEN title LIKE '%Headshot%' AND title LIKE '%Professional%' THEN '👤'
  WHEN title LIKE '%Model%' OR title LIKE '%Portfolio%' THEN '📸'
  WHEN title LIKE '%Actor%' THEN '🎬'
  WHEN title LIKE '%Creative%' OR title LIKE '%Portrait%' THEN '🎨'
  WHEN title LIKE '%Team%' OR title LIKE '%Corporate%' THEN '👥'
  ELSE '📷'
END;

-- Verify the update
SELECT id, title, icon FROM public.services ORDER BY order_position;
