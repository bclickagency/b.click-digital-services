import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-xl mx-auto md:left-6 md:right-auto md:mx-0"
        >
          <div className="glass-card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-2">نستخدم ملفات تعريف الارتباط 🍪</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك اختيار الموافقة على جميع الملفات أو تخصيص إعداداتك.
                </p>

                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="space-y-3 py-4 border-t border-border">
                        <label className="flex items-center justify-between cursor-not-allowed opacity-60">
                          <span className="text-sm font-medium">ضرورية (مطلوبة)</span>
                          <div className="w-10 h-6 bg-primary rounded-full flex items-center justify-end px-1">
                            <div className="w-4 h-4 bg-white rounded-full" />
                          </div>
                        </label>
                        
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm font-medium">التحليلات</span>
                          <button
                            onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                            className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                              preferences.analytics ? 'bg-primary justify-end' : 'bg-muted justify-start'
                            }`}
                          >
                            <div className="w-4 h-4 bg-white rounded-full" />
                          </button>
                        </label>

                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm font-medium">التسويق</span>
                          <button
                            onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                            className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                              preferences.marketing ? 'bg-primary justify-end' : 'bg-muted justify-start'
                            }`}
                          >
                            <div className="w-4 h-4 bg-white rounded-full" />
                          </button>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleAcceptAll}
                    className="btn-primary text-sm py-2"
                  >
                    <Check className="w-4 h-4" />
                    قبول الكل
                  </button>
                  
                  {showSettings ? (
                    <button
                      onClick={handleAcceptSelected}
                      className="btn-ghost text-sm py-2"
                    >
                      حفظ الإعدادات
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSettings(true)}
                      className="btn-ghost text-sm py-2"
                    >
                      <Settings className="w-4 h-4" />
                      تخصيص
                    </button>
                  )}
                  
                  <button
                    onClick={handleRejectAll}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 px-3"
                  >
                    رفض غير الضرورية
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
