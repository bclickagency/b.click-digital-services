import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال بريد إلكتروني صحيح',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: email.trim(),
        source: 'website',
      });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'أنت مشترك بالفعل!',
            description: 'هذا البريد مسجل لدينا بالفعل',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'تم الاشتراك بنجاح! 🎉',
          description: 'شكراً لاشتراكك في نشرتنا البريدية',
        });
      }

      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch {
      toast({
        title: 'حدث خطأ',
        description: 'يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
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
          <p className="text-muted-foreground mb-8 leading-relaxed">
            احصل على أحدث المقالات والنصائح والعروض الحصرية مباشرة في بريدك الإلكتروني
          </p>

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
                isSubscribed ? 'bg-green-600 hover:bg-green-600' : ''
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
