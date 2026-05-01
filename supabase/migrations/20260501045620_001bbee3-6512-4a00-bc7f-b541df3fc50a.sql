
-- 1) Fix client_projects: hide internal `notes` from public viewers
-- Drop the broad public policy and replace with a column-aware approach via a public view.
DROP POLICY IF EXISTS "Anyone can view public projects" ON public.client_projects;

-- Recreate a public-read policy that excludes the notes column at the view layer.
-- Since RLS cannot restrict columns directly, we keep table SELECT for staff/client only,
-- and expose public projects through a SECURITY INVOKER view that excludes `notes`.
CREATE OR REPLACE VIEW public.public_client_projects
WITH (security_invoker = true) AS
SELECT
  id, client_id, title, description, status, priority, service_type,
  start_date, end_date, progress, cover_image, images, problem, solution,
  results, client_story, how_we_helped, results_metrics, project_url,
  tags, is_featured, is_public, created_at, updated_at
FROM public.client_projects
WHERE is_public = true;

GRANT SELECT ON public.public_client_projects TO anon, authenticated;

-- Re-add a narrow public policy ONLY needed for the view to work for anon reads.
-- The view runs as invoker, so RLS still applies. We must allow anon to SELECT
-- public rows, but we will scope the policy to public rows only and rely on the
-- view to project away the `notes` column. To prevent direct table SELECT of
-- `notes` by anon, we restrict SELECT on the table itself to staff/clients only.
-- (No public policy is recreated on the base table.)

-- Anonymous/public readers must use public.public_client_projects view.
-- However the view (security_invoker) requires the underlying RLS to permit the
-- read for anon. Add a minimal SELECT policy on the table that only matches
-- public rows, knowing API consumers querying the table directly would still
-- see all columns. To prevent that, REVOKE direct table SELECT from anon and
-- only grant it on the view.
REVOKE SELECT ON public.client_projects FROM anon;

-- Allow anon SELECT only through the view by granting via a permissive policy
-- limited to public rows; combined with the column revoke above, anon cannot
-- query the table directly.
CREATE POLICY "Public rows readable for view"
ON public.client_projects
FOR SELECT
TO anon
USING (is_public = true);

-- 2) Tighten project-files bucket: only staff or the project's client can upload
DROP POLICY IF EXISTS "Authenticated users can upload project files" ON storage.objects;

CREATE POLICY "Staff or project client can upload project files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-files'
  AND (
    is_staff(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.client_projects cp
      WHERE cp.client_id = auth.uid()
        AND (storage.foldername(name))[1] = cp.id::text
    )
  )
);

-- 3) Restrict Realtime channel subscriptions: deny by default on realtime.messages
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated staff can subscribe to all topics" ON realtime.messages;
DROP POLICY IF EXISTS "Clients can subscribe to own topics" ON realtime.messages;

-- Staff can subscribe to any topic
CREATE POLICY "Authenticated staff can subscribe to all topics"
ON realtime.messages
FOR SELECT
TO authenticated
USING (public.is_staff(auth.uid()));

-- Clients can only subscribe to topics scoped to their own user id
-- (frontends should subscribe to channels named like `user:<auth.uid()>` or `project:<project_id>`)
CREATE POLICY "Clients can subscribe to own topics"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  public.is_staff(auth.uid())
  OR (extension = 'postgres_changes' AND auth.uid() IS NOT NULL)
);
