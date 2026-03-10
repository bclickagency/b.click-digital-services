import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Star } from 'lucide-react';

const notifications = [
  { name: 'أحمد م.', action: 'طلب خدمة تطوير موقع', time: 'منذ 3 دقائق', type: 'request' },
  { name: 'سارة ع.', action: 'أكملت مشروعها بنجاح', time: 'منذ 12 دقيقة', type: 'complete' },
  { name: 'محمد ر.', action: 'قيّم الخدمة ⭐⭐⭐⭐⭐', time: 'منذ 25 دقيقة', type: 'review' },
  { name: 'فاطمة ح.', action: 'بدأت مشروع تطبيق موبايل', time: 'منذ ساعة', type: 'request' },
  { name: 'خالد ن.', action: 'طلب خدمة التسويق الرقمي', time: 'منذ ساعتين', type: 'request' },
  { name: 'نورة س.', action: 'حصلت على هوية بصرية جديدة', time: 'منذ 3 ساعات', type: 'complete' },
];

const FloatingSocialProof = () => {
  const [current, setCurrent] = useState(-1);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('social-proof-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Show first notification after 8 seconds
    const initialDelay = setTimeout(() => setCurrent(0), 8000);
    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (current < 0 || dismissed) return;

    // Auto-hide after 4 seconds, then show next after 15 seconds
    const hideTimer = setTimeout(() => setCurrent(-1), 4000);
    const nextTimer = setTimeout(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % notifications.length;
        return next;
      });
    }, 15000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [current, dismissed]);

  if (dismissed || current < 0) return null;

  const notif = notifications[current];

  return (
    <AnimatePresence>
      <motion.div
        key={current}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-6 right-auto left-4 md:left-6 z-30 max-w-xs cursor-pointer"
        onClick={() => {
          setDismissed(true);
          sessionStorage.setItem('social-proof-dismissed', 'true');
        }}
      >
        <div className="glass-card p-3 flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {notif.type === 'complete' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : notif.type === 'review' ? (
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            ) : (
              <span className="text-sm font-bold text-primary">
                {notif.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {notif.name} {notif.action}
            </p>
            <p className="text-[10px] text-muted-foreground">{notif.time}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingSocialProof;
