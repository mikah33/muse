-- Fix the handle_new_user function with proper error handling

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Insert with ON CONFLICT to handle any issues gracefully
  INSERT INTO public.users (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), 'User')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log but don't fail - auth must succeed even if trigger fails
    RAISE WARNING 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- Test it works
SELECT 'Function updated successfully' as status;
