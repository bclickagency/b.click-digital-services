import { useMemo } from 'react';

interface LeadTrackingData {
  lead_source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
}

export const useLeadTracking = (): LeadTrackingData => {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const utm_source = params.get('utm_source');
    const utm_medium = params.get('utm_medium');
    const utm_campaign = params.get('utm_campaign');
    const referrer = document.referrer || null;

    let lead_source = 'direct';
    if (utm_source) lead_source = utm_source;
    else if (referrer) {
      if (referrer.includes('google')) lead_source = 'google';
      else if (referrer.includes('facebook')) lead_source = 'facebook';
      else if (referrer.includes('instagram')) lead_source = 'instagram';
      else lead_source = 'referral';
    }

    return { lead_source, utm_source, utm_medium, utm_campaign, referrer };
  }, []);
};
