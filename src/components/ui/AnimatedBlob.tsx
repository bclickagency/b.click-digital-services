import { motion } from 'framer-motion';

interface AnimatedBlobProps {
  className?: string;
  color?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  delay?: number;
}

const sizeClasses = {
  sm: 'w-40 h-40',
  md: 'w-64 h-64',
  lg: 'w-80 h-80',
  xl: 'w-96 h-96',
};

const AnimatedBlob = ({ 
  className = '', 
  color = 'primary',
  size = 'lg',
  delay = 0 
}: AnimatedBlobProps) => {
  return (
    <motion.div
      className={`absolute rounded-full blur-[100px] ${sizeClasses[size]} ${
        color === 'primary' ? 'bg-primary/20' : 'bg-secondary/20'
      } ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 30, -30, 0],
        y: [0, -30, 30, 0],
        rotate: [0, 90, 180, 270, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: 'reverse',
        delay,
        ease: 'easeInOut',
      }}
    />
  );
};

export default AnimatedBlob;
