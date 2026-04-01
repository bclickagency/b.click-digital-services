-- 1. Fix user_roles privilege escalation: replace ALL policy with separate per-command policies
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix featured profiles public exposure: create a secure view and replace the policy
DROP POLICY IF EXISTS "Anyone can view featured profiles" ON public.profiles;

CREATE OR REPLACE VIEW public.featured_profiles AS
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

GRANT SELECT ON public.featured_profiles TO anon, authenticated;

-- 3. Fix conversation session spoofing: drop the insecure policy
DROP POLICY IF EXISTS "Customers can view own conversations" ON public.conversations;

-- Also drop the insecure messages policy that uses the same pattern
DROP POLICY IF EXISTS "Customers can view own messages" ON public.messages;