import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const Newsletter = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const interestOptions = [
    { id: 'portfolio', label: t.newsletter.portfolio },
    { id: 'blog', label: t.newsletter.blog },
    { id: 'careers', label: t.newsletter.careers },
  ];

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
        } else { throw error; }
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
        className="glass-card relative overflow-hidden py-10 px-6 md:px-12"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
            {t.newsletter.title}
          </h2>
          <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
            {t.newsletter.subtitle}
          </p>

          {/* Interest Checkboxes */}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {interestOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border cursor-pointer transition-all duration-200 text-xs ${
                  interests.includes(option.id)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-primary/50'
                }`}
              >
                <input type="checkbox" checked={interests.includes(option.id)} onChange={() => toggleInterest(option.id)} className="sr-only" />
                <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all ${
                  interests.includes(option.id) ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                }`}>
                  {interests.includes(option.id) && <CheckCircle className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                {option.label}
              </label>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletter.placeholder}
                className="form-input pr-10 w-full"
                disabled={isLoading || isSubscribed}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || isSubscribed}
              className={`btn-primary whitespace-nowrap min-w-[120px] ${
                isSubscribed ? 'bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_45%)]' : ''
              }`}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSubscribed ? (
                <><CheckCircle className="w-4 h-4" />{t.newsletter.subscribed}</>
              ) : (
                <><Send className="w-4 h-4" />{t.newsletter.subscribe}</>
              )}
            </button>
          </form>

          <p className="text-[10px] text-muted-foreground mt-3">
            {t.newsletter.privacy}
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
