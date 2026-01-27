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
  ArrowLeft
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import TiltCard from '@/components/ui/TiltCard';
import MagneticButton from '@/components/ui/MagneticButton';

const services = [
  {
    icon: Code2,
    title: 'تطوير المواقع',
    description: 'نصمم ونطور مواقع ويب احترافية سريعة ومتجاوبة مع جميع الأجهزة باستخدام أحدث التقنيات.',
    features: ['تصميم متجاوب', 'سرعة عالية', 'SEO محسّن', 'لوحة تحكم'],
    color: 'primary',
  },
  {
    icon: Smartphone,
    title: 'تطوير التطبيقات',
    description: 'تطبيقات موبايل متكاملة لأندرويد و iOS بتجربة مستخدم سلسة وأداء عالي.',
    features: ['أندرويد و iOS', 'واجهة مميزة', 'أداء سريع', 'إشعارات ذكية'],
    color: 'secondary',
  },
  {
    icon: Palette,
    title: 'تصميم الهوية البصرية',
    description: 'نبتكر هويات بصرية مميزة تعكس قوة علامتك التجارية وتترك انطباعًا لا يُنسى.',
    features: ['شعارات احترافية', 'ألوان وخطوط', 'مطبوعات', 'دليل الهوية'],
    color: 'primary',
  },
  {
    icon: Megaphone,
    title: 'التسويق الرقمي',
    description: 'حملات إعلانية فعّالة على جميع المنصات لزيادة وصولك وتحقيق أهدافك.',
    features: ['إعلانات مدفوعة', 'سوشيال ميديا', 'استراتيجية محتوى', 'تحليل البيانات'],
    color: 'secondary',
  },
  {
    icon: Search,
    title: 'تحسين محركات البحث',
    description: 'نجعل موقعك يتصدر نتائج البحث ويصل للعملاء المحتملين بشكل طبيعي.',
    features: ['كلمات مفتاحية', 'تحسين المحتوى', 'روابط خارجية', 'تقارير شهرية'],
    color: 'primary',
  },
  {
    icon: PenTool,
    title: 'إدارة المحتوى',
    description: 'محتوى إبداعي يجذب جمهورك ويحقق أهدافك التسويقية.',
    features: ['كتابة المحتوى', 'تصميم المنشورات', 'جدولة النشر', 'إدارة التفاعل'],
    color: 'secondary',
  },
  {
    icon: ShoppingCart,
    title: 'المتاجر الإلكترونية',
    description: 'متاجر إلكترونية متكاملة مع بوابات دفع آمنة وإدارة سهلة للمنتجات.',
    features: ['تصميم جذاب', 'دفع آمن', 'إدارة المخزون', 'تقارير المبيعات'],
    color: 'primary',
  },
  {
    icon: BarChart3,
    title: 'التحليلات والتقارير',
    description: 'تحليلات شاملة لأداء حملاتك ومواقعك مع تقارير مفصلة واقتراحات للتحسين.',
    features: ['تحليل البيانات', 'تقارير دورية', 'مقترحات التحسين', 'متابعة الأداء'],
    color: 'secondary',
  },
];

const ServicesPage = () => {
  return (
    <Layout>
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
              حلول رقمية <span className="text-gradient">شاملة</span>
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
                      <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                      <div className="grid grid-cols-2 gap-2">
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
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
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
            <h2 className="section-title mb-4">محتاج خدمة معينة؟</h2>
            <p className="section-subtitle mx-auto mb-8">
              أخبرنا عن احتياجاتك وسنساعدك في اختيار الخدمة المناسبة
            </p>
            <MagneticButton>
              <Link to="/request" className="btn-secondary flex items-center gap-2">
                اطلب خدمتك الآن
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </MagneticButton>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
