import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    serviceType: '',
    urgency: '',
    details: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.whatsapp || !formData.serviceType || !formData.urgency) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to database
      const { error } = await supabase.from('service_requests').insert({
        full_name: formData.fullName,
        whatsapp: formData.whatsapp,
        service_type: formData.serviceType,
        urgency: formData.urgency,
        details: formData.details,
      } as any);

      if (error) throw error;

      toast({
        title: 'تم إرسال طلبك بنجاح!',
        description: 'سيتم التواصل معك قريبًا',
      });

      // Reset form
      setFormData({
        fullName: '',
        whatsapp: '',
        serviceType: '',
        urgency: '',
        details: '',
      });
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

  return (
    <Layout>
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
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="glass-card space-y-6"
          >
            {/* Full Name */}
            <div>
              <label className="form-label">
                الاسم الكامل <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="أدخل اسمك الكامل"
                className="form-input"
                required
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="form-label">
                رقم واتساب <span className="text-secondary">*</span>
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="01xxxxxxxxx"
                className="form-input"
                dir="ltr"
                required
              />
            </div>

            {/* Service Type */}
            <div>
              <label className="form-label">
                نوع الخدمة <span className="text-secondary">*</span>
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">اختر الخدمة المطلوبة</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Urgency */}
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
                        ? 'border-primary bg-primary/10'
                        : 'hover:border-muted-foreground'
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
            </div>

            {/* Details */}
            <div>
              <label className="form-label">تفاصيل إضافية</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="اكتب أي تفاصيل إضافية تريد مشاركتها معنا..."
                rows={4}
                className="form-input resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-secondary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'جاري الإرسال...'
              ) : (
            'تسليم الطلب'
              )}
            </button>
          </motion.form>
        </div>
      </section>
    </Layout>
  );
};

export default RequestPage;
