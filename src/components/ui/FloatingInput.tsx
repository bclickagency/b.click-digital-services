import { useState, forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  helperText?: string;
}

interface FloatingTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  success?: boolean;
  helperText?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, success, helperText, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';

    return (
      <div className="relative">
        <input
          ref={ref}
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            'peer w-full px-4 pt-6 pb-2 rounded-xl bg-muted/50 border-2 outline-none transition-all duration-300',
            error
              ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20'
              : success
              ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
              : 'border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20',
            className
          )}
        />
        
        {/* Floating Label */}
        <motion.label
          initial={false}
          animate={{
            y: isFocused || hasValue ? -12 : 0,
            scale: isFocused || hasValue ? 0.85 : 1,
            color: error
              ? 'hsl(var(--destructive))'
              : isFocused
              ? 'hsl(var(--primary))'
              : 'hsl(var(--muted-foreground))',
          }}
          transition={{ duration: 0.2 }}
          className="absolute right-4 top-4 origin-right pointer-events-none font-medium"
        >
          {label}
        </motion.label>

        {/* Status Icon */}
        <AnimatePresence>
          {(success || error) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute left-4 top-1/2 -translate-y-1/2"
            >
              {success ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : error ? (
                <AlertCircle className="w-5 h-5 text-destructive" />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper/Error Text */}
        <AnimatePresence>
          {(error || helperText) && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={cn(
                'mt-1.5 text-xs',
                error ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              {error || helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ label, error, success, helperText, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';

    return (
      <div className="relative">
        <textarea
          ref={ref}
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            'peer w-full px-4 pt-6 pb-2 rounded-xl bg-muted/50 border-2 outline-none transition-all duration-300 resize-none min-h-[120px]',
            error
              ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20'
              : success
              ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
              : 'border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20',
            className
          )}
        />
        
        {/* Floating Label */}
        <motion.label
          initial={false}
          animate={{
            y: isFocused || hasValue ? -12 : 0,
            scale: isFocused || hasValue ? 0.85 : 1,
            color: error
              ? 'hsl(var(--destructive))'
              : isFocused
              ? 'hsl(var(--primary))'
              : 'hsl(var(--muted-foreground))',
          }}
          transition={{ duration: 0.2 }}
          className="absolute right-4 top-4 origin-right pointer-events-none font-medium"
        >
          {label}
        </motion.label>

        {/* Helper/Error Text */}
        <AnimatePresence>
          {(error || helperText) && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={cn(
                'mt-1.5 text-xs',
                error ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              {error || helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FloatingTextarea.displayName = 'FloatingTextarea';
