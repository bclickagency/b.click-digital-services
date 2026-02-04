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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className={`flex flex-col items-center gap-1 cursor-pointer group ${className}`}
    >
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center"
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
        <ChevronDown className="w-6 h-6 -mt-3 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
      </motion.div>
    </motion.button>
  );
};

export default ScrollDownIndicator;
