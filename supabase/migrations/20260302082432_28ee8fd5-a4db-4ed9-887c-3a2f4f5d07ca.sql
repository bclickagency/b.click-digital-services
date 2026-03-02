
-- Table for contact form submissions
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  lead_source TEXT DEFAULT 'direct',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  honeypot TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for newsletter subscriptions
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add lead_source column to service_requests
ALTER TABLE public.service_requests 
ADD COLUMN IF NOT EXISTS lead_source TEXT DEFAULT 'direct',
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public can insert contact messages
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages FOR INSERT
WITH CHECK (true);

-- Staff can view contact messages
CREATE POLICY "Staff can view contact messages"
ON public.contact_messages FOR SELECT
USING (is_staff(auth.uid()));

-- Staff can update contact messages
CREATE POLICY "Staff can update contact messages"
ON public.contact_messages FOR UPDATE
USING (is_staff(auth.uid()));

-- Admin can delete contact messages
CREATE POLICY "Admin can delete contact messages"
ON public.contact_messages FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers FOR INSERT
WITH CHECK (true);

-- Staff can view subscribers
CREATE POLICY "Staff can view newsletter subscribers"
ON public.newsletter_subscribers FOR SELECT
USING (is_staff(auth.uid()));

-- Enable realtime for contact_messages so dashboard gets notified
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_requests;
