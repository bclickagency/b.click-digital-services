-- Create task status enum
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status public.task_status NOT NULL DEFAULT 'todo',
  priority public.task_priority NOT NULL DEFAULT 'medium',
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.client_projects(id) ON DELETE SET NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Staff can view all tasks
CREATE POLICY "Staff can view all tasks"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (public.is_staff(auth.uid()));

-- Staff can create tasks
CREATE POLICY "Staff can create tasks"
  ON public.tasks FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

-- Staff can update tasks
CREATE POLICY "Staff can update tasks"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING (public.is_staff(auth.uid()));

-- Admins can delete tasks
CREATE POLICY "Admins can delete tasks"
  ON public.tasks FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;