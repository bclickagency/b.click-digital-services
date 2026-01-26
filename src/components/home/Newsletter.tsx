import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubscribed(true);
    setEmail('');
    
    toast({
      title: 'تم الاشتراك بنجاح! 🎉',
      description: 'شكراً لاشتراكك في نشرتنا البريدية',
    });

    // Reset after 5 seconds
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <section className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card relative overflow-hidden py-12 px-8 md:px-16"
      >
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <Mail className="w-8 h-8 text-primary" />
          </motion.div>

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
            <motion.button
              type="submit"
              disabled={isLoading || isSubscribed}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.button>
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
