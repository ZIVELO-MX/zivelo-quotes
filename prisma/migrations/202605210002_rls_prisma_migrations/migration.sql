-- Enable RLS on Prisma internal migration table and block all access
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deny_all_prisma_migrations" ON "_prisma_migrations"
  FOR ALL
  USING (false)
  WITH CHECK (false);
