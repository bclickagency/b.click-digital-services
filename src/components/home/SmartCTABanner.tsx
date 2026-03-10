import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, X, Rocket, Gift, Zap } from 'lucide-react';

const banners = [
  {
    icon: Gift,
    text: 'احصل على استشارة مجانية لمشروعك الآن',
    cta: 'احجز استشارتك',
    link: '/request',
    color: 'from-primary/20 to-primary/5',
  },
  {
    icon: Rocket,
    text: 'ابدأ مشروعك الرقمي اليوم وضاعف مبيعاتك',
    cta: 'ابدأ الآن',
    link: '/request',
    color: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    icon: Zap,
    text: 'خصم 20% على جميع الخدمات لفترة محدودة',
    cta: 'استفد من العرض',
    link: '/services',
    color: 'from-amber-500/20 to-amber-500/5',
  },
];

const SmartCTABanner = () => {
  const [visible, setVisible] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('cta-banner-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }
    // Show after 5 seconds of scrolling
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible || dismissed) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [visible, dismissed]);

  const dismiss = () => {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem('cta-banner-dismissed', 'true');
  };

  if (dismissed || !visible) return null;

  const banner = banners[currentBanner];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40"
      >
        <div className={`glass-card p-4 bg-gradient-to-r ${banner.color} relative`}>
          <button
            onClick={dismiss}
            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <banner.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">{banner.text}</p>
            </div>
          </div>

          <Link
            to={banner.link}
            className="btn-primary text-xs mt-3 w-full justify-center py-2.5"
            onClick={dismiss}
          >
            {banner.cta}
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartCTABanner;
