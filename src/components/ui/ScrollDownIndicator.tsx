import { motion } from 'framer-motion';
import { ChevronDown, Mouse } from 'lucide-react';

interface ScrollDownIndicatorProps {
  targetId?: string;
  className?: string;
}

const ScrollDownIndicator = ({ targetId, className = '' }: ScrollDownIndicatorProps) => {
  const handleClick = () => {
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className={`flex flex-col items-center gap-2 cursor-pointer group ${className}`}
    >
      <motion.div
        className="w-8 h-12 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2 group-hover:border-primary/50 transition-colors"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1.5 h-3 bg-primary rounded-full"
        />
      </motion.div>
      <motion.div
        animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center"
      >
        <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </motion.div>
      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
        اكتشف المزيد
      </span>
    </motion.button>
  );
};

export default ScrollDownIndicator;
