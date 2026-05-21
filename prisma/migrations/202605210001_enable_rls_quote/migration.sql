-- Enable Row Level Security on Quote table
ALTER TABLE "Quote" ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published quotes (public-facing /q/[quoteSlug] pages)
CREATE POLICY "anon_select_published_quotes" ON "Quote"
  FOR SELECT
  TO anon
  USING (status = 'published');

-- Allow authenticated users full access (create, read, update, delete)
CREATE POLICY "authenticated_all_quotes" ON "Quote"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
