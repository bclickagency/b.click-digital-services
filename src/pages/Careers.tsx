import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase, Users, Zap, Heart, Coffee, Laptop } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const jobs = [
  {
    id: 1,
    title: 'مصمم UI/UX',
    type: 'دوام كامل',
    location: 'عن بُعد',
    department: 'التصميم',
    description: 'نبحث عن مصمم UI/UX موهوب لإنشاء تجارب مستخدم استثنائية لمشاريعنا المتنوعة.',
  },
  {
    id: 2,
    title: 'مطور Full Stack',
    type: 'دوام كامل',
    location: 'عن بُعد',
    department: 'التطوير',
    description: 'نبحث عن مطور Full Stack متمرس للعمل على مشاريع ويب متقدمة باستخدام React و Node.js.',
  },
  {
    id: 3,
    title: 'أخصائي تسويق رقمي',
    type: 'دوام كامل',
    location: 'عن بُعد',
    department: 'التسويق',
    description: 'نبحث عن أخصائي تسويق رقمي لإدارة حملات العملاء وتحقيق نتائج مميزة.',
  },
  {
    id: 4,
    title: 'مدير مشاريع',
    type: 'دوام جزئي',
    location: 'عن بُعد',
    department: 'الإدارة',
    description: 'نبحث عن مدير مشاريع لتنسيق العمل بين الفرق وضمان تسليم المشاريع في الوقت المحدد.',
  },
];

const benefits = [
  {
    icon: Laptop,
    title: 'العمل عن بُعد',
    description: 'اعمل من أي مكان في العالم بمرونة كاملة',
  },
  {
    icon: Clock,
    title: 'ساعات مرنة',
    description: 'نظم وقتك بما يناسب حياتك الشخصية',
  },
  {
    icon: Zap,
    title: 'نمو مهني',
    description: 'فرص تدريب وتطوير مستمرة',
  },
  {
    icon: Users,
    title: 'فريق متميز',
    description: 'اعمل مع أفضل المواهب في المجال',
  },
  {
    icon: Heart,
    title: 'بيئة صحية',
    description: 'نهتم بصحتك النفسية والجسدية',
  },
  {
    icon: Coffee,
    title: 'ثقافة إيجابية',
    description: 'بيئة عمل ممتعة ومحفزة',
  },
];

const CareersPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
              انضم لفريقنا
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              نبحث عن مواهب استثنائية للانضمام لفريقنا المتميز. إذا كنت شغوفًا بالإبداع والتكنولوجيا، فنحن نريدك معنا!
            </p>
            <a href="#jobs" className="btn-primary inline-flex items-center gap-2">
              استعرض الوظائف المتاحة
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              لماذا تنضم إلينا؟
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نقدم بيئة عمل محفزة ومزايا تنافسية لمساعدتك على النمو والتطور
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Jobs */}
      <section id="jobs" className="section-padding">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              الوظائف المتاحة
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              اختر الوظيفة التي تناسب مهاراتك وطموحاتك
            </p>
          </motion.div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {job.title}
                      </h3>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">
                        {job.department}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/contact"
                    className="btn-primary text-sm whitespace-nowrap"
                  >
                    تقدم الآن
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {jobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground text-lg">
                لا توجد وظائف متاحة حالياً. تابعنا للحصول على التحديثات!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              لم تجد الوظيفة المناسبة؟
            </h2>
            <p className="text-muted-foreground mb-6">
              أرسل لنا سيرتك الذاتية وسنتواصل معك عند توفر فرصة مناسبة
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              تواصل معنا
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default CareersPage;
