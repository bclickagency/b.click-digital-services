import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const ProgressSteps = ({ steps, currentStep, className = '' }: ProgressStepsProps) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute top-5 right-5 left-5 h-0.5 bg-muted -z-10" />
        
        {/* Progress Line Active */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
          className="absolute top-5 right-5 h-0.5 bg-primary -z-10"
          style={{ maxWidth: 'calc(100% - 40px)' }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div key={step.label} className="flex flex-col items-center">
              {/* Circle */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted || isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                }}
                transition={{ duration: 0.2 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm relative ${
                  isCompleted || isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  index + 1
                )}
                
                {/* Active Ring */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 rounded-full border-2 border-primary animate-pulse-glow"
                  />
                )}
              </motion.div>

              {/* Label */}
              <motion.span
                animate={{
                  color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                  fontWeight: isActive ? 600 : 400,
                }}
                className="mt-2 text-xs text-center max-w-[80px]"
              >
                {step.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
