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
  const base = "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300";
  
  switch (variant) {
    case 'success':
      return `${base} bg-[hsl(142_70%_45%)] text-white hover:bg-[hsl(142_70%_40%)]`;
    case 'whatsapp':
      return `${base} bg-[hsl(142_70%_40%)] text-white hover:bg-[hsl(142_70%_35%)]`;
    case 'primary':
      return `${base} bg-primary text-primary-foreground hover:bg-primary/90`;
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
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-1/2 md:right-auto md:bottom-6 md:-translate-x-1/2"
        >
          <div className="bg-background/80 backdrop-blur-2xl rounded-2xl p-2 flex items-center gap-2 max-w-fit mx-auto border border-border/30 shadow-[0_8px_40px_hsl(0_0%_0%/0.12)]">
            {/* Actions - Always visible on Desktop, expandable on Mobile */}
            {(!isMobile || isExpanded) && (
              <div className="flex items-center gap-2">
                {actions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {renderActionButton(action)}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Collapsed mobile icons */}
            {isMobile && !isExpanded && (
              <div className="flex items-center gap-2">
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
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          action.variant === 'primary' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-[hsl(142_70%_45%)] text-white'
                        }`}
                      >
                        <action.icon className="w-5 h-5" />
                      </a>
                    ) : (
                      <Link
                        to={action.href}
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-primary-foreground transition-all duration-300"
                      >
                        <action.icon className="w-5 h-5" />
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Toggle Button - Mobile */}
            {isMobile && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border/30"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isExpanded ? (
                    <X className="w-4 h-4 text-foreground" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-foreground" />
                  )}
                </motion.div>
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickActionBar;
