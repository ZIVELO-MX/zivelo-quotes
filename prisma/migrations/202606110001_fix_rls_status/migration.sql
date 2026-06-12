-- Fix RLS policy: app uses 'active' for published quotes, not 'published'.
DROP POLICY IF EXISTS "anon_select_published_quotes" ON "Quote";

CREATE POLICY "anon_select_active_quotes" ON "Quote"
  FOR SELECT
  TO anon
  USING (status = 'active');
