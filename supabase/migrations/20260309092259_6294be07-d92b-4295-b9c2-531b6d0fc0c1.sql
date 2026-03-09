
-- Add showcase fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS industry text,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS rating integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS testimonial text,
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS collaboration_start date;

-- Add case study fields to client_projects
ALTER TABLE public.client_projects
  ADD COLUMN IF NOT EXISTS cover_image text,
  ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS problem text,
  ADD COLUMN IF NOT EXISTS solution text,
  ADD COLUMN IF NOT EXISTS results text,
  ADD COLUMN IF NOT EXISTS client_story text,
  ADD COLUMN IF NOT EXISTS how_we_helped text,
  ADD COLUMN IF NOT EXISTS results_metrics jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS project_url text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Allow anyone to view public client projects
CREATE POLICY "Anyone can view public projects"
  ON public.client_projects
  FOR SELECT
  USING (is_public = true);

-- Allow anyone to view featured profiles (for showcase)
CREATE POLICY "Anyone can view featured profiles"
  ON public.profiles
  FOR SELECT
  USING (is_featured = true);
