import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Eye, Star } from 'lucide-react';

const FeaturedProject = () => {
  return (
    <section className="section-container">
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-xl bg-secondary/10 text-secondary text-sm font-medium mb-4"
        >
          <Star className="w-4 h-4 inline-block ml-1" />
          مشروع مميز
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          كيف <span className="text-gradient">ضاعفنا</span> مبيعات عملائنا
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
              alt="Case Study - متجر إلكتروني"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent lg:bg-gradient-to-l" />
            
            {/* Stats Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3 lg:hidden">
              <div className="glass-card py-2 px-4">
                <div className="flex items-center gap-2 text-secondary">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-bold">+150%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="p-8 lg:p-10 flex flex-col justify-center">
            <span className="text-primary text-sm font-medium mb-2">متجر إلكتروني للأزياء</span>
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              زيادة المبيعات بنسبة 150% خلال 3 أشهر
            </h3>
            
            {/* Challenge */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-foreground mb-2">التحدي:</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                متجر إلكتروني يعاني من ضعف المبيعات وتجربة مستخدم سيئة مع معدل ارتداد مرتفع يصل إلى 70%
              </p>
            </div>

            {/* Solution */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-foreground mb-2">الحل:</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                أعدنا تصميم المتجر بالكامل مع تحسين تجربة المستخدم وإطلاق حملات تسويقية مستهدفة
              </p>
            </div>

            {/* Results */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <TrendingUp className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">+150%</div>
                <div className="text-xs text-muted-foreground">زيادة المبيعات</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">+80%</div>
                <div className="text-xs text-muted-foreground">عملاء جدد</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <Eye className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">-45%</div>
                <div className="text-xs text-muted-foreground">معدل الارتداد</div>
              </div>
            </div>

            {/* Client Quote */}
            <blockquote className="border-r-4 border-primary pr-4 mb-8">
              <p className="text-muted-foreground text-sm italic mb-2">
                "فريق B.CLICK غيّر مسار متجرنا بالكامل. النتائج فاقت كل توقعاتنا!"
              </p>
              <cite className="text-foreground text-sm font-medium not-italic">
                - أحمد محمود، مؤسس Fashion Store
              </cite>
            </blockquote>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link to="/portfolio" className="btn-primary">
                شاهد المزيد من أعمالنا
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link to="/request" className="btn-ghost">
                هل تريد نتائج مشابهة؟
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturedProject;
