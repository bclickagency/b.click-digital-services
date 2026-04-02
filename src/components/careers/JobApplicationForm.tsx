import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';

const specializations = [
  'Graphic Design', 'Video Editing', 'Motion Graphics',
  'Book & Educational Materials Layout', 'Content Strategy', 'Media Buying',
  'Social Media Moderation', 'Website Development', 'App Development',
  'UI/UX Design', 'Content Writing / Copywriting', 'Social Media Analytics',
  'PowerPoint Design', 'Voice Over', 'Digital Marketing & Advertising',
  'Social Media Management',
];

const schema = z.object({
  full_name: z.string().min(2, 'الاسم مطلوب').max(100),
  email: z.string().email('بريد إلكتروني غير صحيح'),
  phone: z.string().min(8, 'رقم الهاتف مطلوب').max(20),
  location: z.string().max(100).optional(),
  specialization: z.string().min(1, 'التخصص مطلوب'),
  expertise: z.string().max(200).optional(),
  experience_years: z.string().max(20).optional(),
  portfolio_link: z.string().url('رابط غير صحيح').or(z.literal('')).optional(),
  previous_experience: z.string().max(500).optional(),
  freelance_experience: z.string().optional(),
  expected_salary: z.string().max(50).optional(),
  skill_level: z.string().optional(),
  availability: z.string().optional(),
  pricing_details: z.string().max(1000).optional(),
});

interface Props {
  jobId?: string;
  jobTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

const JobApplicationForm = ({ jobId, jobTitle, isOpen, onClose }: Props) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', location: '', specialization: '',
    expertise: '', experience_years: '', portfolio_link: '', previous_experience: '',
    freelance_experience: '', expected_salary: '', skill_level: '', availability: '',
    pricing_details: '',
  });

  const set = (key: string, value: string) => {
    setForm(p => ({ ...p, [key]: value }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => { if (err.path[0]) fieldErrors[String(err.path[0])] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('job_applications').insert({
        ...form,
        job_id: jobId || null,
        portfolio_link: form.portfolio_link || null,
        location: form.location || null,
        expertise: form.expertise || null,
        experience_years: form.experience_years || null,
        previous_experience: form.previous_experience || null,
        freelance_experience: form.freelance_experience || null,
        expected_salary: form.expected_salary || null,
        skill_level: form.skill_level || null,
        availability: form.availability || null,
        pricing_details: form.pricing_details || null,
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: 'تم إرسال طلبك بنجاح! 🎉', description: 'سنراجع طلبك ونتواصل معك قريباً' });
    } catch {
      toast({ title: 'حدث خطأ', description: 'يرجى المحاولة مرة أخرى', variant: 'destructive' });
    } finally { setSubmitting(false); }
  };

  const inputClass = (key: string) => `w-full px-3 py-2.5 rounded-xl bg-muted/50 border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors[key] ? 'border-destructive' : 'border-border/50'}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">تقدم للوظيفة</h2>
                {jobTitle && <p className="text-sm text-muted-foreground">{jobTitle}</p>}
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted/50"><X className="w-5 h-5" /></button>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">شكراً لتقديمك!</h3>
                <p className="text-muted-foreground mb-4">سنراجع طلبك ونتواصل معك قريباً</p>
                <button onClick={onClose} className="btn-primary">إغلاق</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">الاسم الكامل *</label>
                    <input value={form.full_name} onChange={e => set('full_name', e.target.value)} className={inputClass('full_name')} placeholder="أدخل اسمك الكامل" />
                    {errors.full_name && <p className="text-destructive text-[10px] mt-0.5">{errors.full_name}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">البريد الإلكتروني *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputClass('email')} dir="ltr" />
                    {errors.email && <p className="text-destructive text-[10px] mt-0.5">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">رقم الهاتف *</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputClass('phone')} dir="ltr" />
                    {errors.phone && <p className="text-destructive text-[10px] mt-0.5">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">الموقع</label>
                    <input value={form.location} onChange={e => set('location', e.target.value)} className={inputClass('location')} placeholder="المدينة - البلد" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">التخصص *</label>
                  <select value={form.specialization} onChange={e => set('specialization', e.target.value)} className={inputClass('specialization')}>
                    <option value="">اختر التخصص</option>
                    {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.specialization && <p className="text-destructive text-[10px] mt-0.5">{errors.specialization}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">مجال الخبرة</label>
                    <input value={form.expertise} onChange={e => set('expertise', e.target.value)} className={inputClass('expertise')} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">سنوات الخبرة</label>
                    <input value={form.experience_years} onChange={e => set('experience_years', e.target.value)} className={inputClass('experience_years')} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">رابط البورتفوليو</label>
                    <input value={form.portfolio_link} onChange={e => set('portfolio_link', e.target.value)} className={inputClass('portfolio_link')} dir="ltr" placeholder="https://" />
                    {errors.portfolio_link && <p className="text-destructive text-[10px] mt-0.5">{errors.portfolio_link}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">الراتب المتوقع</label>
                    <input value={form.expected_salary} onChange={e => set('expected_salary', e.target.value)} className={inputClass('expected_salary')} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">الخبرة السابقة</label>
                  <input value={form.previous_experience} onChange={e => set('previous_experience', e.target.value)} className={inputClass('previous_experience')} />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">خبرة Freelance</label>
                    <select value={form.freelance_experience} onChange={e => set('freelance_experience', e.target.value)} className={inputClass('freelance_experience')}>
                      <option value="">اختر</option>
                      <option value="نعم">نعم</option>
                      <option value="لا">لا</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">مستوى المهارة</label>
                    <select value={form.skill_level} onChange={e => set('skill_level', e.target.value)} className={inputClass('skill_level')}>
                      <option value="">اختر</option>
                      <option value="مبتدئ">مبتدئ</option>
                      <option value="متوسط">متوسط</option>
                      <option value="متقدم">متقدم</option>
                      <option value="خبير">خبير</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">التوفر</label>
                    <select value={form.availability} onChange={e => set('availability', e.target.value)} className={inputClass('availability')}>
                      <option value="">اختر</option>
                      <option value="فوري">فوري</option>
                      <option value="خلال أسبوع">خلال أسبوع</option>
                      <option value="خلال شهر">خلال شهر</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">تفاصيل التسعير</label>
                  <textarea value={form.pricing_details} onChange={e => set('pricing_details', e.target.value)} className={inputClass('pricing_details')} rows={3} placeholder="اذكر تفاصيل أسعار خدماتك..." />
                </div>

                <button type="submit" disabled={submitting} className="w-full btn-primary py-3">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الإرسال...</> : <><Send className="w-4 h-4" /> إرسال الطلب</>}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobApplicationForm;
