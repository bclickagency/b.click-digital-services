import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Eye, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FeaturedProject = () => {
  const { t } = useLanguage();

  return (
    <section className="section-container">
      <div className="text-center mb-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-medium mb-3"
        >
          <Star className="w-3 h-3 inline-block ml-1" />
          {t.featured.badge}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          {t.featured.title} <span className="text-gradient">{t.featured.titleHighlight}</span> {t.featured.titleSuffix}
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-card p-0 overflow-hidden"
      >
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image Side */}
          <div className="relative aspect-video lg:aspect-auto overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
              alt="Case Study"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent lg:bg-gradient-to-l" />
            
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3 lg:hidden">
              <div className="glass-card py-2 px-4">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold">+150%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="p-6 lg:p-8 flex flex-col justify-center">
            <span className="text-primary text-xs font-medium mb-2">متجر إلكتروني للأزياء</span>
            <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3">
              زيادة المبيعات بنسبة 150% خلال 3 أشهر
            </h3>
            
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-foreground mb-1">التحدي:</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                متجر إلكتروني يعاني من ضعف المبيعات وتجربة مستخدم سيئة مع معدل ارتداد مرتفع يصل إلى 70%
              </p>
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-semibold text-foreground mb-1">الحل:</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                أعدنا تصميم المتجر بالكامل مع تحسين تجربة المستخدم وإطلاق حملات تسويقية مستهدفة
              </p>
            </div>

            {/* Results */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold text-foreground">+150%</div>
                <div className="text-[10px] text-muted-foreground">زيادة المبيعات</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold text-foreground">+80%</div>
                <div className="text-[10px] text-muted-foreground">عملاء جدد</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <Eye className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold text-foreground">-45%</div>
                <div className="text-[10px] text-muted-foreground">معدل الارتداد</div>
              </div>
            </div>

            <blockquote className="border-r-4 border-primary pr-4 mb-6">
              <p className="text-muted-foreground text-xs italic mb-1">
                "فريق B.CLICK غيّر مسار متجرنا بالكامل. النتائج فاقت كل توقعاتنا!"
              </p>
              <cite className="text-foreground text-xs font-medium not-italic">
                - أحمد محمود، مؤسس Fashion Store
              </cite>
            </blockquote>

            <div className="flex flex-wrap gap-3">
              <Link to="/portfolio" className="btn-primary text-xs">
                {t.featured.viewMore}
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link to="/request" className="btn-ghost text-xs">
                {t.featured.wantSimilar}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturedProject;
