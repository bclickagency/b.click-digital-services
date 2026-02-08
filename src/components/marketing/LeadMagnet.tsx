import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  X, 
  Mail, 
  BookOpen, 
  CheckCircle2,
  Sparkles,
  FileText
} from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';

const emailSchema = z.object({
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface LeadMagnetProps {
  trigger?: 'scroll' | 'time' | 'click';
  scrollPercentage?: number;
  timeDelay?: number;
}

const LeadMagnet = ({ 
  trigger = 'scroll', 
  scrollPercentage = 50,
  timeDelay = 30000 
}: LeadMagnetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  // Check if already shown this session
  const alreadyShown = sessionStorage.getItem('lead-magnet-shown');

  // Trigger based on scroll
  useState(() => {
    if (trigger === 'scroll' && !alreadyShown && !hasTriggered) {
      const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = (window.scrollY / scrollHeight) * 100;
        
        if (currentScroll >= scrollPercentage) {
          setIsOpen(true);
          setHasTriggered(true);
          sessionStorage.setItem('lead-magnet-shown', 'true');
          window.removeEventListener('scroll', handleScroll);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  });

  // Trigger based on time
  useState(() => {
    if (trigger === 'time' && !alreadyShown && !hasTriggered) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasTriggered(true);
        sessionStorage.setItem('lead-magnet-shown', 'true');
      }, timeDelay);

      return () => clearTimeout(timer);
    }
  });

  const onSubmit = async (data: EmailFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Here you would typically send the data to your backend
    console.log('Lead captured:', data);
    
    setIsSubmitted(true);
    toast({
      title: 'تم بنجاح! 🎉',
      description: 'سيتم إرسال الدليل إلى بريدك الإلكتروني خلال دقائق',
    });
  };

  const benefits = [
    'أسرار التسويق الرقمي للشركات الناشئة',
    'استراتيجيات مجربة لزيادة المبيعات',
    'أدوات مجانية لتحليل المنافسين',
    'نصائح من خبراء التسويق',
  ];

  if (alreadyShown && !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[101] mx-auto max-w-lg"
          >
            <div className="glass-card relative overflow-hidden">
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/20 rounded-full blur-[40px]" />

              <div className="relative z-10">
                {!isSubmitted ? (
                  <>
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        دليل التسويق الرقمي المجاني
                      </h3>
                      <p className="text-muted-foreground">
                        احصل على دليلنا الشامل لتسويق مشروعك رقميًا
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3 mb-6">
                      {benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          placeholder="اسمك الكريم"
                          {...register('name')}
                          className="form-input"
                        />
                        {errors.name && (
                          <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="email"
                          placeholder="بريدك الإلكتروني"
                          {...register('email')}
                          className="form-input"
                          dir="ltr"
                        />
                        {errors.email && (
                          <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-secondary w-full"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            جاري الإرسال...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            حمّل الدليل مجانًا
                          </span>
                        )}
                      </button>
                    </form>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      لن نشارك بريدك مع أي طرف ثالث
                    </p>
                  </>
                ) : (
                  /* Success State */
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
                    >
                      <Sparkles className="w-10 h-10 text-primary" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      شكرًا لك! 🎉
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      تحقق من بريدك الإلكتروني خلال دقائق
                    </p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="btn-primary"
                    >
                      حسنًا، فهمت!
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LeadMagnet;
