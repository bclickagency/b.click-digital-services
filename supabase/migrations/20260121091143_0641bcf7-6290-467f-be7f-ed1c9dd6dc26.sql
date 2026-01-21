-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'team_member');

-- Create enum for request status
CREATE TYPE public.request_status AS ENUM ('new', 'contacted', 'closed');

-- Create service_requests table
CREATE TABLE public.service_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    service_type TEXT NOT NULL,
    urgency TEXT NOT NULL,
    details TEXT,
    status request_status NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin or team member
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'team_member')
  )
$$;

-- Policies for service_requests
CREATE POLICY "Anyone can create service requests" 
ON public.service_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Staff can view all service requests" 
ON public.service_requests 
FOR SELECT 
USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can update service requests" 
ON public.service_requests 
FOR UPDATE 
USING (public.is_staff(auth.uid()));

CREATE POLICY "Admins can delete service requests" 
ON public.service_requests 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));