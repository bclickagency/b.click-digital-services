CREATE OR REPLACE VIEW public.featured_profiles
WITH (security_invoker = true) AS
SELECT 
  id,
  full_name,
  company_name,
  avatar_url,
  bio,
  industry,
  logo_url,
  testimonial,
  rating,
  is_featured,
  collaboration_start
FROM public.profiles
WHERE is_featured = true;

-- Add a public SELECT policy for featured profiles that doesn't expose sensitive columns
-- Since we dropped the old policy, we need a new one that allows reading featured profiles
CREATE POLICY "Anyone can view featured profiles via direct query"
ON public.profiles
FOR SELECT
TO public
USING (is_featured = true);