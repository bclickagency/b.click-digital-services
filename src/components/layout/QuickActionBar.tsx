import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Briefcase, X, ChevronUp } from 'lucide-react';

const actions = [
  {
    icon: Phone,
    label: 'اتصل بنا',
    href: 'tel:+201558663972',
    variant: 'success' as const,
    external: true,
  },
  {
    icon: MessageCircle,
    label: 'واتساب',
    href: 'https://wa.me/201558663972',
    variant: 'whatsapp' as const,
    external: true,
  },
  {
    icon: Briefcase,
    label: 'اطلب خدمة',
    href: '/request',
    variant: 'primary' as const,
    external: false,
  },
];

const getButtonStyles = (variant: 'success' | 'whatsapp' | 'primary') => {
  const base = "flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 backdrop-blur-xl border shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.2)]";
  
  switch (variant) {
    case 'success':
      return `${base} bg-[hsl(142_70%_45%)] border-[hsl(142_70%_50%/0.3)] text-white hover:shadow-[0_8px_25px_hsl(142_70%_45%/0.4),inset_0_1px_1px_hsl(0_0%_100%/0.2)]`;
    case 'whatsapp':
      return `${base} bg-[hsl(142_70%_40%)] border-[hsl(142_70%_45%/0.3)] text-white hover:shadow-[0_8px_25px_hsl(142_70%_40%/0.4),inset_0_1px_1px_hsl(0_0%_100%/0.2)]`;
    case 'primary':
      return `${base} bg-primary border-primary/30 text-primary-foreground hover:shadow-[0_8px_25px_hsl(248_98%_60%/0.4),inset_0_1px_1px_hsl(0_0%_100%/0.2)]`;
  }
};

const QuickActionBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderActionButton = (action: typeof actions[0]) => {
    const buttonContent = (
      <>
        <action.icon className="w-4 h-4" />
        <span className={isMobile && !isExpanded ? 'hidden' : ''}>{action.label}</span>
      </>
    );

    if (action.external) {
      return (
        <a
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className={getButtonStyles(action.variant)}
        >
          {buttonContent}
        </a>
      );
    }

    return (
      <Link to={action.href} className={getButtonStyles(action.variant)}>
        {buttonContent}
      </Link>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-40 md:left-1/2 md:right-auto md:bottom-6 md:-translate-x-1/2"
        >
          <div className="bg-background/70 backdrop-blur-2xl rounded-full p-2 flex items-center gap-2 max-w-fit mx-auto border border-border/30 shadow-[0_8px_40px_hsl(0_0%_0%/0.15),inset_0_1px_1px_hsl(0_0%_100%/0.1)]">
            {/* Toggle Button - Mobile */}
            {isMobile && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isExpanded ? (
                    <X className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-primary" />
                  )}
                </motion.div>
              </motion.button>
            )}

            {/* Actions */}
            <div className={`flex items-center gap-2 ${isMobile && !isExpanded ? 'hidden' : ''}`}>
              {actions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {renderActionButton(action)}
                </motion.div>
              ))}
            </div>

            {/* Collapsed mobile icons */}
            {isMobile && !isExpanded && (
              <div className="flex items-center gap-1.5">
                {actions.map((action) => (
                  <motion.div
                    key={action.label}
                    whileTap={{ scale: 0.95 }}
                  >
                    {action.external ? (
                      <a
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-11 h-11 rounded-full flex items-center justify-center ${
                          action.variant === 'primary' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-[hsl(142_70%_45%)] text-white'
                        } shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.2)]`}
                      >
                        <action.icon className="w-5 h-5" />
                      </a>
                    ) : (
                      <Link
                        to={action.href}
                        className="w-11 h-11 rounded-full flex items-center justify-center bg-primary text-primary-foreground shadow-[inset_0_1px_1px_hsl(0_0%_100%/0.2)]"
                      >
                        <action.icon className="w-5 h-5" />
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickActionBar;
