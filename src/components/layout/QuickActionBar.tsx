import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Briefcase, X, ChevronUp } from 'lucide-react';

const actions = [
  {
    icon: Phone,
    label: 'اتصل بنا',
    href: 'tel:+201558663972',
    color: 'from-green-500 to-green-600',
    external: true,
  },
  {
    icon: MessageCircle,
    label: 'واتساب',
    href: 'https://wa.me/201558663972',
    color: 'from-green-400 to-green-500',
    external: true,
  },
  {
    icon: Briefcase,
    label: 'اطلب خدمة',
    href: '/request',
    color: 'from-primary to-purple-600',
    external: false,
  },
];

const QuickActionBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show after scrolling 300px
      if (currentScrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-auto md:bottom-6 md:left-1/2 md:-translate-x-1/2"
        >
          <div className="glass rounded-2xl p-2 flex items-center gap-2 max-w-md mx-auto shadow-lg">
            {/* Toggle Button - Mobile */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
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

            {/* Actions */}
            <AnimatePresence>
              {(isExpanded || window.innerWidth >= 768) && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex items-center gap-2 overflow-hidden"
                >
                  {actions.map((action, index) => (
                    <motion.div
                      key={action.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {action.external ? (
                        <a
                          href={action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium text-sm whitespace-nowrap transition-shadow hover:shadow-lg`}
                        >
                          <action.icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{action.label}</span>
                        </a>
                      ) : (
                        <Link
                          to={action.href}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium text-sm whitespace-nowrap transition-shadow hover:shadow-lg`}
                        >
                          <action.icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{action.label}</span>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Always visible on desktop */}
            <div className="hidden md:flex items-center gap-2">
              {actions.map((action, index) => (
                <motion.div
                  key={action.label}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {action.external ? (
                    <a
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium text-sm whitespace-nowrap transition-shadow hover:shadow-lg`}
                    >
                      <action.icon className="w-4 h-4" />
                      <span>{action.label}</span>
                    </a>
                  ) : (
                    <Link
                      to={action.href}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium text-sm whitespace-nowrap transition-shadow hover:shadow-lg`}
                    >
                      <action.icon className="w-4 h-4" />
                      <span>{action.label}</span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickActionBar;
