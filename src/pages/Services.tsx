import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import ServiceQuiz from '@/components/marketing/ServiceQuiz';
import PageHero from '@/components/layout/PageHero';
import { servicesData } from '@/data/services';

const ServicesPage = () => {
  return (
    <Layout>
      <SEO 
        title="خدماتنا"
        description="نقدم مجموعة متكاملة من الخدمات الرقمية: تطوير المواقع، تطوير التطبيقات، تصميم الهوية البصرية، التسويق الرقمي، وتحسين محركات البحث."
        keywords="خدمات رقمية, تصميم مواقع, تطوير تطبيقات, تسويق رقمي, SEO, هوية بصرية"
      />
      
      <PageHero
        badge="خدماتنا"
        title="كل ما تحتاجه"
        highlight="تحت سقف واحد"
        subtitle="نقدم مجموعة متكاملة من الخدمات الرقمية لتلبية جميع احتياجات أعمالك"
      />

      {/* Services Grid */}
      <section className="section-container">
        <div className="grid md:grid-cols-2 gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/services/${service.slug}`} className="block h-full">
                  <div className="service-card h-full card-hover-glow group">
                    <div className="flex items-start gap-5">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 ${
                        index % 2 === 0 ? 'bg-primary/10' : 'bg-secondary/10'
                      }`}>
                        <service.icon className={`w-8 h-8 ${
                          index % 2 === 0 ? 'text-primary' : 'text-secondary'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                          <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                            index % 2 === 0
                              ? 'bg-primary/10 text-primary' 
                              : 'bg-secondary/10 text-secondary'
                          }`}>
                            من {service.price} ج.م
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {service.features.slice(0, 4).map((feature, i) => (
                            <motion.div 
                              key={feature.title} 
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + i * 0.05 }}
                              className="flex items-center gap-2 text-sm"
                            >
                              <CheckCircle2 className={`w-4 h-4 ${
                                index % 2 === 0 ? 'text-primary' : 'text-secondary'
                              }`} />
                              <span className="text-muted-foreground">{feature.title}</span>
                            </motion.div>
                          ))}
                        </div>
                        <span 
                          className={`inline-flex items-center gap-2 text-sm font-medium transition-all hover:gap-3 ${
                            index % 2 === 0 ? 'text-primary' : 'text-secondary'
                          }`}
                        >
                          تفاصيل الخدمة
                          <ArrowLeft className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Service Quiz - NEW */}
      <ServiceQuiz />

      {/* Package Comparison */}
      <section className="section-container bg-muted/30">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-xl bg-secondary/10 text-secondary text-sm font-medium mb-4"
          >
            الباقات
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title"
          >
            اختر الباقة <span className="text-gradient">المناسبة لك</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Basic */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card text-center"
          >
            <h3 className="text-xl font-bold text-foreground mb-2">الباقة الأساسية</h3>
            <div className="text-3xl font-bold text-primary mb-4">5,000 ج.م</div>
            <ul className="space-y-3 text-sm text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                موقع تعريفي (5 صفحات)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                تصميم متجاوب
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                دعم 30 يوم
              </li>
            </ul>
            <Link to="/request" className="btn-ghost w-full">
              اطلب الآن
            </Link>
          </motion.div>

          {/* Pro - Highlighted */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card text-center border-2 border-secondary relative"
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full">
              الأكثر طلبًا
            </span>
            <h3 className="text-xl font-bold text-foreground mb-2">الباقة الاحترافية</h3>
            <div className="text-3xl font-bold text-secondary mb-4">12,000 ج.م</div>
            <ul className="space-y-3 text-sm text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                موقع متكامل + مدونة
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                لوحة تحكم كاملة
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                تحسين SEO
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                دعم 90 يوم
              </li>
            </ul>
            <Link to="/request" className="btn-secondary w-full">
              اطلب الآن
            </Link>
          </motion.div>

          {/* Enterprise */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card text-center"
          >
            <h3 className="text-xl font-bold text-foreground mb-2">باقة الشركات</h3>
            <div className="text-3xl font-bold text-primary mb-4">حسب الطلب</div>
            <ul className="space-y-3 text-sm text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                حلول مخصصة بالكامل
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                فريق دعم مخصص
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                صيانة مستمرة
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                استشارات استراتيجية
              </li>
            </ul>
            <Link to="/contact" className="btn-ghost w-full">
              تواصل معنا
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card text-center py-12 px-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
          <div className="relative z-10">
            <h2 className="section-title mb-4">مش متأكد من الخدمة المناسبة؟</h2>
            <p className="section-subtitle mx-auto mb-8">
              أخبرنا عن احتياجاتك وسنساعدك في اختيار الحل الأمثل
            </p>
             <Link to="/request" className="btn-secondary flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                احصل على استشارة مجانية
              </Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
