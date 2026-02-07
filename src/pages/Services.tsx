import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Smartphone, 
  Palette, 
  Megaphone, 
  Search, 
  PenTool,
  ShoppingCart,
  BarChart3,
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import TiltCard from '@/components/ui/TiltCard';
import MagneticButton from '@/components/ui/MagneticButton';
import SEO from '@/components/SEO';

const services = [
  {
    icon: Code2,
    title: 'تطوير المواقع',
    description: 'نصمم ونطور مواقع ويب احترافية سريعة ومتجاوبة مع جميع الأجهزة باستخدام أحدث التقنيات.',
    features: ['تصميم متجاوب', 'سرعة عالية', 'SEO محسّن', 'لوحة تحكم'],
    price: '5,000',
    color: 'primary',
  },
  {
    icon: Smartphone,
    title: 'تطوير التطبيقات',
    description: 'تطبيقات موبايل متكاملة لأندرويد و iOS بتجربة مستخدم سلسة وأداء عالي.',
    features: ['أندرويد و iOS', 'واجهة مميزة', 'أداء سريع', 'إشعارات ذكية'],
    price: '15,000',
    color: 'secondary',
  },
  {
    icon: Palette,
    title: 'تصميم الهوية البصرية',
    description: 'نبتكر هويات بصرية مميزة تعكس قوة علامتك التجارية وتترك انطباعًا لا يُنسى.',
    features: ['شعارات احترافية', 'ألوان وخطوط', 'مطبوعات', 'دليل الهوية'],
    price: '3,000',
    color: 'primary',
  },
  {
    icon: Megaphone,
    title: 'التسويق الرقمي',
    description: 'حملات إعلانية فعّالة على جميع المنصات لزيادة وصولك وتحقيق أهدافك.',
    features: ['إعلانات مدفوعة', 'سوشيال ميديا', 'استراتيجية محتوى', 'تحليل البيانات'],
    price: '2,000',
    color: 'secondary',
  },
  {
    icon: Search,
    title: 'تحسين محركات البحث',
    description: 'نجعل موقعك يتصدر نتائج البحث ويصل للعملاء المحتملين بشكل طبيعي.',
    features: ['كلمات مفتاحية', 'تحسين المحتوى', 'روابط خارجية', 'تقارير شهرية'],
    price: '1,500',
    color: 'primary',
  },
  {
    icon: PenTool,
    title: 'إدارة المحتوى',
    description: 'محتوى إبداعي يجذب جمهورك ويحقق أهدافك التسويقية.',
    features: ['كتابة المحتوى', 'تصميم المنشورات', 'جدولة النشر', 'إدارة التفاعل'],
    price: '2,500',
    color: 'secondary',
  },
  {
    icon: ShoppingCart,
    title: 'المتاجر الإلكترونية',
    description: 'متاجر إلكترونية متكاملة مع بوابات دفع آمنة وإدارة سهلة للمنتجات.',
    features: ['تصميم جذاب', 'دفع آمن', 'إدارة المخزون', 'تقارير المبيعات'],
    price: '8,000',
    color: 'primary',
  },
  {
    icon: BarChart3,
    title: 'التحليلات والتقارير',
    description: 'تحليلات شاملة لأداء حملاتك ومواقعك مع تقارير مفصلة واقتراحات للتحسين.',
    features: ['تحليل البيانات', 'تقارير دورية', 'مقترحات التحسين', 'متابعة الأداء'],
    price: '1,000',
    color: 'secondary',
  },
];

const ServicesPage = () => {
  return (
    <Layout>
      <SEO 
        title="خدماتنا"
        description="نقدم مجموعة متكاملة من الخدمات الرقمية: تطوير المواقع، تطوير التطبيقات، تصميم الهوية البصرية، التسويق الرقمي، وتحسين محركات البحث."
        keywords="خدمات رقمية, تصميم مواقع, تطوير تطبيقات, تسويق رقمي, SEO, هوية بصرية"
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-secondary/20 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              خدماتنا
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hero-title mb-6"
            >
              كل ما تحتاجه <span className="text-gradient">تحت سقف واحد</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-subtitle"
            >
              نقدم مجموعة متكاملة من الخدمات الرقمية لتلبية جميع احتياجات أعمالك
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-container">
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TiltCard className="h-full">
                <div className="service-card h-full card-hover-glow">
                  <div className="flex items-start gap-5">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 ${
                      service.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
                    }`}>
                      <service.icon className={`w-8 h-8 ${
                        service.color === 'primary' ? 'text-primary' : 'text-secondary'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                        <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                          service.color === 'primary' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-secondary/10 text-secondary'
                        }`}>
                          من {service.price} ج.م
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {service.features.map((feature, i) => (
                          <motion.div 
                            key={feature} 
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + i * 0.05 }}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle2 className={`w-4 h-4 ${
                              service.color === 'primary' ? 'text-primary' : 'text-secondary'
                            }`} />
                            <span className="text-muted-foreground">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                      <Link 
                        to="/request" 
                        className={`inline-flex items-center gap-2 text-sm font-medium transition-all hover:gap-3 ${
                          service.color === 'primary' ? 'text-primary' : 'text-secondary'
                        }`}
                      >
                        اطلب هذه الخدمة
                        <ArrowLeft className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Package Comparison - NEW */}
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
            <MagneticButton>
              <Link to="/request" className="btn-secondary flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                احصل على استشارة مجانية
              </Link>
            </MagneticButton>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
