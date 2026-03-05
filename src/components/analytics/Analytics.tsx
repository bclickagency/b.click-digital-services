import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Analytics configuration
const GA_MEASUREMENT_ID = '';
const FB_PIXEL_ID = '';
const GTM_ID = '';

const initGA = () => {
  if (!GA_MEASUREMENT_ID) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) { window.dataLayer.push(args); }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, { page_path: window.location.pathname });
  (window as any).gtag = gtag;
};

const initFBPixel = () => {
  if (!FB_PIXEL_ID) return;
  (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function() { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  (window as any).fbq('init', FB_PIXEL_ID);
  (window as any).fbq('track', 'PageView');
};

const initGTM = () => {
  if (!GTM_ID) return;
  const script = document.createElement('script');
  script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;
  document.head.appendChild(script);
};

const trackPageView = (url: string) => {
  if ((window as any).gtag && GA_MEASUREMENT_ID) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, { page_path: url });
  }
  if ((window as any).fbq) {
    (window as any).fbq('track', 'PageView');
  }
};

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if ((window as any).gtag) (window as any).gtag('event', eventName, eventParams);
  if ((window as any).fbq) (window as any).fbq('trackCustom', eventName, eventParams);
  if (window.dataLayer) window.dataLayer.push({ event: eventName, ...eventParams });
};

export const trackFormSubmission = (formName: string, formData?: Record<string, any>) => {
  trackEvent('form_submission', { form_name: formName, ...formData });
};

export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('button_click', { button_name: buttonName, location: location || window.location.pathname });
};

export const trackWhatsAppClick = (source?: string) => {
  trackEvent('whatsapp_click', { source: source || window.location.pathname });
};

export const trackPhoneCall = (source?: string) => {
  trackEvent('phone_call', { source: source || window.location.pathname });
};

export const trackServiceView = (serviceName: string) => {
  trackEvent('service_view', { service_name: serviceName });
};

export const trackPortfolioView = (projectName: string) => {
  trackEvent('portfolio_view', { project_name: projectName });
};

export const trackChatOpen = () => { trackEvent('chat_open'); };

export const trackNewsletterSignup = (email?: string) => {
  trackEvent('newsletter_signup', { email_provided: !!email });
};

export const trackScrollDepth = (percentage: number) => {
  trackEvent('scroll_depth', { percentage });
};

// Analytics Provider Component
const Analytics = () => {
  const location = useLocation();
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (cookieConsent === 'accepted') {
      initGA();
      initFBPixel();
      initGTM();
    }
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  // Throttled scroll depth tracking
  useEffect(() => {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 100];
    const tracked = new Set<number>();

    const handleScroll = () => {
      if (scrollTimerRef.current) return; // throttle
      
      scrollTimerRef.current = setTimeout(() => {
        scrollTimerRef.current = null;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) return;
        const scrollPercentage = Math.round((window.scrollY / scrollHeight) * 100);

        if (scrollPercentage > maxScroll) {
          maxScroll = scrollPercentage;
          milestones.forEach(milestone => {
            if (scrollPercentage >= milestone && !tracked.has(milestone)) {
              tracked.add(milestone);
              trackScrollDepth(milestone);
            }
          });
        }
      }, 200); // 200ms throttle
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [location]);

  return null;
};

declare global {
  interface Window { dataLayer: any[]; }
}

export default Analytics;
