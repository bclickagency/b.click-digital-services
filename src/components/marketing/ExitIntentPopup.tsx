import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem('exitPopupShown');
    if (shown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
          />

          {/* Popup - centered with fixed positioning */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="glass-card p-8 relative overflow-hidden w-full max-w-md">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 left-4 p-2 rounded-lg hover:bg-muted/50 transition-colors z-20"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 pointer-events-none" />

              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-8 h-8 text-secondary" />
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  قبل ما تمشي! 🎁
                </h2>
                <p className="text-muted-foreground mb-6">
                  احصل على <span className="text-secondary font-bold">خصم 10%</span> على أول مشروع معنا
                </p>

                {/* Offer Details */}
                <div className="bg-muted/50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-foreground font-medium mb-1">
                    استخدم كود الخصم:
                  </p>
                  <code className="text-lg font-bold text-primary">WELCOME10</code>
                </div>

                {/* CTA */}
                <Link
                  to="/request"
                  onClick={handleClose}
                  className="btn-secondary w-full mb-3"
                >
                  استفد من العرض الآن
                  <ArrowLeft className="w-5 h-5" />
                </Link>

                <button
                  onClick={handleClose}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  لا شكرًا، سأتصفح أكثر
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
