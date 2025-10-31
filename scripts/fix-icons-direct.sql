-- Directly set emoji icons for each service
UPDATE public.services SET icon = '👤' WHERE title = 'Professional Headshots';
UPDATE public.services SET icon = '📸' WHERE title = 'Model Portfolio Photography';
UPDATE public.services SET icon = '🎬' WHERE title = 'Actor Headshots';
UPDATE public.services SET icon = '🎨' WHERE title = 'Creative Portraits';
UPDATE public.services SET icon = '👥' WHERE title = 'Team & Corporate Photography';

-- Verify
SELECT title, icon FROM public.services ORDER BY order_position;
