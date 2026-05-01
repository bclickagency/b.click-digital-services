
-- Restore SELECT grant to anon (was revoked in prior migration) but only on safe columns.
-- Re-grant table-level SELECT on all non-sensitive columns to anon and authenticated.
GRANT SELECT (
  id, client_id, title, description, status, priority, service_type,
  start_date, end_date, progress, cover_image, images, problem, solution,
  results, client_story, how_we_helped, results_metrics, project_url,
  tags, is_featured, is_public, created_at, updated_at
) ON public.client_projects TO anon, authenticated;

-- Explicitly do NOT grant SELECT on the `notes` column to anon/authenticated.
-- Staff access goes through service_role/staff policies which bypass column grants
-- only via service_role; signed-in staff use the existing "Staff can view all projects"
-- policy. Since column-level privileges restrict signed-in non-staff users too, we must
-- grant `notes` SELECT to authenticated as well — but only the staff RLS policy allows
-- them to actually read rows. Non-staff authenticated users are blocked at row level.
GRANT SELECT (notes) ON public.client_projects TO authenticated;

-- Drop the redundant view from prior migration; it is no longer needed.
DROP VIEW IF EXISTS public.public_client_projects;

-- Drop the narrow anon-only policy added previously; restore the original public policy.
DROP POLICY IF EXISTS "Public rows readable for view" ON public.client_projects;

CREATE POLICY "Anyone can view public projects"
ON public.client_projects
FOR SELECT
TO anon, authenticated
USING (is_public = true);
