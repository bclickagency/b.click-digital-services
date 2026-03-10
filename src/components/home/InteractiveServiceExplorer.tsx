import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Code2, Smartphone, Palette, Megaphone, Search, PenTool,
  ArrowLeft, CheckCircle2
} from 'lucide-react';

const services = [
  {
    icon: Code2,
    title: 'تطوير المواقع',
    slug: 'web-development',
    description: 'مواقع احترافية سريعة ومتجاوبة مع جميع الأجهزة',
    features: ['تصميم متجاوب', 'سرعة تحميل عالية', 'تحسين SEO', 'لوحة تحكم'],
    result: 'زيادة الزيارات بنسبة 200%',
  },
  {
    icon: Smartphone,
    title: 'تطوير التطبيقات',
    slug: 'mobile-apps',
    description: 'تطبيقات موبايل متكاملة لأندرويد و iOS',
    features: ['تطبيقات أصلية', 'تجربة مستخدم سلسة', 'إشعارات ذكية', 'دعم متعدد اللغات'],
    result: 'زيادة التفاعل بنسبة 180%',
  },
  {
    icon: Palette,
    title: 'الهوية البصرية',
    slug: 'branding',
    description: 'شعارات وهويات بصرية تعكس قوة علامتك التجارية',
    features: ['تصميم الشعار', 'دليل الهوية', 'مطبوعات', 'قوالب سوشيال'],
    result: 'تعزيز التعرف على العلامة التجارية',
  },
  {
    icon: Megaphone,
    title: 'التسويق الرقمي',
    slug: 'digital-marketing',
    description: 'حملات إعلانية فعّالة على جميع المنصات',
    features: ['إعلانات مدفوعة', 'إدارة سوشيال', 'تسويق بالمحتوى', 'تحليل البيانات'],
    result: 'زيادة المبيعات بنسبة 150%',
  },
  {
    icon: Search,
    title: 'تحسين محركات البحث',
    slug: 'seo',
    description: 'نجعل موقعك يتصدر نتائج البحث',
    features: ['تحليل الكلمات المفتاحية', 'تحسين المحتوى', 'بناء الروابط', 'تقارير شهرية'],
    result: 'الصفحة الأولى في Google',
  },
  {
    icon: PenTool,
    title: 'إدارة المحتوى',
    slug: 'content-management',
    description: 'محتوى إبداعي يجذب جمهورك ويحقق أهدافك',
    features: ['كتابة محتوى', 'تصميم منشورات', 'جدولة النشر', 'تقارير الأداء'],
    result: 'زيادة التفاعل بنسبة 250%',
  },
];

const InteractiveServiceExplorer = () => {
  const [active, setActive] = useState(0);
  const service = services[active];

  return (
    <section className="section-container">
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          🧭 استكشف خدماتنا
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="section-title"
        >
          كل ما تحتاجه <span className="text-primary">تحت سقف واحد</span>
        </motion.h2>
      </div>

      <div className="grid lg:grid-cols-[280px,1fr] gap-6">
        {/* Service tabs */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">
          {services.map((s, i) => (
            <button
              key={s.slug}
              onClick={() => setActive(i)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-right whitespace-nowrap transition-all duration-200 min-w-fit ${
                active === i
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'glass hover:bg-muted/50 text-foreground'
              }`}
            >
              <s.icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-semibold">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Service detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={service.slug}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {service.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            {/* Result badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6">
              📈 {service.result}
            </div>

            <div className="flex gap-3">
              <Link to={`/services/${service.slug}`} className="btn-primary text-sm">
                تفاصيل الخدمة
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link to="/request" className="btn-secondary text-sm">
                اطلب الآن
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default InteractiveServiceExplorer;
