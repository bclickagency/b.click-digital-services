
-- ==============================================
-- 1. Fix messages table: customer INSERT policy
-- ==============================================
DROP POLICY IF EXISTS "Customers can send messages" ON public.messages;

-- New policy: customers can only insert into conversations they own (via session header)
CREATE POLICY "Customers can send messages to own conversation"
ON public.messages
FOR INSERT
TO public
WITH CHECK (
  sender_type = 'customer'
  AND conversation_id IS NOT NULL
  AND content IS NOT NULL
  AND char_length(content) <= 5000
  AND EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
      AND c.customer_session_id = current_setting('request.headers', true)::json->>'x-session-id'
  )
);

-- Allow customers to view messages in their own conversation (needed for chat widget)
CREATE POLICY "Customers can view own conversation messages"
ON public.messages
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
      AND c.customer_session_id = current_setting('request.headers', true)::json->>'x-session-id'
  )
);

-- ==============================================
-- 2. Fix project-files storage bucket - make private
-- ==============================================
UPDATE storage.buckets SET public = false WHERE id = 'project-files';

-- Drop the overly permissive public read policy
DROP POLICY IF EXISTS "Anyone can view project files" ON storage.objects;

-- Add policy: only staff or project client can view files
CREATE POLICY "Staff and project clients can view project files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-files'
  AND (
    is_staff(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.project_files pf
      JOIN public.client_projects cp ON cp.id = pf.project_id
      WHERE pf.file_url LIKE '%' || storage.filename(name)
        AND cp.client_id = auth.uid()
    )
  )
);

-- ==============================================
-- 3. Tighten conversations INSERT policy
-- ==============================================
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.conversations;

CREATE POLICY "Anyone can create conversations with valid data"
ON public.conversations
FOR INSERT
TO public
WITH CHECK (
  customer_session_id IS NOT NULL
  AND char_length(customer_session_id) > 0
  AND customer_email IS NOT NULL
  AND char_length(customer_email) > 3
  AND customer_name IS NOT NULL
  AND char_length(customer_name) > 0
);

-- ==============================================
-- 4. Tighten contact_messages INSERT policy
-- ==============================================
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can submit contact messages with valid data"
ON public.contact_messages
FOR INSERT
TO public
WITH CHECK (
  (honeypot IS NULL OR honeypot = '')
  AND char_length(name) > 0
  AND char_length(email) > 3
  AND char_length(message) > 0
  AND char_length(message) <= 5000
  AND char_length(subject) > 0
);

-- ==============================================
-- 5. Tighten service_requests INSERT policy
-- ==============================================
DROP POLICY IF EXISTS "Anyone can create service requests" ON public.service_requests;

CREATE POLICY "Anyone can create service requests with valid data"
ON public.service_requests
FOR INSERT
TO public
WITH CHECK (
  char_length(full_name) > 0
  AND char_length(whatsapp) >= 8
  AND char_length(service_type) > 0
  AND char_length(urgency) > 0
);

-- ==============================================
-- 6. Tighten job_applications INSERT policy
-- ==============================================
DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.job_applications;

CREATE POLICY "Anyone can submit job applications with valid data"
ON public.job_applications
FOR INSERT
TO public
WITH CHECK (
  char_length(full_name) > 0
  AND char_length(email) > 3
  AND char_length(phone) > 0
  AND char_length(specialization) > 0
);

-- ==============================================
-- 7. Tighten newsletter_subscribers INSERT policy
-- ==============================================
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can subscribe with valid email"
ON public.newsletter_subscribers
FOR INSERT
TO public
WITH CHECK (
  char_length(email) > 3
);
