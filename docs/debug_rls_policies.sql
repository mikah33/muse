-- ============================================================================
-- RLS Policy Debugging Script for Favorites and Dislikes Tables
-- ============================================================================
-- Purpose: Diagnose why admin queries return empty arrays despite data existing
-- Usage: Run this in Supabase SQL Editor or psql
-- ============================================================================

\echo '========================================';
\echo 'PART 1: RLS POLICIES ON FAVORITES TABLE';
\echo '========================================';
\echo '';

-- Show all RLS policies on favorites table
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'favorites'
ORDER BY policyname;

\echo '';
\echo '========================================';
\echo 'PART 2: RLS POLICIES ON DISLIKES TABLE';
\echo '========================================';
\echo '';

-- Show all RLS policies on dislikes table
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'dislikes'
ORDER BY policyname;

\echo '';
\echo '========================================';
\echo 'PART 3: CHECK IF RLS IS ENABLED';
\echo '========================================';
\echo '';

-- Check if RLS is enabled on both tables
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('favorites', 'dislikes')
ORDER BY tablename;

\echo '';
\echo '========================================';
\echo 'PART 4: CHECK FOR ADMIN POLICIES';
\echo '========================================';
\echo '';

-- Check if admin policies exist for favorites
SELECT
    policyname,
    'favorites' as table_name,
    CASE
        WHEN policyname ILIKE '%admin%' THEN 'ADMIN POLICY FOUND'
        ELSE 'Regular Policy'
    END as policy_type,
    qual as using_expression
FROM pg_policies
WHERE tablename = 'favorites'
ORDER BY policy_type DESC;

\echo '';

-- Check if admin policies exist for dislikes
SELECT
    policyname,
    'dislikes' as table_name,
    CASE
        WHEN policyname ILIKE '%admin%' THEN 'ADMIN POLICY FOUND'
        ELSE 'Regular Policy'
    END as policy_type,
    qual as using_expression
FROM pg_policies
WHERE tablename = 'dislikes'
ORDER BY policy_type DESC;

\echo '';
\echo '========================================';
\echo 'PART 5: CHECK ACTUAL DATA COUNT';
\echo '========================================';
\echo '';

-- Count total rows in favorites (bypassing RLS)
SELECT
    'favorites' as table_name,
    COUNT(*) as total_rows,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT portfolio_item_id) as unique_items
FROM favorites;

\echo '';

-- Count total rows in dislikes (bypassing RLS)
SELECT
    'dislikes' as table_name,
    COUNT(*) as total_rows,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT portfolio_item_id) as unique_items
FROM dislikes;

\echo '';
\echo '========================================';
\echo 'PART 6: SAMPLE DATA FROM TABLES';
\echo '========================================';
\echo '';

-- Show sample favorites data
SELECT
    id,
    user_id,
    portfolio_item_id,
    created_at
FROM favorites
ORDER BY created_at DESC
LIMIT 5;

\echo '';

-- Show sample dislikes data
SELECT
    id,
    user_id,
    portfolio_item_id,
    created_at
FROM dislikes
ORDER BY created_at DESC
LIMIT 5;

\echo '';
\echo '========================================';
\echo 'PART 7: TEST ADMIN ACCESS';
\echo '========================================';
\echo '';

-- Test query to check if current user can see favorites
-- This simulates what the admin API call does
SELECT
    'favorites' as table_name,
    COUNT(*) as visible_rows_to_current_user
FROM favorites;

\echo '';

-- Test query to check if current user can see dislikes
SELECT
    'dislikes' as table_name,
    COUNT(*) as visible_rows_to_current_user
FROM dislikes;

\echo '';
\echo '========================================';
\echo 'PART 8: CHECK USER ROLE FUNCTION';
\echo '========================================';
\echo '';

-- Check if the is_admin() function exists and works
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc
        WHERE proname = 'is_admin'
    ) THEN
        RAISE NOTICE 'is_admin() function EXISTS';
    ELSE
        RAISE NOTICE 'is_admin() function DOES NOT EXIST - THIS IS THE PROBLEM!';
    END IF;
END $$;

\echo '';

-- Show the definition of is_admin function if it exists
SELECT
    pg_get_functiondef(oid) as function_definition
FROM pg_proc
WHERE proname = 'is_admin';

\echo '';
\echo '========================================';
\echo 'PART 9: CHECK auth.users FOR ADMIN';
\echo '========================================';
\echo '';

-- Check if there are any admin users
SELECT
    id,
    email,
    raw_user_meta_data->>'role' as user_role,
    created_at
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin'
   OR email LIKE '%admin%'
ORDER BY created_at DESC;

\echo '';
\echo '========================================';
\echo 'PART 10: RECOMMENDED FIXES';
\echo '========================================';
\echo '';

-- SQL to create missing admin policies for favorites
\echo 'If admin policies are missing for FAVORITES, run this:';
\echo '';
\echo 'CREATE POLICY "Admin full access to favorites"';
\echo '  ON favorites';
\echo '  FOR ALL';
\echo '  TO authenticated';
\echo '  USING (';
\echo '    EXISTS (';
\echo '      SELECT 1 FROM auth.users';
\echo '      WHERE auth.users.id = auth.uid()';
\echo '      AND auth.users.raw_user_meta_data->>''role'' = ''admin''';
\echo '    )';
\echo '  );';
\echo '';

-- SQL to create missing admin policies for dislikes
\echo 'If admin policies are missing for DISLIKES, run this:';
\echo '';
\echo 'CREATE POLICY "Admin full access to dislikes"';
\echo '  ON dislikes';
\echo '  FOR ALL';
\echo '  TO authenticated';
\echo '  USING (';
\echo '    EXISTS (';
\echo '      SELECT 1 FROM auth.users';
\echo '      WHERE auth.users.id = auth.uid()';
\echo '      AND auth.users.raw_user_meta_data->>''role'' = ''admin''';
\echo '    )';
\echo '  );';
\echo '';

\echo '';
\echo '========================================';
\echo 'PART 11: ALTERNATIVE - BYPASS RLS';
\echo '========================================';
\echo '';

-- Show how to temporarily disable RLS for testing
\echo 'To temporarily disable RLS for testing (NOT for production):';
\echo '';
\echo 'ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;';
\echo 'ALTER TABLE dislikes DISABLE ROW LEVEL SECURITY;';
\echo '';
\echo 'To re-enable:';
\echo 'ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;';
\echo 'ALTER TABLE dislikes ENABLE ROW LEVEL SECURITY;';
\echo '';

\echo '';
\echo '========================================';
\echo 'DEBUG SCRIPT COMPLETE';
\echo '========================================';
\echo '';
\echo 'Review the output above to identify:';
\echo '1. Missing admin policies';
\echo '2. Incorrect policy expressions';
\echo '3. RLS enabled but no matching policies';
\echo '4. Missing is_admin() function';
\echo '5. No admin users in auth.users';
\echo '';
