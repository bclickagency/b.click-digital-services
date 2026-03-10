
-- Replace publish_scheduled_posts with auth check
CREATE OR REPLACE FUNCTION public.publish_scheduled_posts()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow service role or authenticated staff to call this
  IF auth.uid() IS NOT NULL AND NOT is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Authentication required: only staff can publish scheduled posts';
  END IF;
  
  UPDATE public.blog_posts
  SET status = 'published', published_at = now()
  WHERE status = 'scheduled' AND scheduled_at <= now();
END;
$function$;
