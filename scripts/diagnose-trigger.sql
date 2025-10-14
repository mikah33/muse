-- Diagnose the trigger that's likely causing the 500 error

-- 1. Check if the trigger function has any issues
SELECT
  proname AS function_name,
  pg_get_functiondef(oid) AS function_definition
FROM pg_proc
WHERE proname = 'handle_new_user';

-- 2. Check trigger status
SELECT
  t.tgname AS trigger_name,
  t.tgenabled AS enabled,
  c.relname AS table_name,
  p.proname AS function_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE t.tgname = 'on_auth_user_created';

-- 3. Try to manually execute what the trigger does to see if it errors
DO $$
DECLARE
  test_user_id UUID := '00000000-0000-0000-0000-000000000001';
  test_email TEXT := 'test@test.com';
  test_role TEXT;
  test_name TEXT;
BEGIN
  -- Simulate what the trigger does
  test_role := 'customer';
  test_name := 'Test User';

  -- Try the insert that the trigger would do
  BEGIN
    INSERT INTO public.users (id, email, role, full_name)
    VALUES (
      test_user_id,
      test_email,
      test_role,
      test_name
    );

    RAISE NOTICE 'Trigger simulation: SUCCESS';

    -- Clean up test
    DELETE FROM public.users WHERE id = test_user_id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Trigger simulation FAILED: % %', SQLERRM, SQLSTATE;
  END;
END $$;

-- 4. Check for any broken constraints
SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.users'::regclass;
