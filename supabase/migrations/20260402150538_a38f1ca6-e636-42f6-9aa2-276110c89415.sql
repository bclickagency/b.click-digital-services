-- Add interests column to newsletter_subscribers
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}'::text[];

-- Site Content table for configurable sections
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  title text,
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active site content" ON public.site_content
  FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can view all site content" ON public.site_content
  FOR SELECT TO authenticated USING (is_staff(auth.uid()));

CREATE POLICY "Admins can manage site content" ON public.site_content
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Team Members table
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  avatar_url text,
  social_links jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active team members" ON public.team_members
  FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can view all team members" ON public.team_members
  FOR SELECT TO authenticated USING (is_staff(auth.uid()));

CREATE POLICY "Admins can manage team members" ON public.team_members
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Job Listings table
CREATE TABLE public.job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  type text NOT NULL DEFAULT 'دوام كامل',
  location text NOT NULL DEFAULT 'عن بُعد',
  description text,
  requirements text[] DEFAULT '{}'::text[],
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active job listings" ON public.job_listings
  FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can view all job listings" ON public.job_listings
  FOR SELECT TO authenticated USING (is_staff(auth.uid()));

CREATE POLICY "Admins can manage job listings" ON public.job_listings
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Job Applications table
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.job_listings(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  location text,
  specialization text NOT NULL,
  expertise text,
  experience_years text,
  portfolio_link text,
  previous_experience text,
  freelance_experience text,
  expected_salary text,
  skill_level text,
  availability text,
  pricing_details text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit job applications" ON public.job_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can view job applications" ON public.job_applications
  FOR SELECT TO authenticated USING (is_staff(auth.uid()));

CREATE POLICY "Admins can manage job applications" ON public.job_applications
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete job applications" ON public.job_applications
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Pricing Plans table
CREATE TABLE public.pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EGP',
  billing_period text DEFAULT 'شهري',
  features text[] DEFAULT '{}'::text[],
  is_popular boolean DEFAULT false,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  service_type text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active pricing plans" ON public.pricing_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Staff can view all pricing plans" ON public.pricing_plans
  FOR SELECT TO authenticated USING (is_staff(auth.uid()));

CREATE POLICY "Admins can manage pricing plans" ON public.pricing_plans
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add updated_at triggers
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_listings_updated_at BEFORE UPDATE ON public.job_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();