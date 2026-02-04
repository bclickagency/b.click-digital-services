import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, X, Eye, Type, MousePointer, Contrast } from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  focusIndicators: boolean;
}

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    focusIndicators: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    if (settings.focusIndicators) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const options = [
    { 
      key: 'highContrast' as const, 
      label: 'تباين عالي', 
      icon: Contrast,
      description: 'زيادة التباين بين الألوان'
    },
    { 
      key: 'largeText' as const, 
      label: 'نص كبير', 
      icon: Type,
      description: 'تكبير حجم النصوص'
    },
    { 
      key: 'reducedMotion' as const, 
      label: 'تقليل الحركة', 
      icon: Eye,
      description: 'تعطيل الرسوم المتحركة'
    },
    { 
      key: 'focusIndicators' as const, 
      label: 'مؤشرات التركيز', 
      icon: MousePointer,
      description: 'إظهار حدود العناصر المحددة'
    },
  ];

  return (
    <>
      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
      >
        انتقل للمحتوى الرئيسي
      </a>

      {/* Accessibility Button - Positioned in top right corner to avoid conflicts */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-28 right-4 z-30 w-10 h-10 rounded-xl bg-background/80 backdrop-blur-xl border border-border/50 flex items-center justify-center hover:bg-muted/80 transition-all duration-300 shadow-lg"
        aria-label="إعدادات الوصول"
      >
        <Accessibility className="w-5 h-5 text-foreground" />
      </motion.button>

      {/* Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed top-0 bottom-0 right-0 z-50 w-80 max-w-full glass shadow-xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Accessibility className="w-6 h-6 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">إعدادات الوصول</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Options */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {options.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => toggleSetting(option.key)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                          settings[option.key]
                            ? 'bg-primary/10 border-2 border-primary'
                            : 'bg-muted/50 border-2 border-transparent hover:bg-muted'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          settings[option.key] ? 'bg-primary/20' : 'bg-background'
                        }`}>
                          <option.icon className={`w-5 h-5 ${
                            settings[option.key] ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1 text-right">
                          <h3 className="font-semibold text-foreground">{option.label}</h3>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                        <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                          settings[option.key] ? 'bg-primary justify-end' : 'bg-muted justify-start'
                        }`}>
                          <div className="w-4 h-4 bg-white rounded-full" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                  <button
                    onClick={() => setSettings({
                      highContrast: false,
                      largeText: false,
                      reducedMotion: false,
                      focusIndicators: true,
                    })}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    إعادة تعيين الإعدادات
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityMenu;
