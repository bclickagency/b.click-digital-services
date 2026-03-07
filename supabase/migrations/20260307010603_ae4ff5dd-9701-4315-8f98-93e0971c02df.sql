
-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', true);

-- Storage policies for project files
CREATE POLICY "Authenticated users can upload project files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-files');

CREATE POLICY "Anyone can view project files" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-files');

CREATE POLICY "Staff can delete project files" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'project-files' AND public.is_staff(auth.uid()));
