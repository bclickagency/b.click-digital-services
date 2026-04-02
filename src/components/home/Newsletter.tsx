import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const interestOptions = [
  { id: 'portfolio', label: 'أعمالنا (Portfolio)' },
  { id: 'blog', label: 'المدونة (Blog)' },
  { id: 'careers', label: 'الوظائف (Careers)' },
];

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleInterest = (id: string) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({ title: 'خطأ', description: 'يرجى إدخال بريد إلكتروني صحيح', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: email.trim(),
        source: 'website',
        interests: interests.length > 0 ? interests : ['all'],
      });

      if (error) {
        if (error.code === '23505') {
          toast({ title: 'أنت مشترك بالفعل!', description: 'هذا البريد مسجل لدينا بالفعل' });
        } else {
          throw error;
        }
      } else {
        toast({ title: 'تم الاشتراك بنجاح! 🎉', description: 'شكراً لاشتراكك في نشرتنا البريدية' });
      }

      setIsSubscribed(true);
      setEmail('');
      setInterests([]);
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch {
      toast({ title: 'حدث خطأ', description: 'يرجى المحاولة مرة أخرى', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card relative overflow-hidden py-12 px-8 md:px-16"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            اشترك في نشرتنا البريدية
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            احصل على أحدث المقالات والنصائح والعروض الحصرية مباشرة في بريدك الإلكتروني
          </p>

          {/* Interest Checkboxes */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {interestOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all duration-200 text-sm ${
                  interests.includes(option.id)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-primary/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={interests.includes(option.id)}
                  onChange={() => toggleInterest(option.id)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                  interests.includes(option.id) ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                }`}>
                  {interests.includes(option.id) && (
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
                {option.label}
              </label>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className="form-input pr-12 w-full"
                disabled={isLoading || isSubscribed}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || isSubscribed}
              className={`btn-primary whitespace-nowrap min-w-[140px] ${
                isSubscribed ? 'bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_45%)]' : ''
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isSubscribed ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  تم الاشتراك
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  اشترك الآن
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            نحترم خصوصيتك ولن نشارك بريدك مع أي طرف ثالث
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
