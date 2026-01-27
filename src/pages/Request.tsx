import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { FloatingInput, FloatingTextarea } from '@/components/ui/FloatingInput';
import ProgressSteps from '@/components/ui/ProgressSteps';
import Confetti from '@/components/ui/Confetti';

const serviceTypes = [
  'تصميم موقع ويب',
  'تطوير تطبيق موبايل',
  'تصميم هوية بصرية',
  'تسويق رقمي',
  'تحسين محركات البحث',
  'متجر إلكتروني',
  'إدارة محتوى',
  'خدمة أخرى',
];

const urgencyLevels = [
  { value: 'urgent', label: 'عاجل', description: 'أحتاجها في أقرب وقت' },
  { value: 'week', label: 'خلال أسبوع', description: 'لدي بعض الوقت' },
  { value: 'flexible', label: 'بدون وقت محدد', description: 'مرن في التوقيت' },
];

const steps = [
  { label: 'البيانات الشخصية' },
  { label: 'تفاصيل الخدمة' },
  { label: 'التأكيد' },
];

const RequestPage = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    serviceType: '',
    urgency: '',
    details: '',
  });

  // Auto-save draft
  useEffect(() => {
    const saved = localStorage.getItem('request-draft');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load draft');
      }
    }
  }, []);

  useEffect(() => {
    if (formData.fullName || formData.whatsapp || formData.serviceType) {
      localStorage.setItem('request-draft', JSON.stringify(formData));
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'يرجى إدخال الاسم الكامل';
      }
      if (!formData.whatsapp.trim()) {
        newErrors.whatsapp = 'يرجى إدخال رقم الواتساب';
      } else if (!/^01[0-9]{9}$/.test(formData.whatsapp)) {
        newErrors.whatsapp = 'يرجى إدخال رقم صحيح (01xxxxxxxxx)';
      }
    }

    if (step === 1) {
      if (!formData.serviceType) {
        newErrors.serviceType = 'يرجى اختيار نوع الخدمة';
      }
      if (!formData.urgency) {
        newErrors.urgency = 'يرجى اختيار مستوى الاستعجال';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('service_requests').insert({
        full_name: formData.fullName,
        whatsapp: formData.whatsapp,
        service_type: formData.serviceType,
        urgency: formData.urgency,
        details: formData.details,
      } as any);

      if (error) throw error;

      // Clear draft
      localStorage.removeItem('request-draft');

      // Show confetti
      setShowConfetti(true);
      setIsSubmitted(true);

      toast({
        title: 'تم إرسال طلبك بنجاح! 🎉',
        description: 'سيتم التواصل معك خلال 24 ساعة',
      });

      // Reset after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

    } catch (error: any) {
      toast({
        title: 'حدث خطأ',
        description: error.message || 'يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <Confetti isActive={showConfetti} />
        <section className="min-h-[70vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground mb-4">تم إرسال طلبك بنجاح! 🎉</h1>
            <p className="text-muted-foreground mb-8">
              شكراً لك! سيقوم فريقنا بمراجعة طلبك والتواصل معك خلال 24 ساعة عبر الواتساب.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(0);
                setFormData({
                  fullName: '',
                  whatsapp: '',
                  serviceType: '',
                  urgency: '',
                  details: '',
                });
              }}
              className="btn-primary"
            >
              إرسال طلب جديد
            </button>
          </motion.div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Confetti isActive={showConfetti} />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-secondary/20 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6"
            >
              محتاج خدمة إيه؟
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hero-title mb-6"
            >
              أخبرنا عن <span className="text-gradient-secondary">احتياجاتك</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-subtitle"
            >
              املأ النموذج وسنتواصل معك خلال 24 ساعة
            </motion.p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-container pt-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <ProgressSteps steps={steps} currentStep={currentStep} />
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="glass-card"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Info */}
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <FloatingInput
                    label="الاسم الكامل *"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    success={formData.fullName.length > 2 && !errors.fullName}
                  />

                  <FloatingInput
                    label="رقم واتساب *"
                    name="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    error={errors.whatsapp}
                    success={/^01[0-9]{9}$/.test(formData.whatsapp)}
                    helperText="مثال: 01xxxxxxxxx"
                    dir="ltr"
                  />
                </motion.div>
              )}

              {/* Step 2: Service Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="form-label">
                      نوع الخدمة <span className="text-secondary">*</span>
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      className={`form-input ${errors.serviceType ? 'border-destructive' : ''}`}
                    >
                      <option value="">اختر الخدمة المطلوبة</option>
                      {serviceTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.serviceType && (
                      <p className="text-xs text-destructive mt-1">{errors.serviceType}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">
                      مستوى الاستعجال <span className="text-secondary">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {urgencyLevels.map((level) => (
                        <label
                          key={level.value}
                          className={`glass p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                            formData.urgency === level.value
                              ? 'border-2 border-primary bg-primary/10'
                              : 'border-2 border-transparent hover:border-muted-foreground'
                          }`}
                        >
                          <input
                            type="radio"
                            name="urgency"
                            value={level.value}
                            checked={formData.urgency === level.value}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <div className="flex items-center gap-2 mb-1">
                            {formData.urgency === level.value && (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            )}
                            <span className="font-semibold text-foreground">{level.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{level.description}</p>
                        </label>
                      ))}
                    </div>
                    {errors.urgency && (
                      <p className="text-xs text-destructive mt-1">{errors.urgency}</p>
                    )}
                  </div>

                  <FloatingTextarea
                    label="تفاصيل إضافية"
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    helperText="اكتب أي تفاصيل إضافية تريد مشاركتها معنا"
                  />
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-muted/50 rounded-xl p-6">
                    <h3 className="font-bold text-lg text-foreground mb-4">مراجعة البيانات</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الاسم:</span>
                        <span className="font-medium text-foreground">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الواتساب:</span>
                        <span className="font-medium text-foreground" dir="ltr">{formData.whatsapp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الخدمة:</span>
                        <span className="font-medium text-foreground">{formData.serviceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الاستعجال:</span>
                        <span className="font-medium text-foreground">
                          {urgencyLevels.find(l => l.value === formData.urgency)?.label}
                        </span>
                      </div>
                      {formData.details && (
                        <div>
                          <span className="text-muted-foreground">التفاصيل:</span>
                          <p className="text-foreground mt-1">{formData.details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-ghost"
                >
                  السابق
                </button>
              ) : (
                <div />
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                >
                  التالي
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-secondary min-w-[150px] haptic-feedback"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الإرسال...
                    </span>
                  ) : (
                    'تسليم الطلب'
                  )}
                </button>
              )}
            </div>
          </motion.form>

          {/* Auto-save indicator */}
          {(formData.fullName || formData.whatsapp || formData.serviceType) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground text-center mt-4"
            >
              ✓ يتم حفظ بياناتك تلقائياً
            </motion.p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default RequestPage;
