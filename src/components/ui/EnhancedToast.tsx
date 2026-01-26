import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedToastProps {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    iconColor: 'text-green-500',
    titleColor: 'text-green-600 dark:text-green-400',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-500',
    titleColor: 'text-red-600 dark:text-red-400',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-500',
    titleColor: 'text-yellow-600 dark:text-yellow-400',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-600 dark:text-blue-400',
  },
};

const EnhancedToast = ({ title, description, type = 'success', onClose }: EnhancedToastProps) => {
  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={cn(
        'flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-xl',
        config.bgColor,
        config.borderColor
      )}
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className={cn('shrink-0', config.iconColor)}
      >
        <Icon className="w-6 h-6" />
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className={cn('font-bold text-sm', config.titleColor)}
        >
          {title}
        </motion.p>
        {description && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm mt-1"
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Close Button */}
      {onClose && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="shrink-0 p-1 rounded-lg hover:bg-foreground/10 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      )}

      {/* Progress Bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: 'linear' }}
        className={cn(
          'absolute bottom-0 left-0 right-0 h-1 origin-left rounded-b-2xl',
          type === 'success' && 'bg-green-500',
          type === 'error' && 'bg-red-500',
          type === 'warning' && 'bg-yellow-500',
          type === 'info' && 'bg-blue-500'
        )}
      />
    </motion.div>
  );
};

export default EnhancedToast;
