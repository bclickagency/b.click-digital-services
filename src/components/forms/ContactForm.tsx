import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useLeadTracking } from '@/hooks/useLeadTracking';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(3, 'الموضوع يجب أن يكون 3 أحرف على الأقل').max(200),
  message: z.string().trim().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل').max(1000),
  honeypot: z.string().max(0).optional(), // spam protection
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const leadTracking = useLeadTracking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honeypot: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (formData.honeypot) return;

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        lead_source: leadTracking.lead_source,
        utm_source: leadTracking.utm_source,
        utm_medium: leadTracking.utm_medium,
        utm_campaign: leadTracking.utm_campaign,
        referrer: leadTracking.referrer,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: 'تم إرسال رسالتك بنجاح!',
        description: 'سنتواصل معك في أقرب وقت ممكن',
      });
    } catch (error: any) {
      toast({
        title: 'حدث خطأ',
        description: 'يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">شكرًا لتواصلك معنا!</h3>
        <p className="text-muted-foreground mb-6">سنرد عليك خلال 24 ساعة كحد أقصى</p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '', honeypot: '' });
          }}
          className="btn-ghost"
        >
          إرسال رسالة أخرى
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot - hidden from users */}
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 h-0 w-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            الاسم الكامل <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl bg-muted/50 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.name ? 'border-destructive' : 'border-border/50'
            }`}
            placeholder="أدخل اسمك الكامل"
          />
          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            البريد الإلكتروني <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl bg-muted/50 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.email ? 'border-destructive' : 'border-border/50'
            }`}
            placeholder="example@email.com"
            dir="ltr"
          />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
            رقم الهاتف (اختياري)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="01XXXXXXXXX"
            dir="ltr"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
            الموضوع <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl bg-muted/50 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.subject ? 'border-destructive' : 'border-border/50'
            }`}
            placeholder="موضوع رسالتك"
          />
          {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          الرسالة <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`w-full px-4 py-3 rounded-xl bg-muted/50 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
            errors.message ? 'border-destructive' : 'border-border/50'
          }`}
          placeholder="اكتب رسالتك هنا..."
        />
        {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-secondary py-4 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            جاري الإرسال...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            إرسال الرسالة
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        سنرد عليك خلال 24 ساعة كحد أقصى
      </p>
    </form>
  );
};

export default ContactForm;
