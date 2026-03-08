-- Site content CMS table for admin-editable marketing copy
CREATE TABLE IF NOT EXISTS public.site_content (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section     text NOT NULL,
  key         text NOT NULL,
  value       jsonb NOT NULL,
  updated_at  timestamptz DEFAULT now(),
  updated_by  uuid,
  UNIQUE(section, key)
);

-- Public read access (marketing site needs to read without auth)
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read site_content" ON public.site_content FOR SELECT USING (true);
