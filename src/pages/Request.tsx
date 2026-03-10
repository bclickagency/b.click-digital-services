import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSafeErrorMessage } from '@/lib/errorHandler';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { FloatingInput, FloatingTextarea } from '@/components/ui/FloatingInput';
import Confetti from '@/components/ui/Confetti';
import SEO from '@/components/SEO';
import PageHero from '@/components/layout/PageHero';
import { useLeadTracking } from '@/hooks/useLeadTracking';

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

const RequestPage = () => {
  const { toast } = useToast();
  const leadTracking = useLeadTracking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    email: '',
    serviceType: '',
    urgency: '',
    details: '',
  });

  // Auto-save draft
  useEffect(() => {
    const saved = sessionStorage.getItem('request-draft');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch {
        // Silently ignore
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const cleanWhatsApp = (num: string): string => {
    // Remove all non-digits
    const digits = num.replace(/\D/g, '');
    // If starts with country code 20, strip it
    if (digits.startsWith('20') && digits.length > 10) {
      return digits.slice(2);
    }
    // If starts with 0, keep as is (local format)
    return digits.startsWith('0') ? digits : digits;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'يرجى إدخال الاسم الكامل';
    }
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'يرجى إدخال رقم الواتساب';
    } else {
      const cleaned = cleanWhatsApp(formData.whatsapp);
      if (!/^01[0-9]{9}$/.test(cleaned)) {
        newErrors.whatsapp = 'يرجى إدخال رقم صحيح (01xxxxxxxxx)';
      }
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }
    if (!formData.serviceType) {
      newErrors.serviceType = 'يرجى اختيار نوع الخدمة';
    }
    if (!formData.urgency) {
      newErrors.urgency = 'يرجى اختيار مستوى الاستعجال';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (honeypot) return;
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const cleanedWhatsapp = cleanWhatsApp(formData.whatsapp);

      const { error } = await supabase.from('service_requests').insert({
        full_name: formData.fullName,
        whatsapp: cleanedWhatsapp,
        email: formData.email || null,
        service_type: formData.serviceType,
        urgency: formData.urgency,
        details: formData.details || null,
        lead_source: leadTracking.lead_source,
        utm_source: leadTracking.utm_source,
        utm_medium: leadTracking.utm_medium,
        utm_campaign: leadTracking.utm_campaign,
        referrer: leadTracking.referrer,
      });

      if (error) throw error;

      localStorage.removeItem('request-draft');
      setShowConfetti(true);
      setIsSubmitted(true);

      toast({
        title: 'تم إرسال طلبك بنجاح! 🎉',
        description: 'سيتم التواصل معك خلال 24 ساعة',
      });

      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error: unknown) {
      toast({
        title: 'حدث خطأ',
        description: getSafeErrorMessage(error),
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
                setFormData({ fullName: '', whatsapp: '', email: '', serviceType: '', urgency: '', details: '' });
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
      <SEO 
        title="اطلب خدمة"
        description="أخبرنا عن احتياجاتك وسنتواصل معك خلال 24 ساعة. املأ النموذج واحصل على استشارة مجانية لمشروعك الرقمي."
        keywords="طلب خدمة, استشارة مجانية, مشروع رقمي, B.CLICK"
      />
      <Confetti isActive={showConfetti} />

      <PageHero
        badge="محتاج خدمة إيه؟"
        title="أخبرنا عن"
        highlight="احتياجاتك"
        subtitle="املأ النموذج وسنتواصل معك خلال 24 ساعة"
        badgeColor="secondary"
        minHeight="min-h-[35vh]"
      />

      {/* Single-page form - no steps */}
      <section className="section-container pt-8">
        <div className="max-w-2xl mx-auto">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass-card space-y-6"
          >
            {/* Honeypot */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="absolute opacity-0 h-0 w-0 pointer-events-none"
              aria-hidden="true"
            />

            <FloatingInput
              label="الاسم الكامل *"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              success={formData.fullName.length > 2 && !errors.fullName}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingInput
                label="رقم واتساب *"
                name="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={handleChange}
                error={errors.whatsapp}
                success={/^01[0-9]{9}$/.test(cleanWhatsApp(formData.whatsapp))}
                helperText="مثال: 01xxxxxxxxx"
                dir="ltr"
              />

              <FloatingInput
                label="البريد الإلكتروني (اختياري)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                dir="ltr"
              />
            </div>

            <div>
              <label className="form-label">
                نوع الخدمة <span className="text-destructive">*</span>
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
                مستوى الاستعجال <span className="text-destructive">*</span>
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-secondary w-full min-w-[150px] haptic-feedback py-4"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الإرسال...
                </span>
              ) : (
                'إرسال الطلب'
              )}
            </button>
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
