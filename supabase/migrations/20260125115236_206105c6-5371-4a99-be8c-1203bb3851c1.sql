-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL DEFAULT 'عام',
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio items table
CREATE TABLE public.portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  full_description TEXT,
  cover_image TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'تصميم',
  technologies TEXT[] DEFAULT '{}',
  client_name TEXT,
  project_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts FOR SELECT
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "Staff can view all blog posts"
ON public.blog_posts FOR SELECT
USING (is_staff(auth.uid()));

CREATE POLICY "Staff can create blog posts"
ON public.blog_posts FOR INSERT
WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Staff can update blog posts"
ON public.blog_posts FOR UPDATE
USING (is_staff(auth.uid()));

CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Portfolio policies
CREATE POLICY "Anyone can view published portfolio items"
ON public.portfolio_items FOR SELECT
USING (status = 'published');

CREATE POLICY "Staff can view all portfolio items"
ON public.portfolio_items FOR SELECT
USING (is_staff(auth.uid()));

CREATE POLICY "Staff can create portfolio items"
ON public.portfolio_items FOR INSERT
WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Staff can update portfolio items"
ON public.portfolio_items FOR UPDATE
USING (is_staff(auth.uid()));

CREATE POLICY "Admins can delete portfolio items"
ON public.portfolio_items FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function for auto-updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to publish scheduled posts (can be called by cron)
CREATE OR REPLACE FUNCTION public.publish_scheduled_posts()
RETURNS void AS $$
BEGIN
  UPDATE public.blog_posts
  SET status = 'published', published_at = now()
  WHERE status = 'scheduled' AND scheduled_at <= now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;